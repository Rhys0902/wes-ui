<template>
    <el-dropdown trigger="click" @command="handleLanguageChange">
        <div class="lang-select--style">
            <svg-icon icon-class="language" />
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item :disabled="locale === 'zh_CN'" command="zh_CN"> 中文 </el-dropdown-item>
                <el-dropdown-item :disabled="locale === 'en_US'" command="en_US"> English </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup>

import { localsChangedNotify } from '@/utils/watchLang'
import { useI18n } from "vue-i18n"
const { locale } = useI18n()
const { proxy } = getCurrentInstance()


const message = {
    zh_CN: '切换语言成功！',
    en_US: 'Switch Language Successful!'
}

const handleLanguageChange = (val) => {
    locale.value = val === 'zh_CN' ? 'zh_CN' : val
    localStorage.setItem("lang", val)
    // message[val] || '切换语言成功！'
    proxy.$message.success(message[val] || '切换语言成功！')
    localsChangedNotify(val)
}
</script>

<style lang="scss" scoped>
.lang-select--style {
    font-size: 18px;
    line-height: 50px;
}
</style>
