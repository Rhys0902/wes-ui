<template>
    <div class="p-2">
        <el-card shadow="hover">
            <el-table v-loading="loading" :data="inboundDetailList" :border="false" :header-cell-style="{ background: '#eff0ff' }" :cell-style="{ background: '#eff0ff' }" max-height="400">
                <el-table-column label="订单号" align="center" width="180" prop="docNumber" />
                <el-table-column label="明细行号" align="center" prop="lineNum" />
                <el-table-column label="行状态" align="center" width="150" prop="lineStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.lineStatus" />
                    </template>
                </el-table-column>
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" />
                <el-table-column label="物料名称" align="center" width="220" prop="materialName" :show-overflow-tooltip="true" sortable="custom" />
                <el-table-column label="订单数量" align="center" prop="orderedQty" />
                <el-table-column label="已收数量" align="center" prop="receivedQty" />
                <el-table-column label="单位" align="center" prop="unit" />
                <!-- <el-table-column label="批次编码" align="center" prop="batchCode" /> -->
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy" width="150" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" width="150" />
            </el-table>
        </el-card>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script setup name="InboundDetail">
import { listInboundDetail } from "@/api/inbound/inboundDetail"
import { reactive } from "vue"

const { proxy } = getCurrentInstance()
const { wes_common_status } = proxy.useDict("wes_common_status")

const props = defineProps(["headerId"])
const inboundDetailList = ref([])

const loading = ref(true)
const total = ref(0)

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        headerId: undefined
    },
    rules: {}
})

const { queryParams } = toRefs(data)
queryParams.value.headerId = props.headerId

/** 查询入库明细列表 */
function getList() {
    loading.value = true
    listInboundDetail(queryParams.value).then(response => {
        inboundDetailList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}
getList();
</script>
