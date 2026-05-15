<template>
    <div id="tags-view-container" :class="['tags-view-container', tabStyle]">
        <div class="tags-view-content">
            <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
                <!-- 谷歌风格使用ChromeTab组件 -->
                <chrome-tab v-if="tabStyle === 'google'" v-for="tag in visitedViews" :key="tag.path" :tab="tag" :is-active="isActive(tag)" @click="handleTabClick(tag)" @close="closeSelectedTag(tag)" @contextmenu="(e) => openMenu(tag, e)" />

                <!-- 按钮风格保持原有实现 -->
                <router-link v-else v-for="tag in visitedViews" :key="tag.path" :data-path="tag.path" :class="isActive(tag) ? 'active' : ''" :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" class="tags-view-item" :style="activeStyle(tag)" @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''" @contextmenu.prevent="openMenu(tag, $event)">
                    <svg-icon v-if="tag.meta && tag.meta.icon" :icon-class="tag.meta.icon" class="tags-view-icon" />
                    {{ tag.title }}
                    <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
                        <close class="el-icon-close" style="width: 1em; height: 1em;vertical-align: middle;" />
                    </span>
                </router-link>
            </scroll-pane>

            <!-- 右侧操作按钮区域 -->
            <div class="tags-view-actions">
                <!-- 刷新按钮 -->
                <el-tooltip content="刷新页面" placement="bottom">
                    <el-button @click="handleRefresh" class="action-btn" size="small" text>
                        <el-icon :size="16">
                            <RefreshRight :class="{ 'animate-spin': isRefreshing }" />
                        </el-icon>
                    </el-button>

                </el-tooltip>
                <!-- 全屏按钮 -->
                <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
                    <el-button @click="toggleFullscreen" class="action-btn" size="small" text>
                        <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" />
                    </el-button>
                </el-tooltip>
            </div>
        </div>
        <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
            <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
                <close style="width: 1em; height: 1em;" /> 关闭当前
            </li>
            <li @click="closeOthersTags">
                <circle-close style="width: 1em; height: 1em;" /> 关闭其他
            </li>
            <li v-if="!isFirstView()" @click="closeLeftTags">
                <back style="width: 1em; height: 1em;" /> 关闭左侧
            </li>
            <li v-if="!isLastView()" @click="closeRightTags">
                <right style="width: 1em; height: 1em;" /> 关闭右侧
            </li>
            <li @click="closeAllTags(selectedTag)">
                <circle-close style="width: 1em; height: 1em;" /> 全部关闭
            </li>
        </ul>
    </div>
</template>

<script setup>
import ScrollPane from './ScrollPane'
import ChromeTab from './ChromeTab'
import ChromeTabBg from './ChromeTabBg'
import { getNormalPath } from '@/utils/ruoyi'
import useTagsViewStore from '@/store/modules/tagsView'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import useAppStore from '@/store/modules/app'

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})
const affixTags = ref([])
const scrollPaneRef = ref(null)

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const visitedViews = computed(() => useTagsViewStore().visitedViews)
const routes = computed(() => usePermissionStore().routes)
const theme = computed(() => useSettingsStore().theme)
const tabStyle = computed(() => useSettingsStore().tabStyle)

// 刷新状态
const isRefreshing = ref(false)

// 全屏状态
const isFullscreen = ref(false)

// 刷新功能
async function handleRefresh() {
    // 防止重复点击
    if (isRefreshing.value) return

    const currentView = visitedViews.value.find(view => isActive(view))
    if (currentView) {
        isRefreshing.value = true

        try {
            // 立即开始刷新操作
            await refreshSelectedTag(currentView)

            // 刷新成功后，短暂保持加载状态让用户感知操作完成
            setTimeout(() => {
                isRefreshing.value = false
            }, 300)

        } catch (error) {
            console.error('页面刷新失败:', error)
            // 刷新失败时立即停止加载状态
            isRefreshing.value = false

            // 可以添加错误提示，但保持简洁
            // proxy.$modal.msgError('页面刷新失败，请重试')
        }
    } else {
        // 如果没有当前视图，也停止加载状态
        isRefreshing.value = false
    }
}

// 全屏功能
function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value

    // 控制侧边栏和顶部navbar的显示/隐藏
    const appStore = useAppStore()

    if (isFullscreen.value) {
        // 进入全屏模式：隐藏侧边栏和顶部navbar
        appStore.toggleSideBarHide(true)
    } else {
        // 退出全屏模式：恢复侧边栏和顶部navbar
        appStore.toggleSideBarHide(false)
    }
}

// console.log(theme)
watch(route, () => {
    addTags()
    moveToCurrentTag()
})
watch(visible, (value) => {
    if (value) {
        document.body.addEventListener('click', closeMenu)
    } else {
        document.body.removeEventListener('click', closeMenu)
    }
})
onMounted(() => {
    initTags()
    addTags()
})

