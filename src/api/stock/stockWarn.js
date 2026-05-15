import request from '@/utils/request'

// 查询库存预警列表
export function listStockWarn(query) {
  return request({
    url: '/stock/stockWarn/list',
    method: 'get',
    params: query
  })
}

// 查询库存预警详细
export function getStockWarn(id) {
  return request({
    url: '/stock/stockWarn/' + id,
    method: 'get'
  })
}

// 新增库存预警
export function addStockWarn(data) {
  return request({
    url: '/stock/stockWarn',
    method: 'post',
    data: data
  })
}

// 修改库存预警
export function updateStockWarn(data) {
  return request({
    url: '/stock/stockWarn',
    method: 'put',
    data: data
  })
}

// 删除库存预警
export function delStockWarn(id) {
  return request({
    url: '/stock/stockWarn/' + id,
    method: 'delete'
  })
}
