import { ElMessage, ElMessageBox } from 'element-plus'
import { getAssistantEnabled, sendAssistantChat, stopAssistantChat } from '@/api/assistant/assistantChat'
import { listAssistantModelConfig } from '@/api/assistant/assistantModelConfig'
import { delAssistantSession, listAssistantSession, listAssistantMessages } from '@/api/assistant/assistantSession'
import { connectAssistantSse } from '@/utils/assistantSse'
import { getToken } from '@/utils/auth'
import { groupSession, toIdKey } from './assistantHelpers'

const THINKING_MODE_DEEP = 'DEEP'
const THINKING_MODE_NORMAL = 'NORMAL'
const ASSISTANT_MODE_AUTO = 'AUTO'
const MODEL_TYPE_CHAT = 'CHAT'
const STREAM_FALLBACK_MAX_ATTEMPTS = 120

// 顶部模型选择器只允许选择可生成回复的对话模型；向量模型仅用于知识库入库/检索。
const isChatModel = model => String(model?.modelType || '').toUpperCase() === MODEL_TYPE_CHAT

// 模式值需要与后端 AssistantMode 枚举保持一致，前端只负责传递用户选择。
export const ASSISTANT_MODE_OPTIONS = [
  { value: 'AUTO', label: '自动模式', shortLabel: '自动', desc: '根据问题自动选择通用或WES业务回答' },
  { value: 'WES', label: 'WES业务助手', shortLabel: 'WES', desc: '专注WES/WMS/WCS与仓储业务' },
  { value: 'GENERAL', label: '通用AI助手', shortLabel: '通用', desc: '普通问答、写作、解释和代码思路' }
]

