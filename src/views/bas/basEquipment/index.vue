<template>
    <div class="p-2">
        <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
                <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
                    <el-form-item label="设备编码" prop="equipmentCode">
                        <el-input v-model="queryParams.equipmentCode" placeholder="请输入设备编码" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="设备名称" prop="equipmentName">
                        <el-input v-model="queryParams.equipmentName" placeholder="请输入设备名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="设备状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="请选择设备状态" clearable>
                            <el-option v-for="dict in equipment_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <span v-show="showAllSearchTop">
                        <el-form-item label="IP" prop="host">
                            <el-input v-model="queryParams.host" placeholder="请输入IP" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="端口" prop="port">
                            <el-input v-model="queryParams.port" placeholder="请输入端口" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="心跳间隔" prop="liveTimeout">
                            <el-input v-model="queryParams.liveTimeout" placeholder="请输入心跳间隔" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="最后心跳时间" style="width: 320px">
                            <el-date-picker v-model="daterangeLastLiveTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="协议" prop="comProtocol">
                            <el-input v-model="queryParams.comProtocol" placeholder="请输入协议" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="信息" prop="info">
                            <el-input v-model="queryParams.info" placeholder="请输入信息" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="创建时间" style="width: 320px">
                            <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="创建人" prop="createBy">
                            <el-input v-model="queryParams.createBy" placeholder="请输入创建人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                        <el-form-item label="更新时间" style="width: 320px">
                            <el-date-picker v-model="daterangeUpdateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="更新人" prop="updateBy">
                            <el-input v-model="queryParams.updateBy" placeholder="请输入更新人" clearable @keyup.enter="handleQuery" />
                        </el-form-item>
                    </span>
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                        <el-button @click="showAllSearchTop=!showAllSearchTop">
                            <span style="vertical-align: middle">{{!showAllSearchTop?'展开':'收起'}}</span>
                            <el-icon style="vertical-align: middle">
                                <ArrowDown v-if="!showAllSearchTop" />
                                <ArrowUp v-else />
                            </el-icon>
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <el-card shadow="hover">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bas:basEquipment:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="Edit" @click="handleBatchEdit" v-hasPermi="['bas:basEquipment:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain :icon="selectedIds.length === basEquipmentList.length && basEquipmentList.length > 0 ? 'CircleCheckFilled' : 'CircleCheck'" @click="toggleSelectAll">
                        {{ selectedIds.length === basEquipmentList.length && basEquipmentList.length > 0 ? '取消全选' : '全选' }}
                    </el-button>
                </el-col>

                <el-col :span="1.5">
                    <el-button type="danger" plain icon="Delete" @click="handleDelete" v-hasPermi="['bas:basEquipment:delete']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bas:basEquipment:export']">导出</el-button>
                </el-col>

                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <!-- 展示区 -->
            <div v-if="total>0" class="equipment-grid">
                <el-card v-for="equipment in basEquipmentList" :key="equipment.id" class="equipment-card" :class="{ 'status-changed-animation': equipment.status }">
                    <div class="card-ops">
                        <el-checkbox v-model="equipment.selected" @change="val => handleSelectChange(val, equipment.id)" />
                    </div>
                    <template #header>
                        <div class="card-header clearfix">
                            <span class="equipment-name">{{ equipment.equipmentName }}</span>
                            <el-tag :type="getStatusTagType(equipment.status)" size="small" style="float: right;">{{ getStatusText(equipment.status) }}</el-tag>
                        </div>
                    </template>
                    <div class="card-body">
                        <div class="equipment-image-container" v-if="equipment.hasImage">
                            <!-- <img :src="'data:image/png;base64,'+equipment.equipmentCode" alt="设备图片" fit="contain" class="equipment-image" /> -->
                            <img :src="equipment.imageUrl" alt="设备图片" fit="contain" class="equipment-image" />
                        </div>
                        <div class="equipment-image-container" v-else>
                            <el-icon>
                                <Picture />
                            </el-icon>
                            <!-- <i class="el-icon-picture-outline equipment-no-image-icon"></i> -->
                        </div>
                        <div class="equipment-info-content">
                            <div class="info-item">
                                <span class="info-label">设备编码:</span>
                                <span class="info-value">{{ equipment.equipmentCode }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">IP 地址:</span>
                                <span class="info-value">{{ equipment.host }}:{{ equipment.port }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">通信协议:</span>
                                <span class="info-value">{{ equipment.comProtocol }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">最后心跳:</span>
                                <span class="info-value">{{ parseTime(equipment.lastLiveTime) || '无记录' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">附加信息:</span>
                                <span class="info-value remark-value" :title="equipment.info">{{ equipment.info || '暂无' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="status-indicator" :title="'状态: ' + getStatusText(equipment.status)">
                            <!-- <span class="indicator-dot" :class="getIndicatorDotClass(equipment.status)"></span>
                        <span>{{ getStatusText(equipment.status) }}</span> -->
                        </div>
                        <span class="update-time">更新于: {{ parseTime(equipment.updateTime) }}</span>
                    </div>
                </el-card>
            </div>
            <el-empty v-else description="暂无数据" />
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" :pageSizes=[6,10,50,100] v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 添加或修改设备主数据对话框 -->
        <el-dialog :title="title" v-model="open" width="700px" append-to-body>
            <el-form ref="basEquipmentRef" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备编码" prop="equipmentCode">
                            <el-input v-model="form.equipmentCode" placeholder="请输入设备编码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="equipmentName">
                            <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="IP地址" prop="host">
                            <el-input v-model="form.host" placeholder="请输入IP地址" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="端口" prop="port">
                            <el-input v-model.number="form.port" placeholder="请输入端口" type="number" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="通信协议" prop="comProtocol">
                    <el-input v-model="form.comProtocol" placeholder="请输入通信协议, 如 TCP, UDP, OPCUA" />
                </el-form-item>
                <el-form-item label="设备图片" prop="imageFile">
                    <el-upload action="#" :auto-upload="false" :on-change="handleUpload" :before-upload="beforeUpload" :show-file-list="false" accept="image/*">
                        <el-button type="default" plain icon="upload">添加</el-button>
                        <template #tip>
                            <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                        </template>
                    </el-upload>
                    <br />
                </el-form-item>
                <el-form-item>
                    <!-- 图片预览和删除按钮 -->
                    <div class="preview-image" v-if="previewUrl">
                        <span class="delete-tip">
                            <el-icon style="font-size:16px" @click="removeImage">
                                <CircleClose />
                            </el-icon>
                            <!-- <i style="font-size:16px" @click="removeImage" class="el-icon-circle-close"></i> -->
                        </span>
                        <img :src="previewUrl" class="image" />
                    </div>
                </el-form-item>
                <el-form-item label="附加信息" prop="info">
                    <el-input v-model="form.info" type="textarea" placeholder="请输入附加信息" />
                </el-form-item>
            </el-form>
            <!-- <el-form ref="basEquipmentRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="设备编码" prop="equipmentCode">
                    <el-input v-model="form.equipmentCode" placeholder="请输入设备编码" />
                </el-form-item>
                <el-form-item label="设备名称" prop="equipmentName">
                    <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
                </el-form-item>
                <el-form-item label="设备状态 " prop="status">
                    <el-select v-model="form.status" placeholder="请选择设备状态 ">
                        <el-option v-for="dict in equipment_status" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="IP" prop="host">
                    <el-input v-model="form.host" placeholder="请输入IP" />
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="form.port" placeholder="请输入端口" />
                </el-form-item>
                <el-form-item label="心跳间隔" prop="liveTimeout">
                    <el-input v-model="form.liveTimeout" placeholder="请输入心跳间隔" />
                </el-form-item>
                <el-form-item label="最后心跳时间" prop="lastLiveTime">
                    <el-date-picker clearable v-model="form.lastLiveTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择最后心跳时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="协议" prop="comProtocol">
                    <el-input v-model="form.comProtocol" placeholder="请输入协议" />
                </el-form-item>
                <el-form-item label="信息" prop="info">
                    <el-input v-model="form.info" placeholder="请输入信息" />
                </el-form-item>
            </el-form> -->
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup name="BasEquipment">
import { Picture, CircleClose, Search, Refresh, Plus, Edit, Delete, Download, ArrowDown, ArrowUp, CircleCheck, CircleCheckFilled } from '@element-plus/icons-vue'
import { listBasEquipment, getBasEquipment, delBasEquipment, addBasEquipment, updateBasEquipment } from "@/api/bas/basEquipment"
import { getToken } from '@/utils/auth' // 用于获取token设置上传请求头
// 过滤
import { filterKey } from "@/utils/index"
const { proxy } = getCurrentInstance()
const { equipment_status } = proxy.useDict("equipment_status")
const showAllSearchTop = ref(false)

const basEquipmentList = ref([])
const open = ref(false)
const buttonLoading = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
// const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeLastLiveTime = ref([])
const daterangeCreateTime = ref([])
const daterangeUpdateTime = ref([])
const imageUrl = ref(window.global_config["baseUrl"] + "/bas/basEquipment/image/")
const selectedIds = ref([])
const previewUrl = ref('')

const multiple = computed(() => {
    return selectedIds.value.length === 0
})

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 6,
        equipmentCode: undefined,
        equipmentName: undefined,
        status: undefined,
        host: undefined,
        port: undefined,
        liveTimeout: undefined,
        lastLiveTime: undefined,
        comProtocol: undefined,
        info: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
    },
    rules: {
        equipmentCode: [
            { required: true, message: "设备编码不能为空", trigger: "blur" }
        ],
        equipmentName: [
            { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        host: [
            { required: true, message: "IP地址不能为空", trigger: "blur" },
            { validator: validateIP, trigger: "blur" }
        ],
        port: [
            { required: true, message: "端口不能为空", trigger: "blur" },
            { validator: validatePort, trigger: "blur" }
        ],
    }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询设备主数据列表 */
function getList() {
    loading.value = true
    queryParams.value.params = {}
    if (null != daterangeLastLiveTime && "" != daterangeLastLiveTime) {
        queryParams.value.params["beginLastLiveTime"] = daterangeLastLiveTime.value[0]
        queryParams.value.params["endLastLiveTime"] = daterangeLastLiveTime.value[1]
    }
    if (null != daterangeCreateTime && "" != daterangeCreateTime) {
        queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
        queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
    }
    if (null != daterangeUpdateTime && "" != daterangeUpdateTime) {
        queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0]
        queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1]
    }
    listBasEquipment(queryParams.value).then(response => {
        selectedIds.value = []
        basEquipmentList.value = response.rows.map(eq => ({
            ...eq,
            statusChanged: false,
            selected: selectedIds.value.includes(eq.id),
            imageUrl: `${imageUrl.value}${eq.id}?Authorization=Bearer ${getToken()}&t=${Date.now()}`
        }))

        total.value = response.total
        loading.value = false

    })
}
// 校验IP
function validateIP(rule, value, callback) {
    // 简单的IPv4校验
    const ipReg = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
    if (!value) {
        callback()
    } else if (!ipReg.test(value)) {
        callback(new Error('请输入正确的IP地址'))
    } else {
        callback()
    }
}

// 校验端口
function validatePort(rule, value, callback) {
    // 端口号1-65535
    const port = Number(value)
    if (!value && value !== 0) {
        callback()
    } else if (!Number.isInteger(port) || port < 1 || port > 65535) {
        callback(new Error('请输入1-65535之间的端口号'))
    } else {
        callback()
    }
}

function getStatusTagType(status) {
    const statusMap = {
        '1': 'primary',
        '2': 'danger',
        '3': 'info',
    }
    return statusMap[status] || 'info'
}
function getStatusText(statusValue) {
    if (statusValue == 1) {
        return '正常'
    } if (statusValue == 2) {
        return '异常'
    } if (statusValue == 3) {
        return '离线'
    }
    return '未知状态'
}
// 选择卡片
function handleSelectChange(val, id) {
    const equipment = basEquipmentList.value.find(item => item.id === id)
    if (equipment) {
        equipment.selected = val
    }
    if (val) {
        if (!selectedIds.value.includes(id)) {
            selectedIds.value.push(id)
        }
    } else {
        selectedIds.value = selectedIds.value.filter(_id => _id !== id)
    }
}


// 取消按钮
function cancel() {
    open.value = false
    reset()
}

// 表单重置
function reset() {
    form.value = {
        id: undefined,
        equipmentCode: undefined,
        equipmentName: undefined,
        status: undefined,
        host: undefined,
        port: undefined,
        comProtocol: undefined,
        info: undefined,
        imageFile: undefined,
    }
    proxy.resetForm("basEquipmentRef")
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
    daterangeLastLiveTime.value = []
    daterangeCreateTime.value = []
    daterangeUpdateTime.value = []
    proxy.resetForm("queryRef")
    handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
    reset()
    open.value = true
    title.value = "添加设备主数据"
}

/** 修改按钮操作 */
function handleBatchEdit() {
    if (selectedIds.value.length !== 1) {
        proxy.$modal.msgWarning('请选择一条设备进行编辑')
        return
    }
    const row = basEquipmentList.value.find(item => item.id === selectedIds.value[0])
    if (row) handleUpdate(row)
}


function handleUpdate(row) {
    loading.value = true
    reset()
    const _id = row.id || ids.value
    getBasEquipment(_id).then(response => {
        loading.value = false
        filterKey(form.value, response.data)
        open.value = true
        title.value = "修改设备主数据"
        previewUrl.value = response.data.hasImage ? getImageUrl(_id) : ''
    })
}
function getImageUrl(id) {
    return `${imageUrl.value}${id}?Authorization=Bearer ${getToken()}&t=${Date.now()}`
}

// 全选
function toggleSelectAll() {
    const allSelected = selectedIds.value.length === basEquipmentList.value.length && basEquipmentList.value.length > 0
    if (allSelected) {
        selectedIds.value = []
        basEquipmentList.value.forEach(item => {
            item.selected = false
        })
    } else {
        selectedIds.value = basEquipmentList.value.map(item => item.id)
        basEquipmentList.value.forEach(item => {
            item.selected = true
        })
    }
}
function // 新增图片删除方法
    removeImage() {
    form.value.imageFile = null
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = ''
}

// 文件选择变化处理
function handleUpload(file) {
    // 生成预览图
    previewUrl.value = URL.createObjectURL(file.raw)
    // 缓存文件对象
    form.value.imageFile = file.raw
}
function beforeUpload(file) {
    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJPGorPNG) {
        proxy.$modal.msgError('上传图片只能是 JPG/PNG 格式!')
        return false
    }
    const isLt2M = file.size / 1024 / 1024 <= 2
    if (!isLt2M) {
        proxy.$modal.msgError('上传图片大小不能超过 2MB!')
        return false
    }
    return true
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["basEquipmentRef"].validate(valid => {
        if (valid) {
            if (form.value.imageFile instanceof File) {
                const isLt2M = form.value.imageFile.size / 1024 / 1024 <= 2
                if (!isLt2M) {
                    proxy.$modal.msgError('上传图片大小不能超过 2MB!')
                    return
                }
            }
            buttonLoading.value = true
            // 统一使用FormData方式提交
            const formData = new FormData()
            // 添加所有表单字段
            Object.keys(form.value).forEach(key => {
                if (key === 'imageFile') {
                    if (form.value.imageFile instanceof File) {
                        // 上传新图片
                        formData.append('imageFile', form.value.imageFile)
                    } else if (!previewUrl.value) {
                        // 设置标志表示删除原图片
                        formData.append('deleteImage', 'true')
                    }
                } else if (form.value[key] !== undefined && form.value[key] !== null) {
                    formData.append(key, form.value[key])
                }
            })

            const request = form.value.id != null ? updateBasEquipment : addBasEquipment
            request(formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    proxy.$modal.msgSuccess(form.value.id != null ? "修改成功" : "新增成功")
                    open.value = false
                    getList()
                })
                .finally(() => {
                    buttonLoading.value = false
                })
        }
    })
}


/** 删除按钮操作 */
function handleDelete(row) {
    const _ids = row.id || ids.value
    proxy.$modal
        .confirm('是否确认删除设备主数据编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true
            return delBasEquipment(_ids)
        })
        .then(() => {
            loading.value = true
            getList()
            proxy.$modal.msgSuccess("删除成功")
        })
        .catch(() => { })
        .finally(() => {
            loading.value = false
        })
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download(
        "bas/basEquipment/export",
        {
            ...queryParams.value
        },
        `设备主数据_${new Date().getTime()}.xlsx`
    )
}

getList();
</script>

<style lang="scss" scoped>
.equipment-grid {
    display: grid;
    grid-template-columns: repeat(
        auto-fill,
        minmax(430px, 1fr)
    ); /* 调整最小宽度以便容纳图片 */
    gap: 10px;
}

.preview-image {
    position: relative;
    max-width: 100px;
    margin-top: 20px;
    .image {
        width: 100%;
    }
    .delete-tip {
        display: inline-block;
        position: absolute;
        right: -20px;
        top: -20px;
        cursor: pointer;
    }
}
.equipment-card {
    background-color: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex; /* 使用flex布局使图片和信息部分能更好配合 */
    flex-direction: column; /* 整体卡片内容垂直排列 */
    position: relative;

    &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
    }

    .card-header {
        background-color: #fcfcfc;
        padding: 10px 15px; // 调整内边距
        border-bottom: 1px solid #f0f0f0;
        .equipment-name {
            font-size: 15px; // 调整字号
            font-weight: 600;
            color: #303133;
            i {
                color: #409eff;
                margin-right: 6px;
            }
        }
        .el-tag {
            font-weight: 500;
        }
    }

    .card-body {
        padding: 15px; // 调整内边距
        font-size: 13px; // 调整字号
        line-height: 1.7;
        display: flex; /* body内部也用flex，方便图片和文字信息左右排列 */
        flex-grow: 1; /* 让body占据剩余空间 */
    }

    .equipment-image-container {
        width: 100px; /* 图片容器固定宽度 */
        min-width: 100px; /* 防止被压缩 */
        height: 100px; /* 图片容器固定高度 */
        margin-right: 15px; /* 图片与右侧信息的间距 */
        border-radius: 6px; /* 图片容器圆角 */
        overflow: hidden; /* 确保图片不超出容器 */
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f7fa; // 图片区域浅背景色
    }

    .equipment-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover; /* 裁剪并填充，保持比例 */
        display: block; // 移除图片底部空隙
    }

    .equipment-no-image-icon {
        font-size: 48px; // 调整占位图标大小
        color: #dcdfe6; // 占位图标颜色
    }

    .equipment-info-content {
        // 包裹右侧所有文字信息
        flex-grow: 1; // 占据剩余空间
        display: flex;
        flex-direction: column; // 信息项垂直排列
        justify-content: space-between; // 让信息项在垂直方向上均匀分布
    }

    .info-item {
        display: flex;
        margin-bottom: 8px; // 信息项间距
        &:last-child {
            margin-bottom: 0;
        }
        .info-label {
            color: #888;
            width: 75px; // 调整标签宽度
            flex-shrink: 0;
            font-size: 12px; // 调整标签字号
        }
        .info-value {
            color: #555;
            flex-grow: 1;
            word-break: break-all;
            &.remark-value {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: block;
            }
        }
    }

    .card-footer {
        background-color: #fdfdfd;
        padding: 8px 15px; // 调整内边距
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px; // 调整字号
        color: #999;
        border-top: 1px solid #f0f0f0;
        flex-shrink: 0; // 防止footer被压缩

        .status-indicator {
            display: flex;
            align-items: center;
            font-weight: 500;
            .indicator-dot {
                width: 8px; // 调整大小
                height: 8px;
                border-radius: 50%;
                margin-right: 5px;
                background-color: #c0c4cc;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
                &.dot-online {
                    background-color: #67c23a;
                    box-shadow: 0 0 5px #67c23a;
                }
                &.dot-offline {
                    background-color: #f56c6c;
                    box-shadow: 0 0 5px #f56c6c;
                }
                &.dot-maintenance {
                    background-color: #e6a23c;
                    box-shadow: 0 0 5px #e6a23c;
                }
            }
        }
        .update-time {
            font-style: italic;
        }
    }

    .card-ops {
        position: absolute;
        top: 8px;
        left: 8px;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 4px;
        .el-checkbox {
            margin-right: 4px;
        }
    }
}

/* 上传组件样式 */
.equipment-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px; /* 上传区域大小 */
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.equipment-uploader .el-upload:hover {
    border-color: #409eff;
}
.equipment-uploader-icon {
    font-size: 28px;
    color: #8c939d;
}
.equipment-avatar-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 状态变化动画 */
.status-changed-animation {
    animation: subtle-glow 1.2s ease-out;
}

@keyframes subtle-glow {
    0%,
    100% {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    50% {
        box-shadow: 0 6px 20px rgba(64, 158, 255, 0.25),
            0 0 8px rgba(64, 158, 255, 0.15) inset;
    }
}
</style>

