import request from '@/utils/request'

// 查询VIEW列表
export function listReportStockSummary(query) {
  return request({
    url: '/report/reportStockSummary/list',
    method: 'get',
    params: query
  })
}

// 查询VIEW详细
export function getReportStockSummary(materialCode) {
  return request({
    url: '/report/reportStockSummary/' + materialCode,
    method: 'get'
  })
}

// 新增VIEW
export function addReportStockSummary(data) {
  return request({
    url: '/report/reportStockSummary',
    method: 'post',
    data: data
  })
}

// 修改VIEW
export function updateReportStockSummary(data) {
  return request({
    url: '/report/reportStockSummary',
    method: 'put',
    data: data
  })
}

// 删除VIEW
export function delReportStockSummary(materialCode) {
  return request({
    url: '/report/reportStockSummary/' + materialCode,
    method: 'delete'
  })
}
