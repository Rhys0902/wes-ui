<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="库区编码" prop="areaCode">
                        <el-input v-model="queryParams.areaCode" placeholder="请输入库区编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="库区名称" prop="areaName">
                        <el-input v-model="queryParams.areaName" placeholder="请输入库区名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="库区类型" prop="areaType">
                        <el-select v-model="queryParams.areaType" placeholder="请选择库区类型" clearable>
                            <el-option v-for="dict in wes_area_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="库区状态" prop="areaStatus">
                        <el-select v-model="queryParams.areaStatus" placeholder="请选择库区状态" clearable>
                            <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <!-- <el-form-item label="仓库ID" prop="warehouseId">
                            <el-input v-model="queryParams.warehouseId" placeholder="请输入仓库ID" clearable @keyup.enter="handleQuery" />
                        </el-form-item>-->
                        <el-form-item label="仓库编码" prop="warehouseCode">
                            <el-input v-model="queryParams.warehouseCode" placeholder="请输入仓库编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="仓库名称" prop="warehouseName">
                            <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter="handleQuery" />
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
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bas:basArea:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bas:basArea:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bas:basArea:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bas:basArea:export']">导出</el-button>
                </el-col>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="basAreaList" @selection-change="handleSelectionChange" :default-sort="{prop: 'id', order: 'ascending'}" @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" sortable="custom" />
                <el-table-column label="库区编码" align="center" width="150" prop="areaCode" sortable="custom" :show-overflow-tooltip="true" />
                <el-table-column label="库区名称" align="center" width="200" prop="areaName" sortable="custom" :show-overflow-tooltip="true" />
                <el-table-column label="库区类型" align="center" width="150" prop="areaType" sortable="custom" :show-overflow-tooltip="true">
                    <template #default="scope">
                        <dict-tag :options="wes_area_type" :value="scope.row.areaType" />
                    </template>
                </el-table-column>
                <el-table-column label="库区状态" width="150" align="center" prop="areaStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="sys_yes_no" :value="scope.row.areaStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="仓库编码" width="150" align="center" prop="warehouseCode" sortable="custom" :show-overflow-tooltip="true" />
                <el-table-column label="仓库名称" width="180" align="center" prop="warehouseName" sortable="custom" />
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
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bas:basArea:edit']">修改</el-button>
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bas:basArea:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改库区主数据对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="basAreaRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="库区编码" prop="areaCode">
                    <el-input v-model="form.areaCode" placeholder="请输入库区编码" />
                </el-form-item>
                <el-form-item label="库区名称" prop="areaName">
                    <el-input v-model="form.areaName" placeholder="请输入库区名称" />
                </el-form-item>
                <el-form-item label="库区类型" prop="areaType">
                    <el-select v-model="form.areaType" placeholder="请选择库区类型">
                        <el-option v-for="dict in wes_area_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库区状态" prop="areaStatus">
                    <el-select v-model="form.areaStatus" placeholder="请选择库区状态">
                        <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库编码" prop="warehouseId">
                    <el-select v-model="form.warehouseId" style="width: 100%" placeholder="请选择仓库">
                        <el-option v-for="item in warehouseList" :key="item.id" :label="item.warehouseCode+' | '+item.warehouseName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="仓库ID" prop="warehouseId">
                    <el-input v-model="form.warehouseId" placeholder="请输入仓库ID" />
                </el-form-item>
                <el-form-item label="仓库编码" prop="warehouseCode">
                    <el-input v-model="form.warehouseCode" placeholder="请输入仓库编码" />
                </el-form-item>
                <el-form-item label="仓库名称" prop="warehouseName">
                    <el-input v-model="form.warehouseName" placeholder="请输入仓库名称" />
                </el-form-item>-->
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

<script setup name="BasArea">
import { listBasArea, getBasArea, delBasArea, addBasArea, updateBasArea } from "@/api/bas/basArea"
import { dropDownListWarehouse } from "@/api/bas/basWarehouse"
const { proxy } = getCurrentInstance()
const { sys_yes_no, wes_area_type } = proxy.useDict("sys_yes_no", "wes_area_type")
const showAllSearchTop = ref(false)

const basAreaList = ref([])
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
const warehouseList = ref([])

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        areaCode: undefined,
        areaName: undefined,
        areaType: undefined,
        areaStatus: undefined,
        warehouseId: undefined,
        warehouseCode: undefined,
        warehouseName: undefined,
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

/** 查询库区主数据列表 */
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
    listBasArea(queryParams.value).then(response => {
        basAreaList.value = response.rows
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
        areaCode: null,
        areaName: null,
        areaType: null,
        areaStatus: 'Y',
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
    }
    proxy.resetForm("basAreaRef")
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
function getWaredhouseList() {
    dropDownListWarehouse().then(response => {
        warehouseList.value = response.data
    })
}

/** 新增按钮操作 */
function handleAdd() {
    getWaredhouseList()
    reset()
    open.value = true
    title.value = "添加库区主数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
    getWaredhouseList()
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getBasArea(_id).then(response => {
        loading.value = false
        form.value = response.data
        open.value = true
        title.value = "修改库区主数据"
    })
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["basAreaRef"].validate(valid => {
        if (valid) {
            buttonLoading.value = true
            if (form.value.id != null) {
                updateBasArea(form.value)
                    .then(response => {
                        proxy.$modal.msgSuccess("修改成功")
                        open.value = false
                        getList()
                    })
                    .finally(() => {
                        buttonLoading.value = false
                    })
            } else {
                addBasArea(form.value)
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
        .confirm('是否确认删除库区主数据编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delBasArea(_ids)
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
        "bas/basArea/export",
        {
            ...queryParams.value
        },
        `库区主数据_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>
