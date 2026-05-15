import request from '@/utils/request'

// 查询出库交易列表
export function listOutboundTrans(query) {
  return request({
    url: '/outbound/outboundTrans/list',
    method: 'get',
    params: query
  })
}

// 查询出库交易详细
export function getOutboundTrans(id) {
  return request({
    url: '/outbound/outboundTrans/' + id,
    method: 'get'
  })
}

// 新增出库交易
export function addOutboundTrans(data) {
  return request({
    url: '/outbound/outboundTrans',
    method: 'post',
    data: data
  })
}

// 修改出库交易
export function updateOutboundTrans(data) {
  return request({
    url: '/outbound/outboundTrans',
    method: 'put',
    data: data
  })
}

// 删除出库交易
export function delOutboundTrans(id) {
  return request({
    url: '/outbound/outboundTrans/' + id,
    method: 'delete'
  })
}
