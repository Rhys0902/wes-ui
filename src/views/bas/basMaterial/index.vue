<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
                    <el-form-item label="物料编码" prop="materialCode">
                        <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="物料名称" prop="materialName">
                        <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="规格型号" prop="specs">
                        <el-input v-model="queryParams.specs" placeholder="请输入规格型号" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="queryParams.unit" placeholder="请输入单位" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <!--  <el-form-item label="物料类型编码" prop="materialTypeCode">
                        <el-input v-model="queryParams.materialTypeCode" placeholder="请输入物料类型编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item> -->
                    <span v-show="showAllSearchTop">
                        <!-- <el-form-item label="物料类型名称" prop="materialTypeName">
                            <el-input v-model="queryParams.materialTypeName" placeholder="请输入物料类型名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->

                        <el-form-item label="物料状态" prop="materialStatus">
                            <el-select v-model="queryParams.materialStatus" placeholder="请选择物料状态" clearable>
                                <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="属性" prop="property">
                            <el-input v-model="queryParams.property" placeholder="请输入属性" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="包装单位" prop="packUnit">
                            <el-input v-model="queryParams.packUnit" placeholder="请输入包装单位" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="仓库编码" prop="warehouseCode">
                            <el-input v-model="queryParams.warehouseCode" placeholder="请输入仓库编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="仓库名称" prop="warehouseName">
                            <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="领料仓库编码" prop="pickWarehouseCode">
                            <el-input v-model="queryParams.pickWarehouseCode" placeholder="请输入领料仓库编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="领料仓库名称" prop="pickWarehouseName">
                            <el-input v-model="queryParams.pickWarehouseName" placeholder="请输入领料仓库名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="库存管理标识" prop="stockFlag">
                            <el-input v-model="queryParams.stockFlag" placeholder="请输入库存管理标识" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="批次管理标识" prop="batchFlag">
                            <el-input v-model="queryParams.batchFlag" placeholder="请输入批次管理标识" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="毛重" prop="grossWeight">
                            <el-input v-model="queryParams.grossWeight" placeholder="请输入毛重" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="净重" prop="netWeight">
                            <el-input v-model="queryParams.netWeight" placeholder="请输入净重" clearable @keyup.enter="handleQuery" />
                        </el-form-item>-->
                        <!-- <el-form-item label="长" prop="length">
                            <el-input v-model="queryParams.length" placeholder="请输入长" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="宽" prop="width">
                            <el-input v-model="queryParams.width" placeholder="请输入宽" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="高" prop="height">
                            <el-input v-model="queryParams.height" placeholder="请输入高" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="体积" prop="volume">
                            <el-input v-model="queryParams.volume" placeholder="请输入体积" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <!-- <el-form-item label="状态：Y-启用 N-禁用 " prop="materialStatus">
                            <el-input v-model="queryParams.materialStatus" placeholder="请输入状态：Y-启用 N-禁用 " clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="采购人编码" prop="purchaseByCode">
                            <el-input v-model="queryParams.purchaseByCode" placeholder="请输入采购人编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="采购人名称" prop="purchaseByName">
                            <el-input v-model="queryParams.purchaseByName" placeholder="请输入采购人名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
                        </el-form-item>-->
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bas:basMaterial:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bas:basMaterial:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bas:basMaterial:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['bas:basMaterial:import']">导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bas:basMaterial:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="basMaterialList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'ascending '}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="false" /> -->
                <el-table-column label="物料编码" width="180" align="center" prop="materialCode" :show-overflow-tooltip="true" sortable="custom" />
                <el-table-column label="物料名称" width="200" align="center" prop="materialName" :show-overflow-tooltip="true" sortable="custom" />
                <!-- <el-table-column label="其他物料编码" align="center" prop="materialAliasCode"  sortable="custom"  />
                <el-table-column label="物料英文名称" align="center" prop="materialNameEn"  sortable="custom"  />
                <el-table-column label="物料类型ID" align="center" prop="materialTypeId"  sortable="custom"  />
                <el-table-column label="物料类型编码" width="200" align="center" prop="materialTypeCode" :show-overflow-tooltip="true" sortable="custom" />
                <el-table-column label="物料类型名称" width="200" align="center" prop="materialTypeName" :show-overflow-tooltip="true" sortable="custom" />-->
                <el-table-column label="规格型号" width="200" align="center" prop="specs" sortable="custom" :show-overflow-tooltip="true" />
                <el-table-column label="单位" width="150" align="center" prop="unit" sortable="custom" />
                <el-table-column label="物料状态" align="center" prop="materialStatus">
                    <template #default="scope">
                        <dict-tag :options="sys_yes_no" :value="scope.row.materialStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <!-- <el-table-column label="属性" align="center" prop="property" sortable="custom" /> -->
                <!-- <el-table-column label="包装单位" width="150" align="center" prop="packUnit" sortable="custom" /> -->
                <!-- <el-table-column label="仓库ID" align="center" prop="warehouseId"  sortable="custom"  /> -->
                <!-- <el-table-column label="仓库编码" width="150" align="center" prop="warehouseCode" sortable="custom" />
                <el-table-column label="仓库名称" width="150" align="center" prop="warehouseName" sortable="custom" />
             <el-table-column label="领料仓库编码" align="center" width="150" prop="pickWarehouseCode" sortable="custom" />
                <el-table-column label="领料仓库名称" align="center" width="150" prop="pickWarehouseName" sortable="custom" />
                <el-table-column label="库存管理标识" align="center" width="150" prop="stockFlag" sortable="custom" />
                <el-table-column label="批次管理标识" align="center" width="150" prop="batchFlag" sortable="custom" />
                <el-table-column label="毛重" align="center" prop="grossWeight" sortable="custom" />
                <el-table-column label="净重" align="center" prop="netWeight" sortable="custom" />
                <el-table-column label="长" align="center" prop="length" sortable="custom" />
                <el-table-column label="宽" align="center" prop="width" sortable="custom" />
                <el-table-column label="高" align="center" prop="height" sortable="custom" />
                <el-table-column label="体积" align="center" prop="volume" sortable="custom" />
                <el-table-column label="采购人编码" align="center" width="150" prop="purchaseByCode" sortable="custom" />
                <el-table-column label="采购人名称" align="center" width="150" prop="purchaseByName" sortable="custom" />
                <el-table-column label="备注" align="center" prop="notes" sortable="custom" />-->
                <el-table-column label="创建人" width="150" align="center" prop="createBy" sortable="custom" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" width="150" align="center" prop="updateBy" sortable="custom" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bas:basMaterial:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bas:basMaterial:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 添加或修改物料主数据对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="basMaterialRef" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="物料编码" prop="materialCode">
                    <el-input v-model.trim="form.materialCode" maxlength="50" placeholder="请输入物料编码" />
                </el-form-item>
                <el-form-item label="物料名称" prop="materialName">
                    <el-input v-model="form.materialName" maxlength="50" placeholder="请输入物料名称" />
                </el-form-item>
                <el-form-item label="规格型号" prop="specs">
                    <el-input v-model.trim="form.specs" maxlength="50" placeholder="请输入规格型号" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model.trim="form.unit" maxlength="50" placeholder="请输入单位" />
                </el-form-item>
                <!-- <el-form-item label="物料类型" prop="materialTypeName">
                    <el-input v-model.trim="form.materialTypeName" maxlength="50" placeholder="请输入物料类型" />
                </el-form-item> -->
                <el-form-item label="物料状态" prop="materialStatus">
                    <el-select v-model="form.materialStatus" placeholder="请选择物料状态">
                        <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 物料导入对话框 -->
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

