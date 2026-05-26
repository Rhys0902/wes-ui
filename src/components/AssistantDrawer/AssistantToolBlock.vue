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

    <div v-if="exceptionRows.length" class="tool-exception-list">
      <div v-for="item in exceptionRows" :key="item.instrNum || item.docNumber" class="tool-exception-row">
        <div class="exception-main">
          <strong>{{ item.instrNum || '-' }}</strong>
          <span>{{ item.instrTypeName || item.instrType || '未知作业' }}</span>
        </div>
        <dl class="exception-fields">
          <template v-for="field in exceptionFields(item)" :key="field.key">
            <dt>{{ field.label }}</dt>
            <dd>{{ field.value }}</dd>
          </template>
        </dl>
        <div v-if="item.advice" class="exception-advice">{{ item.advice }}</div>
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
  .filter(([key, value]) => !['allowedOrderTypes'].includes(key) && value !== undefined && value !== null && value !== '')
  .map(([key, value]) => ({ key, value })))

const metricEntries = computed(() => {
  const data = props.block.data || {}
  if (props.block.toolName === 'exception_query') {
    return [
      { key: 'rowCount', label: '作业数', value: data.rowCount },
      { key: 'pendingCount', label: '待处理', value: data.pendingCount }
    ].filter(item => item.value !== undefined && item.value !== null && item.value !== '')
  }
  if (props.block.toolName === 'order_query') {
    return [
      { key: 'docStatus', label: '单据状态', value: data.docStatus },
      { key: 'workStatus', label: '作业状态', value: data.workStatus },
      { key: 'releaseStatus', label: '释放状态', value: data.releaseStatus },
      { key: 'priority', label: '优先级', value: data.priority }
    ].filter(item => item.value !== undefined && item.value !== null && item.value !== '')
  }
  return [
    { key: 'rowCount', label: '明细数', value: data.rowCount },
    { key: 'totalQty', label: '库存合计', value: data.totalQty },
    { key: 'allocatedQty', label: '分配数量', value: data.allocatedQty }
  ].filter(item => item.value !== undefined && item.value !== null && item.value !== '')
})

const exceptionRows = computed(() => {
  const rows = props.block.data?.rows
  return props.block.toolName === 'exception_query' && Array.isArray(rows) ? rows : []
})

function exceptionFields(item) {
  return [
    { key: 'docNumber', label: '关联单号', value: item.docNumber },
    { key: 'instrStatusName', label: '指令状态', value: item.instrStatusName || item.instrStatus },
    { key: 'wmsStatusName', label: 'WMS状态', value: item.wmsStatusName || item.wmsStatus },
    { key: 'originLocationCode', label: '起点库位', value: item.originLocationCode },
    { key: 'destinationLocationCode', label: '终点库位', value: item.destinationLocationCode },
    { key: 'leCode', label: '容器编码', value: item.leCode },
    { key: 'notes', label: '备注', value: item.notes }
  ].filter(field => field.value !== undefined && field.value !== null && field.value !== '')
}

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
    batchNo: '批次',
    docNumber: '单据号',
    instrNum: '指令号',
    orderType: '单据类型',
    orderTypeName: '单据类型'
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

.tool-exception-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.tool-exception-row {
  padding: 10px;
  border: 1px solid #e6edf7;
  border-radius: 6px;
  background: #ffffff;
}

.exception-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #1f2a44;
  font-size: 13px;
}

.exception-main strong {
  min-width: 0;
  overflow-wrap: anywhere;
}

.exception-main span {
  flex: 0 0 auto;
  color: #6b7890;
}

.exception-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 10px;
  margin: 8px 0 0;
}

.exception-fields dt {
  color: #6b7890;
  font-size: 12px;
}

.exception-fields dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  color: #1f2a44;
  font-size: 12px;
  font-weight: 600;
}

.exception-advice {
  margin-top: 8px;
  color: #475569;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .tool-params,
  .tool-metrics,
  .exception-fields {
    grid-template-columns: 1fr;
  }
}
</style>
