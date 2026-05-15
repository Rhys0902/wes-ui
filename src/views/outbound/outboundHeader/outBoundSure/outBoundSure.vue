<template>
    <div style="padding: 20px;">
        <el-table v-loading="loading" :data="tableDatas" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50" :selectable="checkSelectable" />
            <el-table-column label="订单号" align="center" width="150" prop="docNumber" sortable="custom" />
            <el-table-column label="明细行号" align="center" width="100" prop="lineNum" />
            <el-table-column label="行状态" align="center" prop="lineStatus">
                <template #default="scope">
                    <dict-tag :options="wes_common_status" :value="scope.row.lineStatus" />
                </template>
            </el-table-column>
            <el-table-column label="物料编码" align="center" width="180" prop="materialCode" sortable="custom" />
            <el-table-column label="物料名称" align="center" width="220" prop="materialName" />
            <el-table-column label="单位" align="center" width="80" prop="unit" />
            <!-- <el-table-column label="批次编码" align="center" width="130" prop="batchCode" /> -->
            <el-table-column label="订单数量" align="center" width="130" prop="orderedQty" />
            <el-table-column label="分配数量" align="center" width="130" prop="allocatedQty" />
            <el-table-column label="创建人" align="center" width="150" prop="createBy" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom">
                <template v-slot="{ row }">
                    <span>{{ parseTime(row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新人" align="center" width="150" prop="updateBy" />
            <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable="custom">
                <template v-slot="{ row }">
                    <span>{{ parseTime(row.updateTime) }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px;text-align: end;">
            <el-button :disabled="multipleSelection.length == 0" @click="handleSubmit" type="primary">确认分配</el-button>
        </div>
    </div>
</template>
<script setup>
import {
    outboundHeaderAllocation
} from "@/api/outbound/outboundHeader"
import { ElNotification } from 'element-plus'
import { listOutboundDetail } from "@/api/outbound/outboundDetail"

const { proxy } = getCurrentInstance()
const props = defineProps(["headerIdList"])
const emit = defineEmits(["cancelDialog"])

function cancel() {
    emit("cancelDialog", false)
}

const tableDatas = ref([])
const loading = ref(true)
const multipleSelection = ref([])
const alertNotify = ref(null)

const { wes_common_status } = proxy.useDict("wes_common_status")

const handleSelectionChange = (val) => {
    multipleSelection.value = val
}
const init = () => {

    loading.value = true
    const promiseList = props.headerIdList.map(r => {
        return listOutboundDetail({ headerId: r })
    })
    Promise.all(promiseList)
        .then(r => {
            let datas = []
            r.forEach(response => {
                datas = [...datas, ...response.rows]
            })

            tableDatas.value = datas
        })
        .finally(() => {
            loading.value = false
        })
}
init()

/**
 * 检查行是否可选择
 * @param {Object} row 当前行数据
 * @param {number} index 行索引
 * @returns {boolean} 是否可选择
 */
const checkSelectable = (row, index) => {
    // 当lineStatus为'complete'时，不可选择
    return row.lineStatus !== 'complete'
}


const handleSubmit = () => {
    const ids = multipleSelection.value.map(r => {
        return r.docNumber
    })
    const params = multipleSelection.value.map(r => {
        return {
            headerId: r.headerId,
            detailId: r.id
        }
    })
    proxy.$modal
        .confirm('是否确认出库分配为"' + ids + '"的数据项？')
        .then(() => {
            loading.value = true
            return outboundHeaderAllocation(params)
        })
        .then(() => {
            loading.value = false
            cancel()
            uploadHandle()
            // proxy.$modal.msgSuccess("分配成功")
        })
        .catch(() => { })
        .finally(() => {
            loading.value = false
        })
}
const uploadHandle = async () => {
    alertNotify.value = ElNotification({
        title: "温馨提示",
        dangerouslyUseHTMLString: true,
        message: `<div>分配成功功！请到 <span style="color: #3d5cff; cursor: pointer;">出库分配明细</span> 页面中查看详情<div>`,
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
function goToAllocation() {
    if (alertNotify.value) {
        alertNotify.value.close()
    }
    cancel()
    proxy.$router.push({
        name: "OutboundAllocation"
    })
}


</script>
