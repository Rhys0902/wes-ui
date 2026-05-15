import request from '@/utils/request'

// 查询仓库主数据列表
export function listBasWarehouse(query) {
  return request({
    url: '/bas/basWarehouse/list',
    method: 'get',
    params: query
  })
}

// 查询仓库主数据详细
export function getBasWarehouse(id) {
  return request({
    url: '/bas/basWarehouse/' + id,
    method: 'get'
  })
}

// 新增仓库主数据
export function addBasWarehouse(data) {
  return request({
    url: '/bas/basWarehouse',
    method: 'post',
    data: data
  })
}

// 修改仓库主数据
export function updateBasWarehouse(data) {
  return request({
    url: '/bas/basWarehouse',
    method: 'put',
    data: data
  })
}

// 删除仓库主数据
export function delBasWarehouse(id) {
  return request({
    url: '/bas/basWarehouse/' + id,
    method: 'delete'
  })
}

// 查询仓库下拉框列表
export function dropDownListWarehouse() {
    return request({
      url: '/bas/dropDownList/warehouse',
      method: 'get'
    })
  }

  

