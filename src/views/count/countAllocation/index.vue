<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
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
                        <el-form-item label="上位单号" prop="refDocNumber">
                            <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="明细行号" prop="detailLineNum">
                            <el-input v-model="queryParams.detailLineNum" placeholder="请输入明细行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="上位行号" prop="refDetailLineNum">
                            <el-input v-model="queryParams.refDetailLineNum" placeholder="请输入上位行号" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="库存数量" prop="stockQty">
                            <el-input v-model="queryParams.stockQty" placeholder="请输入库存数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="分配数量" prop="countQty">
                            <el-input v-model="queryParams.countQty" placeholder="请输入分配数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="差异数量" prop="diffQty">
                            <el-input v-model="queryParams.diffQty" placeholder="请输入差异数量" clearable @keyup.enter="handleQuery" />
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

                        <el-form-item label="源货架编码" prop="sourceShelfCode">
                            <el-input v-model="queryParams.sourceShelfCode" placeholder="请输入源货架编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="目标货架编码" prop="targetShelfCode">
                            <el-input v-model="queryParams.targetShelfCode" placeholder="请输入目标货架编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源区域编码" prop="sourceAreaCode">
                            <el-input v-model="queryParams.sourceAreaCode" placeholder="请输入源区域编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标区域编码" prop="targetAreaCode">
                            <el-input v-model="queryParams.targetAreaCode" placeholder="请输入目标区域编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="源容器编码" prop="sourceLeCode">
                            <el-input v-model="queryParams.sourceLeCode" placeholder="请输入源容器编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="目标容器编码" prop="targetLeCode">
                            <el-input v-model="queryParams.targetLeCode" placeholder="请输入目标容器编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

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
        <el-card shadow="never">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="SemiSelect" :disabled="multiple" @click="handleCancel" v-hasPermi="['outbound:outboundAllocation:remove']">取消分配</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleDown" v-hasPermi="['count:countAllocation:add']">盘点下架</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleSure" v-hasPermi="['count:countAllocation:confirm']">盘点确认</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleBack" v-hasPermi="['count:countAllocation:back']">盘点回库</el-button>

                </el-col>
                <!--   <el-col :span="1.5">
                      <el-button type="primary" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['count:countAllocation:remove']">取消分配</el-button>
                </el-col> -->
                <!-- <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['count:countAllocation:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['count:countAllocation:remove']">删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['count:countAllocation:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="countAllocationList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="分配类型" align="center" prop="allocationType">
                    <template #default="scope">
                        <dict-tag :options="wes_logistics_type" :value="scope.row.allocationType" />
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
                <el-table-column label="订单号" width="150" align="center" prop="docNumber" sortable="custom" />
                <el-table-column label="上位单号" width="120" align="center" prop="refDocNumber" sortable="custom" />
                <el-table-column label="明细行号" width="180" align="center" prop="detailLineNum" sortable="custom" />
                <el-table-column label="上位行号" width="120" align="center" prop="refDetailLineNum" sortable="custom" />
                <el-table-column label="单据类型编码" width="150" align="center" prop="docTypeCode" sortable="custom" />
                <el-table-column label="单据类型名称" width="160" align="center" prop="docTypeName" sortable="custom" />
                <el-table-column label="物料编码" width="180" align="center" prop="materialCode" sortable="custom" />
                <el-table-column label="物料名称" width="150" align="center" prop="materialName" sortable="custom" />
                <el-table-column label="库存数量" width="150" align="center" prop="stockQty" sortable="custom" />
                <el-table-column label="分配数量" width="150" align="center" prop="countQty" sortable="custom" />
                <el-table-column label="差异数量" width="150" align="center" prop="diffQty" sortable="custom" />
                <el-table-column label="单位" align="center" prop="unit" sortable="custom" />
                <el-table-column label="质检状态" align="center" prop="qcStatus">
                    <template #default="scope">
                        <dict-tag :options="wes_qc_status" :value="scope.row.qcStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="源库位" width="150" align="center" prop="sourceLocCode" sortable="custom" />
                <el-table-column label="目标库位" width="150" align="center" prop="targetLocCode" sortable="custom" />
                <el-table-column label="源货架编码" width="150" align="center" prop="sourceShelfCode" sortable="custom" />
                <el-table-column label="目标货架编码" width="150" align="center" prop="targetShelfCode" sortable="custom" />
                <el-table-column label="源区域编码" width="150" align="center" prop="sourceAreaCode" sortable="custom" />
                <el-table-column label="目标区域编码" width="180" align="center" prop="targetAreaCode" sortable="custom" />
                <el-table-column label="源容器编码" width="150" align="center" prop="sourceLeCode" sortable="custom" />
                <el-table-column label="目标容器编码" width="180" align="center" prop="targetLeCode" sortable="custom" />
                <!-- <el-table-column label="批次编码" width="150" align="center" prop="batchCode" sortable="custom" /> -->
                <el-table-column label="备注" align="center" prop="notes" sortable="custom" />
                <!-- <el-table-column label="过账状态" width="150" align="center" prop="ediStatus" sortable="custom" />
                <el-table-column label="过账时间" align="center" prop="ediTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.ediTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过账信息" width="150" align="center" prop="ediMsg" sortable="custom" /> -->
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
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['count:countAllocation:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['count:countAllocation:remove']">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 分配确认 -->
        <div v-if="open">
            <CountSure :dialog="open" :allocationList="multipleSelection" @cancelDialog="cancelForm()" />
        </div>
        <!-- 盘点下架 -->
        <div v-if="dialogDown">
            <CountPickingDown :dialog="dialogDown" :paramsLecodeList="paramsLecodeList" @cancelDialog="cancelForm()" />
        </div>
        <!-- 盘点回库 -->
        <div v-if="dialogBack">
            <CountMaterialBack :dialog="dialogBack" :paramsLecodeList="paramsLecodeList" @cancelDialog="cancelForm()" />
        </div>
    </div>
</template>

<script setup name="CountAllocation">
import { listCountAllocation, getCountAllocation, delCountAllocation, addCountAllocation, updateCountAllocation, countCancelAllocation } from "@/api/count/countAllocation"
import CountSure from "./countSureDialog/countSure.vue"
import CountPickingDown from "./downDialog/countPickingDown.vue"
import CountMaterialBack from "./returnBackDialog/materialBack.vue"

const { proxy } = getCurrentInstance()
const { wes_logistics_type, wes_common_status, wes_qc_status } = proxy.useDict("wes_logistics_type", "wes_common_status", "wes_qc_status")

const countAllocationList = ref([])
const docStationList = ref([])
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
const countSureDialog = ref(false)
const multipleSelection = ref([])

// 下架
const dialogDown = ref(false)
const paramsLecodeList = ref('')
const leCodeList = ref('')
// 盘点回库
const dialogBack = ref(false)

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

const data = reactive({
    form: {},
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
        stockQty: undefined,
        countQty: undefined,
        diffQty: undefined,
        unit: undefined,
        qcStatus: undefined,
        sourceLocId: undefined,
        sourceLocCode: undefined,
        targetLocCode: undefined,
        sourceShelfCode: undefined,
        targetShelfCode: undefined,
        sourceAreaCode: undefined,
        targetAreaCode: undefined,
        sourceLeCode: undefined,
        targetLeCode: undefined,
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
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

const cancelForm = val => {
    open.value = val
    dialogDown.value = val
    dialogBack.value = val
    getList()
}

/** 查询盘点分配明细列表 */
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
    listCountAllocation(queryParams.value).then(response => {
        countAllocationList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}

// 取消按钮
function cancel() {
    open.value = false
    reset()
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
        detailId: null,
        detailLineNum: null,
        refDetailLineNum: null,
        docTypeCode: null,
        docTypeName: null,
        materialId: null,
        materialCode: null,
        materialName: null,
        stockQty: null,
        countQty: null,
        diffQty: null,
        unit: null,
        qcStatus: null,
        sourceLocCode: null,
        targetLocCode: null,
        sourceShelfCode: null,
        targetShelfCode: null,
        sourceAreaCode: null,
        targetAreaCode: null,
        sourceLeCode: null,
        targetLeCode: null,
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
    proxy.resetForm("countAllocationRef")
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
    multipleSelection.value = selection
    ids.value = selection.map(item => item.id)
    leCodeList.value = selection.map((item) => item.sourceLeCode)
    docStationList.value = selection.map((item) => item.targetLocCode)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/** 盘点确认操作 */
function handleSure() {
    for (let i = 0; i < multipleSelection.value.length; i++) {
        if (multipleSelection.value[i].allocationStatus != "create" || multipleSelection.value[i].logisticsStatus != "complete") {
            proxy.$modal.msgError("所选数据的分配状态为创建且物流状态必须为完成状态，请检查")
            return false
        }
    }
    reset()
    open.value = true
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getCountAllocation(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改盘点分配明细"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["countAllocationRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateCountAllocation(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addCountAllocation(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("新增成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            }
        }
    })
}
/** 取消盘点按钮操作 */
function handleCancel(row) {
    if (!multipleSelection.value || multipleSelection.value.length === 0) {
        proxy.$modal.msgError("请先选择要取消的数据")
        return false
    }
    // 检查所有选中数据的分配状态
    const hasInvalidStatus = multipleSelection.value.some(item => item.allocationStatus !== "create" || item.allocationType !== "CNT")
    console.log(hasInvalidStatus, 'hasInvalidStatushasInvalidStatus')
    if (hasInvalidStatus) {
        proxy.$modal.msgError("所选数据的分配状态必须为创建状态且分配类型必须为盘点类型，请检查")
        return false
    }
    const _ids = row?.id || ids.value
    if (!_ids) {
        proxy.$modal.msgError("未找到要取消的数据ID")
        return false
    }
    proxy.$modal
        .confirm('是否确认取消盘点分配明细编号为' + _ids + '的数据项？')
        .then(() => {
            loading.value = true
            return countCancelAllocation(_ids)
        })
        .then(() => {
            proxy.$modal.msgSuccess("取消成功")
            getList()
        })
        .catch(() => {
            // 用户取消操作，不需要提示
        })
        .finally(() => {
            loading.value = false
        })
}
function handleDown() {
    for (let i = 0; i < multipleSelection.value.length; i++) {
        if (multipleSelection.value[i].allocationStatus != 'create' || multipleSelection.value[i].logisticsStatus != 'create') {
            proxy.$modal.msgError('所选数据的分配状态和物流状态必须都为创建状态，请检查')
            return false
        }
    }
    let array = []
    for (var i = 0; i < leCodeList.value.length; i++) {
        if (array.indexOf(leCodeList.value[i]) === -1) {
            array.push(leCodeList.value[i])
        }
    }
    console.log(array)
    paramsLecodeList.value = array.join(',')
    dialogDown.value = true
}
// 盘点回库
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
/** 删除按钮操作 */
function handleDelete(row) {
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认删除盘点分配明细编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delCountAllocation(_ids)
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

/** 导出按钮操作 */
function handleExport() {
    proxy.download(
        "count/countAllocation/export",
        {
            ...queryParams.value
        },
        `盘点分配明细_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
