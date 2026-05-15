<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="110px">
                    <el-form-item label="入库单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入入库单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单据类型编码" prop="docTypeCode">
                        <el-input v-model="queryParams.docTypeCode" placeholder="请输入单据类型编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单据类型名称" prop="docTypeName">
                        <el-input v-model="queryParams.docTypeName" placeholder="请输入单据类型名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单据状态" prop="docStatus">
                        <el-select v-model="queryParams.docStatus" placeholder="请选择单据状态" clearable>
                            <el-option v-for="dict in wes_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="收货状态" prop="putawayStatus">
                            <el-select v-model="queryParams.putawayStatus" placeholder="请选择收货状态" clearable>
                                <el-option v-for="dict in wes_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上架状态" prop="receiveStatus">
                            <el-select v-model="queryParams.receiveStatus" placeholder="请选择上架状态" clearable>
                                <el-option v-for="dict in wes_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预期时间" style="width: 320px">
                            <el-date-picker v-model="daterangeExpectedTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="释放状态" prop="releaseStatus">
                            <el-select v-model="queryParams.releaseStatus" placeholder="请选择释放状态" clearable>
                                <el-option v-for="dict in wes_release_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="单据来源" prop="createSource">
                            <el-input v-model="queryParams.createSource" placeholder="请输入单据来源" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="收货方式" prop="way">
                            <el-input v-model="queryParams.way" placeholder="请输入单据来源" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['inbound:inboundHeader:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['inbound:inboundHeader:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['inbound:inboundHeader:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" :disabled="multiple" @click="handleSureInbound" v-hasPermi="['inbound:inboundHeader:putawaySure']">收货确认</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Service" @click="callBox" v-hasPermi="['inbound:inboundAllocation:callBox']">叫箱</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Box" @click="handleEmptyLe" v-hasPermi="['inbound:inboundAllocation:emptyTrayInbound']">空托盘入库</el-button>
                </el-col>

                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['inbound:inboundHeader:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="inboundHeaderList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="expand">
                    <template #default="props">
                        <InboudExpandDetail :headerId="props.row.id" />
                    </template>
                </el-table-column>
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" sortable="custom" />
                <el-table-column label="入库单号" align="center" prop="docNumber" width="180px" sortable="custom" />
                <el-table-column label="单据类型编码" align="center" prop="docTypeCode" width="180px" sortable="custom" />
                <el-table-column label="单据类型名称" align="center" prop="docTypeName" width="150px" sortable="custom" />
                <el-table-column label="单据状态" align="center" width="150" prop="docStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.docStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="收货状态" align="center" width="150" prop="putawayStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.putawayStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="上架状态" align="center" width="150" prop="receiveStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.receiveStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="预期时间" align="center" prop="expectedTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.expectedTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="释放状态" align="center" width="150" prop="releaseStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_release_status" :value="scope.row.releaseStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="单据来源" align="center" width="150" prop="createSource" sortable="custom" />
                <el-table-column label="收货方式" align="center" prop="way" width="180px" sortable="custom">
                    <template #default="scope">
                        <div v-if="scope.row.way==1">AGV搬运</div>
                        <div v-if="scope.row.way==2">人工搬运</div>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="notes" width="150" sortable="custom" :show-overflow-tooltip="true" />
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
        <div v-if="open">
            <editAdd :open="open" @cancelDialog="cancelForm" :selectRowData="mutipletionList" :isEditDialog="isEditDialog" />
        </div>
        <div v-if="openSureInbound">
            <el-dialog title="收货确认" v-model="openSureInbound" width="90%" append-to-body>
                <inboundSure :headerIdList="ids" :selectedWay="selectedWay" :docTypeCode="selectedDocTypeCode" @submitFinished="submitFinished" @cancelDialog="cancelForm" />
            </el-dialog>
        </div>
        <div v-if="openBoxDialog">
            <CallBox :openBoxDialog="openBoxDialog" @cancelDialog="cancelForm" />
        </div>
        <!-- 空托盘入库弹窗组件 -->
        <EmptyLePutWay v-model="openEmptyTrayDialog" @success="getList" />
    </div>
</template>

<script setup name="InboundHeader">
import InboudExpandDetail from "./inboudExpandDetail/index.vue"
import editAdd from "./editAddDialog/editAdd.vue"
import inboundSure from "./inboundSure/inboundSure"
import CallBox from "../inboundHeader/inboundCallBox/CallBox"
import EmptyLePutWay from "./emptyLePutWay/emptyLePutWay.vue"
import { listInboundHeader, getInboundHeader, delInboundHeader, addInboundHeader, updateInboundHeader } from "@/api/inbound/inboundHeader"
const { proxy } = getCurrentInstance()

const { wes_common_status, wes_release_status } = proxy.useDict("wes_common_status", "wes_release_status")

const showAllSearchTop = ref(false)

const inboundHeaderList = ref([])

const open = ref(false)
const openBoxDialog = ref(false)
const openEmptyTrayDialog = ref(false)

/**
 * 取消表单操作
 * @param {Boolean} val - 是否显示弹框
 */
const cancelForm = val => {
    open.value = val
    isEditDialog.value = val
    openSureInbound.value = val
    openBoxDialog.value = val
    getList()
}

function callBox() {
    openBoxDialog.value = true
}

// function cancelChildDialog() {
//     openBoxDialog.value = false
//     getList()
// }

/**
 * 提交完成回调
 */
const submitFinished = () => {
    openSureInbound.value = false
    getList()
}

// 打开空托盘入库对话框
function handleEmptyLe() {
    openEmptyTrayDialog.value = true
}

const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const openSureInbound = ref(false)
const daterangeExpectedTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])
const mutipletionList = ref([])
const isEditDialog = ref(false)
const selectedWay = ref(null) // 新增：存储选中数据的收货方式
const selectedDocTypeCode = ref(null) // 新增：存储选中数据的单据类型编码

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        docNumber: undefined,
        docTypeId: undefined,
        docTypeCode: undefined,
        docTypeName: undefined,
        docStatus: undefined,
        expectedTime: undefined,
        releaseStatus: undefined,
        createSource: undefined,
        notes: undefined,
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

/**
 * 查询入库单头列表
 */
function getList() {
    loading.value = true
    queryParams.value.params = {}
    if (null != daterangeExpectedTime && "" != daterangeExpectedTime) {
        queryParams.value.params["beginExpectedTime"] = daterangeExpectedTime.value[0]
        queryParams.value.params["endExpectedTime"] = daterangeExpectedTime.value[1]
    }
    if (null != daterangeCreateTime && "" != daterangeCreateTime) {
        queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
        queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
    }
    if (null != daterangeUpdateTime && "" != daterangeUpdateTime) {
        queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0]
        queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1]
    }
    listInboundHeader(queryParams.value).then(response => {
        inboundHeaderList.value = response.rows
        total.value = response.total
        loading.value = false
    })
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
    form.value = {
        id: null,
        version: null,
        docNumber: null,
        docTypeId: null,
        docTypeCode: null,
        docTypeName: null,
        docStatus: null,
        createSource: null,
        notes: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("inboundHeaderRef")
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
    daterangeExpectedTime.value = []
    daterangeCreateTime.value = []
    daterangeUpdateTime.value = []
    proxy.resetForm("queryRef")
    handleQuery()
}

