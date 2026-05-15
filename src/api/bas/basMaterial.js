import request from '@/utils/request'

// 查询物料主数据列表
export function listBasMaterial(query) {
  return request({
    url: '/bas/basMaterial/list',
    method: 'get',
    params: query
  })
}

// 查询物料主数据详细
export function getBasMaterial(id) {
  return request({
    url: '/bas/basMaterial/' + id,
    method: 'get'
  })
}

// 新增物料主数据
export function addBasMaterial(data) {
  return request({
    url: '/bas/basMaterial',
    method: 'post',
    data: data
  })
}

// 修改物料主数据
export function updateBasMaterial(data) {
  return request({
    url: '/bas/basMaterial',
    method: 'put',
    data: data
  })
}

// 删除物料主数据
export function delBasMaterial(id) {
  return request({
    url: '/bas/basMaterial/' + id,
    method: 'delete'
  })
}
