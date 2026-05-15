<template>
    <el-dialog v-model="visible" :title="title" width="500px" :close-on-click-modal="false">
        <div class="import-container">
            <div class="upload-section">
                <el-upload ref="uploadRef" :auto-upload="false" :on-change="handleFileChange" :file-list="fileList" accept=".xlsx,.xls" class="upload-demo" drag>
                    <div class="upload-content">
                        <el-icon class="upload-icon">
                            <UploadFilled />
                        </el-icon>
                        <div class="upload-text">
                            <p class="upload-title">点击或拖拽文件到此区域上传</p>
                            <p class="upload-subtitle">支持 Excel 文件格式</p>
                        </div>
                    </div>
                    <template #tip>
                        <div class="upload-tips">
                            <span>仅支持 .xlsx、.xls 格式文件，请确保模板格式与系统一致</span>
                        </div>
                    </template>
                </el-upload>
            </div>

            <div class="template-section">
                <div class="template-card">
                    <div class="template-header">
                        <el-icon class="template-icon">
                            <Download />
                        </el-icon>
                        <span class="template-title">导入模板</span>
                    </div>
                    <div class="template-content">
                        <span class="template-desc">下载标准模板，按照格式填写数据</span>
                        <el-button type="primary" plain size="small" @click="handleDownloadTemplate">
                            <el-icon>
                                <Download />
                            </el-icon>
                            下载模板
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleImportData" :loading="importLoading">
                    确 定
                </el-button>
                <el-button @click="handleCancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Download } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

/**
 * 明细导入组件属性定义
 */
const props = defineProps({
    // 控制弹框显示
    modelValue: {
        type: Boolean,
        default: false
    },
    // 弹框标题
    title: {
        type: String,
        default: '导入明细'
    },
    // 模板文件名
    templateFileName: {
        type: String,
        default: '明细导入模板.xlsx'
    },
    // 物料列表数据
    materialList: {
        type: Array,
        default: () => []
    },
    // 现有表格数据（用于重复检查）
    existingData: {
        type: Array,
        default: () => []
    }
})

/**
 * 组件事件定义
 */
const emit = defineEmits(['update:modelValue', 'import-success'])

// 响应式数据
const fileList = ref([])
const currentFile = ref(null)
const importLoading = ref(false)
const uploadRef = ref(null)

/**
 * 计算属性：控制弹框显示状态
 */
const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

/**
 * 处理文件选择
 * @param {Object} file - 文件对象
 * @param {Array} fileList - 文件列表
 */
const handleFileChange = (file, fileList) => {
    currentFile.value = file.raw
    fileList.value = [file]
}

/**
 * 下载导入模板
 */
const handleDownloadTemplate = () => {
    const templateData = [
        {
            '物料编码': '',
            '订单数量': ''
        }
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '明细模板')
    XLSX.writeFile(workbook, props.templateFileName)
}

/**
 * 处理导入数据
 */
const handleImportData = () => {
    if (!currentFile.value) {
        ElMessage.error('请选择导入文件')
        return
    }

    importLoading.value = true
    const fileReader = new FileReader()

    fileReader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)

            if (jsonData.length === 0) {
                ElMessage.error('导入文件无数据')
                importLoading.value = false
                return
            }

            // 处理导入的数据
            const { successCount, errorCount, importedData, errorMaterials } = processImportData(jsonData)
            console.log(jsonData)
            // 发送导入成功事件
            emit('import-success', {
                successCount,
                errorCount,
                importedData,
                errorMaterials
            })

            visible.value = false

            let message = `成功导入 ${successCount} 条数据`
            if (errorCount > 0) {
                // 提取失败的物料编码
                const failedCodes = errorMaterials.map(item => item.materialCode).filter(code => code && code !== '未知编码')
                const uniqueFailedCodes = [...new Set(failedCodes)]

                if (uniqueFailedCodes.length > 0) {
                    const codesText = uniqueFailedCodes.length > 3
                        ? `${uniqueFailedCodes.slice(0, 3).join('、')}等${uniqueFailedCodes.length}个物料编码`
                        : uniqueFailedCodes.join('、')
                    message += `，<br /> <span style="color: #f56c6c;">失败 ${errorCount} 条数据(原因：导入信息错误或重复。涉及物料编码：${codesText})</span>`
                } else {
                    message += `，<span style="color: #f56c6c;">失败 ${errorCount} 条数据</span>`
                }
            }
            ElMessage.success({
                dangerouslyUseHTMLString: true,
                message: message
            })
        } catch (error) {
            console.error('文件解析失败:', error)
            ElMessage.error('文件解析失败，请检查文件格式')
        } finally {
            importLoading.value = false
        }
    }

    fileReader.readAsArrayBuffer(currentFile.value)
}

