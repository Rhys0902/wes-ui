import request from '@/utils/request'

// 查询盘点明细列表
export function listCountDetail(query) {
  return request({
    url: '/count/countDetail/list',
    method: 'get',
    params: query
  })
}

// 查询盘点明细详细
export function getCountDetail(id) {
  return request({
    url: '/count/countDetail/' + id,
    method: 'get'
  })
}

// 新增盘点明细
export function addCountDetail(data) {
  return request({
    url: '/count/countDetail',
    method: 'post',
    data: data
  })
}

// 修改盘点明细
export function updateCountDetail(data) {
  return request({
    url: '/count/countDetail',
    method: 'put',
    data: data
  })
}

// 删除盘点明细
export function delCountDetail(id) {
  return request({
    url: '/count/countDetail/' + id,
    method: 'delete'
  })
}
