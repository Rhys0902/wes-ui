import request from '@/utils/request'

// 查询设备主数据列表
export function listBasEquipment(query) {
  return request({
    url: '/bas/basEquipment/list',
    method: 'get',
    params: query
  })
}

// 查询设备主数据详细
export function getBasEquipment(id) {
  return request({
    url: '/bas/basEquipment/' + id,
    method: 'get'
  })
}

// 新增设备主数据
export function addBasEquipment(data) {
  return request({
    url: '/bas/basEquipment',
    method: 'post',
    data: data
  })
}

// 修改设备主数据
export function updateBasEquipment(data) {
  return request({
    url: '/bas/basEquipment',
    method: 'put',
    data: data
  })
}

// 删除设备主数据
export function delBasEquipment(id) {
  return request({
    url: '/bas/basEquipment/' + id,
    method: 'delete'
  })
}