const useAssistantStore = defineStore('assistant', {
  state: () => ({
    assistantEnabled: false,
    assistantEnabledLoaded: false,
    drawerOpen: false,
    connected: false,
    connecting: false,
    connectError: '',
    sessionKeyword: '',
    assistantMode: ASSISTANT_MODE_AUTO,
    assistantModeOptions: ASSISTANT_MODE_OPTIONS,
    sessions: [],
    activeSessionId: undefined,
    messages: [],
    entities: [],
    tools: {
      attachment: true,
      web: false,
      think: true,
      knowledge: false
    },
    modelOptions: [],
    selectedModelId: undefined,
    modelLoading: false,
    inputLoading: false,
    streamingMessageId: undefined,
    streamFallbackTimer: undefined,
    sseReadyPromise: undefined,
    closeSse: undefined,
    sseToken: undefined
  }),

  getters: {
    // 会话列表搜索仅在当前已加载的历史会话中匹配标题和最后一条消息。
    filteredSessions(state) {
      const keyword = state.sessionKeyword.trim().toLowerCase()
      if (!keyword) {
        return state.sessions
      }
      return state.sessions.filter(item => {
        const title = (item.title || '').toLowerCase()
        const lastMessage = (item.lastMessage || '').toLowerCase()
        return title.includes(keyword) || lastMessage.includes(keyword)
      })
    },
    // 按今天、昨天、本周、更早分组，保持侧边栏与消息时间展示口径一致。
    groupedSessions() {
      const groups = [
        { label: '今天', items: [] },
        { label: '昨天', items: [] },
        { label: '本周', items: [] },
        { label: '更早', items: [] }
      ]
      this.filteredSessions.forEach(item => {
        const group = groups.find(row => row.label === groupSession(item))
        group && group.items.push(item)
      })
      return groups.filter(group => group.items.length > 0)
    },
    // 当前模型优先使用用户选择，其次使用管理员配置的默认模型，最后降级为系统占位。
    activeModel(state) {
      const selected = state.modelOptions.find(item => toIdKey(item.id) === toIdKey(state.selectedModelId))
      const defaultModel = state.modelOptions.find(item => item.defaultFlag === 'Y')
      return selected || defaultModel || {
        id: 'system',
        displayName: 'AI 助手 Pro',
        provider: '系统默认',
        modelName: 'system-default',
        defaultFlag: 'Y',
        supportStream: 'Y'
      }
    }
  },

  actions: {
    // 读取后端AI助手总开关；关闭时同步收起抽屉并停止前端入口能力。
    async loadAssistantEnabled() {
      try {
        const res = await getAssistantEnabled()
        this.assistantEnabled = res.data === true
      } catch (error) {
        this.assistantEnabled = false
      } finally {
        this.assistantEnabledLoaded = true
      }
      if (!this.assistantEnabled) {
        this.closeDrawer()
      }
      return this.assistantEnabled
    },
    // 打开助手抽屉时同步拉起三类首屏依赖：SSE连接、可选模型、历史会话。
    async openDrawer() {
      if (!this.assistantEnabledLoaded) {
        await this.loadAssistantEnabled()
      }
      if (!this.assistantEnabled) {
        return
      }
      this.drawerOpen = true
      this.ensureSse().catch(() => {})
      this.loadModelOptions()
      this.loadSessions()
    },
    // 只关闭前端抽屉展示，不主动断开SSE，避免再次打开时重新建连造成消息丢失。
    closeDrawer() {
      this.drawerOpen = false
    },
    // 建立用户级SSE通道；多个入口同时触发时复用同一个Promise，防止重复连接。
    ensureSse() {
      const currentToken = getToken()
      const tokenChanged = this.sseToken && this.sseToken !== currentToken
      if (tokenChanged) {
        this.resetUserScopedState()
      }
      // 全局只保留一个助手SSE连接，避免抽屉多次打开时重复订阅同一用户事件。
      if (this.connected && this.sseToken === currentToken) {
        return Promise.resolve()
      }
      if (this.sseReadyPromise && this.sseToken === currentToken) {
        return this.sseReadyPromise
      }
      if (this.closeSse) {
        this.closeSse()
      }
      this.connected = false
      this.sseReadyPromise = undefined
      this.closeSse = undefined
      this.sseToken = currentToken
      this.connecting = true
      this.connectError = ''
      this.sseReadyPromise = new Promise((resolve, reject) => {
        this.closeSse = connectAssistantSse({
          onEvent: event => this.handleStreamEvent(event),
          onOpen: () => {
            if (this.sseToken !== currentToken) {
              return
            }
            this.connected = true
            this.connecting = false
            this.connectError = ''
            this.sseReadyPromise = undefined
            this.sseToken = currentToken
            resolve()
          },
          onClose: () => {
            if (this.sseToken !== currentToken) {
              return
            }
            this.connected = false
            this.connecting = false
            this.sseReadyPromise = undefined
            this.closeSse = undefined
            this.sseToken = undefined
          },
          onError: error => {
            if (this.sseToken !== currentToken) {
              return
            }
            const message = error?.message || 'SSE连接失败'
            this.connected = false
            this.connecting = false
            this.sseReadyPromise = undefined
            this.closeSse = undefined
            this.sseToken = undefined
            this.connectError = message
            reject(new Error(message))
          }
        })
      })
      return this.sseReadyPromise
    },
    // 登录用户切换时清理用户级助手状态，避免把上个用户的会话ID带给后端。
    resetUserScopedState() {
      this.sessions = []
      this.activeSessionId = undefined
      this.messages = []
      this.entities = []
      this.sessionKeyword = ''
      this.streamingMessageId = undefined
      this.clearStreamFallbackTimer()
      this.inputLoading = false
    },
    // 加载当前用户的历史会话；首次进入时自动打开最近一条会话，保持连续使用体验。
    async loadSessions() {
      const res = await listAssistantSession({ pageNum: 1, pageSize: 30 })
      this.sessions = res.rows || []
      if (!this.activeSessionId && this.sessions.length > 0) {
        this.activeSessionId = this.sessions[0].id
        await this.loadMessages(this.activeSessionId)
      }
    },
    // 加载系统启用的模型配置；只加载一次，后续切换直接使用本地缓存。
    async loadModelOptions() {
      if (this.modelLoading || this.modelOptions.length > 0) {
        return
      }
      this.modelLoading = true
      try {
        const res = await listAssistantModelConfig({ pageNum: 1, pageSize: 50 })
        const rows = res.rows || []
        this.modelOptions = rows.filter(item => item.enabled !== 'N' && isChatModel(item))
        const current = this.modelOptions.find(item => item.defaultFlag === 'Y') || this.modelOptions[0]
        const selectedExists = this.modelOptions.some(item => toIdKey(item.id) === toIdKey(this.selectedModelId))
        if (current && !selectedExists) {
          this.selectedModelId = current.id
        }
      } finally {
        this.modelLoading = false
      }
    },
    // 记录用户在顶部模型切换器中的选择，真正调用时随发送请求一起传给后端。
    setActiveModel(model) {
      this.selectedModelId = model?.id
    },
    // 切换助手模式：自动、WES业务、通用AI。枚举值与后端保持一致。
    setAssistantMode(mode) {
      this.assistantMode = mode || ASSISTANT_MODE_AUTO
    },
    // 切换输入区工具状态，例如附件、联网、深度思考、知识库等开关。
    toggleTool(key) {
      if (Object.prototype.hasOwnProperty.call(this.tools, key)) {
        this.tools[key] = !this.tools[key]
      }
    },
    // 添加@提及的业务对象，同一种对象同一个ID只保留一份，避免重复拼接上下文。
    addEntity(entity) {
      const exists = this.entities.some(item => item.kind === entity.kind && item.id === entity.id)
      if (!exists) {
        this.entities.push(entity)
      }
    },
    // 移除已选业务对象，下一次发送时不再把它写入提示词上下文。
    removeEntity(entity) {
      this.entities = this.entities.filter(item => !(item.kind === entity.kind && item.id === entity.id))
    },
    // 将输入文本与@实体合并成后端可理解的提示词，实体为空时保持用户原始输入。
    buildPrompt(content) {
      const text = (content || '').trim()
      if (this.entities.length === 0) {
        return text
      }
      const refs = this.entities
        .map(item => `@${item.label}(${item.id})`)
        .join(' ')
      return [refs, text || '请围绕以上对象进行分析。'].filter(Boolean).join('\n')
    },
    // 切换会话并加载消息详情；消息块JSON在进入store时统一转换成前端数组。
    async loadMessages(sessionId) {
      this.activeSessionId = sessionId
      const res = await listAssistantMessages(sessionId, { pageNum: 1, pageSize: 100 })
      this.messages = (res.rows || []).map(normalizeMessage)
    },
    // 新建本地空会话状态；真正的会话记录会在用户首次发送后由后端创建。
    newSession() {
      this.activeSessionId = undefined
      this.messages = []
      this.streamingMessageId = undefined
      this.clearStreamFallbackTimer()
    },
    // 删除历史会话前先确认并阻止删除正在流式响应的会话，避免后端仍在写入消息。
    async deleteSession(session) {
      const sessionId = session?.id
      if (!sessionId) {
        return
      }
      const isActive = toIdKey(sessionId) === toIdKey(this.activeSessionId)
      if (isActive && this.streamingMessageId) {
        ElMessage.warning('当前会话正在响应，请先停止后再删除')
        return
      }
      try {
        await ElMessageBox.confirm('确定删除该会话及全部消息吗？', '删除会话', {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        })
      } catch (error) {
        return
      }
      await delAssistantSession(sessionId)
      const remainingSessions = this.sessions.filter(item => toIdKey(item.id) !== toIdKey(sessionId))
      this.sessions = remainingSessions
      if (isActive) {
        const nextSession = remainingSessions[0]
        if (nextSession) {
          await this.loadMessages(nextSession.id)
        } else {
          this.newSession()
        }
      }
      await this.loadSessions()
      ElMessage.success('会话已删除')
    },
    // 发送用户问题：先确保SSE在线，再发起HTTP请求创建消息，最后等待SSE补齐回答。
    async send(content) {
      if (!this.assistantEnabled) {
        ElMessage.warning('AI助手功能未启用')
        return
      }
      const text = this.buildPrompt(content)
      if (!text) {
        return
      }
      try {
        await this.ensureSse()
      } catch (error) {
        ElMessage.error(error?.message || this.connectError || 'SSE连接失败')
        return
      }
      this.inputLoading = true
      try {
        // clientMessageId用于在真实后端messageId返回前，把本地占位消息和SSE事件对齐。
        const clientMessageId = `client-${Date.now()}`
        const sendTime = new Date().toISOString()
        const res = await sendAssistantChat({
          sessionId: this.activeSessionId,
          clientMessageId,
          content: text,
          thinkingMode: this.tools.think ? THINKING_MODE_DEEP : THINKING_MODE_NORMAL,
          assistantMode: this.assistantMode,
          // 知识库开关只控制本次提问是否走RAG召回，默认关闭，避免普通聊天被无关知识污染。
          knowledgeEnabled: this.tools.knowledge
        })
        const data = res.data
        const thinkingBlocks = this.tools.think ? [createThinkingBlock('running')] : []
        this.activeSessionId = data.sessionId
        // 先乐观插入用户消息和助手空消息，随后由SSE分片持续补齐助手内容。
        this.messages.push({
          id: data.userMessageId,
          sessionId: data.sessionId,
          role: 'USER',
          content: text,
          status: 'SUCCESS',
          createTime: sendTime
        })
        this.messages.push({
          id: data.assistantMessageId,
          sessionId: data.sessionId,
          clientMessageId,
          role: 'ASSISTANT',
          content: '',
          blocks: thinkingBlocks,
          blocksJson: thinkingBlocks.length ? JSON.stringify(thinkingBlocks) : undefined,
          status: 'SENDING',
          createTime: sendTime
        })
        this.entities = []
        this.streamingMessageId = data.assistantMessageId
        this.startStreamFallbackPolling(data.sessionId, data.assistantMessageId)
        this.loadSessions()
      } finally {
        this.inputLoading = false
      }
    },
    // 重新生成时复用当前助手消息之前最近一条用户问题，保持和主发送链路一致。
    async regenerate(message) {
      const index = this.messages.findIndex(item => toIdKey(item.id) === toIdKey(message?.id))
      const previousUser = this.messages
        .slice(0, index >= 0 ? index : this.messages.length)
        .reverse()
        .find(item => item.role === 'USER')
      if (!previousUser?.content) {
        ElMessage.warning('没有找到可重新生成的上一条问题')
        return
      }
      await this.send(previousUser.content)
    },
    // 停止当前流式回答；这里只发停止请求，最终状态仍以SSE的message_stopped事件为准。
    async stop() {
      if (!this.activeSessionId || !this.streamingMessageId) {
        return
      }
      await stopAssistantChat({
        sessionId: this.activeSessionId,
        messageId: this.streamingMessageId
      })
    },
    // 统一消费后端SSE事件，将后端事件映射为本地消息状态、文本增量和思考块更新。
    handleStreamEvent(event) {
      const eventMessageId = toIdKey(event.messageId)
      const eventClientMessageId = toIdKey(event.clientMessageId)
      // 优先按后端messageId定位；新会话早期再用clientMessageId兜底匹配本地占位消息。
      const message = this.messages.find(item => toIdKey(item.id) === eventMessageId) ||
        this.messages.find(item =>
          item.role === 'ASSISTANT' &&
          toIdKey(item.clientMessageId) === eventClientMessageId
        ) ||
        this.messages.find(item =>
          item.role === 'ASSISTANT' &&
          toIdKey(item.id) === toIdKey(this.streamingMessageId)
        )
      if (!message) {
        return
      }
      // 以下事件名和后端 AssistantChatService.sendEvent 保持一致。
      if (event.event === 'message_start') {
        message.routeType = event.data?.routeType || message.routeType
      }
      if (event.event === 'thinking_update') {
        upsertThinkingBlock(message, event.data?.block)
        message.blocksJson = JSON.stringify(message.blocks || [])
      }
      if (event.event === 'message_delta') {
        message.status = 'STREAMING'
        message.content += event.data?.content || ''
      }
      if (event.event === 'message_end') {
        message.status = 'SUCCESS'
        message.content = event.data?.content || message.content
        message.routeType = event.data?.routeType || message.routeType
        if (event.data?.blocksJson) {
          message.blocksJson = event.data.blocksJson
          message.blocks = parseBlocksJson(event.data.blocksJson)
        } else {
          completeThinkingBlock(message)
        }
        if (event.data?.sourcesJson || event.data?.sources) {
          message.sourcesJson = event.data.sourcesJson || JSON.stringify(event.data.sources || [])
          message.sources = event.data.sources || parseSourcesJson(event.data.sourcesJson)
        }
        message.updateTime = event.timestamp || new Date().toISOString()
        this.streamingMessageId = undefined
        this.clearStreamFallbackTimer()
        this.loadSessions()
      }
      if (event.event === 'message_error') {
        message.status = 'FAILED'
        message.errorMessage = event.data?.errorMessage
        completeThinkingBlock(message, '深度思考已中断，模型响应失败。')
        message.updateTime = event.timestamp || new Date().toISOString()
        this.streamingMessageId = undefined
        this.clearStreamFallbackTimer()
        ElMessage.error(message.errorMessage || 'AI助手响应失败')
      }
      if (event.event === 'message_stopped') {
        message.status = 'STOPPED'
        completeThinkingBlock(message, '深度思考已停止。')
        message.updateTime = event.timestamp || new Date().toISOString()
        this.streamingMessageId = undefined
        this.clearStreamFallbackTimer()
      }
    },
    // SSE 是实时主通道；轮询只做兜底。模型生成可能超过十几秒，所以兜底要覆盖长回答场景。
    startStreamFallbackPolling(sessionId, messageId, attempt = 0) {
      this.clearStreamFallbackTimer()
      this.streamFallbackTimer = window.setTimeout(async () => {
        if (toIdKey(this.streamingMessageId) !== toIdKey(messageId)) {
          return
        }
        try {
          const res = await listAssistantMessages(sessionId, { pageNum: 1, pageSize: 100 })
          const remoteMessage = (res.rows || []).find(item => toIdKey(item.id) === toIdKey(messageId))
          if (remoteMessage && !['SENDING', 'STREAMING'].includes(remoteMessage.status)) {
            const localMessage = this.messages.find(item => toIdKey(item.id) === toIdKey(messageId))
            if (localMessage) {
              Object.assign(localMessage, normalizeMessage({
                ...localMessage,
                ...remoteMessage,
                clientMessageId: localMessage.clientMessageId
              }))
            }
            this.streamingMessageId = undefined
            this.clearStreamFallbackTimer()
            this.loadSessions()
            return
          }
        } catch (error) {
          // 兜底轮询失败时继续等待SSE；下一轮再尝试，避免短暂网络抖动打断用户输入。
        }
        if (attempt < STREAM_FALLBACK_MAX_ATTEMPTS) {
          this.startStreamFallbackPolling(sessionId, messageId, attempt + 1)
        }
      }, attempt === 0 ? 1800 : 1200)
    },
    clearStreamFallbackTimer() {
      if (this.streamFallbackTimer) {
        window.clearTimeout(this.streamFallbackTimer)
        this.streamFallbackTimer = undefined
      }
    }
  }
})

