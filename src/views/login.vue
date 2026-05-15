<template>
    <div class="login">
        <div class="login-container">
            <!-- License状态区域 -->
            <div class="license-status-section">
                <div v-if="!licenseActivated" class="license-not-activated">
                    <el-alert
                        title="系统未激活"
                        type="warning"
                        description="请先激活License才能使用系统功能"
                        show-icon
                        :closable="false"
                    />
                    <el-button
                        type="primary"
                        size="large"
                        style="width: 100%; margin-top: 15px;"
                        @click="showActivationDialog = true"
                    >
                        <el-icon><upload-filled /></el-icon>
                        激活License
                    </el-button>
                </div>
                <div v-else class="license-activated">
                    <el-alert
                        :title="licenseStatus.valid ? '系统已激活' : 'License已过期'"
                        :type="licenseStatus.statusColor"
                        :description="licenseInfo"
                        show-icon
                        :closable="false"
                    />
                    <el-button
                        v-if="!licenseStatus.valid"
                        type="primary"
                        size="large"
                        style="width: 100%; margin-top: 15px;"
                        @click="showActivationDialog = true"
                    >
                        <el-icon><upload-filled /></el-icon>
                        重新激活License
                    </el-button>
                </div>
            </div>

            <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
                <h3 class="title">WES仓库执行系统</h3>
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
                        <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码" @keyup.enter="handleLogin">
                        <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code" v-if="captchaEnabled">
                    <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter="handleLogin">
                        <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>

                    </el-input>
                    <div class="login-code">
                        <img :src="codeUrl" @click="getCode" class="login-code-img" />
                    </div>
                </el-form-item>
                <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
                <el-form-item style="width:100%;">
                    <el-button :loading="loading" size="large" type="primary" style="width:100%;" @click.prevent="handleLogin">
                        <span v-if="!loading">登 录</span>
                        <span v-else>登 录 中...</span>
                    </el-button>
                    <div style="float: right;" v-if="register">
                        <router-link class="link-type" :to="'/register'">立即注册</router-link>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <!--  底部  -->
        <div class="el-login-footer">
            <span></span>
        </div>

        <!-- License激活对话框 -->
        <el-dialog
            v-model="showActivationDialog"
            title="License激活"
            width="700px"
            :close-on-click-modal="false"
            center
        >
            <div class="activation-content">
                <LicenseUpload
                    @success="handleLicenseSuccess"
                    @error="handleLicenseError"
                />

                <div class="machine-code-section">
                    <el-divider>机器码信息</el-divider>
                    <div class="machine-code-info">
                        <el-alert
                            title="请将以下机器码提供给License提供方生成激活文件："
                            type="info"
                            :closable="false"
                            show-icon
                        />
                        <div class="machine-code-display">
                            <el-input
                                v-model="machineCode"
                                readonly
                                class="machine-code-input"
                            >
                                <template #append>
                                    <el-button @click="copyMachineCode">
                                        <el-icon><document-copy /></el-icon>
                                        复制
                                    </el-button>
                                </template>
                            </el-input>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <el-button @click="showActivationDialog = false">取消</el-button>
            </template>
        </el-dialog>
    </div>
</template>

  <script setup>
import { getCodeImg } from "@/api/login"
import Cookies from "js-cookie"
import { encrypt, decrypt } from "@/utils/jsencrypt"
import useUserStore from '@/store/modules/user'
import { UploadFilled, DocumentCopy } from '@element-plus/icons-vue'
import { uploadLicenseFile, getMachineCode, getLicenseStatus } from '@/api/license'
import LicenseUpload from '@/components/LicenseUpload/index.vue'

const userStore = useUserStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const loginForm = ref({
    username: "admin",
    password: "admin123",
    rememberMe: false,
    code: "",
    uuid: ""
})

const loginRules = {
    username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
    password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
    code: [{ required: true, trigger: "change", message: "请输入验证码" }]
}

const codeUrl = ref("")
const loading = ref(false)
// 验证码开关
const captchaEnabled = ref(true)
// 注册开关
const register = ref(false)
const redirect = ref(undefined)

// License相关状态
const licenseActivated = ref(false)
const licenseInfo = ref('')
const licenseStatus = ref({
    valid: false,
    productName: '',
    version: '',
    expireDate: '',
    remainingDays: 0,
    statusColor: 'error'
})
const showActivationDialog = ref(false)
const machineCode = ref('')

