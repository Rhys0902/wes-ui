<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="知识文档" name="doc">
        <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="88px">
          <el-form-item label="文档标题" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入文档标题" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="原始文件" prop="originalName">
            <el-input v-model="queryParams.originalName" placeholder="请输入原始文件名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="文档状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择文档状态" clearable>
              <el-option v-for="dict in assistant_knowledge_doc_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="重复状态" prop="duplicateStatus">
            <el-select v-model="queryParams.duplicateStatus" placeholder="请选择重复状态" clearable>
              <el-option label="无重复" value="NONE" />
              <el-option label="疑似重复" value="SUSPECTED" />
              <el-option label="重复拦截" value="DUPLICATE" />
            </el-select>
          </el-form-item>
          <el-form-item label="版本状态" prop="versionStatus">
            <el-select v-model="queryParams.versionStatus" placeholder="请选择版本状态" clearable>
              <el-option label="当前版本" value="CURRENT" />
              <el-option label="历史版本" value="HISTORY" />
              <el-option label="疑似版本" value="SUSPECTED" />
              <el-option label="废弃版本" value="OBSOLETE" />
            </el-select>
          </el-form-item>
          <el-form-item label="可见范围" prop="visibility">
            <el-select v-model="queryParams.visibility" placeholder="请选择可见范围" clearable>
              <el-option v-for="item in visibilityOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-upload
              v-hasPermi="['assistant:assistantKnowledge:upload']"
              :show-file-list="false"
              :http-request="handleUpload"
              :before-upload="beforeUpload"
            >
              <el-button type="primary" plain icon="Upload" :loading="uploading">上传文档</el-button>
            </el-upload>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['assistant:assistantKnowledge:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getDocList" />
        </el-row>

        <el-table v-loading="loading" :data="docList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="文档标题" prop="title" min-width="180" show-overflow-tooltip />
          <el-table-column label="原始文件" prop="originalName" min-width="180" show-overflow-tooltip />
          <el-table-column label="文件类型" prop="fileSuffix" width="90" />
          <el-table-column label="解析器" prop="parserType" width="110">
            <template #default="scope">
              <dict-tag :options="assistant_knowledge_parser_type" :value="scope.row.parserType" />
            </template>
          </el-table-column>
          <el-table-column label="解析质量" prop="qualityLevel" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.qualityLevel" :type="qualityTagType(scope.row.qualityLevel)">
                {{ qualityLabel(scope.row.qualityLevel) }}
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="110">
            <template #default="scope">
              <dict-tag :options="assistant_knowledge_doc_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="切片数" prop="chunkCount" width="90" />
          <el-table-column label="重复状态" prop="duplicateStatus" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.duplicateStatus" :type="duplicateTagType(scope.row.duplicateStatus)">
                {{ duplicateLabel(scope.row.duplicateStatus) }}
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="版本状态" prop="versionStatus" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.versionStatus" :type="versionTagType(scope.row.versionStatus)">
                {{ versionLabel(scope.row.versionStatus) }}
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="可见范围" prop="visibility" width="150">
            <template #default="scope">
              <el-tag :type="visibilityTagType(scope.row.visibility)">
                {{ visibilityLabel(scope.row.visibility) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="170" />
          <el-table-column label="错误信息" prop="errorMessage" min-width="200" show-overflow-tooltip />
          <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button v-hasPermi="['assistant:assistantKnowledge:query']" link type="primary" icon="View" @click="handleDetail(scope.row)">详情</el-button>
              <el-button v-hasPermi="['assistant:assistantKnowledge:edit']" link type="primary" icon="Lock" @click="handleVisibility(scope.row)">权限设置</el-button>
              <el-button v-hasPermi="['assistant:assistantKnowledge:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          :total="total"
          @pagination="getDocList"
        />
      </el-tab-pane>

      <el-tab-pane label="入库任务" name="task">
        <el-form v-show="showTaskSearch" ref="taskQueryRef" :model="taskQueryParams" :inline="true" label-width="88px">
          <el-form-item label="文档ID" prop="docId">
            <el-input v-model="taskQueryParams.docId" placeholder="请输入文档ID" clearable @keyup.enter="handleTaskQuery" />
          </el-form-item>
          <el-form-item label="任务状态" prop="status">
            <el-select v-model="taskQueryParams.status" placeholder="请选择任务状态" clearable>
              <el-option v-for="dict in assistant_knowledge_task_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleTaskQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetTaskQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showTaskSearch" @queryTable="getTaskList" />
        </el-row>

        <el-table v-loading="taskLoading" :data="taskList">
          <el-table-column label="任务ID" prop="id" width="170" show-overflow-tooltip />
          <el-table-column label="文档ID" prop="docId" width="170" show-overflow-tooltip />
          <el-table-column label="状态" prop="status" width="110">
            <template #default="scope">
              <dict-tag :options="assistant_knowledge_task_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="进度" prop="progress" width="160">
            <template #default="scope">
              <el-progress :percentage="scope.row.progress || 0" />
            </template>
          </el-table-column>
          <el-table-column label="当前步骤" prop="currentStep" min-width="180" show-overflow-tooltip />
          <el-table-column label="解析器" prop="parserType" width="110">
            <template #default="scope">
              <dict-tag :options="assistant_knowledge_parser_type" :value="scope.row.parserType" />
            </template>
          </el-table-column>
          <el-table-column label="开始时间" prop="startTime" width="170" />
          <el-table-column label="结束时间" prop="endTime" width="170" />
          <el-table-column label="错误信息" prop="errorMessage" min-width="220" show-overflow-tooltip />
          <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button v-hasPermi="['assistant:assistantKnowledge:task:retry']" link type="primary" icon="RefreshRight" @click="handleRetry(scope.row)">重试</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="taskTotal > 0"
          v-model:page="taskQueryParams.pageNum"
          v-model:limit="taskQueryParams.pageSize"
          :total="taskTotal"
          @pagination="getTaskList"
        />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="detailOpen" title="知识库文档详情" width="1080px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="文档ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <dict-tag :options="assistant_knowledge_doc_status" :value="detail.status" />
        </el-descriptions-item>
        <el-descriptions-item label="文档标题">{{ detail.title }}</el-descriptions-item>
        <el-descriptions-item label="原始文件">{{ detail.originalName }}</el-descriptions-item>
        <el-descriptions-item label="文件类型">{{ detail.fileSuffix }}</el-descriptions-item>
        <el-descriptions-item label="切片数">{{ detail.chunkCount }}</el-descriptions-item>
        <el-descriptions-item label="解析质量">
          <el-tag v-if="detail.qualityLevel" :type="qualityTagType(detail.qualityLevel)">
            {{ qualityLabel(detail.qualityLevel) }}
          </el-tag>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="质量分">{{ emptyText(detail.qualityScore) }}</el-descriptions-item>
        <el-descriptions-item label="重复状态">
          <el-tag v-if="detail.duplicateStatus" :type="duplicateTagType(detail.duplicateStatus)">
            {{ duplicateLabel(detail.duplicateStatus) }}
          </el-tag>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="重复相似度">{{ formatRatio(detail.duplicateSimilarity) }}</el-descriptions-item>
        <el-descriptions-item label="相似文档ID">{{ emptyText(detail.duplicateDocId) }}</el-descriptions-item>
        <el-descriptions-item label="版本状态">
          <el-tag v-if="detail.versionStatus" :type="versionTagType(detail.versionStatus)">
            {{ versionLabel(detail.versionStatus) }}
          </el-tag>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="可见范围">
          <el-tag :type="visibilityTagType(detail.visibility)">
            {{ visibilityLabel(detail.visibility) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="版本号">{{ emptyText(detail.versionNo) }}</el-descriptions-item>
        <el-descriptions-item label="归属用户">{{ emptyText(detail.ownerUserId) }}</el-descriptions-item>
        <el-descriptions-item label="归属部门">{{ emptyText(detail.ownerDeptId) }}</el-descriptions-item>
        <el-descriptions-item label="允许角色" :span="2">{{ emptyText(detail.allowedRoleKeys) }}</el-descriptions-item>
        <el-descriptions-item label="版本组">{{ emptyText(detail.versionGroupKey) }}</el-descriptions-item>
        <el-descriptions-item label="权威文档ID">{{ emptyText(detail.canonicalDocId) }}</el-descriptions-item>
        <el-descriptions-item label="替代文档ID">{{ emptyText(detail.supersededByDocId) }}</el-descriptions-item>
        <el-descriptions-item label="文本长度">{{ emptyText(detail.textLength) }}</el-descriptions-item>
        <el-descriptions-item label="原始行数">{{ emptyText(detail.lineCount) }}</el-descriptions-item>
        <el-descriptions-item label="乱码比例">{{ formatRatio(detail.garbledRatio) }}</el-descriptions-item>
        <el-descriptions-item label="空白比例">{{ formatRatio(detail.blankRatio) }}</el-descriptions-item>
        <el-descriptions-item label="表格行数">{{ emptyText(detail.tableLikeLineCount) }}</el-descriptions-item>
        <el-descriptions-item label="解析完成">{{ detail.parsedTime }}</el-descriptions-item>
        <el-descriptions-item label="入库完成">{{ detail.indexedTime }}</el-descriptions-item>
        <el-descriptions-item label="质量说明" :span="2">{{ detail.qualityMessage || '-' }}</el-descriptions-item>
        <el-descriptions-item label="去重说明" :span="2">{{ detail.duplicateMessage || '-' }}</el-descriptions-item>
        <el-descriptions-item label="版本说明" :span="2">{{ detail.versionMessage || '-' }}</el-descriptions-item>
        <el-descriptions-item label="错误信息" :span="2">{{ detail.errorMessage }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">切片明细</el-divider>
      <el-table v-loading="chunkLoading" :data="chunkList" border max-height="360">
        <el-table-column label="序号" prop="chunkNo" width="80" align="center" />
        <el-table-column label="父块ID" prop="parentId" width="170" show-overflow-tooltip />
        <el-table-column label="章节路径" prop="sectionPath" min-width="180" show-overflow-tooltip />
        <el-table-column label="块类型" prop="blockType" width="100" align="center" />
        <el-table-column label="状态" prop="status" width="110">
          <template #default="scope">
            <el-tag :type="chunkStatusTagType(scope.row)">
              {{ chunkStatusLabel(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Token" prop="tokenCount" width="90" align="center" />
        <el-table-column label="重复状态" prop="duplicateStatus" width="110">
          <template #default="scope">
            <el-tag v-if="scope.row.duplicateStatus" :type="duplicateTagType(scope.row.duplicateStatus)">
              {{ duplicateLabel(scope.row.duplicateStatus) }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="重复相似度" width="110" align="center">
          <template #default="scope">{{ formatRatio(scope.row.duplicateSimilarity) }}</template>
        </el-table-column>
        <el-table-column label="相似切片ID" prop="duplicateChunkId" min-width="160" show-overflow-tooltip />
        <el-table-column label="向量模型" prop="embeddingModel" min-width="150" show-overflow-tooltip />
        <el-table-column label="向量维度" prop="embeddingDimension" width="100" align="center" />
        <el-table-column label="策略版本" prop="chunkStrategyVersion" width="110" align="center" />
        <el-table-column label="向量点ID" prop="vectorId" min-width="180" show-overflow-tooltip />
        <el-table-column label="去重说明" prop="duplicateMessage" min-width="220" show-overflow-tooltip />
        <el-table-column label="切片内容" prop="content" min-width="360" show-overflow-tooltip />
        <el-table-column label="错误信息" prop="errorMessage" min-width="180" show-overflow-tooltip />
      </el-table>
      <pagination
        v-show="chunkTotal > 0"
        v-model:page="chunkQueryParams.pageNum"
        v-model:limit="chunkQueryParams.pageSize"
        :total="chunkTotal"
        @pagination="getChunkList"
      />
    </el-dialog>

    <el-dialog v-model="visibilityOpen" title="知识库文档权限设置" width="560px" append-to-body>
      <el-form ref="visibilityRef" :model="visibilityForm" label-width="96px">
        <el-form-item label="文档标题">
          <el-input v-model="visibilityForm.title" disabled />
        </el-form-item>
        <el-form-item label="可见范围" prop="visibility" required>
          <el-radio-group v-model="visibilityForm.visibility">
            <el-radio-button v-for="item in visibilityOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="visibilityForm.visibility === 'PRIVATE'" label="归属用户">
          <el-input v-model="visibilityForm.ownerUserId" placeholder="留空表示当前登录用户" clearable />
          <div class="form-tip">留空时后端会使用当前登录用户作为私有归属用户。</div>
        </el-form-item>
        <el-form-item v-if="visibilityForm.visibility === 'DEPT'" label="可见部门" required>
          <el-tree-select
            v-model="visibilityForm.ownerDeptId"
            :data="deptOptions"
            :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
            value-key="deptId"
            placeholder="请选择可见部门"
            check-strictly
            filterable
            clearable
          />
        </el-form-item>
        <el-form-item v-if="visibilityForm.visibility === 'ROLE'" label="可见角色" required>
          <el-select v-model="visibilityForm.allowedRoleKeys" multiple filterable clearable placeholder="请选择可见角色">
            <el-option
              v-for="role in roleOptions"
              :key="role.roleKey"
              :label="`${role.roleName}（${role.roleKey}）`"
              :value="role.roleKey"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visibilityOpen = false">取 消</el-button>
          <el-button type="primary" :loading="visibilitySaving" @click="submitVisibility">保 存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="AssistantKnowledge">
import {
  listAssistantKnowledge,
  getAssistantKnowledge,
  listAssistantKnowledgeChunk,
  uploadAssistantKnowledge,
  updateAssistantKnowledgeVisibility,
  delAssistantKnowledge,
  listAssistantKnowledgeTask,
  retryAssistantKnowledgeTask
} from '@/api/assistant/assistantKnowledge'
import { listDept } from '@/api/system/dept'
import { listRole } from '@/api/system/role'

const { proxy } = getCurrentInstance()
const {
  assistant_knowledge_doc_status,
  assistant_knowledge_task_status,
  assistant_knowledge_parser_type,
  assistant_knowledge_chunk_status
} = proxy.useDict(
  'assistant_knowledge_doc_status',
  'assistant_knowledge_task_status',
  'assistant_knowledge_parser_type',
  'assistant_knowledge_chunk_status'
)

const activeTab = ref('doc')
const loading = ref(true)
const taskLoading = ref(false)
const chunkLoading = ref(false)
const uploading = ref(false)
const showSearch = ref(true)
const showTaskSearch = ref(true)
const multiple = ref(true)
const ids = ref([])
const docList = ref([])
const taskList = ref([])
const chunkList = ref([])
const total = ref(0)
const taskTotal = ref(0)
const chunkTotal = ref(0)
const detailOpen = ref(false)
const detail = ref({})
const visibilityOpen = ref(false)
const visibilitySaving = ref(false)
const deptOptions = ref([])
const roleOptions = ref([])

const visibilityOptions = [
  { label: '公开', value: 'PUBLIC' },
  { label: '仅自己', value: 'PRIVATE' },
  { label: '指定部门', value: 'DEPT' },
  { label: '指定角色', value: 'ROLE' }
]

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    originalName: undefined,
    status: undefined,
    duplicateStatus: undefined,
    versionStatus: undefined,
    visibility: undefined
  },
  taskQueryParams: {
    pageNum: 1,
    pageSize: 10,
    docId: undefined,
    status: undefined
  },
  chunkQueryParams: {
    pageNum: 1,
    pageSize: 10,
    docId: undefined
  },
  visibilityForm: {
    id: undefined,
    title: undefined,
    visibility: 'PUBLIC',
    ownerUserId: undefined,
    ownerDeptId: undefined,
    allowedRoleKeys: []
  }
})

const { queryParams, taskQueryParams, chunkQueryParams, visibilityForm } = toRefs(data)

// 查询知识库文档列表；P1-1主要用它验证上传后文档是否成功落库。
function getDocList() {
  loading.value = true
  listAssistantKnowledge(queryParams.value).then(response => {
    docList.value = response.rows || []
    total.value = response.total
    loading.value = false
  })
}

// 查询入库任务列表；上传后可在这里观察 PENDING/RUNNING/SUCCESS/FAILED 流转。
function getTaskList() {
  taskLoading.value = true
  listAssistantKnowledgeTask(taskQueryParams.value).then(response => {
    taskList.value = response.rows || []
    taskTotal.value = response.total
    taskLoading.value = false
  })
}

// 查询当前文档的切片明细；用于确认解析文本、父子分块关系和向量点是否真实写入。
function getChunkList() {
  if (!chunkQueryParams.value.docId) {
    chunkList.value = []
    chunkTotal.value = 0
    return
  }
  chunkLoading.value = true
  listAssistantKnowledgeChunk(chunkQueryParams.value).then(response => {
    chunkList.value = response.rows || []
    chunkTotal.value = response.total
  }).finally(() => {
    chunkLoading.value = false
  })
}

// 切换页签时懒加载任务列表，避免进入页面时发起不必要请求。
function handleTabChange(tabName) {
  if (tabName === 'task') {
    getTaskList()
  }
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getDocList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function handleTaskQuery() {
  taskQueryParams.value.pageNum = 1
  getTaskList()
}

function resetTaskQuery() {
  proxy.resetForm('taskQueryRef')
  handleTaskQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  multiple.value = !selection.length
}

// 上传前只做轻量校验；真实格式支持以服务端解析器为准。
function beforeUpload(file) {
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    proxy.$modal.msgError('单个文档不能超过 50MB')
    return false
  }
  return true
}

// 自定义上传可以复用项目 request 拦截器，保持 token、错误处理和 R<T> 响应一致。
function handleUpload(option) {
  uploading.value = true
  uploadAssistantKnowledge(option.file).then(() => {
    proxy.$modal.msgSuccess('上传成功，已提交入库任务')
    getDocList()
    if (activeTab.value === 'task') {
      getTaskList()
    }
  }).finally(() => {
    uploading.value = false
  })
}

function handleDetail(row) {
  getAssistantKnowledge(row.id).then(response => {
    detail.value = response.data || {}
    chunkQueryParams.value.docId = row.id
    chunkQueryParams.value.pageNum = 1
    getChunkList()
    detailOpen.value = true
  })
}

function handleVisibility(row) {
  visibilityForm.value = {
    id: row.id,
    title: row.title,
    visibility: normalizeVisibility(row.visibility),
    ownerUserId: row.ownerUserId,
    ownerDeptId: row.ownerDeptId,
    allowedRoleKeys: splitRoleKeys(row.allowedRoleKeys)
  }
  visibilityOpen.value = true
  loadVisibilityOptions()
}

function submitVisibility() {
  if (!validateVisibilityForm()) {
    return
  }
  const form = visibilityForm.value
  const data = {
    visibility: form.visibility,
    ownerUserId: form.visibility === 'PRIVATE' ? (form.ownerUserId || undefined) : undefined,
    ownerDeptId: form.visibility === 'DEPT' ? form.ownerDeptId : undefined,
    allowedRoleKeys: form.visibility === 'ROLE' ? form.allowedRoleKeys : []
  }
  visibilitySaving.value = true
  updateAssistantKnowledgeVisibility(form.id, data).then(() => {
    proxy.$modal.msgSuccess('权限设置已保存')
    visibilityOpen.value = false
    getDocList()
  }).finally(() => {
    visibilitySaving.value = false
  })
}

function validateVisibilityForm() {
  if (visibilityForm.value.visibility === 'DEPT' && !visibilityForm.value.ownerDeptId) {
    proxy.$modal.msgError('请选择可见部门')
    return false
  }
  if (visibilityForm.value.visibility === 'ROLE' && !visibilityForm.value.allowedRoleKeys.length) {
    proxy.$modal.msgError('请选择可见角色')
    return false
  }
  return true
}

function loadVisibilityOptions() {
  if (!deptOptions.value.length) {
    listDept({ status: '0' }).then(response => {
      deptOptions.value = proxy.handleTree(response.data || [], 'deptId')
    })
  }
  if (!roleOptions.value.length) {
    listRole({ pageNum: 1, pageSize: 999, status: '0' }).then(response => {
      roleOptions.value = response.rows || []
    })
  }
}

function handleDelete(row) {
  const deleteIds = row.id || ids.value
  proxy.$modal.confirm('是否确认删除选中的知识库文档？').then(() => {
    return delAssistantKnowledge(deleteIds)
  }).then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getDocList()
    getTaskList()
  })
}

function handleRetry(row) {
  proxy.$modal.confirm('是否确认重试该入库任务？').then(() => {
    return retryAssistantKnowledgeTask(row.id)
  }).then(() => {
    proxy.$modal.msgSuccess('已提交重试')
    getTaskList()
  })
}

// 解析质量等级是后端计算出的技术指标，这里只负责给用户友好展示。
function qualityLabel(level) {
  const labels = {
    GOOD: '良好',
    WARNING: '警告',
    LOW: '低质',
    NEED_OCR: '需OCR'
  }
  return labels[level] || level
}

function qualityTagType(level) {
  const types = {
    GOOD: 'success',
    WARNING: 'warning',
    LOW: 'danger',
    NEED_OCR: 'danger'
  }
  return types[level] || 'info'
}

// 文本软去重状态由后端根据清洗正文计算，这里只负责展示和筛选。
function duplicateLabel(status) {
  const labels = {
    NONE: '无重复',
    SUSPECTED: '疑似重复',
    DUPLICATE: '重复拦截'
  }
  return labels[status] || status
}

function duplicateTagType(status) {
  const types = {
    NONE: 'success',
    SUSPECTED: 'warning',
    DUPLICATE: 'danger'
  }
  return types[status] || 'info'
}

// 版本状态用于后续检索阶段做当前版本优先、历史版本降权。
function versionLabel(status) {
  const labels = {
    CURRENT: '当前版本',
    HISTORY: '历史版本',
    SUSPECTED: '疑似版本',
    OBSOLETE: '废弃版本'
  }
  return labels[status] || status
}

function versionTagType(status) {
  const types = {
    CURRENT: 'success',
    HISTORY: 'info',
    SUSPECTED: 'warning',
    OBSOLETE: 'danger'
  }
  return types[status] || 'info'
}

function visibilityLabel(visibility) {
  const labels = {
    PUBLIC: '公开',
    PRIVATE: '仅自己',
    DEPT: '指定部门',
    ROLE: '指定角色'
  }
  return labels[normalizeVisibility(visibility)] || normalizeVisibility(visibility)
}

function visibilityTagType(visibility) {
  const types = {
    PUBLIC: 'success',
    PRIVATE: 'warning',
    DEPT: 'primary',
    ROLE: 'info'
  }
  return types[normalizeVisibility(visibility)] || 'info'
}

function normalizeVisibility(visibility) {
  return visibility || 'PUBLIC'
}

function splitRoleKeys(roleKeys) {
  if (!roleKeys) {
    return []
  }
  return String(roleKeys).split(',').map(item => item.trim()).filter(Boolean)
}

// 切片状态优先使用后端枚举；兼容旧数据里重复跳过切片状态保存为 0 的情况。
function chunkStatusLabel(row) {
  const status = String(row?.status ?? '')
  const labels = {
    PENDING: '待向量化',
    INDEXED: '已入库',
    SKIPPED: '已跳过',
    FAILED: '失败'
  }
  if (labels[status]) {
    return labels[status]
  }
  if (status === '0' && row?.duplicateStatus === 'DUPLICATE') {
    return '已跳过'
  }
  if (status === '0') {
    return '待向量化'
  }
  return status || '-'
}

function chunkStatusTagType(row) {
  const status = String(row?.status ?? '')
  if (status === 'INDEXED') {
    return 'success'
  }
  if (status === 'SKIPPED' || (status === '0' && row?.duplicateStatus === 'DUPLICATE')) {
    return 'info'
  }
  if (status === 'FAILED') {
    return 'danger'
  }
  return 'warning'
}

function formatRatio(value) {
  if (value === undefined || value === null || value === '') {
    return '-'
  }
  return `${(Number(value) * 100).toFixed(2)}%`
}

function emptyText(value) {
  return value === undefined || value === null || value === '' ? '-' : value
}

getDocList()
</script>
