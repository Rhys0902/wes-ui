<template>
  <transition name="mention-pop">
    <div v-if="open" class="mention-popover">
      <div class="mention-tabs">
        <button
          v-for="group in groups"
          :key="group.key"
          :class="['mention-tab', { active: activeKind === group.key }]"
          type="button"
          @click="activeKind = group.key"
        >
          {{ group.label }}
        </button>
        <div class="mention-search">
          <el-icon><Search /></el-icon>
          <input v-model="keyword" placeholder="搜索" />
        </div>
      </div>

      <div class="mention-list">
        <button
          v-for="item in filteredOptions"
          :key="`${item.kind}-${item.id}`"
          class="mention-option"
          type="button"
          @click="pick(item)"
        >
          <span class="mention-icon">{{ item.label.slice(0, 1) }}</span>
          <span class="mention-main">
            <span class="mention-title">{{ item.label }}</span>
            <span class="mention-id">{{ item.id }}</span>
          </span>
          <el-icon><ArrowRight /></el-icon>
        </button>

        <div v-if="filteredOptions.length === 0" class="mention-empty">
          没有匹配结果
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ASSISTANT_ENTITY_GROUPS } from '@/api/assistant/assistantEntityOptions'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['pick'])
const groups = ASSISTANT_ENTITY_GROUPS
const activeKind = ref(groups[0]?.key || 'warehouse')
const keyword = ref('')

// 左侧分组和右侧候选项共享同一份配置，新增业务对象时只需要维护api配置文件。
const activeGroup = computed(() => groups.find(item => item.key === activeKind.value) || groups[0])
// 提及搜索在前端本地过滤，P0.5阶段先保证交互闭环，后续可替换成远程业务查询。
const filteredOptions = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  const options = activeGroup.value?.options || []
  if (!q) {
    return options
  }
  return options.filter(item =>
    item.label.toLowerCase().includes(q) ||
    item.id.toLowerCase().includes(q)
  )
})

watch(
  () => props.open,
  value => {
    // 每次打开弹层都清空旧关键字，避免上一次搜索影响本次提及选择。
    if (value) {
      keyword.value = ''
    }
  }
)

// 选中候选项后由父组件写入store，弹层本身不直接修改全局状态。
function pick(item) {
  emit('pick', item)
}
</script>

<style scoped lang="scss">
.mention-popover {
  position: absolute;
  right: 12px;
  bottom: calc(100% + 10px);
  left: 12px;
  z-index: 20;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 22px 48px rgba(148, 163, 184, 0.3);
}

.mention-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px;
  border-bottom: 1px solid #eef2f7;
  background: #f8fafc;
}

.mention-tab {
  height: 28px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;

  &.active {
    background: #ede9fe;
    color: #7c3aed;
  }
}

.mention-search {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 132px;
  height: 28px;
  margin-left: auto;
  padding: 0 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #94a3b8;

  input {
    min-width: 0;
    border: 0;
    outline: none;
    color: #334155;
    font-size: 12px;
  }
}

.mention-list {
  max-height: 224px;
  overflow-y: auto;
  padding: 4px;
}

.mention-option {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 8px 9px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
}

.mention-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
}

.mention-main {
  flex: 1;
  min-width: 0;
}

.mention-title,
.mention-id {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mention-title {
  color: #1d293d;
  font-size: 13px;
}

.mention-id {
  color: #94a3b8;
  font-size: 11px;
}

.mention-empty {
  padding: 20px;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}

.mention-pop-enter-active,
.mention-pop-leave-active {
  transition: 0.18s ease;
}

.mention-pop-enter-from,
.mention-pop-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
