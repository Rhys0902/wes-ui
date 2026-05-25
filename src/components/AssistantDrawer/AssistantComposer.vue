<template>
  <footer class="composer">
    <div v-if="assistantStore.entities.length > 0" class="entity-list">
      <span
        v-for="entity in assistantStore.entities"
        :key="`${entity.kind}-${entity.id}`"
        :class="['entity-chip', `is-${entity.kind || 'default'}`]"
      >
        @{{ entity.label }}
        <button type="button" @click="assistantStore.removeEntity(entity)">×</button>
      </span>
    </div>

    <div class="composer-input">
      <textarea
        v-model="innerValue"
        rows="4"
        placeholder="问 AI 助手任何关于仓储作业的问题，输入 @ 提及仓库 / 物料 / 员工 / 订单"
        @keydown="onKeydown"
      ></textarea>
      <AssistantMentionPopover
        :open="mentionOpen"
        @pick="pickEntity"
      />
    </div>

    <div class="composer-bar">
      <div class="tool-list">
        <button class="tool-chip active" type="button" @click="fileInputRef?.click()">
          <el-icon><Paperclip /></el-icon>
          附件
        </button>
        <button :class="['tool-chip', { active: assistantStore.tools.web }]" type="button" @click="assistantStore.toggleTool('web')">
          <el-icon><Connection /></el-icon>
          联网
        </button>
        <button :class="['tool-chip', { active: assistantStore.tools.think }]" type="button" @click="assistantStore.toggleTool('think')">
          <el-icon><MagicStick /></el-icon>
          深度思考
        </button>
        <button :class="['tool-chip', { active: assistantStore.tools.knowledge }]" type="button" @click="assistantStore.toggleTool('knowledge')">
          <el-icon><Document /></el-icon>
          知识库
        </button>
        <button :class="['icon-action', { active: mentionOpen }]" type="button" aria-label="@ 提及" @click="mentionOpen = !mentionOpen">
          @
        </button>
      </div>

      <div class="action-list">
        <button class="icon-action" type="button" aria-label="语音输入">
          <el-icon><Microphone /></el-icon>
        </button>
        <button v-if="streaming" class="stop-button" type="button" aria-label="停止输出" @click="$emit('stop')">
          <span></span>
        </button>
        <button v-else class="send-button" type="button" :disabled="!canSend" aria-label="发送" @click="submit">
          <el-icon><Top /></el-icon>
        </button>
      </div>
    </div>
    <input ref="fileInputRef" class="file-input" type="file" multiple @change="handleFiles" />
  </footer>
</template>

<script setup>
import useAssistantStore from '@/store/modules/assistant'
import AssistantMentionPopover from './AssistantMentionPopover.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  streaming: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'send', 'stop'])
const assistantStore = useAssistantStore()
const mentionOpen = ref(false)
const fileInputRef = ref(null)

// 输入框使用v-model透传给父组件，组件内部只负责交互，不持久化消息内容。
const innerValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

// 发送按钮状态同时受文本、@实体和后端响应状态约束，防止空消息和重复发送。
const canSend = computed(() => (innerValue.value.trim() || assistantStore.entities.length > 0) && !props.loading)

watch(innerValue, value => {
  // 用户输入@时打开业务对象选择器，和当前仓储业务实体入口保持一致。
  if (value.endsWith('@')) {
    mentionOpen.value = true
  }
})

// 点击发送按钮时只抛出send事件，真正的发送、SSE和历史记录由store统一处理。
function submit() {
  if (canSend.value) {
    emit('send')
  }
}

// Enter发送、Shift+Enter换行，保持聊天工具的常见输入习惯。
function onKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    submit()
  }
}

// 选择业务对象后写入store实体池，并清理触发用的@字符，避免污染最终问题文本。
function pickEntity(entity) {
  assistantStore.addEntity(entity)
  mentionOpen.value = false
  if (innerValue.value.endsWith('@')) {
    innerValue.value = innerValue.value.slice(0, -1)
  }
}

// P0.5阶段附件先作为上下文实体占位，后续真正文件上传/知识库入库可复用同一入口。
function handleFiles(event) {
  const files = Array.from(event.target.files || [])
  files.forEach(file => {
    assistantStore.addEntity({
      kind: 'file',
      id: file.name,
      label: file.name
    })
  })
  event.target.value = ''
}

</script>

<style scoped lang="scss">
.composer {
  position: relative;
  flex: 0 0 156px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.composer-input {
  position: relative;
}

textarea {
  width: 100%;
  height: 105px;
  padding: 16px 16px 8px;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  color: #1d293d;
  font-size: 13.5px;
  line-height: 20.25px;
  font-family: inherit;

  &::placeholder {
    color: #90a1b9;
  }
}

.composer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 8px 8px;
}

.tool-list,
.action-list {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tool-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #62748e;
  font-size: 12px;
  cursor: pointer;

  &.active {
    border-color: #ddd6ff;
    background: #f5f3ff;
    color: #7008e7;
  }
}

.entity-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px 0;
}

.entity-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 220px;
  height: 24px;
  padding: 0 8px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #f8fafc;
  color: #475569;
  font-size: 11px;

  button {
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  &.is-warehouse {
    border-color: #bae6fd;
    background: #f0f9ff;
    color: #0369a1;
  }

  &.is-material {
    border-color: #fde68a;
    background: #fffbeb;
    color: #b45309;
  }

  &.is-staff {
    border-color: #bbf7d0;
    background: #f0fdf4;
    color: #15803d;
  }

  &.is-order,
  &.is-file {
    border-color: #ddd6fe;
    background: #f5f3ff;
    color: #7c3aed;
  }
}

.icon-action,
.send-button,
.stop-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  cursor: pointer;
}

.icon-action {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;
  font-size: 15px;

  &:hover {
    background: #f1f5f9;
    color: #334155;
  }

  &.active {
    background: #f5f3ff;
    color: #7008e7;
  }
}

.send-button,
.stop-button {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  transition: 0.16s ease;
}

.send-button {
  background: #7c3aed;
  color: #fff;
  box-shadow: 0 10px 18px -10px rgba(124, 58, 237, 0.55);

  &:disabled {
    background: #f1f5f9;
    color: #cbd5e1;
    box-shadow: none;
    cursor: not-allowed;
  }
}

.stop-button {
  background: #f43f5e;

  span {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: #fff;
  }
}

.file-input {
  display: none;
}
</style>
