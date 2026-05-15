<template>
    <div class="container">
        <el-upload ref="uploadRef" :limit="1" accept=".jar" :headers="upload.headers" :action="upload.url" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
            <el-icon class="el-icon--upload">
                <upload-filled />
            </el-icon>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip text-center">
                    <span>仅允许导入jar格式文件。</span>
                </div>
            </template>
        </el-upload>
        <el-button class="mt-5" type="primary" :loading="loading" @click="submitFileForm">
            执行更新并重启
        </el-button>
    </div>
</template>
  
  <script setup>
import { ref } from 'vue'
import { getToken } from "@/utils/auth"
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const { proxy } = getCurrentInstance()
const loading = ref(false)

/*** 文件参数 */
const upload = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: "",
    // 是否禁用上传
    isUploading: false,
    // 设置上传的请求头部
    headers: { Authorization: "Bearer " + getToken() },
    // 上传的地址
    url: (window.global_config ? window.global_config["baseUrl"] : "") + "/update/upload"
})

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true
}

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
    upload.open = false
    upload.isUploading = false
    proxy.$refs["uploadRef"].handleRemove(file)
    proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {
        dangerouslyUseHTMLString: true,
        callback: () => {
            // 执行路由跳转
            if (response.code == 200) {
                userStore.returnLogin().then(() => {
                    location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index'
                })
            } else {
                console.log(response)
            }
        }
    })
}

/** 提交上传文件 */
function submitFileForm() {
    proxy.$refs["uploadRef"].submit()
}
function goToLogin() {
    console.log(1)

}


  </script>
  
  <style scoped>
.container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.uploadRef {
    margin-bottom: 20px;
}
</style>