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
import LingxiLogo from './LingxiLogo.vue'

defineEmits(['send'])

const metrics = [
  { label: '在库 SKU', value: '12,480', delta: '+2.4%', tone: 'up', icon: 'Box' },
  { label: '今日订单', value: '3,256', delta: '+18%', tone: 'up', icon: 'Document' },
  { label: '在执波次', value: '18', delta: '稳定', tone: 'flat', icon: 'Van' },
  { label: '待处理异常', value: '7', delta: '-2', tone: 'down', icon: 'Warning' }
]

const capabilityCards = [
  { title: '库存定位', desc: 'SKU10086 在 A-02 库区还有多少？', prompt: '查询 SKU10086 各库区库存', icon: 'Box', tone: 'blue' },
  { title: '波次调度', desc: '查看 W20260515 系列波次进度', prompt: '波次 W20260515-008 进度', icon: 'Van', tone: 'purple' },
  { title: '异常处理', desc: '今日异常单与 AI 处理建议', prompt: '汇总今日异常单及处理建议', icon: 'Warning', tone: 'amber' },
  { title: '运营报表', desc: '拣选效率 / 出库及时率分析', prompt: '近 7 天出库及时率趋势', icon: 'TrendCharts', tone: 'green' }
]

const suggestionQuestions = [
  '查询 SKU10086 各库区库存',
  '今日 A 区拣选效率排名',
  '波次 W20260515-008 进度',
  '汇总今日异常单及处理建议',
  '近 7 天出库及时率趋势',
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
