import request from '@/utils/request'

// 查询盘点交易列表
export function listCountTrans(query) {
  return request({
    url: '/count/countTrans/list',
    method: 'get',
    params: query
  })
}

// 查询盘点交易详细
export function getCountTrans(id) {
  return request({
    url: '/count/countTrans/' + id,
    method: 'get'
  })
}

// 新增盘点交易
export function addCountTrans(data) {
  return request({
    url: '/count/countTrans',
    method: 'post',
    data: data
  })
}

// 修改盘点交易
export function updateCountTrans(data) {
  return request({
    url: '/count/countTrans',
    method: 'put',
    data: data
  })
}

// 删除盘点交易
export function delCountTrans(id) {
  return request({
    url: '/count/countTrans/' + id,
    method: 'delete'
  })
}
