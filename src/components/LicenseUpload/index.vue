<template>
    <div class="license-upload">
        <el-card class="upload-card">
            <template #header>
                <div class="card-header">
                    <el-icon>
                        <UploadFilled />
                    </el-icon>
                    <span>License文件上传</span>
                </div>
            </template>

            <!-- 文件上传区域 -->
            <div class="upload-section">
                <h4>上传License文件</h4>

                <el-upload ref="uploadRef" class="license-uploader" drag :auto-upload="false" :show-file-list="false" :before-upload="beforeUpload" :on-change="handleFileChange" accept=".lic,.license">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        将License文件拖拽到此处，或<em>点击选择文件</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            支持 .lic 和 .license 格式文件，文件大小不超过 1MB
                        </div>
                    </template>
                </el-upload>

                <!-- 文件信息显示 -->
                <div v-if="selectedFile" class="file-info">
                    <el-alert :title="`已选择文件: ${selectedFile.name}`" type="info" :closable="false" show-icon>
                        <template #default>
                            <p>文件大小: {{ formatFileSize(selectedFile.size) }}</p>
                            <p>文件类型: {{ selectedFile.type || '未知' }}</p>
                        </template>
                    </el-alert>
                </div>

                <!-- 操作按钮 -->
                <div class="upload-actions">
                    <el-button type="primary" size="large" :loading="uploading" :disabled="!selectedFile" @click="handleUpload">
                        <el-icon>
                            <Upload />
                        </el-icon>
                        {{ uploading ? '上传中...' : '上传并激活' }}
                    </el-button>

                    <el-button size="large" :disabled="uploading" @click="handleValidate" v-if="selectedFile">
                        <el-icon>
                            <View />
                        </el-icon>
                        验证文件
                    </el-button>

                    <el-button size="large" :disabled="uploading" @click="clearFile" v-if="selectedFile">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        清除文件
                    </el-button>
                </div>
            </div>

            <!-- 上传进度 -->
            <div v-if="uploading" class="upload-progress">
                <el-progress :percentage="uploadProgress" :status="uploadStatus" :stroke-width="8" />
                <p class="progress-text">{{ progressText }}</p>
            </div>

            <!-- 上传结果 -->
            <div v-if="uploadResult" class="upload-result">
                <el-alert :title="uploadResult.title" :type="uploadResult.type" :description="uploadResult.description" :closable="false" show-icon />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    UploadFilled,
    Upload,
    View,
    Delete
} from '@element-plus/icons-vue'
import {
    uploadLicenseFile,
    validateLicenseFile
} from '@/api/license'

const emit = defineEmits(['success', 'error'])

// 响应式数据
const selectedFile = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref('')
const progressText = ref('')
const uploadResult = ref(null)


// 文件上传前验证
const beforeUpload = (file) => {
    // 验证文件类型
    const isValidType = file.name.toLowerCase().endsWith('.lic') ||
        file.name.toLowerCase().endsWith('.license')
    if (!isValidType) {
        ElMessage.error('只能上传 .lic 或 .license 格式的文件！')
        uploadResult.value = {
            title: '文件格式错误',
            type: 'error',
            description: '请选择正确的License文件格式（.lic 或 .license）'
        }
        return false
    }

    // 验证文件大小 (最大1MB)
    const isLt1M = file.size / 1024 / 1024 < 1
    if (!isLt1M) {
        ElMessage.error('License文件大小不能超过 1MB！')
        uploadResult.value = {
            title: '文件过大',
            type: 'error',
            description: 'License文件大小不能超过 1MB，请选择较小的文件'
        }
        return false
    }

    // 验证文件是否为空
    if (file.size === 0) {
        ElMessage.error('文件不能为空！')
        uploadResult.value = {
            title: '文件为空',
            type: 'error',
            description: '请选择有效的License文件'
        }
        return false
    }

    // 清除之前的错误信息
    uploadResult.value = null
    return true
}

// 文件选择变化
const handleFileChange = (file) => {
    if (beforeUpload(file.raw)) {
        selectedFile.value = file.raw
        uploadResult.value = null
    }
}

// 清除文件
const clearFile = () => {
    selectedFile.value = null
    uploadResult.value = null
    uploadProgress.value = 0
}

