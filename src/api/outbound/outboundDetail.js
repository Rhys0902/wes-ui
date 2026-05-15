import request from '@/utils/request'

// 查询出库明细列表
export function listOutboundDetail(query) {
  return request({
    url: '/outbound/outboundDetail/list',
    method: 'get',
    params: query
  })
}

// 查询出库明细详细
export function getOutboundDetail(id) {
  return request({
    url: '/outbound/outboundDetail/' + id,
    method: 'get'
  })
}

// 新增出库明细
export function addOutboundDetail(data) {
  return request({
    url: '/outbound/outboundDetail',
    method: 'post',
    data: data
  })
}

// 修改出库明细
export function updateOutboundDetail(data) {
  return request({
    url: '/outbound/outboundDetail',
    method: 'put',
    data: data
  })
}

// 删除出库明细
export function delOutboundDetail(id) {
  return request({
    url: '/outbound/outboundDetail/' + id,
    method: 'delete'
  })
}
