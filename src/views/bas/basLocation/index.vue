<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="库位编码" prop="locationCode">
                        <el-input v-model="queryParams.locationCode" placeholder="请输入库位编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="库位状态" prop="locationStatus">
                        <el-select v-model="queryParams.locationStatus" placeholder="请选择库位状态" clearable>
                            <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="库位类型" prop="locationType">
                        <el-select v-model="queryParams.locationType" placeholder="请选择库位类型" clearable>
                            <el-option v-for="dict in wes_loc_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务状态" prop="businessStatus">
                        <el-select v-model="queryParams.businessStatus" placeholder="请选择业务状态" clearable>
                            <el-option v-for="dict in wes_loc_business_const" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="库位信息" prop="information">
                            <el-input v-model="queryParams.information" placeholder="请输入库位信息" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="优先级" prop="priority">
                            <el-input v-model="queryParams.priority" placeholder="请输入优先级" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="映射库位1" prop="reflectionCode01">
                            <el-input v-model="queryParams.reflectionCode01" placeholder="请输入映射库位1" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!--
                        <el-form-item label="映射库位2" prop="reflectionCode02">
                            <el-input v-model="queryParams.reflectionCode02" placeholder="请输入映射库位2" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="映射库位3" prop="reflectionCode03">
                            <el-input v-model="queryParams.reflectionCode03" placeholder="请输入映射库位3" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="长度" prop="length">
                            <el-input v-model="queryParams.length" placeholder="请输入长度" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="高度" prop="height">
                            <el-input v-model="queryParams.height" placeholder="请输入高度" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="宽度" prop="width">
                            <el-input v-model="queryParams.width" placeholder="请输入宽度" clearable @keyup.enter="handleQuery" />
                        </el-form-item>-->
                        <!-- <el-form-item label="承重" prop="weight">
                            <el-input v-model="queryParams.weight" placeholder="请输入承重" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="巷道" prop="gang">
                            <el-input v-model="queryParams.gang" placeholder="请输入巷道" clearable @keyup.enter="handleQuery" />
                        </el-form-item>-->
                        <el-form-item label="排" prop="xpos">
                            <el-input v-model="queryParams.xpos" placeholder="请输入排" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="列" prop="ypos">
                            <el-input v-model="queryParams.ypos" placeholder="请输入列" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="层" prop="zpos">
                            <el-input v-model="queryParams.zpos" placeholder="请输入层" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="深浅=1深2浅" prop="depth">
                            <el-input v-model="queryParams.depth" placeholder="请输入深浅=1深2浅" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="入库侧X坐标" prop="inX">
                            <el-input v-model="queryParams.inX" placeholder="请输入入库侧X坐标" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="入库侧Y坐标" prop="inY">
                            <el-input v-model="queryParams.inY" placeholder="请输入入库侧Y坐标" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="出库侧X坐标" prop="outX">
                            <el-input v-model="queryParams.outX" placeholder="请输入出库侧X坐标" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="出库侧Y坐标" prop="outY">
                            <el-input v-model="queryParams.outY" placeholder="请输入出库侧Y坐标" clearable @keyup.enter="handleQuery" />
                        </el-form-item>-->
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bas:basLocation:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bas:basLocation:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bas:basLocation:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['bas:basLocation:import']">导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bas:basLocation:export']">导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Printer" :disabled="multiple" @click="handlePrint" v-hasPermi="['bas:basLocation:print']">打印</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="basLocationList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'ascending'}" @sort-change="handleSortChange">
              <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="库位编码" align="center" prop="locationCode" width="120" sortable="custom" />
                <el-table-column label="库位状态" width="150" align="center" prop="locationStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="sys_yes_no" :value="scope.row.locationStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="库位类型" width="150" align="center" prop="locationType" :show-overflow-tooltip="true" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_loc_type" :value="scope.row.locationType" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="业务状态" width="150" align="center" prop="businessStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_loc_business_const" :value="scope.row.businessStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="库位信息" width="180" align="center" prop="information" sortable="custom" :show-overflow-tooltip="true" />
                <el-table-column label="优先级" align="center" prop="priority" width="150" sortable="custom" />
                <el-table-column label="映射库位1" align="center" prop="reflectionCode01"  sortable="custom"  />
                <!--
                <el-table-column label="映射库位2" align="center" prop="reflectionCode02"  sortable="custom"  />
                <el-table-column label="映射库位3" align="center" prop="reflectionCode03"  sortable="custom"  />-->
                <!-- <el-table-column label="长度" align="center" prop="length" sortable="custom" />
                <el-table-column label="高度" align="center" prop="height" sortable="custom" />
                <el-table-column label="宽度" align="center" prop="width" sortable="custom" /> -->
                <!-- <el-table-column label="承重" align="center" prop="weight"  sortable="custom"  />
                <el-table-column label="巷道" align="center" prop="gang"  sortable="custom"  />-->
                <el-table-column label="排" align="center" prop="xpos" sortable="custom" />
                <el-table-column label="列" align="center" prop="ypos" sortable="custom" />
                <el-table-column label="层" align="center" prop="zpos" sortable="custom" />
                <!-- <el-table-column label="深浅=1深2浅" align="center" prop="depth"  sortable="custom"  />
                <el-table-column label="入库侧X坐标" align="center" prop="inX"  sortable="custom"  />
                <el-table-column label="入库侧Y坐标" align="center" prop="inY"  sortable="custom"  />
                <el-table-column label="出库侧X坐标" align="center" prop="outX"  sortable="custom"  />
                <el-table-column label="出库侧Y坐标" align="center" prop="outY"  sortable="custom"  />-->
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
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bas:basLocation:edit']">修改</el-button>
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bas:basLocation:remove']">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 添加或修改库位主数据对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="basLocationRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="库位编码" prop="locationCode">
                    <el-input v-model="form.locationCode" placeholder="请输入库位编码" />
                </el-form-item>
                <el-form-item label="库位状态" prop="locationStatus">
                    <el-select v-model="form.locationStatus" placeholder="请选择库位状态">
                        <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库位类型" prop="locationType">
                    <el-select v-model="form.locationType" placeholder="请选择库位类型">
                        <el-option v-for="dict in wes_loc_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务状态" prop="businessStatus">
                    <el-select v-model="form.businessStatus" placeholder="请选择业务状态">
                        <el-option v-for="dict in wes_loc_business_const" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库位信息" prop="information">
                    <el-input v-model="form.information" placeholder="请输入库位信息" />
                </el-form-item>
                <el-form-item label="库区编码" prop="areaId">
                    <el-select v-model="form.areaId" placeholder="请选择库区">
                        <el-option v-for="item in areaList" :key="item.id" :label="item.areaCode+' | '+item.areaName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优先级" prop="priority">
                    <el-input v-model="form.priority" placeholder="请输入优先级" />
                </el-form-item>
                <!-- <el-form-item label="映射库位1" prop="reflectionCode01">
                    <el-input v-model="form.reflectionCode01" placeholder="请输入映射库位1" />
                </el-form-item>
                <el-form-item label="映射库位2" prop="reflectionCode02">
                    <el-input v-model="form.reflectionCode02" placeholder="请输入映射库位2" />
                </el-form-item>
                <el-form-item label="映射库位3" prop="reflectionCode03">
                    <el-input v-model="form.reflectionCode03" placeholder="请输入映射库位3" />
                </el-form-item>-->
                <!-- <el-form-item label="长度" prop="length">
                    <el-input v-model="form.length" placeholder="请输入长度" />
                </el-form-item>
                <el-form-item label="高度" prop="height">
                    <el-input v-model="form.height" placeholder="请输入高度" />
                </el-form-item>
                <el-form-item label="宽度" prop="width">
                    <el-input v-model="form.width" placeholder="请输入宽度" />
                </el-form-item> -->
                <!-- <el-form-item label="承重" prop="weight">
                    <el-input v-model="form.weight" placeholder="请输入承重" />
                </el-form-item>
                <el-form-item label="巷道" prop="gang">
                    <el-input v-model="form.gang" placeholder="请输入巷道" />
                </el-form-item>-->
                <el-form-item label="排" prop="xpos">
                    <el-input v-model="form.xpos" placeholder="请输入排" />
                </el-form-item>
                <el-form-item label="列" prop="ypos">
                    <el-input v-model="form.ypos" placeholder="请输入列" />
                </el-form-item>
                <el-form-item label="层" prop="zpos">
                    <el-input v-model="form.zpos" placeholder="请输入层" />
                </el-form-item>
                <!-- <el-form-item label="深浅=1深2浅" prop="depth">
                    <el-input v-model="form.depth" placeholder="请输入深浅=1深2浅" />
                </el-form-item>
                <el-form-item label="入库侧X坐标" prop="inX">
                    <el-input v-model="form.inX" placeholder="请输入入库侧X坐标" />
                </el-form-item>
                <el-form-item label="入库侧Y坐标" prop="inY">
                    <el-input v-model="form.inY" placeholder="请输入入库侧Y坐标" />
                </el-form-item>
                <el-form-item label="出库侧X坐标" prop="outX">
                    <el-input v-model="form.outX" placeholder="请输入出库侧X坐标" />
                </el-form-item>
                <el-form-item label="出库侧Y坐标" prop="outY">
                    <el-input v-model="form.outY" placeholder="请输入出库侧Y坐标" />
                </el-form-item>-->
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 库位导入对话框 -->
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

