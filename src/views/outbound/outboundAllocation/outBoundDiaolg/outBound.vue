<template>
    <div>
        <el-table :data="allocationList" ref="multipleTableBind" @selection-change="handleSelectionChange" @row-click="rowClick">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" type="index" width="55" align="center" />
            <el-table-column label="物料编码" align="center" width="180" prop="materialCode" />
            <el-table-column label="物料名称" align="center" width="220" prop="materialName" />
            <!-- <el-table-column label="分配类型" align="center" width="100" prop="allocationType" sortable="custom">
                    <template v-slot="scope">
                        <dict-tag :options="dict.type.wms_allocation_type" :value="scope.row.allocationType" sortable="custom" />
                    </template>
                </el-table-column> -->
            <el-table-column label="容器编码" align="center" width="160" prop="sourceLeCode" />
            <el-table-column label="库位编码" align="center" prop="targetLocCode" width="150" />
            <!-- <el-table-column label="批次编码" align="center" prop="batchCode" /> -->
            <el-table-column label="订单数量" align="center" prop="orderedQty" />
            <el-table-column label="分配数量" align="center" prop="allocatedQty" />
            <el-table-column label="验出数量(必填)" align="center" width="150" :required="true">
                <template v-slot="{ row, $index }">
                    <el-input @input="valueChange(row.confirmQty, row)" v-model="allocationList[$index].confirmQty" placeholder="请输入"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" width="250" :required="true">
                <template v-slot="{ row, $index }">
                    <el-input @input="valueChangeNote(row.notes, row)" v-model="allocationList[$index].notes" placeholder="请输入"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 15px;text-align: end;">

            <el-button @click="submit()" type="primary">确定</el-button>
            <el-button @click="cancel()">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import { listOutboundAllocation, outboundAllocationConfirm } from "@/api/outbound/outboundAllocation"
import { toRefs } from "vue"
const { proxy } = getCurrentInstance()
const { wms_allocation_type } = proxy.useDict("wms_allocation_type")

import { filterKey, filterParams } from "@/utils/index"

const props = defineProps(["paramsLecodeList"])
const emit = defineEmits(["cancelDialog"])


const loading = ref(true)
const datasource = ref([])
const multipleSelection = ([])

const allocationList = ref([])
const cur_index = ref(null)
const alertNotify = ref(null)

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        sourceLeCode: props.paramsLecodeList,
        allocationStatus: "create",
        logisticsStatus: "complete",
        logisticsType: "OUT"

    },

    formParams: {
        leCode: "",
    },
    rules: {
        sourceLeCode: [{ required: true, message: "容器编码不得为空", trigger: "blur" }],
    }
})
const { queryParams, formParams, rules } = toRefs(data)

const initData = async () => {
    let response = null
    if (props.paramsLecodeList != null && props.paramsLecodeList.length > 0) {
        response = await listOutboundAllocation({
            allocationStatus: "create",
            logisticsStatus: "complete", allocationType: "OUT",
            sourceLeCode: props.paramsLecodeList
        })
    } else {
        response = await listOutboundAllocation({ allocationStatus: "create", logisticsStatus: "complete", allocationType: "OUT" })
    }
    if (response.code == 200) {
        allocationList.value = response.rows.map(row => ({
            ...row,
            confirmQty: row.allocatedQty.toString() // 设置验出数量默认等于分配数量
        }))
    }
}
initData()

function getList(headerId) {
    return new Promise(reslove => {
        loading.value = true
        listInboundDetail({
            headerId: headerId
        }).then(response => {
            loading.value = false
            reslove(
                response.rows.map(r => {
                    return {
                        ...r,
                        headerId
                    }
                })
            )
        })
    })
}

function submit() {

    if (allocationList.value.length == 0) {
        proxy.$modal.msgError("当前无数据，请检查")
        return false
    }
    if (!multipleSelection.value || multipleSelection.value.length == 0) {
        proxy.$modal.msgError("请选择一条数据")
        return false
    }

    let params = []

    for (let i = 0; i < multipleSelection.value.length; i++) {
        // 出现选中的数据没有填写验出数量
        if (!multipleSelection.value[i].confirmQty) {
            proxy.$modal.msgError(`序号${i + 1}中存在选中的数据未输入验出数量，请检查`)
            return false
        }
    }
    for (let i = 0; i < multipleSelection.value.length; i++) {
        let obj = {
            id: "",
            confirmQty: "",
            notes: ""
        }
        filterKey(obj, multipleSelection.value[i])
        params.push(filterParams(obj))
    }
    outboundAllocationConfirm(params).then(response => {
        if (response.code === 200) {
            proxy.$modal.msgSuccess("确认出库成功")
            cancel()
        }
    })
}
const rowClick = (row, event, column) => {
    let index = allocationList.value.indexOf(row)
    cur_index.value = index

    if (column.property == "deel") {
        cur_index.value = null
    }
}

function cancel() {
    emit("cancelDialog", false)
}
// 弹框多选的的数据
function handleSelectionChange(selection) {
    multipleSelection.value = selection

}
function valueChange(number, v, index) {
    number = number.replace(/(^\s*)|(\s*$)/g, "")
    const reg = /[^\d]/g
    // 只能是数字不能是其他输入
    number = number.replace(reg, "")
    allocationList.value[cur_index.value].confirmQty = number
}
function valueChangeNote(notes, v, index) {
    allocationList.value[cur_index.value].notes = notes
}
</script>

