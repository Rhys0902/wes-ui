<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="订单头ID" prop="headerId">
                        <el-input v-model="queryParams.headerId" placeholder="请输入订单头ID" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="订单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="明细行号" prop="lineNum">
                        <el-input v-model="queryParams.lineNum" placeholder="请输入明细行号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="行状态" prop="lineStatus">
                        <el-input v-model="queryParams.lineStatus" placeholder="请输入行状态" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
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
                        <el-form-item label="批次属性ID" prop="batchId">
                            <el-input v-model="queryParams.batchId" placeholder="请输入批次属性ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次属性1" prop="lotAttr01">
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
                        </el-form-item>
                        <el-form-item label="批次属性5" prop="lotAttr05">
                            <el-input v-model="queryParams.lotAttr05" placeholder="请输入批次属性5" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="质量等级" prop="qualityLevel">
                            <el-input v-model="queryParams.qualityLevel" placeholder="请输入质量等级" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="机件号" prop="partCode">
                            <el-input v-model="queryParams.partCode" placeholder="请输入机件号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="出厂日期" style="width: 308px">
                            <el-date-picker v-model="daterangeReleaseDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="专业" prop="specialty">
                            <el-input v-model="queryParams.specialty" placeholder="请输入专业" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标库位" prop="toLocCode">
                            <el-input v-model="queryParams.toLocCode" placeholder="请输入目标库位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="uuid" prop="uuid">
                            <el-input v-model="queryParams.uuid" placeholder="请输入uuid" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['inbound:inboundDetail:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['inbound:inboundDetail:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['inbound:inboundDetail:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['inbound:inboundDetail:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="inboundDetailList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="订单头ID" align="center" prop="headerId" />
                <el-table-column label="订单号" align="center" prop="docNumber" />
                <el-table-column label="明细行号" align="center" prop="lineNum" />
                <el-table-column label="行状态" align="center" prop="lineStatus" />
                <el-table-column label="上位行号" align="center" prop="refLineNumber" />
                <el-table-column label="采购序号" align="center" prop="purchaseLineNumber" />
                <el-table-column label="物料ID" align="center" prop="materialId" />
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" />
                <el-table-column label="订单数量" align="center" prop="orderedQty" />
                <el-table-column label="已收数量" align="center" prop="receivedQty" />
                <el-table-column label="已退数量" align="center" prop="returnedQty" />
                <el-table-column label="单位" align="center" prop="unit" />
                <el-table-column label="批次属性ID" align="center" prop="batchId" />
                <el-table-column label="批次编码" align="center" prop="batchCode" />
                <el-table-column label="批次属性1" align="center" prop="lotAttr01" />
                <el-table-column label="批次属性2" align="center" prop="lotAttr02" />
                <el-table-column label="批次属性3" align="center" prop="lotAttr03" />
                <el-table-column label="批次属性4" align="center" prop="lotAttr04" />
                <el-table-column label="批次属性5" align="center" prop="lotAttr05" />
                <el-table-column label="质量等级" align="center" prop="qualityLevel" />
                <el-table-column label="机件号" align="center" prop="partCode" />
                <el-table-column label="出厂日期" align="center" prop="releaseDate" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.releaseDate) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="专业" align="center" prop="specialty" />
                <el-table-column label="目标库位" align="center" prop="toLocCode" />
                <el-table-column label="uuid" align="center" prop="uuid" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy" width="150" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" width="150" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['inbound:inboundDetail:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['inbound:inboundDetail:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改入库明细对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="inboundDetailRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="订单头ID" prop="headerId">
                    <el-input v-model="form.headerId" placeholder="请输入订单头ID" />
                </el-form-item>
                <el-form-item label="订单号" prop="docNumber">
                    <el-input v-model="form.docNumber" placeholder="请输入订单号" />
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
                <el-form-item label="批次属性ID" prop="batchId">
                    <el-input v-model="form.batchId" placeholder="请输入批次属性ID" />
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
                <el-form-item label="质量等级" prop="qualityLevel">
                    <el-input v-model="form.qualityLevel" placeholder="请输入质量等级" />
                </el-form-item>
                <el-form-item label="机件号" prop="partCode">
                    <el-input v-model="form.partCode" placeholder="请输入机件号" />
                </el-form-item>
                <el-form-item label="出厂日期" prop="releaseDate">
                    <el-date-picker clearable v-model="form.releaseDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择出厂日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="专业" prop="specialty">
                    <el-input v-model="form.specialty" placeholder="请输入专业" />
                </el-form-item>
                <el-form-item label="目标库位" prop="toLocCode">
                    <el-input v-model="form.toLocCode" placeholder="请输入目标库位" />
                </el-form-item>
                <el-form-item label="uuid" prop="uuid">
                    <el-input v-model="form.uuid" placeholder="请输入uuid" />
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

<script setup name="InboundDetail">
import { listInboundDetail, getInboundDetail, delInboundDetail, addInboundDetail, updateInboundDetail } from "@/api/inbound/inboundDetail"
import { reactive } from "vue"

const { proxy } = getCurrentInstance()
const showAllSearchTop = ref(false)

const inboundDetailList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeReleaseDate = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])

const count = ref(0)

const state = reactive({
    count
})

state.count = 2

const newCount = ref(10)

state.count = newCount

console.log(count.value)

console.log(state.count)

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        headerId: undefined,
        docNumber: undefined,
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
        batchId: undefined,
        batchCode: undefined,
        lotAttr01: undefined,
        lotAttr02: undefined,
        lotAttr03: undefined,
        lotAttr04: undefined,
        lotAttr05: undefined,
        qualityLevel: undefined,
        partCode: undefined,
        releaseDate: undefined,
        specialty: undefined,
        toLocCode: undefined,
        uuid: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询入库明细列表 */
function getList() {
    loading.value = true
    queryParams.value.params = {}
    if (null != daterangeReleaseDate && "" != daterangeReleaseDate) {
        queryParams.value.params["beginReleaseDate"] = daterangeReleaseDate.value[0]
        queryParams.value.params["endReleaseDate"] = daterangeReleaseDate.value[1]
    }
    if (null != daterangeCreateTime && "" != daterangeCreateTime) {
        queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
        queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
    }
    if (null != daterangeUpdateTime && "" != daterangeUpdateTime) {
        queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0]
        queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1]
    }
    listInboundDetail(queryParams.value).then(response => {
        inboundDetailList.value = response.rows
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
        headerId: null,
        docNumber: null,
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
        batchId: null,
        batchCode: null,
        lotAttr01: null,
        lotAttr02: null,
        lotAttr03: null,
        lotAttr04: null,
        lotAttr05: null,
        qualityLevel: null,
        partCode: null,
        releaseDate: null,
        specialty: null,
        toLocCode: null,
        uuid: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("inboundDetailRef")
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
    daterangeReleaseDate.value = []
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
    title.value = "添加入库明细"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getInboundDetail(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改入库明细"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["inboundDetailRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateInboundDetail(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addInboundDetail(form.value)
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
        .confirm('是否确认删除入库明细编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delInboundDetail(_ids)
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
        "inbound/inboundDetail/export",
        {
            ...queryParams.value
        },
        `入库明细_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
