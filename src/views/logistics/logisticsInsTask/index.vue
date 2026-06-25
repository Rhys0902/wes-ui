<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="指令编码" prop="instrNum">
                        <el-input v-model="queryParams.instrNum" placeholder="请输入指令编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="指令类型" prop="instrType">
                        <el-select v-model="queryParams.wes_logistics_type" placeholder="请选择指令状态" clearable>
                            <el-option v-for="dict in wes_logistics_const" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="指令状态" prop="instrStatus">
                        <el-select v-model="queryParams.instrStatus" placeholder="请选择指令状态" clearable>
                            <el-option v-for="dict in wes_instr_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="指令优先级" prop="instrPrior">
                        <el-input v-model="queryParams.instrPrior" placeholder="请输入指令优先级" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <!-- <el-form-item label="WMS类型" prop="wmsType">
                        <el-input v-model="queryParams.wmsType" placeholder="请输入WMS类型" clearable @keyup.enter="handleQuery" />
                    </el-form-item> -->
                    <span v-show="showAllSearchTop">
                        <!-- <el-form-item label="订单号" prop="docNum">
                            <el-input v-model="queryParams.docNum" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="订单明细行号" prop="docLineNum" label-width="130px">
                            <el-input v-model="queryParams.docLineNum" placeholder="请输入订单明细行号" clearable @keyup.enter="handleQuery" />
                        </el-form-item> -->

                        <el-form-item label="源位置编码" prop="originLocationCode">
                            <el-input v-model="queryParams.originLocationCode" placeholder="请输入源位置编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="目标位置编码" prop="destinationLocationCode" label-width="130px">
                            <el-input v-model="queryParams.destinationLocationCode" placeholder="请输入目标位置编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>

                        <el-form-item label="运输编码" prop="leCode">
                            <el-input v-model="queryParams.leCode" placeholder="请输入运输编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
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
                            <span style="vertical-align: middle">{{!showAllSearchTop ? '展开':'收起'}}</span>
                            <el-icon style="vertical-align: middle">
                                <ArrowDown v-if="!showAllSearchTop" />
                                <ArrowUp v-else />
                            </el-icon>
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <el-card shadow="never">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['logistics:logisticsInsTask:export']">导出</el-button>
                    <el-button type="primary" :disabled="multiple" plain icon="DocumentChecked" @click="complete(5)">手动异常完成</el-button>
                    <el-button type="success" plain icon="Tickets" @click="handlePutAway">入库申请</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="logisticsInsTaskList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="指令编码" align="center" prop="instrNum" width="150px" />
                <el-table-column label="指令类型" align="center" prop="instrType" width="150px">
                    <template #default="scope">
                        <dict-tag :options="wes_logistics_type" :value="scope.row.instrType" />
                    </template>
                </el-table-column>
                <el-table-column label="指令状态" align="center" prop="instrStatus" width="150px">
                    <template #default="scope">
                        <dict-tag :options="wes_instr_status" :value="scope.row.instrStatus" />
                    </template>
                </el-table-column>
                <!-- <el-table-column label="指令优先级" align="center" prop="instrPrior" width="120px" />
                <el-table-column label="WMS状态" align="center" prop="wmsStatus" width="120px">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.wmsStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="订单号" align="center" prop="docNum" width="120px" />
                <el-table-column label="订单明细行号" align="center" prop="docLineNum" width="120px" /> -->
                <el-table-column label="源位置编码" align="center" prop="originLocationCode" width="120px" />
                <el-table-column label="目标位置编码" align="center" prop="destinationLocationCode" width="120px" />
                <el-table-column label="运输编码" align="center" prop="leCode" width="160px" />
                <el-table-column label="备注" align="center" prop="notes" width="150px" :show-overflow-tooltip="true" />
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
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['logistics:logisticsInsTask:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['logistics:logisticsInsTask:remove']">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>

            <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 添加或修改作业指令对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="logisticsInsTaskRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="指令编码" prop="instrNum">
                    <el-input v-model="form.instrNum" placeholder="请输入指令编码" />
                </el-form-item>
                <el-form-item label="指令类型" prop="instrType">
                    <el-select v-model="form.instrType" placeholder="请选择指令类型">
                        <el-option v-for="dict in wes_logistics_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指令状态" prop="instrStatus">
                    <el-select v-model="form.instrStatus" placeholder="请选择指令状态">
                        <el-option v-for="dict in wes_instr_status" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指令优先级" prop="instrPrior">
                    <el-input v-model="form.instrPrior" placeholder="请输入指令优先级" />
                </el-form-item>
                <!-- <el-form-item label="WMS类型" prop="wmsType">
                    <el-input v-model="form.wmsType" placeholder="请输入WMS类型" />
                </el-form-item>
                <el-form-item label="订单号" prop="docNum">
                    <el-input v-model="form.docNum" placeholder="请输入订单号" />
                </el-form-item>

                <el-form-item label="订单明细行号" prop="docLineNum" label-width="130px">
                    <el-input v-model="form.docLineNum" placeholder="请输入订单明细行号" />
                </el-form-item>-->

                <el-form-item label="源位置编码" prop="originLocationCode">
                    <el-input v-model="form.originLocationCode" placeholder="请输入源位置编码" />
                </el-form-item>

                <el-form-item label="目标位置编码" prop="destinationLocationCode">
                    <el-input v-model="form.destinationLocationCode" placeholder="请输入目标位置编码" />
                </el-form-item>

                <el-form-item label="运输编码" prop="leCode">
                    <el-input v-model="form.leCode" placeholder="请输入运输编码" />
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
        <!-- 入库申请对话框 -->
        <el-dialog title="入库申请" v-model="putAwayOpen" width="400px" append-to-body>
            <el-form ref="putAwayRef" :model="putAwayForm" :rules="putAwayRules" label-width="80px">
                <el-form-item label="容器编码" prop="containerNo">
                    <el-input v-model="putAwayForm.containerNo" placeholder="请输入容器编码" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="putAwayLoading" type="primary" @click="submitPutAway">确 定</el-button>
                    <el-button @click="cancelPutAway">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="LogisticsInsTask">
import { listLogisticsInsTask, getLogisticsInsTask, delLogisticsInsTask, addLogisticsInsTask, updateLogisticsInsTask, logisticsInsTaskComplete, scsPutAwayTask } from "@/api/logistics/logisticsInsTask"

const { proxy } = getCurrentInstance()
const { wes_logistics_const, wes_common_status, wes_instr_status, wes_logistics_type } = proxy.useDict("wes_logistics_const", "wes_common_status", "wes_instr_status", "wes_logistics_type")
const logisticsInsTaskList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const showAllSearchTop = ref(false)
const ids = ref([])
const codeList = ref([])
const single = ref(true)
const multiple = ref(true)
const multipleSelection = ref([])
const total = ref(0)
const title = ref("")
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])

