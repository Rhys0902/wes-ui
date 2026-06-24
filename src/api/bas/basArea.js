import request from '@/utils/request'

// 查询库区主数据列表
export function listBasArea(query) {
  return request({
    url: '/bas/basArea/list',
    method: 'get',
    params: query
  })
}

// 查询库区主数据详细
export function getBasArea(id) {
  return request({
    url: '/bas/basArea/' + id,
    method: 'get'
  })
}

// 新增库区主数据
export function addBasArea(data) {
  return request({
    url: '/bas/basArea',
    method: 'post',
    data: data
  })
}

// 修改库区主数据
export function updateBasArea(data) {
  return request({
    url: '/bas/basArea',
    method: 'put',
    data: data
  })
}

// 删除库区主数据
export function delBasArea(id) {
  return request({
    url: '/bas/basArea/' + id,
    method: 'delete'
  })
}

// 查询库区下拉框列表
export function dropDownListArea(query) {
    return request({
      url: '/bas/dropDownList/area',
      method: 'get',
      params: query
    })
  }
