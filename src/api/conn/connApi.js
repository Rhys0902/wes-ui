import request from '@/utils/request'

// 查询外部接口数据列表
export function listConnApi(query) {
  return request({
    url: '/conn/connApi/list',
    method: 'get',
    params: query
  })
}

// 查询外部接口数据详细
export function getConnApi(id) {
  return request({
    url: '/conn/connApi/' + id,
    method: 'get'
  })
}

// 新增外部接口数据
export function addConnApi(data) {
  return request({
    url: '/conn/connApi',
    method: 'post',
    data: data
  })
}

// 修改外部接口数据
export function updateConnApi(data) {
  return request({
    url: '/conn/connApi',
    method: 'put',
    data: data
  })
}

// 删除外部接口数据
export function delConnApi(id) {
  return request({
    url: '/conn/connApi/' + id,
    method: 'delete'
  })
}

// 重置
export function resetConnApi(ids) {
  return request({
    url: '/conn/connApi/reset/' + ids,
    method: 'post'
  })
}
