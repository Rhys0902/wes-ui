import request from '@/utils/request'

// 查询作业指令历史列表
export function listHisLogisticsInsTask(query) {
  return request({
    url: '/history/hisLogisticsInsTask/list',
    method: 'get',
    params: query
  })
}

// 查询作业指令历史详细
export function getHisLogisticsInsTask(id) {
  return request({
    url: '/history/hisLogisticsInsTask/' + id,
    method: 'get'
  })
}

// 新增作业指令历史
export function addHisLogisticsInsTask(data) {
  return request({
    url: '/history/hisLogisticsInsTask',
    method: 'post',
    data: data
  })
}

// 修改作业指令历史
export function updateHisLogisticsInsTask(data) {
  return request({
    url: '/history/hisLogisticsInsTask',
    method: 'put',
    data: data
  })
}

// 删除作业指令历史
export function delHisLogisticsInsTask(id) {
  return request({
    url: '/history/hisLogisticsInsTask/' + id,
    method: 'delete'
  })
}
