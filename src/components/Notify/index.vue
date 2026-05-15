<template>
    <div class="message_main cursor-pointer" @click="openDown" ref="messageBox">
        <el-badge :is-dot="data==''?false:true" class="item">
            <el-popover :visible="visible" placement="top-start" title="" :width="250" trigger="hover">
                <template #reference>
                    <el-icon style="font-weight: 700;color:#4c4f53;font-size: 18px;position: absolute; right:0px">
                        <BellFilled />
                    </el-icon>
                </template>
                <div class="switch-container">
                    <el-switch v-model="wsEnabled" active-text="开启" inactive-text="关闭" @change="handleWsToggle" />
                </div>
                <!-- 头部选项 -->
                <el-card shadow="never" class="box-card" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                    <div class="box" v-if="data">
                        <p style="color:#1890ff" class="text-center">
                            <el-icon style="vertical-align: middle">
                                <WarningFilled />
                            </el-icon>
                            消息通知
                        </p>
                        <div class="notification_text">
                            <!-- 消息内容 -->
                            <div class="text text-center">
                                {{data}}
                            </div>
                        </div>
                    </div>
                    <div class="box" v-else>
                        <p class="text-center"> <i class="el-icon-warning-outline"></i> 当前暂无消息！</p>
                    </div>
                </el-card>
            </el-popover>
        </el-badge>
    </div>
</template>
<script setup>
import { initWebSocket, closeWebSocket, resetHeart } from '@/utils/websocket'

const noticeCount = ref(false)
const visible = ref(false)
const data = ref('')
const timeLeft = ref(5)
const timer = ref(null)
const websocket = ref(null)
const wsEnabled = ref(false)

const handleWsToggle = (value) => {
    if (value) {
        // 开启websocket连接
        websocket.value = initWebSocket(window.global_config["websocket"] + '/resource/websocket')
        websocket.value.onmessage = (e) => {
            if (e.data.indexOf("heartbeat") > 0) {
                resetHeart()
            }
            if (e.data.indexOf("ping") > 0) {
                return
            }
            handleMessage(e.data) // 处理接收到的消息
        }
    } else {
        // 关闭websocket连接
        closeWebSocket()
        websocket.value = null
    }
}

onMounted(() => {
    // let protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    if (wsEnabled.value) {
        websocket.value = initWebSocket(window.global_config["websocket"] + '/resource/websocket')
        websocket.value.onmessage = (e) => {
            if (e.data.indexOf("heartbeat") > 0) {
                resetHeart()
            }
            if (e.data.indexOf("ping") > 0) {
                return
            }
            handleMessage(e.data) // 处理接收到的消息
        }
    }
})
function handleMessage(e) {
    visible.value = true
    data.value = e
    noticeCount.value = true
    handleMouseLeave()
}

//弹出框显示与隐藏
function openDown() {
    visible.value = !visible.value
}
// 计时器触发
function startTimer() {
    timer.value = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--
        } else {
            clearInterval(timer.value)
            visible.value = false
        }
    }, 1000)
}

function formatTimestamp(timestamp) {
    // 创建一个新的 Date 对象
    const date = new Date(timestamp)
    // 获取年份、月份、日期、小时、分钟和秒数
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，所以需要加1
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    // 拼接成所需的格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 鼠标移入
function handleMouseEnter() {
    visible.value = true
    clearTimeout(timer.value) // 清除之前的定时器
}
// 鼠标移出
function handleMouseLeave() {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
        visible.value = false
        noticeCount.value = false
        data.value = ''
    }, 2500) // 设置五秒后自动隐藏
}

</script>
<style lang="scss" scoped>
.message_main {
    height: 100%;
    display: inline-block;
    vertical-align: text-bottom;
    margin: 0 5px;
    width: 20px;
    position: relative;
    .item {
        position: absolute;
        top: 50%;
        height: 20px;
        right: 0px;
        margin-top: -9px;
    }
}

.switch-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    padding: 0 10px;
}
.warning {
    color: red;
}
.success {
    color: #37ab37;
}

.box {
    p {
        margin: 10px 0;
    }
}
:deep(.el-card__body) {
    padding: 5px !important;
}
</style>

