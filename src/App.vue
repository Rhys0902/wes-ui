
<template>
    <el-config-provider :locale="locale">
        <RouterView />
    </el-config-provider>
</template>
  <script setup >
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { languageSet } from '@/utils/watchLang'

import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import { showWatermark, hideWatermark } from '@/utils/watermark'

const language = ref(languageSet())
const locale = computed(() => (language.value === "zh_CN" ? zhCn : en))
// 监听语言的切换，设置 language 值，从而实现 elementPlus 组件语言的切换
window.addEventListener("onLocalsChanged", (e) => {
    language.value = e.detail
})

// 水印功能
const settingsStore = useSettingsStore()

// 初始化水印
onMounted(() => {
    nextTick(() => {
        // 初始化主题样式
        handleThemeStyle(settingsStore.theme)
        // 初始化水印
        initWatermark()
    })
})

// 监听水印配置变化
watch(
    () => settingsStore.watermark,
    (newWatermark) => {
        if (newWatermark.visible) {
            showWatermark({
                text: newWatermark.text,
                enableUserName: newWatermark.enableUserName
            })
        } else {
            hideWatermark()
        }
    },
    { deep: true }
)

// 初始化水印
function initWatermark() {
    const { watermark } = settingsStore
    if (watermark.visible) {
        showWatermark({
            text: watermark.text,
            enableUserName: watermark.enableUserName
        })
    } else {
        hideWatermark()
    }
}


  </script>
  <style >
</style>






