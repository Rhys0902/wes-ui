<template>
    <div class="app-container service-manager-container" v-loading="isRefreshing && !serviceList.length">
        <el-row :gutter="16" class="service-list">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(service, index) in serviceList" :key="service.svcCode || index" class="service-card-col">
                <el-card shadow="hover" class="service-card">
                    <template #header>
                        <div class="card-header">
                            <div class="service-title">
                                <span class="service-name" :title="service.svcName">{{ service.svcName || service.svcCode }}</span>
                                <span class="service-code">{{ service.svcCode }}</span>
                            </div>
                            <div class="status-stack">
                                <el-tag :type="getStatusTagType(service.status)" size="small" class="status-tag">
                                    <el-icon style="margin-right: 4px;">
                                        <component :is="getStatusIcon(service.status)" />
                                    </el-icon>
                                    {{ statusList[service.status] || service.status || '未知' }}
                                </el-tag>
                            </div>
                        </div>
                    </template>
                    <div class="card-body">
                        <div class="service-visual">
                            <div :class="['image-container', getServiceTypeClass(service.serviceType)]">
                                <el-icon class="service-type-icon">
                                    <component :is="getServiceTypeIcon(service.serviceType)" />
                                </el-icon>
                            </div>
                            <div class="visual-summary">
                                <span class="visual-title">{{ getServiceTypeText(service.serviceType) }}</span>
                                <span class="visual-desc">{{ getServiceSummary(service) }}</span>
                            </div>
                            <div class="visual-badges">
                                <div class="visual-badge">
                                    <span class="visual-badge-label">类型</span>
                                    <el-tag size="small" effect="plain">{{ service.serviceType || '--' }}</el-tag>
                                </div>
                                <div class="visual-badge">
                                    <span class="visual-badge-label">服务</span>
                                    <el-tag size="small" :type="getHealthTagType(service.healthy)" effect="plain">
                                        {{ getHealthText(service.healthy) }}
                                    </el-tag>
                                </div>
                                <div v-if="isDeviceConnectionVisible(service)" class="visual-badge">
                                    <span class="visual-badge-label">连接</span>
                                    <el-tooltip :content="getConnectionTip(service)" placement="top" :disabled="!service.deviceConnectionMessage">
                                        <el-tag size="small" :type="getConnectionTagType(service.deviceConnectionStatus)" effect="plain">
                                            {{ getConnectionText(service.deviceConnectionStatus) }}
                                        </el-tag>
                                    </el-tooltip>
                                </div>
                                <el-tooltip v-if="isPointDetailVisible(service)" content="查看PLC点位快照" placement="top">
                                    <span v-hasPermi="['plc:pktService:list']" class="point-entry-wrapper">
                                        <el-button class="point-entry" link type="primary" :icon="InfoFilled" size="small" @click="showPointDetail(service)" :loading="isPointDetailLoading(service)">
                                            点位快照
                                        </el-button>
                                    </span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="service-meta">
                            <div class="meta-time">
                                <div class="time-item">
                                    <span class="time-label">最近启动</span>
                                    <span class="time-value">{{ formatTime(service.lastStartTime) }}</span>
                                </div>
                                <div class="time-item">
                                    <span class="time-label">最近停止</span>
                                    <span class="time-value">{{ formatTime(service.lastStopTime) }}</span>
                                </div>
                                <template v-if="isDeviceConnectionVisible(service)">
                                    <div class="time-item">
                                        <span class="time-label">最近连接</span>
                                        <span class="time-value">{{ formatTime(service.lastConnectedTime) }}</span>
                                    </div>
                                    <div class="time-item">
                                        <span class="time-label">最近断开</span>
                                        <span class="time-value">{{ formatTime(service.lastDisconnectedTime) }}</span>
                                    </div>
                                </template>
                            </div>
                            <el-tooltip v-if="service.lastErrorMessage" :content="service.lastErrorMessage" placement="top" :show-after="200" popper-class="service-error-tooltip">
                                <div class="error-message">
                                    <el-icon><CircleCloseFilled /></el-icon>
                                    <span>{{ service.lastErrorMessage }}</span>
                                </div>
                            </el-tooltip>
                        </div>
                        <div class="actions">
                            <el-button-group>
                                <el-tooltip :content="getActionTip(service, 'start', '启动')" placement="top">
                                    <span v-hasPermi="['plc:pktService:operate']" class="action-wrapper">
                                        <el-button type="success" :icon="VideoPlay" size="small" @click="start(service)" :disabled="!canOperate(service, 'start')" :loading="isActionLoading(service.svcCode, 'start')">
                                            启动
                                        </el-button>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="getActionTip(service, 'stop', '停止')" placement="top">
                                    <span v-hasPermi="['plc:pktService:operate']" class="action-wrapper">
                                        <el-button type="danger" :icon="VideoPause" size="small" @click="stop(service)" :disabled="!canOperate(service, 'stop')" :loading="isActionLoading(service.svcCode, 'stop')">
                                            停止
                                        </el-button>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="getActionTip(service, 'pause', '暂停')" placement="top">
                                    <span v-hasPermi="['plc:pktService:operate']" class="action-wrapper">
                                        <el-button type="warning" :icon="Minus" size="small" @click="pause(service)" :disabled="!canOperate(service, 'pause')" :loading="isActionLoading(service.svcCode, 'pause')">
                                            暂停
                                        </el-button>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="getActionTip(service, 'resume', '恢复')" placement="top">
                                    <span v-hasPermi="['plc:pktService:operate']" class="action-wrapper">
                                        <el-button type="info" :icon="RefreshRight" size="small" @click="resume(service)" :disabled="!canOperate(service, 'resume')" :loading="isActionLoading(service.svcCode, 'resume')">
                                            恢复
                                        </el-button>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="getActionTip(service, 'restart', '重启')" placement="top">
                                    <span v-hasPermi="['plc:pktService:operate']" class="action-wrapper">
                                        <el-button type="primary" :icon="Refresh" size="small" @click="restart(service)" :disabled="!canOperate(service, 'restart')" :loading="isActionLoading(service.svcCode, 'restart')">
                                            重启
                                        </el-button>
                                    </span>
                                </el-tooltip>
                            </el-button-group>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-drawer v-model="pointDrawerVisible" :title="pointDrawerTitle" size="920px" append-to-body class="point-drawer-panel">
            <div class="point-drawer" v-loading="pointLoading">
                <div class="point-overview">
                    <div class="point-service">
                        <span class="overview-label">服务</span>
                        <strong>{{ selectedService?.svcName || selectedService?.svcCode || '--' }}</strong>
                        <span>{{ selectedService?.svcCode || '--' }}</span>
                    </div>
                    <div class="overview-item">
                        <span class="overview-label">连接</span>
                        <el-tag size="small" :type="getConnectionTagType(selectedService?.deviceConnectionStatus)" effect="plain">
                            {{ getConnectionText(selectedService?.deviceConnectionStatus) }}
                        </el-tag>
                    </div>
                    <div class="overview-item">
                        <span class="overview-label">最近采样</span>
                        <strong>{{ formatTime(pointSnapshot?.lastSampleTime) }}</strong>
                    </div>
                    <div class="overview-item compact">
                        <span class="overview-label">点位组</span>
                        <strong>{{ pointSnapshot?.groupCount ?? '--' }}</strong>
                    </div>
                    <div class="overview-item compact">
                        <span class="overview-label">点位数</span>
                        <strong>{{ pointSnapshot?.pointCount ?? '--' }}</strong>
                    </div>
                </div>
                <div class="point-toolbar">
                    <span class="point-hint">展示最近一次轮询成功后的只读快照，不会触发额外 PLC 读取。</span>
                    <el-button size="small" :icon="Refresh" @click="loadPointSnapshot()" :loading="pointLoading">刷新</el-button>
                </div>
                <el-table :data="pointRows" border stripe size="small" class="point-table" empty-text="暂无点位快照" :fit="false">
                    <el-table-column prop="groupName" label="点位组" width="150" show-overflow-tooltip />
                    <el-table-column prop="code" label="点位编码" width="160" show-overflow-tooltip />
                    <el-table-column prop="name" label="名称" width="190" show-overflow-tooltip />
                    <el-table-column prop="address" label="地址" width="190" show-overflow-tooltip />
                    <el-table-column prop="valueType" label="类型" width="90" />
                    <el-table-column label="当前值" width="130" show-overflow-tooltip>
                        <template #default="{ row }">
                            <span class="point-value">{{ formatPointValue(row.value) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="90">
                        <template #default="{ row }">
                            <el-tag size="small" :type="getPointStatusTagType(row.status)" effect="plain">
                                {{ getPointStatusText(row.status) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="采样时间" width="170">
                        <template #default="{ row }">
                            {{ formatTime(row.lastSampleTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="message" label="说明" width="160" show-overflow-tooltip />
                </el-table>
            </div>
        </el-drawer>
    </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    VideoPlay,
    VideoPause,
    Minus,
    RefreshRight,
    Refresh,
    SuccessFilled,
    CircleCloseFilled,
    WarningFilled,
    InfoFilled,
    ArrowRight,
    Cpu,
    Lock,
    Operation,
    Van,
    Box
} from '@element-plus/icons-vue'
import { serviceInfos, servicePoints, serviceStart, serviceStop, servicePause, serviceResume, serviceRestart } from "@/api/tool/serviceManager"

// 基础配置
const serviceList = ref([])
const loadingStates = reactive({})
const isRefreshing = ref(false)
const pointDrawerVisible = ref(false)
const pointLoading = ref(false)
const selectedService = ref(null)
const pointSnapshot = ref(null)
const timer = ref(5000)
let intervalId = null
let refreshPromise = null

const unwrapResponseData = (response) => {
    if (response && typeof response === 'object' && Object.prototype.hasOwnProperty.call(response, 'data')) {
        return response.data
    }
    return response
}

const unwrapResponseMessage = (response) => {
    return response?.msg
}

// 状态映射
const statusList = {
    'INIT': '初始化',
    'STARTING': '正在启动',
    'START_CRASHED': '启动崩溃',
    'RUNNING': '正在执行',
    'PAUSED': '已暂停',
    'STOPPING': '正在停止',
    'STOPPED': '已停止'
}

// 服务类型视觉映射
const serviceTypeTextMap = {
    PLC: 'PLC 设备',
    TLS: 'TLS 链路',
    CRANE: '天车服务',
    AGV: 'AGV 服务',
    OTHER: '通用服务'
}

const serviceTypeIconMap = {
    PLC: Cpu,
    TLS: Lock,
    CRANE: Operation,
    AGV: Van,
    OTHER: Box
}

const getServiceTypeText = (type) => {
    return serviceTypeTextMap[type] || type || '服务'
}

const getServiceTypeIcon = (type) => {
    return serviceTypeIconMap[type] || Box
}

const getServiceTypeClass = (type) => {
    return `type-${String(type || 'OTHER').toLowerCase()}`
}

const getServiceSummary = (service) => {
    if (isDeviceConnectionVisible(service)) {
        return `设备${getConnectionText(service.deviceConnectionStatus)}`
    }
    return `服务${getHealthText(service.healthy)}`
}

// 状态标签类型
const getStatusTagType = (status) => {
    const typeMap = {
        'RUNNING': 'success',
        'START_CRASHED': 'danger',
        'PAUSED': 'warning',
        'STOPPED': 'info',
        'STARTING': 'primary',
        'STOPPING': 'primary',
        'INIT': 'info'
    }
    return typeMap[status] || 'info'
}

// 状态图标
const getStatusIcon = (status) => {
    const iconMap = {
        'RUNNING': SuccessFilled,
        'START_CRASHED': CircleCloseFilled,
        'PAUSED': WarningFilled,
        'STOPPED': InfoFilled,
        'STARTING': ArrowRight,
        'STOPPING': ArrowRight,
        'INIT': InfoFilled
    }
    return iconMap[status] || InfoFilled
}

// 健康状态映射
const getHealthText = (healthy) => {
    if (healthy === true) return '健康'
    if (healthy === false) return '异常'
    return '未知'
}

const getHealthTagType = (healthy) => {
    if (healthy === true) return 'success'
    if (healthy === false) return 'danger'
    return 'info'
}

const isDeviceConnectionVisible = (service) => {
    return service?.deviceConnectionStatus && service.deviceConnectionStatus !== 'NOT_APPLICABLE'
}

const getConnectionText = (status) => {
    const textMap = {
        CONNECTING: '连接中',
        CONNECTED: '已连接',
        RECONNECTING: '重连中',
        DISCONNECTED: '已断开',
        NOT_APPLICABLE: '--'
    }
    return textMap[status] || '未知'
}

const getConnectionTagType = (status) => {
    const typeMap = {
        CONNECTING: 'warning',
        CONNECTED: 'success',
        RECONNECTING: 'warning',
        DISCONNECTED: 'danger',
        NOT_APPLICABLE: 'info'
    }
    return typeMap[status] || 'info'
}

const getConnectionTip = (service) => {
    return service?.deviceConnectionMessage || getConnectionText(service?.deviceConnectionStatus)
}

const isPointDetailVisible = (service) => {
    return service?.serviceType === 'PLC'
}

const pointDrawerTitle = computed(() => {
    const serviceName = selectedService.value?.svcName || selectedService.value?.svcCode || 'PLC服务'
    return `${serviceName} 点位快照`
})

const pointRows = computed(() => {
    return (pointSnapshot.value?.groups || []).flatMap(group => {
        return (group.points || []).map(point => ({
            ...point,
            groupCode: group.code,
            groupName: group.name,
            groupLastSampleTime: group.lastSampleTime
        }))
    })
})

const formatTime = (value) => {
    if (!value) return '--'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString('zh-CN', { hour12: false })
}

const formatPointValue = (value) => {
    if (value === null || value === undefined) return '--'
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
}

const getPointStatusText = (status) => {
    const textMap = {
        OK: '正常',
        WAITING: '等待'
    }
    return textMap[status] || status || '未知'
}

const getPointStatusTagType = (status) => {
    const typeMap = {
        OK: 'success',
        WAITING: 'info'
    }
    return typeMap[status] || 'danger'
}

const isPointDetailLoading = (service) => {
    return pointLoading.value && selectedService.value?.svcCode === service?.svcCode
}

const showPointDetail = async (service) => {
    selectedService.value = service
    pointSnapshot.value = null
    pointDrawerVisible.value = true
    await loadPointSnapshot(service)
}

const loadPointSnapshot = async (service = selectedService.value) => {
    if (!service?.svcCode) return
    pointLoading.value = true
    try {
        const response = await servicePoints(service.svcCode)
        if (!response || response.code === 200 || response.code === undefined) {
            pointSnapshot.value = unwrapResponseData(response)
        } else {
            ElMessage.error(unwrapResponseMessage(response) || '获取点位快照失败')
        }
    } catch (error) {
        console.error('获取点位快照失败:', error)
        if (!error?.response?.data?.msg) {
            ElMessage.error('获取点位快照失败')
        }
    } finally {
        pointLoading.value = false
    }
}

// 获取服务列表
const getList = async ({ silent = false, force = false } = {}) => {
    if (refreshPromise) {
        if (!force) {
            return refreshPromise
        }
        await refreshPromise
    }
    isRefreshing.value = true
    refreshPromise = (async () => {
        try {
            const response = await serviceInfos()
            const services = unwrapResponseData(response)
            serviceList.value = Array.isArray(services) ? services : []
        } catch (error) {
            console.error('获取服务列表失败:', error)
            if (!silent) {
                ElMessage.error('获取服务列表失败')
            }
        } finally {
            isRefreshing.value = false
            refreshPromise = null
        }
    })()
    return refreshPromise
}

// 设置加载状态
const setLoading = (svcCode, action, loading = true) => {
    if (!loadingStates[svcCode]) {
        loadingStates[svcCode] = {}
    }
    loadingStates[svcCode][action] = loading
}

const isActionLoading = (svcCode, action) => {
    return Boolean(loadingStates[svcCode]?.[action])
}

const isServiceBusy = (svcCode) => {
    return Object.values(loadingStates[svcCode] || {}).some(Boolean)
}

const canOperate = (service, action) => {
    return Boolean(service?.svcCode && service.capabilities?.[action] && !isServiceBusy(service.svcCode))
}

const getActionTip = (service, action, actionName) => {
    if (isServiceBusy(service?.svcCode)) return '当前服务操作执行中'
    if (!service?.capabilities?.[action]) {
        if (service?.serviceType === 'TLS' && ['pause', 'resume'].includes(action)) {
            return 'TLS 服务不支持暂停/恢复'
        }
        if (action === 'resume') return '仅暂停状态可恢复'
        if (action === 'pause') return '仅运行状态可暂停'
        if (action === 'start') return '仅停止状态可启动'
        if (action === 'stop') return '仅运行或暂停状态可停止'
        if (action === 'restart') return '当前状态不可重启'
        return `当前状态不可${actionName}`
    }
    return actionName
}

// 统一处理响应
const handleResponse = async (response, action) => {
    if (!response || response.code === 200 || response.code === undefined) {
        ElMessage.success(`${action}成功`)
        await getList({ silent: true, force: true })
    } else {
        ElMessage.error(unwrapResponseMessage(response) || `${action}失败`)
    }
}

const confirmOperation = async (service, actionName) => {
    const serviceName = service.svcName || service.svcCode
    await ElMessageBox.confirm(
        `确认${actionName}服务「${serviceName}」？该操作可能影响现场业务。`,
        `${actionName}确认`,
        {
            confirmButtonText: `确认${actionName}`,
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
}

const executeOperation = async (service, action, actionName, requestFn, options = {}) => {
    const svcCode = service?.svcCode
    if (!canOperate(service, action)) {
        return
    }
    setLoading(svcCode, action)
    try {
        if (options.confirm) {
            try {
                await confirmOperation(service, actionName)
            } catch {
                return
            }
        }
        const response = await requestFn(svcCode)
        await handleResponse(response, actionName)
    } catch (error) {
        console.error(`${actionName}服务失败:`, error)
        if (!error?.response?.data?.msg) {
            ElMessage.error(`${actionName}服务失败`)
        }
    } finally {
        setLoading(svcCode, action, false)
    }
}

// 服务操作
const start = (service) => {
    executeOperation(service, 'start', '启动', serviceStart)
}

const stop = (service) => {
    executeOperation(service, 'stop', '停止', serviceStop, { confirm: true })
}

const pause = (service) => {
    executeOperation(service, 'pause', '暂停', servicePause)
}

const resume = (service) => {
    executeOperation(service, 'resume', '恢复', serviceResume)
}

const restart = (service) => {
    executeOperation(service, 'restart', '重启', serviceRestart, { confirm: true })
}

// 生命周期钩子
onMounted(() => {
    getList()
    intervalId = setInterval(() => {
        getList({ silent: true })
    }, timer.value)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>
<style lang="scss" scoped>
.service-manager-container {
    min-height: calc(100vh - 84px);
    padding: 20px;
    background-color: var(--el-bg-color-page);
}

.service-list {
    display: flex;
    flex-wrap: wrap;
}

.service-card-col {
    display: flex;
    margin-bottom: 16px;
}

:deep(.el-card) {
    //缩小边距
    .el-card__body {
        padding: 15px 0 !important;
    }
}
.service-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid var(--el-border-color-light);

    :deep(.el-card__body) {
        flex: 1;
        display: flex;
        padding: 15px 0 !important;
    }

    :deep(.el-card__header) {
        padding: 0 !important;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: linear-gradient(180deg, var(--el-bg-color), var(--el-fill-color-extra-light));
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--el-box-shadow-light) !important;
        border-color: var(--el-border-color);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 82px;
        padding: 16px 22px;

        .service-title {
            min-width: 0;
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 6px;
            margin-right: 12px;
        }

        .service-name {
            font-size: 18px;
            font-weight: 600;
            line-height: 1.2;
            color: var(--el-text-color-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .service-code {
            max-width: 100%;
            overflow: hidden;
            color: var(--el-text-color-secondary);
            font-size: 13px;
            line-height: 1.2;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .status-stack {
            flex-shrink: 0;
        }

        .status-tag {
            height: 28px;
            padding: 0 12px;
            flex-shrink: 0;
            font-weight: 500;
            border-radius: 6px;
        }
    }

    .card-body {
        flex: 1;
        width: 100%;
        padding: 14px 12px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 10px;

        .service-visual {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 12px;
            width: 100%;
            min-height: 58px;
            padding: 10px 12px;
            border: 1px solid var(--el-border-color-extra-light);
            border-radius: 6px;
            background: linear-gradient(180deg, var(--el-fill-color-extra-light), var(--el-bg-color));
        }

        .image-container {
            flex: 0 0 40px;
            padding: 8px;
            background: linear-gradient(
                135deg,
                var(--el-color-primary-light-9),
                var(--el-color-primary-light-8)
            );
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            color: var(--el-color-primary);

            &.type-tls {
                background: linear-gradient(135deg, var(--el-color-success-light-9), var(--el-color-success-light-8));
                color: var(--el-color-success);
            }

            &.type-crane {
                background: linear-gradient(135deg, var(--el-color-warning-light-9), var(--el-color-warning-light-8));
                color: var(--el-color-warning);
            }

            &.type-agv {
                background: linear-gradient(135deg, var(--el-color-info-light-9), var(--el-color-info-light-8));
                color: var(--el-color-info);
            }

            &.type-other {
                background: linear-gradient(135deg, var(--el-fill-color-light), var(--el-fill-color));
                color: var(--el-text-color-secondary);
            }
        }

        .service-type-icon {
            font-size: 22px;
        }

        .visual-summary {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex: 1;
            gap: 1px;
            min-width: 0;
            max-width: 240px;
        }

        .visual-title {
            color: var(--el-text-color-primary);
            font-size: 13px;
            font-weight: 600;
            line-height: 1.25;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .visual-desc {
            color: var(--el-text-color-secondary);
            font-size: 12px;
            line-height: 1.25;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .visual-badges {
            display: flex;
            flex: 1 1 260px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;
            gap: 6px 8px;
            min-width: 180px;
        }

        .visual-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            min-width: 0;
            padding: 2px 0;
            white-space: nowrap;
        }

        .visual-badge-label {
            color: var(--el-text-color-secondary);
            font-size: 12px;
        }

        .service-meta {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 0 4px;
            color: var(--el-text-color-regular);
            font-size: 12px;
            line-height: 1.4;
        }

        .meta-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 6px;
        }

        .point-entry-wrapper {
            display: inline-flex;
            align-items: center;
            margin-left: 2px;
        }

        .point-entry {
            height: 22px;
            padding: 0 2px;
            font-size: 12px;
            font-weight: 500;
            vertical-align: middle;

            :deep(.el-icon) {
                margin-right: 3px;
            }
        }

        .meta-label {
            color: var(--el-text-color-secondary);
        }

        .meta-time {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 5px;
        }

        .time-item {
            display: flex;
            min-width: 0;
            flex-direction: column;
            gap: 2px;
            padding: 4px 7px;
            border-radius: 5px;
            background-color: var(--el-fill-color-lighter);
        }

        .time-label {
            color: var(--el-text-color-secondary);
        }

        .time-value {
            overflow: hidden;
            color: var(--el-text-color-regular);
            font-variant-numeric: tabular-nums;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .error-message {
            display: flex;
            align-items: center;
            gap: 4px;
            max-width: 100%;
            padding: 6px 8px;
            border-radius: 6px;
            background-color: var(--el-color-danger-light-9);
            color: var(--el-color-danger);

            span {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .actions {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: auto;
            padding-top: 0;

            .el-button-group {
                display: flex;
                flex-wrap: nowrap;
                gap: 6px;
                justify-content: center;
                max-width: 100%;

                .action-wrapper {
                    display: inline-flex;
                    flex: 0 0 auto;
                }

                .el-button {
                    margin: 0;
                    border-radius: 6px;
                    min-width: 56px;
                    height: 28px;
                    padding: 7px 10px;

                    &:focus-visible {
                        outline: 2px solid var(--el-color-primary);
                        outline-offset: 2px;
                    }
                }
            }
        }
    }
}

:global(.service-error-tooltip) {
    max-width: min(420px, calc(100vw - 32px));
    line-height: 1.5;
    white-space: normal;
    word-break: break-word;
}

:global(.point-drawer-panel) {
    max-width: calc(100vw - 32px);

    .el-drawer__header {
        margin-bottom: 0;
        padding: 22px 24px 14px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        color: var(--el-text-color-primary);
        font-size: 18px;
        font-weight: 600;
    }

    .el-drawer__body {
        padding: 18px 24px 24px;
    }
}

.point-drawer {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.point-overview {
    display: grid;
    grid-template-columns: minmax(240px, 1.4fr) minmax(120px, 0.55fr) minmax(190px, 0.95fr) repeat(2, minmax(82px, 0.35fr));
    gap: 8px;
}

.point-service,
.overview-item {
    min-width: 0;
    min-height: 64px;
    padding: 9px 12px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;
    background-color: var(--el-fill-color-extra-light);
}

.point-service,
.overview-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;

    strong {
        min-width: 0;
        overflow: hidden;
        color: var(--el-text-color-primary);
        font-size: 14px;
        font-weight: 600;
        line-height: 1.25;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.point-service span:last-child {
    min-width: 0;
    overflow: hidden;
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.overview-item.compact {
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 3px;

    strong {
        color: var(--el-color-primary);
        font-size: 18px;
        line-height: 1.05;
    }
}

.overview-label {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.2;
}

.point-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.point-hint {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.4;
}

.point-table {
    width: 100%;

    :deep(.el-table__header th) {
        background-color: var(--el-fill-color-light);
        color: var(--el-text-color-regular);
        font-weight: 600;
    }

    :deep(.el-table__cell) {
        padding: 8px 0;
    }
}

.point-value {
    color: var(--el-text-color-primary);
    font-family: Consolas, Monaco, "Courier New", monospace;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

// 响应式设计
@media (max-width: 1200px) {
    .service-card-col {
        .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            .service-title {
                width: 100%;
                margin-right: 0;
            }
        }
    }
}

@media (max-width: 768px) {
    .service-manager-container {
        padding: 16px;
    }

    .point-toolbar {
        align-items: flex-start;
        flex-direction: column;
    }

    .point-overview {
        grid-template-columns: 1fr 1fr;
    }

    .point-service {
        grid-column: 1 / -1;
    }

    .service-card-col {
        width: 100%;

        .service-card {
            .card-header {
                min-height: 72px;
                padding: 12px 14px;
                .service-name {
                    font-size: 16px;
                }
            }

            .card-body {
                padding: 12px 10px;
                gap: 10px;

                .service-visual {
                    flex-wrap: wrap;
                    min-height: 48px;
                    padding: 8px;
                }

                .visual-summary {
                    max-width: calc(100% - 50px);
                }

                .visual-badges {
                    flex-basis: 100%;
                    justify-content: flex-start;
                    min-width: 0;
                }

                .image-container {
                    flex-basis: 38px;
                    width: 38px;
                    height: 38px;
                    padding: 7px;
                }

                .service-type-icon {
                    font-size: 20px;
                }

                .meta-time {
                    grid-template-columns: 1fr;
                }

                .actions .el-button-group {
                    flex-wrap: nowrap;
                    gap: 6px;

                    .action-wrapper {
                        flex: 0 0 auto;
                        justify-content: center;
                    }

                    .el-button {
                        font-size: 12px;
                        height: 30px;
                        padding: 7px 10px;
                        min-width: 50px;
                    }
                }
            }
        }
    }
}

@media (max-width: 480px) {
    .service-card-col {
        .service-card .card-body .actions .el-button-group {
            flex-direction: column;
            align-items: center;
            width: 100%;

            .action-wrapper {
                width: 100%;
                max-width: 120px;
            }

            .el-button {
                width: 100%;
                max-width: 120px;
            }
        }
    }
}
</style>