/**
 * 多选框选中数据
 * @param {Array} selection - 选中的数据
 */
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id)
    single.value = selection.length != 1
    multiple.value = !selection.length
    mutipletionList.value = selection
    console.log(mutipletionList.value)
    // .filter(row => row.children?.length > 0)
}

/**
 * 新增按钮操作
 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加入库单头"
}

/**
 * 修改按钮操作
 * @param {Object} row - 行数据
 */
function handleUpdate() {
    const targetRow = mutipletionList.value[0]
    console.log(targetRow, 'targetRowtargetRow')
    if (targetRow && targetRow.docStatus !== 'create') {
        proxy.$modal.msgWarning("该订单状态不是“创建“状态，无法修改")
        return
    }
    loading.value = true
    open.value = true
    isEditDialog.value = true
    title.value = "修改入库单头"

    reset()
    // const _id = ids.value
    // getInboundHeader(_id).then(response => {
    // loading.value = false
    // form.value = response.data
    // // 将way字段转为字符串类型
    // if (form.value.way !== undefined && form.value.way !== null) {
    //     form.value.way = form.value.way.toString()
    // }
    // console.log(form.value)
    // })
}

/**
 * 收货确认按钮操作
 */
function handleSureInbound() {
    // 检查是否有选中数据
    if (mutipletionList.value.length === 0) {
        proxy.$modal.msgError("请选择需要收货确认的数据")
        return
    }

    // 获取所有选中数据的way值
    const wayValues = mutipletionList.value.map(item => item.way)

    // 检查way值是否统一
    const uniqueWayValues = [...new Set(wayValues)]
    if (uniqueWayValues.length > 1) {
        proxy.$modal.msgError("所选数据必须同一收货方式，请检查")
        return
    }

    // 获取所有选中数据的单据类型编码
    const docTypeCodeValues = mutipletionList.value.map(item => item.docTypeCode)

    // 检查单据类型编码是否统一
    const uniqueDocTypeCodeValues = [...new Set(docTypeCodeValues)]
    if (uniqueDocTypeCodeValues.length > 1) {
        proxy.$modal.msgError("所选数据必须同一单据类型编码，请检查")
        return
    }

    // 设置选中的收货方式
    selectedWay.value = uniqueWayValues[0]

    // 设置选中的单据类型编码
    selectedDocTypeCode.value = uniqueDocTypeCodeValues[0]

    // 打开收货确认弹框
    openSureInbound.value = true
}

/**
 * 提交按钮
 */
function submitForm() {
    proxy.$refs["inboundHeaderRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateInboundHeader(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addInboundHeader(form.value)
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
 * 删除按钮操作
 * @param {Object} row - 行数据
 */
function handleDelete(row) {
    const selectedRows = row.id ? [row] : mutipletionList.value

    // 检查选中数据的状态
    const invalidRows = selectedRows.filter(item => item.docStatus !== 'create')
    if (invalidRows.length > 0) {
        const invalidDocNumbers = invalidRows.map(item => item.docNumber).join(', ')
        proxy.$modal.msgWarning(`单据编号 ${invalidDocNumbers} 的状态不是"创建"，无法删除！`)
        return
    }

    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认删除入库单头编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delInboundHeader(_ids)
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
        "inbound/inboundHeader/export",
        {
            ...queryParams.value
        },
        `入库单头_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