<script setup name="BasMaterial">
import { listBasMaterial, getBasMaterial, delBasMaterial, addBasMaterial, updateBasMaterial } from "@/api/bas/basMaterial"
import { dropDownListMaterialType } from "@/api/bas/basMaterialType"
import { dropDownListWarehouse } from "@/api/bas/basWarehouse"
import { UploadFilled } from '@element-plus/icons-vue'
import { getToken } from "@/utils/auth"

const { proxy } = getCurrentInstance()
const { sys_yes_no } = proxy.useDict("sys_yes_no")

const showAllSearchTop = ref(false)

const basMaterialList = ref([])
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
const materialTypeList = ref([])
const warehouseList = ref([])

// 导入相关变量
const uploadRef = ref()
// 物料导入参数
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
    url: (window.global_config ? window.global_config["baseUrl"] : "") + "/bas/basMaterial/import",
    // 响应类型设置为blob
    responseType: 'blob'
})

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        materialCode: undefined,
        materialAliasCode: undefined,
        materialName: undefined,
        materialNameEn: undefined,
        materialTypeId: undefined,
        materialTypeCode: undefined,
        materialTypeName: undefined,
        specs: undefined,
        unit: undefined,
        property: undefined,
        packUnit: undefined,
        warehouseId: undefined,
        warehouseCode: undefined,
        warehouseName: undefined,
        pickWarehouseId: undefined,
        pickWarehouseCode: undefined,
        pickWarehouseName: undefined,
        stockFlag: undefined,
        batchFlag: undefined,
        grossWeight: undefined,
        netWeight: undefined,
        length: undefined,
        width: undefined,
        height: undefined,
        volume: undefined,
        materialStatus: undefined,
        purchaseByCode: undefined,
        purchaseByName: undefined,
        notes: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        // 添加排序参数
        orderByColumn: 'id',
        isAsc: 'asc'
    },
    rules: {
        materialCode: [{ required: true, message: "物料编码不能为空", trigger: "blur" }],
        materialName: [{ required: true, message: "物料名称不能为空", trigger: "blur" }],
        specs: [{ required: true, message: "规格型号不能为空", trigger: "charge,blur" }],
        unit: [{ required: true, message: "单位不能为空", trigger: "charge,blur" }],
        materialStatus: [{ required: true, message: "物料状态不能为空", trigger: "charge,blur" }],
    }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询物料主数据列表 */
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
    listBasMaterial(queryParams.value).then(response => {
        basMaterialList.value = response.rows
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
        id: undefined,
        materialCode: undefined,
        materialName: undefined,
        specs: undefined,
        unit: undefined,
        materialStatus: ''
    }

    proxy.resetForm("basMaterialRef")
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

function getaterialTypeList() {
    dropDownListMaterialType().then(response => {
        materialTypeList.value = response.data
    })
}

function getWaredhouseList() {
    dropDownListWarehouse().then(response => {
        warehouseList.value = response.data
    })
}

/** 新增按钮操作 */
function handleAdd() {
    getaterialTypeList()
    getWaredhouseList()
    reset()
    open.value = true
    title.value = "添加物料主数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    getWaredhouseList()
    getaterialTypeList()
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getBasMaterial(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改物料主数据"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["basMaterialRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != undefined) {
                updateBasMaterial(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addBasMaterial(form.value)
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
        .confirm('是否确认删除物料主数据编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delBasMaterial(_ids)
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

/**
 * 下载模板操作
 * 下载物料导入模板文件
 */
function handleDownloadTemplate() {
    proxy.download(
        "bas/basMaterial/importTemplate",
        {},
        `物料导入模板_${new Date().getTime()}.xlsx`
    )
}

/**
 * 导入按钮操作
 * 打开导入对话框
 */
function handleImport() {
    upload.title = "物料导入"
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
        link.download = `物料导入结果_${new Date().getTime()}.xlsx`
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
        "bas/basMaterial/export",
        {
            ...queryParams.value
        },
        `物料主数据_${new Date().getTime()}.xlsx`
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
