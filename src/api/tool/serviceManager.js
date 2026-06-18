import request from '@/utils/request'

const getCustomBaseURL = (config = {}) => config.customBaseURL

const serviceOperation = (svcCode, action, config) => {
  return request({
    url: `/service/${encodeURIComponent(svcCode)}/${action}`,
    method: 'post',
    customBaseURL: getCustomBaseURL(config)
  })
}

// 获取所有服务
export function serviceInfos(query = {}, config = {}) {
  return request({
    url: '/service/infos',
    method: 'get',
    params: query,
    customBaseURL: getCustomBaseURL(config)
  })
}

// 获取服务状态
export function serviceStatus(query = {}, config = {}) {
  return request({
    url: '/service/status',
    method: 'get',
    params: query,
    customBaseURL: getCustomBaseURL(config)
  })
}

// 启动指定服务
export function serviceStart(svcCode, config = {}) {
  return serviceOperation(svcCode, 'start', config)
}

// 停止指定服务
export function serviceStop(svcCode, config = {}) {
  return serviceOperation(svcCode, 'stop', config)
}

// 暂停指定服务
export function servicePause(svcCode, config = {}) {
  return serviceOperation(svcCode, 'pause', config)
}

// 恢复指定服务
export function serviceResume(svcCode, config = {}) {
  return serviceOperation(svcCode, 'resume', config)
}

// 重启指定服务
export function serviceRestart(svcCode, config = {}) {
  return serviceOperation(svcCode, 'restart', config)
}
