import request from '@/utils/request'

// 查询批次属性列表
export function listStockBatch(query) {
  return request({
    url: '/stock/stockBatch/list',
    method: 'get',
    params: query
  })
}

// 查询批次属性详细
export function getStockBatch(id) {
  return request({
    url: '/stock/stockBatch/' + id,
    method: 'get'
  })
}

// 新增批次属性
export function addStockBatch(data) {
  return request({
    url: '/stock/stockBatch',
    method: 'post',
    data: data
  })
}

// 修改批次属性
export function updateStockBatch(data) {
  return request({
    url: '/stock/stockBatch',
    method: 'put',
    data: data
  })
}

// 删除批次属性
export function delStockBatch(id) {
  return request({
    url: '/stock/stockBatch/' + id,
    method: 'delete'
  })
}
