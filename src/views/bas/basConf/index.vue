<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="参数" prop="param">
                        <el-input v-model="queryParams.param" placeholder="请输入参数" clearable />
                    </el-form-item>
                    <el-form-item label="参数值" prop="value">
                        <el-select v-model="queryParams.value" placeholder="请选择参数值" clearable>
                            <el-option v-for="dict in queryFilteredValueOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="启用状态" prop="enableStatus">
                        <el-select v-model="queryParams.status" placeholder="请选择启用状态" clearable>
                            <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="说明" prop="description">
                        <el-input v-model="queryParams.description" placeholder="请输入说明" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="创建时间" style="width: 320px">
                            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="创建人" prop="createBy">
                            <el-input v-model="queryParams.createBy" placeholder="请输入创建人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="更新时间" style="width: 308px">
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
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <el-card shadow="hover">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bas:basConf:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bas:basConf:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bas:basConf:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bas:basConf:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="basConfList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'ascending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <el-table-column label="参数" align="center" width="180" prop="param" sortable="custom" />
                <el-table-column label="参数值" align="center" width="250" prop="value" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_loc_allocation_strategy_value" :value="scope.row.value" />
                    </template>
                </el-table-column>
                <el-table-column label="启用状态" width="150" align="center" prop="enableStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="sys_yes_no" :value="scope.row.enableStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="说明" align="center" prop="description" sortable="custom" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy" width="150" sortable="custom" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable="custom">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" width="150" sortable="custom" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
                    <template #default="scope">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bas:basConf:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bas:basConf:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 添加或修改配置主数据对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="basConfRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="参数" prop="param">
                    <el-input v-model="form.param" placeholder="请输入参数" :disabled="isEdit" />
                    <!-- <el-select v-model="form.param" placeholder="请选择参数" :disabled="isEdit">
                        <el-option v-for="dict in wes_loc_allocation_strategy_key" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select> -->
                </el-form-item>
                <el-form-item label="参数值" prop="value">
                    <el-select v-model="form.value" style="width:100%" placeholder="请选择参数值">
                        <el-option v-for="dict in filteredValueOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="启用状态" prop="enableStatus">
                    <el-select v-model="form.enableStatus" placeholder="请选择启用状态">
                        <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" prop="description">
                    <el-input v-model="form.description" placeholder="请输入说明" />
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

<script setup name="BasConf">
import { listBasConf, getBasConf, delBasConf, addBasConf, updateBasConf } from "@/api/bas/basConf"

const { proxy } = getCurrentInstance()
const { sys_yes_no } = proxy.useDict("sys_yes_no")
const { wes_loc_allocation_strategy_key } = proxy.useDict("wes_loc_allocation_strategy_key")
const { wes_loc_allocation_strategy_value } = proxy.useDict("wes_loc_allocation_strategy_value")
const showAllSearchTop = ref(false)
const basConfList = ref([])
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
const isEdit = ref(false)

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        param: undefined,
        value: undefined,
        enableStatus: undefined,
        description: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {}
})

const { queryParams, form, rules } = toRefs(data)

// 修改此处：参数值过滤逻辑
const filteredValueOptions = computed(() => {
    if (form.value.param === 'LocAllocationStrategy') {
        return wes_loc_allocation_strategy_value.value.filter(item =>
            ['PRIORITY_FIRST', 'SEQUENTIAL', 'LEAST_OCCUPIED_GANG'].includes(item.value)
        )
    } else if (form.value.param === 'StockAllocationStrategy') {
        return wes_loc_allocation_strategy_value.value.filter(item =>
            ['SATISFY_THE_ORDER', 'ALL_MATCH_THE_ORDER', 'ASSEMBLY_THE_ORDER'].includes(item.value)
        )
    }
    return wes_loc_allocation_strategy_value.value
})

// 修改此处：查询表单的参数值过滤逻辑
const queryFilteredValueOptions = computed(() => {
    if (queryParams.value.param === 'LocAllocationStrategy') {
        return wes_loc_allocation_strategy_value.value.filter(item =>
            ['SEQUENTIAL', 'LEAST_OCCUPIED_GANG'].includes(item.value)
        )
    } else if (queryParams.value.param === 'StockAllocationStrategy') {
        return wes_loc_allocation_strategy_value.value.filter(item =>
            ['SATISFY_THE_ORDER', 'ALL_MATCH_THE_ORDER', 'ASSEMBLY_THE_ORDER'].includes(item.value)

        )
    }
    return wes_loc_allocation_strategy_value.value
})

/** 查询配置主数据列表 */
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
    listBasConf(queryParams.value).then(response => {
        basConfList.value = response.rows
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
        param: null,
        value: null,
        description: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    isEdit.value = false
    proxy.resetForm("basConfRef")
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

/** 新增按钮操作 */
function handleAdd() {
    reset()
    isEdit.value = false
    open.value = true
    title.value = "添加配置主数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getBasConf(_id).then(response => {
        loading.value = false
        form.value = response.data
        isEdit.value = true
        open.value = true
        title.value = "修改配置主数据"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["basConfRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateBasConf(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addBasConf(form.value)
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
        .confirm('是否确认删除配置主数据编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delBasConf(_ids)
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
        "bas/basConf/export",
        {
            ...queryParams.value
        },
        `配置主数据_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
