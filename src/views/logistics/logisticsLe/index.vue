<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="110px">
                    <el-form-item label="运输编码" prop="leCode">
                        <el-input v-model="queryParams.leCode" placeholder="请输入运输编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="容器类型" prop="leType">
                        <el-select v-model="queryParams.leType" placeholder="请选择容器类型" clearable>
                            <el-option v-for="dict in wes_le_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="容器状态" prop="leStatus">
                        <el-input v-model="queryParams.leStatus" placeholder="请输入容器状态" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="源位置编码" prop="leOriginCode">
                        <el-input v-model="queryParams.leOriginCode" placeholder="请输入源位置编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="当前位置编码" prop="leLocationCode">
                            <el-input v-model="queryParams.leLocationCode" placeholder="请输入当前位置编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="下个位置编码" prop="leNextCode">
                            <el-input v-model="queryParams.leNextCode" placeholder="请输入下个位置编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="目标位置编码" prop="leDestinationCode">
                            <el-input v-model="queryParams.leDestinationCode" placeholder="请输入目标位置编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="容器高度" prop="leHeight">
                            <el-input v-model="queryParams.leHeight" placeholder="请输入容器高度" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="容器重量" prop="leWeight">
                            <el-input v-model="queryParams.leWeight" placeholder="请输入容器重量" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="WMS业务状态" prop="leWmsStatus">
                            <el-input v-model="queryParams.leWmsStatus" placeholder="请输入WMS业务状态" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <!-- <el-form-item label="WMS关联单号" prop="leWmsRefNum">
                            <el-input v-model="queryParams.leWmsRefNum" placeholder="请输入WMS关联单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->
                        <el-form-item label="存储时间" style="width: 320px">
                            <el-date-picker v-model="daterangeLeStorageTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="信息" prop="Information">
                            <el-input v-model="queryParams.Information" placeholder="请输入信息" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['logistics:logisticsLe:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['logistics:logisticsLe:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['logistics:logisticsLe:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Unlock" :disabled="multiple" @click="handleUnbind" v-hasPermi="['logistics:logisticsLe:unbind']">解绑</el-button>
                </el-col>

                <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['logistics:logisticsLe:import']">导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['logistics:logisticsLe:export']">导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Printer" :disabled="multiple" @click="handlePrint" v-hasPermi="['bas:basLocation:print']">打印</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="logisticsLeList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="运输编码" align="center" prop="leCode" width="160px" />
                <el-table-column label="容器类型" align="center" prop="leType" width="120px">
                    <template #default="scope">
                        <dict-tag :options="wes_le_type" :value="scope.row.leType" />
                    </template>
                </el-table-column>
                <el-table-column label="容器状态" align="center" prop="leStatus" width="120px">
                    <template #default="scope">
                        <dict-tag :options="sys_yes_no" :value="scope.row.leStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="源位置编码" align="center" prop="leOriginCode" width="120px" />
                <el-table-column label="当前位置编码" align="center" prop="leLocationCode" width="120px" />
                <el-table-column label="下个位置编码" align="center" prop="leNextCode" width="120px" />
                <el-table-column label="目标位置编码" align="center" prop="leDestinationCode" width="120px" />
                <!-- <el-table-column label="容器高度" align="center" prop="leHeight" width="120px" />
                <el-table-column label="容器重量" align="center" prop="leWeight" /> -->
                <el-table-column label="WMS业务状态" align="center" prop="leWmsStatus" width="120px" />
                <!-- <el-table-column label="WMS关联单号" align="center" prop="leWmsRefNum" width="120px" /> -->
                <el-table-column label="存储时间" align="center" prop="leStorageTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.leStorageTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="信息" align="center" prop="Information" />
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

                <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['logistics:logisticsLe:edit']">修改</el-button>
                     <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['logistics:logisticsLe:remove']">删除</el-button>
                    </template>
                </el-table-column>-->
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 添加或修改托盘对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="logisticsLeRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="容器号" prop="leCode">
                    <el-input v-model="form.leCode" placeholder="请输入托盘编码" />
                </el-form-item>
                <el-form-item label="容器类型" prop="leType">
                    <el-select v-model="form.leType" placeholder="请选择容器类型">
                        <el-option v-for="dict in wes_le_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="容器状态" prop="leStatus">
                    <el-select v-model="form.leStatus" placeholder="请选择托盘状态">
                        <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="源位置编码" prop="leOriginCode">
                    <el-input v-model="form.leOriginCode" placeholder="请输入源位置编码" />
                </el-form-item>
                <el-form-item label="当前位置编码" prop="leLocationCode">
                    <el-input v-model="form.leLocationCode" placeholder="请输入当前位置编码" />
                </el-form-item>

                <el-form-item label="目标位置编码" prop="leDestinationCode">
                    <el-input v-model="form.leDestinationCode" placeholder="请输入目标位置编码" />
                </el-form-item>
                <el-form-item label="托盘高度" prop="leHeight">
                    <el-input v-model="form.leHeight" placeholder="请输入托盘高度" />
                </el-form-item>
                <el-form-item label="托盘重量" prop="leWeight">
                    <el-input v-model="form.leWeight" placeholder="请输入托盘重量" />
                </el-form-item>
                <el-form-item label="WMS业务状态" prop="leWmsStatus">
                    <el-input v-model="form.leWmsStatus" placeholder="请输入WMS业务状态" />
                </el-form-item>
                <el-form-item label="WMS关联单号" prop="leWmsRefNum">
                    <el-input v-model="form.leWmsRefNum" placeholder="请输入WMS关联单号" />
                </el-form-item>
                <el-form-item label="存储时间" prop="leStorageTime">
                    <el-date-picker clearable v-model="form.leStorageTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择存储时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="信息" prop="Information">
                    <el-input v-model="form.Information" placeholder="请输入信息" />
                </el-form-item> -->
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 容器导入对话框 -->
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

<script setup name="LogisticsLe">
import { listLogisticsLe, getLogisticsLe, delLogisticsLe, addLogisticsLe, updateLogisticsLe, print, unbindLogisticsLe } from "@/api/logistics/logisticsLe"
import { UploadFilled } from '@element-plus/icons-vue'
import { getToken } from "@/utils/auth"

const { proxy } = getCurrentInstance()
const { sys_yes_no, wes_logistics_const, wes_le_type } = proxy.useDict("sys_yes_no", "wes_logistics_const", "wes_le_type")

const showAllSearchTop = ref(false)
const logisticsLeList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const multipleSelection = ref([])

const total = ref(0)
const title = ref("")
const daterangeLeStorageTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])

