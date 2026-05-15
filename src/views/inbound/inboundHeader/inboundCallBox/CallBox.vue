<template>
    <el-dialog title="叫箱" v-model="open" width="500px" append-to-body @close="cancel">
        <el-form ref="formRef" :model="form" left :rules="rules" label-width="120px">
            <el-form-item label="场外叫箱编码" prop="leCode">
                <el-input v-model="form.leCode" placeholder="请输入场外叫箱编码" clearable maxlength="50" />
            </el-form-item>
            <el-form-item label="源接驳台" prop="sourceLocStationCode">
                <el-select v-model="form.sourceLocStationCode" clearable filterable placeholder="请选择源接驳台">
                    <el-option v-for="v in sourceLocStationList" :key="v.id" :label="v.locationCode" :value="v.locationCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="目标接驳台" prop="targetTocStationCode">
                <el-select v-model="form.targetTocStationCode" clearable filterable placeholder="请选择目标接驳台">
                    <el-option v-for="v in targetTocStationList" clearable :key="v.id" :label="v.locationCode" :value="v.locationCode"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { toRefs } from "vue"

import { callBox } from "@/api/inbound/inboundAllocation"
import { listBasLocation } from "@/api/bas/basLocation"
import { filterParams } from "@/utils/index"
import { ElNotification } from 'element-plus'
const { proxy } = getCurrentInstance()

const props = defineProps({
    openBoxDialog: {
        type: Boolean,
        default: false
    }
})

const open = ref(props.openBoxDialog)
const basLocationList = ref([])
const alertNotify = ref(null)

// 临时定亖数据
const sourceLocStationList = ref([
    // { locationCode: "T0000001" },
    // { locationCode: "T0000002" },
    // { locationCode: "T0000003" }
])
const targetTocStationList = ref([
    // { locationCode: "L0000001" },
    // { locationCode: "L0000002" }
])


const data = reactive({
    form: {
        leCode: '',
        sourceLocStationCode: '',
        targetTocStationCode: ''
    },
    rules: {
        /*leCode: [
            { required: true, message: "请输入场外叫箱编码", trigger: "blur" },
        ],*/
        sourceLocStationCode: [
            { required: true, message: "请输入源接驳台", trigger: "blur" },
        ],

    }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['cancelDialog'])



const init = async () => {
    // 加载所有站点信息用于下拉选择
    listBasLocation({
        pageNum: 1,
        locationType: "STATION",
        locationStatus: 'Y'
    }).then(response => {
        if (response.code === 200) {
            basLocationList.value = response.rows
            // 过滤 areaCode="AC-01" 的库位信息为接驳点位置
            sourceLocStationList.value = response.rows.filter(item =>
                item.areaCode === 'AC-01'
            )
            // 过滤 areaCode="AC-02" 的库位信息为目标库位位置
            targetTocStationList.value = response.rows.filter(item =>
                item.areaCode === 'AC-02'
            )
        }
    })
}

const cancel = () => {
    emit("cancelDialog", false)
}

function goToLogisticsInsTask() {
    cancel()
    if (alertNotify.value) {
        alertNotify.value.close()
    }
    proxy.$router.push({
        name: 'LogisticsInsTask',
    })
}
const submitForm = () => {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            callBox(filterParams(form.value))
                .then(response => {
                    console.log(response)
                    if (response.code === 200) {
                        alertNotify.value = ElNotification({
                            title: "温馨提示",
                            dangerouslyUseHTMLString: true,
                            message: `<div>叫箱指令下发成功!可前往<span style="color: #3d5cff; cursor: pointer;">作业指令</span> 页面中查看详情<div>`,
                            type: "success",
                            duration: 3000,
                            position: 'top-right',
                            customClass: 'work-notify',
                            onClick() {
                                goToLogisticsInsTask()
                            },
                        })
                        cancel() // 关闭弹窗
                    }
                })
        }
    })
}

onMounted(() => {
    init()
})
</script>
<style lang="scss" scoped>
/* 表单样式可根据需要添加 */
</style>
