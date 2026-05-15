<template>
    <el-dialog :title="props.isEditDialog ? '编辑' : '新增'" v-model="props.open" width="80%" append-to-body @close="cancelForm">
        <div class="type_title">基本信息</div>
        <el-form ref="form" :rules="rules" :model="formParam" :inline="true" label-width="100px">
            <el-form-item label="配料编码" prop="burdenCode">
                <el-input v-model="formParam.burdenCode" placeholder="请输入配料编码" clearable />
            </el-form-item>
            <el-form-item label="配料名称" prop="burdenName">
                <el-input v-model="formParam.burdenName" placeholder="请输入配料名称" clearable />
            </el-form-item>
            <el-form-item label="状态" prop="burdenStatus">
                <el-select v-model="formParam.burdenStatus" placeholder="请选择状态" clearable>
                    <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="notes">
                <el-input type="textarea" v-model="formParam.notes" placeholder="请输入" />
            </el-form-item>
        </el-form>
        <div class="type_title">明细信息</div>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" icon="Plus" plain @click="handleAddMaterial">批量添加</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" @click="handleEditBtn" v-hasPermi="['outbound:outboundDetail:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" @click="handleDeleteBtn">删除</el-button>
            </el-col>
            <!-- 新增导入明细按钮 -->
            <!-- <el-col :span="1.5">
                <el-button type="info" plain icon="Upload" @click="handleImportDialog">导入明细</el-button>
            </el-col> -->
        </el-row>
        <!--  在表格后添加物料选择组件 -->
        <materialListAdd :drawerMaterial="drawerMaterial" @selectList="selectList" @cancelDrawer="cancelDrawer" />
        <!-- 表格新增 -->
        <el-table class="show_checkbox" ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" @row-click="rowClick" border style="width: 100%; cursor: pointer" max-height="400" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="明细行号" align="center" prop="lineNum" width="100" />
            <el-table-column prop="materialCode" align="center" width="220" :required="true" label="物料编码(必填)" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ materialMap[row.materialId] }}</span>
                    <el-select v-if="cur_index === $index" filterable @change="getMaterialInfo(row.materialId, row, $index)" v-model="tableData[$index].materialId" placeholder>
                        <el-option v-for="item in materialList" :label="item.materialCode + '|' + item.materialName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="物料名称" prop="materialName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="unit" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="数量(必填)" prop="qty" align="center" :required="true">
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ row.qty }}</span>
                    <el-input tyle="number" @input="valueChange(row.qty, row)" v-if="cur_index == $index" v-model="tableData[$index].qty" placeholder="请输入"></el-input>
                </template>
            </el-table-column>
        </el-table>

        <!-- 使用导入组件 -->
        <!-- <ImportDetailDialog v-model="importDialogVisible" title="导入配料明细" template-file-name="配料明细导入模板.xlsx" :material-list="materialList" :existing-data="tableData" @import-success="handleImportSuccess" /> -->

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
                <el-button @click="cancelForm">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import materialListAdd from "@/views/components/materialList.vue"
import { listBasMaterial } from "@/api/bas/basMaterial"
import { filterKey, filterParams } from "@/utils/index"
import { getBasBurden, addBasBurden, updateBasBurden } from "@/api/bas/basBurden"
// import ImportDetailDialog from "@/components/ImportDetailDialog/index.vue"

const reg = /^\+?[1-9]\d*$/
const { proxy } = getCurrentInstance()
const { sys_yes_no } = proxy.useDict("sys_yes_no")

/**
 * 组件属性定义
 */
const props = defineProps({
    open: {
        // 参数类型
        type: Boolean,
        // 参数默认值
        default: false
    },
    selectRowData: {  // 参数类型
        type: Object,
        // 参数默认值
        default: {}
    },
    isEditDialog: {
        // 参数类型
        type: Boolean,
        // 参数默认值
        default: false
    },
})

const maxId = ref(0)
const tableData = ref([])
const multipleSelection = ref([])
const cur_index = ref(-1)
const buttonLoading = ref(false)
const materialList = ref([])
const materialMap = ref({})
const drawerMaterial = ref(false)

// 导入相关变量
const importDialogVisible = ref(false)

const data = reactive({
    formParam: {
        id: "",
        burdenCode: "",
        burdenName: "",
        burdenStatus: "",
        notes: ""
    },
    rules: {
        burdenCode: [
            { required: true, message: "请输入配料编码", trigger: "blur" },
            { pattern: /^.{1,40}$/, message: "最大长度不超过40" }
        ],
        burdenName: [
            { required: true, message: "请输入配料名称", trigger: "blur" },
            { pattern: /^.{1,100}$/, message: "最大长度不超过100" }
        ],
        burdenStatus: [
            { required: true, message: "请选择状态", trigger: "change" }
        ]
    }
})

