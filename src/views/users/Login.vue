<template>
  <div class="login-container">
    <div class="login-form-box">
      <div class="login-header">
        <h2 class="animate__animated animate__fadeIn animate__faster">欢迎回来</h2>
        <p class="animate__animated animate__fadeIn animate__faster animate__delay-02s">登录您的账号以继续</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form animate__animated animate__fadeIn animate__faster animate__delay-03s"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱"
            :prefix-icon="UserFilled"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="remember">记住我</el-checkbox>
          <el-button link type="primary" @click="handleForgotPassword">
            忘记密码?
          </el-button>
        </div>

        <el-button
          type="primary"
          class="submit-btn"
          @click="handleSubmit"
          :loading="loading"
        >
          登录
        </el-button>

        <div class="register-link">
          还没有账号？
          <el-button link type="primary" @click="handleRegister">
            立即注册
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { login, getProfile, refreshToken } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const formRef = ref<FormInstance>()
const userStore = useUserStore()
const remember = ref(false)

const form = ref({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能小于8位', trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await login(form.value)  // token 已经在响应拦截器中处理
        // 获取用户信息
        const profile = await getProfile()
        userStore.setProfile(profile)
        ElMessage.success('登录成功')
        const redirect = route.query.redirect as string
        router.push(redirect || '/articles')
      } catch (error: any) {
        if (error.response) {
          ElMessage.error(error.response.data.message || '登录失败')
        } else {
          ElMessage.error('登录失败，请检查网络连接')
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 注册
const handleRegister = () => {
  router.push('/users/register')
}

// 忘记密码
const handleForgotPassword = () => {
  ElMessage.info('请联系管理员重置密码')
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

onMounted(() => {
  validateToken()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

.animate__delay-02s {
  animation-delay: 0.2s;
}

.animate__delay-03s {
  animation-delay: 0.3s;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-form-box {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.login-form-box:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 28px;
  color: #496E7C;
  margin-bottom: 8px;
  font-weight: 600;
}

.login-header p {
  color: #496E7C;
  font-size: 16px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 25px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #91B2BE;
  padding: 0 15px;
  height: 48px;
  transition: all 0.3s;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #749DAD;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #496E7C;
  box-shadow: 0 0 0 2px rgba(73, 110, 124, 0.2);
}

.login-form :deep(.el-input__inner) {
  height: 48px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.form-options :deep(.el-checkbox__label) {
  color: #496E7C;
}

.form-options :deep(.el-button) {
  color: #496E7C;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  background: #749DAD;
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #5d8191;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(116, 157, 173, 0.4);
}

.register-link {
  text-align: center;
  color: #749DAD;
  font-size: 14px;
  margin-top: 20px;
}

.register-link :deep(.el-button) {
  color: #496E7C;
}

@media (max-width: 480px) {
  .login-form-box {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
  
  .login-header p {
    font-size: 14px;
  }
}
</style> 