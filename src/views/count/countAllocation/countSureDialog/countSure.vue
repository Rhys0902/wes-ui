<template>
    <el-dialog title="盘点确认" v-model="props.dialog" width="90%" append-to-body @close="cancelForm">
        <div style="width: 100%;">
            <el-table @selection-change="handleSelectionChange" :max-height="550" :data="tableData" ref="multipleTableBind" @expand-change="expandChange" :expand-row-keys="expandedRowKeys" :row-key="row => row.id" :default-expand-all="false">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="expand" prop width="55">
                    <template #default="{row, $index: parentIndex}">
                        <div style="padding: 20px;">
                            <el-table :cell-style="{ background: '#eff0ff' }" :header-cell-style="{ background: '#eff0ff', fontWeight: 'bold' }" :data="row.children" :row-key="childRow => childRow.childrenId" size="small">
                                <el-table-column label="盘点单号" align="center" prop="docNumber" width="150" />
                                <el-table-column label="单据类型" align="center" prop="docTypeName" width="120" />
                                <el-table-column label="物料编码" align="center" prop="materialCode" />
                                <el-table-column label="物料名称" align="center" prop="materialName" />
                                <el-table-column label="批次编码" align="center" prop="batchCode" />
                                <el-table-column label="库存数量" align="center" prop="stockQty" />
                                <el-table-column label="确认数量" :required="true">
                                    <template #default="{row: childRow, $index: childIndex}">
                                        <el-input @input="handleInputChange(parentIndex, childIndex, $event)" @click.stop @focus.stop @blur.stop @keydown.stop v-model="childRow.confirmQty" placeholder="请输入确认数量" clearable type="number" :min="0">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="库位" align="center" prop="sourceLocCode" width="120" />
                            </el-table>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="容器编码" align="center" prop="leCode" />

                <el-table-column label="源库位" align="center" prop="sourceLocCode" />
                <!-- <el-table-column label="物料数量" align="center" width="100">
                    <template #default="{row}">
                        <span>{{ row.children ? row.children.length : 0 }}</span>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancelForm">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, getCurrentInstance, onMounted, watch, nextTick } from 'vue'
import { cuntAllocationConfirm } from "@/api/count/countAllocation"
import { listCountAllocation } from "@/api/count/countAllocation"
import _ from "lodash"

const { proxy } = getCurrentInstance()
const expandedRowKeys = ref([])

const props = defineProps({
    dialog: {
        type: Boolean,
        default: false
    },
    allocationList: {
        type: Array,
        default: []
    },
})

const total = ref(0)
const tableData = ref([])
const selelctList = ref([])
const buttonLoading = ref(false)
const emit = defineEmits(["cancelDialog"])

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 20
    }
})

const { queryParams } = toRefs(data)

/**
 * 取消表单操作
 */
function cancelForm() {
    // 清空展开状态和选择状态
    expandedRowKeys.value = []
    selelctList.value = []
    emit("cancelDialog", false)
}

/**
 * 处理表格选择变化
 * @param {Array} selection 选中的数据
 */
const handleSelectionChange = (selection) => {
    selelctList.value = selection
    console.log('选中的数据:', selection)
}

/**
 * 初始化数据
 */
