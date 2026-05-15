<template>
    <div class="p-2">
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <el-card shadow="hover">
                    <div class="head-container">
                        <el-input v-model="deptName" :placeholder="$t('user.enterDeptName')" clearable prefix-icon="Search" style="margin-bottom: 20px" />
                    </div>
                    <div class="head-container">
                        <el-tree :data="deptOptions" :props="{ label: 'label', children: 'children' }" :expand-on-click-node="false" :filter-node-method="filterNode" ref="deptTreeRef" node-key="id" highlight-current default-expand-all @node-click="handleNodeClick" />
                    </div>
                </el-card>
            </el-col>
            <!--用户数据-->
            <el-col :span="20" :xs="24">
                <div class="mb-[10px]">
                    <el-card shadow="hover">
                        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                            <el-form-item :label="$t('user.userName')" prop="userName">
                                <el-input v-model="queryParams.userName" :placeholder="$t('user.enterUsername')" clearable @keyup.enter="handleQuery" />
                            </el-form-item>
                            <el-form-item :label="$t('user.phoneNumber')" prop="phonenumber">
                                <el-input v-model="queryParams.phonenumber" :placeholder="$t('user.enterPhoneNumber')" clearable @keyup.enter="handleQuery" />
                            </el-form-item>
                            <el-form-item :label="$t('public.status')" prop="status">
                                <el-select v-model="queryParams.status" :placeholder="$t('user.userStatus')" clearable>
                                    <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('public.createTime')" style="width: 308px;">
                                <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" :start-placeholder="$t('public.startDate')" :end-placeholder="$t('public.endDate')" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="Search" @click="handleQuery">{{ $t('public.search') }}</el-button>
                                <el-button icon="Refresh" @click="resetQuery">{{ $t('public.resetting') }}</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </div>
                <el-card shadow="hover">
                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:user:add']">{{ $t('public.add') }}</el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">{{ $t('public.edit') }}</el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">{{ $t('public.delete') }}</el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
                        </el-col>
                        <right-toolbar v-model:showSearch="showSearch" v-model:columns="columns" @queryTable="getList"></right-toolbar>
                    </el-row>
                    <el-table :key="tableKey" ref="userTable" v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <template v-for="col in columns" :key="col.key">
                            <el-table-column v-if="col.visible" :label="col.label" :prop="col.prop" :width="col.width" :show-overflow-tooltip="col.showOverflowTooltip" align="center">
                                <template #default="scope" v-if="col.key === 5">
                                    <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
                                </template>
                                <template #default="scope" v-else-if="col.key === 6">
                                    <span>{{ parseTime(scope.row.createTime) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <el-table-column :label="$t('public.operate')" align="center" width="150" class-name="small-padding fixed-width">
                            <template #default="scope">
                                <el-tooltip :content="$t('public.edit')" placement="top" v-if="scope.row.userId !== 1">
                                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                                </el-tooltip>
                                <el-tooltip :content="$t('public.delete')" placement="top" v-if="scope.row.userId !== 1">
                                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                                </el-tooltip>
                                <el-tooltip :content="$t('user.resetPassword')" placement="top" v-if="scope.row.userId !== 1">
                                    <el-button link type="primary" icon="Key" @click="handleResetPwd(scope.row)" v-hasPermi="['system:user:resetPwd']"></el-button>
                                </el-tooltip>
                                <el-tooltip :content="$t('user.assignRole')" placement="top" v-if="scope.row.userId !== 1">
                                    <el-button link type="primary" icon="CircleCheck" @click="handleAuthRole(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
                </el-card>
            </el-col>
        </el-row>

        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
            <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.userNickName')" prop="nickName">
                            <el-input v-model="form.nickName" :placeholder="$t('user.inputNickname')" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.belongDept')" prop="deptId">
                            <el-tree-select v-model="form.deptId" :data="deptOptions" :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id" :placeholder="$t('user.selectBelongDept')" check-strictly />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.phoneNumber')" prop="phonenumber">
                            <el-input v-model="form.phonenumber" :placeholder="$t('user.inputPhoneNumber')" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('public.email')" prop="email">
                            <el-input v-model="form.email" :placeholder="$t('user.inputEmail')" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" :label="$t('user.userName')" prop="userName">
                            <el-input v-model="form.userName" :placeholder="$t('user.enterUsername')" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" :label="$t('user.userPassword')" prop="password">
                            <el-input v-model="form.password" :placeholder="$t('user.userPasswordCannotBeEmpty')" type="password" maxlength="20" show-password />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.gender')">
                            <el-select v-model="form.sex" :placeholder="$t('user.pleaseSelect')">
                                <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('public.status')">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.post')">
                            <el-select v-model="form.postIds" multiple :placeholder="$t('user.pleaseSelect')">
                                <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId" :disabled="item.status == 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.role')">
                            <el-select v-model="form.roleIds" multiple :placeholder="$t('user.pleaseSelect')">
                                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.status == 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('public.remarks')">
                            <el-input v-model="form.remark" type="textarea" :placeholder="$t('user.inputContent')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">{{ $t('public.confirm') }}</el-button>
                    <el-button @click="cancel">{{ $t('public.cancel') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" v-model="upload.open" width="600px" append-to-body>
            <div class="import-container">
                <div class="template-section">
                    <el-button type="success" icon="Download" @click="importTemplate">
                        {{ $t('user.downloadTemplate') }}
                    </el-button>
                    <div class="tip-text">请先下载模板，按照模板格式填写数据后再上传</div>
                </div>
                <div class="upload-section">
                    <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag :http-request="customUpload" class="upload-demo">
                        <el-icon class="el-icon--upload">
                            <upload-filled />
                        </el-icon>
                        <!-- <div class="el-upload__text" v-if="upload.isUploading === true">{{ $t('user.uploading') }}</div> -->
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <template #tip>
                            <div class="el-upload__tip">只能上传xls、xlsx格式文件，且不超过10MB</div>
                            <div class="el-upload__tip">
                                <el-checkbox v-model="upload.updateSupport">{{ $t('user.updateExistingUserData') }}</el-checkbox>
                            </div>
                        </template>
                    </el-upload>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFileForm" :disabled="upload.isUploading">{{ $t('public.confirm') }}</el-button>
                    <el-button @click="uploadCancel">{{ $t('public.cancel') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="User">
import { useI18n } from 'vue-i18n'
import { Download } from '@element-plus/icons-vue'

const { t: $t } = useI18n()
import { getToken } from "@/utils/auth"
import { changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUser, deptTreeSelect } from "@/api/system/user"

const router = useRouter()
const { proxy } = getCurrentInstance()
const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex")

const userList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const dateRange = ref([])
const deptName = ref("")
const deptOptions = ref(undefined)
const initPassword = ref(undefined)
const postOptions = ref([])
const roleOptions = ref([])
const uploadRef = ref()
/*** 用户导入参数 */
const upload = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: "",
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { Authorization: "Bearer " + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
})
// 列显隐信息
const columns = ref([
    { key: 0, label: $t('user.userNumber'), prop: 'userId', width: 160, showOverflowTooltip: false, visible: true },
    { key: 1, label: $t('user.userName'), prop: 'userName', width: undefined, showOverflowTooltip: true, visible: true },
    { key: 2, label: $t('user.userNickName'), prop: 'nickName', width: undefined, showOverflowTooltip: true, visible: true },
    { key: 3, label: $t('user.dept'), prop: 'dept.deptName', width: undefined, showOverflowTooltip: true, visible: true },
    { key: 4, label: $t('user.phoneNumber'), prop: 'phonenumber', width: 120, showOverflowTooltip: false, visible: true },
    { key: 5, label: $t('public.status'), prop: 'status', width: undefined, showOverflowTooltip: false, visible: true },
    { key: 6, label: $t('public.createTime'), prop: 'createTime', width: 160, showOverflowTooltip: false, visible: true }
])

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 15,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
    },
    rules: {
        userName: [
            { required: true, message: computed(() => $t('user.usernameCannotBeEmpty')), trigger: "blur" },
            { min: 2, max: 20, message: computed(() => $t('user.usernameLengthMustBeBetween2And20')), trigger: "blur" }
        ],
        nickName: [{ required: true, message: computed(() => $t('user.nicknameCannotBeEmpty')), trigger: "blur" }],
        password: [
            { required: true, message: computed(() => $t('user.userPasswordCannotBeEmpty')), trigger: "blur" },
            { min: 5, max: 20, message: computed(() => $t('user.passwordLengthMustBeBetween5And20')), trigger: "blur" }
        ],
        email: [{ type: "email", message: computed(() => $t('user.pleaseEnterCorrectEmailAddress')), trigger: ["blur", "change"] }],
        phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: computed(() => $t('user.pleaseEnterCorrectPhoneNumber')), trigger: "blur" }]
    }
})

