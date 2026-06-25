<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="分配类型" prop="allocationType">
                        <el-select v-model="queryParams.allocationType" placeholder="请选择分配类型" clearable>
                            <el-option v-for="dict in allocation_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分配状态" prop="allocationStatus">
                        <el-input v-model="queryParams.allocationStatus" placeholder="请输入分配状态" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="物流状态" prop="logisticsStatus">
                        <el-select v-model="queryParams.logisticsStatus" placeholder="请选择物流状态" clearable>
                            <el-option v-for="dict in logistics_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="订单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="上位单号" prop="refDocNumber">
                            <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单据类型编码" prop="docTypeCode">
                            <el-input v-model="queryParams.docTypeCode" placeholder="请输入单据类型编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单据类型名称" prop="docTypeName">
                            <el-input v-model="queryParams.docTypeName" placeholder="请输入单据类型名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料编码" prop="materialCode">
                            <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料名称" prop="materialName">
                            <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="订单数量" prop="orderedQty">
                            <el-input v-model="queryParams.orderedQty" placeholder="请输入订单数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="分配数量" prop="allocatedQty">
                            <el-input v-model="queryParams.allocatedQty" placeholder="请输入分配数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="确认数量" prop="confirmedQty">
                            <el-input v-model="queryParams.confirmedQty" placeholder="请输入确认数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="质检状态" prop="qcStatus">
                            <el-select v-model="queryParams.qcStatus" placeholder="请选择质检状态" clearable>
                                <el-option v-for="dict in wes_qc_status" :key="dict.value" :label="dict.label" :value="dict.value" />

                            </el-select>
                        </el-form-item>
                        <el-form-item label="源库位" prop="sourceLocCode">
                            <el-input v-model="queryParams.sourceLocCode" placeholder="请输入源库位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标库位" prop="targetLocCode">
                            <el-input v-model="queryParams.targetLocCode" placeholder="请输入目标库位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源容器编码" prop="sourceLeCode">
                            <el-input v-model="queryParams.sourceLeCode" placeholder="请输入源容器编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标容器编码" prop="targetLeCode">
                            <el-input v-model="queryParams.targetLeCode" placeholder="请输入目标容器编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="过账状态" prop="ediStatus">
                            <el-select v-model="queryParams.ediStatus" placeholder="请选择过账状态" clearable>
                                <el-option v-for="dict in edi_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="过账时间" style="width: 320px">
                            <el-date-picker v-model="daterangeEdiTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="过账信息" prop="ediMsg">
                            <el-input v-model="queryParams.ediMsg" placeholder="请输入过账信息" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="创建时间" style="width: 320px">
                            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="创建人" prop="createBy">
                            <el-input v-model="queryParams.createBy" placeholder="请输入创建人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="更新时间" style="width: 320px">
                            <el-date-picker v-model="daterangeUpdateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="更新人" prop="updateBy">
                            <el-input v-model="queryParams.updateBy" placeholder="请输入更新人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                    </span>
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                        <el-button @click="showAllSearchTop=!showAllSearchTop">
                            <span style="vertical-align: middle">{{!showAllSearchTop ? '展开':'收起'}}</span>
                            <el-icon style="vertical-align: middle">
                                <ArrowDown v-if="!showAllSearchTop" />
                                <ArrowUp v-else />
                            </el-icon>
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <!-- 添加或修改移库分配对话框 -->
        <el-dialog :title="title" v-model="open" width="1200px" append-to-body class="transfer-dialog">
            <div class="dialog-content">
                <!-- 精简的操作提示区域 -->
                <div class="operation-header">
                    <div class="header-left">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                        <span class="tip-text">配置源库位和目标库位信息</span>
                    </div>
                    <el-button type="primary" icon="Plus" @click="addItem" size="small" class="add-btn">
                        新增任务
                    </el-button>
                </div>
                <!-- 紧凑的表单区域 -->
                <div class="form-container">
                    <el-form ref="transferAllocationRef" :model="formData" :rules="rules" label-width="80px">
                        <div class="items-grid">
                            <el-form-item label="移库方式" prop="way">
                                <el-select v-model="formData.way" placeholder="请选择">
                                    <el-option label="AGV搬运" value="1"></el-option>
                                    <el-option label="人工搬运" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <template v-for="(item, index) in formData.confirmItems" :key="index">
                                <div class="item-row">
                                    <!-- 任务序号 -->
                                    <div class="task-number">
                                        <span class="number">{{ index + 1 }}</span>
                                    </div>
                                    <!-- 源库位 -->
                                    <div class="input-group">
                                        <el-form-item label="源库位" :prop="`confirmItems.${index}.sourceLocCode`" :rules="rules.sourceLocCode" class="compact-form-item">
                                            <el-input v-model="item.sourceLocCode" placeholder="源库位编码" size="small" clearable />
                                        </el-form-item>
                                    </div>
                                    <!-- 箭头 -->
                                    <div class="arrow-container">
                                        <el-icon class="transfer-arrow">
                                            <Right />
                                        </el-icon>
                                    </div>
                                    <!-- 目标库位 -->
                                    <div class="input-group">
                                        <el-form-item label="目标库位" :prop="`confirmItems.${index}.targetLocCode`" :rules="rules.targetLocCode" class="compact-form-item">
                                            <el-input v-model="item.targetLocCode" placeholder="目标库位编码" size="small" clearable />
                                        </el-form-item>
                                    </div>
                                    <!-- 备注 -->
                                    <div class="input-group">
                                        <el-form-item label="备注" :prop="`confirmItems.${index}.notes`" class="compact-form-item">
                                            <el-input v-model="item.notes" placeholder="请输入备注" size="small" clearable />
                                        </el-form-item>
                                    </div>

                                    <!-- 操作按钮 -->
                                    <div class="action-container">
                                        <el-button v-if="formData.confirmItems.length > 1" link type="danger" icon="Delete" @click="removeItem(index)" size="small" class="delete-btn" v-hasPermi="['transfer:transferAllocation:remove']">
                                        </el-button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </el-form>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <el-card shadow="never">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['transfer:transferAllocation:add']">新增</el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['transfer:transferAllocation:remove']">删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['transfer:transferAllocation:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="transferAllocationList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="分配类型" width="150" align="center" prop="allocationType" sortable="custom" />
                <!-- <el-table-column label="分配类型" width="150" align="center" prop="allocationType" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="allocation_type" :value="scope.row.allocationType" />
                    </template>
                </el-table-column> -->
                <el-table-column label="分配状态" align="center" width="150" prop="allocationStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.allocationStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="物流状态" align="center" width="150" prop="logisticsStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.logisticsStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="订单号" width="150" align="center" prop="docNumber" sortable="custom" />
                <el-table-column label="上位单号" width="150" align="center" prop="refDocNumber" sortable="custom" />
                <el-table-column label="明细行号" width="150" align="center" prop="detailLineNum" sortable="custom" />
                <el-table-column label="上位行号" width="150" align="center" prop="refDetailLineNum" sortable="custom" />
                <el-table-column label="单据类型编码" width="150" align="center" prop="docTypeCode" sortable="custom" />
                <el-table-column label="单据类型名称" width="150" align="center" prop="docTypeName" sortable="custom" />
                <!-- <el-table-column label="移库方式" align="center" prop="way" width="180px" sortable="custom">
                    <template #default="scope">
                        <div v-if="scope.row.way==1">AGV搬运</div>
                        <div v-if="scope.row.way==2">人工搬运</div>
                    </template>
                </el-table-column> -->
                <el-table-column label="物料编码" width="180" align="center" prop="materialCode" sortable="custom" />
                <el-table-column label="物料名称" width="200" align="center" prop="materialName" sortable="custom" />
                <el-table-column label="订单数量" width="150" align="center" prop="orderedQty" sortable="custom" />
                <el-table-column label="分配数量" width="150" align="center" prop="allocatedQty" sortable="custom" />
                <el-table-column label="确认数量" width="150" align="center" prop="confirmedQty" sortable="custom" />
                <el-table-column label="单位" align="center" prop="unit" sortable="custom" />
                <el-table-column label="质检状态" width="150" align="center" prop="qcStatus">
                    <template #default="scope">
                        <dict-tag :options="wes_qc_status" :value="scope.row.qcStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="源库位" width="150" align="center" prop="sourceLocCode" sortable="custom" />
                <el-table-column label="目标库位" width="150" align="center" prop="targetLocCode" sortable="custom" />
                <el-table-column label="源容器编码" width="160" align="center" prop="sourceLeCode" sortable="custom" />
                <el-table-column label="目标容器编码" width="160" align="center" prop="targetLeCode" sortable="custom" />
                <el-table-column label="批次编码" width="150" align="center" prop="batchCode" sortable="custom" />
                <el-table-column label="备注" width="150" align="center" prop="notes" sortable="custom" />
                <!-- <el-table-column label="过账状态" width="150" align="center" prop="ediStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="edi_status" :value="scope.row.ediStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="过账时间" align="center" prop="ediTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.ediTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过账信息" width="150" align="center" prop="ediMsg" sortable="custom" /> -->
                <el-table-column label="创建人" width="150" align="center" prop="createBy" sortable="custom" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" width="150" align="center" prop="updateBy" sortable="custom" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['transfer:transferAllocation:edit']">修改</el-button> -->
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['transfer:transferAllocation:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
    </div>
</template>
<script setup name="TransferAllocation">

import {
    listTransferAllocation,
    getTransferAllocation,
    delTransferAllocation,
    transferConfirm
} from "@/api/transfer/transferAllocation"

const { proxy } = getCurrentInstance()
// const transferAllocationRef = ref()

const { wes_common_status, allocation_type, logistics_status, wes_qc_status } = proxy.useDict("wes_common_status", "allocation_type", "logistics_status", "wes_qc_status")

const transferAllocationList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const showAllSearchTop = ref(false)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeEdiTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])
const transferAllocationRef = ref()


