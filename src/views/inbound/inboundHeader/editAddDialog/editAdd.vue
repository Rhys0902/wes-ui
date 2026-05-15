<template>
    <el-dialog :title="props.isEditDialog ? '编辑' : '新增'" v-model="props.open" width="80%" append-to-body @close="cancelForm">
        <div class="type_title">基本信息</div>
        <el-form ref="form" :rules="rules" :model="formParam" :inline="true" label-width="120px">
            <el-form-item label="WMS单号">
                <el-input disabled style="display: inline-block" v-model="formParam.docNumber" :placeholder="props.isEditDialog == true ? '请输入' : '自动生成'" clearable />
            </el-form-item>
            <el-form-item label="单据类型" prop="docTypeId">
                <el-select v-if="!props.isEditDialog" v-model="formParam.docTypeId" clearable placeholder="请选择">
                    <el-option v-for="(v, i) in basDocTypeList" :label="v.docTypeName" :value="v.id" :key="i"></el-option>
                </el-select>
                <el-input v-else disabled :placeholder="props.selectRowData[0].docTypeName" />
            </el-form-item>
            <el-form-item label="收货方式" prop="way">
                <el-select v-model="formParam.way" placeholder="请选择">
                    <el-option label="AGV搬运" value="1"></el-option>
                    <el-option label="人工搬运" value="2"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="notes">
                <el-input type="textarea" v-model="formParam.notes" placeholder="请输入" />
            </el-form-item>
        </el-form>
        <div class="type_title">明细信息</div>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" icon="Plus" plain @click="handleAddMaterial">批量添加</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" icon="Edit" plain @click="handleEditBtn">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" @click="handleDeleteBtn">删除</el-button>
            </el-col>
            <!-- 新增导入明细按钮 -->
            <el-col :span="1.5">
                <el-button type="info" plain icon="Upload" @click="handleImportDialog">导入明细</el-button>
            </el-col>
        </el-row>
        <el-table class="show_checkbox" ref="multipleTable" :data="tableData" @row-click="rowClick" border style="width: 100%; cursor: pointer"   max-height="400"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="明细行号" align="center" prop="lineNum" width="100" />
            <el-table-column prop="materialCode" align="center" :required="true" width="250" label="物料编码(必填)" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ materialMap[row.materialId] }}</span>
                    <el-select v-if="cur_index === $index" filterable @change="getMaterialInfo(row.materialId, row, $index)" v-model="tableData[$index].materialId" placeholder>
                        <el-option v-for="item in materialList" :label="item.materialCode + '|' + item.materialName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="物料名称" prop="materialName" width="200" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="unit" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="订单数量(必填)" prop="orderedQty" align="center" :required="true">
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ row.orderedQty }}</span>
                    <el-input tyle="number" @input="valueChange(row.orderedQty, row)" v-if="cur_index == $index" v-model="tableData[$index].orderedQty" placeholder="请输入"></el-input>
                </template>
            </el-table-column>
            <!-- <el-table-column label="批次编码" prop="batchCode" align="center" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if=" cur_index !==$index">{{ row.batchCode }}</span>
                    <el-input v-if="cur_index == $index" v-model.trim="tableData[$index].batchCode" placeholder="请输入"></el-input>
                </template>
            </el-table-column> -->
        </el-table>

        <!-- 使用导入组件 -->
        <ImportDetailDialog v-model="importDialogVisible" title="导入入库明细" template-file-name="入库明细导入模板.xlsx" :material-list="materialList" :existing-data="tableData" @import-success="handleImportSuccess" />

        <template #footer>
            <div class="dialog-footer">
                <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancelForm">取 消</el-button>
            </div>
        </template>
        <!-- 抽屉 -->
        <materialListAdd :drawerMaterial="drawerMaterial" @selectList="selectList" @cancelDrawer="cancelDrawer" />
    </el-dialog>
</template>

