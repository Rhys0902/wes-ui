<template>
    <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.prevent="handleScroll">
        <slot />
    </el-scrollbar>
</template>

<script setup>
import useTagsViewStore from '@/store/modules/tagsView'

const tagAndTagSpacing = ref(4)
const { proxy } = getCurrentInstance()

const scrollWrapper = computed(() => proxy.$refs.scrollContainer.$refs.wrapRef)

onMounted(() => {
    scrollWrapper.value.addEventListener('scroll', emitScroll, true)
})
onBeforeUnmount(() => {
    scrollWrapper.value.removeEventListener('scroll', emitScroll)
})

function handleScroll(e) {
    const eventDelta = e.wheelDelta || -e.deltaY * 40
    const $scrollWrapper = scrollWrapper.value
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
}
const emits = defineEmits()
const emitScroll = () => {
    emits('scroll')
}

const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.visitedViews)

function moveToTarget(currentTag) {
    const $container = proxy.$refs.scrollContainer.$el
    const $containerWidth = $container.offsetWidth
    const $scrollWrapper = scrollWrapper.value

    // 处理边界情况：第一个或最后一个标签
    if (visitedViews.value.length === 0) return

    const firstTag = visitedViews.value[0]
    const lastTag = visitedViews.value[visitedViews.value.length - 1]

    if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0
        return
    }

    if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
        return
    }

    // 处理中间标签的智能滚动
    const currentIndex = visitedViews.value.findIndex(item => item === currentTag)
    if (currentIndex === -1) return

    // 使用 querySelector 高效查找前一个和后一个标签的 DOM 元素
    const prevTagPath = visitedViews.value[currentIndex - 1]?.path
    const nextTagPath = visitedViews.value[currentIndex + 1]?.path

    const prevTag = prevTagPath ? document.querySelector(`.tags-view-item[data-path="${prevTagPath}"]`) : null
    const nextTag = nextTagPath ? document.querySelector(`.tags-view-item[data-path="${nextTagPath}"]`) : null

    // 边界情况处理：确保 prevTag 和 nextTag 存在
    if (!prevTag || !nextTag) {
        return
    }

    // 计算滚动位置
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing.value
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing.value

    // 智能滚动逻辑
    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
        // 当前标签在可视区域右侧，向右滚动
        $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
        // 当前标签在可视区域左侧，向左滚动
        $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
}

defineExpose({
    moveToTarget,
})
</script>

<style lang='scss' scoped>
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    :deep(.el-scrollbar__bar) {
        bottom: 0px;
    }
    :deep(.el-scrollbar__wrap) {
        height: 39px;
    }
}
</style>
