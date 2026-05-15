<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="入库单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入入库单号" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="采购单号" prop="purchaseNumber">
                            <el-input v-model="queryParams.purchaseNumber" placeholder="请输入采购单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="预期时间" style="width: 320px">
                            <el-date-picker v-model="daterangeExpectedTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="释放状态" prop="releaseStatus">
                            <el-input v-model="queryParams.releaseStatus" placeholder="请输入释放状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单据来源" prop="createSource">
                            <el-input v-model="queryParams.createSource" placeholder="请输入单据来源" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="主键ID" prop="detailId">
                            <el-input v-model="queryParams.detailId" placeholder="请输入主键ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="明细行号" prop="lineNum">
                            <el-input v-model="queryParams.lineNum" placeholder="请输入明细行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="行状态" prop="lineStatus">
                            <el-input v-model="queryParams.lineStatus" placeholder="请输入行状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="上位行号" prop="refLineNumber">
                            <el-input v-model="queryParams.refLineNumber" placeholder="请输入上位行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="采购序号" prop="purchaseLineNumber">
                            <el-input v-model="queryParams.purchaseLineNumber" placeholder="请输入采购序号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料ID" prop="materialId">
                            <el-input v-model="queryParams.materialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="已收数量" prop="receivedQty">
                            <el-input v-model="queryParams.receivedQty" placeholder="请输入已收数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="已退数量" prop="returnedQty">
                            <el-input v-model="queryParams.returnedQty" placeholder="请输入已退数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['inbound:inboundHeaderDetail:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['inbound:inboundHeaderDetail:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['inbound:inboundHeaderDetail:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['inbound:inboundHeaderDetail:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="inboundHeaderDetailList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="入库单号" align="center" prop="docNumber" />
                <el-table-column label="单据类型ID" align="center" prop="docTypeId" />
                <el-table-column label="单据类型编码" align="center" prop="docTypeCode" />
                <el-table-column label="单据类型名称" align="center" prop="docTypeName" />
                <el-table-column label="单据状态" align="center" prop="docStatus" />
                <el-table-column label="上位单号" align="center" prop="refDocNumber" />
                <el-table-column label="采购单号" align="center" prop="purchaseNumber" />
                <el-table-column label="预期时间" align="center" prop="expectedTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.expectedTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="释放状态" align="center" prop="releaseStatus" />
                <el-table-column label="单据来源" align="center" prop="createSource" />
                <el-table-column label="备注" align="center" prop="notes" />
                <el-table-column label="主键ID" align="center" prop="detailId" />
                <el-table-column label="明细行号" align="center" prop="lineNum" />
                <el-table-column label="行状态" align="center" prop="lineStatus" />
                <el-table-column label="上位行号" align="center" prop="refLineNumber" />
                <el-table-column label="采购序号" align="center" prop="purchaseLineNumber" />
                <el-table-column label="物料ID" align="center" prop="materialId" />
                <el-table-column label="物料编码" align="center" prop="materialCode" />
                <el-table-column label="物料名称" align="center" prop="materialName" />
                <el-table-column label="订单数量" align="center" prop="orderedQty" />
                <el-table-column label="已收数量" align="center" prop="receivedQty" />
                <el-table-column label="已退数量" align="center" prop="returnedQty" />
                <el-table-column label="单位" align="center" prop="unit" />
                <el-table-column label="批次编码" align="center" prop="batchCode" />
                <el-table-column label="创建人" align="center" prop="createBy" width="150" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" width="150" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['inbound:inboundHeaderDetail:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['inbound:inboundHeaderDetail:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改VIEW对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="inboundHeaderDetailRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="入库单号" prop="docNumber">
                    <el-input v-model="form.docNumber" placeholder="请输入入库单号" />
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
                <el-form-item label="采购单号" prop="purchaseNumber">
                    <el-input v-model="form.purchaseNumber" placeholder="请输入采购单号" />
                </el-form-item>
                <el-form-item label="预期时间" prop="expectedTime">
                    <el-date-picker clearable v-model="form.expectedTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择预期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="释放状态" prop="releaseStatus">
                    <el-input v-model="form.releaseStatus" placeholder="请输入释放状态" />
                </el-form-item>
                <el-form-item label="单据来源" prop="createSource">
                    <el-input v-model="form.createSource" placeholder="请输入单据来源" />
                </el-form-item>
                <el-form-item label="备注" prop="notes">
                    <el-input v-model="form.notes" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="主键ID" prop="detailId">
                    <el-input v-model="form.detailId" placeholder="请输入主键ID" />
                </el-form-item>
                <el-form-item label="明细行号" prop="lineNum">
                    <el-input v-model="form.lineNum" placeholder="请输入明细行号" />
                </el-form-item>
                <el-form-item label="行状态" prop="lineStatus">
                    <el-input v-model="form.lineStatus" placeholder="请输入行状态" />
                </el-form-item>
                <el-form-item label="上位行号" prop="refLineNumber">
                    <el-input v-model="form.refLineNumber" placeholder="请输入上位行号" />
                </el-form-item>
                <el-form-item label="采购序号" prop="purchaseLineNumber">
                    <el-input v-model="form.purchaseLineNumber" placeholder="请输入采购序号" />
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
                <el-form-item label="订单数量" prop="orderedQty">
                    <el-input v-model="form.orderedQty" placeholder="请输入订单数量" />
                </el-form-item>
                <el-form-item label="已收数量" prop="receivedQty">
                    <el-input v-model="form.receivedQty" placeholder="请输入已收数量" />
                </el-form-item>
                <el-form-item label="已退数量" prop="returnedQty">
                    <el-input v-model="form.returnedQty" placeholder="请输入已退数量" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入单位" />
                </el-form-item>
                <el-form-item label="批次编码" prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入批次编码" />
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

