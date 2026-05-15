<template>
    <el-dialog :title="props.isEditDialog ? '修改' : '新增'" v-model="props.open" width="900px" append-to-body @close="cancelForm">
        <div class="type_title">基本信息</div>
        <el-form ref="form" :rules="rules" :model="formParam" :inline="true" label-width="120px">
            <el-form-item label="WMS单号">
                <el-input disabled style="display: inline-block" v-model="formParam.docNumber" :placeholder="props.isEditDialog == true ? '请输入' : '自动生成'" clearable />
            </el-form-item>
            <!-- <el-form-item label="盘点方式" prop="way">
                <el-select v-model="formParam.way" placeholder="盘点方式" style="width: 240px">
                    <el-option v-for="dict in dict.type.wms_count_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="盘点方式" prop="way">
                <el-select v-model="formParam.way" placeholder="盘点方式" style="width: 240px">
                    <el-option label="AGV盘点" :value=1 />
                    <el-option label="手动盘点" :value=2 />
                </el-select>
            </el-form-item>
            <el-form-item label="单据类型" prop="docTypeId">
                <el-select v-if="!props.isEditDialog" v-model="formParam.docTypeId" clearable placeholder="请选择" @change="updateDocType">
                    <el-option v-for="(v, i) in basDocTypeList" :label="v.docTypeName" :value="v.id" :key="i"></el-option>
                </el-select>
                <el-input v-else disabled :placeholder="props.selectRowData.docTypeName" />
            </el-form-item>
            <el-form-item label="备注" prop="notes">
                <el-input type="textarea" v-model="formParam.notes" placeholder="请输入" />
            </el-form-item>
        </el-form>
        <div class="type_title">明细信息</div>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5" v-if="currDocTypeCode == 'CNT-MATERIAL'">
                <el-button type="primary" icon="Plus" plain @click="handleAddMaterial">批量添加</el-button>
            </el-col>
            <el-col :span="1.5" v-else>
                <el-button type="primary" icon="Plus" plain @click="handleAddBtn">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" icon="Edit" plain @click="handleEditBtn">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" @click="handleDeleteBtn">删除</el-button>
            </el-col>
        </el-row>
        <!--
                CNT-LOC      库位
                CNT-AREA     库区
                CNT-LE      容器
                CNT-MATERIAL 物料
                -->
        <el-table v-if="currDocTypeCode == 'CNT-LOC'" class="show_checkbox child_table" ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" @row-click="rowClick" border style="width: 100%; cursor: pointer" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="明细行号" align="center" width="150" prop="lineNum" />
            <el-table-column prop="locCode" align="center" :required="true" label="库位编码(必填)" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ tableData[$index].locCode }}</span>
                    <el-select v-if="cur_index === $index" filterable v-model="tableData[$index].locId" placeholder @change="getLocCodeInfo(row.locId, row, $index)">
                        <el-option v-for="item in locCodeList" :label="item.locationCode" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
        <el-table v-if="currDocTypeCode == 'CNT-AREA'" class="show_checkbox" ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" @row-click="rowClick" border style="width: 100%; cursor: pointer" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="明细行号" align="center" width="150" prop="lineNum" />
            <el-table-column prop="areaCode" align="center" :required="true" label="库区编码(必填)" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ tableData[$index].areaCode }}</span>
                    <el-select v-if="cur_index === $index" filterable v-model="tableData[$index].areaId" placeholder @change="getAreaInfo(row.areaId, row, $index)">
                        <el-option v-for="item in areaList" :label="item.areaCode+' | '+item.areaName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="库区名称" prop="areaName" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 容器 -->
        <el-table v-if="currDocTypeCode == 'CNT-LE'" class="show_checkbox" ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" @row-click="rowClick" border style="width: 100%; cursor: pointer" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="明细行号" align="center" width="150" prop="lineNum" />
            <el-table-column prop="leCode" align="center" :required="true" label="容器编码(必填)" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ tableData[$index].leCode }}</span>
                    <el-select v-if="cur_index === $index" filterable v-model="tableData[$index].leId" placeholder @change="getLeCodeInfo(row.leId, row, $index)">
                        <el-option v-for="item in leCodeList" :label="item.leCode" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <!-- <el-table-column label="库区名称" prop="areaName" show-overflow-tooltip></el-table-column> -->
        </el-table>

        <!-- 容器 -->
        <el-table v-if="currDocTypeCode == 'CNT-MATERIAL'" class="show_checkbox" ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" @row-click="rowClick" border style="width: 100%; cursor: pointer" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column label="明细行号" align="center" width="150" prop="lineNum" />
            <el-table-column prop="materialCode" align="center" :required="true" width="200" label="物料编码(必填)" show-overflow-tooltip>
                <template #default="{ row, $index }">
                    <span v-if="cur_index !== $index">{{ materialMap[row.materialId] }}</span>
                    <el-select v-if="cur_index === $index" filterable @change="getMaterialInfo(row.materialId, row, $index)" v-model="tableData[$index].materialId" placeholder>
                        <el-option v-for="item in materialList" :label="item.materialCode + '|' + item.materialName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="物料名称" prop="materialName" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="unit" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格" prop="specs" show-overflow-tooltip></el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button :loading="buttonLoading" type="primary" @click="submitForm('form')">确 定</el-button>
                <el-button @click="cancelForm">取 消</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 批量添加物料抽屉 -->
    <materialListAdd :drawerMaterial="drawerMaterial" @selectList="selectList" @cancelDrawer="cancelDrawer" />