const { queryParams, form, rules } = toRefs(data)

// 监听 columns 变化进行调试
import { watch, ref } from 'vue'

// 添加表格 key 用于强制重新渲染
const tableKey = ref(0)

watch(columns, (newColumns) => {
    // console.log('columns 数据已更新:', newColumns.map(col => ({ key: col.key, label: col.label })))

    // 强制表格重新渲染：通过改变 key 触发
    tableKey.value += 1
}, { deep: true })

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
    if (!value) return true
    return data.label.indexOf(value) !== -1
}
/** 根据名称筛选部门树 */
watch(deptName, val => {
    proxy.$refs["deptTreeRef"].filter(val)
})
/** 查询部门下拉树结构 */
function getDeptTree() {
    deptTreeSelect().then(response => {
        deptOptions.value = response.data
    })
}
/** 查询用户列表 */
function getList() {
    loading.value = true
    listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
        loading.value = false
        userList.value = res.rows
        total.value = res.total
    })
}
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.userId)
    single.value = selection.length != 1
    multiple.value = !selection.length
}
/** 节点单击事件 */
function handleNodeClick(data) {
    queryParams.value.deptId = data.id
    handleQuery()
}
/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}
/** 重置按钮操作 */
function resetQuery() {
    dateRange.value = []
    proxy.resetForm("queryRef")
    queryParams.value.deptId = undefined
    proxy.$refs.deptTreeRef.setCurrentKey(null)
    handleQuery()
}
/** 删除按钮操作 */
function handleDelete(row) {
    const userIds = row.userId || ids.value
    proxy.$modal
        .confirm($t('user.confirmDeleteUser').replace('###', userIds))
        .then(function () {
            return delUser(userIds)
        })
        .then(() => {
            getList()
            proxy.$modal.msgSuccess($t('public.deleteSuccess'))
        })
        .catch(() => { })
}
/** 导出按钮操作 */
function handleExport() {
    proxy.download(
        "system/user/export",
        {
            ...queryParams.value
        },
        `${$t('user.userManagement')}_${new Date().getTime()}.xlsx`
    )
}
/** 用户状态修改  */
function handleStatusChange(row) {
    let text = row.status === "0" ? $t('user.enable') : $t('user.disable')
    proxy.$modal
        .confirm(`确定要${text}用户 ${row.userName} 吗？`)
        .then(function () {
            return changeUserStatus(row.userId, row.status)
        })
        .then(() => {
            proxy.$modal.msgSuccess($t('user.statusChangeSuccess').replace('###', text))
        })
        .catch(function () {
            row.status = row.status === "0" ? "1" : "0"
        })
}
/** 重置密码按钮操作 */
function handleResetPwd(row) {
    proxy
        .$prompt($t('user.enterNewPassword').replace('###', row.userName), $t('public.tips'), {
            confirmButtonText: $t('public.confirm'),
            cancelButtonText: $t('public.cancel'),
            closeOnClickModal: false,
            inputPattern: /^.{5,20}$/,
            inputErrorMessage: $t('user.passwordLengthError')
        })
        .then(({ value }) => {
            resetUserPwd(row.userId, value).then(response => {
                proxy.$modal.msgSuccess($t('user.modifyPasswordSuccess').replace('###', value))
            })
        })
        .catch(() => { })
}
/** 导入按钮操作 */
function handleImport() {
    upload.title = $t('user.userImport')
    upload.open = true
}
/** 下载模板操作 */
function importTemplate() {
    proxy.download("system/user/importTemplate", {}, `用户模板_${new Date().getTime()}.xlsx`)
}
/**
 * 文件上传中处理
 * 显示上传进度
 */
