<template>
    <div>
        <el-table :data="allocationList" ref="parentTableRef" @selection-change="handleParentSelectionChange" @expand-change="handleExpandChange" :row-key="row => row.sourceLeCode" style="width: 100%">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" type="index" width="55" align="center" />
            <el-table-column type="expand" width="55">
                <template #default="scope">
                    <div style="padding: 15px">
                        <el-table :data="scope.row.children" :ref="el => childTableRefs[scope.row.sourceLeCode] = el" @selection-change="(selection) => handleChildSelectionChange(selection, scope.$index)">
                            <el-table-column type="selection" width="55" align="center" />
                            <el-table-column label="物料编码" align="center" width="180" prop="materialCode" />
                            <el-table-column label="物料名称" align="center" width="220" prop="materialName" />
                            <el-table-column label="库位编码" align="center" prop="targetLocCode" width="150" />
                            <el-table-column label="订单数量" align="center" prop="orderedQty" />
                            <el-table-column label="分配数量" align="center" prop="allocatedQty" />
                            <el-table-column label="验出数量(必填)" width="150">
                                <template #default="{ row: childRow }">
                                    <el-input v-model="childRow.confirmQty" @input="() => valueChange(childRow)" @focus="handleInputFocus" @blur="handleInputBlur" placeholder="请输入" @click.stop />
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" width="250">
                                <template #default="{ row: childRow }">
                                    <el-input v-model="childRow.notes" @focus="handleInputFocus" @blur="handleInputBlur" placeholder="请输入" @click.stop />
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="容器编码" align="center" prop="sourceLeCode" />
            <el-table-column label="容器物料总数" align="center">
                <template #default="scope">
                    {{ scope.row.children.length }}
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 15px; text-align: end;">
            <el-button @click="submit()" type="primary">确定</el-button>
            <el-button @click="cancel()">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import { listOutboundAllocation, outboundAllocationConfirm } from "@/api/outbound/outboundAllocation"
import { toRefs, reactive, ref, nextTick } from "vue"
import { getCurrentInstance } from "vue"
import _ from "lodash"

const { proxy } = getCurrentInstance()
const props = defineProps(["paramsLecodeList"])
const emit = defineEmits(["cancelDialog"])

const loading = ref(true)
const allocationList = ref([])
const multipleSelection = ref([])
const expandRows = ref([]) // 存储展开的行索引
const parentTableRef = ref(null) // 父表格引用
const childTableRefs = ref({}) // 子表格引用集合

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        sourceLeCode: props.paramsLecodeList,
        allocationStatus: "create",
        logisticsStatus: "complete",
        logisticsType: "OUT"
    }
})
const { queryParams } = toRefs(data)

// 初始化数据
const initData = async () => {
    let response = null
    if (props.paramsLecodeList && props.paramsLecodeList.length > 0) {
        response = await listOutboundAllocation({
            allocationStatus: "create",
            logisticsStatus: "complete",
            logisticsType: "OUT",
            sourceLeCode: props.paramsLecodeList
        })
    } else {
        response = await listOutboundAllocation({
            allocationStatus: "create",
            logisticsStatus: "complete",
            logisticsType: "OUT"
        })
    }

    if (response.code === 200) {
        const leCodeMap = _.groupBy(response.rows, "sourceLeCode")
        const data = Object.keys(leCodeMap).map((lecode, index) => {
            const item = leCodeMap[lecode][0]
            return {
                ...item,
                children: leCodeMap[lecode].map(row => ({
                    ...row,
                    confirmQty: row.allocatedQty?.toString() || "", // 默认等于分配数量
                    selected: false
                })),
                sourceLeCode: lecode,
                selected: false,
                indeterminate: false, // 半选状态
                tableId: index + 1 // 表格唯一标识
            }
        })
        allocationList.value = data
    }
}
initData()

// 提交
function submit() {
    if (allocationList.value.length === 0) {
        proxy.$modal.msgError("当前无数据，请检查")
        return false
    }

    // 收集所有选中的子项
    const selectedChildren = []
    allocationList.value.forEach(row => {
        row.children.forEach(child => {
            if (child.selected) {
                selectedChildren.push(child)
            }
        })
    })

    if (selectedChildren.length === 0) {
        proxy.$modal.msgError("请选择一条数据")
        return false
    }

    // 校验验出数量是否填写
    for (let i = 0; i < selectedChildren.length; i++) {
        const qty = selectedChildren[i].confirmQty
        if (!qty || qty === "") {
            proxy.$modal.msgError(`第 ${i + 1} 条选中数据未输入验出数量，请检查`)
            return false
        }
    }

    // 构建提交参数
    const params = selectedChildren.map(child => ({
        id: child.id,
        confirmQty: child.confirmQty,
        notes: child.notes || ""
    }))

    outboundAllocationConfirm(params).then(response => {
        if (response.code === 200) {
            proxy.$modal.msgSuccess("确认出库成功")
            cancel()
        }
    })
}

