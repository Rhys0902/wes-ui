<template>
    <el-dialog :title="props.isEditDialog ? '编辑' : '新增'" v-model="props.open" width="1000px" append-to-body @close="cancelForm">
        <div class="type_title">基本信息</div>
        <el-form ref="form" :rules="rules" :model="formParam" :inline="true" label-width="100px">
            <el-form-item label="WMS单号">
                <el-input disabled style="display: inline-block" v-model="formParam.docNumber" :placeholder="props.isEditDialog == true ? '请输入' : '自动生成'" clearable />
            </el-form-item>
            <el-form-item label="单据类型" prop="docTypeId">
                <el-select v-if="!props.isEditDialog" v-model="formParam.docTypeId" clearable placeholder="请选择">
                    <el-option v-for="(v, i) in basDocTypeList" :label="v.docTypeName" :value="v.id" :key="i"></el-option>
                </el-select>
                <el-input v-else disabled :placeholder="props.selectRowData.docTypeName" />
            </el-form-item>
            <el-form-item label="出库方式" prop="way">
                <el-select v-model="formParam.way" placeholder="请选择">
                    <el-option label="AGV搬运" value="1"></el-option>
                    <el-option label="人工搬运" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预期时间" prop="expectedTime">
                <el-date-picker v-model="formParam.expectedTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择预期时间" style="width: 100%" />
            </el-form-item>
            <el-form-item label="周期(天)" prop="cycle">
                <el-input v-model="formParam.cycle" placeholder="请输入周期天数" clearable />
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
            <el-col :span="1.5">
                <el-button type="info" plain icon="Upload" @click="handleImportDialog">导入明细</el-button>
            </el-col>
        </el-row>

        <!--  在表格后添加物料选择组件 -->
        <materialListAdd :drawerMaterial="drawerMaterial" @selectList="selectList" @cancelDrawer="cancelDrawer" />
        <!-- 表格新增 -->
        <el-table class="show_checkbox" ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" @row-click="rowClick" border style="width: 100%; cursor: pointer" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="明细行号" align="center" prop="lineNum" width="100" />
            <el-table-column prop="materialCode" align="center" :required="true" label="物料编码(必填)" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ materialMap[row.materialId] }}</span>
                    <el-select v-if="cur_index === $index" filterable @change="getMaterialInfo(row.materialId, row, $index)" v-model="tableData[$index].materialId" placeholder>
                        <el-option v-for="item in materialList" :label="item.materialCode + '|' + item.materialName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="物料名称" prop="materialName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="unit" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="订单数量(必填)" prop="orderedQty" align="center" :required="true">
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ row.orderedQty }}</span>
                    <el-input tyle="number" @input="valueChange(row.orderedQty, row)" v-if="cur_index == $index" v-model="tableData[$index].orderedQty" placeholder="请输入"></el-input>
                </template>
            </el-table-column>
            <!-- <el-table-column label="批次编码" prop="batchCode" align="center" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ row.batchCode }}</span>
                    <el-input v-if="cur_index == $index" v-model.trim="tableData[$index].batchCode" placeholder="请输入"></el-input>
                </template>
            </el-table-column> -->
        </el-table>

        <!-- 使用导入组件 -->
        <ImportDetailDialog v-model="importDialogVisible" title="导入出库明细" template-file-name="出库明细导入模板.xlsx" :material-list="materialList" :existing-data="tableData" @import-success="handleImportSuccess" />

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
import { listBasDocType } from "@/api/bas/basDocType"
import { filterKey, filterParams } from "@/utils/index"
import { outboundHeaderAdd, outboundHeaderEdit } from "@/api/outbound/outboundHeaderDetail"
import { listOutboundDetail } from "@/api/outbound/outboundDetail"
import ImportDetailDialog from "@/components/ImportDetailDialog/index.vue"

