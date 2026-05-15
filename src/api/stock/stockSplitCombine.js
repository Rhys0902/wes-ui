import request from '@/utils/request'

// 查询拆合箱列表
export function listStockSplitCombine(query) {
  return request({
    url: '/stock/stockSplitCombine/list',
    method: 'get',
    params: query
  })
}

// 查询拆合箱详细
export function getStockSplitCombine(id) {
  return request({
    url: '/stock/stockSplitCombine/' + id,
    method: 'get'
  })
}

// 新增拆合箱
export function addStockSplitCombine(data) {
  return request({
    url: '/stock/stockSplitCombine',
    method: 'post',
    data: data
  })
}

// 修改拆合箱
export function updateStockSplitCombine(data) {
  return request({
    url: '/stock/stockSplitCombine',
    method: 'put',
    data: data
  })
}

// 删除拆合箱
export function delStockSplitCombine(id) {
  return request({
    url: '/stock/stockSplitCombine/' + id,
    method: 'delete'
  })
}
