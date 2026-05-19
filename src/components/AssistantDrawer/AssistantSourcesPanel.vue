<template>
  <div v-if="sources.length" class="sources-panel">
    <button class="sources-trigger" type="button" @click="open = !open">
      <span>
        <el-icon><Document /></el-icon>
        参考来源（{{ sources.length }}）
      </span>
      <el-icon :class="{ reverse: open }"><ArrowDown /></el-icon>
    </button>

    <transition name="sources-expand">
      <div v-if="open" class="sources-list">
        <div v-for="(source, index) in sources" :key="source.id || index" class="source-item">
          <span class="source-index">{{ index + 1 }}</span>
          <span class="source-body">
            <span class="source-name">{{ source.name || source.title || '来源文档' }}</span>
            <span class="source-meta">{{ source.time || source.type || '系统知识' }}</span>
          </span>
          <span class="source-confidence">
            {{ formatConfidence(source.confidence) }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  sources: {
    type: Array,
    default: () => []
  }
})

const open = ref(false)

// 将0-1相似度转换为用户可读百分比；缺失或异常值降级为“来源”。
function formatConfidence(value) {
  if (value === undefined || value === null) {
    return '来源'
  }
  const number = Number(value)
  if (Number.isNaN(number)) {
    return '来源'
  }
  return `${Math.round(number * 100)}%`
}
</script>

<style scoped lang="scss">
.sources-panel {
  overflow: hidden;
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

.sources-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
}

.reverse {
  transform: rotate(180deg);
}

.sources-list {
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: 0;
  }
}

.source-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid #ddd6fe;
  border-radius: 6px;
  background: #f5f3ff;
  color: #7c3aed;
  font-size: 11px;
}

.source-body {
  flex: 1;
  min-width: 0;
}

.source-name,
.source-meta {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-name {
  color: #334155;
  font-size: 12px;
}

.source-meta {
  color: #94a3b8;
  font-size: 11px;
}

.source-confidence {
  padding: 2px 6px;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  background: #f0fdf4;
  color: #15803d;
  font-size: 10px;
}

.sources-expand-enter-active,
.sources-expand-leave-active {
  overflow: hidden;
  transition: 0.18s ease;
}

.sources-expand-enter-from,
.sources-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.sources-expand-enter-to,
.sources-expand-leave-from {
  max-height: 320px;
  opacity: 1;
}
</style>
