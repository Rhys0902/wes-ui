<template>
    <div>
        <el-form ref="form" :rules="rules" :model="formParams" :inline="true" label-width="120px">
            <el-form-item label="收货容器编码" prop="leCode">
                <el-select v-model="formParams.leCode" filterable placeholder="请选择收货容器编码" @change="handleLeCodeChange">
                    <el-option v-for="item in logisticsLeCodeList" :key="item.id" :label="item.leCode" :value="item.leCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="接驳点" prop="dockStation">
                <!-- :disabled="props.docTypeCode === 'IN-PRODUCT'" -->
                <el-select filterable v-model="formParams.dockStation" clearable placeholder="请选择接驳点">
                    <el-option v-for="item in dockStationOptions" :key="item.value" :label="item.locCode" :value="item.locCode" />
                </el-select>
            </el-form-item>
            <!-- 当收货方式为人工搬运(way=2)时显示目标库位字段 -->
            <el-form-item v-if="props.selectedWay === 2" label="目标库位" prop="targetLocCode">
                <el-input v-model="formParams.targetLocCode" placeholder="请输入目标库位编码" />
            </el-form-item>
        </el-form>
        <el-table @selection-change="handleSelectionChangeBind" :data="datasource" max-height="450">
            <el-table-column type="selection" width="55" align="center" :selectable="checkSelectable" />
            <el-table-column label="WMS单号" width="150" align="center" prop="docNumber" />
            <el-table-column label="行状态" align="center" prop="lineStatus">
                <template #default="scope">
                    <dict-tag :options="wes_common_status" :value="scope.row.lineStatus" />
                </template>
            </el-table-column>
            <el-table-column label="物料编码" align="center" width="180" prop="materialCode" :show-overflow-tooltip="true" />
            <el-table-column label="物料名称" align="center" width="220" prop="materialName" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="批次编码" align="center" prop="batchCode" width="100" :show-overflow-tooltip="true" /> -->
            <el-table-column label="订单数量" align="center" prop="orderedQty" />
            <el-table-column label="已收数量" align="center" prop="receivedQty" />
            <el-table-column label="验收数量" align="center" width="150" :required="true">
                <template v-slot="{ row, $index }">
                    <el-input @input="valueChange(row.receiveQty, row, $index)" v-model="datasource[$index].receiveQty" placeholder="请输入验收数量"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" width="150" :required="true">
                <template v-slot="{ row, $index }">
                    <el-input @input="valueChangeNote(row.notes, row, $index)" v-model="datasource[$index].notes" placeholder="请输入备注"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 15px;text-align: end;">
            <el-button @click="submit()" type="primary">确定</el-button>
            <el-button @click="cancel()">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import { listInboundDetail } from "@/api/inbound/inboundDetail"
import { inboundAllocationReceive } from "@/api/inbound/inboundAllocation"
import { listLogisticsLe } from "@/api/logistics/logisticsLe"

import { ElNotification } from 'element-plus'
import { toRefs } from "vue"
const { proxy } = getCurrentInstance()
const { wes_common_status } = proxy.useDict("wes_common_status")

/**
 * 组件属性定义
 */
const props = defineProps({
    headerIdList: {
        type: Array,
        required: true
    },
    selectedWay: {
        type: Number,
        required: true
    },
    docTypeCode: {
        type: String,
        required: true
    }
})

const emit = defineEmits(["cancelDialog"])

const loading = ref(true)
const datasource = ref([])
const multipleBindSelection = ref([])
const alertNotify = ref(null)
const logisticsLeCodeList = ref([])

const dockStationOptions = ref([
    { locCode: "T0000001" },
    { locCode: "T0000002" },
    { locCode: "T0000003" },
    { locCode: "L0000001" },
    { locCode: "L0000002" },
    { locCode: "X0000000" }
])

const data = reactive({
    formParams: {
        leCode: "",
        dockStation: "",
        // 根据收货方式动态添加目标库位字段
        ...(props.selectedWay === 2 && { targetLocCode: "" })
    },
    rules: {
        leCode: [
            { required: true, message: "容器编码不可为空", trigger: "blur" },
        ],
        dockStation: [
            { required: true, message: "接驳点不可为空", trigger: "blur" },
        ],
        // 当收货方式为人工搬运时，目标库位为必填
        ...(props.selectedWay === 2 && {
            targetLocCode: [
                { required: true, message: "目标库位不可为空", trigger: "blur" },
            ]
        })
    }
})
const { formParams, rules } = toRefs(data)

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

/**
 * 初始化数据
 */
const initData = () => {
    const promiseList = props.headerIdList.map(id => {
        return getList(id)
    })

    Promise.all(promiseList).then(list => {
        let result = []
        list.map(r => {
            result = [...result, ...r]
        })
        datasource.value = result
    })
}

/**
 * 获取物流容器数据
 */
const getLogisticsLeData = () => {
    listLogisticsLe().then(response => {
        if (response.code === 200) {
            let filteredList = []

            // 根据单据类型编码应用不同的筛选逻辑
            if (props.docTypeCode === "IN-PRODUCT") {
                // 单据类型为IN-PRODUCT时，显示leType为"EMPTY"且leLocationCode为null或"Z0000000"的容器
                filteredList = response.rows.filter(item =>
                    item.leType === "EMPTY" && (item.leLocationCode === null || item.leLocationCode === "Z0000000")
                )
            } else {
                // 其他单据类型时，显示leType为"EMPTY"且leLocationCode为null或不为"Z0000000"的容器
                filteredList = response.rows.filter(item =>
                    item.leType === "EMPTY" && (item.leLocationCode === null || item.leLocationCode !== "Z0000000")
                )
            }

            logisticsLeCodeList.value = filteredList
        }
    })
}

