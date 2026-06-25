<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
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
                    <el-form-item label="订单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
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
                        <!-- <el-form-item label="拣货数量" prop="pickedQty">
                            <el-input v-model="queryParams.pickedQty" placeholder="请输入拣货数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="发货数量" prop="shippedQty">
                            <el-input v-model="queryParams.shippedQty" placeholder="请输入发货数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
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
                        <!--  <el-form-item label="拣货时间" style="width: 320px">
                            <el-date-picker v-model="daterangePickTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="拣货人" prop="pickBy">
                            <el-input v-model="queryParams.pickBy" placeholder="请输入拣货人" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="发货时间" style="width: 320px">
                            <el-date-picker v-model="daterangeShipTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item label="发货人" prop="shipBy">
                            <el-input v-model="queryParams.shipBy" placeholder="请输入发货人" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->

                        <!-- <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="SemiSelect" :disabled="multiple" @click="handleCancel" v-hasPermi="['outbound:outboundAllocation:remove']">取消分配</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handlePicking" v-hasPermi="['outbound:outboundAllocation:Picking']">下架</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleOutbound" v-hasPermi="['outbound:outboundAllocation:delivery']">出库确认</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleBack" v-hasPermi="['outbound:outboundBack:back']">余料回库</el-button>
                </el-col>

                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['outbound:outboundAllocation:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="outboundAllocationList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="分配类型" align="center" width="150" prop="allocationType" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_logistics_type" :value="scope.row.allocationType" sortable="custom" />
                    </template>
                </el-table-column>
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
                <el-table-column label="订单号" align="center" width="150" prop="docNumber" sortable="custom" />
                <el-table-column label="单据类型编码" width="180" align="center" prop="docTypeCode" sortable="custom" />
                <el-table-column label="单据类型名称" width="150" align="center" prop="docTypeName" sortable="custom" />
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" sortable="custom" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" sortable="custom" />
                <el-table-column label="订单数量" align="center" width="150" prop="orderedQty" sortable="custom" />
                <el-table-column label="分配数量" align="center" width="150" prop="allocatedQty" sortable="custom" />
                <!-- <el-table-column label="拣货数量" align="center" width="150" prop="pickedQty" sortable="custom" />
                <el-table-column label="发货数量" align="center" width="150" prop="shippedQty" sortable="custom" /> -->
                <el-table-column label="单位" align="center" prop="unit" sortable="custom" />
                <el-table-column label="质检状态" align="center" prop="qcStatus">
                    <template #default="scope">
                        <dict-tag :options="wes_qc_status" :value="scope.row.qcStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="源库位" align="center" width="160" prop="sourceLocCode" sortable="custom" />
                <el-table-column label="目标库位" align="center" width="150" prop="targetLocCode" sortable="custom" />
                <el-table-column label="源容器编码" align="center" width="160" prop="sourceLeCode" sortable="custom" />
                <el-table-column label="目标容器编码" align="center" width="160" prop="targetLeCode" sortable="custom" />
                <!-- <el-table-column label="拣货时间" align="center" prop="pickTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.pickTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="拣货人" align="center" prop="pickBy" width="150" sortable="custom" />-->
                <el-table-column label="发货时间" align="center" prop="shipTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.shipTime) }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="发货人" align="center" prop="shipBy" width="150" sortable="custom" /> -->
                <!-- <el-table-column label="批次编码" align="center" width="150" prop="batchCode" sortable="custom" /> -->
                <el-table-column label="备注" align="center" width="150" prop="notes" sortable="custom" :show-overflow-tooltip="true" />
                <!-- <el-table-column label="过账状态" align="center" width="150" prop="ediStatus" sortable="custom" />
                <el-table-column label="过账时间" align="center" prop="ediTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.ediTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过账信息" align="center" width="150" prop="ediMsg" sortable="custom" /> -->
                <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy" width="150" sortable="custom" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" width="150" sortable="custom" />
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 下架确认 -->
        <div v-if="dialogDown">
            <el-dialog title="下架确认" append-to-body v-model="dialogDown" width="90%">
                <pickingDown :paramsLecodeList="paramsLecodeList" @cancelDialog="cancelForm" />
            </el-dialog>
        </div>
        <!-- 出库确认 -->
        <div v-if="dialog">
            <el-dialog title="出库确认" append-to-body v-model="dialog" width="90%">
                <OutBound :paramsLecodeList="paramsLecodeList" @cancelDialog="cancelForm" />
            </el-dialog>
        </div>
        <!-- 余料回库 -->
        <div v-if="dialogBack">
            <el-dialog title="余料回库" append-to-body v-model="dialogBack" width="90%">
                <MaterialBack :paramsLecodeList="paramsLecodeList" @cancelDialog="cancelForm" />
            </el-dialog>
        </div>
    </div>
</template>

<script setup name="OutboundAllocation">
import {
    listOutboundAllocation,
    outboundAllocationCancelOutbound,
    delOutboundAllocation
} from "@/api/outbound/outboundAllocation"

import OutBound from "./outBoundDiaolg/outBound.vue"
import PickingDown from "./downDialog/pickingDown.vue"
import MaterialBack from "./returnBackDialog/materialBack.vue"

const { proxy } = getCurrentInstance()
const { wes_common_status, wes_qc_status, wes_logistics_type } = proxy.useDict("wes_common_status", "wes_qc_status", "wes_common_status", "wes_logistics_type")
const showAllSearchTop = ref(false)

const outboundAllocationList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangePickTime = ref([])
const daterangeShipTime = ref([])
const daterangeEdiTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])
const dialog = ref(false)
const dialogDown = ref(false)
const multipleSelection = ref([])
const leCodeList = ref([])
const paramsLecodeList = ref([])
const docStationList = ref([])
const dialogBack = ref(false)

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        allocationType: undefined,
        allocationStatus: undefined,
        logisticsStatus: undefined,
        docNumber: undefined,
        refDocNumber: undefined,
        docTypeCode: undefined,
        docTypeName: undefined,
        materialCode: undefined,
        materialName: undefined,
        orderedQty: undefined,
        allocatedQty: undefined,
        pickedQty: undefined,
        shippedQty: undefined,
        unit: undefined,
        qcStatus: undefined,
        sourceLocCode: undefined,
        targetLocCode: undefined,
        sourceLeCode: undefined,
        targetLeCode: undefined,
        pickTime: undefined,
        pickBy: undefined,
        shipTime: undefined,
        shipBy: undefined,
        // batchCode: undefined,
        notes: undefined,
        ediStatus: undefined,
        ediTime: undefined,
        ediMsg: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        // 添加排序参数
        orderByColumn: 'id',
        isAsc: 'desc'
    },
})

