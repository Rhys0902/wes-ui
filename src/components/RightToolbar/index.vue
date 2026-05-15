<template>
    <div class="top-right-btn" :style="style">
        <el-row>
            <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
                <el-button circle icon="Search" @click="toggleSearch()" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button circle icon="Refresh" @click="refresh()" />
            </el-tooltip>
            <el-popover placement="bottom-end" trigger="click" v-if="columns" width="200">
                <template #reference>
                    <!-- <el-tooltip class="item" effect="dark" content="列设置" placement="top">
                    </el-tooltip> -->
                    <el-button circle icon="Setting" />
                </template>
                <div class="column-setting-content">
                    <VueDraggable :model-value="columns" @update:model-value="handleColumnsChange" :animation="150" filter=".none_draggable" class="column-setting-list" item-key="key">
                        <div v-for="item in props.columns" :key="item.key">
                            <el-icon class="drag-handle">
                                <Sort />
                            </el-icon>
                            <el-checkbox :model-value="item.visible" @change="(val) => handleCheckboxChange(item, val)" class="column-checkbox">
                                {{ item.label }}
                            </el-checkbox>
                        </div>
                    </VueDraggable>
                </div>
            </el-popover>
        </el-row>
    </div>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'
import { ref, computed } from 'vue'

const props = defineProps({
    showSearch: {
        type: Boolean,
        default: true,
    },
    columns: {
        type: Array,
    },
    search: {
        type: Boolean,
        default: true,
    },
    gutter: {
        type: Number,
        default: 10,
    },
})

const emits = defineEmits(['update:showSearch', 'queryTable', 'update:columns'])

const style = computed(() => {
    const ret = {}
    if (props.gutter) {
        ret.marginRight = `${props.gutter / 2}px`
    }
    return ret
})

// 搜索
function toggleSearch() {
    emits("update:showSearch", !props.showSearch)
}

// 刷新
function refresh() {
    emits("queryTable")
}

// 处理列顺序变化
function handleColumnsChange(newColumns) {
    // console.log('拖拽后的新数据:', JSON.parse(JSON.stringify(newColumns)))
    // 确保触发响应式更新，创建新数组
    emits('update:columns', [...newColumns])
}

// 处理复选框变化
function handleCheckboxChange(item, val) {
    item.visible = val
    // 触发更新事件
    emits('update:columns', props.columns)
}
</script>

<style lang='scss' scoped>
:deep(.el-transfer__button) {
    border-radius: 50%;
    display: block;
    margin-left: 0px;
}
:deep(.el-transfer__button:first-child) {
    margin-bottom: 10px;
}

.my-el-transfer {
    text-align: center;
}

.column-setting-content {
    max-height: 300px;
    overflow-y: auto;
    padding: 0;
}

.column-setting-list {
    width: 100%;
}

.column-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: white;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.3s;
    cursor: move;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f5f7fa;
    }
}

.drag-handle {
    margin-right: 8px;
    color: #909399;
    cursor: move;
}

.column-checkbox {
    flex: 1;
    min-width: 0;

    :deep(.el-checkbox__label) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }
}
</style>
