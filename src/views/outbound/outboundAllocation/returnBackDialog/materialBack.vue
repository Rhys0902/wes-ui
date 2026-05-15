<template>
    <el-table @selection-change="handleSelectionChange" style="width: 100%;" :data="tableData" ref="multipleTableBind">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="55" align="center" />
        <el-table-column type="expand" prop width="55">
            <template #default="scope">
                <el-table :cell-style="{ background: '#eff0ff' }" :header-cell-style="{ background: '#eff0ff' }" :data="scope.row.children">
                    <el-table-column label="物料编码" align="center" prop="materialCode" />
                    <el-table-column label="物料名称" align="center" prop="materialName" />
                    <!-- <el-table-column label="批次编码" align="center" prop="batchCode" /> -->
                    <el-table-column label="订单数量" align="center" prop="orderedQty" />
                    <el-table-column label="分配数量" align="center" prop="allocatedQty" />
                </el-table>
            </template>
        </el-table-column>
        <el-table-column label="容器编码" align="center" prop="leCode" />
        <el-table-column label="目标库位" align="center" prop="locCode">
            <template #default="{ $index }">
                <el-input style="width: 200px;" v-model="tableData[$index].locCode" placeholder="请输入目标库位" clearable @blur="handleLocationInput($index)" />
            </template>
        </el-table-column>
    </el-table>
    <div style="margin-top: 15px;text-align: end;">
        <el-button :disabled="selelctList.length==0" type="primary" @click="submit('form')">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
    </div>
</template>

<script setup>
import { outboundAllocationReturnBack } from "@/api/outbound/outboundAllocation"
import { listStockDetail } from "@/api/stock/stockDetail"
import { listOutboundAllocation } from "@/api/outbound/outboundAllocation"
import { listBasLocation } from "@/api/bas/basLocation"
import { ElNotification } from 'element-plus'
import _ from 'lodash'
const { proxy } = getCurrentInstance()


const props = defineProps(["paramsLecodeList"])
const emit = defineEmits(["cancelDialog"])
const allocationList = ref([])
const alertNotify = ref(null)
const tableData = ref([])
const selelctList = ref([])
const basLocationList = ref([])

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        sourceLeCode: props.paramsLecodeList,
        allocationStatus: "create",
        logisticsStatus: "complete"
    },
})
const { queryParams } = toRefs(data)

/**
 * 初始化数据
 */
const init = async () => {
    // 获取库位列表（可选，用于输入提示）
    // listBasLocation({ locationType: "BIN", locationStatus: 'Y' }).then(response => {
    //     if (response.code == 200) {
    //         basLocationList.value = response.rows
    //     }
    // })

    let response = null

    if (props.paramsLecodeList != null && props.paramsLecodeList.length > 0) {
        response = await listOutboundAllocation({
            allocationType: "OUT_BACK",
            allocationStatus: "create",
            logisticsStatus: "create",
            sourceLeCode: props.paramsLecodeList
        })
    } else {
        response = await listOutboundAllocation({
            allocationType: "OUT_BACK",
            allocationStatus: "create",
            logisticsStatus: "create"
        })
    }

    if (response.code == 200) {
        const leCodeMap = _.groupBy(response.rows, "sourceLeCode")
        const data = Object.keys(leCodeMap).map(lecode => {
            return {
                ...leCodeMap[lecode][0],
                children: leCodeMap[lecode],
                leCode: lecode,
                locCode: '' // 初始化目标库位为空
            }
        })
        tableData.value = data
    }
}

/**
 * 处理库位输入
 * @param {number} index 行索引
 */
const handleLocationInput = (index) => {
    const inputValue = tableData.value[index].locCode
    if (inputValue) {
        // 可以在这里添加库位验证逻辑
        console.log(`行 ${index} 输入的目标库位:`, inputValue)
    }
}

/**
 * 查询数据
 */
const searchDetails = () => {
    if (queryParams.value.leCode) {
        // 验证中文字符的逗号，替换为英文字符
        let aa = queryParams.value.leCode.replace(/\uff0c/g, ",")
        let arr = aa.split(",")
        if (arr.length > 2) {
            proxy.$modal.msgError("最多支持两个容器查询")
            return false
        }
        queryParams.value.leCode = aa
        getList()
    } else {
        allocationList.value = []
    }
}

/**
 * 取消操作
 */
function cancel() {
    emit("cancelDialog", false)
}

/**
 * 跳转到分配页面
 */
const goToAllocation = () => {
    if (alertNotify.value) {
        alertNotify.value.close()
    }
    cancel()
    proxy.$router.push({
        name: "LogisticsInsTask"
    })
}

/**
 * 余料回库提交
 * @param {string} form 表单名称
 */
const submit = () => {
    if (selelctList.value.length == 0) {
        proxy.$modal.msgError("当前无数据，请选择")
        return false
    }

    // 构建提交参数，目标库位不是必填项
    let params = selelctList.value.map(r => {
        return {
            locCode: r.locCode || '', // 允许目标库位为空
            leCode: r.leCode
        }
    })
    outboundAllocationReturnBack(params).then(response => {
        if (response.code === 200) {
            alertNotify.value = ElNotification({
                title: "温馨提示",
                dangerouslyUseHTMLString: true,
                message: `<div>下发指令成功！请到 <span style="color: #3d5cff; cursor: pointer;">作业指令</span> 页面中查看详情<div>`,
                type: "success",
                duration: 3000,
                position: 'top-right',
                customClass: 'work-notify',
                onClick() {
                    goToAllocation()
                },
            })
            cancel()
        }
    }).catch(error => {
        console.error('提交失败:', error)
    })
}

/**
 * 查询出库分配明细列表
 */
const getList = () => {
    listStockDetail(queryParams.value).then(response => {
        allocationList.value = response.rows
        if (allocationList.value.length == 0) {
            proxy.$modal.info("无相关明细数据")
        } else {
            queryParams.value.locationCode = allocationList.value[0].locationCode
        }
    })
}

/**
 * 处理表格选择变化
 * @param {Array} selection 选中的行数据
 */
const handleSelectionChange = (selection) => {
    selelctList.value = selection.filter(row => row.children?.length > 0)
}

// 初始化
init()
</script>