// 导入相关变量
const uploadRef = ref()
// 容器导入参数
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
    url: (window.global_config ? window.global_config["baseUrl"] : "") + "/logistics/logisticsLe/import",
    // 响应类型设置为blob
    responseType: 'blob'
})

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        leCode: undefined,
        leType: undefined,
        leStatus: undefined,
        leOriginId: undefined,
        leOriginCode: undefined,
        leLocationId: undefined,
        leLocationCode: undefined,

        leDestinationId: undefined,
        leDestinationCode: undefined,
        leHeight: undefined,
        leWeight: undefined,
        leWmsStatus: undefined,
        leWmsRefNum: undefined,
        leStorageTime: undefined,
        Information: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询运输容器列表 */
function getList() {
    loading.value = true
    queryParams.value.params = {}
    if (null != daterangeLeStorageTime && "" != daterangeLeStorageTime) {
        queryParams.value.params["beginLeStorageTime"] = daterangeLeStorageTime.value[0]
        queryParams.value.params["endLeStorageTime"] = daterangeLeStorageTime.value[1]
    }
    if (null != daterangeCreateTime && "" != daterangeCreateTime) {
        queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
        queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
    }
    if (null != daterangeUpdateTime && "" != daterangeUpdateTime) {
        queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0]
        queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1]
    }
    listLogisticsLe(queryParams.value).then(response => {
        logisticsLeList.value = response.rows
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
        leCode: null,
        leType: null,
        leStatus: null,
        leOriginCode: null,
        leLocationCode: null,
        leNextCode: null,
        leDestinationCode: null,
        leHeight: null,
        leWeight: null,
        leWmsStatus: null,
        leWmsRefNum: null,
        leStorageTime: null,
        Information: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("logisticsLeRef")
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
    daterangeLeStorageTime.value = []
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
    multipleSelection.value = selection

}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加运输容器"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getLogisticsLe(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改运输容器"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["logisticsLeRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateLogisticsLe(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addLogisticsLe(form.value)
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
        .confirm('是否确认删除运输容器编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delLogisticsLe(_ids)
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
// 容器解绑
function handleUnbind() {
    // 获取选中的容器编码数组
    let les = multipleSelection.value.map(item => item.leCode)
    proxy.$modal
        .confirm(`是否确认解绑容器编号为"${les.join(', ')}"的运输容器？`)
        .then(() => {
            loading.value = true
            return unbindLogisticsLe(les)
        })
        .then(() => {
            getList()
            proxy.$modal.msgSuccess("解绑成功")
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
        .confirm('是否确认打印"' + _ids + '"数据项的容器编码？')
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
 * 下载容器导入模板文件
 */
function handleDownloadTemplate() {
    proxy.download(
        "logistics/logisticsLe/importTemplate",
        {},
        `容器导入模板_${new Date().getTime()}.xlsx`
    )
}

/**
 * 导入按钮操作
 * 打开导入对话框
 */
function handleImport() {
    upload.title = "容器导入"
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
        link.download = `容器导入结果_${new Date().getTime()}.xlsx`
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
        "logistics/logisticsLe/export",
        {
            ...queryParams.value
        },
        `运输容器_${new Date().getTime()}.xlsx`
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
