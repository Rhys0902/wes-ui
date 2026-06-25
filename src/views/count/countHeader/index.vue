<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
                    <el-form-item label="盘点单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入盘点单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单据类型编码" prop="docTypeCode">
                        <el-input v-model="queryParams.docTypeCode" placeholder="请输入单据类型编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单据类型名称" prop="docTypeName">
                        <el-input v-model="queryParams.docTypeName" placeholder="请输入单据类型名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="单据状态" prop="docStatus">
                            <el-input v-model="queryParams.docStatus" placeholder="请输入单据状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="上位单号" prop="refDocNumber">
                            <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="预期时间" style="width: 320px">
                            <el-date-picker v-model="daterangeExpectedTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="释放状态" prop="releaseStatus">
                            <el-input v-model="queryParams.releaseStatus" placeholder="请输入释放状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="优先级" prop="priority">
                            <el-input v-model="queryParams.priority" placeholder="请输入优先级" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="方式" prop="way">
                            <el-input v-model="queryParams.way" placeholder="请输入方式" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单据来源" prop="createSource">
                            <el-input v-model="queryParams.createSource" placeholder="请输入单据来源" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['count:countHeader:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['count:countHeader:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" :disabled="multiple" @click="handleAllocation()" v-hasPermi="['count:countHeader:allocation']">盘点分配</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['count:countHeader:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['count:countHeader:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="countHeaderList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="expand">
                    <template #default="props">
                        <ExpandDetail :headerId="props.row.id" />
                    </template>
                </el-table-column>
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="盘点单号" align="center" width="150" prop="docNumber" sortable="custom" />
                <el-table-column label="单据类型编码" width="150" align="center" prop="docTypeCode" sortable="custom" />
                <el-table-column label="单据类型名称" width="150" align="center" prop="docTypeName" sortable="custom" />
                <el-table-column label="单据状态" width="150" align="center" prop="docStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.docStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="预期时间" align="center" prop="expectedTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.expectedTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="盘点方式" width="150" align="center" prop="way" sortable="custom" />
                <el-table-column label="单据来源" width="150" align="center" prop="createSource" sortable="custom" />
                <el-table-column label="备注" align="center" prop="notes" sortable="custom" />
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
        <!-- 添加或修改盘点单头对话框 -->
        <div v-if="open">
            <editAdd :open="open" :isEditDialog="isEditDialog" :selectRowData="selectRowData" @cancelDialog="cancelForm" />
        </div>
    </div>
</template>
<script setup name="CountHeader">
import { listCountHeader, getCountHeader, delCountHeader, addCountHeader, updateCountHeader, countAllocation } from "@/api/count/countHeader"
import ExpandDetail from "./ExpandDetail/index.vue"
import editAdd from "./editAddDialog/editAdd.vue"

const { proxy } = getCurrentInstance()

const { wes_common_status } = proxy.useDict("wes_common_status")

const showAllSearchTop = ref(false)

const countHeaderList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const docNumbers = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const daterangeExpectedTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])
const isEditDialog = ref(false)
const mutipletionList = ref([])
const selectRowData = ref({})

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
        refDocNumber: undefined,
        expectedTime: undefined,
        releaseStatus: undefined,
        priority: undefined,
        way: undefined,
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

const cancelForm = val => {
    open.value = val
    isEditDialog.value = val
    getList()
}
const submitFinished = () => {
    openSureInbound.value = val
    getList()
}

/** 查询盘点单头列表 */
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
    listCountHeader(queryParams.value).then(response => {
        countHeaderList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}

// 取消按钮
function cancel() {
    open.value = false
    reset()
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

// 表单重置
function reset() {
    form.value = {
        id: null,
        version: null,
        docNumber: null,
        docTypeId: null,
        docTypeCode: null,
        docTypeName: null,
        docStatus: null,
        refDocNumber: null,
        expectedTime: null,
        releaseStatus: null,
        priority: null,
        way: null,
        createSource: null,
        notes: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("countHeaderRef")
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
    daterangeExpectedTime.value = []
    daterangeCreateTime.value = []
    daterangeUpdateTime.value = []
    proxy.resetForm("queryRef")
    handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id)
    docNumbers.value = selection.map(item => item.docNumber)
    single.value = selection.length != 1
    multiple.value = !selection.length
    mutipletionList.value = selection.filter(row => row.children?.length > 0)
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
}

/** 修改按钮操作 */
function handleUpdate(row) {
    selectRowData.value = row ? row : mutipletionList.value[0]
    loading.value = true
    reset()
    open.value = true
    isEditDialog.value = true
}
// 盘点分配
function handleAllocation() {
    proxy.$modal
        .confirm('是否确认分配盘点单号为"' + docNumbers.value + '"的数据项？')
        .then(() => {
            loading.value = true
            return countAllocation(ids.value)
        })
        .then(() => {
            loading.value = false
            getList()
            proxy.$modal.msgSuccess("分配成功")
        })
        .catch(() => { })
        .finally(() => {
            loading.value = false
        })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["countHeaderRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateCountHeader(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addCountHeader(form.value)
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

/** 删除按钮操作 */
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
        .confirm('是否确认删除盘点单头编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delCountHeader(_ids)
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
        "count/countHeader/export",
        {
            ...queryParams.value
        },
        `盘点单头_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
