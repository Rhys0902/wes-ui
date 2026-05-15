<template>
    <div>
        <el-table @selection-change="handleSelectionChange" style="width: 100%" :data="tableData" ref="multipleTableBind">
            <el-table-column label="序号" type="index" width="55" align="center" />
            <el-table-column type="selection" width="55" align="center" />
            <!-- <el-table-column label="WMS单号" align="center" prop="docNumber" width="150" /> -->
            <el-table-column type="expand" prop width="55">
                <template v-slot="scope">
                    <div style="padding: 15px">
                        <el-table :cell-style="{ background: '#eff0ff' }" :header-cell-style="{ background: '#eff0ff' }" :data="scope.row.children">
                            <!-- <el-table-column label="WMS单号" align="center" prop="docNumber" width="150" />
                                <el-table-column label="单据类型" align="center" prop="docTypeName" />-->
                            <el-table-column label="物料编码" align="center" prop="materialCode" />
                            <el-table-column label="物料名称" align="center" prop="materialName" />
                            <!-- <el-table-column label="批次编码" align="center" prop="batchCode" /> -->
                            <el-table-column label="订单数量" align="center" prop="orderedQty" />
                            <el-table-column label="分配数量" align="center" prop="allocatedQty" />
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="容器编码" align="center" prop="leCode" />
            <el-table-column label="单据类型" align="center" prop="docTypeName" />
            <el-table-column label="接驳台" align="center" prop="leCode">
                <template v-slot="{ $index }">
                    <el-select v-model="tableData[$index].dockStation" placeholder>
                        <el-option v-for="item in getFilteredDockStations(tableData[$index].docTypeCode)" :label="`${item.locationCode}`" :value="item.locationCode" :key="item.id">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <!-- <el-table-column width="250" label="目标库位" align="center" prop="leCode">
          <template  v-slot="scope">
            <el-input v-model="tableData[scope.$index].locCode" placeholder=""></el-input>
          </template>
                </el-table-column>-->
        </el-table>
    </div>
    <div style="margin-top: 15px;text-align: end;">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
    </div>

</template>
<script setup>
import { listOutboundAllocation, outboundAllocationPutDown } from "@/api/outbound/outboundAllocation"
import { listBasLocation } from "@/api/bas/basLocation"
import { ElNotification } from 'element-plus'

const { proxy } = getCurrentInstance()
import _ from "lodash"
const props = defineProps(["paramsLecodeList"])
const emit = defineEmits(["cancelDialog"])
const tableData = ref([])
const alertNotify = ref(null)
const selelctList = ref([])
const basLocationList = ref([])
const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        sourceLeCode: props.paramsLecodeList,
        allocationStatus: "create",
        logisticsStatus: "create",
        allocationType: 'OUT',
        orderByColumn: 'id',
        isAsc: 'asc'
    },
})

const { queryParams } = toRefs(data)

// 根据单据类型编码过滤接驳台数据
const getFilteredDockStations = (docTypeCode) => {
    if (docTypeCode === 'OUT-MATERIALS') {
        // 物料出库单据，只显示接驳点K0000001到K0000005
        return basLocationList.value.filter(item =>
            item.locationCode.startsWith('K000000') &&
            parseInt(item.locationCode.slice(-1)) >= 1 &&
            parseInt(item.locationCode.slice(-1)) <= 5
        )
    } else if (docTypeCode === 'OUT-PRODUCT') {
        // 成品出库单据，查询接库区编码=AC-07的
        return basLocationList.value.filter(item => item.areaCode === 'AC-07')
    } else if (docTypeCode === 'OUT-PRODUCTION') {
        // 生产出库单据，只显示接驳点S0000000
        return basLocationList.value.filter(item => item.locationCode === 'S0000000')
    } else {
        // 其他单据类型，显示所有接驳点
        return basLocationList.value
    }
}

const init = async () => {
    listBasLocation({ locationType: "STATION", locationStatus: 'Y' }).then(response => {
        if (response.code == 200) {
            basLocationList.value = response.rows
        }
    })

    let response = null
    if (props.paramsLecodeList != null && props.paramsLecodeList.length > 0) {
        response = await listOutboundAllocation({
            allocationStatus: "create", orderByColumn: 'id',
            logisticsStatus: "create",
            isAsc: 'asc', allocationType: 'OUT', sourceLeCode: props.paramsLecodeList
        })
    } else {
        response = await listOutboundAllocation({
            allocationStatus: "create", orderByColumn: 'id',
            isAsc: 'asc', logisticsStatus: "create", allocationType: 'OUT'
        })
    }
    if (response.code == 200) {
        const leCodeMap = _.groupBy(response.rows, "sourceLeCode")

        const data = Object.keys(leCodeMap).map(lecode => {
            const item = leCodeMap[lecode][0]
            let dockStation = ''
            // 根据单据类型编码设置默认接驳台
            if (item.docTypeCode === 'OUT-PRODUCTION') {
                dockStation = 'S0000000'
            } else if (item.docTypeCode === 'OUT-PRODUCT') {//成品出库使用库区去查数据，不定死
                // dockStation = 'J0000000'
            }
            return {
                ...item,
                children: leCodeMap[lecode],
                leCode: lecode,
                dockStation: dockStation
            }
        })
        tableData.value = data
    }
}
function cancel() {
    emit("cancelDialog", false)
}

const goToLogisticsInsTask = () => {
    cancel()
    if (alertNotify.value) {
        alertNotify.value.close()
    }
    proxy.$router.push({
        name: "LogisticsInsTask"
    })
}

// 确认下架
const submitForm = (form) => {
    if (selelctList.value.length == 0) {
        proxy.$modal.msgError("当前无数据，请检查")
        return false
    }
    // 构建参数，只有当 dockStation 有值时才添加到参数中
    let params = selelctList.value.map(r => {
        const param = {
            leCode: r.leCode
        }
        // 只有当接驳台有值时才添加到参数中
        if (r.dockStation && r.dockStation.trim() !== '') {
            param.dockStation = r.dockStation
        }
        return param
    })

    proxy.$modal.confirm("是否确认下架表格中选中的数据项？").then(() => {
        outboundAllocationPutDown(params).then(response => {
            if (response.code === 200) {
                alertNotify.value = ElNotification({
                    title: "温馨提示",
                    dangerouslyUseHTMLString: true,
                    message: `<div>下架下发指令成功!请到 <span style="color: #3d5cff; cursor: pointer;">作业指令</span> 页面中查看详情<div>`,
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
/** 查询出库分配明细列表 */
const getList = () => {
    listOutboundAllocation(queryParams.value).then(response => {
        allocationList.value = response.rows
        if (allocationList.value.length == 0) {
            proxy.$modal.info("无相关明细数据")
        }
        // this.total = response.total
    })
}
const handleSelectionChange = (selection) => {
    selelctList.value = selection.filter(row => row.children?.length > 0)
}
init()
</script>