<script setup name="BasLocation">
import { listBasLocation, getBasLocation, delBasLocation, addBasLocation, updateBasLocation, print } from "@/api/bas/basLocation"
import { dropDownListArea } from "@/api/bas/basArea"
import { UploadFilled } from '@element-plus/icons-vue'
import { getToken } from "@/utils/auth"

const { proxy } = getCurrentInstance()

const { sys_yes_no, wes_loc_type, wes_loc_business_const } = proxy.useDict("sys_yes_no", "wes_loc_type", "wes_loc_business_const")
const showAllSearchTop = ref(false)

const basLocationList = ref([])
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
const areaList = ref([])

// 导入相关变量
const uploadRef = ref()
// 库位导入参数
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
    url: (window.global_config ? window.global_config["baseUrl"] : "") + "/bas/basLocation/import",
    // 响应类型设置为blob
    responseType: 'blob'
})

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        locationCode: undefined,
        locationStatus: undefined,
        locationType: undefined,
        businessStatus: undefined,
        information: undefined,
        priority: undefined,
        reflectionCode01: undefined,
        reflectionCode02: undefined,
        reflectionCode03: undefined,
        length: undefined,
        height: undefined,
        width: undefined,
        weight: undefined,
        gang: undefined,
        zpos: undefined,
        xpos: undefined,
        ypos: undefined,
        depth: undefined,
        inX: undefined,
        inY: undefined,
        outX: undefined,
        outY: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        // 添加排序参数
        orderByColumn: 'id',
        isAsc: 'asc'
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询库位主数据列表 */
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
    listBasLocation(queryParams.value).then(response => {
        basLocationList.value = response.rows
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
        queryParams.value.isAsc = 'asc'
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
        locationCode: null,
        locationStatus: 'Y',
        locationType: null,
        businessStatus: null,
        information: null,
        priority: null,
        reflectionCode01: null,
        reflectionCode02: null,
        reflectionCode03: null,
        length: null,
        height: null,
        width: null,
        weight: null,
        gang: null,
        zpos: null,
        xpos: null,
        ypos: null,
        depth: null,
        inX: null,
        inY: null,
        outX: null,
        outY: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("basLocationRef")
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

function getAreaList() {
    dropDownListArea().then(response => {
        console.log(response)
        areaList.value = response.data
    })
}

/** 新增按钮操作 */
function handleAdd() {
    getAreaList()
    reset()
    open.value = true
    title.value = "添加库位主数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    getAreaList()
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getBasLocation(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改库位主数据"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["basLocationRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateBasLocation(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addBasLocation(form.value)
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
        .confirm('是否确认删除库位主数据编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delBasLocation(_ids)
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
/** 打印操作 */
function handlePrint(row) {
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认打印"' + _ids + '"数据项的库位码？')
        .then(() => {
            loading.value = true
            return print(_ids)
        })
        .then(res => {
            loading.value = false
            const binaryData = []
            binaryData.push(res)
            //获取blob链接
            let pdfUrl = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }))
            window.open(pdfUrl)
        })
        .finally(() => {
            loading.value = false
        })
}


/**
 * 下载模板操作
 * 下载库位导入模板文件
 */
function handleDownloadTemplate() {
    proxy.download(
        "bas/basLocation/importTemplate",
        {},
        `库位导入模板_${new Date().getTime()}.xlsx`
    )
}

/**
 * 导入按钮操作
 * 打开导入对话框
 */
function handleImport() {
    upload.title = "库位导入"
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
        link.download = `库位导入结果_${new Date().getTime()}.xlsx`
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
        "bas/basLocation/export",
        {
            ...queryParams.value
        },
        `库位主数据_${new Date().getTime()}.xlsx`
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
