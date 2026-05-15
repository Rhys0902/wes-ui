<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="补货单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入补货单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单据类型ID" prop="docTypeId">
                        <el-input v-model="queryParams.docTypeId" placeholder="请输入单据类型ID" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="上位单号" prop="refDocNumber">
                            <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="预期时间" style="width: 320px">
                            <el-date-picker v-model="daterangeExpectedTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="释放状态" prop="releaseStatus">
                            <el-input v-model="queryParams.releaseStatus" placeholder="请输入释放状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="优先级" prop="priority">
                            <el-input v-model="queryParams.priority" placeholder="请输入优先级" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="下架道口" prop="dockNumber">
                            <el-input v-model="queryParams.dockNumber" placeholder="请输入下架道口" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单据来源" prop="createSource">
                            <el-input v-model="queryParams.createSource" placeholder="请输入单据来源" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['repl:replHeader:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['repl:replHeader:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['repl:replHeader:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['repl:replHeader:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="replHeaderList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="补货单号" align="center" prop="docNumber" />
                <el-table-column label="单据类型ID" align="center" prop="docTypeId" />
                <el-table-column label="单据类型编码" align="center" prop="docTypeCode" />
                <el-table-column label="单据类型名称" align="center" prop="docTypeName" />
                <el-table-column label="单据状态" align="center" prop="docStatus" />
                <el-table-column label="上位单号" align="center" prop="refDocNumber" />
                <el-table-column label="预期时间" align="center" prop="expectedTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.expectedTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="释放状态" align="center" prop="releaseStatus" />
                <el-table-column label="优先级" align="center" prop="priority" />
                <el-table-column label="下架道口" align="center" prop="dockNumber" />
                <el-table-column label="单据来源" align="center" prop="createSource" />
                <el-table-column label="备注" align="center" prop="notes" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['repl:replHeader:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['repl:replHeader:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改补货单头对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="replHeaderRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="补货单号" prop="docNumber">
                    <el-input v-model="form.docNumber" placeholder="请输入补货单号" />
                </el-form-item>
                <el-form-item label="单据类型ID" prop="docTypeId">
                    <el-input v-model="form.docTypeId" placeholder="请输入单据类型ID" />
                </el-form-item>
                <el-form-item label="单据类型编码" prop="docTypeCode">
                    <el-input v-model="form.docTypeCode" placeholder="请输入单据类型编码" />
                </el-form-item>
                <el-form-item label="单据类型名称" prop="docTypeName">
                    <el-input v-model="form.docTypeName" placeholder="请输入单据类型名称" />
                </el-form-item>
                <el-form-item label="单据状态" prop="docStatus">
                    <el-input v-model="form.docStatus" placeholder="请输入单据状态" />
                </el-form-item>
                <el-form-item label="上位单号" prop="refDocNumber">
                    <el-input v-model="form.refDocNumber" placeholder="请输入上位单号" />
                </el-form-item>
                <el-form-item label="预期时间" prop="expectedTime">
                    <el-date-picker clearable v-model="form.expectedTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择预期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="释放状态" prop="releaseStatus">
                    <el-input v-model="form.releaseStatus" placeholder="请输入释放状态" />
                </el-form-item>
                <el-form-item label="优先级" prop="priority">
                    <el-input v-model="form.priority" placeholder="请输入优先级" />
                </el-form-item>
                <el-form-item label="下架道口" prop="dockNumber">
                    <el-input v-model="form.dockNumber" placeholder="请输入下架道口" />
                </el-form-item>
                <el-form-item label="单据来源" prop="createSource">
                    <el-input v-model="form.createSource" placeholder="请输入单据来源" />
                </el-form-item>
                <el-form-item label="备注" prop="notes">
                    <el-input v-model="form.notes" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="ReplHeader">
import { listReplHeader, getReplHeader, delReplHeader, addReplHeader, updateReplHeader } from "@/api/repl/replHeader"

const { proxy } = getCurrentInstance()
const showAllSearchTop = ref(false)

const replHeaderList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeExpectedTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])

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
        dockNumber: undefined,
        createSource: undefined,
        notes: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询补货单头列表 */
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
    listReplHeader(queryParams.value).then(response => {
        replHeaderList.value = response.rows
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
        docNumber: null,
        docTypeId: null,
        docTypeCode: null,
        docTypeName: null,
        docStatus: null,
        refDocNumber: null,
        expectedTime: null,
        releaseStatus: null,
        priority: null,
        dockNumber: null,
        createSource: null,
        notes: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("replHeaderRef")
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
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加补货单头"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getReplHeader(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改补货单头"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["replHeaderRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateReplHeader(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addReplHeader(form.value)
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
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认删除补货单头编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delReplHeader(_ids)
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
        "repl/replHeader/export",
        {
            ...queryParams.value
        },
        `补货单头_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