</template>
<script setup>
// 订单详情
import { addCountHeader, updateCountHeader } from "@/api/count/countHeader"
import { listCountDetail } from '@/api/count/countDetail'

// 容器
import { listLogisticsLe } from "@/api/logistics/logisticsLe"
// 物料
import { listBasMaterial } from "@/api/bas/basMaterial"
// 库位
import { listBasLocation } from "@/api/bas/basLocation"
// 库区
import { listBasArea } from "@/api/bas/basArea"
// 单据类型
import { listBasDocType } from "@/api/bas/basDocType"
// 过滤
import { filterKey, filterParams } from "@/utils/index"
// 批量添加物料组件
import materialListAdd from "@/views/components/materialList.vue"

// Vue函数
import { ref, reactive, toRefs, getCurrentInstance, nextTick } from "vue"

const reg = /^\+?[1-9]\d*$/

const { proxy } = getCurrentInstance()

const props = defineProps({
    open: {
        // 参数类型
        type: Boolean,
        // 参数默认值
        default: false
    },
    selectRowData: {
        // 参数类型
        type: Object,
        // 参数默认值
        default: []
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

const materialMap = ref({})
const currDocTypeCode = ref("")
const leCodeList = ref([])
const locCodeList = ref([])
const areaList = ref([])
const materialList = ref([])
const drawerMaterial = ref(false)

// 批量添加物料组件引用
const materialListAddRef = ref()

const data = reactive({
    docList: {
        "CNT-AREA": "areaCode",
        "CNT-LOC": "locCode",
        "CNT-LE": "leCode",
        "CNT-SHELF": "shelfCode",
        "CNT-MATERIAL": "materialCode"
    },
    formParam: {
        way: 1,
        id: "",
        docNumber: "",
        refDocNumber: "",
        docTypeId: "",
        notes: ""
    },

    ParamsDocTypeList: {
        docTypeGroup: "CNT",
        handlerCheck: "Y",
        page: 1
    },


    rules: {
        docTypeId: [
            { required: true, message: "请选择单据类型", trigger: "blur" },
            // { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }
        ],
    }
})

const { ParamsDocTypeList, formParam, rules, docList } = toRefs(data)



const emit = defineEmits(["cancelDialog"])

function cancelForm() {
    emit("cancelDialog", false)
}

/**
 * 取消抽屉操作
 */
const cancelDrawer = () => {
    drawerMaterial.value = false
}


const listBasLeCodePromise = new Promise(reslove => {
    listLogisticsLe()
        .then(response => {
            if (response.code == 200) {
                leCodeList.value = response.rows
            }
        })
        .finally(() => {
            reslove()
        })
})

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

const listBasLocCodePromise = new Promise(reslove => {
    listBasLocation({
        locationType: 'BIN',
        locationStatus: 'Y'
    })
        .then(response => {
            if (response.code == 200) {
                locCodeList.value = response.rows
            }
        })
        .finally(() => {
            reslove()
        })
})

const listBasAreaPromise = new Promise(reslove => {
    listBasArea()
        .then(response => {
            if (response.code == 200) {
                areaList.value = response.rows
            }
        })
        .finally(() => {
            reslove()
        })
})
Promise.all([listBasLeCodePromise, listBasMaterialPromise, listBasLocCodePromise, listBasAreaPromise]).then(() => {
    if (props.isEditDialog) {
        filterKey(formParam.value, props.selectRowData)
        currDocTypeCode.value = props.selectRowData.docTypeCode
        getList()
    }
    getDocType()
})


// 获取订单类型数据
function getDocType() {
    // 获取订单数据
    listBasDocType(ParamsDocTypeList.value).then(response => {
        basDocTypeList.value = response.rows
    })
}

/**
 * 添加新行 - 根据当前单据类型创建相应的空行数据
 */
const handleAddBtn = () => {
    if (!formParam.value.docTypeId) {
        proxy.$modal.msgError("请先选择单据类型")
        return
    }

    maxId.value++

    const obj = {
        tableId: maxId.value,
        detailId: "",
        lineNum: maxId.value
    }

    // 根据单据类型设置相应的字段
    switch (currDocTypeCode.value) {
        case 'CNT-MATERIAL':
            // 物料盘点
            obj.materialId = ""
            obj.materialCode = ""
            obj.materialName = ""
            obj.unit = ""
            obj.specs = ""
            obj.batchCode = ""
            break
        case 'CNT-LOC':
            // 库位盘点
            obj.locId = ""
            obj.locCode = ""
            obj.locationType = ""
            break
        case 'CNT-AREA':
            // 库区盘点
            obj.areaId = ""
            obj.areaCode = ""
            obj.areaName = ""
            break
        case 'CNT-LE':
            // 容器盘点
            obj.leId = ""
            obj.leCode = ""
            break
        default:
            // 默认创建通用空行
            break
    }

    tableData.value.push(obj)
    setTimeout(() => {
        cur_index.value = tableData.value.length - 1
    }, 500)
}

// 批量添加物料
const handleAddMaterial = () => {
    drawerMaterial.value = true
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
            tableId: maxId.value,
            detailId: "",
            materialId: String(material.id),
            materialCode: material.materialCode,
            materialName: material.materialName,
            unit: material.unit,
            specs: material.specs,
            lineNum: maxId.value
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

// 编辑
const handleEditBtn = () => {
    if (multipleSelection.value.length == 0 || multipleSelection.value.length > 1) {
        proxy.$modal.msgError("请选中一条数据")
        return false
    }
    let val = multipleSelection.value[0]
    var n = tableData.value.findIndex((value, index) => {
        return (val.id && val.id == value.id) || (val.detailId && val.detailId == value.detailId)
    })
    if (n != -1) {
        cur_index.value = n
    }
}
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}

const updateDocType = (val) => {
    currDocTypeCode.value = getCode(val)
    // 切换单据类型时清空明细数据
    tableData.value = []
    maxId.value = 0
    cur_index.value = -1
}

const getCode = (id) => {
    var n = basDocTypeList.value.findIndex((value, index) => {
        return value.id == id
    })
    if (n != -1) {
        return basDocTypeList.value[n].docTypeCode
    }
}

// 批量删除
const handleDeleteBtn = () => {
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
                        console.log(v, i)
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
                        else if (val.tableId) {
                            if (val.tableId === v.tableId) {
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
const tableRowClassName = ({ row, rowIndex }) => {
    if (rowIndex === cur_index.value) {
        return "current-row"
    }
    return ""
}

const rowClick = (row, event, column) => {
    let index = tableData.value.indexOf(row)
    cur_index.value = index

    if (column.property == "deel") {
        cur_index.value = null
    }
}
const setTableKey = (dataInfo, docType) => {

    if (docType == "material") {
        tableData.value[cur_index.value].materialId = dataInfo.id
        tableData.value[cur_index.value].materialName = dataInfo.materialName
        tableData.value[cur_index.value].materialCode = dataInfo.materialCode
        tableData.value[cur_index.value].unit = dataInfo.unit
        tableData.value[cur_index.value].specs = dataInfo.specs
    }
    if (docType == "loc") {
        console.log(tableData.value, dataInfo)
        tableData.value[cur_index.value].locId = dataInfo.id
        tableData.value[cur_index.value].locCode = dataInfo.locationCode
        tableData.value[cur_index.value].locationType = dataInfo.locationType
    }
    if (docType == "area") {
        tableData.value[cur_index.value].areaId = dataInfo.id
        tableData.value[cur_index.value].areaCode = dataInfo.areaCode
        tableData.value[cur_index.value].areaName = dataInfo.areaName
    }

    if (docType == "leCode") {
        tableData.value[cur_index.value].leId = dataInfo.id
        tableData.value[cur_index.value].leCode = dataInfo.leCode
    }

    handlBlur()
}

const handlBlur = () => {
    cur_index.value = null
}
// 库位
const getLocCodeInfo = (id) => {
    const dataInfo = locCodeList.value.find(r => {
        return r.id == id
    })
    if (dataInfo != null) {
        setTableKey(dataInfo, "loc")
    }
}
const getAreaInfo = (id) => {
    const dataInfo = areaList.value.find(r => {
        return r.id == id
    })
    if (dataInfo != null) {
        setTableKey(dataInfo, "area")
    }
}
const getLeCodeInfo = (id) => {
    const dataInfo = leCodeList.value.find(r => {
        return r.id == id
    })
    if (dataInfo != null) {
        setTableKey(dataInfo, "leCode")
    }
}

const getMaterialInfo = (id) => {
    const dataInfo = materialList.value.find(r => {
        return r.id == id
    })
    if (dataInfo != null) {
        setTableKey(dataInfo, "material")
    }
}

async function submitForm(form) {
    proxy.$refs[form].validate(valid => {
        if (valid) {
            if (tableData.value.length == 0) {
                proxy.$message.error("当前无数据，请检查")
                return false
            }
            checkTable(currDocTypeCode.value, docList.value[currDocTypeCode.value])
        }
    })
}

const checkTable = (currDocTypeCode, type) => {
    console.log(currDocTypeCode, type)
    for (let i = 0; i < tableData.value.length; i++) {
        if (!tableData.value[i][type]) {
            proxy.$message.error("请检查必填项是否填写完整")
            return false
        }
    }

    let datas = []
    let obj = {}

    for (let i = 0; i < tableData.value.length; i++) {
        if (currDocTypeCode == "CNT-MATERIAL") {
            obj = {
                detailId: "",
                batchCode: "",
                materialId: ""
            }
        }
        if (currDocTypeCode == "CNT-LOC") {
            obj = {
                detailId: "",
                locId: ""
            }
        }
        if (currDocTypeCode == "CNT-AREA") {
            obj = {
                detailId: "",
                areaId: ""
            }
        }
        if (currDocTypeCode == "CNT-LE") {
            obj = {
                detailId: "",
                leId: ""
            }
        }

        filterKey(obj, tableData.value[i])
        datas.push(filterParams(obj))
    }

    let params = {
        ...filterParams(formParam.value),
        countDetailAddBoList: datas
    }

    if (props.isEditDialog) {
        params.id = props.selectRowData.id
        updateCount(params)
    } else {
        addCount(params)
    }
}

/** 查询盘点明细列表 */
function getList() {
    listCountDetail({ headerId: props.selectRowData.id }).then(response => {
        tableData.value = response.rows
    })

}
const updateCount = (params) => {
    updateCountHeader(params)
        .then(response => {
            proxy.$modal.msgSuccess("修改成功")
            cancelForm()
        })
        .finally(() => { })
}
const addCount = (params) => {
    addCountHeader(params)
        .then(response => {
            proxy.$modal.msgSuccess("新增成功")
            cancelForm()
        })
        .finally(() => { })
}

</script>