const data = reactive({
    formData: {
        way: '1',
        confirmItems: [{ sourceLocCode: '', targetLocCode: "", notes: "" }]
    },
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        allocationType: undefined,
        allocationStatus: undefined,
        logisticsStatus: undefined,
        docNumber: undefined,
        refDocNumber: undefined,
        detailId: undefined,
        detailLineNum: undefined,
        refDetailLineNum: undefined,
        docTypeId: undefined,
        docTypeCode: undefined,
        docTypeName: undefined,
        materialCode: undefined,
        materialName: undefined,
        sourceStockId: undefined,
        targetStockId: undefined,
        orderedQty: undefined,
        allocatedQty: undefined,
        confirmedQty: undefined,
        unit: undefined,
        qcStatus: undefined,
        sourceLocCode: undefined,
        targetLocCode: undefined,
        sourceLeCode: undefined,
        targetLeCode: undefined,
        batchCode: undefined,
        notes: undefined,
        ediStatus: undefined,
        ediTime: undefined,
        ediMsg: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },

    rules: {
        sourceLocCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        targetLocCode: [{ required: true, message: '请输入', trigger: 'blur' }],
    }
})

const { queryParams, formData, rules } = toRefs(data)

/**
 * 查询移库分配列表
 */
function getList() {
    loading.value = true
    queryParams.value.params = {}
    if (null != daterangeEdiTime && "" != daterangeEdiTime) {
        queryParams.value.params["beginEdiTime"] = daterangeEdiTime.value[0]
        queryParams.value.params["endEdiTime"] = daterangeEdiTime.value[1]
    }
    if (null != daterangeCreateTime && "" != daterangeCreateTime) {
        queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
        queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
    }
    if (null != daterangeUpdateTime && "" != daterangeUpdateTime) {
        queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0]
        queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1]
    }
    listTransferAllocation(queryParams.value).then(response => {
        transferAllocationList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}

/**
 * 新增条目
 */
const addItem = () => {
    formData.value.confirmItems.push({ sourceLocCode: '', targetLocCode: "", notes: "" })
}

/**
 * 删除条目
 * @param {Number} index - 条目索引
 */
const removeItem = (index) => {
    if (formData.value.confirmItems.length > 1) {
        formData.value.confirmItems.splice(index, 1)
    }
}

/**
 * 取消按钮
 */
function cancel() {
    open.value = false
    reset()
}

/**
 * 表单重置
 */
function reset() {
    proxy.resetForm("transferAllocationRef")
}

/**
 * 搜索按钮操作
 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/**
 * 重置按钮操作
 */
function resetQuery() {
    daterangeEdiTime.value = []
    daterangeCreateTime.value = []
    daterangeUpdateTime.value = []
    proxy.resetForm("queryRef")
    handleQuery()
}

/**
 * 处理表格排序变化
 * @param {Object} sortInfo 排序信息，包含 column, prop, order
 */
function handleSortChange(sortInfo) {
    const { prop, order } = sortInfo
    if (prop && order) {
        queryParams.value.orderByColumn = prop
        queryParams.value.isAsc = order === 'ascending' ? 'asc' : 'desc'
    } else {
        // 如果没有排序信息，恢复默认排序
        queryParams.value.orderByColumn = 'id'
        queryParams.value.isAsc = 'desc'
    }
    // 重新请求数据
    queryParams.value.pageNum = 1
    getList()
}

/**
 * 多选框选中数据
 * @param {Array} selection - 选中的数据
 */
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/**
 * 新增按钮操作
 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "新增移库"
}

/**
 * 修改按钮操作
 * @param {Object} row - 行数据
 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getTransferAllocation(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改移库分配"
    })
}

/**
 * 提交按钮
 */
const submitForm = async () => {
    try {
        await transferAllocationRef.value.validate()
        transferConfirm(formData.value)
            .then(response => {
                proxy.$modal.msgSuccess("新增任务成功")
                getList()
            })
            .finally(() => {
                buttonLoading.value = false
                cancel()
            })
    } catch (error) {
        console.log(error, '请正确填写所有必填项')

    }
}

/**
 * 删除按钮操作
 * @param {Object} row - 行数据
 */
function handleDelete(row) {
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认删除移库分配编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delTransferAllocation(_ids)
        })
        .then(() => {
            loading.value = true
            getList()
            proxy.$modal.msgSuccess("删除成功")
        })
        .catch(() => { })
        .finally(() => {
            loading.value = false
        })
}

