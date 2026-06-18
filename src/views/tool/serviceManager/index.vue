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
                        <div class="image-container">
                            <img src="@/assets/images/img-server.png" alt="service icon" class="service-icon">
                        </div>
                        <div class="service-meta">
                            <div class="meta-row">
                                <span class="meta-label">类型</span>
                                <el-tag size="small" effect="plain">{{ service.serviceType || '--' }}</el-tag>
                                <span class="meta-label">健康</span>
                                <el-tag size="small" :type="getHealthTagType(service.healthy)" effect="plain">
                                    {{ getHealthText(service.healthy) }}
                                </el-tag>
                            </div>
                            <div class="meta-time">
                                <span>启动 {{ formatTime(service.lastStartTime) }}</span>
                                <span>停止 {{ formatTime(service.lastStopTime) }}</span>
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
                                    <span v-hasPermi="['pkt:service:start']" class="action-wrapper">
                                        <el-button type="success" :icon="VideoPlay" size="small" @click="start(service)" :disabled="!canOperate(service, 'start')" :loading="isActionLoading(service.svcCode, 'start')">
                                            启动
                                        </el-button>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="getActionTip(service, 'stop', '停止')" placement="top">
                                    <span v-hasPermi="['pkt:service:stop']" class="action-wrapper">
                                        <el-button type="danger" :icon="VideoPause" size="small" @click="stop(service)" :disabled="!canOperate(service, 'stop')" :loading="isActionLoading(service.svcCode, 'stop')">
                                            停止
                                        </el-button>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="getActionTip(service, 'pause', '暂停')" placement="top">
                                    <span v-hasPermi="['pkt:service:pause']" class="action-wrapper">
                                        <el-button type="warning" :icon="Minus" size="small" @click="pause(service)" :disabled="!canOperate(service, 'pause')" :loading="isActionLoading(service.svcCode, 'pause')">
                                            暂停
                                        </el-button>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="getActionTip(service, 'resume', '恢复')" placement="top">
                                    <span v-hasPermi="['pkt:service:resume']" class="action-wrapper">
                                        <el-button type="info" :icon="RefreshRight" size="small" @click="resume(service)" :disabled="!canOperate(service, 'resume')" :loading="isActionLoading(service.svcCode, 'resume')">
                                            恢复
                                        </el-button>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="getActionTip(service, 'restart', '重启')" placement="top">
                                    <span v-hasPermi="['pkt:service:restart']" class="action-wrapper">
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
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
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
    ArrowRight
} from '@element-plus/icons-vue'
import { serviceInfos, serviceStart, serviceStop, servicePause, serviceResume, serviceRestart } from "@/api/tool/serviceManager"

// 基础配置
const basUrl = ref(window.global_config?.wcs || '')
const serviceList = ref([])
const loadingStates = reactive({})
const isRefreshing = ref(false)
const timer = ref(5000)
let intervalId = null
let refreshPromise = null

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

const formatTime = (value) => {
    if (!value) return '--'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString('zh-CN', { hour12: false })
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
            const response = await serviceInfos({}, { customBaseURL: basUrl.value })
            serviceList.value = Array.isArray(response?.data) ? response.data : []
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
    if (response?.code === 200) {
        ElMessage.success(`${action}成功`)
        await getList({ silent: true, force: true })
    } else {
        ElMessage.error(response?.msg || `${action}失败`)
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
        const response = await requestFn(svcCode, { customBaseURL: basUrl.value })
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
    margin-bottom: 16px;
}

:deep(.el-card) {
    //缩小边距
    .el-card__body {
        padding: 15px 0 !important;
    }
}
.service-card {
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid var(--el-border-color-light);

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--el-box-shadow-light) !important;
        border-color: var(--el-border-color);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 10px;
        // border-bottom: 1px solid var(--el-border-color-lighter);

        .service-title {
            min-width: 0;
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 4px;
            margin-right: 12px;
        }

        .service-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .service-code {
            max-width: 100%;
            overflow: hidden;
            color: var(--el-text-color-secondary);
            font-size: 12px;
            line-height: 1.2;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .status-stack {
            flex-shrink: 0;
        }

        .status-tag {
            flex-shrink: 0;
            font-weight: 500;
            border-radius: 6px;
        }
    }

    .card-body {
        padding: 24px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        .image-container {
            padding: 16px;
            background: linear-gradient(
                135deg,
                var(--el-color-primary-light-9),
                var(--el-color-primary-light-8)
            );
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
        }

        .service-icon {
            width: 48px;
            height: 48px;
            object-fit: contain;
        }

        .service-meta {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0 10px;
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

        .meta-label {
            color: var(--el-text-color-secondary);
        }

        .meta-time {
            display: grid;
            grid-template-columns: 1fr;
            gap: 4px;
            color: var(--el-text-color-secondary);
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

            .el-button-group {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;

                .action-wrapper {
                    display: inline-flex;
                }

                .el-button {
                    margin: 0;
                    border-radius: 6px;
                    min-width: 60px;

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

    .service-card-col {
        width: 100%;

        .service-card {
            .card-header {
                padding: 12px 12px;
                .service-name {
                    font-size: 15px;
                }
            }

            .card-body {
                padding: 20px 10px;
                gap: 16px;

                .image-container {
                    width: 60px;
                    height: 60px;
                    padding: 12px;
                }

                .service-icon {
                    width: 36px;
                    height: 36px;
                }

                .actions .el-button-group {
                    gap: 6px;

                    .action-wrapper {
                        flex: 1 1 72px;
                        justify-content: center;
                    }

                    .el-button {
                        font-size: 12px;
                        padding: 8px 12px;
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
