import request from '@/utils/request'

// 获取AI助手总开关状态
export function getAssistantEnabled() {
  return request({
    url: '/assistant/assistantChat/enabled',
    method: 'get'
  })
}

// 获取AI助手欢迎页业务概览指标
export function getAssistantOverview() {
  return request({
    url: '/assistant/assistantChat/overview',
    method: 'get'
  })
}

// 发送AI助手聊天消息
export function sendAssistantChat(data) {
  return request({
    url: '/assistant/assistantChat/send',
    method: 'post',
    data,
    headers: {
      repeatSubmit: false
    }
  })
}

// 停止AI助手输出
export function stopAssistantChat(data) {
  return request({
    url: '/assistant/assistantChat/stop',
    method: 'post',
    data
  })
}
