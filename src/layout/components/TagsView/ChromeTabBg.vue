<template>
    <div class="chrome-tab-bg-container">
        <div class="chrome-tab-bg-wrapper">
            <div v-for="(tag, index) in tabs" :key="tag.path" class="chrome-tab-bg-item" :class="{ active: isActive(tag) }">
                <svg class="chrome-tab-bg-svg">
                    <defs>
                        <symbol id="tab-shape" viewBox="0 0 200 34">
                            <path d="M17 0h183v34H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
                        </symbol>
                    </defs>
                    <use xlink:href="#tab-shape" width="100%" height="100%" fill="currentColor" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import useSettingsStore from '@/store/modules/settings'

const props = defineProps({
    tabs: {
        type: Array,
        required: true
    },
    currentTab: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['click'])

const theme = computed(() => useSettingsStore().theme)

function isActive(tag) {
    return tag.path === props.currentTab.path
}
</script>

<style lang="scss" scoped>
.chrome-tab-bg-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
}

.chrome-tab-bg-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    position: relative;
    z-index: 1;
}

.chrome-tab-bg-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #dee1e6;
    transition: all 0.3s ease;
    z-index: 1;
    white-space: nowrap;
    padding: 6px 16px;
    margin-right: -10px;
    height: 34px;
    min-width: auto;
    box-sizing: border-box;

    &:hover {
        color: #dee1e6;
    }

    &.active {
        color: v-bind(theme);
        z-index: 10;
    }

    &:first-of-type {
        margin-left: 15px;
    }

    &:last-of-type {
        margin-right: 15px;
    }
}

.chrome-tab-bg-svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>