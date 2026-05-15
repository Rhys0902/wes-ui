import request from '@/utils/request'

// 查询移库交易列表
export function listTransferTrans(query) {
  return request({
    url: '/transfer/transferTrans/list',
    method: 'get',
    params: query
  })
}

// 查询移库交易详细
export function getTransferTrans(id) {
  return request({
    url: '/transfer/transferTrans/' + id,
    method: 'get'
  })
}

// 新增移库交易
export function addTransferTrans(data) {
  return request({
    url: '/transfer/transferTrans',
    method: 'post',
    data: data
  })
}

// 修改移库交易
export function updateTransferTrans(data) {
  return request({
    url: '/transfer/transferTrans',
    method: 'put',
    data: data
  })
}

// 删除移库交易
export function delTransferTrans(id) {
  return request({
    url: '/transfer/transferTrans/' + id,
    method: 'delete'
  })
}