// 取消
function cancel() {
    emit("cancelDialog", false)
}

// 父表选择变化
function handleParentSelectionChange(selection) {
    console.log('父表选择变化:', selection)
    try {
        multipleSelection.value = selection

        // 更新所有行的选中状态
        allocationList.value.forEach(row => {
            if (!row || !row.children) return

            const isSelected = selection.some(s => s && s.sourceLeCode === row.sourceLeCode)

            // 更新父行选中状态
            row.selected = isSelected
            row.indeterminate = false // 父表选择时清除半选状态

            // 同步子表格选中状态 - 父行选中时，所有子行都选中
            if (Array.isArray(row.children)) {
                row.children.forEach(child => {
                    if (child) {
                        child.selected = isSelected
                    }
                })

                // 使用表格引用同步子表选中状态
                if (isSelected && childTableRefs.value[row.sourceLeCode]) {
                    nextTick(() => {
                        childTableRefs.value[row.sourceLeCode]?.toggleAllSelection()
                    })
                } else if (!isSelected && childTableRefs.value[row.sourceLeCode]) {
                    nextTick(() => {
                        childTableRefs.value[row.sourceLeCode]?.clearSelection()
                    })
                }
            }

            console.log(`父行 ${row.sourceLeCode} 选中状态: ${isSelected}, 子行数量: ${row.children?.length || 0}`)
        })
    } catch (error) {
        console.error('父表选择变化处理错误:', error)
    }
}

// 子表选择变化
function handleChildSelectionChange(selection, parentIndex) {
    try {
        const parentRow = allocationList.value[parentIndex]
        if (!parentRow || !Array.isArray(parentRow.children)) return

        // 更新子项选中状态
        parentRow.children.forEach(child => {
            if (child) {
                child.selected = selection.some(s => s && s.id === child.id)
            }
        })

        // 判断是否全选
        const allSelected = parentRow.children.every(child => child && child.selected)
        const anySelected = parentRow.children.some(child => child && child.selected)

        // 更新父行选中状态和半选状态
        parentRow.selected = allSelected
        parentRow.indeterminate = anySelected && !allSelected // 设置半选状态

        // 同步父表 selection
        const hasInMultiple = multipleSelection.value.some(s => s && s.sourceLeCode === parentRow.sourceLeCode)

        if (allSelected && !hasInMultiple) {
            // 全选时添加父行
            multipleSelection.value.push(parentRow)
            console.log(`子表全选，添加父行 ${parentRow.sourceLeCode} 到选中列表`)
        } else if (!anySelected && hasInMultiple) {
            // 没有任何子项选中时移除父行
            multipleSelection.value = multipleSelection.value.filter(
                s => s && s.sourceLeCode !== parentRow.sourceLeCode
            )
            console.log(`子表全部取消，移除父行 ${parentRow.sourceLeCode} 从选中列表`)
        } else if (anySelected && !allSelected && !hasInMultiple) {
            // 部分选中时添加父行（但父行不显示选中状态）
            multipleSelection.value.push(parentRow)
            console.log(`子表部分选中，添加父行 ${parentRow.sourceLeCode} 到选中列表`)
        }

        // 同步父表格的选中状态显示
        if (parentTableRef.value) {
            nextTick(() => {
                if (allSelected) {
                    parentTableRef.value?.toggleRowSelection(parentRow, true)
                } else if (!anySelected) {
                    parentTableRef.value?.toggleRowSelection(parentRow, false)
                }
                // 半选状态由 indeterminate 属性控制，不需要手动设置
            })
        }

        console.log(`父行 ${parentRow.sourceLeCode} 选中状态: ${parentRow.selected}, 半选状态: ${parentRow.indeterminate}, 子行选中数量: ${selection.length}`)
    } catch (error) {
        console.error('子表选择变化处理错误:', error)
    }
}

// 表格展开/收起事件
function handleExpandChange(row, expandedRows) {
    expandRows.value = expandedRows.map(r => r.sourceLeCode)
}

// 输入框获取焦点事件
function handleInputFocus(event) {
    // 阻止输入框获取焦点时触发表格行重新渲染
    event.stopPropagation()
}

// 输入框失去焦点事件
function handleInputBlur(event) {
    // 阻止输入框失去焦点时触发表格行重新渲染
    event.stopPropagation()
}

// 验出数量输入处理（只允许数字）
function valueChange(childRow) {
    let val = (childRow.confirmQty || "").toString()
    val = val.trim().replace(/[^\d]/g, "")
    childRow.confirmQty = val
}
</script>
