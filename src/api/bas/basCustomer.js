import request from '@/utils/request'

// 查询客户主数据列表
export function listBasCustomer(query) {
  return request({
    url: '/bas/basCustomer/list',
    method: 'get',
    params: query
  })
}

// 查询客户主数据详细
export function getBasCustomer(id) {
  return request({
    url: '/bas/basCustomer/' + id,
    method: 'get'
  })
}

// 新增客户主数据
export function addBasCustomer(data) {
  return request({
    url: '/bas/basCustomer',
    method: 'post',
    data: data
  })
}

// 修改客户主数据
export function updateBasCustomer(data) {
  return request({
    url: '/bas/basCustomer',
    method: 'put',
    data: data
  })
}

// 删除客户主数据
export function delBasCustomer(id) {
  return request({
    url: '/bas/basCustomer/' + id,
    method: 'delete'
  })
}