initData()
getLogisticsLeData()

// 当单据类型编码为IN-PRODUCT时，定死接驳点为Z0000000并禁用编辑
if (props.docTypeCode === "IN-PRODUCT") {
    data.formParams.dockStation = "Z0000000"
}

/**
 * 获取入库明细列表
 * @param {String} headerId - 入库单头ID
 * @returns {Promise} 返回Promise对象
 */
function getList(headerId) {
    return new Promise(reslove => {
        loading.value = true
        listInboundDetail({
            headerId: headerId,
            way: 1
        }).then(response => {
            loading.value = false
            reslove(
                response.rows.map(r => {
                    // 计算验收数量的默认值：订单数量 - 已收数量
                    const defaultReceiveQty = r.orderedQty - r.receivedQty > 0 ? r.orderedQty - r.receivedQty : 0
                    return {
                        ...r,
                        headerId,
                        receiveQty: defaultReceiveQty.toString() // 转为字符串类型
                    }
                })
            )
        })
    })
}

/**
 * 提交表单
 */
function submit() {
    proxy.$refs["form"].validate(valid => {
        if (valid) {
            if (!multipleBindSelection.value || multipleBindSelection.value.length === 0) {
                proxy.$modal.msgError("请选择相关数据")
                return
            }
            let n = multipleBindSelection.value.findIndex((value, index) => {
                return !value.receiveQty
            })
            if (n != -1) {
                proxy.$modal.msgError("请填写验收数量")
                return
            }
            let details = []
            multipleBindSelection.value.forEach(r => {
                details.push({
                    detailId: r.id,
                    receiveQty: parseInt(r.receiveQty),
                    notes: r.notes
                })
            })
            // 根据收货方式构建参数
            let params = {
                leCode: formParams.value.leCode,
                dockStation: formParams.value.dockStation,
                inboundReceiveDetailList: details
            }
            // 如果是人工搬运，添加目标库位
            if (props.selectedWay === 2) {
                params.targetLocCode = formParams.value.targetLocCode
            }

            receive(params)
        }
    })
}

/**
 * 取消操作
 */
function cancel() {
    emit("cancelDialog", false)
}

/**
 * 弹框多选的数据处理
 * @param {Array} selection - 选中的数据
 */
function handleSelectionChangeBind(selection) {
    multipleBindSelection.value = selection
}

/**
 * 验收数量输入值变化处理
 * @param {String} receiveQty - 验收数量
 * @param {Object} v - 行数据
 * @param {Number} index - 行索引
 */
function valueChange(receiveQty, v, index) {
    receiveQty = receiveQty.replace(/(^\s*)|(\s*$)/g, "")
    const reg = /[^\d]/g
    // 只能是数字不能是其他输入
    receiveQty = receiveQty.replace(reg, "")
    datasource.value[index].receiveQty = receiveQty
}

/**
 * 备注输入值变化处理
 * @param {String} notes - 备注
 * @param {Object} v - 行数据
 * @param {Number} index - 行索引
 */
function valueChangeNote(notes, v, index) {
    datasource.value[index].notes = notes
}

/**
 * 执行收货操作
 * @param {Object} params - 收货参数
 */
function receive(params) {
    inboundAllocationReceive(params).then(response => {
        if (response.code == 200) {
            uploadHandle()
        }
    })
}

/**
 * 跳转到分配页面
 */
function goToAllocation(way) {

    if (alertNotify.value) {
        alertNotify.value.close()
    }
    cancel()
    if (way == 1) {
        proxy.$router.push({
            name: "InboundAllocation"
        })
    }
    if (way == 2) {
        proxy.$router.push({
            name: "StockDetail"
        })
    }
}

/**
 * 处理收货容器编码变化
 * @param {String} leCode - 选中的容器编码
 */
const handleLeCodeChange = (leCode) => {
    // 如果单据类型编码为IN-PRODUCT，不处理接驳点变化
    if (props.docTypeCode === "IN-PRODUCT") {
        return
    }
    const selectedItem = logisticsLeCodeList.value.find(item => item.leCode === leCode)
    if (selectedItem && selectedItem.leLocationCode) {
        data.formParams.dockStation = selectedItem.leLocationCode
    } else {
        data.formParams.dockStation = ""
    }
}

/**
 * 处理上传成功
 */
const uploadHandle = async () => {
    alertNotify.value = ElNotification({
        title: "温馨提示",
        dangerouslyUseHTMLString: true,
        message: props.selectedWay == 2 ? `<div>收货成功！请到 <span style="color: #3d5cff; cursor: pointer;">库存明细</span> 页面中查看详情<div>` : `<div>收货成功！请到 <span style="color: #3d5cff; cursor: pointer;">入库分配明细</span> 页面中查看详情<div>`,

        type: "success",
        duration: 3000,
        position: 'top-right',
        customClass: 'work-notify',
        onClick() {
            goToAllocation(props.selectedWay)
        },
    })
    cancel()
}
</script>

