import request from '@/utils/request'

// 查询移库订单头列表
export function listTransferHeader(query) {
  return request({
    url: '/transfer/transferHeader/list',
    method: 'get',
    params: query
  })
}

// 查询移库订单头详细
export function getTransferHeader(id) {
  return request({
    url: '/transfer/transferHeader/' + id,
    method: 'get'
  })
}

// 新增移库订单头
export function addTransferHeader(data) {
  return request({
    url: '/transfer/transferHeader',
    method: 'post',
    data: data
  })
}

// 修改移库订单头
export function updateTransferHeader(data) {
  return request({
    url: '/transfer/transferHeader',
    method: 'put',
    data: data
  })
}

// 删除移库订单头
export function delTransferHeader(id) {
  return request({
    url: '/transfer/transferHeader/' + id,
    method: 'delete'
  })
}
