<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="订单ID" prop="docId">
                        <el-input v-model="queryParams.docId" placeholder="请输入订单ID" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="订单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="上位单号" prop="refDocNumber">
                        <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <!-- <el-form-item label="单据类型ID" prop="docTypeId">
                        <el-input v-model="queryParams.docTypeId" placeholder="请输入单据类型ID" clearable @keyup.enter="handleQuery" />
                    </el-form-item> -->
                    <span v-show="showAllSearchTop">
                        <el-form-item label="单据类型编码" prop="docTypeCode">
                            <el-input v-model="queryParams.docTypeCode" placeholder="请输入单据类型编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单据类型名称" prop="docTypeName">
                            <el-input v-model="queryParams.docTypeName" placeholder="请输入单据类型名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="明细行号" prop="detailLineNum">
                            <el-input v-model="queryParams.detailLineNum" placeholder="请输入明细行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="上位行号" prop="refDetailLineNum">
                            <el-input v-model="queryParams.refDetailLineNum" placeholder="请输入上位行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="交易类型" prop="transType">
                            <el-input v-model="queryParams.transType" placeholder="请输入交易类型" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="交易状态" prop="transStatus">
                            <el-input v-model="queryParams.transStatus" placeholder="请输入交易状态" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="订单数量" prop="stockQty">
                            <el-input v-model="queryParams.stockQty" placeholder="请输入订单数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="交易数量" prop="transQty">
                            <el-input v-model="queryParams.transQty" placeholder="请输入交易数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="差异数量" prop="diffQty">
                            <el-input v-model="queryParams.diffQty" placeholder="请输入差异数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="源区域ID" prop="sourceAreaId">
                            <el-input v-model="queryParams.sourceAreaId" placeholder="请输入源区域ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源区域编码" prop="sourceAreaCode">
                            <el-input v-model="queryParams.sourceAreaCode" placeholder="请输入源区域编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标区域ID" prop="targetAreaId">
                            <el-input v-model="queryParams.targetAreaId" placeholder="请输入目标区域ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标区域编码" prop="targetAreaCode">
                            <el-input v-model="queryParams.targetAreaCode" placeholder="请输入目标区域编码" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="库存ID" prop="stockId">
                            <el-input v-model="queryParams.stockId" placeholder="请输入库存ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="质检状态" prop="qcStatus">
                            <el-select v-model="queryParams.qcStatus" placeholder="请选择质检状态">
                                <el-option v-for="item in wes_qs_status" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="批次属性ID" prop="batchId">
                            <el-input v-model="queryParams.batchId" placeholder="请输入批次属性ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
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
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="过账状态" prop="ediStatus">
                            <el-input v-model="queryParams.ediStatus" placeholder="请输入过账状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="过账时间" style="width: 320px">
                            <el-date-picker v-model="daterangeEdiTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="过账信息" prop="ediMsg">
                            <el-input v-model="queryParams.ediMsg" placeholder="请输入过账信息" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
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
                <!-- <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['count:countTrans:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['count:countTrans:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['count:countTrans:remove']">删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['count:countTrans:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="countTransList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="订单号" width="150" align="center" prop="docNumber" sortable="custom" />
                <el-table-column label="上位单号" width="150" align="center" prop="refDocNumber" sortable="custom" />
                <!-- <el-table-column label="单据类型ID" align="center" prop="docTypeId"  sortable="custom"  /> -->
                <el-table-column label="单据类型编码" width="150" align="center" prop="docTypeCode" sortable="custom" />
                <el-table-column label="单据类型名称" width="150" align="center" prop="docTypeName" sortable="custom" />
                <el-table-column label="明细行号" width="150" align="center" prop="detailLineNum" sortable="custom" />
                <el-table-column label="上位行号" width="150" align="center" prop="refDetailLineNum" sortable="custom" />
                <el-table-column label="交易类型" width="150" align="center" prop="transType" sortable="custom" />
                <el-table-column label="交易状态" width="150" align="center" prop="transStatus" sortable="custom" />
                <el-table-column label="物料编码" width="180" align="center" prop="materialCode" sortable="custom" />
                <el-table-column label="物料名称" width="150" align="center" prop="materialName" sortable="custom" />
                <el-table-column label="订单数量" width="150" align="center" prop="stockQty" sortable="custom" />
                <el-table-column label="交易数量" width="150" align="center" prop="transQty" sortable="custom" />
                <el-table-column label="差异数量" width="150" align="center" prop="diffQty" sortable="custom" />
                <el-table-column label="单位" align="center" prop="unit" sortable="custom" />
                <el-table-column label="源库位" width="150" align="center" prop="sourceLocCode" sortable="custom" />
                <el-table-column label="目标库位编码" width="150" align="center" prop="targetLocCode" sortable="custom" />
                <el-table-column label="源区域编码" width="150" align="center" prop="sourceAreaCode" sortable="custom" />
                <el-table-column label="目标区域编码" width="150" align="center" prop="targetAreaCode" sortable="custom" />
                <el-table-column label="源容器编码" width="150" align="center" prop="sourceLeCode" sortable="custom" />
                <el-table-column label="目标容器编码" width="150" align="center" prop="targetLeCode" sortable="custom" />
                <el-table-column label="质检状态" width="150" align="center" prop="qcStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_qs_status" :value="scope.row.qcStatus" />
                    </template>
                </el-table-column>
                <!-- <el-table-column label="批次编码" width="150" align="center" prop="batchCode" sortable="custom" /> -->
                <el-table-column label="备注" width="150" align="center" prop="notes" sortable="custom" />
                <!-- <el-table-column label="过账状态" width="150" align="center" prop="ediStatus" sortable="custom" />
                <el-table-column label="过账时间" align="center" prop="ediTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.ediTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过账信息" width="150" align="center" prop="ediMsg" sortable="custom" /> -->
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" width="150" align="center" prop="createBy" sortable="custom" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" width="150" align="center" prop="updateBy" sortable="custom" />
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['count:countTrans:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['count:countTrans:remove']">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改盘点交易对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="countTransRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="订单ID" prop="docId">
                    <el-input v-model="form.docId" placeholder="请输入订单ID" />
                </el-form-item>
                <el-form-item label="订单号" prop="docNumber">
                    <el-input v-model="form.docNumber" placeholder="请输入订单号" />
                </el-form-item>
                <el-form-item label="上位单号" prop="refDocNumber">
                    <el-input v-model="form.refDocNumber" placeholder="请输入上位单号" />
                </el-form-item>
                <!-- <el-form-item label="单据类型ID" prop="docTypeId">
                    <el-input v-model="form.docTypeId" placeholder="请输入单据类型ID" />
                </el-form-item> -->
                <el-form-item label="单据类型编码" prop="docTypeCode">
                    <el-input v-model="form.docTypeCode" placeholder="请输入单据类型编码" />
                </el-form-item>
                <el-form-item label="单据类型名称" prop="docTypeName">
                    <el-input v-model="form.docTypeName" placeholder="请输入单据类型名称" />
                </el-form-item>
                <el-form-item label="明细行号" prop="detailLineNum">
                    <el-input v-model="form.detailLineNum" placeholder="请输入明细行号" />
                </el-form-item>
                <el-form-item label="上位行号" prop="refDetailLineNum">
                    <el-input v-model="form.refDetailLineNum" placeholder="请输入上位行号" />
                </el-form-item>
                <el-form-item label="交易类型" prop="transType">
                    <el-input v-model="form.transType" placeholder="请输入交易类型" />
                </el-form-item>
                <el-form-item label="交易状态" prop="transStatus">
                    <el-input v-model="form.transStatus" placeholder="请输入交易状态" />
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
                <el-form-item label="订单数量" prop="stockQty">
                    <el-input v-model="form.stockQty" placeholder="请输入订单数量" />
                </el-form-item>
                <el-form-item label="交易数量" prop="transQty">
                    <el-input v-model="form.transQty" placeholder="请输入交易数量" />
                </el-form-item>
                <el-form-item label="差异数量" prop="diffQty">
                    <el-input v-model="form.diffQty" placeholder="请输入差异数量" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入单位" />
                </el-form-item>

                <el-form-item label="源库位" prop="sourceLocCode">
                    <el-input v-model="form.sourceLocCode" placeholder="请输入源库位" />
                </el-form-item>

                <el-form-item label="目标库位编码" prop="targetLocCode">
                    <el-input v-model="form.targetLocCode" placeholder="请输入目标库位编码" />
                </el-form-item>

                <el-form-item label="源区域编码" prop="sourceAreaCode">
                    <el-input v-model="form.sourceAreaCode" placeholder="请输入源区域编码" />
                </el-form-item>
                <el-form-item label="目标区域编码" prop="targetAreaCode">
                    <el-input v-model="form.targetAreaCode" placeholder="请输入目标区域编码" />
                </el-form-item>

                <el-form-item label="源容器编码" prop="sourceLeCode">
                    <el-input v-model="form.sourceLeCode" placeholder="请输入源容器编码" />
                </el-form-item>
                <el-form-item label="目标容器编码" prop="targetLeCode">
                    <el-input v-model="form.targetLeCode" placeholder="请输入目标容器编码" />
                </el-form-item>
                <el-form-item label="质检状态" prop="qcStatus">
                    <el-select v-model="form.qcStatus" placeholder="请选择质检状态">
                        <el-option v-for="item in wes_qs_status" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="批次编码" prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入批次编码" />
                </el-form-item> -->
                <el-form-item label="备注" prop="notes">
                    <el-input v-model="form.notes" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="过账状态" prop="ediStatus">
                    <el-input v-model="form.ediStatus" placeholder="请输入过账状态" />
                </el-form-item>
                <el-form-item label="过账时间" prop="ediTime">
                    <el-date-picker clearable v-model="form.ediTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择过账时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="过账信息" prop="ediMsg">
                    <el-input v-model="form.ediMsg" placeholder="请输入过账信息" />
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

<script setup name="CountTrans">
import { listCountTrans, getCountTrans, delCountTrans, addCountTrans, updateCountTrans } from "@/api/count/countTrans"

const { proxy } = getCurrentInstance()
const { wes_qc_status } = proxy.useDict("wes_qc_status")


const showAllSearchTop = ref(false)

const countTransList = ref([])
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
        docId: undefined,
        docNumber: undefined,
        refDocNumber: undefined,
        docTypeId: undefined,
        docTypeCode: undefined,
        docTypeName: undefined,
        detailLineNum: undefined,
        refDetailLineNum: undefined,
        transType: undefined,
        transStatus: undefined,
        materialId: undefined,
        materialCode: undefined,
        materialName: undefined,
        stockQty: undefined,
        transQty: undefined,
        diffQty: undefined,
        unit: undefined,
        sourceLocId: undefined,
        sourceLocCode: undefined,
        targetLocId: undefined,
        targetLocCode: undefined,
        sourceAreaId: undefined,
        sourceAreaCode: undefined,
        targetAreaId: undefined,
        targetAreaCode: undefined,
        sourceLeId: undefined,
        sourceLeCode: undefined,
        targetLeId: undefined,
        targetLeCode: undefined,
        stockId: undefined,
        qcStatus: undefined,
        batchId: undefined,
        // batchCode: undefined,
        lotAttr01: undefined,
        lotAttr02: undefined,
        lotAttr03: undefined,
        lotAttr04: undefined,
        lotAttr05: undefined,
        notes: undefined,
        ediStatus: undefined,
        ediTime: undefined,
        ediMsg: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询盘点交易列表 */
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
    listCountTrans(queryParams.value).then(response => {
        countTransList.value = response.rows
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
        docId: null,
        docNumber: null,
        refDocNumber: null,
        docTypeId: null,
        docTypeCode: null,
        docTypeName: null,
        detailLineNum: null,
        refDetailLineNum: null,
        transType: null,
        transStatus: null,
        materialId: null,
        materialCode: null,
        materialName: null,
        stockQty: null,
        transQty: null,
        diffQty: null,
        unit: null,
        sourceLocId: null,
        sourceLocCode: null,
        targetLocId: null,
        targetLocCode: null,
        sourceAreaId: null,
        sourceAreaCode: null,
        targetAreaId: null,
        targetAreaCode: null,
        sourceLeId: null,
        sourceLeCode: null,
        targetLeId: null,
        targetLeCode: null,
        stockId: null,
        qcStatus: null,
        batchId: null,
        // batchCode: null,
        lotAttr01: null,
        lotAttr02: null,
        lotAttr03: null,
        lotAttr04: null,
        lotAttr05: null,
        notes: null,
        ediStatus: null,
        ediTime: null,
        ediMsg: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        // 添加排序参数
        orderByColumn: 'id',
        isAsc: 'desc'
    }
    proxy.resetForm("countTransRef")
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
    title.value = "添加盘点交易"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getCountTrans(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改盘点交易"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["countTransRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateCountTrans(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addCountTrans(form.value)
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
        .confirm('是否确认删除盘点交易编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delCountTrans(_ids)
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
        "count/countTrans/export",
        {
            ...queryParams.value
        },
        `盘点交易_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