const reg = /^\+?[1-9]\d*$/
const { proxy } = getCurrentInstance()

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
const basDocTypeList = ref([])
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
        docNumber: "",
        refDocNumber: "",
        docTypeId: "",
        expectedTime: "",
        cycle: "",
        notes: "",
        way: "1"
    },
    ParamsDocTypeList: {
        docTypeGroup: "OUT",
        handlerCheck: "Y",
        page: 1
    },
    rules: {
        docTypeId: [
            { required: true, message: "请选择单据类型", trigger: "blur" },
        ],
        refDocNumber: [
            { required: false, message: "请输入", trigger: "blur" },
            { pattern: /^.{1,40}$/, message: "最大长度不超过40" }
        ],
        submitTime: [{ required: false, message: "请输入", trigger: "blur" }]
    }
})

const { ParamsDocTypeList, formParam, rules } = toRefs(data)

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
        // 将way字段转换为字符串
        if (formParam.value.way !== undefined && formParam.value.way !== null) {
            formParam.value.way = String(formParam.value.way)
        }
    } else {
        getDocType()
    }
})

/**
 * 获取订单类型数据
 */
function getDocType() {
    listBasDocType(ParamsDocTypeList.value).then(response => {
        basDocTypeList.value = response.rows
    })
}

/**
 * 获取出库明细列表
 */
function getList() {
    listOutboundDetail({
        headerId: props.selectRowData.id
    }).then(response => {
        for (let i = 0; i < response.rows.length; i++) {
            response.rows[i].orderedQty = Number(response.rows[i].orderedQty)
        }
        tableData.value = response.rows
    })
}

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
    // obj.batchCode = ""
    obj.orderedQty = ""
    obj.materialId = ""

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
            if (tableData.value.length == 0) {
                proxy.$modal.msgError("当前无数据，请检查")
                return false
            }

            for (let i = 0; i < tableData.value.length; i++) {
                if (!tableData.value[i].materialCode || !tableData.value[i].orderedQty) {
                    proxy.$modal.msgError("请检查必填项是否填写完整")
                    return
                }
                if (!tableData.value[i].orderedQty || (tableData.value[i].orderedQty && !reg.test(tableData.value[i].orderedQty))) {
                    proxy.$modal.msgError("请检查所添加的数量格式是否正确")
                    return
                }
            }

            let datas = []
            for (let i = 0; i < tableData.value.length; i++) {
                let obj = {
                    // batchCode: "",
                    orderedQty: "",
                    materialId: ""
                }
                filterKey(obj, tableData.value[i])
                obj.orderedQty = Number(tableData.value[i].orderedQty)
                if (props.isEditDialog && tableData.value[i].id != null) {
                    obj.detailId = tableData.value[i].id
                }
                datas.push(obj)
            }
            let params = {
                ...filterParams(formParam.value),
                outboundDetailAddBoList: datas
            }
            if (props.isEditDialog) {
                params.id = props.selectRowData.id
                outboundUpdate(params)
            } else {
                outboundAdd(params)
            }
        }
    })
}

/**
 * 新增出库单
 * @param {Object} params - 参数对象
 */
function outboundAdd(params) {
    outboundHeaderAdd(params)
        .then(response => {
            proxy.$message.success("新增成功")
            cancelForm()
        })
        .finally(() => {
            buttonLoading.value = false
        })
}

/**
 * 更新出库单
 * @param {Object} params - 参数对象
 */
function outboundUpdate(params) {
    outboundHeaderEdit(params)
        .then(response => {
            proxy.$message.success("修改成功")
            cancelForm()
        })
        .finally(() => { })
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
 * @param {String} orderedQty - 订单数量
 * @param {Object} v - 行数据
 */
function valueChange(orderedQty, v) {
    orderedQty = orderedQty.replace(/(^\s*)|(\s*$)/g, "")
    const reg = /[^\d]/g
    // 只能是数字，不能是其他输入
    orderedQty = orderedQty.replace(reg, "")
    tableData.value[cur_index.value].orderedQty = orderedQty
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
            // batchCode: "",
            orderedQty: "",
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
