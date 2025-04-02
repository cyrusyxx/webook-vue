<template>
  <div class="login-sms">
    <el-card class="login-card">
      <template #header>
        <h2>短信登录</h2>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="login-form"
      >
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>

        <el-form-item label="验证码" prop="code">
          <div class="code-input">
            <el-input v-model="form.code" placeholder="请输入验证码" />
            <el-button
              type="primary"
              :disabled="!!countdown"
              @click="handleSendCode"
            >
              {{ countdown ? `${countdown}s后重试` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            登录/注册
          </el-button>
          <el-button @click="handleBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { request } from '@/utils/request'
import { getProfile, refreshToken, loginBySMS, sendSMSCode } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
const formRef = ref<FormInstance>()
const countdown = ref(0)
let timer: number | null = null

const form = ref({
  phone: '',
  code: ''
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ]
}

// 验证token并自动跳转
const validateToken = async () => {
  // 如果有token，尝试验证它是否有效
  if (userStore.token) {
    loading.value = true
    try {
      // 尝试获取用户信息，如果成功，说明token有效
      const profile = await getProfile()
      userStore.setProfile(profile)
      ElMessage.success('已自动登录')
      const redirect = route.query.redirect as string
      router.push(redirect || '/articles')
    } catch (error: any) {
      console.error('Token验证失败:', error)
      
      // 如果是401错误且有refreshToken，尝试刷新token
      if (error.response?.status === 401 && userStore.refreshToken) {
        try {
          console.log('尝试刷新token')
          await refreshToken()
          // 刷新成功后重新获取用户信息
          const profile = await getProfile()
          userStore.setProfile(profile)
          ElMessage.success('已自动登录')
          const redirect = route.query.redirect as string
          router.push(redirect || '/articles')
        } catch (refreshError) {
          console.error('刷新token失败，需要重新登录:', refreshError)
          userStore.logout()
        }
      } else {
        // Token无效，清除状态
        userStore.logout()
      }
    } finally {
      loading.value = false
    }
  }
}

// 发送验证码
const handleSendCode = async () => {
  if (!form.value.phone) {
    ElMessage.warning('请先输入手机号码')
    return
  }

  try {
    await sendSMSCode(form.value.phone)
    ElMessage.success('验证码已发送')
    startCountdown()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '发送验证码失败')
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  timer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, 1000)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await loginBySMS({
          phone: form.value.phone,
          code: form.value.code
        })
        // 获取用户信息
        const profile = await getProfile()
        userStore.setProfile(profile)
        ElMessage.success('登录成功')
        const redirect = route.query.redirect as string
        router.push(redirect || '/articles')
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 返回
const handleBack = () => {
  router.push('/users/login')
}

// 组件加载时验证token
onMounted(() => {
  validateToken()
})

// 组件销毁时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.login-sms {
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
}

.login-card {
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.login-form {
  margin-top: 20px;
}

.code-input {
  display: flex;
  gap: 10px;
}

.code-input .el-input {
  flex: 1;
}

.code-input .el-button {
  width: 120px;
  white-space: nowrap;
}
</style> 