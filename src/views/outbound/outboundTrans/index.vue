<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="110px">
                    <!-- <el-form-item label="订单ID" prop="docId">
                        <el-input v-model="queryParams.docId" placeholder="请输入订单ID" clearable @keyup.enter="handleQuery" />
                    </el-form-item> -->
                    <el-form-item label="订单号" prop="docNumber">
                        <el-input v-model="queryParams.docNumber" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单据类型编码" prop="docTypeCode">
                        <el-input v-model="queryParams.docTypeCode" placeholder="请输入单据类型编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单据类型名称" prop="docTypeName">
                        <el-input v-model="queryParams.docTypeName" placeholder="请输入单据类型名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="明细行号" prop="detailLineNum">
                        <el-input v-model="queryParams.detailLineNum" placeholder="请输入明细行号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <!--  <el-form-item label="上位单号" prop="refDocNumber">
                        <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                  <el-form-item label="单据类型ID" prop="docTypeId">
                        <el-input v-model="queryParams.docTypeId" placeholder="请输入单据类型ID" clearable @keyup.enter="handleQuery" />
                    </el-form-item> -->
                    <span v-show="showAllSearchTop">
                        <!-- <el-form-item label="上位行号" prop="refDetailLineNum">
                            <el-input v-model="queryParams.refDetailLineNum" placeholder="请输入上位行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="交易类型" prop="transType">
                            <el-select v-model="queryParams.transType" placeholder="请选择交易类型">
                                <el-option v-for="dict in wes_trans_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="交易状态" prop="transStatus">
                            <el-select v-model="queryParams.transStatus" placeholder="请选择交易状态">
                                <el-option v-for="dict in wes_common_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                            </el-select> </el-form-item>
                        <!-- <el-form-item label="物料ID" prop="materialId">
                            <el-input v-model="queryParams.materialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="物料编码" prop="materialCode">
                            <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料名称" prop="materialName">
                            <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="订单数量" prop="orderedQty">
                            <el-input v-model="queryParams.orderedQty" placeholder="请输入订单数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="交易数量" prop="transQty">
                            <el-input v-model="queryParams.transQty" placeholder="请输入交易数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="源库位ID" prop="sourceLocId">
                            <el-input v-model="queryParams.sourceLocId" placeholder="请输入源库位ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="源库位" prop="sourceLocCode">
                            <el-input v-model="queryParams.sourceLocCode" placeholder="请输入源库位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="目标库位ID" prop="targetLocId">
                            <el-input v-model="queryParams.targetLocId" placeholder="请输入目标库位ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="目标库位编码" prop="targetLocCode">
                            <el-input v-model="queryParams.targetLocCode" placeholder="请输入目标库位编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="运输ID" prop="leId">
                            <el-input v-model="queryParams.leId" placeholder="请输入运输ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="运输编码" prop="leCode">
                            <el-input v-model="queryParams.leCode" placeholder="请输入运输编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="源库存ID" prop="sourceStockId">
                            <el-input v-model="queryParams.sourceStockId" placeholder="请输入源库存ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="库存ID" prop="stockId">
                            <el-input v-model="queryParams.stockId" placeholder="请输入库存ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="质检状态" prop="qcStatus">
                            <el-select v-model="queryParams.qcStatus" placeholder="请选择质检状态" clearable>
                                <el-option v-for="dict in wes_qc_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="批次属性ID" prop="batchId">
                            <el-input v-model="queryParams.batchId" placeholder="请输入批次属性ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
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
                        </el-form-item>
                        <el-form-item label="批次属性5" prop="lotAttr05">
                            <el-input v-model="queryParams.lotAttr05" placeholder="请输入批次属性5" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['outbound:outboundTrans:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['outbound:outboundTrans:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['outbound:outboundTrans:remove']">删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['outbound:outboundTrans:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="outboundTransList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="订单号" align="center" width="150" prop="docNumber" sortable="custom" />
                <!--   <el-table-column label="上位单号" align="center" width="150" prop="refDocNumber" sortable="custom" />
              <el-table-column label="单据类型ID" align="center" width="150" prop="docTypeId" sortable="custom" /> -->
                <el-table-column label="单据类型编码" align="center" width="180" prop="docTypeCode" sortable="custom" :show-overflow-tooltip="true" />

                <el-table-column label="单据类型名称" align="center" width="150" prop="docTypeName" sortable="custom" />
                <el-table-column label="明细行号" align="center" width="150" prop="detailLineNum" sortable="custom" />
                <!-- <el-table-column label="上位行号" align="center" width="150" prop="refDetailLineNum" sortable="custom" /> -->
                <el-table-column label="交易类型" align="center" width="150" prop="transType" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_trans_type" :value="scope.row.transType" />
                    </template>
                </el-table-column>
                <el-table-column label="交易状态" width="150" align="center" prop="transStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.transStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" sortable="custom" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" sortable="custom" :show-overflow-tooltip="true" />
                <el-table-column label="订单数量" align="center" width="150" prop="orderedQty" sortable="custom" />
                <el-table-column label="交易数量" align="center" width="150" prop="transQty" sortable="custom" />
                <el-table-column label="单位" align="center" prop="unit" sortable="custom" />
                <el-table-column label="源库位" align="center" prop="sourceLocCode" width="160" sortable="custom" />
                <el-table-column label="目标库位编码" align="center" width="150" prop="targetLocCode" sortable="custom" />
                <el-table-column label="运输编码" align="center" width="150" prop="leCode" sortable="custom" />
                <el-table-column label="质检状态" align="center" width="150" prop="qcStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_qc_status" :value="scope.row.qcStatus" />
                    </template>
                </el-table-column>
                <!-- <el-table-column label="批次编码" align="center" width="150" prop="batchCode" sortable="custom" /> -->
                <el-table-column label="备注" align="center" width="150" prop="notes" sortable="custom" :show-overflow-tooltip="true" />
                <!-- <el-table-column label="过账状态" align="center" width="150" prop="ediStatus" sortable="custom" />
                <el-table-column label="过账时间" align="center" prop="ediTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.ediTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过账信息" align="center" width="150" prop="ediMsg" sortable="custom" /> -->
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
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['outbound:outboundTrans:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['outbound:outboundTrans:remove']">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改出库交易对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="outboundTransRef" :model="form" :rules="rules" label-width="80px">
                <!-- <el-form-item label="订单ID" prop="docId">
                    <el-input v-model="form.docId" placeholder="请输入订单ID" />
                </el-form-item> -->
                <el-form-item label="订单号" prop="docNumber">
                    <el-input v-model="form.docNumber" placeholder="请输入订单号" />
                </el-form-item>
                <!--  <el-form-item label="上位单号" prop="refDocNumber">
                    <el-input v-model="form.refDocNumber" placeholder="请输入上位单号" />
                </el-form-item>
              <el-form-item label="单据类型ID" prop="docTypeId">
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
                <!-- <el-form-item label="上位行号" prop="refDetailLineNum">
                    <el-input v-model="form.refDetailLineNum" placeholder="请输入上位行号" />
                </el-form-item> -->
                <el-form-item label="交易类型" prop="transType">
                    <el-select v-model="form.transType" placeholder="请选择交易类型">
                        <el-option v-for="dict in wes_trans_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select> </el-form-item>
                <el-form-item label="交易状态" prop="transStatus">
                    <el-select v-model="queryParams.transStatus" placeholder="请选择分配类型" clearable>
                        <el-option v-for="dict in wes_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
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
                <el-form-item label="交易数量" prop="transQty">
                    <el-input v-model="form.transQty" placeholder="请输入交易数量" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入单位" />
                </el-form-item>
                <!-- <el-form-item label="源库位ID" prop="sourceLocId">
                    <el-input v-model="form.sourceLocId" placeholder="请输入源库位ID" />
                </el-form-item> -->
                <el-form-item label="源库位" prop="sourceLocCode">
                    <el-input v-model="form.sourceLocCode" placeholder="请输入源库位" />
                </el-form-item>
                <!-- <el-form-item label="目标库位ID" prop="targetLocId">
                    <el-input v-model="form.targetLocId" placeholder="请输入目标库位ID" />
                </el-form-item> -->
                <el-form-item label="目标库位编码" prop="targetLocCode">
                    <el-input v-model="form.targetLocCode" placeholder="请输入目标库位编码" />
                </el-form-item>
                <!-- <el-form-item label="运输ID" prop="leId">
                    <el-input v-model="form.leId" placeholder="请输入运输ID" />
                </el-form-item> -->
                <el-form-item label="运输编码" prop="leCode">
                    <el-input v-model="form.leCode" placeholder="请输入运输编码" />
                </el-form-item>
                <!-- <el-form-item label="源库存ID" prop="sourceStockId">
                    <el-input v-model="form.sourceStockId" placeholder="请输入源库存ID" />
                </el-form-item>
                <el-form-item label="库存ID" prop="stockId">
                    <el-input v-model="form.stockId" placeholder="请输入库存ID" />
                </el-form-item> -->
                <el-form-item label="质检状态" prop="qcStatus">
                    <el-select v-model="form.qcStatus" placeholder="请选择质检状态" clearable>
                        <el-option v-for="dict in wes_qc_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                    <!-- <el-input v-model="form.qcStatus" placeholder="请输入质检状态" /> -->
                </el-form-item>
                <!-- <el-form-item label="批次属性ID" prop="batchId">
                    <el-input v-model="form.batchId" placeholder="请输入批次属性ID" />
                </el-form-item> -->
                <!-- <el-form-item label="批次编码" prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入批次编码" />
                </el-form-item> -->
                <!-- <el-form-item label="批次属性1" prop="lotAttr01">
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

<script setup name="OutboundTrans">
import { listOutboundTrans, getOutboundTrans, delOutboundTrans, addOutboundTrans, updateOutboundTrans } from "@/api/outbound/outboundTrans"

const { proxy } = getCurrentInstance()
const { wes_common_status, wes_trans_type, wes_qc_status } = proxy.useDict("wes_common_status", "wes_trans_type", "wes_qc_status")

const showAllSearchTop = ref(false)

const outboundTransList = ref([])
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
        docTypeCode: undefined,
        docTypeName: undefined,
        detailLineNum: undefined,
        refDetailLineNum: undefined,
        transType: undefined,
        transStatus: undefined,
        materialCode: undefined,
        materialName: undefined,
        unit: undefined,
        sourceLocCode: undefined,
        targetLocCode: undefined,
        leId: undefined,
        leCode: undefined,
        stockId: undefined,
        qcStatus: undefined,
        // batchCode: undefined,
        notes: undefined,
        ediStatus: undefined,
        ediTime: undefined,
        ediMsg: undefined,
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

/** 查询出库交易列表 */
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
    listOutboundTrans(queryParams.value).then(response => {
        outboundTransList.value = response.rows
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
        materialCode: null,
        materialName: null,
        orderedQty: null,
        transQty: null,
        unit: null,
        sourceLocCode: null,
        targetLocCode: null,
        leCode: null,
        qcStatus: null,
        batchId: null,
        // batchCode: null,
        notes: null,
        ediStatus: null,
        ediTime: null,
        ediMsg: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("outboundTransRef")
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
    ids.value = selection.map(item => item.id)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加出库交易"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getOutboundTrans(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改出库交易"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["outboundTransRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateOutboundTrans(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addOutboundTrans(form.value)
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
        .confirm('是否确认删除出库交易编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delOutboundTrans(_ids)
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
        "outbound/outboundTrans/export",
        {
            ...queryParams.value
        },
        `出库交易_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
