<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="调用方" prop="fromSystem">
                        <el-input v-model="queryParams.fromSystem" placeholder="请输入调用方" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="提供方" prop="destSystem">
                        <el-input v-model="queryParams.destSystem" placeholder="请输入提供方" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="入参" prop="requestData">
                        <el-input v-model="queryParams.requestData" placeholder="请输入入参" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="返参" prop="responseData">
                        <el-input v-model="queryParams.responseData" placeholder="请输入返参" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="接口编码" prop="apiCode">
                            <el-input v-model="queryParams.apiCode" placeholder="请输入接口编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="接口名称" prop="apiName">
                            <el-input v-model="queryParams.apiName" placeholder="请输入接口名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="接口成功失败标记" prop="resultFlag" label-width="130px">
                            <el-select v-model="queryParams.resultFlag" placeholder="请选择接口成功失败标记" clearable>
                                <el-option v-for="dict in wes_result_const" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="异步状态" prop="asyncStatus">
                            <el-select v-model="queryParams.asyncStatus" placeholder="请选择异步状态" clearable>
                                <el-option v-for="dict in wes_async_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="最新更新时间" style="width: 370px" label-width="130px">
                            <el-date-picker v-model="daterangeLastUpdateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="queryParams.notes" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
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
                <!--  <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['history:hisConnApi:add']">新增</el-button>
                </el-col>
              <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['history:hisConnApi:edit']">修改</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['history:hisConnApi:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['history:hisConnApi:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="hisConnApiList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150px">
                    <template #default="scope">
                        <el-button link type="primary" icon="View" @click="handleView(scope.row)">详细</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="调用方" align="center" prop="fromSystem" />
                <el-table-column label="提供方" align="center" prop="destSystem" />
                <el-table-column label="入参" align="center" prop="requestData" />
                <el-table-column label="返参" align="center" prop="responseData" />
                <el-table-column label="接口编码" align="center" width="150" prop="apiCode" />
                <el-table-column label="接口名称" align="center" width="150" prop="apiName" />
                <el-table-column label="接口成功失败标记" align="center" width="150" prop="resultFlag">
                    <template #default="scope">
                        <dict-tag :options="wes_result_const" :value="scope.row.resultFlag" />
                    </template>
                </el-table-column>
                <el-table-column label="异步状态" align="center" prop="asyncStatus">
                    <template #default="scope">
                        <dict-tag :options="wes_async_status" :value="scope.row.asyncStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="最新更新时间" width="200" align="center" prop="lastUpdateTime" />
                <el-table-column label="备注" align="center" prop="notes" />
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
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['history:hisConnApi:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['history:hisConnApi:remove']">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改外部接口数据历史对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="hisConnApiRef" :model="form" :rules="rules" label-width="130px">
                <el-form-item label="调用方" prop="fromSystem">
                    <el-input v-model="form.fromSystem" placeholder="请输入调用方" />
                </el-form-item>
                <el-form-item label="提供方" prop="destSystem">
                    <el-input v-model="form.destSystem" placeholder="请输入提供方" />
                </el-form-item>
                <el-form-item label="入参" prop="requestData">
                    <el-input v-model="form.requestData" type="textarea" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="返参" prop="responseData">
                    <el-input v-model="form.responseData" type="textarea" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="接口编码" prop="apiCode">
                    <el-input v-model="form.apiCode" placeholder="请输入接口编码" />
                </el-form-item>
                <el-form-item label="接口名称" prop="apiName">
                    <el-input v-model="form.apiName" placeholder="请输入接口名称" />
                </el-form-item>
                <el-form-item label="接口成功失败标记" prop="resultFlag">
                    <el-select v-model="form.resultFlag" placeholder="请选择接口成功失败标记">
                        <el-option v-for="dict in wes_result_const" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="异步状态" prop="asyncStatus">
                    <el-select v-model="form.asyncStatus" placeholder="请选择异步状态">
                        <el-option v-for="dict in wes_result_const" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="最新更新时间" prop="lastUpdateTime">
                    <el-input v-model="form.lastUpdateTime" placeholder="请输入最新更新时间" />
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

        <!-- 外部接口数据历史详细对话框 -->
        <el-dialog :title="'外部接口数据历史详细'" v-model="viewOpen" width="800px" append-to-body>
            <el-form :model="viewForm" label-width="140px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="调用方：">{{ viewForm.fromSystem }}</el-form-item>
                        <el-form-item label="接口编码：">{{ viewForm.apiCode }}</el-form-item>
                        <el-form-item label="接口成功失败标记：">
                            <dict-tag :options="wes_result_const" :value="viewForm.resultFlag" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提供方：">{{ viewForm.destSystem }}</el-form-item>
                        <el-form-item label="接口名称：">{{ viewForm.apiName }}</el-form-item>
                        <el-form-item label="异步状态：">
                            <dict-tag :options="wes_async_status" :value="viewForm.asyncStatus" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间：">{{ viewForm.createTime }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求参数：">
                            <json-viewer v-if="viewForm.requestData && isValidJson(viewForm.requestData)" :value="JSON.parse(viewForm.requestData)" :boxed="true" :expand-depth="2" :copyable="{
                                    copyText: '复制',
                                    copiedText: '复制成功!',
                                    timeout: 2000,
                                }" theme="my-awesome-json-theme">
                            </json-viewer>
                            <div v-else class="json-error">
                                {{ viewForm.requestData || '无参数数据' }}
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="返回参数：">
                            <json-viewer v-if="viewForm.responseData && isValidJson(viewForm.responseData)" :value="JSON.parse(viewForm.responseData)" :boxed="true" :expand-depth="2" :copyable="{
                                    copyText: '复制',
                                    copiedText: '复制成功!',
                                    timeout: 2000,
                                }" theme="my-awesome-json-theme">
                            </json-viewer>
                            <div v-else class="json-error">
                                {{ viewForm.responseData || '无返回数据' }}
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="viewCancel">关 闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.json-error {
    padding: 10px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #666;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
}
</style>

