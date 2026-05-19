<template>
  <div class="model-switcher">
    <button class="model-trigger" type="button" @click="open = !open">
      <LingxiLogo :size="18" />
      <span>{{ activeModel.displayName || activeModel.modelName || 'AI 助手 Pro' }}</span>
      <span v-if="activeModel.defaultFlag === 'Y'" class="model-badge">默认</span>
      <el-icon><ArrowDown /></el-icon>
    </button>

    <transition name="model-pop">
      <div v-if="open" class="model-popover">
        <button
          v-for="model in models"
          :key="model.id"
          class="model-option"
          type="button"
          @click="selectModel(model)"
        >
          <LingxiLogo :size="26" mark />
          <span class="model-text">
            <span class="model-title">
              {{ model.displayName || model.modelName }}
              <span v-if="model.defaultFlag === 'Y'" class="model-badge">默认</span>
            </span>
            <span class="model-desc">
              {{ model.provider }} / {{ model.modelName }}
            </span>
          </span>
          <el-icon v-if="String(model.id) === String(activeModel.id)" class="model-check"><Check /></el-icon>
        </button>

        <div v-if="models.length === 0" class="model-empty">
          暂无可用模型配置
        </div>
      </div>
    </transition>

    <div v-if="open" class="model-mask" @click="open = false"></div>
  </div>
</template>

<script setup>
import LingxiLogo from './LingxiLogo.vue'

const props = defineProps({
  activeModel: {
    type: Object,
    required: true
  },
  models: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])
const open = ref(false)

// 模型切换器只负责展示和派发选择，默认模型、启用状态等规则由后端配置决定。
function selectModel(model) {
  emit('select', model)
  open.value = false
}
</script>

<style scoped lang="scss">
.model-switcher {
  position: relative;
}

.model-trigger {
  position: relative;
  z-index: 31;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #1d293d;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
}

.model-badge {
  padding: 1px 5px;
  border: 1px solid #fde68a;
  border-radius: 999px;
  background: #fffbeb;
  color: #b45309;
  font-size: 10px;
}

.model-popover {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 32;
  width: 288px;
  overflow: hidden;
  padding: 4px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 45px rgba(148, 163, 184, 0.28);
}

.model-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
}

.model-text {
  flex: 1;
  min-width: 0;
}

.model-title,
.model-desc {
  display: flex;
  align-items: center;
  gap: 6px;
}

.model-title {
  color: #1d293d;
  font-size: 13px;
  font-weight: 600;
}

.model-desc {
  margin-top: 2px;
  overflow: hidden;
  color: #64748b;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-check {
  color: #8b5cf6;
}

.model-empty {
  padding: 18px 12px;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}

.model-mask {
  position: fixed;
  inset: 0;
  z-index: 30;
}

.model-pop-enter-active,
.model-pop-leave-active {
  transition: 0.15s ease;
}

.model-pop-enter-from,
.model-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
