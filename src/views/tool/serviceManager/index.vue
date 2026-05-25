<template>
    <div class="app-container service-manager-container">
        <el-row :gutter="16" class="service-list">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(service, index) in serviceList" :key="service.svcCode || index" class="service-card-col">
                <el-card shadow="hover" class="service-card">
                    <template #header>
                        <div class="card-header">
                            <div><span class="service-name">{{ service.svcName }}</span></div>
                            <div>
                                <el-tag :type="getStatusTagType(service.status)" size="small" class="status-tag">
                                    <el-icon :class="getStatusIcon(service.status)" style="margin-right: 4px;">
                                        <component :is="getStatusIcon(service.status)" />
                                    </el-icon>
                                    {{ statusList[service.status] }}
                                </el-tag>
                            </div>
                        </div>
                    </template>
                    <div class="card-body">
                        <div class="image-container">
                            <img src="@/assets/images/img-server.png" alt="service icon" class="service-icon">
                        </div>
                        <div class="actions">
                            <el-button-group>
                                <el-tooltip content="启动" placement="top">
                                    <el-button type="success" :icon="VideoPlay" size="small" @click="start(service.svcCode)" :disabled="service.status === 'RUNNING'" :loading="loadingStates[service.svcCode]?.start">
                                        启动
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="停止" placement="top">
                                    <el-button type="danger" :icon="VideoPause" size="small" @click="stop(service.svcCode)" :disabled="service.status == 'STOPPED'" :loading="loadingStates[service.svcCode]?.stop">
                                        停止
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="暂停" placement="top">
                                    <el-button type="warning" :icon="Minus" size="small" @click="pause(service.svcCode)" :disabled="service.status !== 'RUNNING'" :loading="loadingStates[service.svcCode]?.pause">
                                        暂停
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="恢复" placement="top">
                                    <el-button type="info" :icon="RefreshRight" size="small" @click="resume(service.svcCode)" :disabled="service.status !== 'PAUSED'" :loading="loadingStates[service.svcCode]?.resume">
                                        恢复
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip content="重启" placement="top">
                                    <el-button type="primary" :icon="Refresh" size="small" @click="restart(service.svcCode)" :loading="loadingStates[service.svcCode]?.restart">
                                        重启
                                    </el-button>
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
import { ElMessage } from 'element-plus'
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
const timer = ref(5000)
let intervalId = null
console.log(basUrl.value)

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

// 获取服务列表
const getList = async () => {
    try {
        const response = await serviceInfos({}, { customBaseURL: basUrl.value })
        serviceList.value = response.data || []
    } catch (error) {
        console.error('获取服务列表失败:', error)
        ElMessage.error('获取服务列表失败')
    }
}

// 设置加载状态
const setLoading = (svcCode, action, loading = true) => {
    if (!loadingStates[svcCode]) {
        loadingStates[svcCode] = {}
    }
    loadingStates[svcCode][action] = loading
}

// 统一处理响应
const handleResponse = (response, action) => {
    if (response.data) {
        ElMessage.success(`${action}成功`)
        getList() // 操作成功后刷新列表
    } else {
        ElMessage.error(`${action}失败`)
    }
}

// 服务操作
const start = async (svcCode) => {
    setLoading(svcCode, 'start')
    try {
        const response = await serviceStart({ svcCode }, { customBaseURL: basUrl.value })
        handleResponse(response, '启动')
    } catch (error) {
        console.error('启动服务失败:', error)
        ElMessage.error('启动服务失败')
    } finally {
        setLoading(svcCode, 'start', false)
    }
}

const stop = async (svcCode) => {
    setLoading(svcCode, 'stop')
    try {
        const response = await serviceStop({ svcCode }, { customBaseURL: basUrl.value })
        handleResponse(response, '停止')
    } catch (error) {
        console.error('停止服务失败:', error)
        ElMessage.error('停止服务失败')
    } finally {
        setLoading(svcCode, 'stop', false)
    }
}

const pause = async (svcCode) => {
    setLoading(svcCode, 'pause')
    try {
        const response = await servicePause({ svcCode }, { customBaseURL: basUrl.value })
        handleResponse(response, '暂停')
    } catch (error) {
        console.error('暂停服务失败:', error)
        ElMessage.error('暂停服务失败')
    } finally {
        setLoading(svcCode, 'pause', false)
    }
}

const resume = async (svcCode) => {
    setLoading(svcCode, 'resume')
    try {
        const response = await serviceResume({ svcCode }, { customBaseURL: basUrl.value })
        handleResponse(response, '恢复')
    } catch (error) {
        console.error('恢复服务失败:', error)
        ElMessage.error('恢复服务失败')
    } finally {
        setLoading(svcCode, 'resume', false)
    }
}

const restart = async (svcCode) => {
    setLoading(svcCode, 'restart')
    try {
        const response = await serviceRestart({ svcCode }, { customBaseURL: basUrl.value })
        handleResponse(response, '重启')
    } catch (error) {
        console.error('重启服务失败:', error)
        ElMessage.error('重启服务失败')
    } finally {
        setLoading(svcCode, 'restart', false)
    }
}

// 生命周期钩子
onMounted(() => {
    getList()
    intervalId = setInterval(() => {
        getList()
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
    border-radius: 12px;
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

        .service-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            flex: 1;
            margin-right: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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

        .actions {
            width: 100%;
            display: flex;
            justify-content: center;

            .el-button-group {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;

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

// 响应式设计
@media (max-width: 1200px) {
    .service-card-col {
        .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            .service-name {
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
            width: 100%;

            .el-button {
                width: 100%;
                max-width: 120px;
            }
        }
    }
}
</style>
