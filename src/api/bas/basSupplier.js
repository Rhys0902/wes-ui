import request from '@/utils/request'

// 查询供应商主数据列表
export function listBasSupplier(query) {
  return request({
    url: '/bas/basSupplier/list',
    method: 'get',
    params: query
  })
}

// 查询供应商主数据详细
export function getBasSupplier(id) {
  return request({
    url: '/bas/basSupplier/' + id,
    method: 'get'
  })
}

// 新增供应商主数据
export function addBasSupplier(data) {
  return request({
    url: '/bas/basSupplier',
    method: 'post',
    data: data
  })
}

// 修改供应商主数据
export function updateBasSupplier(data) {
  return request({
    url: '/bas/basSupplier',
    method: 'put',
    data: data
  })
}

// 删除供应商主数据
export function delBasSupplier(id) {
  return request({
    url: '/bas/basSupplier/' + id,
    method: 'delete'
  })
}
