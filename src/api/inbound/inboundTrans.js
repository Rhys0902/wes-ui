import request from '@/utils/request'

// 查询收货交易列表
export function listInboundTrans(query) {
  return request({
    url: '/inbound/inboundTrans/list',
    method: 'get',
    params: query
  })
}

// 查询收货交易详细
export function getInboundTrans(id) {
  return request({
    url: '/inbound/inboundTrans/' + id,
    method: 'get'
  })
}

// 新增收货交易
export function addInboundTrans(data) {
  return request({
    url: '/inbound/inboundTrans',
    method: 'post',
    data: data
  })
}

// 修改收货交易
export function updateInboundTrans(data) {
  return request({
    url: '/inbound/inboundTrans',
    method: 'put',
    data: data
  })
}

// 删除收货交易
export function delInboundTrans(id) {
  return request({
    url: '/inbound/inboundTrans/' + id,
    method: 'delete'
  })
}
