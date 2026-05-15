import request from '@/utils/request'

// 查询物料类型列表
export function listBasMaterialType(query) {
  return request({
    url: '/bas/basMaterialType/list',
    method: 'get',
    params: query
  })
}

// 查询物料类型详细
export function getBasMaterialType(id) {
  return request({
    url: '/bas/basMaterialType/' + id,
    method: 'get'
  })
}

// 新增物料类型
export function addBasMaterialType(data) {
  return request({
    url: '/bas/basMaterialType',
    method: 'post',
    data: data
  })
}

// 修改物料类型
export function updateBasMaterialType(data) {
  return request({
    url: '/bas/basMaterialType',
    method: 'put',
    data: data
  })
}

// 删除物料类型
export function delBasMaterialType(id) {
  return request({
    url: '/bas/basMaterialType/' + id,
    method: 'delete'
  })
}


// 查询物料类型下拉框列表
export function dropDownListMaterialType() {
    return request({
      url: '/bas/dropDownList/materialType',
      method: 'get'
    })
  }