// 格式化文件大小
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 上传文件
const handleUpload = async () => {
    if (!selectedFile.value) {
        ElMessage.warning('请先选择License文件')
        return
    }

    uploading.value = true
    uploadProgress.value = 0
    uploadStatus.value = ''
    progressText.value = '准备上传...'
    uploadResult.value = null

    try {
        // 模拟上传进度
        const progressInterval = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value += Math.random() * 20
                progressText.value = '正在上传文件到WES后端项目...'
            }
        }, 200)

        // 调用上传API - 文件将上传到WES后端项目文件夹
        const response = await uploadLicenseFile(selectedFile.value)

        clearInterval(progressInterval)
        uploadProgress.value = 100
        uploadStatus.value = 'success'
        progressText.value = '上传完成'

        if (response.code === 200) {
            uploadResult.value = {
                title: 'License激活成功！',
                type: 'success',
                description: `系统已成功激活，到期时间: ${response.data.expireDate}`
            }

            ElMessage.success('License激活成功！系统已激活，可以正常使用')
            emit('success', response.data)

            // 延迟清除文件
            setTimeout(() => {
                clearFile()
            }, 3000)
        } else {
            uploadResult.value = {
                title: 'License激活失败',
                type: 'error',
                description: response.msg || '激活失败，请检查License文件是否正确'
            }

            ElMessage.error('License激活失败: ' + (response.msg || '请检查License文件是否正确'))
            emit('error', response.msg)
        }
    } catch (error) {
        uploadProgress.value = 100
        uploadStatus.value = 'exception'
        progressText.value = '上传失败'

        console.error('License上传失败:', error)

        uploadResult.value = {
            title: 'License激活失败',
            type: 'error',
            description: '网络错误或服务器异常，请重试'
        }

        ElMessage.error('License激活失败，请重试')
        emit('error', error.message)
    } finally {
        uploading.value = false
    }
}

// 验证文件
const handleValidate = async () => {
    if (!selectedFile.value) {
        ElMessage.warning('请先选择License文件')
        return
    }

    try {
        const response = await validateLicenseFile(selectedFile.value)

        if (response.code === 200) {
            const result = response.data
            if (result.valid) {
                const licenseInfo = result.licenseInfo || {}
                const expireDate = licenseInfo.expireDate ? new Date(licenseInfo.expireDate).toLocaleDateString('zh-CN') : 'N/A'
                const remainingDays = licenseInfo.expireDate ?
                    Math.ceil((new Date(licenseInfo.expireDate) - new Date()) / (1000 * 60 * 60 * 24)) : 'N/A'

                ElMessageBox.alert(
                    `License文件验证通过！\n\n` +
                    `产品名称: ${licenseInfo.productName || 'N/A'}\n` +
                    `版本: ${licenseInfo.version || 'N/A'}\n` +
                    `到期时间: ${expireDate}\n` +
                    `剩余天数: ${remainingDays}天\n` +
                    `机器码: ${licenseInfo.machineCode || 'N/A'}`,
                    '验证结果',
                    {
                        confirmButtonText: '确定',
                        type: 'success'
                    }
                )
            } else {
                ElMessageBox.alert(
                    `License文件验证失败！\n\n` +
                    `错误原因: ${result.message || '未知错误'}\n\n` +
                    `可能的原因:\n` +
                    `• License文件已损坏\n` +
                    `• License文件格式不正确\n` +
                    `• License已过期\n` +
                    `• 机器码不匹配\n` +
                    `• 数字签名验证失败`,
                    '验证结果',
                    {
                        confirmButtonText: '确定',
                        type: 'error'
                    }
                )
            }
        } else {
            ElMessage.error('验证失败: ' + (response.msg || '服务器错误'))
        }
    } catch (error) {
        console.error('License文件验证失败:', error)
        ElMessage.error('验证失败，请检查网络连接后重试')
    }
}

// 组件挂载时的初始化
onMounted(() => {
    // 组件初始化完成
})
</script>

<style scoped>
.license-upload {
    max-width: 600px;
    margin: 0 auto;
}

.upload-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
}

.card-header .el-icon {
    margin-right: 8px;
    font-size: 20px;
    color: #409eff;
}

.upload-section h4 {
    margin: 0 0 16px 0;
    color: #495057;
    font-size: 14px;
    font-weight: 600;
}

.license-uploader {
    margin-bottom: 16px;
}

.license-uploader :deep(.el-upload-dragger) {
    width: 100%;
    height: 180px;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    background: #fafafa;
    transition: all 0.3s ease;
}

.license-uploader :deep(.el-upload-dragger:hover) {
    border-color: #409eff;
    background: #f0f9ff;
}

.license-uploader :deep(.el-icon--upload) {
    font-size: 48px;
    color: #c0c4cc;
    margin-bottom: 16px;
}

.license-uploader :deep(.el-upload__text) {
    color: #606266;
    font-size: 14px;
}

.license-uploader :deep(.el-upload__text em) {
    color: #409eff;
    font-style: normal;
}

.license-uploader :deep(.el-upload__tip) {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
}

.file-info {
    margin-bottom: 16px;
}

.upload-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.upload-progress {
    margin: 16px 0;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
}

.progress-text {
    text-align: center;
    margin: 8px 0 0 0;
    color: #606266;
    font-size: 14px;
}

.upload-result {
    margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .upload-actions {
        flex-direction: column;
    }

    .upload-actions .el-button {
        width: 100%;
    }
}
</style>
