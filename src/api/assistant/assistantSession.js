import request from '@/utils/request'

// 查询AI助手会话列表
export function listAssistantSession(query) {
  return request({
    url: '/assistant/assistantSession/list',
    method: 'get',
    params: query
  })
}

// 查询AI助手会话详细
export function getAssistantSession(id) {
  return request({
    url: '/assistant/assistantSession/' + id,
    method: 'get'
  })
}

// 查询AI助手会话消息
export function listAssistantMessages(sessionId, query) {
  return request({
    url: `/assistant/assistantSession/${sessionId}/messages`,
    method: 'get',
    params: query
  })
}

// 新增AI助手会话
export function addAssistantSession(data) {
  return request({
    url: '/assistant/assistantSession',
    method: 'post',
    data
  })
}

// 修改AI助手会话
export function updateAssistantSession(data) {
  return request({
    url: '/assistant/assistantSession',
    method: 'put',
    data
  })
}

// 删除AI助手会话
export function delAssistantSession(id) {
  return request({
    url: '/assistant/assistantSession/' + id,
    method: 'delete'
  })
}
