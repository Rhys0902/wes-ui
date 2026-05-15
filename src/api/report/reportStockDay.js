import request from '@/utils/request'

// 查询VIEW列表
export function listReportStockDay(query) {
  return request({
    url: '/report/reportStockDay/list',
    method: 'get',
    params: query
  })
}

// 查询VIEW详细
export function getReportStockDay(materialCode) {
  return request({
    url: '/report/reportStockDay/' + materialCode,
    method: 'get'
  })
}

// 新增VIEW
export function addReportStockDay(data) {
  return request({
    url: '/report/reportStockDay',
    method: 'post',
    data: data
  })
}

// 修改VIEW
export function updateReportStockDay(data) {
  return request({
    url: '/report/reportStockDay',
    method: 'put',
    data: data
  })
}

// 删除VIEW
export function delReportStockDay(materialCode) {
  return request({
    url: '/report/reportStockDay/' + materialCode,
    method: 'delete'
  })
}