/**
 * 处理导入的数据并验证
 * @param {Array} importData - 导入的数据
 * @returns {Object} 处理结果统计
 */
const processImportData = (importData) => {
    let successCount = 0
    let errorCount = 0
    const importedData = []
    const errorMaterials = [] // 存储失败数据的物料编码

    importData.forEach(item => {
        const materialCode = item.物料编码?.toString().trim()

        // 验证必填字段
        if (!materialCode || item.订单数量 === undefined) {
            errorCount++
            errorMaterials.push({ materialCode: materialCode || '未知编码', reason: '必填字段缺失' })
            return
        }

        // 查找匹配的物料信息
        const material = props.materialList.find(
            mat => mat.materialCode === materialCode
        )

        if (!material) {
            errorCount++
            errorMaterials.push({ materialCode, reason: '物料编码不存在' })
            return
        }

        // 验证数量是否为数字
        const qty = Number(item.订单数量)
        if (isNaN(qty) || qty <= 0) {
            errorCount++
            errorMaterials.push({ materialCode, reason: '订单数量无效' })
            return
        }

        // 检查是否已存在相同物料和批次
        // const batchCode = item.批次编码?.toString().trim() || ''
        const exists = props.existingData.some(
            // row => row.materialId === String(material.id) && row.batchCode === batchCode
            row => row.materialId === String(material.id)
        )

        if (!exists) {
            importedData.push({
                materialId: String(material.id),
                materialCode: material.materialCode,
                materialName: material.materialName,
                unit: material.unit,
                orderedQty: qty.toString()
                // batchCode: batchCode
            })
            successCount++
        } else {
            errorCount++
            errorMaterials.push({ materialCode, reason: '物料已存在' })
        }
    })

    return { successCount, errorCount, importedData, errorMaterials }
}

/**
 * 取消导入
 */
const handleCancel = () => {
    visible.value = false
    fileList.value = []
    currentFile.value = null
}

/**
 * 重置组件状态
 */
const resetState = () => {
    fileList.value = []
    currentFile.value = null
    importLoading.value = false
}

// 监听弹框关闭，重置状态
watch(() => visible.value, (newVal) => {
    if (!newVal) {
        resetState()
    }
})
</script>

<style scoped>
/* 导入容器样式 */
.import-container {
    padding: 12px 0;
}

/* 上传区域样式 */
.upload-section {
    margin-bottom: 16px;
}

.upload-demo {
    margin-bottom: 0;
}

.upload-demo :deep(.el-upload-dragger) {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    background: #fafafa;
    transition: all 0.3s ease;
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
}

.upload-demo :deep(.el-upload-dragger:hover) {
    border-color: #409eff;
    background: #f0f8ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.upload-demo :deep(.el-upload-dragger.is-dragover) {
    border-color: #409eff;
    background: linear-gradient(135deg, #f0f8ff 0%, #e6f4ff 100%);
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.upload-icon {
    font-size: 32px;
    color: #409eff;
    margin-bottom: 8px;
    transition: all 0.3s ease;
}

.upload-demo :deep(.el-upload-dragger:hover) .upload-icon {
    transform: scale(1.05);
    color: #1890ff;
}

.upload-text {
    text-align: center;
}

.upload-title {
    font-size: 14px;
    font-weight: 500;
    color: #1f2329;
    margin: 0 0 4px 0;
    line-height: 1.3;
}

.upload-subtitle {
    font-size: 12px;
    color: #86909c;
    margin: 0;
    line-height: 1.3;
}

/* 提示信息样式 */
.upload-tips {
    margin-top: 8px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #409eff;
    font-size: 12px;
    color: #4e5969;
    line-height: 1.4;
}

/* 模板下载区域样式 */
.template-section {
    border-top: 1px solid #e5e6eb;
    padding-top: 12px;
}

.template-card {
    background: linear-gradient(135deg, #f6f8fc 0%, #ffffff 100%);
    border: 1px solid #e5e6eb;
    border-radius: 8px;
    padding: 12px 16px;
    transition: all 0.3s ease;
}

.template-card:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.template-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.template-icon {
    font-size: 16px;
    color: #409eff;
    margin-right: 6px;
}

.template-title {
    font-size: 14px;
    font-weight: 500;
    color: #1f2329;
}

.template-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.template-desc {
    font-size: 12px;
    color: #86909c;
    margin: 0;
    line-height: 1.4;
}

/* 对话框底部样式 */
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 12px;
}

.dialog-footer .el-button {
    min-width: 70px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .import-container {
        padding: 16px 0;
    }

    .upload-demo :deep(.el-upload-dragger) {
        padding: 30px 15px;
    }

    .upload-icon {
        font-size: 40px;
    }

    .template-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
}
</style>