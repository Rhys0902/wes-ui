<template>
    <div class="p-2">
        <el-card shadow="hover">
            <el-table v-loading="loading" :data="countDetailList" :border="false" :header-cell-style="{ background: '#eff0ff' }" :cell-style="{ background: '#eff0ff' }">
                <el-table-column label="行状态" align="center" width="100" prop="lineStatus" />
                <el-table-column label="明细行号" align="center" width="100" prop="lineNum" />
                <el-table-column label="物料编码" align="center" width="280" prop="materialCode" />
                <el-table-column label="物料名称" align="center" width="280" prop="materialName" />
                <el-table-column label="单位" align="center" width="100" prop="unit" />
                <el-table-column label="批次编码" align="center" width="130" prop="batchCode" />
                <el-table-column label="容器编码" align="center" width="130" prop="leCode" />
                <el-table-column label="库位编码" align="center" width="130" prop="locCode" />
                <el-table-column label="货架编码" align="center" width="130" prop="shelfCode" />
                <el-table-column label="区域编码" align="center" width="130" prop="areaCode" />
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

<script setup name="countDetail">
import { listCountDetail } from '@/api/count/countDetail'
import { reactive } from "vue"

const props = defineProps(["headerId"])
const countDetailList = ref([])

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
    listCountDetail(queryParams.value).then(response => {
        countDetailList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}
getList();
</script>
