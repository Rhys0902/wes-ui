import request from '@/utils/request'

// 查询外部接口数据历史列表
export function listHisConnApi(query) {
  return request({
    url: '/history/hisConnApi/list',
    method: 'get',
    params: query
  })
}

// 查询外部接口数据历史详细
export function getHisConnApi(id) {
  return request({
    url: '/history/hisConnApi/' + id,
    method: 'get'
  })
}

// 新增外部接口数据历史
export function addHisConnApi(data) {
  return request({
    url: '/history/hisConnApi',
    method: 'post',
    data: data
  })
}

// 修改外部接口数据历史
export function updateHisConnApi(data) {
  return request({
    url: '/history/hisConnApi',
    method: 'put',
    data: data
  })
}

// 删除外部接口数据历史
export function delHisConnApi(id) {
  return request({
    url: '/history/hisConnApi/' + id,
    method: 'delete'
  })
}
