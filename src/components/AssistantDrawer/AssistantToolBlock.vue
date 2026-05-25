<template>
  <section class="assistant-tool-card" :class="`is-${statusKey}`">
    <div class="tool-header">
      <div>
        <div class="tool-title">{{ title }}</div>
        <div class="tool-subtitle">{{ block.toolName || 'business_tool' }}</div>
      </div>
      <span class="tool-status">{{ statusLabel }}</span>
    </div>

    <div class="tool-summary">{{ block.summary || '业务查询已完成。' }}</div>

    <dl v-if="paramEntries.length" class="tool-params">
      <template v-for="item in paramEntries" :key="item.key">
        <dt>{{ paramLabel(item.key) }}</dt>
        <dd>{{ item.value }}</dd>
      </template>
    </dl>

    <div v-if="metricEntries.length" class="tool-metrics">
      <div v-for="item in metricEntries" :key="item.key" class="tool-metric">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

const title = computed(() => props.block.title || '业务查询')
const statusKey = computed(() => String(props.block.status || 'done').toLowerCase())
const statusLabel = computed(() => ({
  success: '成功',
  empty: '无数据',
  failed: '失败',
  denied: '无权限',
  done: '完成'
}[statusKey.value] || '完成'))

const paramEntries = computed(() => Object.entries(props.block.params || {})
  .filter(([, value]) => value !== undefined && value !== null && value !== '')
  .map(([key, value]) => ({ key, value })))

const metricEntries = computed(() => {
  const data = props.block.data || {}
  return [
    { key: 'rowCount', label: '明细数', value: data.rowCount },
    { key: 'totalQty', label: '库存合计', value: data.totalQty },
    { key: 'allocatedQty', label: '分配数量', value: data.allocatedQty }
  ].filter(item => item.value !== undefined && item.value !== null && item.value !== '')
})

function paramLabel(key) {
  return {
    materialCode: '物料编码',
    materialName: '物料名称',
    matchedText: '识别内容',
    skuCode: '物料编码',
    locationCode: '库位',
    warehouseCode: '仓库',
    areaCode: '库区',
    batchCode: '批次',
    batchNo: '批次'
  }[key] || key
}
</script>

<style scoped>
.assistant-tool-card {
  width: 100%;
  margin: 8px 0 12px;
  padding: 12px;
  border: 1px solid #dbe5f3;
  border-radius: 8px;
  background: #f8fbff;
}

.tool-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.tool-title {
  color: #1f2a44;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.tool-subtitle {
  margin-top: 2px;
  color: #6b7890;
  font-size: 12px;
  line-height: 1.3;
}

.tool-status {
  flex: 0 0 auto;
  min-width: 44px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #e7f7ef;
  color: #087443;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.is-empty .tool-status {
  background: #fff4df;
  color: #a15c07;
}

.is-failed .tool-status,
.is-denied .tool-status {
  background: #ffe8e8;
  color: #b42318;
}

.tool-summary {
  margin-top: 10px;
  color: #334155;
  font-size: 14px;
  line-height: 1.6;
}

.tool-params {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 12px;
  margin: 10px 0 0;
}

.tool-params dt {
  color: #6b7890;
  font-size: 12px;
}

.tool-params dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  color: #1f2a44;
  font-size: 13px;
  font-weight: 600;
}

.tool-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.tool-metric {
  min-width: 0;
  padding: 8px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #e6edf7;
}

.tool-metric span,
.tool-metric strong {
  display: block;
}

.tool-metric span {
  color: #6b7890;
  font-size: 12px;
}

.tool-metric strong {
  margin-top: 2px;
  overflow-wrap: anywhere;
  color: #1f2a44;
  font-size: 14px;
  line-height: 1.3;
}

@media (max-width: 640px) {
  .tool-params,
  .tool-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
