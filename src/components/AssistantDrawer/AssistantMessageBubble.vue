<template>
  <div v-if="isUser" class="message-row is-user">
    <div class="user-message" :class="{ active: activeSearch }">
      <div class="message-time">{{ messageTime }}</div>
      <div class="user-bubble" v-html="plainTextHtml"></div>
    </div>
  </div>

  <div v-else class="message-row is-assistant">
    <LingxiLogo :size="32" mark />
    <div class="assistant-content" :class="{ active: activeSearch }">
      <div class="message-time">{{ messageMeta }}</div>
      <AssistantThinkingBlock
        v-for="(block, index) in thinkingBlocks"
        :key="`${message.id || 'thinking'}-${index}`"
        :block="block"
        @stop="assistantStore.stop"
      />
      <AssistantToolBlock
        v-for="(block, index) in toolBlocks"
        :key="`${message.id || 'tool'}-${index}`"
        :block="block"
      />
      <div v-if="message.content" class="assistant-text" v-html="markdownHtml"></div>
      <span v-if="isStreaming && message.content" class="stream-cursor"></span>
      <AssistantSourcesPanel :sources="message.sources || []" />
      <div v-if="showThinking" class="thinking-card">
        <div class="thinking-dot">...</div>
        <div class="thinking-label">正在思考...</div>
      </div>
      <div v-if="message.status === 'STOPPED'" class="message-status">已停止</div>
      <div v-if="message.status === 'FAILED'" class="message-error">
        {{ message.errorMessage || '响应失败' }}
      </div>
      <div v-if="showActions" class="message-actions">
        <button type="button" @click="copyContent">
          <el-icon><CopyDocument /></el-icon>
          复制
        </button>
        <button type="button" @click="assistantStore.regenerate(message)">
          <el-icon><Refresh /></el-icon>
          重新生成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import useAssistantStore from '@/store/modules/assistant'
import { formatAssistantTime } from '@/store/modules/assistantHelpers'
import LingxiLogo from './LingxiLogo.vue'
import AssistantSourcesPanel from './AssistantSourcesPanel.vue'
import AssistantThinkingBlock from './AssistantThinkingBlock.vue'
import AssistantToolBlock from './AssistantToolBlock.vue'

const MARKDOWN_CACHE_LIMIT = 160
const markdownHtmlCache = new Map()

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  searchKeyword: {
    type: String,
    default: ''
  },
  activeSearch: {
    type: Boolean,
    default: false
  }
})

const assistantStore = useAssistantStore()
const isUser = computed(() => props.message.role === 'USER')
const isStreaming = computed(() => ['SENDING', 'STREAMING'].includes(props.message.status))
// thinking块来自后端blocksJson或本地占位，只展示给用户看的进度摘要。
const thinkingBlocks = computed(() => (props.message.blocks || []).filter(item => item.type === 'thinking'))
const toolBlocks = computed(() => (props.message.blocks || []).filter(item => item.type === 'tool'))
const showThinking = computed(() => thinkingBlocks.value.length === 0 && !props.message.content && isStreaming.value)
const showActions = computed(() => !isUser.value && !isStreaming.value && !!props.message.content)
const messageTime = computed(() => formatAssistantTime(props.message.updateTime || props.message.createTime))
// 路由标签用于让用户区分回答来自通用AI还是WES业务链路。
const routeLabel = computed(() => {
  if (isUser.value) {
    return ''
  }
  if (props.message.routeType === 'WES_CHAT' || props.message.routeType === 'BUSINESS_QUERY') {
    return 'WES业务'
  }
  if (props.message.routeType === 'GENERAL_CHAT') {
    return '通用AI'
  }
  return ''
})
const messageMeta = computed(() => [messageTime.value, routeLabel.value].filter(Boolean).join(' · '))
const activeKeyword = computed(() => props.searchKeyword.trim())
const plainTextHtml = computed(() => formatPlainText(props.message.content))
const displayContent = ref(props.message.content || '')
const markdownHtml = computed(() => isStreaming.value
  ? formatPlainText(displayContent.value)
  : getCachedMarkdown(displayContent.value))

