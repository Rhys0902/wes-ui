<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="分配类型" prop="allocationType">
                        <el-input v-model="queryParams.allocationType" placeholder="请输入分配类型" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="分配状态" prop="allocationStatus">
                        <el-input v-model="queryParams.allocationStatus" placeholder="请输入分配状态" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="物流状态" prop="logisticsStatus">
                        <el-input v-model="queryParams.logisticsStatus" placeholder="请输入物流状态" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="订单ID" prop="docId">
                        <el-input v-model="queryParams.docId" placeholder="请输入订单ID" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="订单号" prop="docNumber">
                            <el-input v-model="queryParams.docNumber" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="上位单号" prop="refDocNumber">
                            <el-input v-model="queryParams.refDocNumber" placeholder="请输入上位单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="订单行ID" prop="detailId">
                            <el-input v-model="queryParams.detailId" placeholder="请输入订单行ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="明细行号" prop="detailLineNum">
                            <el-input v-model="queryParams.detailLineNum" placeholder="请输入明细行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="上位行号" prop="refDetailLineNum">
                            <el-input v-model="queryParams.refDetailLineNum" placeholder="请输入上位行号" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="物料ID" prop="materialId">
                            <el-input v-model="queryParams.materialId" placeholder="请输入物料ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料编码" prop="materialCode">
                            <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料名称" prop="materialName">
                            <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="源库存ID" prop="sourceStockId">
                            <el-input v-model="queryParams.sourceStockId" placeholder="请输入源库存ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标库存ID" prop="targetStockId">
                            <el-input v-model="queryParams.targetStockId" placeholder="请输入目标库存ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="订单数量" prop="orderedQty">
                            <el-input v-model="queryParams.orderedQty" placeholder="请输入订单数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="分配数量" prop="allocatedQty">
                            <el-input v-model="queryParams.allocatedQty" placeholder="请输入分配数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="确认数量" prop="confirmedQty">
                            <el-input v-model="queryParams.confirmedQty" placeholder="请输入确认数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="质检状态" prop="qcStatus">
                            <el-input v-model="queryParams.qcStatus" placeholder="请输入质检状态" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="目标库位" prop="targetLocCode">
                            <el-input v-model="queryParams.targetLocCode" placeholder="请输入目标库位" clearable @keyup.enter="handleQuery" />
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
                        <el-form-item label="过账状态" prop="ediStatus">
                            <el-input v-model="queryParams.ediStatus" placeholder="请输入过账状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="过账时间" style="width: 320px">
                            <el-date-picker v-model="daterangeEdiTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="过账信息" prop="ediMsg">
                            <el-input v-model="queryParams.ediMsg" placeholder="请输入过账信息" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['repl:replAllocation:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['repl:replAllocation:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['repl:replAllocation:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['repl:replAllocation:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="replAllocationList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="分配类型" align="center" prop="allocationType" />
                <el-table-column label="分配状态" align="center" prop="allocationStatus" />
                <el-table-column label="物流状态" align="center" prop="logisticsStatus" />
                <el-table-column label="订单ID" align="center" prop="docId" />
                <el-table-column label="订单号" align="center" prop="docNumber" />
                <el-table-column label="上位单号" align="center" prop="refDocNumber" />
                <el-table-column label="订单行ID" align="center" prop="detailId" />
                <el-table-column label="明细行号" align="center" prop="detailLineNum" />
                <el-table-column label="上位行号" align="center" prop="refDetailLineNum" />
                <el-table-column label="单据类型ID" align="center" prop="docTypeId" />
                <el-table-column label="单据类型编码" align="center" prop="docTypeCode" />
                <el-table-column label="单据类型名称" align="center" prop="docTypeName" />
                <el-table-column label="物料ID" align="center" prop="materialId" />
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" />
                <el-table-column label="源库存ID" align="center" prop="sourceStockId" />
                <el-table-column label="目标库存ID" align="center" prop="targetStockId" />
                <el-table-column label="订单数量" align="center" prop="orderedQty" />
                <el-table-column label="分配数量" align="center" prop="allocatedQty" />
                <el-table-column label="确认数量" align="center" prop="confirmedQty" />
                <el-table-column label="单位" align="center" prop="unit" />
                <el-table-column label="质检状态" align="center" prop="qcStatus" />
                <el-table-column label="源库位ID" align="center" prop="sourceLocId" />
                <el-table-column label="源库位" align="center" prop="sourceLocCode" />
                <el-table-column label="目标库位ID" align="center" prop="targetLocId" />
                <el-table-column label="目标库位" align="center" prop="targetLocCode" />
                <el-table-column label="源容器ID" align="center" prop="sourceLeId" />
                <el-table-column label="源容器编码" align="center" width="160" prop="sourceLeCode" />
                <el-table-column label="目标容器ID" align="center" prop="targetLeId" />
                <el-table-column label="目标容器编码" align="center" width="160" prop="targetLeCode" />
                <el-table-column label="批次属性ID" align="center" prop="batchId" />
                <!-- <el-table-column label="批次编码" align="center" prop="batchCode" /> -->
                <el-table-column label="批次属性1" align="center" prop="lotAttr01" />
                <el-table-column label="批次属性2" align="center" prop="lotAttr02" />
                <el-table-column label="批次属性3" align="center" prop="lotAttr03" />
                <el-table-column label="批次属性4" align="center" prop="lotAttr04" />
                <el-table-column label="批次属性5" align="center" prop="lotAttr05" />
                <el-table-column label="备注" align="center" prop="notes" />
                <el-table-column label="过账状态" align="center" prop="ediStatus" />
                <el-table-column label="过账时间" align="center" prop="ediTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.ediTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过账信息" align="center" prop="ediMsg" />
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
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['repl:replAllocation:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['repl:replAllocation:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改补货分配对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="replAllocationRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="分配类型" prop="allocationType">
                    <el-input v-model="form.allocationType" placeholder="请输入分配类型" />
                </el-form-item>
                <el-form-item label="分配状态" prop="allocationStatus">
                    <el-input v-model="form.allocationStatus" placeholder="请输入分配状态" />
                </el-form-item>
                <el-form-item label="物流状态" prop="logisticsStatus">
                    <el-input v-model="form.logisticsStatus" placeholder="请输入物流状态" />
                </el-form-item>
                <el-form-item label="订单ID" prop="docId">
                    <el-input v-model="form.docId" placeholder="请输入订单ID" />
                </el-form-item>
                <el-form-item label="订单号" prop="docNumber">
                    <el-input v-model="form.docNumber" placeholder="请输入订单号" />
                </el-form-item>
                <el-form-item label="上位单号" prop="refDocNumber">
                    <el-input v-model="form.refDocNumber" placeholder="请输入上位单号" />
                </el-form-item>
                <el-form-item label="订单行ID" prop="detailId">
                    <el-input v-model="form.detailId" placeholder="请输入订单行ID" />
                </el-form-item>
                <el-form-item label="明细行号" prop="detailLineNum">
                    <el-input v-model="form.detailLineNum" placeholder="请输入明细行号" />
                </el-form-item>
                <el-form-item label="上位行号" prop="refDetailLineNum">
                    <el-input v-model="form.refDetailLineNum" placeholder="请输入上位行号" />
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
                <el-form-item label="物料ID" prop="materialId">
                    <el-input v-model="form.materialId" placeholder="请输入物料ID" />
                </el-form-item>
                <el-form-item label="物料编码" prop="materialCode">
                    <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
                </el-form-item>
                <el-form-item label="物料名称" prop="materialName">
                    <el-input v-model="form.materialName" placeholder="请输入物料名称" />
                </el-form-item>
                <el-form-item label="源库存ID" prop="sourceStockId">
                    <el-input v-model="form.sourceStockId" placeholder="请输入源库存ID" />
                </el-form-item>
                <el-form-item label="目标库存ID" prop="targetStockId">
                    <el-input v-model="form.targetStockId" placeholder="请输入目标库存ID" />
                </el-form-item>
                <el-form-item label="订单数量" prop="orderedQty">
                    <el-input v-model="form.orderedQty" placeholder="请输入订单数量" />
                </el-form-item>
                <el-form-item label="分配数量" prop="allocatedQty">
                    <el-input v-model="form.allocatedQty" placeholder="请输入分配数量" />
                </el-form-item>
                <el-form-item label="确认数量" prop="confirmedQty">
                    <el-input v-model="form.confirmedQty" placeholder="请输入确认数量" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入单位" />
                </el-form-item>
                <el-form-item label="质检状态" prop="qcStatus">
                    <el-input v-model="form.qcStatus" placeholder="请输入质检状态" />
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
                <el-form-item label="目标库位" prop="targetLocCode">
                    <el-input v-model="form.targetLocCode" placeholder="请输入目标库位" />
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
                <el-form-item label="批次属性ID" prop="batchId">
                    <el-input v-model="form.batchId" placeholder="请输入批次属性ID" />
                </el-form-item>
                <!-- <el-form-item label="批次编码" prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入批次编码" />
                </el-form-item> -->
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

<script setup name="ReplAllocation">
import { listReplAllocation, getReplAllocation, delReplAllocation, addReplAllocation, updateReplAllocation } from "@/api/repl/replAllocation"

const { proxy } = getCurrentInstance()
const showAllSearchTop = ref(false)

const replAllocationList = ref([])
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
        allocationType: undefined,
        allocationStatus: undefined,
        logisticsStatus: undefined,
        docId: undefined,
        docNumber: undefined,
        refDocNumber: undefined,
        detailId: undefined,
        detailLineNum: undefined,
        refDetailLineNum: undefined,
        docTypeId: undefined,
        docTypeCode: undefined,
        docTypeName: undefined,
        materialId: undefined,
        materialCode: undefined,
        materialName: undefined,
        sourceStockId: undefined,
        targetStockId: undefined,
        orderedQty: undefined,
        allocatedQty: undefined,
        confirmedQty: undefined,
        unit: undefined,
        qcStatus: undefined,
        sourceLocId: undefined,
        sourceLocCode: undefined,
        targetLocId: undefined,
        targetLocCode: undefined,
        sourceLeId: undefined,
        sourceLeCode: undefined,
        targetLeId: undefined,
        targetLeCode: undefined,
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

/** 查询补货分配列表 */
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
    listReplAllocation(queryParams.value).then(response => {
        replAllocationList.value = response.rows
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
        allocationType: null,
        allocationStatus: null,
        logisticsStatus: null,
        docId: null,
        docNumber: null,
        refDocNumber: null,
        detailId: null,
        detailLineNum: null,
        refDetailLineNum: null,
        docTypeId: null,
        docTypeCode: null,
        docTypeName: null,
        materialId: null,
        materialCode: null,
        materialName: null,
        sourceStockId: null,
        targetStockId: null,
        orderedQty: null,
        allocatedQty: null,
        confirmedQty: null,
        unit: null,
        qcStatus: null,
        sourceLocId: null,
        sourceLocCode: null,
        targetLocId: null,
        targetLocCode: null,
        sourceLeId: null,
        sourceLeCode: null,
        targetLeId: null,
        targetLeCode: null,
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
        updateBy: null
    }
    proxy.resetForm("replAllocationRef")
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
    title.value = "添加补货分配"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getReplAllocation(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改补货分配"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["replAllocationRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateReplAllocation(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addReplAllocation(form.value)
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
        .confirm('是否确认删除补货分配编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delReplAllocation(_ids)
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
        "repl/replAllocation/export",
        {
            ...queryParams.value
        },
        `补货分配_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
