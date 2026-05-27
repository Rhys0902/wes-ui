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

    <div v-if="reportRows.length" class="tool-report-list">
      <div v-for="(item, index) in reportRows" :key="reportRowKey(item, index)" class="tool-report-row">
        <div class="report-main">
          <strong>{{ item.materialName || item.docNumber || item.materialCode || '-' }}</strong>
          <span>{{ item.docTypeName || item.transType || item.batchCode || '报表明细' }}</span>
        </div>
        <dl class="report-fields">
          <template v-for="field in reportFields(item)" :key="field.key">
            <dt>{{ field.label }}</dt>
            <dd>{{ field.value }}</dd>
          </template>
        </dl>
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
  if (props.block.toolName === 'report_query') {
    return reportMetricEntries(data)
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

const reportRows = computed(() => {
  const rows = props.block.data?.rows
  return props.block.toolName === 'report_query' && Array.isArray(rows) ? rows : []
})

// 异常查询卡片按作业指令排查顺序展示字段：状态、库位、容器，再给处理建议。
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

// 报表类型不同，核心指标不同；这里把后端 reportType 映射成固定的卡片指标。
function reportMetricEntries(data) {
  const common = [
    { key: 'reportName', label: '报表类型', value: data.reportName },
    { key: 'rowCount', label: '明细数', value: data.rowCount }
  ]
  if (data.reportType === 'in_out_trans') {
    return [
      ...common,
      { key: 'periodName', label: '统计周期', value: data.periodName },
      { key: 'transQtyTotal', label: '交易数量', value: data.transQtyTotal },
      { key: 'orderedQtyTotal', label: '订单数量', value: data.orderedQtyTotal }
    ].filter(validMetric)
  }
  if (data.reportType === 'stock_day') {
    return [
      ...common,
      { key: 'qtyTotal', label: '库存数量', value: data.qtyTotal },
      { key: 'allocationQtyTotal', label: '分配数量', value: data.allocationQtyTotal },
      { key: 'maxDateDiff', label: '最大账龄', value: data.maxDateDiff }
    ].filter(validMetric)
  }
  return [
    ...common,
    { key: 'qtyTotal', label: '库存数量', value: data.qtyTotal },
    { key: 'allocationQtyTotal', label: '分配数量', value: data.allocationQtyTotal },
    { key: 'allocationRate', label: '分配占比', value: data.allocationRate === undefined ? undefined : `${data.allocationRate}%` }
  ].filter(validMetric)
}

// 报表明细分交易类和库存类两种结构，前端只展示业务人员排查时会看的字段。
function reportFields(item) {
  if ('transQty' in item || 'docNumber' in item) {
    return [
      { key: 'docNumber', label: '单据号', value: item.docNumber },
      { key: 'materialCode', label: '物料编码', value: item.materialCode },
      { key: 'batchCode', label: '批次', value: item.batchCode },
      { key: 'transQty', label: '交易数量', value: item.transQty },
      { key: 'unit', label: '单位', value: item.unit },
      { key: 'leCode', label: '托盘编码', value: item.leCode },
      { key: 'sourceLocCode', label: '源库位', value: item.sourceLocCode },
      { key: 'targetLocCode', label: '目标库位', value: item.targetLocCode },
      { key: 'ediStatus', label: '过账状态', value: item.ediStatus }
    ].filter(validMetric)
  }
  return [
    { key: 'materialCode', label: '物料编码', value: item.materialCode },
    { key: 'batchCode', label: '批次', value: item.batchCode },
    { key: 'qty', label: '库存数量', value: item.qty },
    { key: 'allocationQty', label: '分配数量', value: item.allocationQty },
    { key: 'unit', label: '单位', value: item.unit },
    { key: 'dateDiff', label: '账龄', value: item.dateDiff }
  ].filter(validMetric)
}

// 报表行可能没有统一主键，优先使用单据号/物料编码/批次组合保证列表稳定。
function reportRowKey(item, index) {
  return `${item.docNumber || item.materialCode || 'report'}-${item.batchCode || index}`
}

// 空值不占用指标位，避免卡片出现“字段名 + 空白”的噪音。
function validMetric(item) {
  return item.value !== undefined && item.value !== null && item.value !== ''
}

// 工具入参来自后端统一 params，这里转换成业务可读标签。
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
    orderTypeName: '单据类型',
    reportType: '报表类型',
    period: '统计周期'
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

.tool-exception-list,
.tool-report-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.tool-exception-row,
.tool-report-row {
  padding: 10px;
  border: 1px solid #e6edf7;
  border-radius: 6px;
  background: #ffffff;
}

.exception-main,
.report-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #1f2a44;
  font-size: 13px;
}

.exception-main strong,
.report-main strong {
  min-width: 0;
  overflow-wrap: anywhere;
}

.exception-main span,
.report-main span {
  flex: 0 0 auto;
  color: #6b7890;
}

.exception-fields,
.report-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 10px;
  margin: 8px 0 0;
}

.exception-fields dt,
.report-fields dt {
  color: #6b7890;
  font-size: 12px;
}

.exception-fields dd,
.report-fields dd {
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
  .exception-fields,
  .report-fields {
    grid-template-columns: 1fr;
  }
}
</style>
