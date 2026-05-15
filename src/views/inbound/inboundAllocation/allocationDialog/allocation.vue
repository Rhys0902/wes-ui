<template>
    <div>
        <el-table :data="tableData" @selection-change="handleSelectionChildren" style="width: 100%">
            <el-table-column type="selection" width="55" align="center" />
            <!-- <el-table-column type="index" width="55" align="center" /> -->
            <el-table-column type="expand">
                <template #default="props">
                    <div style="padding: 10px">
                        <el-table :cell-style="{ background: '#eff0ff' }" :header-cell-style="{ background: '#eff0ff' }" :data="props.row.children">
                            <el-table-column label="订单号" align="center" width="180" prop="docNumber" />
                            <el-table-column label="单据类型" align="center" width="180" prop="docTypeName" />
                            <!-- <el-table-column label="库区编码" align="center" prop="lotAttr01" /> -->
                            <el-table-column label="物料编码" align="center" width="180" prop="materialCode" />
                            <el-table-column label="物料名称" align="center" width="220" prop="materialName" />
                            <el-table-column label="订单数量" align="center" prop="orderedQty" />
                            <el-table-column label="分配数量" align="center" prop="allocatedQty" />
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="容器编码" align="center" width="160" prop="leCode" />
            <el-table-column label="接驳台" align="center" prop="dockStation" />
        </el-table>
        <div style="margin-top: 15px;text-align: end;">
            <el-button @click="cancel()">取消</el-button>
            <el-button @click="submitForm()" type="primary">确定</el-button>
        </div>
    </div>
</template>
<script setup>
import { listInboundAllocation, inboundAllocationPutAway } from '@/api/inbound/inboundAllocation'
import { listBasLocation } from '@/api/bas/basLocation'
import { ElNotification } from 'element-plus'

import _ from 'lodash'

const { proxy } = getCurrentInstance()
const emit = defineEmits(["cancelDialog"])
function cancelDialog() {
    emit('cancelDialog', false)
}

const props = defineProps({
    open: {
        // 参数类型
        type: Boolean,
        // 参数默认值
        default: false
    },
    paramsLecodeList: {
        // 参数类型
        type: String,
        // 参数默认值
        default: ''
    }
})
const inboundAllocationList = ref([])
const alertNotify = ref(null)
const basLocationList = ref([])
const tableData = ref([]) //标准数据结构为 [{children:[]}]
const multipleSelection = ref([])

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        allocationStatus: 'create',
        logisticsStatus: 'create',
        leCode: undefined
    },
})

const { queryParams } = toRefs(data)

async function init() {
    listBasLocation({ locationStatus: 'Y' }).then((response) => {
        if (response.code == 200) {
            basLocationList.value = response.rows.filter((item) => {
                return item.locationType == "STATION"
            })
        }
    })
    let response = null
    if (props.paramsLecodeList != null && props.paramsLecodeList.length > 0) {
        response = await listInboundAllocation({ allocationStatus: 'create', logisticsStatus: 'create', leCode: props.paramsLecodeList })
    } else {
        response = await listInboundAllocation({ allocationStatus: 'create', logisticsStatus: 'create' })
    }
    if (response.code == 200) {

        const leCodeMap = _.groupBy(response.rows, 'leCode')
        const data = Object.keys(leCodeMap).map((lecode) => {
            return {
                children: leCodeMap[lecode],
                leCode: lecode,
                dockStation: leCodeMap[lecode][0].sourceLocCode,
            }
        })
        tableData.value = data
    }
}

// 取消
function cancel() {
    emit('cancelDialog', false)
}
function goToLogisticsInsTask() {
    cancel()
    if (alertNotify.value) {
        alertNotify.value.close()
    }
    proxy.$router.push({
        name: 'LogisticsInsTask',
    })
}
// 多选框选中数据
function handleSelectionChildren(selection) {
    multipleSelection.value = selection.filter(row => row.children?.length > 0)
}

// 确认上架
function submitForm() {
    if (!multipleSelection.value || multipleSelection.value.length === 0) {
        proxy.$modal.msgError("请选择相关数据")
        return
    }

    let flag = false
    const params = multipleSelection.value.map((r) => {

        if (!r.dockStation) {
            flag = true
        }
        return {
            // type: r.type,
            leCode: r.leCode,
            dockStation: r.dockStation,
        }
    })

    if (flag) {
        proxy.$modal.msgError('请完整填写数据表单')
        return
    }

    proxy.$modal.confirm("是否确认上架表格中选中的数据项？").then(() => {
        inboundAllocationPutAway(params).then((response) => {
            if (response.code === 200) {
                alertNotify.value = ElNotification({
                    title: "温馨提示",
                    dangerouslyUseHTMLString: true,
                    message: `<div>下发上架指令成功!可前往<span style="color: #3d5cff; cursor: pointer;">作业指令</span> 页面中查看详情<div>`,
                    type: "success",
                    duration: 3000,
                    position: 'top-right',
                    customClass: 'work-notify',
                    onClick() {
                        goToLogisticsInsTask()
                    },
                })
                cancel()
            }
        })
    })


}

/** 查询入库分配明细列表 */
function getList() {
    listInboundAllocation(queryParams.value).then((response) => {
        inboundAllocationList.value = response.rows
        if (inboundAllocationList.value.length == 0) {
            proxy.$modal.info('无相关上架数据')
        }
        total.value = response.total
    })
}
init()

</script>