function isActive(r) {
    return r.path === route.path
}
function activeStyle(tag) {
    if (!isActive(tag)) return {}

    // 根据不同的tabStyle返回不同的样式
    if (tabStyle.value === 'button') {
        return {
            "background-color": "var(--el-color-primary-light-9)",
            "border-color": theme.value,
            "color": theme.value
        }
    }
    // 谷歌风格不需要这些样式，由CSS类控制
    return {
        "color": theme.value
    }
}
function isAffix(tag) {
    return tag.meta && tag.meta.affix
}
function isFirstView() {
    try {
        return selectedTag.value.fullPath === '/index' || selectedTag.value.fullPath === visitedViews.value[1].fullPath
    } catch (err) {
        return false
    }
}
function isLastView() {
    try {
        return selectedTag.value.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath
    } catch (err) {
        return false
    }
}
function filterAffixTags(routes, basePath = '') {
    let tags = []
    routes.forEach(route => {
        if (route.meta && route.meta.affix) {
            const tagPath = getNormalPath(basePath + '/' + route.path)
            tags.push({
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta }
            })
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags]
            }
        }
    })
    return tags
}
function initTags() {
    const res = filterAffixTags(routes.value)
    affixTags.value = res
    for (const tag of res) {
        // Must have tag name
        if (tag.name) {
            useTagsViewStore().addVisitedView(tag)
        }
    }
}
function addTags() {
    const { name } = route
    if (name) {
        useTagsViewStore().addView(route)
        if (route.meta.link) {
            useTagsViewStore().addIframeView(route)
        }
    }
    return false
}
function moveToCurrentTag() {
    nextTick(() => {
        for (const r of visitedViews.value) {
            if (r.path === route.path) {
                scrollPaneRef.value.moveToTarget(r)
                // when query is different then update
                if (r.fullPath !== route.fullPath) {
                    useTagsViewStore().updateVisitedView(route)
                }
            }
        }
    })
}
function refreshSelectedTag(view) {
    proxy.$tab.refreshPage(view)
    if (route.meta.link) {
        useTagsViewStore().delIframeView(route)
    }
}
function closeSelectedTag(view) {
    proxy.$tab.closePage(view).then(({ visitedViews }) => {
        if (isActive(view)) {
            toLastView(visitedViews, view)
        }
    })
}
function closeRightTags() {
    proxy.$tab.closeRightPage(selectedTag.value).then(visitedViews => {
        if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
            toLastView(visitedViews)
        }
    })
}
function closeLeftTags() {
    proxy.$tab.closeLeftPage(selectedTag.value).then(visitedViews => {
        if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
            toLastView(visitedViews)
        }
    })
}
function closeOthersTags() {
    router.push(selectedTag.value).catch(() => { })
    proxy.$tab.closeOtherPage(selectedTag.value).then(() => {
        moveToCurrentTag()
    })
}
function closeAllTags(view) {
    proxy.$tab.closeAllPage().then(({ visitedViews }) => {
        if (affixTags.value.some(tag => tag.path === route.path)) {
            return
        }
        toLastView(visitedViews, view)
    })
}
function toLastView(visitedViews, view) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
        router.push(latestView.fullPath)
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
            // to reload home page
            router.replace({ path: '/redirect' + view.fullPath })
        } else {
            router.push('/')
        }
    }
}
function openMenu(tag, e) {
    const menuMinWidth = 105
    const offsetLeft = proxy.$el.getBoundingClientRect().left // container margin left
    const offsetWidth = proxy.$el.offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const l = e.clientX - offsetLeft + 15 // 15: margin right

    if (l > maxLeft) {
        left.value = maxLeft
    } else {
        left.value = l
    }

    top.value = e.clientY
    console.log(left.value, top.value)
    visible.value = true
    selectedTag.value = tag
}
function closeMenu() {
    visible.value = false
}
function handleTabClick(tag) {
    router.push({ path: tag.path, query: tag.query, fullPath: tag.fullPath })
}

function handleScroll() {
    closeMenu()
}
</script>

<style lang='scss' scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    .tags-view-content {
        display: flex;
        align-items: center;
        height: 100%;

        .tags-view-wrapper {
            flex: 1;
            height: 100%;
            overflow: hidden;
        }
    }

    // 谷歌风格（默认）
    &.google {
        .tags-view-wrapper {
            position: relative;
            z-index: 2;
        }
    }

    // 按钮风格
    &.button {
        .tags-view-wrapper {
            .tags-view-item {
                display: inline-block;
                position: relative;
                cursor: pointer;
                height: 26px;
                line-height: 26px;
                border: 1px solid #d8dce5;
                color: #495060;
                background: #fff;
                padding: 0 12px;
                font-size: 12px;
                margin-left: 5px;
                margin-top: 4px;
                border-radius: 4px;

                &:first-of-type {
                    margin-left: 0;
                }

                &:last-of-type {
                    margin-right: 15px;
                }

                &.active {
                    background-color: var(--el-color-primary-light-9);
                    color: v-bind(theme);
                    border-color: var(--el-color-primary-light-9);
                    &::before {
                        content: none;
                    }
                }

                &:hover {
                    border-color: v-bind(theme);
                    color: v-bind(theme);
                }

                .tags-view-icon {
                    width: 14px;
                    height: 14px;
                    margin-right: 4px;
                    vertical-align: -2px;
                    flex-shrink: 0;
                }
            }
        }
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }
}
// 重置element图标样式，确保与新实现一致
.chrome-tab .el-icon-close {
    width: 16px;
    height: 16px;
    vertical-align: 0;
    border-radius: 50%;
    text-align: center;
    transition: all 0.2s ease;
    transform-origin: center;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

// 操作按钮区域样式
.tags-view-actions {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 8px;
    background: #fff;
    border-left: 1px solid #e6e6e6;
    flex-shrink: 0;

    .action-btn {
        margin-left: 8px;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
            background-color: #f5f7fa;
        }

        .svg-icon {
            width: 16px;
            height: 16px;
        }
    }

    // 刷新按钮旋转动画
    .animate-spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
}
</style>

