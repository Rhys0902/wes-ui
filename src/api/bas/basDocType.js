import request from '@/utils/request'

// 查询订单类型主数据列表
export function listBasDocType(query) {
  return request({
    url: '/bas/basDocType/list',
    method: 'get',
    params: query
  })
}

// 查询订单类型主数据详细
export function getBasDocType(id) {
  return request({
    url: '/bas/basDocType/' + id,
    method: 'get'
  })
}

// 新增订单类型主数据
export function addBasDocType(data) {
  return request({
    url: '/bas/basDocType',
    method: 'post',
    data: data
  })
}

// 修改订单类型主数据
export function updateBasDocType(data) {
  return request({
    url: '/bas/basDocType',
    method: 'put',
    data: data
  })
}

// 删除订单类型主数据
export function delBasDocType(id) {
  return request({
    url: '/bas/basDocType/' + id,
    method: 'delete'
  })
}