export default useAssistantStore

// 标准化后端消息结构，保证组件层始终读取blocks数组而不是直接解析JSON。
function normalizeMessage(message) {
  return {
    ...message,
    blocks: parseBlocksJson(message.blocksJson),
    sources: parseSourcesJson(message.sourcesJson)
  }
}

// 安全解析消息块JSON；历史脏数据或空值直接降级为空数组，避免渲染层报错。
function parseBlocksJson(blocksJson) {
  if (!blocksJson) {
    return []
  }
  try {
    const blocks = JSON.parse(blocksJson)
    return Array.isArray(blocks) ? blocks : []
  } catch (error) {
    return []
  }
}

// 安全解析知识库引用来源；历史消息没有sourcesJson时降级为空数组。
function parseSourcesJson(sourcesJson) {
  if (!sourcesJson) {
    return []
  }
  try {
    const sources = JSON.parse(sourcesJson)
    return Array.isArray(sources) ? sources : []
  } catch (error) {
    return []
  }
}

// 创建本地思考块占位，后端真实thinking_update到达后会覆盖这个占位块。
function createThinkingBlock(phase, content) {
  // 本地思考块是“用户可见进度摘要”，不是模型内部推理链；真实答案仍以SSE消息为准。
  return {
    type: 'thinking',
    phase,
    elapsed: '0.0s',
    partial: content || '正在识别问题意图、业务对象和回答边界...',
    content: content || '本次深度思考正在整理问题意图、会话上下文和回答结构。',
    defaultOpen: false,
    steps: [
      { label: '理解问题与业务对象', status: phase === 'done' ? 'done' : 'running' },
      { label: '整理当前会话上下文', status: phase === 'done' ? 'done' : 'pending' },
      { label: '组织分析路径与回答结构', status: phase === 'done' ? 'done' : 'pending' },
      { label: '生成最终回答建议', status: phase === 'done' ? 'done' : 'pending' }
    ]
  }
}

