import request from '@/utils/request'

// 查询AI助手模型配置列表
export function listAssistantModelConfig(query) {
  return request({
    url: '/assistant/assistantModelConfig/list',
    method: 'get',
    params: query
  })
}

// 查询AI助手模型配置详细
export function getAssistantModelConfig(id) {
  return request({
    url: '/assistant/assistantModelConfig/' + id,
    method: 'get'
  })
}

// 新增AI助手模型配置
export function addAssistantModelConfig(data) {
  return request({
    url: '/assistant/assistantModelConfig',
    method: 'post',
    data
  })
}

// 修改AI助手模型配置
export function updateAssistantModelConfig(data) {
  return request({
    url: '/assistant/assistantModelConfig',
    method: 'put',
    data
  })
}

// 删除AI助手模型配置
export function delAssistantModelConfig(id) {
  return request({
    url: '/assistant/assistantModelConfig/' + id,
    method: 'delete'
  })
}

// 测试AI助手模型配置
export function testAssistantModelConfig(id) {
  return request({
    url: '/assistant/assistantModelConfig/test/' + id,
    method: 'post'
  })
}

// 设置默认AI助手模型
export function setDefaultAssistantModelConfig(id) {
  return request({
    url: '/assistant/assistantModelConfig/setDefault/' + id,
    method: 'put'
  })
}

// 启停AI助手模型配置
export function changeAssistantModelConfigStatus(data) {
  return request({
    url: '/assistant/assistantModelConfig/changeStatus',
    method: 'put',
    data
  })
}
