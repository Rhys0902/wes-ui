<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="客户编码" prop="customerCode">
                        <el-input v-model="queryParams.customerCode" placeholder="请输入客户编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="客户名称" prop="customerName">
                        <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="客户英文名称" prop="customerNameEn">
                        <el-input v-model="queryParams.customerNameEn" placeholder="请输入客户英文名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="客户状态" prop="customerStatus">
                        <el-select v-model="queryParams.customerStatus" placeholder="请选择状态" clearable>
                            <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="客户住址" prop="customerAddress">
                            <el-input v-model="queryParams.customerAddress" placeholder="请输入客户住址" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="客户手机" prop="customerPhone">
                            <el-input v-model="queryParams.customerPhone" placeholder="请输入客户手机" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bas:basCustomer:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bas:basCustomer:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bas:basCustomer:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bas:basCustomer:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="basCustomerList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'ascending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="客户编码" align="center" prop="customerCode" width="120" sortable="custom" />
                <el-table-column label="客户名称" align="center" prop="customerName" width="140" sortable="custom" />
                <el-table-column label="客户英文名称" align="center" prop="customerNameEn" width="120" sortable="custom" />
                <el-table-column label="客户状态" align="center" prop="customerStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="sys_yes_no" :value="scope.row.status" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="notes" sortable="custom" />
                <el-table-column label="客户住址" align="center" prop="customerAddress" min-width="140" sortable="custom" />
                <el-table-column label="客户手机" align="center" prop="customerPhone" width="140" sortable="custom" />
                <el-table-column label="创建人" align="center" prop="createBy" sortable="custom" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" sortable="custom" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bas:basCustomer:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bas:basCustomer:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改客户主数据对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="basCustomerRef" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="客户编码" prop="customerCode">
                    <el-input v-model="form.customerCode" placeholder="请输入客户编码" />
                </el-form-item>
                <el-form-item label="客户名称" prop="customerName">
                    <el-input v-model="form.customerName" placeholder="请输入客户名称" />
                </el-form-item>
                <el-form-item label="客户状态" prop="customerStatus">
                    <el-select v-model="form.customerStatus" placeholder="请选择状态">
                        <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户英文名称" prop="customerNameEn">
                    <el-input v-model="form.customerNameEn" placeholder="请输入客户英文名称" />
                </el-form-item>
                <el-form-item label="备注" prop="notes">
                    <el-input v-model="form.notes" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="客户住址" prop="customerAddress">
                    <el-input v-model="form.customerAddress" placeholder="请输入客户住址" />
                </el-form-item>
                <el-form-item label="客户手机" prop="customerPhone">
                    <el-input v-model="form.customerPhone" placeholder="请输入客户手机" />
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

<script setup name="BasCustomer">
import { listBasCustomer, getBasCustomer, delBasCustomer, addBasCustomer, updateBasCustomer } from "@/api/bas/basCustomer"

const { proxy } = getCurrentInstance()
const { sys_yes_no } = proxy.useDict("sys_yes_no")

const showAllSearchTop = ref(false)
const basCustomerList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        customerCode: undefined,
        customerName: undefined,
        customerNameEn: undefined,
        customerStatus: undefined,
        notes: undefined,
        customerAddress: undefined,
        customerPhone: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {
        customerCode: [{ required: true, message: "请输入", trigger: "blur" }],
        customerName: [{ required: true, message: "请输入", trigger: "blur" }],
        customerStatus: [{ required: true, message: "请选择", trigger: "charge,blur" }]
    }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询客户主数据列表 */
function getList() {
    loading.value = true
    queryParams.value.params = {}
    if (null != daterangeCreateTime && "" != daterangeCreateTime) {
        queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
        queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
    }
    if (null != daterangeUpdateTime && "" != daterangeUpdateTime) {
        queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0]
        queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1]
    }
    listBasCustomer(queryParams.value).then(response => {
        basCustomerList.value = response.rows
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
        queryParams.value.isAsc = 'asc'
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
        customerCode: null,
        customerName: null,
        customerNameEn: null,
        customerStatus: 'Y',
        notes: null,
        customerAddress: null,
        customerPhone: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("basCustomerRef")
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
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
    title.value = "添加客户主数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getBasCustomer(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改客户主数据"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["basCustomerRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateBasCustomer(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addBasCustomer(form.value)
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
        .confirm('是否确认删除客户主数据编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delBasCustomer(_ids)
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
        "bas/basCustomer/export",
        {
            ...queryParams.value
        },
        `客户主数据_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