// 入库申请相关变量
const putAwayOpen = ref(false)
const putAwayLoading = ref(false)
const putAwayForm = ref({
    containerNo: ''
})
const putAwayRules = ref({
    containerNo: [{ required: true, message: "容器编码不能为空", trigger: "blur" }]
})

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        instrNum: undefined,
        instrType: undefined,
        instrStatus: undefined,
        instrPrior: undefined,
        wmsType: undefined,
        wmsStatus: undefined,
        docNum: undefined,
        docLineNum: undefined,
        originLocationCode: undefined,
        destinationLocationCode: undefined,
        leCode: undefined,
        notes: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

/** 查询作业指令列表 */
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
    listLogisticsInsTask(queryParams.value).then(response => {
        logisticsInsTaskList.value = response.rows
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
        instrNum: null,
        instrType: null,
        instrStatus: null,
        instrPrior: null,
        wmsType: null,
        wmsStatus: null,
        docNum: null,
        docLineNum: null,
        originLocationCode: null,
        destinationLocationCode: null,
        leCode: null,
        notes: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("logisticsInsTaskRef")
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
    codeList.value = selection.map(item => item.leCode)
    single.value = selection.length != 1
    multiple.value = !selection.length
    multipleSelection.value = selection
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加作业指令"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getLogisticsInsTask(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改作业指令"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["logisticsInsTaskRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateLogisticsInsTask(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addLogisticsInsTask(form.value)
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
        .confirm('是否确认删除作业指令编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delLogisticsInsTask(_ids)
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
        "logistics/logisticsInsTask/export",
        {
            ...queryParams.value
        },
        `作业指令_${new Date().getTime()}.xlsx`
    )
}
function
    complete(status) {
    proxy.$modal
        .confirm(`是否手动异常完成作业指令编码为 ${codeList.value} 的数据项？`)
        .then(() => {
            let params = {}
            let ids = []
            for (let i = 0; i < multipleSelection.value.length; i++) {
                ids.push(multipleSelection.value[i].id)
            }
            params.ids = ids
            params.status = status
            logisticsInsTaskComplete(params).then(response => {
                proxy.$modal.msgSuccess("手动异常完成!")
                getList()
            })
        })
        .catch(() => { })
}

/** 入库申请按钮操作 */
function handlePutAway() {
    putAwayOpen.value = true
    resetPutAway()
}

/** 取消入库申请 */
function cancelPutAway() {
    putAwayOpen.value = false
    resetPutAway()
}

/** 重置入库申请表单 */
function resetPutAway() {
    putAwayForm.value = {
        containerNo: ''
    }
    proxy.resetForm("putAwayRef")
}

/** 提交入库申请 */
function submitPutAway() {
    proxy.$refs["putAwayRef"].validate(valid => {
        if (valid) {
            putAwayLoading.value = true
            scsPutAwayTask(putAwayForm.value)
                .then(response => {
                    proxy.$modal.msgSuccess("入库申请成功")
                    putAwayOpen.value = false
                    getList()
                })
                .catch(error => {

                })
                .finally(() => {
                    putAwayLoading.value = false
                })
        }
    })
}

getList()
</script>