// 新增或替换消息里的thinking块；一个回答只展示一个思考块，避免连续事件刷出多张卡片。
function upsertThinkingBlock(message, block) {
  if (!block || block.type !== 'thinking') {
    return
  }
  // 一个助手消息只保留一个thinking块，后续更新覆盖旧块，避免重复显示进度卡片。
  const blocks = Array.isArray(message.blocks) ? [...message.blocks] : []
  const index = blocks.findIndex(item => item.type === 'thinking')
  if (index >= 0) {
    blocks.splice(index, 1, block)
  } else {
    blocks.unshift(block)
  }
  message.blocks = blocks
}

// 在回答结束、失败或停止时收束本地思考块，让UI从“思考中”变成明确的终态。
function completeThinkingBlock(message, content) {
  const blocks = Array.isArray(message.blocks) ? [...message.blocks] : []
  const index = blocks.findIndex(item => item.type === 'thinking')
  if (index < 0) {
    return
  }
  const oldBlock = blocks[index]
  blocks.splice(index, 1, {
    ...oldBlock,
    phase: 'done',
    totalTime: oldBlock.totalTime || oldBlock.elapsed,
    content: content || oldBlock.content,
    steps: (oldBlock.steps || []).map(step => ({ ...step, status: 'done' }))
  })
  message.blocks = blocks
  message.blocksJson = JSON.stringify(blocks)
}
