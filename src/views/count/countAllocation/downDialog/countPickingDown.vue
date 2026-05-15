<template>
    <el-dialog title="确认下架" v-model="open" width="90%" append-to-body @close="cancel">
        <div style="width: 100%">
            <el-table @selection-change="handleSelectionChange" style="width: 100%" max-height="600px" :data="data" ref="multipleTableRef" size="small">
                <el-table-column type="index" width="55" align="center" />
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="expand" width="55">
                    <template #default="props">
                        <div style="padding: 15px">
                            <el-table :cell-style="{ background: '#eff0ff' }" :header-cell-style="{ background: '#eff0ff' }" :data="props.row.children">
                                <el-table-column label="上位行号" align="center" prop="refDetailLineNum" width="125" />
                                <el-table-column label="物料编码" align="center" prop="materialCode" width="200" />
                                <el-table-column label="物料名称" align="center" prop="materialName" width="150" />
                                <el-table-column label="机件号" align="center" prop="lotAttr02" width="100" />
                                <el-table-column label="供应商编码" align="center" width="100" prop="supplierCode" />
                                <el-table-column label="供应商名称" align="center" width="200" prop="supplierName" />
                                <el-table-column label="单位" align="center" prop="unit" width="100" />
                                <el-table-column label="批次编码" align="center" prop="batchCode" width="180" />
                                <el-table-column label="质量等级" align="center" prop="lotAttr01" width="100" />
                                <el-table-column label="出厂日期" align="center" prop="lotAttr03" width="180">
                                    <template #default="scope">
                                        <span>{{ parseTime(scope.row.lotAttr03) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="专业" align="center" prop="lotAttr04" width="100" />
                                <el-table-column label="当前数量" align="center" prop="stockQty" width="100" />
                            </el-table>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="上位单号" align="center" prop="refDocNumber" width="180" />
                <el-table-column label="单据类型" align="center" prop="docTypeName" />
                <el-table-column label="容器编码" align="center" prop="leCode" />
                <el-table-column label="库位编码" align="center" prop="sourceLocCode" />
                <el-table-column width="250" label="接驳台" align="center">
                    <template #default="props">
                        <el-select v-model="data[props.$index].dockStation" placeholder="请选择接驳台" clearable filterable>
                            <el-option v-for="item in basLocationList" :label="item.locationCode" :value="item.locationCode" :key="item.id" />
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, watch, getCurrentInstance } from 'vue'
import {
    listCountAllocation,
    countAllocationPutDown
} from "@/api/count/countAllocation"
import { listBasLocation } from "@/api/bas/basLocation"
import { filterKey, filterParams } from "@/utils/index"
import _ from "lodash"
import { useRouter } from 'vue-router'

// 获取当前实例
const { proxy } = getCurrentInstance()

// 接收父组件参数
const props = defineProps({
    dialog: {
        type: Boolean,
        default: false
    },
    paramsLecodeList: {
        type: String,
        default: () => ''
    }
})

//  emits
const emit = defineEmits(['cancelDialog'])

// 路由
const router = useRouter()

// 响应式数据 - 使用 ref 替代 reactive + toRefs
const open = ref(props.dialog)
const total = ref(0)
const basLocationList = ref([])
const queryParams = ref({
    pageNum: 1,
    pageSize: 15,
    sourceLeCode: props.paramsLecodeList,
    allocationStatus: "create",
    logisticsStatus: "create",
    allocationType: "CNT",
})
const allocationList = ref([])
const alertNotify = ref(null)
import { ElNotification } from 'element-plus'
const data = ref([])
const selelctList = ref([])
const rules = ref({
    sourceLeCode: [
        { required: true, message: "容器编码不得为空", trigger: "blur" },
    ],
    dockStation: [
        { required: true, message: "接驳台不得为空", trigger: "blur" },
    ],
})

// 表格ref
const multipleTableRef = ref(null)
// 按钮加载状态
const buttonLoading = ref(false)

/**
 * 初始化数据
 */
const init = async () => {
    // 获取位置列表
    const locationResponse = await listBasLocation({ locationType: "STATION", locationStatus: 'Y' })
    if (locationResponse.code === 200) {
        basLocationList.value = locationResponse.rows
    }

    // 获取分配列表
    let allocationResponse = null
    if (props.paramsLecodeList && props.paramsLecodeList.length > 0) {
        allocationResponse = await listCountAllocation({
            allocationStatus: "create",
            logisticsStatus: "create",
            allocationType: "CNT",
            sourceLeCode: props.paramsLecodeList,
        })
    } else {
        allocationResponse = await listCountAllocation({
            allocationStatus: "create",
            logisticsStatus: "create",
            allocationType: "CNT",
        })
    }

    if (allocationResponse.code === 200) {
        const grouped = _.groupBy(
            allocationResponse.rows,
            (item) => `${item.targetLeCode}|${item.targetLocCode || ''}`
        )

        data.value = Object.keys(grouped).map((compositeKey) => {
            const [leCode] = compositeKey.split("|")
            const items = grouped[compositeKey]
            const parent = items[0]
            return {
                ...parent,
                children: items,
                leCode: leCode,
                dockStation: '',
            }
        })
    }
}
/**
 * 处理关闭对话框
 */
const cancel = () => {
    allocationList.value = []
    queryParams.value.sourceLeCode = ""
    emit('cancelDialog', true)
    open.value = false
}

/**
 * 跳转到物流作业任务
 */
const goToLogisticsInsTask = () => {
    if (alertNotify.value) {
        alertNotify.value.close()
    }
    router.push({
        name: "LogisticsInsTask",
    })
}

/**
 * 提交表单
 */
const submitForm = () => {
    if (selelctList.value.length === 0) {
        proxy.$modal.msgError("当前无数据，请检查")
        return false
    }
    const params = selelctList.value.map((r) => {
        const ids = r.children.map((t) => t.id)
        return filterParams({
            leCode: r.leCode,
            dockStation: r.dockStation,
            ids: ids,
        })
    })

    proxy.$modal.confirm('是否确认下架表格中的数据项？').then(async () => {
        buttonLoading.value = true
        try {
            const response = await countAllocationPutDown(params)
            if (response.code === 200) {
                // proxy.$modal.msgSuccess("下架下发指令成功")
                // cancel()
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
        } catch (error) {
            console.error('下架操作失败:', error)
        } finally {
            buttonLoading.value = false
        }
    }).catch(() => { })
}

/**
 * 查询列表
 */
const getList = async () => {
    const response = await listCountAllocation(queryParams.value)
    allocationList.value = response.rows
    if (allocationList.value.length === 0) {
        proxy.$modal.msgInfo("无相关明细数据")
    }
    total.value = response.total
}

/**
 * 搜索详情
 */
const searchDetails = () => {
    if (queryParams.value.sourceLeCode) {
        // 替换中文逗号为英文逗号
        let aa = queryParams.value.sourceLeCode.replace(/\uff0c/g, ",")
        let arr = aa.split(",")
        if (arr.length > 2) {
            proxy.$modal.msgError("最多支持两个容器查询")
            return false
        }
        queryParams.value.sourceLeCode = aa
        getList()
    } else {
        allocationList.value = []
        total.value = 0
    }
}

/**
 * 处理选择变化
 */
const handleSelectionChange = (selection) => {
    selelctList.value = selection.filter(row => row.children?.length > 0)
}

/**
 * 解析时间
 */
const parseTime = (time) => {
    if (!time) return ''
    return new Date(time).toLocaleString()
}

// 挂载时初始化
onMounted(() => {
    init()
})

// 监听props变化
watch(() => props.dialog, (newVal) => {
    open.value = newVal
})
</script>

<style lang="scss" scoped>
.dialog-footer {
    text-align: right;
}
.dialog-footer .el-button {
    margin-left: 10px;
}
</style>
