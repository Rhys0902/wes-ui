import request from '@/utils/request'

// 查询补货单头列表
export function listReplHeader(query) {
  return request({
    url: '/repl/replHeader/list',
    method: 'get',
    params: query
  })
}

// 查询补货单头详细
export function getReplHeader(id) {
  return request({
    url: '/repl/replHeader/' + id,
    method: 'get'
  })
}

// 新增补货单头
export function addReplHeader(data) {
  return request({
    url: '/repl/replHeader',
    method: 'post',
    data: data
  })
}

// 修改补货单头
export function updateReplHeader(data) {
  return request({
    url: '/repl/replHeader',
    method: 'put',
    data: data
  })
}

// 删除补货单头
export function delReplHeader(id) {
  return request({
    url: '/repl/replHeader/' + id,
    method: 'delete'
  })
}