function handleFileUploadProgress(event, file, fileList) {
    upload.isUploading = true
}

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
    upload.open = false
    upload.isUploading = false
    if (uploadRef.value) {
        uploadRef.value.clearFiles()
    }

    // 检查响应类型，如果是Blob类型，说明是Excel文件
    if (response instanceof Blob) {
        // 创建下载链接
        const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `用户导入结果_${new Date().getTime()}.xlsx`
        link.click()
        URL.revokeObjectURL(link.href)

        // 显示提示信息
        proxy.$modal.msgSuccess('导入完成，已自动下载带有错误信息的结果文件')
    } else {
        // 兼容处理旧的JSON响应方式
        proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", $t('user.importResult'), {
            dangerouslyUseHTMLString: true
        })
    }

    getList()
}
/** 提交上传文件 */
function submitFileForm() {
    if (uploadRef.value) {
        uploadRef.value.submit()
    }
}
/** 重置操作表单 */
function reset() {
    form.value = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
    }
    proxy.resetForm("userRef")
}
/** 取消按钮 */
function cancel() {
    open.value = false
    reset()
}
/** 新增按钮操作 */
function handleAdd() {
    reset()
    getUser().then(response => {
        postOptions.value = response.data.posts
        roleOptions.value = response.data.roles
        open.value = true
        title.value = "添加用户"
        form.value.password = initPassword.value
    })
}
/** 修改按钮操作 */
function handleUpdate(row) {
    reset()
    const userId = row.userId || ids.value
    getUser(userId).then(response => {
        form.value = response.data.user
        postOptions.value = response.data.posts
        roleOptions.value = response.data.roles
        form.value.postIds = response.data.postIds
        form.value.roleIds = response.data.roleIds
        open.value = true
        title.value = "修改用户"
        form.password = ""
    })
}
/** 提交按钮 */
function submitForm() {
    proxy.$refs["userRef"].validate(valid => {
        if (valid) {
            if (form.value.userId != undefined) {
                updateUser(form.value).then(response => {
                    proxy.$modal.msgSuccess($t('user.modifySuccess'))
                    open.value = false
                    getList()
                })
            } else {
                addUser(form.value).then(response => {
                    proxy.$modal.msgSuccess($t('user.addSuccess'))
                    open.value = false
                    getList()
                })
            }
        }
    })
}

