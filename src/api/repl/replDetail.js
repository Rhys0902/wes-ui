import request from '@/utils/request'

// 查询补货明细列表
export function listReplDetail(query) {
  return request({
    url: '/repl/replDetail/list',
    method: 'get',
    params: query
  })
}

// 查询补货明细详细
export function getReplDetail(id) {
  return request({
    url: '/repl/replDetail/' + id,
    method: 'get'
  })
}

// 新增补货明细
export function addReplDetail(data) {
  return request({
    url: '/repl/replDetail',
    method: 'post',
    data: data
  })
}

// 修改补货明细
export function updateReplDetail(data) {
  return request({
    url: '/repl/replDetail',
    method: 'put',
    data: data
  })
}

// 删除补货明细
export function delReplDetail(id) {
  return request({
    url: '/repl/replDetail/' + id,
    method: 'delete'
  })
}
