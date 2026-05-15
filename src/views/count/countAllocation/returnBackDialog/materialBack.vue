<template>
    <el-dialog title="余料回库" v-model="props.dialog" width="90%" append-to-body @close="cancel">
        <el-table @selection-change="handleSelectionChange" style="width: 100%" :data="data" ref="multipleTableBind" size="small" @expand-change="expandChange" :expand-row-keys="expandedRowKeys" :row-key="row => row.id">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" type="index" width="55" align="center" />
            <el-table-column type="expand" width="55">
                <template #default="{row}">
                    <div style="padding: 20px 30px">
                        <el-table :cell-style="{ background: '#eff0ff' }" :header-cell-style="{ background: '#eff0ff', fontWeight: 'bold' }" :data="row.children" size="small">
                            <el-table-column label="物料编码" align="center" prop="materialCode" />
                            <el-table-column label="物料名称" align="center" prop="materialName" />
                            <el-table-column label="单位" align="center" prop="unit" width="80" />
                            <el-table-column label="批次编码" align="center" prop="batchCode" />
                            <el-table-column label="回库数量" align="center" prop="stockQty">
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="容器编码" align="center" prop="sourceLeCode" />
            <el-table-column label="目标库位" align="center">
                <template #default="props">
                    <el-input width="200px" v-model="data[props.$index].locCode" style="width:200px" placeholder="请输入目标库位" clearable @input="handleLocationInput(props.$index, $event)" />
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button :disabled="selelctList.length === 0" type="primary" @click="submit" :loading="buttonLoading">
                    确 定
                </el-button>
                <!-- <el-button type="primary" @click="submit1" :loading="buttonLoading">
                    确 定1
                </el-button> -->

                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch, computed } from 'vue'
import { countAllocationReturnBack, listCountAllocation } from "@/api/count/countAllocation"
import { parseTime } from "@/utils/ruoyi"
import _ from "lodash"

const { proxy } = getCurrentInstance()

// Props定义
const props = defineProps({
    dialog: {
        type: Boolean,
        default: false
    },
    paramsLecodeList: {
        type: String,
        default: ''
    }
})
// 响应式数据
const data = ref([])
const selelctList = ref([])
const buttonLoading = ref(false)
const expandedRowKeys = ref([])
const loading = ref(false)
const alertNotify = ref(null)
import { ElNotification } from 'element-plus'
// Emits定义
const emit = defineEmits(['cancelDialog'])
/**
 * 初始化数据
 */
const init = async () => {
    loading.value = true
    try {
        // 只获取分配数据，不再请求位置列表
        const allocationResponse = await getCountAllocationData()

        // 处理分配数据
        if (allocationResponse.code === 200) {
            processAllocationData(allocationResponse.rows)
        }
    } catch (error) {
        console.error('初始化数据失败:', error)
        proxy.$modal.msgError("数据加载失败，请重试")
    } finally {
        loading.value = false
    }
}

/**
 * 获取分配数据
 */
const getCountAllocationData = async () => {
    const baseParams = {
        allocationType: "CNT_BACK",
        allocationStatus: "create",
        logisticsStatus: "create"
    }

    if (props.paramsLecodeList && props.paramsLecodeList.length > 0) {
        return await listCountAllocation({
            ...baseParams,
            sourceLeCode: props.paramsLecodeList
        })
    } else {
        return await listCountAllocation(baseParams)
    }
}

/**
 * 处理分配数据，按容器编码分组
 * @param {Array} rows 原始数据行
 */
const processAllocationData = (rows) => {
    if (!rows || rows.length === 0) {
        data.value = []
        return
    }

    // 按容器编码分组
    const leCodeMap = _.groupBy(rows, "sourceLeCode")

    data.value = Object.keys(leCodeMap).map((leCode, index) => {
        const children = leCodeMap[leCode]
        const firstChild = children[0]

        return {
            id: `parent_${leCode}_${index}`, // 唯一ID用于展开控制
            sourceLeCode: leCode,
            locCode: '', // 目标库位，初始化为空字符串

            children: children.map((child, childIndex) => ({
                ...child,
                childId: `${leCode}_${childIndex}` // 子项唯一ID
            })),
            // 继承第一个子项的基本信息用于显示
            materialCode: firstChild.materialCode,
            materialName: firstChild.materialName,
            unit: firstChild.unit
        }
    })
    console.log('处理后的数据:', data.value)
}

