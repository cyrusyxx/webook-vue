<template>
  <div class="profile" v-loading="loading">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h2>个人信息</h2>
          <el-button type="primary" @click="handleEdit">修改</el-button>
        </div>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="邮箱">
          {{ profile.Email }}
        </el-descriptions-item>
        <el-descriptions-item label="手机">
          {{ profile.Phone }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          {{ profile.Nickname }}
        </el-descriptions-item>
        <el-descriptions-item label="生日">
          {{ profile.Birthday }}
        </el-descriptions-item>
        <el-descriptions-item label="关于我">
          {{ profile.AboutMe }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProfile } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const profile = ref({
  Email: '',
  Phone: '',
  Nickname: '',
  Birthday: '',
  AboutMe: ''
})

// 获取个人信息
const getProfileData = async () => {
  loading.value = true
  try {
    const res = await getProfile()
    profile.value = res.data
  } catch (error) {
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