/**
 * 导出按钮操作
 */
function handleExport() {
    proxy.download(
        "transfer/transferAllocation/export",
        {
            ...queryParams.value
        },
        `移库分配_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
<style lang="scss" scoped>
.transfer-dialog {
    .dialog-content {
        padding: 0;
    }

    .operation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 6px;
        margin-bottom: 16px;

        .header-left {
            display: flex;
            align-items: center;
            gap: 8px;

            .info-icon {
                color: #409eff;
                font-size: 16px;
            }

            .tip-text {
                font-size: 13px;
                color: #606266;
                font-weight: 500;
            }
        }

        .add-btn {
            padding: 6px 12px;
            font-size: 12px;
            border-radius: 4px;
        }
    }

    /* 紧凑的表单容器 */
    .form-container {
        max-height: 450px;
        overflow-y: auto;
        padding: 0 4px;

        /* 美化滚动条 */
        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 2px;

            &:hover {
                background: #a8a8a8;
            }
        }
    }

    /* 网格布局的任务行 */
    .items-grid {
        .item-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 8px 12px;
            margin-bottom: 8px;
            background: #fafbfc;
            border: 1px solid #e4e7ed;
            border-radius: 6px;
            transition: all 0.2s ease;

            &:hover {
                background: #f0f9ff;
                border-color: #409eff;
                box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    /* 任务序号 */
    .task-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;

        .number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            background: #409eff;
            color: white;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 600;
        }
    }

    /* 输入组 */
    .input-group {
        flex: 1;
        min-width: 0;

        .compact-label {
            display: inline-block;
            font-size: 12px;
            color: #606266;
            margin-bottom: 4px;
            font-weight: 500;
        }

        .compact-form-item {
            margin-bottom: 0px !important;
            padding: 10px;

            :deep(.el-form-item__content) {
                line-height: 1;
            }

            :deep(.el-form-item__error) {
                font-size: 11px;
                padding-top: 2px;
            }
        }
    }

    /* 箭头容器 */
    .arrow-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;

        .transfer-arrow {
            color: #409eff;
            font-size: 16px;
            font-weight: bold;
        }
    }

    /* 操作按钮容器 */
    .action-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;

        .delete-btn {
            padding: 4px;
            border-radius: 4px;

            &:hover {
                background-color: #fef0f0;
                color: #f56c6c;
            }
        }
    }
}

/* 响应式优化 */
@media (max-width: 1200px) {
    .transfer-dialog {
        .el-dialog {
            width: 90% !important;
        }
    }
}

@media (max-width: 768px) {
    .transfer-dialog {
        .el-dialog {
            width: 95% !important;
            margin: 5vh auto;
        }

        .item-row {
            flex-direction: column;
            gap: 8px;

            .task-number,
            .arrow-container,
            .action-container {
                margin-top: 0;
                align-self: center;
            }

            .arrow-container .transfer-arrow {
                transform: rotate(90deg);
            }
        }
    }
}
</style>
