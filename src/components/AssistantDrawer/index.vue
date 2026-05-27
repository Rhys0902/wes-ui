<template>
  <div>
    <AssistantFloatingTrigger
      v-if="assistantStore.assistantEnabled"
      @open="assistantStore.openDrawer"
      @ask="sendSuggestion"
    />

    <el-drawer
      v-if="assistantStore.assistantEnabled"
      v-model="assistantStore.drawerOpen"
      direction="rtl"
      size="min(1080px, calc(100vw - 72px))"
      class="assistant-drawer"
      :with-header="false"
    >
      <section class="assistant-shell">
        <AssistantSidebar v-if="sidebarVisible" :store="assistantStore" />

        <main class="assistant-main">
          <header class="assistant-topbar">
            <div class="topbar-left">
              <button class="icon-button" type="button" aria-label="折叠会话栏" @click="sidebarVisible = !sidebarVisible">
                <el-icon><Fold v-if="sidebarVisible" /><Expand v-else /></el-icon>
              </button>
              <AssistantModelSwitcher
                :active-model="assistantStore.activeModel"
                :models="assistantStore.modelOptions"
                @select="assistantStore.setActiveModel"
              />
              <AssistantModeSwitcher
                :value="assistantStore.assistantMode"
                :modes="assistantStore.assistantModeOptions"
                @select="assistantStore.setAssistantMode"
              />
            </div>
            <div class="topbar-actions">
              <div v-if="conversationSearchVisible" class="conversation-search">
                <input
                  ref="conversationSearchRef"
                  v-model="conversationKeyword"
                  placeholder="搜索当前对话"
                  @keyup.enter="goNextMatch"
                  @keydown.esc="closeConversationSearch"
                />
                <span class="search-count">{{ searchCountText }}</span>
                <button class="mini-button" type="button" aria-label="上一个匹配" @click="goPreviousMatch">
                  <el-icon><Top /></el-icon>
                </button>
                <button class="mini-button" type="button" aria-label="下一个匹配" @click="goNextMatch">
                  <el-icon><Bottom /></el-icon>
                </button>
              </div>
              <button class="icon-button" type="button" aria-label="搜索当前对话" @click="toggleConversationSearch">
                <el-icon><Search /></el-icon>
              </button>
              <button class="icon-button" type="button" aria-label="设置">
                <el-icon><Setting /></el-icon>
              </button>
              <button class="icon-button close-action" type="button" aria-label="关闭" @click="assistantStore.closeDrawer">
                <el-icon><Close /></el-icon>
              </button>
            </div>
          </header>

          <div ref="messageWrapRef" class="conversation" @scroll="handleConversationScroll">
            <AssistantWelcome
              v-if="assistantStore.messages.length === 0"
              @send="sendSuggestion"
            />
            <div v-else class="message-list">
              <button
                v-if="hiddenMessageCount > 0"
                type="button"
                class="history-window-tip"
                @click="loadMoreHistory"
              >
                查看更早 {{ hiddenMessageCount }} 条消息
              </button>
              <div
                v-for="message in renderedMessages"
                :key="message.id"
                class="message-anchor"
                :data-message-id="message.id"
              >
                <AssistantMessageBubble
                  :message="message"
                  :search-keyword="conversationKeyword"
                  :active-search="message.id === activeSearchMessageId"
                />
              </div>
            </div>
          </div>

          <AssistantComposer
            v-model="inputText"
            :loading="assistantStore.inputLoading"
            :streaming="!!assistantStore.streamingMessageId"
            @send="handleSend"
            @stop="assistantStore.stop"
          />
        </main>
      </section>
    </el-drawer>
  </div>
</template>

<script setup>
import useAssistantStore from '@/store/modules/assistant'
import AssistantSidebar from './AssistantSidebar.vue'
import AssistantWelcome from './AssistantWelcome.vue'
import AssistantMessageBubble from './AssistantMessageBubble.vue'
import AssistantComposer from './AssistantComposer.vue'
import AssistantModelSwitcher from './AssistantModelSwitcher.vue'
import AssistantModeSwitcher from './AssistantModeSwitcher.vue'
import AssistantFloatingTrigger from './AssistantFloatingTrigger.vue'