async function handleLogin() {
    // 1. 先检查License状态
    if (!licenseStatus.value.valid) {
        showLicenseActivationDialog()
        return
    }

    // 2. License验证通过后执行正常登录
    proxy.$refs.loginRef.validate(valid => {
        if (valid) {
            loading.value = true
            // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
            if (loginForm.value.rememberMe) {
                Cookies.set("username", loginForm.value.username, { expires: 30 })
                Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 })
                Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 })
            } else {
                // 否则移除
                Cookies.remove("username")
                Cookies.remove("password")
                Cookies.remove("rememberMe")
            }
            // 调用action的登录方法
            userStore.login(loginForm.value).then(() => {
                router.push({ path: redirect.value || "/" })
            }).catch(() => {
                loading.value = false
                // 重新获取验证码
                if (captchaEnabled.value) {
                    getCode()
                }
            })
        }
    })
}

function getCode() {
    getCodeImg().then(res => {
        captchaEnabled.value = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled
        if (captchaEnabled.value) {
            codeUrl.value = "data:image/gif;base64," + res.data.img
            loginForm.value.uuid = res.data.uuid
        }
    })
}

function getCookie() {
    const username = Cookies.get("username")
    const password = Cookies.get("password")
    const rememberMe = Cookies.get("rememberMe")
    loginForm.value = {
        username: username === undefined ? loginForm.value.username : username,
        password: password === undefined ? loginForm.value.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
    }
}

// License相关方法
async function checkLicenseStatus() {
    try {
        const response = await getLicenseStatus()
        if (response.code === 200) {
            const data = response.data
            if (data.activated && data.expireDate) {
                const expireDate = new Date(data.expireDate)
                const remainingDays = data.remainingDays

                // 更新License状态
                licenseStatus.value = {
                    valid: remainingDays > 0,
                    productName: data.productName || 'WES系统',
                    version: data.version || '1.0.0',
                    expireDate: expireDate.toLocaleDateString('zh-CN'),
                    remainingDays: remainingDays,
                    statusColor: getLicenseStatusColor(remainingDays)
                }

                licenseActivated.value = remainingDays > 0

                // 更新显示信息
                if (remainingDays > 0) {
                    licenseInfo.value = `${licenseStatus.value.productName} v${licenseStatus.value.version} - 到期时间: ${licenseStatus.value.expireDate} (剩余${remainingDays}天)`
                } else {
                    licenseInfo.value = `${licenseStatus.value.productName} v${licenseStatus.value.version} - License已过期 (${licenseStatus.value.expireDate})`
                }
            } else {
                licenseActivated.value = false
                licenseStatus.value.valid = false
                licenseInfo.value = '系统未激活'
            }
        } else {
            licenseActivated.value = false
            licenseStatus.value.valid = false
            licenseInfo.value = '系统未激活'
        }
    } catch (error) {
        console.error('检查License状态失败:', error)
        licenseActivated.value = false
        licenseStatus.value.valid = false
        licenseInfo.value = '系统未激活'
    }
}

// 获取License状态颜色
function getLicenseStatusColor(remainingDays) {
    if (remainingDays <= 0) return 'error'    // 红色 - 已过期
    if (remainingDays <= 7) return 'warning'  // 橙色 - 即将过期
    return 'success'                          // 绿色 - 正常
}

// 显示License激活对话框
function showLicenseActivationDialog() {
    proxy.$modal.msgError('系统未激活或License已过期，请先激活License才能使用系统功能')
    showActivationDialog.value = true
}

async function beforeUpload(file) {
    // 验证文件类型
    const isValidType = file.name.toLowerCase().endsWith('.lic') || file.name.toLowerCase().endsWith('.license')
    if (!isValidType) {
        proxy.$modal.msgError('只能上传 .lic 或 .license 格式的文件！')
        return false
    }

    // 验证文件大小 (最大1MB)
    const isLt1M = file.size / 1024 / 1024 < 1
    if (!isLt1M) {
        proxy.$modal.msgError('License文件大小不能超过 1MB！')
        return false
    }

    try {
        // 显示加载状态
        const loadingInstance = proxy.$loading({
            lock: true,
            text: '正在验证License文件...',
            background: 'rgba(0, 0, 0, 0.7)'
        })

        // 调用后端API上传并验证License文件
        const response = await uploadLicenseFile(file)

        loadingInstance.close()

        if (response.code === 200) {
            // 激活成功
            proxy.$modal.msgSuccess('License激活成功！')
            showActivationDialog.value = false
            // 重新检查License状态
            await checkLicenseStatus()
        } else {
            // 激活失败
            proxy.$modal.msgError(response.msg || 'License激活失败，请检查文件是否正确')
        }
    } catch (error) {
        console.error('License激活失败:', error)
        proxy.$modal.msgError('License激活失败，请重试')
    }

    return false // 阻止默认上传
}

