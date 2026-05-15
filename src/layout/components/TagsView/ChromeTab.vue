<template>
    <div class="chrome-tab" :class="{ active: isActive }" @click="handleClick" @click.middle="!isAffix && handleClose" @contextmenu.prevent="handleContextMenu">
        <div class="chrome-tab-bg">
            <svg class="chrome-tab-bg-svg">
                <defs>
                    <symbol id="geometry-left" viewBox="0 0 214 36">
                        <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
                    </symbol>
                    <symbol id="geometry-right" viewBox="0 0 214 36">
                        <use xlink:href="#geometry-left" />
                    </symbol>
                    <clipPath>
                        <rect width="100%" height="100%" x="0" />
                    </clipPath>
                </defs>
                <svg width="51%" height="100%">
                    <use xlink:href="#geometry-left" width="214" height="36" fill="currentColor" />
                </svg>
                <g transform="scale(-1, 1)">
                    <svg width="51%" height="100%" x="-100%" y="0">
                        <use xlink:href="#geometry-right" width="214" height="36" fill="currentColor" />
                    </svg>
                </g>
            </svg>
        </div>
        <svg-icon v-if="tab.meta && tab.meta.icon" :icon-class="tab.meta.icon" class="chrome-tab-icon" />
        <span class="chrome-tab-title">{{ tab.title }}</span>
        <span v-if="!isAffix" class="chrome-tab-suffix">
            <Close class="chrome-tab-close" style="width: 1em; height: 1em;" @click.prevent.stop="handleClose" />
        </span>
        <div class="chrome-tab-divider"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Close } from '@element-plus/icons-vue'
import useSettingsStore from '@/store/modules/settings'

const props = defineProps({
    tab: {
        type: Object,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click', 'close', 'contextmenu'])

const theme = computed(() => useSettingsStore().theme)

const isAffix = computed(() => props.tab.meta && props.tab.meta.affix)

function handleClick() {
    emit('click', props.tab)
}

function handleClose() {
    emit('close', props.tab)
}

function handleContextMenu(event) {
    event.preventDefault()
    emit('contextmenu', event)
}
</script>

<style lang="scss" scoped>
.chrome-tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    white-space: nowrap;
    padding: 6px 16px;
    padding-left: 20px;
    margin-right: -18px;
    height: 34px;
    line-height: 1;
    font-size: 12px;
    color: #495060;
    // transition: all 0.01s ease;
    z-index: 1;

    &:first-of-type {
        margin-left: 15px;
    }

    &:last-of-type {
        margin-right: 15px;
    }

    &:hover {
        z-index: 9;
    }

    &.active {
        z-index: 10;
        color: v-bind(theme);
    }

    .chrome-tab-icon {
        width: 14px;
        height: 14px;
        margin-right: 4px;
        flex-shrink: 0;
    }

    .chrome-tab-title {
        font-size: 12px;
    }

    .chrome-tab-suffix {
        display: flex;
        align-items: center;
    }

    .chrome-tab-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        transition: all 0.2s ease;
        opacity: 0;

        &:hover {
            background-color: #9ca3af;
            color: #ffffff;
        }
    }

    &:hover .chrome-tab-close {
        opacity: 1;
    }

    &.active .chrome-tab-close:hover {
        background-color: v-bind(theme);
        color: #ffffff;
    }

    .chrome-tab-bg {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: -1;
        color: transparent;
    }

    &:hover .chrome-tab-bg {
        color: #dee1e6;
    }

    &.active .chrome-tab-bg {
        color: var(--el-color-primary-light-9);
    }

    &.active:hover .chrome-tab-bg {
        color: var(--el-color-primary-light-9);
    }

    .chrome-tab-bg-svg {
        width: 100%;
        height: 100%;
    }

    .chrome-tab-divider {
        position: absolute;
        right: 7px;
        top: 50%;
        transform: translateY(-50%);
        height: 16px;
        width: 1px;
        background-color: #1f2225;
    }

    &.active .chrome-tab-divider {
        opacity: 0;
    }

    &:hover .chrome-tab-divider {
        opacity: 0;
    }

    &.active:hover .chrome-tab-divider {
        opacity: 0;
    }

    &:last-of-type .chrome-tab-divider {
        display: none;
    }
}
</style>