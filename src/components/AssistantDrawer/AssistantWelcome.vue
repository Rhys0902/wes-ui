<template>
  <div class="welcome-state">
    <div class="welcome-hero">
      <LingxiLogo :size="52" mark />
      <h1>你好，今天想做点什么？</h1>
      <p>问 AI 助手任何关于仓储作业的问题</p>
    </div>

    <div class="metrics-grid">
      <div v-for="metric in metrics" :key="metric.label" class="metric-card">
        <div class="metric-top">
          <el-icon><component :is="metric.icon" /></el-icon>
          <span :class="metric.tone">{{ metric.delta }}</span>
        </div>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.label }}</small>
      </div>
    </div>

    <div class="section-title">常用能力</div>
    <div class="capability-grid">
      <button
        v-for="card in capabilityCards"
        :key="card.title"
        class="capability-card"
        type="button"
        @click="$emit('send', card.prompt)"
      >
        <span class="card-icon" :class="card.tone">
          <el-icon><component :is="card.icon" /></el-icon>
        </span>
        <span>
          <strong>{{ card.title }}</strong>
          <small>{{ card.desc }}</small>
        </span>
      </button>
    </div>

    <div class="suggestions">
      <div class="suggestion-title">
        <el-icon><MagicStick /></el-icon>
        试着这样问
      </div>
      <div class="suggestion-list">
        <button v-for="item in suggestionQuestions" :key="item" type="button" @click="$emit('send', item)">
          {{ item }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getAssistantOverview } from '@/api/assistant/assistantChat'
import LingxiLogo from './LingxiLogo.vue'

defineEmits(['send'])

const metricBaseList = [
  { key: 'stockMaterial', label: '在库物料', value: '--', delta: '实时', tone: 'flat', icon: 'Box' },
  { key: 'todayOrder', label: '今日订单', value: '--', delta: '今日', tone: 'flat', icon: 'Document' },
  { key: 'activeOrder', label: '在执订单', value: '--', delta: '未完成', tone: 'flat', icon: 'Van' },
  { key: 'pendingException', label: '待处理异常', value: '--', delta: '待处理', tone: 'down', icon: 'Warning' }
]

const metrics = ref(metricBaseList.map(item => ({ ...item })))

// 欢迎页指标只展示真实接口数据；异常时保留占位符，避免误导用户。
const loadOverviewMetrics = async () => {
  try {
    const response = await getAssistantOverview()
    const rows = Array.isArray(response.data) ? response.data : []
    metrics.value = metricBaseList.map(base => {
      const row = rows.find(item => item.key === base.key) || {}
      return {
        ...base,
        value: row.value || '--',
        delta: row.delta || base.delta,
        tone: row.tone || base.tone
      }
    })
  } catch (error) {
    metrics.value = metricBaseList.map(item => ({ ...item }))
  }
}

onMounted(loadOverviewMetrics)

const capabilityCards = [
  { title: '库存定位', desc: '3.3.2.01.1004 当前库存还有多少？', prompt: '查一下 3.3.2.01.1004 的库存', icon: 'Box', tone: 'blue' },
  { title: '订单跟踪', desc: '查看出库单 / 入库单当前状态', prompt: '查一下出库单 OUT-20260517-001 的状态', icon: 'Van', tone: 'purple' },
  { title: '异常处理', desc: '今日异常单与 AI 处理建议', prompt: '汇总今日异常单及处理建议', icon: 'Warning', tone: 'amber' },
  { title: '运营报表', desc: '出入库交易 / 库存汇总分析', prompt: '查一下近 7 天出入库交易统计', icon: 'TrendCharts', tone: 'green' }
]

const suggestionQuestions = [
  '查一下 3.3.2.01.1004 的库存',
  '哪些库存库龄比较久',
  '查一下出库单 OUT-20260517-001 的状态',
  '汇总今日异常单及处理建议',
  '查一下近 7 天出入库交易统计',
  'AGV 当前在线与利用率'
]
</script>

<style scoped lang="scss">
.welcome-state {
  max-width: 768px;
  width: 100%;
  margin: 0 auto;
  padding: 56px 32px 32px;
}

.welcome-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  text-align: center;

  h1 {
    margin: 16px 0 4px;
    color: #0f172a;
    font-size: 22px;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 13.5px;
  }
}

.metrics-grid,
.capability-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

.metric-card {
  min-height: 86px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;

  strong,
  small {
    display: block;
  }

  strong {
    margin-top: 10px;
    color: #1d293d;
    font-size: 20px;
    font-weight: 500;
  }

  small {
    color: #62748e;
    font-size: 12px;
  }
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #90a1b9;
  font-size: 11px;
}

.up {
  color: #10b981;
}

.down {
  color: #f43f5e;
}

.flat {
  color: #22c55e;
}

.section-title {
  margin-bottom: 12px;
  color: #64748b;
  font-size: 12.5px;
}

.capability-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.capability-card {
  display: flex;
  gap: 12px;
  align-items: center;
  min-height: 78.75px;
  padding: 17px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: 0.16s ease;

  &:hover {
    border-color: #c4b5fd;
    background: #faf5ff;
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: #1d293d;
    font-size: 16px;
    line-height: 24px;
  }

  small {
    color: #62748e;
    font-size: 12.5px;
  }
}

.card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  font-size: 20px;

  &.blue {
    color: #2563eb;
    background: #eff6ff;
  }

  &.purple {
    color: #7c3aed;
    background: #f5f3ff;
  }

  &.amber {
    color: #d97706;
    background: #fffbeb;
  }

  &.green {
    color: #059669;
    background: #ecfdf5;
  }
}

.suggestion-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  color: #64748b;
  font-size: 12.5px;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  button {
    height: 32.75px;
    padding: 0 12px;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    background: #fff;
    color: #45556c;
    font-size: 12.5px;
    cursor: pointer;

    &:hover {
      border-color: #ddd6ff;
      background: #f5f3ff;
      color: #7008e7;
    }
  }
}

@media (max-width: 900px) {
  .welcome-state {
    padding: 32px 18px;
  }

  .metrics-grid,
  .capability-grid {
    grid-template-columns: 1fr;
  }
}
</style>
