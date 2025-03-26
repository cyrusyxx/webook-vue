<template>
  <div class="login-wechat">
    <el-card class="login-card">
      <template #header>
        <h2>微信登录</h2>
      </template>

      <div class="loading-container" v-loading="loading">
        <p>正在跳转到微信登录...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { request } from '@/utils/request'

const router = useRouter()
const loading = ref(true)

// 获取微信登录授权URL
const getWechatAuthUrl = async () => {
  try {
    const res = await request.get('/oauth2/wechat/authurl')
    if (res.data.code === 0 && res.data.data) {
      window.location.href = res.data.data
    } else {
      ElMessage.error(res.data.msg || '获取微信登录链接失败')
      router.push('/users/login')
    }
  } catch (error) {
    ElMessage.error('获取微信登录链接失败')
    router.push('/users/login')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getWechatAuthUrl()
})
</script>

<style scoped>
.login-wechat {
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

.loading-container {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-container p {
  margin: 0;
  font-size: 16px;
  color: #666;
}
</style> 