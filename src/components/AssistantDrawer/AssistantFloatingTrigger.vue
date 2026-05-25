<template>
  <div>
    <transition name="mini">
      <section v-if="expanded" class="assistant-mini">
        <header class="mini-header">
          <div class="mini-title">
            <LingxiLogo :size="32" mark />
            <div>
              <div class="mini-name">AI 助手</div>
              <div class="mini-status"><span></span>在线 · 已接入实时数据</div>
            </div>
          </div>
          <button class="mini-close" type="button" aria-label="收起" @click="expanded = false">
            <el-icon><Close /></el-icon>
          </button>
        </header>

        <div class="mini-body">
          <div class="mini-section-title">快捷询问</div>
          <button v-for="item in quickQuestions" :key="item.text" class="quick-question" type="button" @click="ask(item.text)">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.text }}</span>
          </button>
        </div>

        <div class="mini-recent">
          <div class="mini-section-title">最近会话</div>
          <button v-for="item in recentItems" :key="item.title" class="recent-item" type="button" @click="openFull">
            <el-icon><ChatDotRound /></el-icon>
            <span>
              <span class="recent-title">{{ item.title }}</span>
              <span class="recent-time">{{ item.time }}</span>
            </span>
          </button>
        </div>

        <button class="open-full" type="button" @click="openFull">
          <el-icon><MagicStick /></el-icon>
          打开完整对话
        </button>
      </section>
    </transition>

    <div v-show="!expanded" class="floating-wrap">
      <transition name="tip">
        <section v-if="showTip" class="floating-tip">
          <div class="tip-title">
            <el-icon><MagicStick /></el-icon>
            <span>AI 助手 · 智能伙伴</span>
          </div>
          <p>问我“今日异常单”、“@物料 库存”，多类业务实体一键查询</p>
          <div class="tip-tags">
            <span v-for="tag in tags" :key="tag">{{ tag }}</span>
          </div>
        </section>
      </transition>

      <button
        class="floating-button"
        type="button"
        aria-label="打开AI助手"
        @click="expanded = true"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <span class="floating-glow"></span>
        <span class="floating-ping"></span>
        <LingxiLogo :size="42" mark />
        <span v-if="unread > 0 || variant === 'withBadge'" class="unread-badge">{{ unread || 3 }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import LingxiLogo from './LingxiLogo.vue'
import { Box, DataAnalysis, TrendCharts, Warning } from '@element-plus/icons-vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  unread: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['open', 'ask'])
const hovered = ref(false)
const expanded = ref(false)
// 引导气泡只在悬停或指定展示模式下出现，避免默认遮挡业务页面。
const showTip = computed(() => hovered.value || props.variant === 'withTip')

const quickQuestions = [
  { icon: DataAnalysis, text: '今日运营概览' },
  { icon: Warning, text: '异常工单汇总' },
  { icon: Box, text: '查询物料库存' },
  { icon: TrendCharts, text: '出库趋势分析' }
]
const recentItems = [
  { title: '出库单 OUT-20260517-001 状态', time: '刚刚' },
  { title: 'A 区库存周转分析', time: '2 小时前' },
  { title: '物料滞销 Top20 报表', time: '昨天' }
]
const tags = ['异常处理', '库存查询', '出库趋势']

// 打开完整对话前先收起入口面板，避免两个浮层同时占用右下角。
function openFull() {
  expanded.value = false
  emit('open')
}

// 快捷问题复用父组件的发送逻辑，入口组件不直接依赖store。
function ask(text) {
  expanded.value = false
  emit('ask', text)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/assistant/assistantFloatingTrigger.scss';
</style>
