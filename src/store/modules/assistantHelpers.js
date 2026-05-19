// 将后端时间字段转换为时间戳，集中处理空值，便于排序和分组复用。
export function toTime(value) {
  return value ? new Date(value).getTime() : 0
}

// 前后端ID可能出现数字/字符串混用，统一转成字符串后再比较。
export function toIdKey(value) {
  return value === undefined || value === null ? '' : String(value)
}

// 助手消息和会话统一展示相对日期，避免用户只看到时间不知道是哪一天。
function pad(value) {
  return String(value).padStart(2, '0')
}

// 日期分组只比较年月日，不受具体时分秒影响。
function sameDay(left, right) {
  return left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
}

// 消息时间展示给用户看，需要同时保留“今天/昨天”和具体时分。
export function formatAssistantTime(value) {
  const time = toTime(value)
  if (!time) {
    return ''
  }
  const date = new Date(time)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const clock = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  if (sameDay(date, today)) {
    return `今天 ${clock}`
  }
  if (sameDay(date, yesterday)) {
    return `昨天 ${clock}`
  }
  const day = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  if (date.getFullYear() === today.getFullYear()) {
    return `${day} ${clock}`
  }
  return `${date.getFullYear()}-${day} ${clock}`
}

// 会话列表按最后更新时间分组，和聊天区消息时间展示保持同一套判断口径。
export function groupSession(item) {
  const time = toTime(item.updateTime || item.createTime)
  if (!time) {
    return '更早'
  }
  const date = new Date(time)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (sameDay(date, today)) {
    return '今天'
  }
  if (sameDay(date, yesterday)) {
    return '昨天'
  }
  if (today.getTime() - time <= 7 * 24 * 60 * 60 * 1000) {
    return '本周'
  }
  return '更早'
}
