<template>
  <div class="mode-switcher">
    <button :class="['mode-trigger', modeClass]" type="button" @click="open = !open">
      <span class="mode-badge">模式</span>
      <span class="mode-name">{{ activeMode.shortLabel || activeMode.label }}</span>
      <el-icon><ArrowDown /></el-icon>
    </button>

    <transition name="mode-pop">
      <div v-if="open" class="mode-popover">
        <button
          v-for="mode in modes"
          :key="mode.value"
          class="mode-option"
          type="button"
          @click="selectMode(mode)"
        >
          <span :class="['option-icon', mode.value.toLowerCase()]">
            <el-icon><Connection v-if="mode.value === 'AUTO'" /><OfficeBuilding v-else-if="mode.value === 'WES'" /><ChatRound v-else /></el-icon>
          </span>
          <span class="mode-text">
            <span class="mode-title">{{ mode.label }}</span>
            <span class="mode-desc">{{ mode.desc }}</span>
          </span>
          <el-icon v-if="mode.value === value" class="mode-check"><Check /></el-icon>
        </button>
      </div>
    </transition>

    <div v-if="open" class="mode-mask" @click="open = false"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    default: 'AUTO'
  },
  modes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])
const open = ref(false)
// 当前模式展示依赖父级传入的枚举；缺省时回落到自动模式，避免空数据导致按钮空白。
const activeMode = computed(() => props.modes.find(item => item.value === props.value) || props.modes[0] || {
  label: '自动模式'
})
// 不同模式使用不同色彩，便于用户快速区分自动、WES业务和通用AI。
const modeClass = computed(() => `mode-${String(props.value || 'AUTO').toLowerCase()}`)

// 选择后立即关闭下拉，实际模式值由父组件/store保存。
function selectMode(mode) {
  emit('select', mode.value)
  open.value = false
}
</script>

<style scoped lang="scss">
.mode-switcher {
  position: relative;
}

.mode-trigger {
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
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }

  &.mode-auto {
    .mode-name {
      color: #7c3aed;
    }

    .mode-badge {
      border-color: #ddd6fe;
      background: #f5f3ff;
      color: #7c3aed;
    }
  }

  &.mode-wes {
    .mode-name {
      color: #0f766e;
    }

    .mode-badge {
      border-color: #99f6e4;
      background: #f0fdfa;
      color: #0f766e;
    }
  }

  &.mode-general {
    .mode-name {
      color: #2563eb;
    }

    .mode-badge {
      border-color: #bfdbfe;
      background: #eff6ff;
      color: #2563eb;
    }
  }
}

.option-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: #fff;
  background: linear-gradient(135deg, #38bdf8, #8b5cf6);
}

.mode-name {
  display: inline-flex;
  align-items: center;
  height: 18px;
  color: #1d293d;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
}

.mode-badge {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 5px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #f8fafc;
  color: #64748b;
  font-size: 10px;
  line-height: 18px;
}

.mode-trigger > .el-icon {
  display: inline-flex;
  align-items: center;
  height: 18px;
}

.mode-popover {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 32;
  width: 292px;
  overflow: hidden;
  padding: 4px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 20px 45px rgba(148, 163, 184, 0.28);
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
}

.option-icon {
  width: 30px;
  height: 30px;
  border-radius: 11px;
  font-size: 15px;

  &.wes {
    background: linear-gradient(135deg, #14b8a6, #2563eb);
  }

  &.general {
    background: linear-gradient(135deg, #64748b, #334155);
  }
}

.mode-text {
  flex: 1;
  min-width: 0;
}

.mode-title {
  display: block;
  color: #1d293d;
  font-size: 13.5px;
  font-weight: 600;
}

.mode-desc {
  display: block;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 11px;
}

.mode-check {
  color: #8b5cf6;
}

.mode-mask {
  position: fixed;
  inset: 0;
  z-index: 30;
}

.mode-pop-enter-active,
.mode-pop-leave-active {
  transition: 0.15s ease;
}

.mode-pop-enter-from,
.mode-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
