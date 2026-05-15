import request from '@/utils/request'

// 查询补货交易列表
export function listReplTrans(query) {
  return request({
    url: '/repl/replTrans/list',
    method: 'get',
    params: query
  })
}

// 查询补货交易详细
export function getReplTrans(id) {
  return request({
    url: '/repl/replTrans/' + id,
    method: 'get'
  })
}

// 新增补货交易
export function addReplTrans(data) {
  return request({
    url: '/repl/replTrans',
    method: 'post',
    data: data
  })
}

// 修改补货交易
export function updateReplTrans(data) {
  return request({
    url: '/repl/replTrans',
    method: 'put',
    data: data
  })
}

// 删除补货交易
export function delReplTrans(id) {
  return request({
    url: '/repl/replTrans/' + id,
    method: 'delete'
  })
}
