<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="分配类型" prop="splitCombineType">
                        <el-input v-model="queryParams.splitCombineType" placeholder="请输入分配类型" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="分配状态" prop="splitCombineStatus">
                        <el-input v-model="queryParams.splitCombineStatus" placeholder="请输入分配状态" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="物流状态" prop="logisticsStatus">
                        <el-select v-model="queryParams.logisticsStatus" placeholder="请选择物流状态" clearable>
                            <el-option v-for="dict in logistics_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物料ID" prop="materialId">
                        <el-input v-model="queryParams.materialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="物料编码" prop="materialCode">
                            <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料名称" prop="materialName">
                            <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="质检状态" prop="qcStatus">
                            <el-select v-model="queryParams.qcStatus" placeholder="请选择质检状态" clearable>
                                <el-option v-for="dict in wes_qc_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="订单数量" prop="orderedQty">
                            <el-input v-model="queryParams.orderedQty" placeholder="请输入订单数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="交易数量" prop="transQty">
                            <el-input v-model="queryParams.transQty" placeholder="请输入交易数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源库位ID" prop="sourceLocId">
                            <el-input v-model="queryParams.sourceLocId" placeholder="请输入源库位ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源库位" prop="sourceLocCode">
                            <el-input v-model="queryParams.sourceLocCode" placeholder="请输入源库位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标库位ID" prop="targetLocId">
                            <el-input v-model="queryParams.targetLocId" placeholder="请输入目标库位ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标库位编码" prop="targetLocCode">
                            <el-input v-model="queryParams.targetLocCode" placeholder="请输入目标库位编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源容器ID" prop="sourceLeId">
                            <el-input v-model="queryParams.sourceLeId" placeholder="请输入源容器ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源容器编码" prop="sourceLeCode">
                            <el-input v-model="queryParams.sourceLeCode" placeholder="请输入源容器编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标容器ID" prop="targetLeId">
                            <el-input v-model="queryParams.targetLeId" placeholder="请输入目标容器ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标容器编码" prop="targetLeCode">
                            <el-input v-model="queryParams.targetLeCode" placeholder="请输入目标容器编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源库存ID" prop="sourceStockId">
                            <el-input v-model="queryParams.sourceStockId" placeholder="请输入源库存ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标库存ID" prop="targetStockId">
                            <el-input v-model="queryParams.targetStockId" placeholder="请输入目标库存ID" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['stock:stockSplitCombine:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['stock:stockSplitCombine:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['stock:stockSplitCombine:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['stock:stockSplitCombine:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="stockSplitCombineList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="分配类型" align="center" prop="splitCombineType" />
                <el-table-column label="分配状态" align="center" prop="splitCombineStatus" />
                <el-table-column label="物流状态" align="center" prop="logisticsStatus">
                    <template #default="scope">
                        <dict-tag :options="logistics_status" :value="scope.row.logisticsStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="物料ID" align="center" prop="materialId" />
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" />
                <el-table-column label="单位" align="center" prop="unit" />
                <el-table-column label="质检状态" align="center" prop="qcStatus">
                    <template #default="scope">
                        <dict-tag :options="wes_qc_status" :value="scope.row.qcStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="批次编码" align="center" prop="batchCode" />
                <el-table-column label="订单数量" align="center" prop="orderedQty" />
                <el-table-column label="交易数量" align="center" prop="transQty" />
                <el-table-column label="源库位ID" align="center" prop="sourceLocId" />
                <el-table-column label="源库位" align="center" prop="sourceLocCode" />
                <el-table-column label="目标库位ID" align="center" prop="targetLocId" />
                <el-table-column label="目标库位编码" align="center" prop="targetLocCode" />
                <el-table-column label="源容器ID" align="center" prop="sourceLeId" />
                <el-table-column label="源容器编码" align="center" width="160" prop="sourceLeCode" />
                <el-table-column label="目标容器ID" align="center" prop="targetLeId" />
                <el-table-column label="目标容器编码" align="center" width="160" prop="targetLeCode" />
                <el-table-column label="源库存ID" align="center" prop="sourceStockId" />
                <el-table-column label="目标库存ID" align="center" prop="targetStockId" />
                <el-table-column label="创建人" align="center" prop="createBy" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['stock:stockSplitCombine:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['stock:stockSplitCombine:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改拆合箱对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="stockSplitCombineRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="分配类型" prop="splitCombineType">
                    <el-input v-model="form.splitCombineType" placeholder="请输入分配类型" />
                </el-form-item>
                <el-form-item label="分配状态" prop="splitCombineStatus">
                    <el-input v-model="form.splitCombineStatus" placeholder="请输入分配状态" />
                </el-form-item>
                <el-form-item label="物流状态" prop="logisticsStatus">
                    <el-select v-model="form.logisticsStatus" placeholder="请选择物流状态">
                        <el-option v-for="dict in logistics_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物料ID" prop="materialId">
                    <el-input v-model="form.materialId" placeholder="请输入物料ID" />
                </el-form-item>
                <el-form-item label="物料编码" prop="materialCode">
                    <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
                </el-form-item>
                <el-form-item label="物料名称" prop="materialName">
                    <el-input v-model="form.materialName" placeholder="请输入物料名称" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入单位" />
                </el-form-item>
                <el-form-item label="质检状态" prop="qcStatus">
                    <el-select v-model="form.qcStatus" placeholder="请选择质检状态">
                        <el-option v-for="dict in wes_qc_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="批次编码" prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入批次编码" />
                </el-form-item>
                <el-form-item label="订单数量" prop="orderedQty">
                    <el-input v-model="form.orderedQty" placeholder="请输入订单数量" />
                </el-form-item>
                <el-form-item label="交易数量" prop="transQty">
                    <el-input v-model="form.transQty" placeholder="请输入交易数量" />
                </el-form-item>
                <el-form-item label="源库位ID" prop="sourceLocId">
                    <el-input v-model="form.sourceLocId" placeholder="请输入源库位ID" />
                </el-form-item>
                <el-form-item label="源库位" prop="sourceLocCode">
                    <el-input v-model="form.sourceLocCode" placeholder="请输入源库位" />
                </el-form-item>
                <el-form-item label="目标库位ID" prop="targetLocId">
                    <el-input v-model="form.targetLocId" placeholder="请输入目标库位ID" />
                </el-form-item>
                <el-form-item label="目标库位编码" prop="targetLocCode">
                    <el-input v-model="form.targetLocCode" placeholder="请输入目标库位编码" />
                </el-form-item>
                <el-form-item label="源容器ID" prop="sourceLeId">
                    <el-input v-model="form.sourceLeId" placeholder="请输入源容器ID" />
                </el-form-item>
                <el-form-item label="源容器编码" prop="sourceLeCode">
                    <el-input v-model="form.sourceLeCode" placeholder="请输入源容器编码" />
                </el-form-item>
                <el-form-item label="目标容器ID" prop="targetLeId">
                    <el-input v-model="form.targetLeId" placeholder="请输入目标容器ID" />
                </el-form-item>
                <el-form-item label="目标容器编码" prop="targetLeCode">
                    <el-input v-model="form.targetLeCode" placeholder="请输入目标容器编码" />
                </el-form-item>
                <el-form-item label="源库存ID" prop="sourceStockId">
                    <el-input v-model="form.sourceStockId" placeholder="请输入源库存ID" />
                </el-form-item>
                <el-form-item label="目标库存ID" prop="targetStockId">
                    <el-input v-model="form.targetStockId" placeholder="请输入目标库存ID" />
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

<script setup name="StockSplitCombine">
import {
    listStockSplitCombine,
    getStockSplitCombine,
    delStockSplitCombine,
    addStockSplitCombine,
    updateStockSplitCombine
} from "@/api/stock/stockSplitCombine"

const { proxy } = getCurrentInstance()
const { logistics_status, wes_qc_status } = proxy.useDict("logistics_status", "wes_qc_status")
const showAllSearchTop = ref(false)

const stockSplitCombineList = ref([])
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
        splitCombineType: undefined,
        splitCombineStatus: undefined,
        logisticsStatus: undefined,
        materialId: undefined,
        materialCode: undefined,
        materialName: undefined,
        unit: undefined,
        qcStatus: undefined,
        batchCode: undefined,
        orderedQty: undefined,
        transQty: undefined,
        sourceLocId: undefined,
        sourceLocCode: undefined,
        targetLocId: undefined,
        targetLocCode: undefined,
        sourceLeId: undefined,
        sourceLeCode: undefined,
        targetLeId: undefined,
        targetLeCode: undefined,
        sourceStockId: undefined,
        targetStockId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询拆合箱列表 */
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
    listStockSplitCombine(queryParams.value).then(response => {
        stockSplitCombineList.value = response.rows
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
        splitCombineType: null,
        splitCombineStatus: null,
        logisticsStatus: null,
        materialId: null,
        materialCode: null,
        materialName: null,
        unit: null,
        qcStatus: null,
        batchCode: null,
        orderedQty: null,
        transQty: null,
        sourceLocId: null,
        sourceLocCode: null,
        targetLocId: null,
        targetLocCode: null,
        sourceLeId: null,
        sourceLeCode: null,
        targetLeId: null,
        targetLeCode: null,
        sourceStockId: null,
        targetStockId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
    }
    proxy.resetForm("stockSplitCombineRef")
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
    title.value = "添加拆合箱"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getStockSplitCombine(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改拆合箱"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["stockSplitCombineRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateStockSplitCombine(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addStockSplitCombine(form.value)
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
        .confirm('是否确认删除拆合箱编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delStockSplitCombine(_ids)
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
        "stock/stockSplitCombine/export",
        {
            ...queryParams.value
        },
        `拆合箱_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
