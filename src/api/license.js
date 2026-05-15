import request from '@/utils/request'

// 获取机器码
export function getMachineCode() {
  return request({
    url: '/license/machineCode',
    method: 'get'
  })
}

// 检查License状态
export function getLicenseStatus() {
  return request({
    url: '/license/status',
    method: 'get'
  })
}

// 获取License信息（用于前端显示）
export function getLicenseInfo() {
  return request({
    url: '/license/info',
    method: 'get'
  })
}

// 验证License文件
export function validateLicenseFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/license/validate',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 激活License
export function uploadLicenseFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/license/activate',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取License详细信息
export function getLicenseDetails() {
  return request({
    url: '/license/details',
    method: 'get'
  })
}
