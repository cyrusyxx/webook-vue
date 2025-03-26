<template>
  <div class="login">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="login-form"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            登录
          </el-button>
          <el-button @click="handleRegister">注册</el-button>
          <el-button link type="primary" @click="handleSMSLogin">
            短信登录
          </el-button>
          <el-button link type="primary" @click="handleWechatLogin">
            微信登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { login } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const formRef = ref<FormInstance>()
const userStore = useUserStore()

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
        console.log('开始登录，表单数据:', form.value)
        await login(form.value)  // token 已经在响应拦截器中处理
        ElMessage.success('登录成功')
        const redirect = route.query.redirect as string
        router.push(redirect || '/articles')
      } catch (error: any) {
        console.error('登录失败:', error)
        if (error.response) {
          console.error('错误响应:', error.response.data)
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

// 短信登录
const handleSMSLogin = () => {
  router.push('/users/login_sms')
}

// 微信登录
const handleWechatLogin = () => {
  router.push('/users/login_wechat')
}
</script>

<style scoped>
.login {
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
</style> 