<script setup>
import { filterKey, filterParams } from "@/utils/index"
import { listBasMaterial } from "@/api/bas/basMaterial"
import { listBasDocType } from "@/api/bas/basDocType"
import { inboundHeaderAdd, inboundHeaderEdit } from "@/api/inbound/inboundHeaderDetail"
import { listInboundDetail } from "@/api/inbound/inboundDetail"
import materialListAdd from "@/views/components/materialList.vue"
import ImportDetailDialog from "@/components/ImportDetailDialog/index.vue"

const reg = /^\+?[1-9]\d*$/

const { proxy } = getCurrentInstance()

const props = defineProps({
    open: {
        // 参数类型
        type: Boolean,
        // 参数默认值
        default: false
    },
    selectRowData: {
        // 参数类型
        type: Array,
        // 参数默认值
        default: []
    },
    isEditDialog: {
        // 参数类型
        type: Boolean,
        // 参数默认值
        default: false
    },
})

const maxId = ref(0)
const basDocTypeList = ref([])
const tableData = ref([])
const multipleSelection = ref([])
const cur_index = ref(-1)
const buttonLoading = ref(false)

const materialList = ref([])
const materialMap = ref({})
const drawerMaterial = ref(false)

// 导入相关变量
const importDialogVisible = ref(false)
const fileList = ref([])
const currentFile = ref(null)
const importLoading = ref(false)
const uploadRef = ref(null)

const data = reactive({
    formParam: {
        id: "",
        docNumber: "",
        refDocNumber: "",
        docTypeId: "",
        notes: "",
        way: "1"
    },

    ParamsDocTypeList: {
        docTypeGroup: "IN",
        handlerCheck: "Y",
        page: 1
    },

    rules: {
        docTypeId: [
            { required: true, message: "请选择单据类型", trigger: "blur" },
        ],
    }
})

const { ParamsDocTypeList, formParam, rules } = toRefs(data)
const emit = defineEmits(["cancelDialog"])

/**
 * 取消表单操作
 */
function cancelForm() {
    emit("cancelDialog", false)
}

/**
 * 取消抽屉操作
 */
const cancelDrawer = () => {
    drawerMaterial.value = false
}

/**
 * 获取订单类型数据
 */
function getDocType() {
    listBasDocType(ParamsDocTypeList.value).then(response => {
        basDocTypeList.value = response.rows
    })
}

/**
 * 获取物料列表数据
 */
function listBasMaterialPromise() {
    listBasMaterial().then(response => {
        if (response.rows.length == 0) return
        materialList.value = response.rows.map(record => {
            materialMap.value[record.id + ""] = record.materialNCode
            return {
                ...record,
                id: record.id + ""
            }
        })
    })
}

getDocType()
listBasMaterialPromise()

/**
 * 优化物料选择列表数据处理
 * @param {Array} selection - 选中的物料数据数组
 */
const selectList = (selection) => {
    if (!selection?.length) return

    // 批量创建新行数据
    const newRows = selection.map(material => {
        maxId.value++
        return {
            id: maxId.value,
            detailId: "",
            // batchCode: "",
            orderedQty: "",
            materialId: String(material.id),
            materialCode: material.materialCode,
            materialName: material.materialName,
            unit: material.unit
        }
    })

    // 一次性添加所有行，减少响应式更新次数
    tableData.value.push(...newRows)

    // 批量更新物料映射
    const newMaterialMap = {}
    selection.forEach(material => {
        newMaterialMap[String(material.id)] = material.materialCode
    })
    Object.assign(materialMap.value, newMaterialMap)

    drawerMaterial.value = false

    // 使用 nextTick 确保 DOM 更新后再设置编辑状态
    nextTick(() => {
        if (selection.length > 0) {
            cur_index.value = tableData.value.length - 1
        }
    })
}

/**
 * 添加新行
 */
const handleAddBtn = () => {
    maxId.value++
    const obj = {}
    obj.id = ""
    obj.detailId = ""
    // obj.batchCode = ""
    obj.orderedQty = ""
    obj.materialId = ""
    obj.id = maxId.value
    tableData.value.push(obj)
    setTimeout(() => {
        cur_index.value = tableData.value.length - 1
    }, 500)
}

/**
 * 新增物料信息，可多选
 */
