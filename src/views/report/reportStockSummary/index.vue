<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="物料编码" prop="materialCode">
                        <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="物料名称" prop="materialName">
                        <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <!-- <el-form-item label="批次编码" prop="batchCode">
                        <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item> -->
                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="数量" prop="qty">
                        <el-input v-model="queryParams.qty" placeholder="请输入" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="分配数量" prop="allocationQty">
                            <el-input v-model="queryParams.allocationQty" placeholder="请输入" clearable @keyup.enter="handleQuery" />
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
                <!-- <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['report:reportStockSummary:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['report:reportStockSummary:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['report:reportStockSummary:remove']">删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['report:reportStockSummary:export']">导出</el-button>
                </el-col>

                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="reportStockSummaryList" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="物料编码" align="center" prop="materialCode" show-overflow-tooltip />
                <el-table-column label="物料名称" align="center" prop="materialName" show-overflow-tooltip />
                <!-- <el-table-column label="批次编码" align="center" prop="batchCode" /> -->
                <el-table-column label="单位" align="center" prop="unit" />
                <el-table-column label="数量" align="center" prop="qty" />
                <el-table-column label="分配数量" align="center" prop="allocationQty" />
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['report:reportStockSummary:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['report:reportStockSummary:remove']">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改VIEW对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="reportStockSummaryRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="物料编码" prop="materialCode">
                    <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
                </el-form-item>
                <el-form-item label="物料名称" prop="materialName">
                    <el-input v-model="form.materialName" placeholder="请输入物料名称" />
                </el-form-item>
                <!-- <el-form-item label="批次编码" prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入批次编码" />
                </el-form-item> -->
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入单位" />
                </el-form-item>
                <el-form-item label="数量" prop="qty">
                    <el-input v-model="form.qty" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="分配数量" prop="allocationQty">
                    <el-input v-model="form.allocationQty" placeholder="请输入" />
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

<script setup name="ReportStockSummary">
import { useRouter } from 'vue-router'
import {
    listReportStockSummary,
    getReportStockSummary,
    delReportStockSummary,
    addReportStockSummary,
    updateReportStockSummary
} from "@/api/report/reportStockSummary"

const { proxy } = getCurrentInstance()
const router = useRouter()
const showAllSearchTop = ref(false)

const reportStockSummaryList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        materialCode: undefined,
        materialName: undefined,
        // batchCode: undefined,
        unit: undefined,
        qty: undefined,
        allocationQty: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询VIEW列表 */
function getList() {
    loading.value = true
    listReportStockSummary(queryParams.value).then(response => {
        reportStockSummaryList.value = response.rows
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
        materialCode: null,
        materialName: null,
        // batchCode: null,
        unit: null,
        qty: null,
        allocationQty: null
    }
    proxy.resetForm("reportStockSummaryRef")
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
    proxy.resetForm("queryRef")
    handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.materialCode)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加库存"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _materialCode = row.materialCode || ids.value
    getReportStockSummary(_materialCode).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改VIEW"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["reportStockSummaryRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.materialCode != null) {
                updateReportStockSummary(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addReportStockSummary(form.value)
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
    const _materialCodes = row.materialCode || ids.value
    proxy.$modal
        .confirm('是否确认删除库存汇总编号为"' + _materialCodes + '"的数据项？')
        .then(function () {
            loading.value = true
            return delReportStockSummary(_materialCodes)
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
        "report/reportStockSummary/export",
        {
            ...queryParams.value
        },
        `库存汇总报表_${new Date().getTime()}.xlsx`
    )
}



getList()
</script>
