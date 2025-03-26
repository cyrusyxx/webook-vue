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
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { request } from '@/utils/request'

const router = useRouter()
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

// 发送验证码
const handleSendCode = async () => {
  if (!form.value.phone) {
    ElMessage.warning('请先输入手机号码')
    return
  }

  try {
    const res = await request.post('/users/login_sms/code/send', {
      phone: form.value.phone
    })
    if (res.data.code === 0) {
      ElMessage.success('验证码已发送')
      startCountdown()
    } else {
      ElMessage.error(res.data.msg || '发送验证码失败')
    }
  } catch (error) {
    ElMessage.error('发送验证码失败')
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
        const res = await request.post('/users/login_sms', form.value)
        if (res.data.code === 0) {
          ElMessage.success('登录成功')
          router.push('/users/profile')
        } else {
          ElMessage.error(res.data.msg || '登录失败')
        }
      } catch (error) {
        ElMessage.error('登录失败')
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