let displayTimer
let pendingDisplayContent = displayContent.value
const STREAM_PLAY_INTERVAL = 50
const STREAM_FAST_PLAY_INTERVAL = 30
const STREAM_MIN_CHARS_PER_TICK = 6
const STREAM_MAX_CHARS_PER_TICK = 96

// store保存完整实时内容；组件展示层按帧追赶，减少长回答时整段Markdown高频重算。
watch(
  () => props.message.content || '',
  content => {
    if (!isStreaming.value) {
      displayContent.value = content
      return
    }
    scheduleDisplayContent(content)
  },
  { immediate: true }
)

watch(isStreaming, streaming => {
  if (!streaming) {
    cancelDisplaySchedule()
    displayContent.value = props.message.content || ''
  }
})

onBeforeUnmount(() => {
  cancelDisplaySchedule()
})

// 流式输出只允许一个待刷新任务排队，任务执行时永远使用最新内容，避免高频分片造成渲染积压。
function scheduleDisplayContent(content) {
  pendingDisplayContent = content
  if (displayTimer) {
    return
  }
  queueDisplayFrame()
}

function queueDisplayFrame() {
  const flush = () => {
    displayTimer = undefined
    flushDisplayContent()
  }
  displayTimer = window.setTimeout(flush, getStreamDisplayDelay())
}

// 客户端平滑打字层：真实内容按SSE到达，视觉输出按帧追赶，避免大批分片一次性跳出。
function flushDisplayContent() {
  const current = displayContent.value || ''
  const target = pendingDisplayContent || ''
  if (!isStreaming.value || target.length <= current.length || !target.startsWith(current)) {
    displayContent.value = target
    return
  }
  const backlog = target.length - current.length
  const nextLength = Math.min(target.length, current.length + getStreamDisplayStep(backlog))
  displayContent.value = target.slice(0, nextLength)
  if (nextLength < target.length) {
    queueDisplayFrame()
  }
}

function getStreamDisplayDelay() {
  const backlog = (pendingDisplayContent || '').length - (displayContent.value || '').length
  return backlog > 500 ? STREAM_FAST_PLAY_INTERVAL : STREAM_PLAY_INTERVAL
}

function getStreamDisplayStep(backlog) {
  if (backlog > 800) {
    return STREAM_MAX_CHARS_PER_TICK
  }
  if (backlog > 400) {
    return 64
  }
  if (backlog > 160) {
    return 36
  }
  if (backlog > 64) {
    return 18
  }
  if (backlog > 24) {
    return 10
  }
  return STREAM_MIN_CHARS_PER_TICK
}

// 流式阶段只做纯文本渲染，避免每个分片都重复执行Markdown正则；完成后再恢复轻量Markdown。
function cancelDisplaySchedule() {
  if (displayTimer) {
    window.clearTimeout(displayTimer)
  }
  displayTimer = undefined
}

// 完成态Markdown按消息内容和搜索词缓存，长会话滚动或状态刷新时不重复格式化历史回答。
function getCachedMarkdown(text) {
  const cacheKey = [
    props.message.id || props.message.clientMessageId || 'message',
    activeKeyword.value,
    text.length,
    hashString(text)
  ].join('|')
  if (markdownHtmlCache.has(cacheKey)) {
    return markdownHtmlCache.get(cacheKey)
  }
  const html = formatMarkdown(text)
  markdownHtmlCache.set(cacheKey, html)
  if (markdownHtmlCache.size > MARKDOWN_CACHE_LIMIT) {
    markdownHtmlCache.delete(markdownHtmlCache.keys().next().value)
  }
  return html
}

function hashString(text) {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
  }
  return hash
}

// 所有富文本渲染前先转义HTML，避免模型输出或历史消息注入页面结构。
function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 当前对话搜索关键字会进入正则，必须先转义特殊字符再做高亮。
function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 在已经转义后的文本上做搜索命中标记，保持高亮和XSS防护同时生效。
function highlightEscapedText(text) {
  if (!activeKeyword.value) {
    return text
  }
  const keyword = escapeRegExp(escapeHtml(activeKeyword.value))
  return text.replace(new RegExp(`(${keyword})`, 'gi'), '<mark class="search-mark">$1</mark>')
}

