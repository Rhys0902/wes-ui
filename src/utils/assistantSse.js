import { getToken } from '@/utils/auth'

// 根据运行环境拼接后端基础地址，和项目现有request配置保持同一套环境变量。
function getBaseUrl() {
  return import.meta.env.VITE_APP_ENV === 'development'
    ? import.meta.env.VITE_APP_BASE_API
    : window.global_config['baseUrl']
}

// 解析单个SSE事件块；后端使用event/data格式，data可能由多行拼接而成。
function parseEvent(block) {
  const event = { event: 'message', data: '' }
  block.split(/\r?\n/).forEach(line => {
    if (line.startsWith('event:')) {
      event.event = line.slice(6).trim()
    }
    if (line.startsWith('data:')) {
      event.data += line.slice(5).trim()
    }
  })
  return event
}

// 使用 fetch 连接 SSE，解决 EventSource 无法携带 Authorization 头的问题。
export function connectAssistantSse(options = {}) {
  const controller = new AbortController()
  const token = getToken()
  const { onEvent, onError, onOpen, onClose } = options

  fetch(`${getBaseUrl()}/sse/subscribe`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'text/event-stream'
    },
    signal: controller.signal
  }).then(async response => {
    if (!response.ok || !response.body) {
      throw new Error('SSE连接失败')
    }
    onOpen && onOpen()

    // fetch返回ReadableStream后手动按空行切分SSE块，保留未完整到达的buffer。
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    while (true) {
      const { value, done } = await reader.read()
      if (done) {
        break
      }
      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split(/\r?\n\r?\n/)
      buffer = blocks.pop() || ''
      blocks.forEach(block => {
        const parsed = parseEvent(block)
        // AI助手只消费assistant事件，其他系统事件可以继续留给全局SSE能力扩展。
        if (parsed.event === 'assistant' && parsed.data) {
          try {
            onEvent && onEvent(JSON.parse(parsed.data))
          } catch (error) {
            // 单个异常事件不能中断整条SSE连接，否则会导致后续message_end丢失。
            onError && onError(error)
          }
        }
      })
    }
    onClose && onClose()
  }).catch(error => {
    if (!controller.signal.aborted && onError) {
      onError(error)
    }
  })

  return () => controller.abort()
}
