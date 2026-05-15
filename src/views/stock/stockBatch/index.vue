<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="物料编码" prop="materialId">
                        <el-input v-model="queryParams.materialId" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="物料名称" prop="materialCode">
                        <el-input v-model="queryParams.materialCode" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="批次编码" prop="batchCode">
                        <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="批次属性1" prop="lotAttr01">
                        <el-input v-model="queryParams.lotAttr01" placeholder="请输入批次属性1" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['stock:stockBatch:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['stock:stockBatch:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['stock:stockBatch:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['stock:stockBatch:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="stockBatchList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="物料编码" align="center" width="180" prop="materialId" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialCode" />
                <el-table-column label="批次编码" align="center" prop="batchCode" />
                <el-table-column label="批次属性1" align="center" prop="lotAttr01" />
                <el-table-column label="批次属性2" align="center" prop="lotAttr02" />
                <el-table-column label="批次属性3" align="center" prop="lotAttr03" />
                <el-table-column label="批次属性4" align="center" prop="lotAttr04" />
                <el-table-column label="批次属性5" align="center" prop="lotAttr05" />
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
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['stock:stockBatch:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['stock:stockBatch:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改批次属性对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="stockBatchRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="物料编码" prop="materialId">
                    <el-input v-model="form.materialId" placeholder="请输入物料编码" />
                </el-form-item>
                <el-form-item label="物料名称" prop="materialCode">
                    <el-input v-model="form.materialCode" placeholder="请输入物料名称" />
                </el-form-item>
                <el-form-item label="批次编码" prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入批次编码" />
                </el-form-item>
                <el-form-item label="批次属性1" prop="lotAttr01">
                    <el-input v-model="form.lotAttr01" placeholder="请输入批次属性1" />
                </el-form-item>
                <el-form-item label="批次属性2" prop="lotAttr02">
                    <el-input v-model="form.lotAttr02" placeholder="请输入批次属性2" />
                </el-form-item>
                <el-form-item label="批次属性3" prop="lotAttr03">
                    <el-input v-model="form.lotAttr03" placeholder="请输入批次属性3" />
                </el-form-item>
                <el-form-item label="批次属性4" prop="lotAttr04">
                    <el-input v-model="form.lotAttr04" placeholder="请输入批次属性4" />
                </el-form-item>
                <el-form-item label="批次属性5" prop="lotAttr05">
                    <el-input v-model="form.lotAttr05" placeholder="请输入批次属性5" />
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

<script setup name="StockBatch">
import { listStockBatch, getStockBatch, delStockBatch, addStockBatch, updateStockBatch } from "@/api/stock/stockBatch"

const { proxy } = getCurrentInstance()
const showAllSearchTop = ref(false)

const stockBatchList = ref([])
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
        materialId: undefined,
        materialCode: undefined,
        batchCode: undefined,
        lotAttr01: undefined,
        lotAttr02: undefined,
        lotAttr03: undefined,
        lotAttr04: undefined,
        lotAttr05: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询批次属性列表 */
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
    listStockBatch(queryParams.value).then(response => {
        stockBatchList.value = response.rows
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
        materialId: null,
        materialCode: null,
        batchCode: null,
        lotAttr01: null,
        lotAttr02: null,
        lotAttr03: null,
        lotAttr04: null,
        lotAttr05: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("stockBatchRef")
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
    title.value = "添加批次属性"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getStockBatch(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改批次属性"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["stockBatchRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateStockBatch(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addStockBatch(form.value)
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
        .confirm('是否确认删除批次属性编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delStockBatch(_ids)
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
        "stock/stockBatch/export",
        {
            ...queryParams.value
        },
        `批次属性_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