<script setup name="HisConnApi">
import { listHisConnApi, getHisConnApi, delHisConnApi, addHisConnApi, updateHisConnApi } from "@/api/history/hisConnApi"
import JsonViewer from 'vue-json-viewer'
import "vue-json-viewer/style.css"

const { proxy } = getCurrentInstance()
const showAllSearchTop = ref(false)

const { wes_result_const, wes_async_status } = proxy.useDict("wes_result_const", "wes_async_status")

const hisConnApiList = ref([])
const open = ref(false)
const viewOpen = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const viewForm = ref({})
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])
const daterangeLastUpdateTime = ref([])

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        fromSystem: undefined,
        destSystem: undefined,
        requestData: undefined,
        responseData: undefined,
        apiCode: undefined,
        apiName: undefined,
        resultFlag: undefined,
        asyncStatus: undefined,
        lastUpdateTime: undefined,
        notes: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询外部接口数据历史列表 */
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
    if (null != daterangeLastUpdateTime && "" != daterangeLastUpdateTime) {
        queryParams.value.params["beginLastUpdateTime"] = daterangeLastUpdateTime.value[0]
        queryParams.value.params["endLastUpdateTime"] = daterangeLastUpdateTime.value[1]
    }
    listHisConnApi(queryParams.value).then(response => {
        hisConnApiList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}

// 取消按钮
function cancel() {
    open.value = false
    reset()
}

// 查看详细按钮操作
function handleView(row) {
    viewOpen.value = true
    getHisConnApi(row.id).then(response => {
        viewForm.value = response.data
    })
}

// 关闭详细对话框
function viewCancel() {
    viewOpen.value = false
}

/**
 * 验证字符串是否为有效的JSON格式
 * @param {string} str - 需要验证的字符串
 * @returns {boolean} - 是否为有效JSON
 */
function isValidJson(str) {
    if (!str || typeof str !== 'string') {
        return false
    }
    try {
        JSON.parse(str)
        return true
    } catch (e) {
        return false
    }
}

// 表单重置
function reset() {
    form.value = {
        id: null,
        version: null,
        fromSystem: null,
        destSystem: null,
        requestData: null,
        responseData: null,
        apiCode: null,
        apiName: null,
        resultFlag: null,
        asyncStatus: null,
        lastUpdateTime: null,
        notes: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("hisConnApiRef")
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
    daterangeLastUpdateTime.value = []
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
    title.value = "添加外部接口数据历史"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getHisConnApi(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改外部接口数据历史"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["hisConnApiRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateHisConnApi(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addHisConnApi(form.value)
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
        .confirm('是否确认删除外部接口数据历史编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delHisConnApi(_ids)
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
        "history/hisConnApi/export",
        {
            ...queryParams.value
        },
        `外部接口数据历史_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
