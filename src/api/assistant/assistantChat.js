import request from '@/utils/request'

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
