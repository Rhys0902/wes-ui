import request from '@/utils/request'

// 查询知识库文档列表
export function listAssistantKnowledge(query) {
  return request({
    url: '/assistant/assistantKnowledge/list',
    method: 'get',
    params: query
  })
}

// 查询知识库文档详情
export function getAssistantKnowledge(id) {
  return request({
    url: '/assistant/assistantKnowledge/' + id,
    method: 'get'
  })
}

// 查询文档切片列表；用于详情页查看切片文本、向量点ID和入库状态
export function listAssistantKnowledgeChunk(query) {
  return request({
    url: '/assistant/assistantKnowledge/chunk/list',
    method: 'get',
    params: query
  })
}

// 上传知识库文档；后端使用 @RequestPart("file") 接收 MultipartFile
export function uploadAssistantKnowledge(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/assistant/assistantKnowledge/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 更新知识库文档可见范围
export function updateAssistantKnowledgeVisibility(id, data) {
  return request({
    url: '/assistant/assistantKnowledge/' + id + '/visibility',
    method: 'put',
    data
  })
}

// 删除知识库文档
export function delAssistantKnowledge(id) {
  return request({
    url: '/assistant/assistantKnowledge/' + id,
    method: 'delete'
  })
}

// 查询知识库入库任务列表
export function listAssistantKnowledgeTask(query) {
  return request({
    url: '/assistant/assistantKnowledge/task/list',
    method: 'get',
    params: query
  })
}

// 失败任务重试
export function retryAssistantKnowledgeTask(taskId) {
  return request({
    url: '/assistant/assistantKnowledge/task/' + taskId + '/retry',
    method: 'post'
  })
}
