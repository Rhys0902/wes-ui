<template>
    <div class="p-2">
        <el-drawer v-model="props.drawerMaterial" title="物料选择" size="50%" @close="cancelSelect">
            <div v-show="showSearch" class="mb-[10px]">
                <el-card shadow="hover">
                    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
                        <el-form-item label="物料编码" prop="materialCode">
                            <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="物料名称" prop="materialName">
                            <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
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
                    <!-- <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bas:basMaterial:remove']">删除</el-button>
                </el-col> -->
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>
                <el-table ref="materialTable" v-loading="loading" :data="basMaterialList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="false" /> -->
                    <el-table-column label="物料编码" width="180" align="center" prop="materialCode" :show-overflow-tooltip="true" />
                    <el-table-column label="物料名称" width="200" align="center" prop="materialName" :show-overflow-tooltip="true" />
                    <el-table-column label="物料状态" align="center" prop="materialStatus">
                        <template #default="scope">
                            <dict-tag :options="sys_yes_no" :value="scope.row.materialStatus" />
                        </template>
                    </el-table-column>
                    <el-table-column label="规格型号" width="150" align="center" prop="specs" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" align="center" prop="unit" />
                    <el-table-column label="属性" align="center" prop="property" />
                    <el-table-column label="毛重" align="center" prop="grossWeight" />
                    <el-table-column label="净重" align="center" prop="netWeight" />
                    <el-table-column label="长" align="center" prop="length" />
                    <el-table-column label="宽" align="center" prop="width" />
                    <el-table-column label="高" align="center" prop="height" />
                    <el-table-column label="体积" align="center" prop="volume" />
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
                    <el-form-item label="物料类型" prop="materialTypeName">
                        <el-input v-model.trim="form.materialTypeName" maxlength="50" placeholder="请输入物料类型" />
                    </el-form-item>
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
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitFormSelect">确 定</el-button>
                    <el-button @click="cancelSelect">取 消</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>


<script setup name="BasMaterial">
import { listBasMaterial, getBasMaterial, delBasMaterial, addBasMaterial, updateBasMaterial } from "@/api/bas/basMaterial"
import { dropDownListMaterialType } from "@/api/bas/basMaterialType"
import { dropDownListWarehouse } from "@/api/bas/basWarehouse"

const { proxy } = getCurrentInstance()
const { sys_yes_no } = proxy.useDict("sys_yes_no")

const emit = defineEmits(["cancelDrawer"])

function cancelSelect() {
    emit("cancelDrawer", false)
}

const props = defineProps(["drawerMaterial"])

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
const mutipletionList = ref([])



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
        updateTime: undefined
    },
    rules: {
        materialCode: [{ required: true, message: "物料编码不能为空", trigger: "blur" }],
        materialName: [{ required: true, message: "物料名称不能为空", trigger: "blur" }],
        specs: [{ required: true, message: "规格型号不能为空", trigger: "charge,blur" }],
        unit: [{ required: true, message: "单位不能为空", trigger: "charge,blur" }]

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


// 表单重置
function reset() {
    form.value = {
        id: undefined,
        materialCode: undefined,
        materialName: undefined,
        specs: undefined,
        unit: undefined,
        materialStatus: 'Y'
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
    mutipletionList.value = selection

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
function submitFormSelect() {
    if (mutipletionList.value.length == 0) {
        proxy.$modal.msgError('请先选择物料')
        return
    }
    emit("selectList", mutipletionList.value)
    cancelSelect()
}
/**
 * 监听抽屉弹框状态变化
 * 当弹框关闭时清空多选数据和重置表单
 */
watch(() => props.drawerMaterial, val => {
    console.log('抽屉状态变化:', val)
    if (!val) {
        // 清空多选数据
        mutipletionList.value = []

        // 清空表格选中状态 - 修复引用名称
        nextTick(() => {
            if (proxy.$refs.materialTable) {
                proxy.$refs.materialTable.clearSelection()
            }
        })

        // 重置查询表单
        if (proxy.$refs.queryRef) {
            proxy.resetForm("queryRef")
        }

        // 重置查询参数到初始状态
        Object.assign(queryParams.value, {
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
            updateTime: undefined
        })

        // 重置日期范围
        daterangeCreateTime.value = []
        daterangeUpdateTime.value = []

        // 重置单选和多选状态
        single.value = true
        multiple.value = true
        ids.value = []

        console.log('已清空多选数据和重置表单')
    }
})

getList();

</script>
