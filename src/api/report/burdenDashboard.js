import request from '@/utils/request'

// 查询配料看板列表
export function listBurdenDashboard(query) {
  return request({
    url: '/report/burdenDashboard/list',
    method: 'get',
    params: query
  })
}

// 导出配料看板数据
export function exportBurdenDashboard(query) {
  return request({
    url: '/report/burdenDashboard/export',
    method: 'post',
    data: query
  })
}

// 查询托盘配料明细
export function getPalletDetail(query) {
  return request({
    url: '/report/burdenDashboard/palletDetail',
    method: 'get',
    params: query
  })
}
