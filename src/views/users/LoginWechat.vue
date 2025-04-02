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
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { request } from '@/utils/request'
import { getProfile, refreshToken } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(true)

// 验证token并自动跳转
const validateToken = async () => {
  // 如果有token，尝试验证它是否有效
  if (userStore.token) {
    try {
      // 尝试获取用户信息，如果成功，说明token有效
      const profile = await getProfile()
      userStore.setProfile(profile)
      ElMessage.success('已自动登录')
      const redirect = route.query.redirect as string
      router.push(redirect || '/articles')
      return true // 返回验证成功标志
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
          return true // 返回验证成功标志
        } catch (refreshError) {
          console.error('刷新token失败，需要重新登录:', refreshError)
          userStore.logout()
        }
      } else {
        // Token无效，清除状态
        userStore.logout()
      }
    }
  }
  return false // 返回验证失败标志
}

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

onMounted(async () => {
  // 先验证token，如果验证失败才获取微信登录URL
  const tokenValid = await validateToken()
  if (!tokenValid) {
    getWechatAuthUrl()
  }
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