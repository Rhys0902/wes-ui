<template>
  <div :class="['thinking-block', { collapsed: !open && isDone }]">
    <button v-if="isDone" class="thinking-header as-button" type="button" @click="open = !open">
      <span class="thinking-title">
        <span class="thinking-icon">⌘</span>
        深度思考已完成
        <span v-if="block.totalTime" class="thinking-time">· 用时 {{ block.totalTime }}</span>
      </span>
      <el-icon class="expand-icon">
        <FullScreen v-if="!open" />
        <Minus v-else />
      </el-icon>
    </button>

    <div v-else class="thinking-header">
      <span class="thinking-title">
        <span class="thinking-icon spinning">⌘</span>
        深度思考中...
        <span class="thinking-time">已用时 {{ block.elapsed || '0.0s' }}</span>
      </span>
      <button class="stop-button" type="button" @click="$emit('stop')">
        <span class="stop-dot"></span>
        停止
      </button>
    </div>

    <transition name="thinking-fold">
      <div v-if="open || !isDone" class="thinking-body">
        <div v-if="steps.length" class="thinking-steps">
          <div v-for="(step, index) in steps" :key="index" class="thinking-step">
            <span :class="['step-state', step.status]">
              <span v-if="step.status === 'done'">✓</span>
              <span v-else-if="step.status === 'running'" class="running-dot"></span>
            </span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>

        <div class="thinking-summary" v-html="formatMarkdown(summaryText)">
        </div>
        <div v-if="!isDone" class="thinking-caret-line">
          <span v-if="!isDone" class="stream-caret"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

defineEmits(['stop'])

// 思考块只展示可给用户看的进度摘要，不展示模型内部推理链。
const isDone = computed(() => props.block.phase === 'done')
const open = ref(!isDone.value && props.block.defaultOpen !== false)
const steps = computed(() => props.block.steps || [])
// 摘要优先展示完成态内容；运行中则展示partial，让用户知道系统还在处理。
const summaryText = computed(() => {
  if (isDone.value) {
    return props.block.content || '深度思考已完成。'
  }
  return props.block.content || props.block.partial || '等待模型返回深度分析...'
})

// 思考内容也可能来自模型或后端拼接，渲染前必须统一转义。
function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 思考摘要只支持轻量Markdown，避免在过程块里引入复杂富文本渲染风险。
function formatMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />')
}
</script>

<style scoped lang="scss">
.thinking-block {
  width: min(680px, 100%);
  margin: 0 0 12px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
  color: #475569;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);

  &.collapsed {
    width: fit-content;
    min-width: 260px;
    padding: 10px 12px;
  }
}

.thinking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.as-button {
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.thinking-title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #64748b;
  font-size: 12.5px;
  line-height: 20px;
}

.thinking-icon {
  color: #8b5cf6;
  font-size: 14px;
  line-height: 1;
}

.spinning {
  animation: thinking-spin 3s linear infinite;
}

.thinking-time {
  color: #94a3b8;
  font-size: 11.5px;
}

.expand-icon {
  color: #94a3b8;
  font-size: 14px;
}

.stop-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border: 1px solid #dbe4ef;
  border-radius: 8px;
  background: #fff;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    border-color: #fecdd3;
    background: #fff1f2;
    color: #e11d48;
  }
}

.stop-dot {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: currentColor;
}

.thinking-body {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.thinking-steps {
  display: grid;
  gap: 7px;
  margin-bottom: 12px;
}

.thinking-step {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 18px;
  font-size: 12.5px;
}

.step-state {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  flex: 0 0 15px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #94a3b8;
  font-size: 10px;

  &.done {
    border-color: #bbf7d0;
    background: #dcfce7;
    color: #22c55e;
  }

  &.running {
    border-color: #ddd6fe;
    background: #ede9fe;
  }
}

.running-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8b5cf6;
  animation: thinking-pulse 1.2s ease-in-out infinite;
}

.step-label {
  color: #475569;
}

.thinking-summary {
  color: #52657d;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.thinking-caret-line {
  min-height: 16px;
  margin-top: 2px;
}

.stream-caret {
  display: inline-block;
  width: 2px;
  height: 13px;
  margin-left: 3px;
  background: #94a3b8;
  vertical-align: -2px;
  animation: thinking-pulse 1s steps(2, start) infinite;
}

.thinking-fold-enter-active,
.thinking-fold-leave-active {
  transition: all 0.22s ease;
}

.thinking-fold-enter-from,
.thinking-fold-leave-to {
  max-height: 0;
  opacity: 0;
}

.thinking-fold-enter-to,
.thinking-fold-leave-from {
  max-height: 500px;
  opacity: 1;
}

@keyframes thinking-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes thinking-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
</style>
