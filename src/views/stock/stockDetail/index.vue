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
                    <el-form-item label="库位编码" prop="locationCode">
                        <el-input v-model="queryParams.locationCode" placeholder="请输入库位编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="运输编码" prop="leCode">
                        <el-input v-model="queryParams.leCode" placeholder="请输入运输编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <!-- <el-form-item label="批次编码" prop="batchCode">
                            <el-input v-model="queryParams.batchCode" placeholder="请输入批次编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->

                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="库存状态" prop="stockStatus">
                            <el-select v-model="queryParams.stockStatus" placeholder="请选择库存状态" clearable>
                                <el-option v-for="dict in wes_stock_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="业务状态" prop="holdStatus">
                            <el-select v-model="queryParams.holdStatus" placeholder="请选择业务状态" clearable>
                                <el-option v-for="dict in wes_hold_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="质检状态" prop="qcStatus">
                            <el-select v-model="queryParams.qcStatus" placeholder="请选择质检状态" clearable>
                                <el-option v-for="dict in wes_qc_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数量" prop="qty">
                            <el-input v-model="queryParams.qty" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="分配数量" prop="allocationQty">
                            <el-input v-model="queryParams.allocationQty" placeholder="请输入分配数量" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="收货时间" style="width: 320px">
                            <el-date-picker v-model="daterangeReceiveTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item label="预警期" style="width: 308px">
                            <el-date-picker v-model="daterangeAlertDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="保质期" style="width: 308px">
                            <el-date-picker v-model="daterangeExpireDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="超存期" style="width: 308px">
                            <el-date-picker v-model="daterangeOverStorageDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item> -->
                        <el-form-item label="入库单号" prop="inboundNum">
                            <el-input v-model="queryParams.inboundNum" placeholder="请输入入库单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="出库单号" prop="outboundNum">
                            <el-input v-model="queryParams.outboundNum" placeholder="请输入出库单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="重" prop="weight">
                            <el-input v-model="queryParams.weight" placeholder="请输入重" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="长" prop="length">
                            <el-input v-model="queryParams.length" placeholder="请输入长" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="宽" prop="width">
                            <el-input v-model="queryParams.width" placeholder="请输入宽" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="高" prop="height">
                            <el-input v-model="queryParams.height" placeholder="请输入高" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
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
                <!-- <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['stock:stockDetail:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['stock:stockDetail:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['stock:stockDetail:remove']">删除</el-button>
                </el-col>-->
                <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['stock:stockDetail:import']">导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['stock:stockDetail:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="stockDetailList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" :show-overflow-tooltip="true" sortable="custom" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" :show-overflow-tooltip="true" sortable="custom" />
                <!-- <el-table-column label="批次编码" align="center" width="150" prop="batchCode" :show-overflow-tooltip="true" sortable="custom" /> -->
                <el-table-column label="库位编码" align="center" width="150" prop="locationCode" :show-overflow-tooltip="true" sortable="custom" />
                <el-table-column label="运输编码" align="center" width="150" prop="leCode" :show-overflow-tooltip="true" sortable="custom" />
                <el-table-column label="单位" align="center" prop="unit" sortable="custom" />
                <el-table-column label="库存状态" width="150" align="center" prop="stockStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_stock_status" :value="scope.row.stockStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="业务状态" width="150" align="center" prop="holdStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_hold_status" :value="scope.row.holdStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="质检状态" width="150" align="center" prop="qcStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_qc_status" :value="scope.row.qcStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="center" prop="qty" sortable="custom" />
                <el-table-column label="分配数量" width="150" align="center" prop="allocationQty" sortable="custom" />
                <el-table-column label="收货时间" align="center" prop="receiveTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.receiveTime) }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="预警期" align="center" prop="alertDate" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.alertDate) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="保质期" align="center" prop="expireDate" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.expireDate) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="超存期" align="center" prop="overStorageDate" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.overStorageDate) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="满盘标记" align="center" prop="fullFlag" />-->
                <el-table-column label="入库单号" align="center" width="150" prop="inboundNum" sortable="custom" />
                <el-table-column label="出库单号" align="center" prop="outboundNum" width="150" sortable="custom" />
                <!-- <el-table-column label="重" align="center" prop="weight" />
                <el-table-column label="长" align="center" prop="length" />
                <el-table-column label="宽" align="center" prop="width" />
                <el-table-column label="高" align="center" prop="height" /> -->
                <el-table-column label="备注" align="center" prop="notes" />
                <el-table-column label="创建人" align="center" prop="createBy" width="150" sortable="custom" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" width="150" sortable="custom" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['stock:stockDetail:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['stock:stockDetail:remove']">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改库存明细对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="stockDetailRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="物料ID" prop="materialId">
                    <el-input v-model="form.materialId" placeholder="请输入物料ID" />
                </el-form-item>
                <el-form-item label="物料编码" prop="materialCode">
                    <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
                </el-form-item>
                <el-form-item label="物料名称" prop="materialName">
                    <el-input v-model="form.materialName" placeholder="请输入物料名称" />
                </el-form-item>
                <!-- <el-form-item label="批次编码" prop="batchCode">
                    <el-input v-model="form.batchCode" placeholder="请输入批次编码" />
                </el-form-item> -->
                <el-form-item label="库位编码" prop="locationCode">
                    <el-input v-model="form.locationCode" placeholder="请输入库位编码" />
                </el-form-item>
                <el-form-item label="运输编码" prop="leCode">
                    <el-input v-model="form.leCode" placeholder="请输入运输编码" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入单位" />
                </el-form-item>
                <el-form-item label="库存状态" prop="stockStatus">
                    <el-select v-model="form.stockStatus" placeholder="请选择库存状态">
                        <el-option v-for="item in wes_stock_status" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="业务状态" prop="holdStatus">
                    <el-select v-model="form.holdStatus" placeholder="请选择业务状态">
                        <el-option v-for="item in wes_hold_status" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="质检状态" prop="qcStatus">
                    <el-select v-model="form.qcStatus" placeholder="请选择质检状态">
                        <el-option v-for="item in wes_qc_status" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" prop="qty">
                    <el-input v-model="form.qty" placeholder="请输入数量" />
                </el-form-item>
                <el-form-item label="分配数量" prop="allocationQty">
                    <el-input v-model="form.allocationQty" placeholder="请输入分配数量" />
                </el-form-item>
                <el-form-item label="收货时间" prop="receiveTime">
                    <el-date-picker clearable v-model="form.receiveTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择收货时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="预警期" prop="alertDate">
                    <el-date-picker clearable v-model="form.alertDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择预警期"></el-date-picker>
                </el-form-item>
                <el-form-item label="保质期" prop="expireDate">
                    <el-date-picker clearable v-model="form.expireDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择保质期"></el-date-picker>
                </el-form-item>
                <el-form-item label="超存期" prop="overStorageDate">
                    <el-date-picker clearable v-model="form.overStorageDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择超存期"></el-date-picker>
                </el-form-item>

                <el-form-item label="入库单号" prop="inboundNum">
                    <el-input v-model="form.inboundNum" placeholder="请输入入库单号" />
                </el-form-item>
                <el-form-item label="出库单号" prop="outboundNum">
                    <el-input v-model="form.outboundNum" placeholder="请输入出库单号" />
                </el-form-item>
                <el-form-item label="重" prop="weight">
                    <el-input v-model="form.weight" placeholder="请输入重" />
                </el-form-item>
                <el-form-item label="长" prop="length">
                    <el-input v-model="form.length" placeholder="请输入长" />
                </el-form-item>
                <el-form-item label="宽" prop="width">
                    <el-input v-model="form.width" placeholder="请输入宽" />
                </el-form-item>
                <el-form-item label="高" prop="height">
                    <el-input v-model="form.height" placeholder="请输入高" />
                </el-form-item>
                <el-form-item label="备注" prop="notes">
                    <el-input v-model="form.notes" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 库存导入对话框 -->
        <el-dialog class="el-dialog-business" left :title="upload.title" v-model="upload.open" width="600px" append-to-body>
            <div class="import-container">
                <!-- 模板下载区域 -->
                <div class="template-section">
                    <el-button type="success" icon="Download" @click="handleDownloadTemplate">下载导入模板</el-button>
                    <div class="tip-text">请先下载模板，按照模板格式填写数据后再上传</div>
                </div>

                <!-- 文件上传区域 -->
                <div class="upload-section">
                    <el-upload ref="uploadRef" class="upload-demo" drag :limit="1" accept=".xlsx,.xls" :headers="upload.headers" :action="upload.url" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :on-exceed="handleExceed" :auto-upload="false" :http-request="customUpload">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">只能上传xlsx/xls文件，且不超过10MB</div>
                        </template>
                    </el-upload>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFileForm" :loading="upload.isUploading">确 定</el-button>
                    <el-button @click="uploadCancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="StockDetail">
import { listStockDetail, getStockDetail, delStockDetail, addStockDetail, updateStockDetail } from "@/api/stock/stockDetail"
import { UploadFilled } from '@element-plus/icons-vue'
import { getToken } from "@/utils/auth"

const { proxy } = getCurrentInstance()
const { sys_yes_no, wes_area_type, wes_hold_status, wes_qc_status, wes_stock_status } = proxy.useDict("sys_yes_no", "wes_area_type", "wes_hold_status", "wes_qc_status", "wes_stock_status")


const showAllSearchTop = ref(false)

const stockDetailList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeReceiveTime = ref([])
const daterangeAlertDate = ref([])
const daterangeExpireDate = ref([])
const daterangeOverStorageDate = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])

