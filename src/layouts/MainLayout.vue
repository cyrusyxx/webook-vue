<template>
  <el-container class="layout-container">
    <el-header>
      <div class="header-content">
        <div class="logo">
          <router-link to="/">WeBook</router-link>
        </div>
        <div class="nav">
          <router-link to="/" exact-active-class="active">主页</router-link>
          <router-link to="/articles/top" exact-active-class="active">热榜</router-link>
          <router-link to="/articles" exact-active-class="active">我的文章</router-link>
        </div>
        <div class="user-info">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="user-name">
              {{ userStore.profile?.nickname || '未登录' }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ArrowDown } from '@element-plus/icons-vue'
import { getProfile } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

// 获取用户信息
const getUserProfile = async () => {
  try {
    const res = await getProfile()
    if (res) {
      userStore.setProfile(res)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/users/profile')
      break
    case 'logout':
      userStore.logout()
      router.push('/users/login')
      break
  }
}

onMounted(() => {
  if (userStore.token) {
    getUserProfile()
  }
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav a {
  color: #496E7C;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav a:hover {
  color: #409eff;
}

.nav a.active {
  color: #409eff;
}

.user-info {
  cursor: pointer;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.user-name:hover {
  background-color: transparent;
}

:deep(.el-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f7fa;
}

.el-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style> 