import request from '@/utils/request'

// 查询配置主数据列表
export function listBasConf(query) {
  return request({
    url: '/bas/basConf/list',
    method: 'get',
    params: query
  })
}

// 查询配置主数据详细
export function getBasConf(id) {
  return request({
    url: '/bas/basConf/' + id,
    method: 'get'
  })
}

// 新增配置主数据
export function addBasConf(data) {
  return request({
    url: '/bas/basConf',
    method: 'post',
    data: data
  })
}

// 修改配置主数据
export function updateBasConf(data) {
  return request({
    url: '/bas/basConf',
    method: 'put',
    data: data
  })
}

// 删除配置主数据
export function delBasConf(id) {
  return request({
    url: '/bas/basConf/' + id,
    method: 'delete'
  })
}
