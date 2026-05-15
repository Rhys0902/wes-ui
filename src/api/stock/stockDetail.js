import request from '@/utils/request'

// 查询库存明细列表
export function listStockDetail(query) {
  return request({
    url: '/stock/stockDetail/list',
    method: 'get',
    params: query
  })
}

// 查询库存明细详细
export function getStockDetail(id) {
  return request({
    url: '/stock/stockDetail/' + id,
    method: 'get'
  })
}

// 新增库存明细
export function addStockDetail(data) {
  return request({
    url: '/stock/stockDetail',
    method: 'post',
    data: data
  })
}

// 修改库存明细
export function updateStockDetail(data) {
  return request({
    url: '/stock/stockDetail',
    method: 'put',
    data: data
  })
}

// 删除库存明细
export function delStockDetail(id) {
  return request({
    url: '/stock/stockDetail/' + id,
    method: 'delete'
  })
}