<script setup name="InboundHeaderDetail">
import {
    listInboundHeaderDetail,
    getInboundHeaderDetail,
    delInboundHeaderDetail,
    addInboundHeaderDetail,
    updateInboundHeaderDetail
} from "@/api/inbound/inboundHeaderDetail"

const { proxy } = getCurrentInstance()
const showAllSearchTop = ref(false)

const inboundHeaderDetailList = ref([])
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
        purchaseNumber: undefined,
        expectedTime: undefined,
        releaseStatus: undefined,
        createSource: undefined,
        notes: undefined,
        detailId: undefined,
        lineNum: undefined,
        lineStatus: undefined,
        refLineNumber: undefined,
        purchaseLineNumber: undefined,
        materialId: undefined,
        materialCode: undefined,
        materialName: undefined,
        orderedQty: undefined,
        receivedQty: undefined,
        returnedQty: undefined,
        unit: undefined,
        batchCode: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询VIEW列表 */
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
    listInboundHeaderDetail(queryParams.value).then(response => {
        inboundHeaderDetailList.value = response.rows
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
        headerId: null,
        docNumber: null,
        docTypeId: null,
        docTypeCode: null,
        docTypeName: null,
        docStatus: null,
        refDocNumber: null,
        purchaseNumber: null,
        expectedTime: null,
        releaseStatus: null,
        createSource: null,
        notes: null,
        detailId: null,
        lineNum: null,
        lineStatus: null,
        refLineNumber: null,
        purchaseLineNumber: null,
        materialId: null,
        materialCode: null,
        materialName: null,
        orderedQty: null,
        receivedQty: null,
        returnedQty: null,
        unit: null,
        batchCode: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
    }
    proxy.resetForm("inboundHeaderDetailRef")
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
    ids.value = selection.map(item => item.headerId)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加VIEW"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _headerId = row.headerId || ids.value
    getInboundHeaderDetail(_headerId).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改VIEW"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["inboundHeaderDetailRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.headerId != null) {
                updateInboundHeaderDetail(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addInboundHeaderDetail(form.value)
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
    const _headerIds = row.headerId || ids.value
    proxy.$modal
        .confirm('是否确认删除VIEW编号为"' + _headerIds + '"的数据项？')
        .then(function () {
            loading.value = true
            return delInboundHeaderDetail(_headerIds)
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
        "inbound/inboundHeaderDetail/export",
        {
            ...queryParams.value
        },
        `inboundHeaderDetail_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
