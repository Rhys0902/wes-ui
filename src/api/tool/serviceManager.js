import request from '@/utils/request'// 查询生成表数据


// 获取所有服务
export function serviceInfos(query,config) {
  return request({
    url: '/service/infos',
    method: 'get',
    params: query,
    customBaseURL:config.customBaseURL
  })
}

// 启动指定服务
export function serviceStart(query,config) {
    return request({
      url: '/service/start',
      method: 'get',
      params: query,
      customBaseURL:config.customBaseURL
    })
  }

  // 停止指定服务
export function serviceStop(query,config) {
    return request({
      url: '/service/stop',
      method: 'get',
      params: query,
      customBaseURL:config.customBaseURL
    })
  }
  
  // 暂停指定服务
export function servicePause(query,config) {
    return request({
      url: '/service/pause',
      method: 'get',
      params: query,
      customBaseURL:config.customBaseURL
    })
  }
  
  // 恢复指定服务
export function serviceResume(query,config) {
    return request({
      url: '/service/resume',
      method: 'get',
      params: query,
      customBaseURL:config.customBaseURL
    })
  }

    // 重启指定服务
export function serviceRestart(query,config) {
    return request({
      url: '/service/restart',
      method: 'get',
      params: query,
      customBaseURL:config.customBaseURL
    })
  }
