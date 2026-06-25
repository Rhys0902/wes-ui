<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="110px">
                    <el-form-item label="订单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="分配类型" prop="allocationType">
                        <el-select v-model="queryParams.allocationType" placeholder="请选择分配类型" clearable>
                            <el-option v-for="dict in wes_logistics_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分配状态" prop="allocationStatus">
                        <el-select v-model="queryParams.allocationStatus" placeholder="请选择分配状态" clearable>
                            <el-option v-for="dict in wes_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物流状态" prop="logisticsStatus">
                        <el-select v-model="queryParams.logisticsStatus" placeholder="请选择物流状态" clearable>
                            <el-option v-for="dict in wes_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <!-- <el-form-item label="上位单号" prop="refDocNumber">
                            <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
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
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="质检状态" prop="qcStatus">
                            <el-select v-model="queryParams.qcStatus" placeholder="请选择质检状态" clearable>
                                <el-option v-for="dict in wes_qc_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="源库位ID" prop="sourceLocId">
                            <el-input v-model="queryParams.sourceLocId" placeholder="请输入源库位ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> <el-form-item label="目标库位ID" prop="targetLocId">
                            <el-input v-model="queryParams.targetLocId" placeholder="请输入目标库位ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->

                        <el-form-item label="源库位" prop="sourceLocCode">
                            <el-input v-model="queryParams.sourceLocCode" placeholder="请输入源库位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="目标库位" prop="targetLocCode">
                            <el-input v-model="queryParams.targetLocCode" placeholder="请输入目标库位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="容器ID" prop="leId">
                            <el-input v-model="queryParams.leId" placeholder="请输入容器ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="容器编码" prop="leCode">
                            <el-input v-model="queryParams.leCode" placeholder="请输入容器编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="批次属性ID" prop="batchId">
                            <el-input v-model="queryParams.batchId" placeholder="请输入批次属性ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <!-- <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <!-- <el-form-item label="批次属性1" prop="lotAttr01">
                            <el-input v-model="queryParams.lotAttr01" placeholder="请输入批次属性1" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次属性2" prop="lotAttr02">
                            <el-input v-model="queryParams.lotAttr02" placeholder="请输入批次属性2" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次属性3" prop="lotAttr03">
                            <el-input v-model="queryParams.lotAttr03" placeholder="请输入批次属性3" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次属性4" prop="lotAttr04">
                            <el-input v-model="queryParams.lotAttr04" placeholder="请输入批次属性4" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次属性5" prop="lotAttr05">
                            <el-input v-model="queryParams.lotAttr05" placeholder="请输入批次属性5" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="过账状态" prop="ediStatus">
                            <el-input v-model="queryParams.ediStatus" placeholder="请输入过账状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="过账时间" style="width: 320px">
                            <el-date-picker v-model="daterangeEdiTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="过账信息" prop="ediMsg">
                            <el-input v-model="queryParams.ediMsg" placeholder="请输入过账信息" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="创建人" prop="createBy">
                            <el-input v-model="queryParams.createBy" placeholder="请输入创建人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="创建时间" style="width: 320px">
                            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="更新人" prop="updateBy">
                            <el-input v-model="queryParams.updateBy" placeholder="请输入更新人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="更新时间" style="width: 320px">
                            <el-date-picker v-model="daterangeUpdateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                    </span>
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                        <el-button @click="showAllSearchTop=!showAllSearchTop">
                            <span style="vertical-align: middle">{{!showAllSearchTop?'展开':'收起'}}</span>
                            <el-icon style="vertical-align: middle">
                                <ArrowDown v-if="!showAllSearchTop" />
                                <ArrowUp v-else />
                            </el-icon>
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <el-card shadow="hover">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="SemiSelect" :disabled="multiple" @click="handleCancel" v-hasPermi="['inbound:inboundAllocation:cancelputaway']">取消收货</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Grid" :disabled="inboundAllocationList.length==0" @click="handlePutaway" v-hasPermi="['inbound:inboundAllocation:receive']">上架</el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['inbound:inboundAllocation:remove']">删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['inbound:inboundAllocation:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="inboundAllocationList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="分配类型" align="center" width="150" prop="allocationType" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_logistics_type" :value="scope.row.allocationType" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="分配状态" align="center" width="150" prop="allocationStatus">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.logisticsStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="物流状态" align="center" width="150" prop="logisticsStatus">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.logisticsStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="订单号" align="center" width="150" prop="docNumber" sortable="custom" />
                <!-- <el-table-column label="上位单号" align="center" width="150" prop="refDocNumber" sortable="custom" /> -->
                <el-table-column label="单据类型编码" align="center" width="150" prop="docTypeCode" sortable="custom" />
                <el-table-column label="单据类型名称" align="center" width="150" prop="docTypeName" sortable="custom" />
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" sortable="custom" :show-overflow-tooltip="true" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" sortable="custom" :show-overflow-tooltip="true" />
                <el-table-column label="订单数量" align="center" width="150" prop="orderedQty" sortable="custom" />
                <el-table-column label="分配数量" align="center" width="150" prop="allocatedQty" sortable="custom" />
                <el-table-column label="单位" align="center" prop="unit" sortable="custom" />
                <el-table-column label="质检状态" align="center" prop="qcStatus">
                    <template #default="scope">
                        <dict-tag :options="wes_qc_status" :value="scope.row.qcStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="源库位" align="center" width="150" prop="sourceLocCode" sortable="custom" />
                <el-table-column label="目标库位" align="center" width="150" prop="targetLocCode" sortable="custom" />
                <el-table-column label="容器编码" align="center" width="160" prop="leCode" sortable="custom" />
                <!-- <el-table-column label="批次编码" align="center" width="150" prop="batchCode" sortable="custom" /> -->
                <el-table-column label="备注" align="center" width="150" prop="notes" sortable="custom" :show-overflow-tooltip="true" />
                <!-- <el-table-column label="过账状态" align="center" prop="ediStatus" sortable="custom" />
                <el-table-column label="过账时间" align="center" prop="ediTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.ediTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过账信息" align="center" prop="ediMsg" sortable="custom" /> -->
                <el-table-column label="创建人" align="center" prop="createBy" width="150" sortable="custom" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" width="150" sortable="custom" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <div v-if="openRecive">
            <el-dialog title="上架确认" v-model="openRecive" width="90%" append-to-body>
                <Allocation :paramsLecodeList="paramsLecodeList" @submitFinished="submitFinished" @cancelDialog="cancelForm" />
            </el-dialog>
        </div>
    </div>
</template>

<script setup name="InboundAllocation">

import {
    listInboundAllocation,
    getInboundAllocation,
    delInboundAllocation,
    addInboundAllocation,
    updateInboundAllocation,
    inboundAllocationCancelReceive
} from "@/api/inbound/inboundAllocation"

import Allocation from './allocationDialog/allocation'

const { proxy } = getCurrentInstance()
const { wes_common_status, wes_qc_status, wes_logistics_type } = proxy.useDict("wes_common_status", "wes_qc_status", "wes_logistics_type")
const showAllSearchTop = ref(false)

const object = { id: ref(1) }
const inboundAllocationList = ref([])
const open = ref(false)

const openRecive = ref(false)

const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeEdiTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])
const leCodeList = ref([])
const paramsLecodeList = ref([])

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        allocationType: undefined,
        allocationStatus: undefined,
        logisticsStatus: undefined,
        docNumber: undefined,
        docTypeCode: undefined,
        docTypeName: undefined,
        materialCode: undefined,
        materialName: undefined,
        orderedQty: undefined,
        allocatedQty: undefined,
        unit: undefined,
        qcStatus: undefined,
        sourceLocCode: undefined,
        targetLocCode: undefined,
        leCode: undefined,
        // batchCode: undefined,
        notes: undefined,
        ediStatus: undefined,
        ediTime: undefined,
        ediMsg: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        // 添加排序参数
        orderByColumn: 'id',
        isAsc: 'desc'
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询入库分配明细列表 */
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
    listInboundAllocation(queryParams.value).then(response => {
        inboundAllocationList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}




// 表单重置
function reset() {
    form.value = {
        id: null,
        version: null,
        allocationType: null,
        allocationStatus: null,
        logisticsStatus: null,
        docNumber: null,
        refDocNumber: null,

        docTypeCode: null,
        docTypeName: null,
        materialCode: null,
        materialName: null,
        supplierCode: null,
        supplierName: null,
        orderedQty: null,
        allocatedQty: null,
        unit: null,
        qcStatus: null,
        sourceLocCode: null,
        targetLocCode: null,
        leCode: null,
        batchId: null,
        // batchCode: null,
        notes: null,
        ediStatus: null,
        ediTime: null,
        ediMsg: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
    }
    proxy.resetForm("inboundAllocationRef")
}

const submitFinished = () => {
    openRecive.value = val
    getList()
}


const cancelForm = val => {
    open.value = val
    openRecive.value = val
    getList()
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
    daterangeEdiTime.value = []
    daterangeCreateTime.value = []
    daterangeUpdateTime.value = []
    proxy.resetForm("queryRef")
    handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id)
    leCodeList.value = selection.map(item => item.leCode)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加入库分配明细"
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

/** 删除按钮操作 */
function handleDelete(row) {
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认删除入库分配明细编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delInboundAllocation(_ids)
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

/** 取消收货按钮操作 */
function handleCancel(row) {
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认取消入库分配明细编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return inboundAllocationCancelReceive(_ids)
        })
        .then(() => {
            loading.value = true
            getList()
            proxy.$modal.msgSuccess("取消成功")
        })
        .catch(() => { })
        .finally(() => {
            loading.value = false
        })
}

/** 上架按钮操作 */
function handlePutaway() {
    let array = []
    for (var i = 0; i < leCodeList.value.length; i++) {
        if (array.indexOf(leCodeList.value[i]) == -1) {
            array.push(leCodeList.value[i])
        }
    }
    paramsLecodeList.value = array.join(',')
    console.log(paramsLecodeList.value)
    openRecive.value = true
}
/** 导出按钮操作 */
function handleExport() {
    proxy.download(
        "inbound/inboundAllocation/export",
        {
            ...queryParams.value
        },
        `入库分配明细_${new Date().getTime()}.xlsx`
    )
}



getList();
</script>