const assistantStore = useAssistantStore()
const sidebarVisible = ref(true)
const inputText = ref('')
const messageWrapRef = ref(null)
const conversationSearchVisible = ref(false)
const conversationKeyword = ref('')
const activeMatchIndex = ref(0)
const conversationSearchRef = ref(null)
const MESSAGE_WINDOW_SIZE = 80
const MESSAGE_WINDOW_STEP = 40
const visibleMessageLimit = ref(MESSAGE_WINDOW_SIZE)

onMounted(() => {
  assistantStore.loadAssistantEnabled()
})

// 当前对话搜索只检索已加载消息内容，不请求后端，保证打开搜索时即时反馈。
const searchMatches = computed(() => {
  const keyword = conversationKeyword.value.trim().toLowerCase()
  if (!keyword) {
    return []
  }
  return assistantStore.messages.filter(item => String(item.content || '').toLowerCase().includes(keyword))
})
const activeSearchMessageId = computed(() => searchMatches.value[activeMatchIndex.value]?.id)
const isSearchingConversation = computed(() => !!conversationKeyword.value.trim())
const renderedMessages = computed(() => {
  const messages = assistantStore.messages
  if (isSearchingConversation.value || messages.length <= visibleMessageLimit.value) {
    return messages
  }
  return messages.slice(messages.length - visibleMessageLimit.value)
})
const hiddenMessageCount = computed(() => Math.max(assistantStore.messages.length - renderedMessages.value.length, 0))
const searchCountText = computed(() => {
  if (!conversationKeyword.value.trim()) {
    return ''
  }
  if (searchMatches.value.length === 0) {
    return '0/0'
  }
  return `${activeMatchIndex.value + 1}/${searchMatches.value.length}`
})

// 主发送入口：先清空输入框制造即时反馈，再交给store完成SSE发送链路。
async function handleSend() {
  const text = inputText.value
  inputText.value = ''
  await assistantStore.send(text)
  nextTick(scrollToBottom)
}

// 推荐问题复用正常发送流程，避免快捷入口和手动输入产生两套行为。
function sendSuggestion(text) {
  inputText.value = text
  if (!assistantStore.drawerOpen) {
    assistantStore.openDrawer()
  }
  handleSend()
}

// 顶部搜索按钮控制当前对话搜索条；展开后自动聚焦输入框。
function toggleConversationSearch() {
  conversationSearchVisible.value = !conversationSearchVisible.value
  if (conversationSearchVisible.value) {
    nextTick(() => conversationSearchRef.value?.focus())
  } else {
    closeConversationSearch()
  }
}

// 关闭搜索时清理关键字和命中索引，避免下次打开沿用旧命中位置。
function closeConversationSearch() {
  conversationSearchVisible.value = false
  conversationKeyword.value = ''
  activeMatchIndex.value = 0
}

