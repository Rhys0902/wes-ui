<template>
    <el-dialog title="空托盘入库" v-model="open" width="500px" append-to-body @close="cancel">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="入库方式" prop="way">
                <el-radio-group v-model="form.way">
                    <el-radio :label="1">AGV搬运</el-radio>
                    <el-radio :label="2">人工搬运</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="托盘编码" prop="leCode">
                <el-input v-model="form.leCode" placeholder="请输入托盘编码" clearable maxlength="100" />
            </el-form-item>
            <el-form-item label="目标编码" prop="targetLocCode">
                <el-input v-model="form.targetLocCode" placeholder="请输入目标编码" clearable maxlength="50" />
            </el-form-item>
            <el-form-item label="接驳台" prop="targetTocStationCode">
                <el-select v-model="form.dockStation" clearable filterable placeholder="请选择接驳台">
                    <el-option v-for="v in basLocationList" clearable :key="v.id" :label="v.locationCode" :value="v.locationCode"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="接驳台" prop="dockStation">
                <el-input v-model="form.dockStation" placeholder="请输入接驳台" clearable maxlength="100" />
            </el-form-item> -->
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
import { emptyLePutWay } from "@/api/inbound/inboundHeader"
import { filterParams } from "@/utils/index"
import { listBasLocation } from "@/api/bas/basLocation"

const { proxy } = getCurrentInstance()
const basLocationList = ref([])

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const open = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const data = reactive({
    form: {
        way: 1,
        leCode: '',
        targetLocCode: '',
        dockStation: ''
    },
    rules: {
        way: [
            { required: true, message: "请选择入库方式", trigger: "change" },
        ],
        leCode: [
            { required: true, message: "请输入托盘编码", trigger: "blur" },
        ],

        dockStation: [
            { required: true, message: "请输入接驳台", trigger: "blur" },
        ]
    }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['update:modelValue', 'success'])

const cancel = () => {
    emit("update:modelValue", false)
}
const getBasLocationList = () => {
    listBasLocation({ locationType: "STATION", locationStatus: 'Y' }).then(response => {
        if (response.code == 200) {
            basLocationList.value = response.rows.filter(item => item.areaCode == 'AC-07')
        }
    })
}

const submitForm = () => {
    proxy.$refs["formRef"].validate(valid => {
        if (valid) {
            emptyLePutWay(filterParams(form.value))
                .then(response => {
                    if (response.code === 200) {
                        proxy.$modal.msgSuccess("操作成功")
                        emit("success")
                        cancel() // 关闭弹窗
                    }
                })
        }
    })
}
getBasLocationList()
</script>

<style scoped>
.dialog-footer {
    text-align: right;
}
</style>