const handleAddMaterial = () => {
    drawerMaterial.value = true
}

/**
 * 编辑按钮处理
 */
const handleEditBtn = () => {
    if (multipleSelection.value.length == 0 || multipleSelection.value.length > 1) {
        proxy.$modal.msgError("请选中一条数据")
        return false
    }
    let val = multipleSelection.value[0]
    var n = tableData.value.findIndex((value, index) => {
        return (val.id && val.id == value.id) || (val.detailId && val.detailId == value.detailId)
    })
    if (n != -1) {
        cur_index.value = n
    }
}

/**
 * 表格选择变化处理
 * @param {Array} val - 选中的行数据
 */
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}

/**
 * 获取物料信息
 * @param {String} id - 物料ID
 * @param {Object} v - 行数据
 * @param {Number} index - 行索引
 */
const getMaterialInfo = (id, v, index) => {
    const targetMaterialCode = materialList.value.find(r => {
        return r.id == id
    })
    if (targetMaterialCode != null) {
        tableData.value[index].materialCode = targetMaterialCode.materialCode
        tableData.value[index].materialName = targetMaterialCode.materialName
        tableData.value[index].unit = targetMaterialCode.unit
    }
}

/**
 * 优化批量删除函数
 */
const handleDeleteBtn = () => {
    if (multipleSelection.value.length === 0) {
        proxy.$modal.msgError("请选中一条数据")
        return
    }

    proxy.$modal.confirm("确定删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--orange",
        type: "warning"
    }).then(() => {
        // 使用 Set 提高查找效率
        const selectedIds = new Set(multipleSelection.value.map(item => item.id || item.detailId))

        // 一次性过滤，避免多次 splice 操作
        tableData.value = tableData.value.filter(item =>
            !selectedIds.has(item.id) && !selectedIds.has(item.detailId)
        )

        // 清空选择
        proxy.$refs.multipleTable?.clearSelection()
    })
}

/**
 * 数量输入值变化处理
 * @param {String} orderedQty - 订单数量
 * @param {Object} v - 行数据
 */
const valueChange = (orderedQty, v) => {
    orderedQty = orderedQty.replace(/(^\s*)|(\s*$)/g, "")
    const reg = /[^\d]/g
    // 只能是数字，不能是其他输入
    orderedQty = orderedQty.replace(reg, "")
    tableData.value[cur_index.value]['orderedQty'] = orderedQty
}

/**
 * 行点击事件处理
 * @param {Object} row - 行数据
 * @param {Event} event - 事件对象
 * @param {Object} column - 列对象
 */
const rowClick = (row, event, column) => {
    let index = tableData.value.indexOf(row)
    cur_index.value = index

    if (column.property == "deel") {
        cur_index.value = null
    }
}

/**
 * 打开导入弹框
 */
const handleImportDialog = () => {
    importDialogVisible.value = true
}

/**
 * 处理导入成功事件
 * @param {Object} result - 导入结果
 */
const handleImportSuccess = (result) => {
    const { importedData } = result

    // 批量添加导入的数据到表格
    importedData.forEach(item => {
        maxId.value++
        tableData.value.push({
            id: maxId.value,
            detailId: "",
            ...item
        })
    })

    // 批量更新物料映射
    const newMaterialMap = {}
    importedData.forEach(item => {
        newMaterialMap[item.materialId] = item.materialCode
    })
    Object.assign(materialMap.value, newMaterialMap)
}

// 移除原有的导入相关函数：handleFileChange, handleDownloadTemplate, handleImportData, processImportData

/**
 * 处理导入的数据并添加到表格
 * @param {Array} importData - 导入的数据
 * @returns {Object} 成功和失败的数量统计
 */