const { formParam, rules } = toRefs(data)

const emit = defineEmits(["cancelDialog"])

/**
 * 取消表单操作
 */
function cancelForm() {
    emit("cancelDialog", false)
}

/**
 * 获取物料列表数据
 */
const listBasMaterialPromise = new Promise(reslove => {
    listBasMaterial()
        .then(response => {
            if (response.code == 200) {
                materialList.value = response.rows.map(record => {
                    materialMap.value[record.id + ""] = record.materialCode
                    return {
                        ...record,
                        id: record.id + ""
                    }
                })
            }
        })
        .finally(() => {
            reslove()
        })
})

Promise.all([listBasMaterialPromise]).then(() => {
    if (props.isEditDialog) {
        getList()
        filterKey(formParam.value, props.selectRowData)

    }
})

/**
 * 表格行样式设置
 * @param {Object} param0 - 行数据和索引
 * @returns {String} 样式类名
 */
function tableRowClassName({ row, rowIndex }) {
    if (rowIndex === cur_index.value) {
        return "current-row"
    }
    return ""
}

/**
 * 表格行点击事件
 * @param {Object} row - 行数据
 * @param {Event} event - 事件对象
 * @param {Object} column - 列对象
 */
function rowClick(row, event, column) {
    let index = tableData.value.indexOf(row)
    cur_index.value = index

    if (column.property == "deel") {
        cur_index.value = null
    }
}
/**
 * 获取出库明细列表
 */
function getList() {
    getBasBurden(props.selectRowData.id).then(response => {
        // 假设返回的数据中包含配料明细数据
        tableData.value = response.data.detailList
            || []
    })
}



/**
 * 处理失焦事件
 */
function handlBlur() {
    cur_index.value = null
}

/**
 * 点击新增更多
 */
function handleAddBtn() {
    maxId.value++
    const obj = {}
    obj.id = ""
    obj.detailId = ""
    obj.qty = ""
    obj.materialId = ""
    obj.materialCode = ""
    obj.id = maxId.value
    tableData.value.push(obj)
    setTimeout(() => {
        cur_index.value = tableData.value.length - 1
    }, 500)
}

/**
 * 打开导入弹框
 */
const handleImportDialog = () => {
    importDialogVisible.value = true
}

/**
 * 处理导入成功事件
 * @param {Object} result - 导入结果
 */
const handleImportSuccess = (result) => {
    const { importedData } = result

    // 批量添加导入的数据到表格
    importedData.forEach(item => {
        maxId.value++
        tableData.value.push({
            id: maxId.value,
            detailId: "",
            ...item
        })
    })

    // 批量更新物料映射
    const newMaterialMap = {}
    importedData.forEach(item => {
        newMaterialMap[item.materialId] = item.materialCode
    })
    Object.assign(materialMap.value, newMaterialMap)
}

/**
 * 确认提交表单
 * @param {String} form - 表单引用名称
 */
function submitForm(form) {
    proxy.$refs[form].validate(valid => {
        if (valid) {
            // 检查表格数据
            if (tableData.value.length == 0) {
                proxy.$modal.msgError("请至少添加一条物料明细")
                return false
            }

            // 验证表格数据
            for (let i = 0; i < tableData.value.length; i++) {
                if (!tableData.value[i].materialCode || !tableData.value[i].qty) {
                    proxy.$modal.msgError("请检查必填项是否填写完整")
                    return
                }
            }

            // 准备明细数据
            let detailList = []
            for (let i = 0; i < tableData.value.length; i++) {
                let obj = {
                    qty: Number(tableData.value[i].qty),
                    materialCode: tableData.value[i].materialCode,
                    materialId: tableData.value[i].materialId

                }
                // 如果是编辑模式且有明细ID，则添加明细ID
                if (props.isEditDialog && tableData.value[i].id != null) {
                    obj.id = tableData.value[i].id
                }
                detailList.push(obj)
            }

            // 准备提交参数
            let params = {
                ...filterParams(formParam.value),
                detailList: detailList
            }

            // 根据模式调用不同接口
            if (props.isEditDialog) {
                params.id = props.selectRowData.id
                updateBasBurden(params)
                    .then(response => {
                        proxy.$message.success("修改成功")
                        cancelForm()
                    })
                    .catch(error => {
                        proxy.$modal.msgError("修改失败：" + error.message)
                    })
            } else {
                addBasBurden(params)
                    .then(response => {
                        proxy.$message.success("新增成功")
                        cancelForm()
                    })
                    .catch(error => {
                        proxy.$modal.msgError("新增失败：" + error.message)
                    })
            }
        }
    })
}