const init = async () => {
    try {
        let response = null
        if (props.allocationList != null && props.allocationList.length > 0) {
            let paramsLecodeList = ""
            props.allocationList.forEach((r, index) => {
                if (index === 0) {
                    paramsLecodeList = r.sourceLeCode
                } else {
                    paramsLecodeList = paramsLecodeList + "," + r.sourceLeCode
                }
            })
            response = await listCountAllocation({
                allocationStatus: "create",
                logisticsStatus: "complete",
                // allocationType: "CNT",
                sourceLeCode: paramsLecodeList
            })
        } else {
            response = await listCountAllocation({
                allocationStatus: "create",
                logisticsStatus: "complete",
                // allocationType: "CNT",
            })
        }

        if (response.code === 200) {
            // 按sourceLeCode分组数据
            const leCodeMap = _.groupBy(response.rows, "sourceLeCode")
            const data = Object.keys(leCodeMap).map((lecode, index) => {
                const children = leCodeMap[lecode].map((child, childIndex) => ({
                    ...child,
                    childrenId: `${lecode}_${child.id}_${childIndex}`, // 添加唯一的childrenId字段
                    confirmQty: child.countQty || '' // 初始化确认数量
                }))

                return {
                    id: `parent_${lecode}_${index}`, // 父级唯一ID
                    leCode: lecode,
                    sourceLocCode: children[0]?.sourceLocCode || '',
                    children: children,
                    // 继承第一个子项的部分信息作为父级显示
                    docNumber: children[0]?.docNumber || '',
                    docTypeName: children[0]?.docTypeName || ''
                }
            })

            total.value = response.total
            tableData.value = data

            console.log('处理后的表格数据:', data)
        }
    } catch (error) {
        console.error('初始化数据失败:', error)
        proxy.$modal.msgError("数据加载失败，请重试")
    }
}

/**
 * 处理输入框输入变化
 * @param {Number} parentIndex 父级索引
 * @param {Number} childIndex 子级索引
 * @param {String} value 输入值
 */
const handleInputChange = (parentIndex, childIndex, value) => {
    // 数据验证和格式化
    let confirmQty = value ? value.toString().replace(/(^\s*)|(\s*$)/g, "") : ''

    // 只允许数字和小数点
    const reg = /[^\d.]/g
    confirmQty = confirmQty.replace(reg, "")

    // 确保只有一个小数点
    const parts = confirmQty.split('.')
    if (parts.length > 2) {
        confirmQty = parts[0] + '.' + parts.slice(1).join('')
    }

    // 直接更新数据，避免触发表格重新渲染
    if (tableData.value[parentIndex] && tableData.value[parentIndex].children[childIndex]) {
        tableData.value[parentIndex].children[childIndex].confirmQty = confirmQty
    }

    console.log(`更新确认数量: 父级${parentIndex}, 子级${childIndex}, 值: ${confirmQty}`)
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
        currentRow: row.leCode,
        expandedRowsCount: expandedRows.length,
        expandedKeys: expandedRowKeys.value
    })
}

/**
 * 确认盘点提交表单
 */
const submitForm = () => {
    if (selelctList.value.length === 0) {
        proxy.$modal.msgError("请选择要确认的数据")
        return false
    }

    let flag = false
    let params = []

    selelctList.value.forEach((r, i) => {
        const { children } = r
        if (children && children.length > 0) {
            children.forEach(v => {
                if (!v.confirmQty || v.confirmQty.trim() === '') {
                    proxy.$modal.msgError(`容器 ${r.leCode} 中存在未输入确认数量的数据，请检查`)
                    flag = true
                    return
                }

                // 验证确认数量是否为有效数字
                const qty = parseFloat(v.confirmQty)
                if (isNaN(qty) || qty < 0) {
                    proxy.$modal.msgError(`容器 ${r.leCode} 中确认数量格式不正确，请输入有效数字`)
                    flag = true
                    return
                }

                params.push({
                    id: v.id,
                    confirmQty: v.confirmQty
                })
            })
        }
    })

    if (flag) {
        return
    }

    if (params.length === 0) {
        proxy.$modal.msgError("没有有效的确认数据")
        return
    }

    buttonLoading.value = true
    cuntAllocationConfirm(params).then(response => {
        if (response.code === 200) {
            proxy.$modal.msgSuccess("盘点确认成功")
            cancelForm()
        } else {
            proxy.$modal.msgError(response.msg || "盘点确认失败")
        }
    }).catch(error => {
        console.error('提交失败:', error)
        proxy.$modal.msgError("提交失败，请重试")
    }).finally(() => {
        buttonLoading.value = false
    })
}

// 监听弹框打开状态，当打开时初始化数据
watch(() => props.dialog, (newVal) => {
    if (newVal) {
        // 重置状态
        expandedRowKeys.value = []
        selelctList.value = []
        tableData.value = []
        init()
    }
})

// 组件挂载时如果弹框已经打开，则初始化数据
onMounted(() => {
    if (props.dialog) {
        init()
    }
})
</script>
