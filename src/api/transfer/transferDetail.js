import request from '@/utils/request'

// 查询移库明细列表
export function listTransferDetail(query) {
  return request({
    url: '/transfer/transferDetail/list',
    method: 'get',
    params: query
  })
}

// 查询移库明细详细
export function getTransferDetail(id) {
  return request({
    url: '/transfer/transferDetail/' + id,
    method: 'get'
  })
}

// 新增移库明细
export function addTransferDetail(data) {
  return request({
    url: '/transfer/transferDetail',
    method: 'post',
    data: data
  })
}

// 修改移库明细
export function updateTransferDetail(data) {
  return request({
    url: '/transfer/transferDetail',
    method: 'put',
    data: data
  })
}

// 删除移库明细
export function delTransferDetail(id) {
  return request({
    url: '/transfer/transferDetail/' + id,
    method: 'delete'
  })
}