getDeptTree()
getList()
proxy.getConfigKey("sys.user.initPassword").then(response => {
    initPassword.value = response.msg
})

/** 取消上传 */
function uploadCancel() {
    if (uploadRef.value) {
        uploadRef.value.clearFiles()
    }
    upload.isUploading = false
    upload.open = false
}

/** 自定义上传方法 */
function customUpload(options) {
    const { action, file, headers, onProgress, onSuccess, onError } = options

    // 创建FormData
    const formData = new FormData()
    formData.append('file', file)

    // 创建XMLHttpRequest
    const xhr = new XMLHttpRequest()
    xhr.open('POST', action, true)

    // 设置responseType为blob
    xhr.responseType = 'blob'

    // 设置headers
    if (headers) {
        Object.keys(headers).forEach(key => {
            xhr.setRequestHeader(key, headers[key])
        })
    }

    // 监听上传进度
    xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
            onProgress({ percent: e.loaded / e.total * 100 })
        }
    })

    // 请求完成处理
    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            onSuccess(xhr.response)
        } else {
            onError(new Error('上传失败'))
        }
    })

    // 请求错误处理
    xhr.addEventListener('error', () => {
        onError(new Error('上传请求失败'))
    })

    // 发送请求
    xhr.send(formData)

    return xhr
}
</script>

<style scoped>
.import-container {
    padding: 20px 0;
}

.template-section {
    margin-bottom: 30px;
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.tip-text {
    margin-top: 10px;
    color: #6c757d;
    font-size: 14px;
    text-align: center;
}

.upload-section {
    margin-bottom: 20px;
}

.upload-demo {
    width: 100%;
}

.upload-demo .el-upload {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    padding: 40px 20px;
    text-align: center;
    background-color: #fafafa;
}

.upload-demo .el-upload:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
}

.el-icon--upload {
    font-size: 67px;
    color: #c0c4cc;
    margin-bottom: 16px;
    line-height: 50px;
}

.el-upload__text {
    color: #606266;
    font-size: 14px;
    text-align: center;
}

.el-upload__text em {
    color: #409eff;
    font-style: normal;
}

.el-upload__tip {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
    text-align: center;
}
</style>
