import request from '@/utils/request'

const serviceOperation = (svcCode, action) => {
  return request({
    url: `/pkt/service/${encodeURIComponent(svcCode)}/${action}`,
    method: 'post'
  })
}

// 获取所有服务
export function serviceInfos(query = {}) {
  return request({
    url: '/pkt/service/infos',
    method: 'get',
    params: query
  })
}

// 获取服务状态
export function serviceStatus(query = {}) {
  return request({
    url: '/pkt/service/status',
    method: 'get',
    params: query
  })
}

// 获取服务点位快照
export function servicePoints(svcCode) {
  return request({
    url: `/pkt/service/${encodeURIComponent(svcCode)}/points`,
    method: 'get'
  })
}

// 启动指定服务
export function serviceStart(svcCode) {
  return serviceOperation(svcCode, 'start')
}

// 停止指定服务
export function serviceStop(svcCode) {
  return serviceOperation(svcCode, 'stop')
}

// 暂停指定服务
export function servicePause(svcCode) {
  return serviceOperation(svcCode, 'pause')
}

// 恢复指定服务
export function serviceResume(svcCode) {
  return serviceOperation(svcCode, 'resume')
}

// 重启指定服务
export function serviceRestart(svcCode) {
  return serviceOperation(svcCode, 'restart')
}
