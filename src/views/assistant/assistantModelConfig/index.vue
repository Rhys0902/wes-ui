<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="88px">
      <el-form-item label="模型名称" prop="displayName">
        <el-input v-model="queryParams.displayName" placeholder="请输入模型名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商" prop="provider">
        <el-select v-model="queryParams.provider" placeholder="请选择供应商" clearable>
          <el-option v-for="dict in assistant_model_provider" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="模型类型" prop="modelType">
        <el-select v-model="queryParams.modelType" placeholder="请选择模型类型" clearable>
          <el-option v-for="dict in assistant_model_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-hasPermi="['assistant:assistantModelConfig:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-hasPermi="['assistant:assistantModelConfig:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-hasPermi="['assistant:assistantModelConfig:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="modelConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模型名称" prop="displayName" min-width="150" />
      <el-table-column label="供应商" prop="provider" width="120">
        <template #default="scope">
          <dict-tag :options="assistant_model_provider" :value="scope.row.provider" />
        </template>
      </el-table-column>
      <el-table-column label="协议" prop="protocol" width="110">
        <template #default="scope">
          <dict-tag :options="assistant_model_protocol" :value="scope.row.protocol" />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="modelType" width="110">
        <template #default="scope">
          <dict-tag :options="assistant_model_type" :value="scope.row.modelType" />
        </template>
      </el-table-column>
      <el-table-column label="模型标识" prop="modelName" min-width="160" />
      <el-table-column label="启用" prop="enabled" width="90">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-value="Y"
            inactive-value="N"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="默认" prop="defaultFlag" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.defaultFlag === 'Y'" type="success">默认</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="测试状态" prop="testStatus" width="110">
        <template #default="scope">
          <dict-tag :options="assistant_model_test_status" :value="scope.row.testStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-hasPermi="['assistant:assistantModelConfig:test']" link type="primary" icon="Connection" @click="handleTest(scope.row)">测试</el-button>
          <el-button v-hasPermi="['assistant:assistantModelConfig:setDefault']" link type="primary" icon="Star" @click="handleSetDefault(scope.row)">默认</el-button>
          <el-button v-hasPermi="['assistant:assistantModelConfig:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-hasPermi="['assistant:assistantModelConfig:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />

    <el-dialog v-model="open" :title="title" width="720px" append-to-body>
      <el-form ref="modelConfigRef" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="供应商" prop="provider">
              <el-select v-model="form.provider" placeholder="请选择供应商">
                <el-option v-for="dict in assistant_model_provider" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="协议" prop="protocol">
              <el-select v-model="form.protocol" placeholder="请选择协议">
                <el-option v-for="dict in assistant_model_protocol" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型类型" prop="modelType">
              <el-select v-model="form.modelType" placeholder="请选择模型类型">
                <el-option v-for="dict in assistant_model_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示名称" prop="displayName">
              <el-input v-model="form.displayName" placeholder="例如：通义千问 Plus" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型标识" prop="modelName">
              <el-input v-model="form.modelName" placeholder="例如：qwen-plus" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Base URL" prop="baseUrl">
              <el-input v-model="form.baseUrl" placeholder="本地或兼容协议可填写" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API Key" prop="apiKey">
              <el-input v-model="form.apiKey" type="password" show-password :placeholder="form.id ? '不填则保持原密钥' : '请输入API Key'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API Secret" prop="apiSecret">
              <el-input v-model="form.apiSecret" type="password" show-password placeholder="可选" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="温度" prop="temperature">
              <el-input-number v-model="form.temperature" :min="0" :max="2" :step="0.1" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大Token" prop="maxTokens">
              <el-input-number v-model="form.maxTokens" :min="1" :max="32000" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="超时秒数" prop="timeoutSeconds">
              <el-input-number v-model="form.timeoutSeconds" :min="5" :max="600" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流式输出" prop="supportStream">
              <el-switch v-model="form.supportStream" active-value="Y" inactive-value="N" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启用" prop="enabled">
              <el-switch v-model="form.enabled" active-value="Y" inactive-value="N" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="默认模型" prop="defaultFlag">
              <el-switch v-model="form.defaultFlag" active-value="Y" inactive-value="N" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="AssistantModelConfig">
import {
  listAssistantModelConfig,
  getAssistantModelConfig,
  addAssistantModelConfig,
  updateAssistantModelConfig,
  delAssistantModelConfig,
  testAssistantModelConfig,
  setDefaultAssistantModelConfig,
  changeAssistantModelConfigStatus
} from '@/api/assistant/assistantModelConfig'

const { proxy } = getCurrentInstance()
const {
  assistant_model_provider,
  assistant_model_protocol,
  assistant_model_type,
  assistant_model_test_status
} = proxy.useDict(
  'assistant_model_provider',
  'assistant_model_protocol',
  'assistant_model_type',
  'assistant_model_test_status'
)

const modelConfigList = ref([])
const open = ref(false)
const loading = ref(true)
const buttonLoading = ref(false)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    displayName: undefined,
    provider: undefined,
    protocol: undefined,
    modelType: undefined,
    enabled: undefined
  },
  rules: {
    provider: [{ required: true, message: '供应商不能为空', trigger: 'change' }],
    protocol: [{ required: true, message: '协议不能为空', trigger: 'change' }],
    modelType: [{ required: true, message: '模型类型不能为空', trigger: 'change' }],
    displayName: [{ required: true, message: '显示名称不能为空', trigger: 'blur' }],
    modelName: [{ required: true, message: '模型标识不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

// 查询模型配置列表，所有筛选条件都来自queryParams，保持和WES列表页写法一致。
function getList() {
  loading.value = true
  listAssistantModelConfig(queryParams.value).then(response => {
    modelConfigList.value = response.rows || []
    total.value = response.total
    loading.value = false
  })
}

// 关闭弹窗并重置表单，避免下一次打开沿用上一次编辑状态。
function cancel() {
  open.value = false
  reset()
}

// 初始化模型配置表单默认值；默认选择通义千问DashScope对话模型。
function reset() {
  form.value = {
    id: undefined,
    provider: 'QWEN',
    protocol: 'DASHSCOPE',
    modelType: 'CHAT',
    displayName: undefined,
    modelName: undefined,
    baseUrl: undefined,
    apiKey: undefined,
    apiSecret: undefined,
    temperature: 0.7,
    maxTokens: 2048,
    timeoutSeconds: 60,
    supportStream: 'Y',
    supportToolCall: 'N',
    supportJsonMode: 'N',
    enabled: 'Y',
    defaultFlag: 'N',
    remark: undefined
  }
  proxy.resetForm('modelConfigRef')
}

// 查询按钮入口：先回到第一页，再按当前筛选条件重新加载。
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

// 重置搜索表单后复用查询入口，保证分页和列表状态同步。
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

// 表格多选变化时维护按钮禁用状态，兼容单条修改和批量删除。
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 新增配置时先清空表单，再打开编辑弹窗。
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加AI助手模型配置'
}

// 修改配置时不回显密钥明文，用户不填则后端保持原密钥。
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getAssistantModelConfig(_id).then(response => {
    form.value = response.data
    form.value.apiKey = undefined
    form.value.apiSecret = undefined
    open.value = true
    title.value = '修改AI助手模型配置'
  })
}

// 新增/修改统一提交入口，表单校验通过后按是否存在ID选择对应接口。
function submitForm() {
  proxy.$refs.modelConfigRef.validate(valid => {
    if (!valid) {
      return
    }
    buttonLoading.value = true
    const request = form.value.id ? updateAssistantModelConfig(form.value) : addAssistantModelConfig(form.value)
    request.then(() => {
      proxy.$modal.msgSuccess(form.value.id ? '修改成功' : '新增成功')
      open.value = false
      getList()
    }).finally(() => {
      buttonLoading.value = false
    })
  })
}

// 删除模型配置需要用户确认，避免误删全系统共享的模型连接信息。
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm(`是否确认删除AI助手模型配置编号为 "${_ids}" 的数据项？`).then(() => {
    return delAssistantModelConfig(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

// 调用后端测试接口验证模型供应商、协议、Base URL和密钥是否可用。
function handleTest(row) {
  testAssistantModelConfig(row.id).then(response => {
    const data = response.data
    if (data.testStatus === 'SUCCESS') {
      proxy.$modal.msgSuccess('连接测试成功')
    } else {
      proxy.$modal.msgError(data.testMessage || '连接测试失败')
    }
    getList()
  })
}

// 将某个聊天模型设置为系统默认模型；同一模型类型只允许一个默认项。
function handleSetDefault(row) {
  setDefaultAssistantModelConfig(row.id).then(() => {
    proxy.$modal.msgSuccess('默认模型设置成功')
    getList()
  })
}

// 启用状态切换失败时回滚开关值，保证页面状态和后端状态一致。
function handleStatusChange(row) {
  changeAssistantModelConfigStatus({ id: row.id, enabled: row.enabled }).then(() => {
    proxy.$modal.msgSuccess('状态修改成功')
  }).catch(() => {
    row.enabled = row.enabled === 'Y' ? 'N' : 'Y'
  })
}

getList()
</script>
