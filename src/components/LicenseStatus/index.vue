<template>
  <div class="license-status">
    <el-card class="license-card" :class="statusClass">
      <div class="license-header">
        <el-icon class="status-icon" :class="iconClass">
          <component :is="iconComponent" />
        </el-icon>
        <div class="license-info">
          <h3 class="product-name">{{ licenseResult.productName || 'WES' }}</h3>
          <p class="version">版本 {{ licenseResult.version || '2.0.0' }}</p>
        </div>
      </div>

      <div class="license-details">
        <div class="detail-item" v-if="licenseResult.expireDate">
          <span class="label">到期时间：</span>
          <span class="value">{{ formatDate(licenseResult.expireDate) }}</span>
        </div>

        <div class="detail-item" v-if="licenseResult.remainingDays !== undefined">
          <span class="label">剩余天数：</span>
          <span class="value" :class="remainingDaysClass">
            {{ licenseResult.remainingDays }} 天
          </span>
        </div>

        <div class="detail-item" v-if="licenseResult.machineCode">
          <span class="label">机器码：</span>
          <span class="value machine-code">{{ licenseResult.machineCode }}</span>
        </div>
      </div>

      <div class="license-status-bar">
        <el-tag :type="statusTagType" size="large">
          {{ statusText }}
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Warning, Close, InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  licenseResult: {
    type: Object,
    required: true
  }
})

// 状态级别对应的样式类
const statusClass = computed(() => {
  if (!props.licenseResult.activated) return 'status-inactive'

  switch (props.licenseResult.statusLevel) {
    case 'green': return 'status-active'
    case 'yellow': return 'status-warning'
    case 'red': return 'status-expired'
    default: return 'status-unknown'
  }
})

// 图标组件
const iconComponent = computed(() => {
  if (!props.licenseResult.activated) return Close

  switch (props.licenseResult.statusLevel) {
    case 'green': return Check
    case 'yellow': return Warning
    case 'red': return Close
    default: return InfoFilled
  }
})

// 图标样式类
const iconClass = computed(() => {
  if (!props.licenseResult.activated) return 'icon-inactive'

  switch (props.licenseResult.statusLevel) {
    case 'green': return 'icon-active'
    case 'yellow': return 'icon-warning'
    case 'red': return 'icon-expired'
    default: return 'icon-unknown'
  }
})

// 剩余天数样式类
const remainingDaysClass = computed(() => {
  if (!props.licenseResult.activated) return ''

  const days = props.licenseResult.remainingDays
  if (days > 30) return 'days-normal'
  if (days > 7) return 'days-warning'
  return 'days-danger'
})

// 状态标签类型
const statusTagType = computed(() => {
  if (!props.licenseResult.activated) return 'danger'

  switch (props.licenseResult.statusLevel) {
    case 'green': return 'success'
    case 'yellow': return 'warning'
    case 'red': return 'danger'
    default: return 'info'
  }
})

// 状态文本
const statusText = computed(() => {
  if (!props.licenseResult.activated) {
    return '未激活'
  }

  return props.licenseResult.statusDescription || '未知状态'
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}
</script>

<style scoped>
.license-status {
  margin-bottom: 20px;
}

.license-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.license-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 状态样式 */
.status-active {
  border-left: 4px solid #67c23a;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
}

.status-warning {
  border-left: 4px solid #e6a23c;
  background: linear-gradient(135deg, #fef7e6 0%, #fdf6ec 100%);
}

.status-expired {
  border-left: 4px solid #f56c6c;
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
}

.status-inactive {
  border-left: 4px solid #909399;
  background: linear-gradient(135deg, #f4f4f5 0%, #e9e9eb 100%);
}

.status-unknown {
  border-left: 4px solid #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
}

.license-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.status-icon {
  font-size: 32px;
  margin-right: 16px;
}

.icon-active {
  color: #67c23a;
}

.icon-warning {
  color: #e6a23c;
}

.icon-expired {
  color: #f56c6c;
}

.icon-inactive {
  color: #909399;
}

.icon-unknown {
  color: #409eff;
}

.license-info {
  flex: 1;
}

.product-name {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.version {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.license-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.detail-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
}

.value {
  color: #303133;
  font-weight: 500;
}

.machine-code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.days-normal {
  color: #67c23a;
}

.days-warning {
  color: #e6a23c;
}

.days-danger {
  color: #f56c6c;
}

.license-status-bar {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .license-header {
    flex-direction: column;
    text-align: center;
  }

  .status-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .label {
    margin-bottom: 4px;
  }
}
</style>
