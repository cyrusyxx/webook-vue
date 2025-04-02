<template>
  <div class="profile" v-loading="loading">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h2>个人信息</h2>
          <el-button type="primary" @click="handleEdit">修改</el-button>
        </div>
      </template>

      <el-descriptions :column="1" border v-if="profile">
        <el-descriptions-item label="邮箱">
          {{ profile.email || '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="手机">
          {{ profile.phone || '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          {{ profile.nickname || '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="生日">
          {{ profile.birthday || '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="关于我">
          {{ profile.description || '未设置' }}
        </el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="加载失败" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProfile } from '@/api/user'
import type { Profile } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const profile = ref<Profile | null>(null)

// 获取个人信息
const getProfileData = async () => {
  loading.value = true
  try {
    const res = await getProfile()
    if (res) {
      profile.value = res
    } else {
      ElMessage.error('获取个人信息失败')
    }
  } catch (error) {
    console.error('获取个人信息失败:', error)
    ElMessage.error('获取个人信息失败')
  } finally {
    loading.value = false
  }
}

// 编辑个人信息
const handleEdit = () => {
  router.push('/users/edit')
}

onMounted(() => {
  getProfileData()
})
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

:deep(.el-descriptions__label) {
  width: 120px;
}
</style> 