import request from '@/utils/request'

// 查询VIEW列表
export function listReportInOutTrans(query) {
  return request({
    url: '/report/reportInOutTrans/list',
    method: 'get',
    params: query
  })
}

// 查询VIEW详细
export function getReportInOutTrans(transType) {
  return request({
    url: '/report/reportInOutTrans/' + transType,
    method: 'get'
  })
}

// 新增VIEW
export function addReportInOutTrans(data) {
  return request({
    url: '/report/reportInOutTrans',
    method: 'post',
    data: data
  })
}

// 修改VIEW
export function updateReportInOutTrans(data) {
  return request({
    url: '/report/reportInOutTrans',
    method: 'put',
    data: data
  })
}

// 删除VIEW
export function delReportInOutTrans(transType) {
  return request({
    url: '/report/reportInOutTrans/' + transType,
    method: 'delete'
  })
}