// 导入相关变量
const uploadRef = ref()
// 库存导入参数
const upload = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: "",
    // 是否禁用上传
    isUploading: false,
    // 设置上传的请求头部
    headers: {
        Authorization: "Bearer " + getToken()
    },
    // 上传的地址
    url: (window.global_config ? window.global_config["baseUrl"] : "") + "/stock/stockDetail/import",
    // 响应类型设置为blob
    responseType: 'blob'
})

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        materialCode: undefined,
        materialName: undefined,
        // batchCode: undefined,
        locationCode: undefined,
        leCode: undefined,
        unit: undefined,
        stockStatus: undefined,
        holdStatus: undefined,
        qcStatus: undefined,
        qty: undefined,
        allocationQty: undefined,
        receiveTime: undefined,
        alertDate: undefined,
        expireDate: undefined,
        overStorageDate: undefined,

        inboundNum: undefined,
        outboundNum: undefined,
        price: undefined,
        weight: undefined,
        length: undefined,
        width: undefined,
        height: undefined,
        notes: undefined,
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

/** 查询库存明细列表 */
function getList() {
    loading.value = true
    queryParams.value.params = {}
    if (null != daterangeReceiveTime && "" != daterangeReceiveTime) {
        queryParams.value.params["beginReceiveTime"] = daterangeReceiveTime.value[0]
        queryParams.value.params["endReceiveTime"] = daterangeReceiveTime.value[1]
    }
    if (null != daterangeAlertDate && "" != daterangeAlertDate) {
        queryParams.value.params["beginAlertDate"] = daterangeAlertDate.value[0]
        queryParams.value.params["endAlertDate"] = daterangeAlertDate.value[1]
    }
    if (null != daterangeExpireDate && "" != daterangeExpireDate) {
        queryParams.value.params["beginExpireDate"] = daterangeExpireDate.value[0]
        queryParams.value.params["endExpireDate"] = daterangeExpireDate.value[1]
    }
    if (null != daterangeOverStorageDate && "" != daterangeOverStorageDate) {
        queryParams.value.params["beginOverStorageDate"] = daterangeOverStorageDate.value[0]
        queryParams.value.params["endOverStorageDate"] = daterangeOverStorageDate.value[1]
    }
    if (null != daterangeCreateTime && "" != daterangeCreateTime) {
        queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
        queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
    }
    if (null != daterangeUpdateTime && "" != daterangeUpdateTime) {
        queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0]
        queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1]
    }
    listStockDetail(queryParams.value).then(response => {
        stockDetailList.value = response.rows
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
        materialCode: null,
        materialName: null,
        // batchCode: null,
        lotAttr01: null,
        lotAttr02: null,
        lotAttr03: null,
        lotAttr04: null,
        lotAttr05: null,
        locationCode: null,
        leCode: null,
        unit: null,
        stockStatus: null,
        holdStatus: null,
        qcStatus: null,
        qty: null,
        allocationQty: null,
        receiveTime: null,
        alertDate: null,
        expireDate: null,
        overStorageDate: null,

        inboundNum: null,
        outboundNum: null,
        price: null,
        weight: null,
        length: null,
        width: null,
        height: null,
        notes: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("stockDetailRef")
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
    daterangeReceiveTime.value = []
    daterangeAlertDate.value = []
    daterangeExpireDate.value = []
    daterangeOverStorageDate.value = []
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
    title.value = "添加库存明细"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getStockDetail(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改库存明细"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["stockDetailRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateStockDetail(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addStockDetail(form.value)
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
/** 删除按钮操作 */
function handleDelete(row) {
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认删除库存明细编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delStockDetail(_ids)
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

/** 下载模板操作 */
function handleDownloadTemplate() {
    proxy.download(
        "stock/stockDetail/importTemplate",
        {},
        `库存导入模板_${new Date().getTime()}.xlsx`
    )
}

/**
 * 导入按钮操作
 * 打开导入对话框
 */
function handleImport() {
    upload.title = "库存导入"
    upload.open = true
}

/**
 * 文件数量超出限制处理
 * 当用户选择超过1个文件时触发
 */
function handleExceed() {
    proxy.$modal.msgWarning('只能选择一个文件进行导入')
}

/**
 * 文件上传中处理
 * 显示上传进度
 */
function handleFileUploadProgress(event, file, fileList) {
    upload.isUploading = true
}

/**
 * 文件上传成功处理
 * 处理上传成功后的响应
 */
function handleFileSuccess(response, file, fileList) {
    upload.open = false
    upload.isUploading = false
    if (uploadRef.value) {
        uploadRef.value.clearFiles()
    }

    // 检查响应类型，如果是Blob类型，说明是Excel文件
    if (response instanceof Blob) {
        // 创建下载链接
        const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `库存导入结果_${new Date().getTime()}.xlsx`
        link.click()
        URL.revokeObjectURL(link.href)

        // 显示提示信息
        proxy.$modal.msgSuccess('导入完成，已自动下载带有错误信息的结果文件')
    } else {
        // 兼容处理旧的JSON响应方式
        proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {
            dangerouslyUseHTMLString: true
        })
    }

    getList()
}

/**
 * 提交上传文件
 * 执行文件上传操作
 */
function submitFileForm() {
    if (uploadRef.value) {
        uploadRef.value.submit()
    }
}

/**
 * 取消上传
 * 关闭对话框并重置状态
 */
function uploadCancel() {
    if (uploadRef.value) {
        uploadRef.value.clearFiles()
    }
    upload.isUploading = false
    upload.open = false
}

/**
 * 自定义上传方法
 * 处理文件上传请求，支持blob响应类型
 */
function customUpload(options) {
    const { action, file, headers, onProgress, onSuccess, onError } = options

    // 创建FormData
    const formData = new FormData()
    formData.append('file', file)

    // 创建XMLHttpRequest
    const xhr = new XMLHttpRequest()
    xhr.open('POST', action, true)

    // 设置responseType为blob
    xhr.responseType = 'blob'

    // 设置headers
    if (headers) {
        Object.keys(headers).forEach(key => {
            xhr.setRequestHeader(key, headers[key])
        })
    }

    // 监听上传进度
    xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
            onProgress({ percent: e.loaded / e.total * 100 })
        }
    })

    // 请求完成处理
    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            onSuccess(xhr.response)
        } else {
            onError(new Error('上传失败'))
        }
    })

    // 请求错误处理
    xhr.addEventListener('error', () => {
        onError(new Error('上传请求失败'))
    })

    // 发送请求
    xhr.send(formData)

    return xhr
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download(
        "stock/stockDetail/export",
        {
            ...queryParams.value
        },
        `库存明细_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>

<style scoped>
.import-container {
    padding: 20px 0;
}

.template-section {
    margin-bottom: 30px;
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.tip-text {
    margin-top: 10px;
    color: #6c757d;
    font-size: 14px;
}

.upload-section {
    margin-bottom: 20px;
}

.upload-demo {
    width: 100%;
}

.upload-demo .el-upload {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    padding: 40px 20px;
    text-align: center;
    background-color: #fafafa;
}

.upload-demo .el-upload:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
}

.el-icon--upload {
    font-size: 67px;
    color: #c0c4cc;
    margin-bottom: 16px;
    line-height: 50px;
}

.el-upload__text {
    color: #606266;
    font-size: 14px;
    text-align: center;
}

.el-upload__text em {
    color: #409eff;
    font-style: normal;
}

.el-upload__tip {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
    text-align: center;
}
</style>
