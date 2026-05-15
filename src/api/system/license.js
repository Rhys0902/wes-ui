import request from '@/utils/request'

/**
 * 获取License状态信息
 */
export function getLicenseStatus() {
  return request({
    url: '/system/license/status',
    method: 'get',
    headers: {
      isToken: false  // License状态查询不需要token
    }
  })
}

/**
 * 上传License激活文件
 * @param {File} file License文件
 */
export function uploadLicenseFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/system/license/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      isToken: false  // 上传激活文件不需要token
    },
    timeout: 30000  // 上传可能需要更长时间
  })
}

/**
 * 验证License文件（不保存，仅验证）
 * @param {File} file License文件
 */
export function validateLicenseFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/system/license/validate',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      isToken: false
    },
    timeout: 30000
  })
}

/**
 * 获取当前机器码（用于生成License文件）
 */
export function getMachineCode() {
  return request({
    url: '/system/license/machine-code',
    method: 'get',
    headers: {
      isToken: false
    }
  })
}