const processImportData = (importData) => {
    let successCount = 0
    let errorCount = 0

    importData.forEach(item => {
        // 验证必填字段
        if (!item.物料编码 || item.订单数量 === undefined) {
            errorCount++
            return
        }

        // 查找匹配的物料信息
        const material = materialList.value.find(
            mat => mat.materialCode === item.物料编码?.toString().trim()
        )

        if (!material) {
            errorCount++
            return
        }

        // 验证数量是否为数字
        const qty = Number(item.订单数量)
        if (isNaN(qty) || qty <= 0) {
            errorCount++
            return
        }

        // 检查是否已存在相同物料和批次
        const exists = tableData.value.some(
            row => row.materialId === material.id // && row.batchCode === (item.批次编码?.toString().trim() || '')
        )

        if (!exists) {
            maxId.value++
            tableData.value.push({
                id: maxId.value,
                detailId: "",
                materialId: String(material.id),
                materialCode: material.materialCode,
                materialName: material.materialName,
                unit: material.unit,
                orderedQty: qty.toString()
                // batchCode: item.批次编码?.toString().trim() || ''
            })
            successCount++
        } else {
            errorCount++
        }
    })

    return { successCount, errorCount }
}

/**
 * 提交表单
 */
async function submitForm() {
    proxy.$refs["form"].validate(valid => {
        if (valid) {
            if (tableData.value.length == 0) {
                proxy.$modal.msgError("当前无数据，请检查")
                return false
            }
            for (let i = 0; i < tableData.value.length; i++) {
                if (!tableData.value[i].materialCode || !tableData.value[i].orderedQty) {
                    proxy.$modal.msgError("请检查必填项是否填写完整")
                    return
                }
            }
            let datas = []
            for (let i = 0; i < tableData.value.length; i++) {
                let obj = {
                    // batchCode: "",
                    orderedQty: "",
                    materialId: ""
                }
                filterKey(obj, tableData.value[i])
                obj.orderedQty = Number(tableData.value[i].orderedQty)
                if (props.isEditDialog && tableData.value[i].id != null) {
                    obj.detailId = tableData.value[i].id
                }
                datas.push(obj)
            }
            let params = {
                ...filterParams(formParam.value),
                inboundDetailAddBoList: datas
            }
            if (props.isEditDialog) {
                params.id = props.selectRowData[0].id
                inboundUpdate(params)

            } else {
                inboundAdd(params)
            }
        }
    })
}

/**
 * 查询入库明细列表
 */
function getList() {
    listInboundDetail({ headerId: props.selectRowData[0].id }).then(response => {
        tableData.value = response.rows
    })
}

if (props.isEditDialog) {
    filterKey(formParam.value, props.selectRowData[0])
    if (formParam.value.way !== undefined && formParam.value.way !== null) {
        formParam.value.way = formParam.value.way.toString()
    }
    getList()
}

/**
 * 新增入库单
 * @param {Object} params - 参数对象
 */
const inboundAdd = (params) => {
    buttonLoading.value = true
    inboundHeaderAdd(params)
        .then(response => {
            proxy.$message.success("新增成功")
            cancelForm()
        })
        .finally(() => {
            buttonLoading.value = false
        })
}

/**
 * 更新入库单
 * @param {Object} params - 参数对象
 */
const inboundUpdate = (params) => {
    inboundHeaderEdit(params)
        .then(response => {
            proxy.$message.success("修改成功")
            cancelForm()
        })
        .finally(() => { })
}
</script>

<style scoped>
.upload-demo {
    margin-bottom: 20px;
}

.text-danger {
    color: #ff4d4f;
}

.mb8 {
    margin-bottom: 8px;
}

.type_title {
    font-size: 14px;
    font-weight: bold;
    color: #1f2329;
    margin: 10px 0;
    padding-left: 5px;
    border-left: 3px solid #409eff;
}

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

/* 文件列表样式优化 */
.upload-demo :deep(.el-upload-list) {
    margin-top: 16px;
}

.upload-demo :deep(.el-upload-list__item) {
    background: #f8f9fa;
    border: 1px solid #e5e6eb;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
}

.upload-demo :deep(.el-upload-list__item:hover) {
    background: #f0f8ff;
    border-color: #409eff;
}

.upload-demo :deep(.el-upload-list__item-name) {
    color: #1f2329;
    font-weight: 500;
}

/* 加载状态样式 */
.upload-demo :deep(.el-loading-mask) {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
}
</style>