const { queryParams, form } = toRefs(data)

/** 查询出库分配明细列表 */
function getList() {
    loading.value = true
    queryParams.value.params = {}
    if (null != daterangePickTime && "" != daterangePickTime) {
        queryParams.value.params["beginPickTime"] = daterangePickTime.value[0]
        queryParams.value.params["endPickTime"] = daterangePickTime.value[1]
    }
    if (null != daterangeShipTime && "" != daterangeShipTime) {
        queryParams.value.params["beginShipTime"] = daterangeShipTime.value[0]
        queryParams.value.params["endShipTime"] = daterangeShipTime.value[1]
    }
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
    listOutboundAllocation(queryParams.value).then(response => {
        outboundAllocationList.value = response.rows
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
        detailLineNum: null,
        refDetailLineNum: null,

        docTypeCode: null,
        docTypeName: null,
        materialCode: null,
        materialName: null,

        orderedQty: null,
        allocatedQty: null,
        pickedQty: null,
        shippedQty: null,
        unit: null,
        qcStatus: null,
        sourceLocCode: null,
        targetLocCode: null,
        sourceLeId: null,
        sourceLeCode: null,
        targetLeCode: null,
        pickTime: null,
        pickBy: null,
        shipTime: null,
        shipBy: null,
        // batchCode: null,
        notes: null,
        ediStatus: null,
        ediTime: null,
        ediMsg: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("outboundAllocationRef")
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

const cancelForm = val => {
    open.value = val
    dialog.value = val
    dialogBack.value = val
    dialogDown.value = val
    getList()
}
const submitFinished = () => {
    dialog.value = val
    dialogBack.value = val
    getList()
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
/** 重置按钮操作 */
function resetQuery() {
    daterangePickTime.value = []
    daterangeShipTime.value = []
    daterangeEdiTime.value = []
    daterangeCreateTime.value = []
    daterangeUpdateTime.value = []
    proxy.resetForm("queryRef")
    handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
    multipleSelection.value = selection
    ids.value = selection.map(item => item.id)
    leCodeList.value = selection.map((item) => item.sourceLeCode)
    docStationList.value = selection.map((item) => item.targetLocCode)
    single.value = selection.length != 1
    multiple.value = !selection.length
}
/** 取消收货按钮操作 */
function handleCancel(row) {
    if (!multipleSelection.value || multipleSelection.value.length === 0) {
        proxy.$modal.msgError("请先选择要取消的数据")
        return false
    }
    // 检查所有选中数据的分配状态
    const hasInvalidStatus = multipleSelection.value.some(item => item.allocationStatus !== "create" || item.allocationType !== "OUT")

    if (hasInvalidStatus) {
        proxy.$modal.msgError("所选数据的分配状态必须为创建状态且分配类型必须为出库类型，请检查")
        return false
    }

    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认取消出库分配明细编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return outboundAllocationCancelOutbound(_ids)
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



/** 删除按钮操作 */
function handleDelete(row) {
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认删除出库分配明细编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delOutboundAllocation(_ids)
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

const handlePicking = () => {
    for (let i = 0; i < multipleSelection.value.length; i++) {
        if (multipleSelection.value[i].allocationStatus != "create" || multipleSelection.value[i].logisticsStatus != "create") {
            proxy.$modal.msgError("所选数据的分配状态和物流状态必须都为创建状态，请检查")
            return false
        }
    }
    let array = []
    for (var i = 0; i < leCodeList.value.length; i++) {
        if (array.indexOf(leCodeList.value[i]) === -1) {
            array.push(leCodeList.value[i])
        }
    }
    // if (array.length > 2) {
    //     proxy.$modal.msgError("最多可选择两个容器，请检查")
    //     return false
    // }
    paramsLecodeList.value = array.join(",")
    dialogDown.value = true
}

// 确认出库
const handleOutbound = () => {
    for (let i = 0; i < multipleSelection.value.length; i++) {
        if (multipleSelection.value[i].allocationStatus != "create" || multipleSelection.value[i].logisticsStatus != "complete") {
            proxy.$modal.msgError("所选数据的分配状态为创建且物流状态必须为完成状态，请检查")
            return false
        }
    }

    let array = []
    for (var i = 0; i < leCodeList.value.length; i++) {
        if (array.indexOf(leCodeList.value[i]) === -1) {
            array.push(leCodeList.value[i])
        }
    }
    if (array.length > 2) {
        proxy.$modal.msgError("最多可选择一个容器，请检查")
        return false
    }
    paramsLecodeList.value = array.join(",")
    console.log(paramsLecodeList.value)
    dialog.value = true
}
// 余料回库
const handleBack = () => {
    for (let i = 0; i < multipleSelection.value.length; i++) {
        if (multipleSelection.value[i].allocationStatus != "create" || multipleSelection.value[i].logisticsStatus != "create") {
            proxy.$modal.msgError("所选数据的分配状态和物流状态必须都为创建状态，请检查")
            return false
        }
    }
    let arrayLecode = []
    let dockStationList = []
    // 多选的数据查看时都是同一库位
    for (var i = 0; i < docStationList.value.length; i++) {
        if (dockStationList.indexOf(docStationList.value[i]) === -1) {
            dockStationList.push(docStationList.value[i])
        }
    }
    if (dockStationList.length > 1) {
        proxy.$modal.msgError("所选数据的接驳台必须是同一个，请检查")
        return false
    }

    // 多选数据必须限制两个以内
    for (var i = 0; i < leCodeList.value.length; i++) {
        if (arrayLecode.indexOf(leCodeList.value[i]) === -1) {
            arrayLecode.push(leCodeList.value[i])
        }
    }
    if (arrayLecode.length > 2) {
        proxy.$modal.msgError("最多可选择两个不同容器，请检查")
        return false
    }

    paramsLecodeList.value = arrayLecode.join(",")
    dialogBack.value = true



}

/** 导出按钮操作 */
function handleExport() {
    proxy.download(
        "outbound/outboundAllocation/export",
        {
            ...queryParams.value
        },
        `出库分配明细_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