// 根据当前命中的messageId滚动到消息节点，搜索结果变化后会复用这个方法。
function scrollToMatch() {
  const messageId = activeSearchMessageId.value
  if (!messageId || !messageWrapRef.value) {
    return
  }
  const target = messageWrapRef.value.querySelector(`[data-message-id="${messageId}"]`)
  target?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

// 跳转到上一条命中消息，索引采用循环方式，方便用户连续浏览。
function goPreviousMatch() {
  if (searchMatches.value.length === 0) {
    return
  }
  activeMatchIndex.value = (activeMatchIndex.value - 1 + searchMatches.value.length) % searchMatches.value.length
  nextTick(scrollToMatch)
}

// 跳转到下一条命中消息，索引采用循环方式，最后一条后回到第一条。
function goNextMatch() {
  if (searchMatches.value.length === 0) {
    return
  }
  activeMatchIndex.value = (activeMatchIndex.value + 1) % searchMatches.value.length
  nextTick(scrollToMatch)
}

// 对话区统一滚动到底部，用于发送后、SSE结束后和首次加载消息后。
function scrollToBottom() {
  if (messageWrapRef.value) {
    messageWrapRef.value.scrollTop = messageWrapRef.value.scrollHeight
  }
}

// 长会话默认只挂载最近消息；向上查看时再扩展历史窗口，控制DOM数量和历史Markdown重渲染成本。
function loadMoreHistory() {
  if (hiddenMessageCount.value <= 0) {
    return
  }
  const wrap = messageWrapRef.value
  const previousHeight = wrap?.scrollHeight || 0
  const previousTop = wrap?.scrollTop || 0
  visibleMessageLimit.value = Math.min(
    assistantStore.messages.length,
    visibleMessageLimit.value + MESSAGE_WINDOW_STEP
  )
  nextTick(() => {
    if (wrap) {
      wrap.scrollTop = previousTop + wrap.scrollHeight - previousHeight
    }
  })
}

function handleConversationScroll() {
  if (conversationKeyword.value.trim()) {
    return
  }
  const wrap = messageWrapRef.value
  if (wrap && wrap.scrollTop < 80) {
    loadMoreHistory()
  }
}

let scrollFrame
function scheduleScrollToBottom() {
  if (scrollFrame) {
    return
  }
  const run = () => {
    scrollFrame = undefined
    scrollToBottom()
  }
  scrollFrame = window.requestAnimationFrame ? window.requestAnimationFrame(run) : window.setTimeout(run, 50)
}

watch(
  () => {
    const lastMessage = assistantStore.messages[assistantStore.messages.length - 1]
    return [
      assistantStore.messages.length,
      assistantStore.streamingMessageId,
      lastMessage?.status,
      lastMessage?.content?.length
    ].join('|')
  },
  () => nextTick(scheduleScrollToBottom)
)

watch(
  () => assistantStore.activeSessionId,
  () => {
    visibleMessageLimit.value = MESSAGE_WINDOW_SIZE
  }
)

onBeforeUnmount(() => {
  if (!scrollFrame) {
    return
  }
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(scrollFrame)
  }
  window.clearTimeout(scrollFrame)
})

watch(conversationKeyword, () => {
  activeMatchIndex.value = 0
  nextTick(scrollToMatch)
})
</script>

<style scoped lang="scss">
:deep(.assistant-drawer) {
  background: transparent;
  box-shadow: none;

  .el-drawer__body {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 0 18px 24px 0;
    overflow: hidden;
  }
}

.assistant-shell {
  display: flex;
  width: min(1080px, calc(100vw - 96px));
  height: min(760px, calc(100vh - 48px));
  margin-left: auto;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 25px 50px -12px rgba(202, 213, 226, 0.4);
}

.assistant-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.assistant-topbar {
  height: 48px;
  flex: 0 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid #e2e8f0;
}

.topbar-left,
.topbar-actions,
.model-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.conversation-search {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 6px 0 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;

  input {
    width: 160px;
    border: 0;
    outline: none;
    background: transparent;
    color: #314158;
    font-size: 12.5px;
  }
}

.search-count {
  min-width: 32px;
  color: #94a3b8;
  font-size: 11px;
  text-align: center;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  cursor: pointer;
}

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: transparent;
  color: #64748b;

  &:hover {
    background: #f1f5f9;
    color: #334155;
  }
}

.mini-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
    color: #7c3aed;
  }
}

.model-name {
  color: #1d293d;
  font-size: 13.5px;
}

.model-star {
  color: #f59e0b;
}

.conversation {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.message-list {
  max-width: 768px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 32px 32px;
}

.history-window-tip {
  display: block;
  width: 100%;
  margin: 0 0 16px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    border-color: #c4b5fd;
    color: #7c3aed;
  }
}

@media (max-width: 900px) {
  :deep(.assistant-drawer .el-drawer__body) {
    padding: 0;
  }

  .assistant-shell {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }

  .close-action {
    display: inline-flex;
  }

  .message-list {
    padding: 32px 18px;
  }
}
</style>