/**
 * 获取物料信息
 * @param {String} id - 物料ID
 * @param {Object} v - 行数据
 * @param {Number} index - 行索引
 */
const getMaterialInfo = (id, v, index) => {
    const targetMaterialCode = materialList.value.find(r => {
        return r.id == id
    })
    if (targetMaterialCode != null) {
        tableData.value[index].materialCode = targetMaterialCode.materialCode
        tableData.value[index].materialName = targetMaterialCode.materialName
        tableData.value[index].unit = targetMaterialCode.unit
    }
}

/**
 * 数量输入值变化处理
 * @param {String} qty - 数量
 * @param {Object} v - 行数据
 */
function valueChange(qty, v) {
    qty = qty.replace(/(^\s*)|(\s*$)/g, "")
    const reg = /[^\d]/g
    // 只能是数字，不能是其他输入
    qty = qty.replace(reg, "")
    tableData.value[cur_index.value].qty = qty
}

/**
 * 编辑按钮处理
 */
function handleEditBtn() {
    if (multipleSelection.value.length == 0 || multipleSelection.value.length > 1) {
        proxy.$modal.msgError("请选中一条数据")
        return false
    }
    let val = multipleSelection.value
    var n = tableData.value.findIndex((value, index) => {
        return (val.id && val.id == value.id) || (val.detailId && val.detailId == value.detailId)
    })
    if (n != -1) {
        cur_index.value = n
    }
}

/**
 * 批量删除
 */
function handleDeleteBtn() {
    if (multipleSelection.value.length == 0) {
        proxy.$modal.msgError("请选中一条数据")
        return false
    }
    let val = multipleSelection.value
    proxy.$modal.confirm("确定删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--orange",
        type: "warning"
    })
        .then(() => {
            //如果选中数据存在
            if (val) {
                //将选中数据遍历
                val.forEach((val, index) => {
                    //遍历源数据
                    tableData.value.forEach((v, i) => {
                        //如果选中数据和源数据的某一条唯一标识符相等，删除对应的源数据
                        if (val.id) {
                            if (val.id === v.id) {
                                tableData.value.splice(i, 1)
                            }
                        } else if (val.detailId) {
                            if (val.detailId === v.detailId) {
                                tableData.value.splice(i, 1)
                            }
                        }
                    })
                })
            }
            multipleTable.value.clearSelection()
        })
        .catch(() => { })
}

/**
 * 表格选择变化处理
 * @param {Array} val - 选中的行数据
 */
function handleSelectionChange(val) {
    multipleSelection.value = val
}

/**
 * 打开物料批量选择抽屉
 */
const handleAddMaterial = () => {
    drawerMaterial.value = true
}

/**
 * 关闭物料选择抽屉
 */
const cancelDrawer = () => {
    drawerMaterial.value = false
}

/**
 * 优化物料选择列表数据处理
 * @param {Array} selection - 选中的物料数据数组
 */
const selectList = (selection) => {
    if (!selection?.length) return

    // 批量创建新行数据
    const newRows = selection.map(material => {
        maxId.value++
        return {
            id: maxId.value,
            detailId: "",
            qty: "",
            materialId: String(material.id),
            materialCode: material.materialCode,
            materialName: material.materialName,
            unit: material.unit
        }
    })

    // 一次性添加所有行，减少响应式更新次数
    tableData.value.push(...newRows)

    // 批量更新物料映射
    const newMaterialMap = {}
    selection.forEach(material => {
        newMaterialMap[String(material.id)] = material.materialCode
    })
    Object.assign(materialMap.value, newMaterialMap)

    drawerMaterial.value = false

    // 使用 nextTick 确保 DOM 更新后再设置编辑状态
    nextTick(() => {
        if (selection.length > 0) {
            cur_index.value = tableData.value.length - 1
        }
    })
}
</script>

<style scoped>
.text-danger {
    color: #ff4d4f;
}

.mb8 {
    margin-bottom: 8px;
}

.type_title {
    font-size: 14px;
    font-weight: bold;
    color: #1f2329;
    margin: 10px 0;
    padding-left: 5px;
    border-left: 3px solid #409eff;
}

/* 对话框底部样式 */
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 12px;
}

.dialog-footer .el-button {
    min-width: 70px;
}
</style>