/**
 * 处理库位输入变化
 * @param {number} index 行索引
 * @param {string} value 输入的库位编码
 */
const handleLocationInput = (index, value) => {
    if (data.value[index]) {
        data.value[index].locCode = value
        console.log(`行 ${index} 输入库位:`, value)
    }
}

/**
 * 取消操作
 */
const cancel = () => {
    data.value = []
    selelctList.value = []
    expandedRowKeys.value = []

    emit("cancelDialog", true)
}

/**
 * 处理表格展开变化
 * @param {Object} row 当前行数据
 * @param {Array} expandedRows 展开的行数组
 */
const expandChange = (row, expandedRows) => {
    // 更新展开行的keys，保持展开状态
    expandedRowKeys.value = expandedRows.map(item => item.id)

    console.log('展开状态变化:', {
        currentRow: row.sourceLeCode,
        expandedRowsCount: expandedRows.length,
        expandedKeys: expandedRowKeys.value
    })
}

/**
 * 跳转到物流指令任务页面
 */
const goToLogisticsInsTask = () => {
    if (alertNotify.value) {
        alertNotify.value.close()
    }
    cancel()
    proxy.$router.push({
        name: "LogisticsInsTask"
    })
}

/**
 * 提交表单
 */
const submit = () => {
    if (selelctList.value.length === 0) {
        proxy.$modal.msgError("当前无数据，请选择")
        return false
    }
    // buttonLoading.value = true // 开始加载状态
    // 构建提交参数，目标库位为可选项
    const params = selelctList.value.map((r) => {
        const param = {
            leCode: r.sourceLeCode,
            ids: r.children.map(child => child.id) // 包含所有子项ID
        }
        // 只有当locCode有值时才添加到参数中
        if (r.locCode && r.locCode.trim()) {
            param.locCode = r.locCode.trim()
        }
        return param
    })

    proxy.$modal.confirm('是否确认回库表格中的数据项？').then(async () => {
        buttonLoading.value = true
        try {
            const response = await countAllocationReturnBack(params)
            if (response.code === 200) {
                // proxy.$modal.msgSuccess("下架下发指令成功")
                // handleClose()
                alertNotify.value = ElNotification({
                    title: "温馨提示",
                    dangerouslyUseHTMLString: true,
                    message: `<div>下发指令成功!请到 <span style="color: #3d5cff; cursor: pointer;">作业指令</span> 页面中查看详情<div>`,
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
            console.error('操作失败:', error)
        } finally {
            buttonLoading.value = false
        }
    }).catch(() => { })
}

/**
 * 处理表格选择变化
 * @param {Array} selection 选中的数据
 */
const handleSelectionChange = (selection) => {
    selelctList.value = selection.filter(row => row.children?.length > 0)
    console.log('选中的数据:', selection.map(item => ({
        leCode: item.sourceLeCode,
        locCode: item.locCode
    })))
}

// 监听dialog属性变化
watch(() => props.dialog, (newVal) => {
    if (newVal) {
        // 重置状态
        data.value = []
        selelctList.value = []
        expandedRowKeys.value = []
        init()
    }
})

// 组件挂载时初始化
onMounted(() => {
    if (props.dialog) {
        init()
    }
})
</script>

<style  lang="scss"  scoped>
.dialog-footer {
    text-align: right;
}

.dialog-footer .el-button {
    margin-left: 10px;
}

// /* 优化表格样式 */
// :deep(.el-table__expand-icon) {
//     font-size: 14px;
// }

// :deep(.el-table__expanded-cell) {
//     padding: 0;
// }

// /* 子表格样式优化 */
// :deep(.el-table--small .el-table__cell) {
//     padding: 8px 0;
// }
</style>