function copyMachineCode() {
    navigator.clipboard.writeText(machineCode.value).then(() => {
        proxy.$modal.msgSuccess('机器码已复制到剪贴板')
    }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = machineCode.value
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        proxy.$modal.msgSuccess('机器码已复制到剪贴板')
    })
}

// 获取机器码
async function loadMachineCode() {
    try {
        const response = await getMachineCode()
        if (response.code === 200) {
            // 优先使用data字段，如果data为null则使用msg字段
            machineCode.value = response.data || response.msg
        } else {
            machineCode.value = '获取机器码失败'
        }
    } catch (error) {
        console.error('获取机器码失败:', error)
        machineCode.value = '获取机器码失败'
    }
}

// License激活成功处理
function handleLicenseSuccess(licenseData) {
    showActivationDialog.value = false
    // 重新检查License状态
    checkLicenseStatus()
    proxy.$modal.msgSuccess('License激活成功！系统已激活，可以正常使用')
}

// License激活失败处理
function handleLicenseError(errorMessage) {
    console.error('License激活失败:', errorMessage)
    proxy.$modal.msgError('License激活失败: ' + errorMessage)
}

// 页面初始化
onMounted(() => {
    getCode()
    getCookie()
    checkLicenseStatus()
    loadMachineCode()
})
  </script>

  <style lang='scss' scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/images/bg.jpg");
    background-size: cover;
}
.title {
    margin: 0px auto 35px auto;
    text-align: center;
    color: #303133;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 1px;
}
.login-container {
    border-radius: 20px;
    width: 500px;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.01); /* 设置背景颜色和透明度 */
    box-shadow: 0px 0px 10px 2px #cec8c8;
    backdrop-filter: blur(10px);
    &:hover {
        box-shadow: 0 0 40px #cec8c8;
    }
}

.license-status-section {
    width: 100%;
    margin-bottom: 5px;
}

.license-not-activated,
.license-activated {
    width: 100%;
}

.login-form {
    border-radius: 8px;
    background: #ffffff;
    width: 400px;
    padding: 30px 30px 15px 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    .el-input {
        height: 40px;
        input {
            height: 40px;
        }
    }
    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 0px;
    }
}
.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}
.login-code {
    width: 33%;
    height: 40px;
    float: right;
    img {
        cursor: pointer;
        vertical-align: middle;
    }
}
.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}
.login-code-img {
    height: 40px;
    padding-left: 12px;
}

/* License激活对话框样式 */
.activation-content {
    .upload-dragger {
        width: 100%;
        margin-bottom: 20px;

        :deep(.el-upload-dragger) {
            width: 100%;
            padding: 40px 20px;
            background: #fafafa;
            border: 2px dashed #d9d9d9;
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
                border-color: #409eff;
                background: #f0f9ff;
            }
        }
    }

    .upload-content {
        text-align: center;

        .upload-icon {
            font-size: 48px;
            color: #c0c4cc;
            margin-bottom: 16px;
        }

        .upload-text {
            .main-text {
                font-size: 16px;
                color: #606266;
                margin-bottom: 8px;

                em {
                    color: #409eff;
                    font-style: normal;
                    text-decoration: underline;
                }
            }

            .sub-text {
                font-size: 14px;
                color: #909399;
            }
        }
    }

    .machine-code-section {
        margin-top: 20px;

        .machine-code-info {
            margin-top: 16px;

            .machine-code-display {
                margin-top: 12px;

                .machine-code-input {
                    font-family: 'Courier New', monospace;

                    :deep(.el-input__inner) {
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        background: #f5f5f5;
                    }
                }
            }
        }
    }
}
</style>
