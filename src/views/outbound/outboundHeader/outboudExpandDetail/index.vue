<template>
    <div class="p-2">
        <el-card shadow="hover">
            <el-table v-loading="loading" :data="outboundDetailList" :border="false" :header-cell-style="{ background: '#eff0ff' }" :cell-style="{ background: '#eff0ff' }">
                <el-table-column label="订单号" align="center" prop="docNumber" />
                <el-table-column label="明细行号" align="center" prop="lineNum" />
                <el-table-column label="行状态" align="center" prop="lineStatus" sortable="custom">
                    <template #default="scope">
                        <dict-tag :options="wes_common_status" :value="scope.row.lineStatus" sortable="custom" />
                    </template>
                </el-table-column>
                <el-table-column label="物料编码" align="center">
                    <template #default="scope">
                        <el-tooltip :content="scope.row.materialCode" placement="top">
                            <span>{{ scope.row.materialCode }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="物料名称" align="center" prop="materialName" />
                <el-table-column label="订单数量" align="center" prop="orderedQty" />
                <el-table-column label="分配数量" align="center" prop="allocatedQty" />
                <el-table-column label="单位" align="center" prop="unit" />
                <!-- <el-table-column label="批次编码" align="center" prop="batchCode" /> -->
                <el-table-column label="创建人" align="center" prop="createBy" />
                <el-table-column label="创建时间" align="center" prop="createTime">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="updateBy" />
                <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script setup name="InboundDetail">
import { listOutboundDetail } from "@/api/outbound/outboundDetail"
import { reactive } from "vue"
const { proxy } = getCurrentInstance()
const { wes_common_status } = proxy.useDict("wes_common_status")


const props = defineProps(["headerId"])
const outboundDetailList = ref([])

const loading = ref(true)
const total = ref(0)

const daterangeReleaseDate = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])

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
    queryParams.value.params = {}
    if (null != daterangeReleaseDate && "" != daterangeReleaseDate) {
        queryParams.value.params["beginReleaseDate"] = daterangeReleaseDate.value[0]
        queryParams.value.params["endReleaseDate"] = daterangeReleaseDate.value[1]
    }
    if (null != daterangeCreateTime && "" != daterangeCreateTime) {
        queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
        queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
    }
    if (null != daterangeUpdateTime && "" != daterangeUpdateTime) {
        queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0]
        queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1]
    }
    listOutboundDetail(queryParams.value).then(response => {
        outboundDetailList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}

getList();
</script>
