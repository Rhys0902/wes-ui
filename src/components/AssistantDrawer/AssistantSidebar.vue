<template>
  <aside class="assistant-sidebar">
    <div class="sidebar-head">
      <div class="brand-row">
        <LingxiLogo :size="32" mark />
        <div class="brand-copy">
          <div class="brand-title">AI 助手</div>
        </div>
      </div>

      <button class="new-session" type="button" @click="store.newSession">
        <el-icon><Plus /></el-icon>
        新建会话
      </button>

      <label class="session-search">
        <el-icon><Search /></el-icon>
        <input v-model="store.sessionKeyword" placeholder="搜索历史会话" />
      </label>
    </div>

    <div class="session-groups">
      <div v-for="group in store.groupedSessions" :key="group.label" class="session-group">
        <div class="group-label">{{ group.label }}</div>
        <div
          v-for="item in group.items"
          :key="item.id"
          class="session-item"
          :class="{ active: item.id === store.activeSessionId }"
          role="button"
          tabindex="0"
          @click="store.loadMessages(item.id)"
          @keydown.enter.prevent="store.loadMessages(item.id)"
          @keydown.space.prevent="store.loadMessages(item.id)"
        >
          <el-icon><ChatDotRound /></el-icon>
          <span class="session-copy">
            <span class="session-title">{{ item.title || '新会话' }}</span>
            <span class="session-time">{{ formatAssistantTime(item.updateTime || item.createTime) }}</span>
          </span>
          <span
            class="session-delete"
            role="button"
            tabindex="0"
            aria-label="删除会话"
            @click.stop="store.deleteSession(item)"
            @keydown.enter.stop.prevent="store.deleteSession(item)"
            @keydown.space.stop.prevent="store.deleteSession(item)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </div>
      </div>
    </div>

    <div class="sidebar-user">
      <div class="user-avatar">{{ userInitial }}</div>
      <div class="user-copy">
        <div class="user-name">{{ displayUserName }}</div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import useUserStore from '@/store/modules/user'
import { formatAssistantTime } from '@/store/modules/assistantHelpers'
import LingxiLogo from './LingxiLogo.vue'

defineProps({
  store: {
    type: Object,
    required: true
  }
})

const userStore = useUserStore()
// 左下角显示当前登录用户昵称，未配置昵称时降级使用账号名。
const displayUserName = computed(() => userStore.nickName || userStore.name || '当前用户')
// 头像只取昵称首字，用于保持当前原型的轻量身份标识。
const userInitial = computed(() => displayUserName.value.slice(0, 1).toUpperCase())
</script>

<style scoped lang="scss">
.assistant-sidebar {
  width: 260px;
  flex: 0 0 260px;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
  background: rgba(248, 250, 252, 0.8);
}

.sidebar-head {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0 4px;
}

.brand-title {
  color: #1d293d;
  font-size: 16px;
}

.new-session,
.session-search,
.session-item {
  font-family: inherit;
}

.new-session {
  width: 100%;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;
  color: #314158;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    border-color: #c4b5fd;
    background: #f5f3ff;
    color: #7008e7;
  }
}

.session-search {
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
  margin-top: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #90a1b9;

  .el-icon {
    position: absolute;
    left: 10px;
    font-size: 14px;
  }

  input {
    width: 100%;
    height: 100%;
    padding: 0 8px 0 32px;
    border: 0;
    outline: none;
    background: transparent;
    color: #314158;
    font-size: 12.5px;
  }
}

.session-groups {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px;
}

.session-group {
  margin-bottom: 12px;
}

.group-label {
  padding: 0 8px 4px;
  color: #90a1b9;
  font-size: 10.5px;
  letter-spacing: 0.525px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 8px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #314158;
  cursor: pointer;
  text-align: left;

  .el-icon {
    flex: 0 0 auto;
  }

  &.active,
  &:hover {
    background: #f5f3ff;
    color: #7008e7;
  }

  &:hover .session-time,
  &.active .session-time {
    color: #a78bfa;
  }

  &:hover .session-delete,
  &:focus-visible .session-delete {
    opacity: 1;
    pointer-events: auto;
  }
}

.session-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
  font-size: 13px;
  font-weight: 500;
}

.session-time {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #94a3b8;
  font-size: 10.5px;
  line-height: 14px;
}
.session-delete {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  color: #94a3b8;
  opacity: 0;
  pointer-events: none;

  &:hover,
  &:focus-visible {
    background: #fee2e2;
    color: #dc2626;
    outline: none;
  }
}

.sidebar-user {
  flex: 0 0 56px;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 12px;
  border-top: 1px solid #e2e8f0;
  background: rgba(248, 250, 252, 0.95);
}

.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22d3ee 0%, #8e51ff 100%);
  color: #fff;
  font-size: 16px;
}

.user-copy {
  flex: 0 1 auto;
  min-width: 0;
}

.user-name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1d293d;
  font-size: 14px;
  line-height: 20px;
}

</style>
