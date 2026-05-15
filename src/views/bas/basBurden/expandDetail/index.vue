<template>
    <div class="p-2">
        <el-card shadow="hover">
            <el-table v-loading="loading" :data="basBurdenDetailList" :border="false" :header-cell-style="{ background: '#eff0ff' }" :cell-style="{ background: '#eff0ff' }">
                <el-table-column label="主键ID" align="center" prop="id" v-if="false" />
                <!-- <el-table-column label="配料模板ID" align="center" prop="burdenId" /> -->
                <el-table-column label="行号" align="center" prop="lineNum" />
                <el-table-column label="物料编码" align="center" width="180" prop="materialCode" :show-overflow-tooltip="true" />
                <el-table-column label="物料名称" align="center" width="200" prop="materialName" :show-overflow-tooltip="true" />
                <el-table-column label="单位" align="center" prop="unit" />
                <el-table-column label="数量" align="center" prop="qty" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createBy" />
            </el-table>
        </el-card>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script setup name="BasBurdenDetail">
import { getBasBurdenDetails } from "@/api/bas/basBurden"
import { reactive } from "vue"
const { proxy } = getCurrentInstance()
const props = defineProps(["burdenId"])
const basBurdenDetailList = ref([])

const loading = ref(true)
const total = ref(0)

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        burdenId: undefined
    },
    rules: {}
})

const { queryParams } = toRefs(data)
queryParams.value.burdenId = props.burdenId

function getList() {
    loading.value = true
    getBasBurdenDetails(queryParams.value).then(response => {
        // 假设返回的数据中包含配料明细数据
        basBurdenDetailList.value = response.rows
        total.value = response.total
        loading.value = false
    })
}

getList();
</script>
