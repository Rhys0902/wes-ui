import request from '@/utils/request'

// 查询补货分配列表
export function listReplAllocation(query) {
  return request({
    url: '/repl/replAllocation/list',
    method: 'get',
    params: query
  })
}

// 查询补货分配详细
export function getReplAllocation(id) {
  return request({
    url: '/repl/replAllocation/' + id,
    method: 'get'
  })
}

// 新增补货分配
export function addReplAllocation(data) {
  return request({
    url: '/repl/replAllocation',
    method: 'post',
    data: data
  })
}

// 修改补货分配
export function updateReplAllocation(data) {
  return request({
    url: '/repl/replAllocation',
    method: 'put',
    data: data
  })
}

// 删除补货分配
export function delReplAllocation(id) {
  return request({
    url: '/repl/replAllocation/' + id,
    method: 'delete'
  })
}
