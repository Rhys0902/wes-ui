<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
                    <el-form-item label="交易类型" prop="transType">
                        <el-select v-model="queryParams.transType" placeholder="请选择交易类型" clearable @keyup.enter="handleQuery">
                            <el-option v-for="dict in wes_trans_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="单据编号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入单据编号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <!-- <el-form-item label="上位单号" prop="refDocNumber">
                        <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item> -->
                    <el-form-item label="单据类型名称" prop="docTypeName">
                        <el-input v-model="queryParams.docTypeName" placeholder="请输入单据类型名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="明细行号" prop="detailLineNum">
                        <el-input v-model="queryParams.detailLineNum" placeholder="请输入明细行号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <!-- <el-form-item label="上位行号" prop="refDetailLineNum">
                            <el-input v-model="queryParams.refDetailLineNum" placeholder="请输入上位行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="物料编码" prop="materialCode">
                            <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料名称" prop="materialName">
                            <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="供应商编码" prop="supplierCode">
                            <el-input v-model="queryParams.supplierCode" placeholder="请输入供应商编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="供应商名称" prop="supplierName">
                            <el-input v-model="queryParams.supplierName" placeholder="请输入供应商名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <!-- <el-form-item label="批次属性1" prop="lotAttr01">
                            <el-input v-model="queryParams.lotAttr01" placeholder="请输入批次属性1" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次属性2" prop="lotAttr02">
                            <el-input v-model="queryParams.lotAttr02" placeholder="请输入批次属性2" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次属性3" prop="lotAttr03">
                            <el-input v-model="queryParams.lotAttr03" placeholder="请输入批次属性3" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次属性4" prop="lotAttr04">
                            <el-input v-model="queryParams.lotAttr04" placeholder="请输入批次属性4" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="订单数量" prop="orderedQty">
                            <el-input v-model="queryParams.orderedQty" placeholder="请输入订单数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="交易数量" prop="transQty">
                            <el-input v-model="queryParams.transQty" placeholder="请输入交易数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="库存ID" prop="stockId">
                            <el-input v-model="queryParams.stockId" placeholder="请输入库存ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="托盘编码" prop="leCode">
                            <el-input v-model="queryParams.leCode" placeholder="请输入托盘编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源库位编码" prop="sourceLocCode">
                            <el-input v-model="queryParams.sourceLocCode" placeholder="请输入源库位编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标库位编码" prop="targetLocCode">
                            <el-input v-model="queryParams.targetLocCode" placeholder="请输入目标库位编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="过账状态" prop="ediStatus">
                            <el-input v-model="queryParams.ediStatus" placeholder="请输入过账状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="过账时间" style="width: 308px">
                            <el-date-picker v-model="daterangeEdiTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="过账信息" prop="ediMsg">
                            <el-input v-model="queryParams.ediMsg" placeholder="请输入过账信息" clearable @keyup.enter="handleQuery" />
                        </el-form-item>-->

                        <el-form-item label="创建人" prop="createBy">
                            <el-input v-model="queryParams.createBy" placeholder="请输入创建人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="创建时间" style="width: 308px">
                            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="更新人" prop="updateBy">
                            <el-input v-model="queryParams.updateBy" placeholder="请输入更新人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="更新时间" style="width: 308px">
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
                <!-- <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['report:reportInOutTrans:add']">新增</el-button>
                </el-col>
              <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['report:reportInOutTrans:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['report:reportInOutTrans:remove']">删除</el-button>
                </el-col>-->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['report:reportInOutTrans:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="reportInOutTransList" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="交易类型" width="150" align="center" prop="transType">
                    <template #default="scope">
                        <dict-tag :options="wes_trans_type" :value="scope.row.transType" />
                    </template>
                </el-table-column>
                <el-table-column label="单据编号" width="150" align="center" prop="docNumber" />
                <!-- <el-table-column label="上位单号" width="150" align="center" prop="refDocNumber" /> -->
                <el-table-column label="单据类型名称" width="150" align="center" prop="docTypeName" />
                <el-table-column label="明细行号" width="150" align="center" prop="detailLineNum" />
                <!-- <el-table-column label="上位行号" width="150" align="center" prop="refDetailLineNum" /> -->
                <el-table-column label="物料编码" width="180" align="center" prop="materialCode" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" show-overflow-tooltip />
                <!-- <el-table-column label="供应商编码" align="center" prop="supplierCode" />
                <el-table-column label="供应商名称" align="center" prop="supplierName" /> -->
                <el-table-column label="单位" width="150" align="center" prop="unit" />
                <!-- <el-table-column label="批次编码" width="150" align="center" prop="batchCode" /> -->
                <!-- <el-table-column label="批次属性1" align="center" prop="lotAttr01" />
                <el-table-column label="批次属性2" align="center" prop="lotAttr02" />
                <el-table-column label="批次属性3" align="center" prop="lotAttr03" />
                <el-table-column label="批次属性4" align="center" prop="lotAttr04" /> -->
                <el-table-column label="订单数量" width="150" align="center" prop="orderedQty" />
                <el-table-column label="交易数量" width="150" align="center" prop="transQty" />
                <el-table-column label="库存ID" width="180" align="center" prop="stockId" sortable="custom" show-overflow-tooltip />
                <el-table-column label="托盘编码" width="150" align="center" prop="leCode" />
                <el-table-column label="源库位编码" width="150" align="center" prop="sourceLocCode" />
                <el-table-column label="目标库位编码" width="150" align="center" prop="targetLocCode" />
                <!-- <el-table-column label="过账状态" align="center" prop="ediStatus" />
                <el-table-column label="过账时间" align="center" prop="ediTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.ediTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过账信息" align="center" prop="ediMsg" /> -->
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" width="150" align="center" prop="createBy" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" width="150" align="center" prop="updateBy" />
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['report:reportInOutTrans:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['report:reportInOutTrans:remove']">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改VIEW对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="reportInOutTransRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label prop="transType">
                    <el-select v-model="form.transType" placeholder="请选择交易类型">
                        <el-option v-for="dict in wes_trans_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label prop="docNumber">
                    <el-input v-model="form.docNumber" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="refDocNumber">
                    <el-input v-model="form.refDocNumber" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="docTypeName">
                    <el-input v-model="form.docTypeName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="detailLineNum">
                    <el-input v-model="form.detailLineNum" placeholder="请输入" />
                </el-form-item>
                <!-- <el-form-item label prop="refDetailLineNum">
                    <el-input v-model="form.refDetailLineNum" placeholder="请输入" />
                </el-form-item> -->
                <el-form-item label prop="materialCode">
                    <el-input v-model="form.materialCode" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="materialName">
                    <el-input v-model="form.materialName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="supplierCode">
                    <el-input v-model="form.supplierCode" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="supplierName">
                    <el-input v-model="form.supplierName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入" />
                </el-form-item>
                <!-- <el-form-item label prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入" />
                </el-form-item> -->
                <el-form-item label prop="lotAttr01">
                    <el-input v-model="form.lotAttr01" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="lotAttr02">
                    <el-input v-model="form.lotAttr02" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="lotAttr03">
                    <el-input v-model="form.lotAttr03" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="lotAttr04">
                    <el-input v-model="form.lotAttr04" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="orderedQty">
                    <el-input v-model="form.orderedQty" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="transQty">
                    <el-input v-model="form.transQty" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="stockId">
                    <el-input v-model="form.stockId" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="leCode">
                    <el-input v-model="form.leCode" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="sourceLocCode">
                    <el-input v-model="form.sourceLocCode" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="targetLocCode">
                    <el-input v-model="form.targetLocCode" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="ediStatus">
                    <el-input v-model="form.ediStatus" placeholder="请输入" />
                </el-form-item>
                <el-form-item label prop="ediTime">
                    <el-date-picker clearable v-model="form.ediTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择"></el-date-picker>
                </el-form-item>
                <el-form-item label prop="ediMsg">
                    <el-input v-model="form.ediMsg" placeholder="请输入" />
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

<script setup name="ReportInOutTrans">
import { listReportInOutTrans, getReportInOutTrans, delReportInOutTrans, addReportInOutTrans, updateReportInOutTrans } from "@/api/report/reportInOutTrans"

const { proxy } = getCurrentInstance()
const { wes_trans_type } = proxy.useDict("wes_trans_type")
const showAllSearchTop = ref(false)

const reportInOutTransList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeEdiTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        transType: undefined,
        docNumber: undefined,
        refDocNumber: undefined,
        docTypeName: undefined,
        detailLineNum: undefined,
        refDetailLineNum: undefined,
        materialCode: undefined,
        materialName: undefined,
        supplierCode: undefined,
        supplierName: undefined,
        unit: undefined,
        // batchCode: undefined,
        lotAttr01: undefined,
        lotAttr02: undefined,
        lotAttr03: undefined,
        lotAttr04: undefined,
        orderedQty: undefined,
        transQty: undefined,
        stockId: undefined,
        leCode: undefined,
        sourceLocCode: undefined,
        targetLocCode: undefined,
        ediStatus: undefined,
        ediTime: undefined,
        ediMsg: undefined,
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
    listReportInOutTrans(queryParams.value).then(response => {
        reportInOutTransList.value = response.rows
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
        transType: null,
        docNumber: null,
        refDocNumber: null,
        docTypeName: null,
        detailLineNum: null,
        refDetailLineNum: null,
        materialCode: null,
        materialName: null,
        supplierCode: null,
        supplierName: null,
        unit: null,
        // batchCode: null,
        lotAttr01: null,
        lotAttr02: null,
        lotAttr03: null,
        lotAttr04: null,
        orderedQty: null,
        transQty: null,
        stockId: null,
        leCode: null,
        sourceLocCode: null,
        targetLocCode: null,
        ediStatus: null,
        ediTime: null,
        ediMsg: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
    }
    proxy.resetForm("reportInOutTransRef")
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
    ids.value = selection.map(item => item.transType)
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
    const _transType = row.transType || ids.value
    getReportInOutTrans(_transType).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改VIEW"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["reportInOutTransRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.transType != null) {
                updateReportInOutTrans(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addReportInOutTrans(form.value)
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
    const _transTypes = row.transType || ids.value
    proxy.$modal
        .confirm('是否确认删除VIEW编号为"' + _transTypes + '"的数据项？')
        .then(function () {
            loading.value = true
            return delReportInOutTrans(_transTypes)
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
        "report/reportInOutTrans/export",
        {
            ...queryParams.value
        },
        `出入库明细报表_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