// 用户消息按纯文本处理，只保留换行和搜索高亮，不解析Markdown语法。
function formatPlainText(text) {
  return highlightEscapedText(escapeHtml(text)).replace(/\n/g, '<br />')
}

// 助手消息支持轻量Markdown样式，覆盖粗体、行内代码、引用编号和换行。
function formatMarkdown(text) {
  return highlightEscapedText(escapeHtml(text))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(\d+)\]/g, '<span class="citation-chip">$1</span>')
    .replace(/\n/g, '<br />')
}

// 复制助手回答正文；空内容不提示，避免流式过程中误触产生错误反馈。
async function copyContent() {
  const text = props.message.content || ''
  if (!text) {
    return
  }
  await navigator.clipboard?.writeText(text)
  ElMessage.success('已复制')
}
</script>

<style scoped lang="scss">
.message-row {
  display: flex;
  margin-bottom: 16px;
}

.is-user {
  justify-content: flex-end;
}

.is-assistant {
  gap: 12px;
}

.user-bubble {
  max-width: 80%;
  padding: 10px 16px;
  border: 1px solid #ede9fe;
  border-radius: 16px 16px 4px 16px;
  background: #f5f3ff;
  color: #1d293d;
  font-size: 13.5px;
  line-height: 1.65;
  white-space: pre-wrap;
}

.user-message {
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  &.active {
    border-radius: 16px;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.18);
  }

  .user-bubble {
    max-width: 100%;
  }
}

.assistant-content {
  flex: 1;
  min-width: 0;
  color: #334155;
  font-size: 13.5px;
  line-height: 1.75;

  &.active {
    border-radius: 12px;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.18);
  }
}

.message-time {
  min-height: 18px;
  margin-bottom: 4px;
  color: #94a3b8;
  font-size: 11px;
  line-height: 18px;
}

.assistant-text {
  white-space: pre-wrap;
  word-break: break-word;

  :deep(strong) {
    color: #1d293d;
    font-weight: 700;
  }

  :deep(code) {
    padding: 1px 5px;
    border-radius: 4px;
    background: #f1f5f9;
    color: #6d28d9;
    font-size: 12.5px;
  }

  :deep(.citation-chip) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    margin: 0 2px;
    padding: 0 4px;
    border: 1px solid #ddd6fe;
    border-radius: 5px;
    background: #f5f3ff;
    color: #7c3aed;
    font-size: 10px;
    line-height: 1;
    vertical-align: middle;
  }

  :deep(.search-mark) {
    padding: 0 2px;
    border-radius: 3px;
    background: #fde68a;
    color: #1d293d;
  }
}

.user-bubble :deep(.search-mark) {
  padding: 0 2px;
  border-radius: 3px;
  background: #fde68a;
  color: #1d293d;
}

.stream-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  margin-left: 2px;
  background: #8b5cf6;
  animation: blink 1s steps(2, start) infinite;
}

.thinking-card {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  min-width: 204px;
  min-height: 120px;
  margin-top: 4px;
  padding: 22px 42px;
  border-radius: 18px;
  background: #f5f7fa;
  color: #8aa0bc;
}

.thinking-dot {
  margin-bottom: 18px;
  color: #1d293d;
  font-size: 22px;
  letter-spacing: 4px;
  line-height: 1;
}

.thinking-label,
.message-status,
.message-error {
  font-size: 13px;
}

.message-error {
  color: #ef4444;
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;

  button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 26px;
    padding: 0 8px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: #94a3b8;
    font-size: 11.5px;
    cursor: pointer;

    &:hover,
    &.active {
      border-color: #e2e8f0;
      background: #f8fafc;
      color: #7c3aed;
    }
  }
}

@keyframes blink {
  0%,
  45% {
    opacity: 1;
  }
  46%,
  100% {
    opacity: 0;
  }
}
</style>
