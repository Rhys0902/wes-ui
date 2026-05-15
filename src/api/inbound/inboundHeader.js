import request from '@/utils/request'

// 查询入库单头列表
export function listInboundHeader(query) {
  return request({
    url: '/inbound/inboundHeader/list',
    method: 'get',
    params: query
  })
}

// 查询入库单头详细
export function getInboundHeader(id) {
  return request({
    url: '/inbound/inboundHeader/' + id,
    method: 'get'
  })
}

// 新增入库单头
export function addInboundHeader(data) {
  return request({
    url: '/inbound/inboundHeader',
    method: 'post',
    data: data
  })
}

// 修改入库单头
export function updateInboundHeader(data) {
  return request({
    url: '/inbound/inboundHeader',
    method: 'put',
    data: data
  })
}

// 删除入库单头
export function delInboundHeader(id) {
  return request({
    url: '/inbound/inboundHeader/' + id,
    method: 'delete'
  })
}

// 空托盘入库
export function emptyLePutWay(data) {
  return request({
    url: '/inbound/inboundAllocation/emptyLePutWay',
    method: 'post',
    data: data
  })
}