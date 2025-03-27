<template>
  <div class="register-container">
    <div class="register-form-box">
      <div class="register-header">
        <h2 class="animate__animated animate__fadeIn animate__faster">创建账号</h2>
        <p class="animate__animated animate__fadeIn animate__faster animate__delay-02s">注册一个新账号以访问所有功能</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="register-form animate__animated animate__fadeIn animate__faster animate__delay-03s"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
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

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :prefix-icon="Key"
            show-password
          />
        </el-form-item>

        <div class="form-actions">
          <el-button
            type="primary"
            class="submit-btn"
            @click="handleSubmit"
            :loading="loading"
          >
            注册
          </el-button>
          
          <el-button class="back-btn" @click="handleBack">返回登录</el-button>
        </div>

        <div class="terms">
          点击"注册"，即表示您同意我们的
          <el-button link type="primary" @click="showTerms">服务条款</el-button>
          和
          <el-button link type="primary" @click="showPrivacy">隐私政策</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { Message, Lock, Key } from '@element-plus/icons-vue'
import { register } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const formRef = ref<FormInstance>()

const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能小于8位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await register(form.value)
        ElMessage.success('注册成功')
        router.push('/users/login')
      } catch (error: any) {
        if (error.response) {
          ElMessage.error(error.response.data.message || '注册失败')
        } else {
          ElMessage.error('注册失败，请检查网络连接')
        }
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

// 显示条款
const showTerms = () => {
  ElMessage.info('服务条款页面')
}

// 显示隐私政策
const showPrivacy = () => {
  ElMessage.info('隐私政策页面')
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

.animate__delay-02s {
  animation-delay: 0.2s;
}

.animate__delay-03s {
  animation-delay: 0.3s;
}

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-form-box {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.register-form-box:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  font-size: 28px;
  color: #496E7C;
  margin-bottom: 8px;
  font-weight: 600;
}

.register-header p {
  color: #496E7C;
  font-size: 16px;
}

.register-form :deep(.el-form-item) {
  margin-bottom: 25px;
}

.register-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #91B2BE;
  padding: 0 15px;
  height: 48px;
  transition: all 0.3s;
}

.register-form :deep(.el-input__wrapper:hover) {
  border-color: #749DAD;
}

.register-form :deep(.el-input__wrapper.is-focus) {
  border-color: #496E7C;
  box-shadow: 0 0 0 2px rgba(73, 110, 124, 0.2);
}

.register-form :deep(.el-input__inner) {
  height: 48px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.submit-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  background: #749DAD;
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #5d8191;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(116, 157, 173, 0.4);
}

.back-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  border-color: #91B2BE;
  color: #749DAD;
}

.back-btn:hover {
  border-color: #496E7C;
  color: #273B42;
}

.terms {
  text-align: center;
  color: #749DAD;
  font-size: 12px;
  margin-top: 20px;
}

.terms :deep(.el-button) {
  color: #496E7C;
}

@media (max-width: 480px) {
  .register-form-box {
    padding: 30px 20px;
  }
  
  .register-header h2 {
    font-size: 24px;
  }
  
  .register-header p {
    font-size: 14px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 