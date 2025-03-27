<template>
  <div class="article-list-container">
    <div class="article-list-content">
      <div class="header">
        <h1>文章列表</h1>
        <el-button type="primary" class="create-btn" @click="handleCreate">
          <el-icon class="el-icon--left"><Plus /></el-icon>
          写作
        </el-button>
      </div>

      <el-card class="article-table-card" shadow="hover">
        <el-table
          v-loading="loading"
          :data="articles"
          style="width: 100%"
          :header-cell-style="{background: '#f8f9fa', color: '#496E7C'}"
        >
          <el-table-column prop="title" label="标题" min-width="200">
            <template #default="{ row }">
              <span class="article-title">{{ row.title }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="abstract" label="摘要" min-width="300" show-overflow-tooltip />
          
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">
                <el-icon class="el-icon--left"><Edit /></el-icon>
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import { getArticleList } from '@/api/article'

const router = useRouter()
const loading = ref(false)
const articles = ref([])

// 获取文章列表
const getArticles = async () => {
  loading.value = true
  try {
    const res = await getArticleList({
      offset: 0,
      limit: 100
    })
    articles.value = res  // 直接使用响应数据
  } catch (error) {
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 获取状态类型
const getStatusType = (status: number) => {
  switch (status) {
    case 1:
      return 'info'
    case 2:
      return 'success'
    case 3:
      return 'warning'
    default:
      return ''
  }
}

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 1:
      return '未发表'
    case 2:
      return '已发表'
    case 3:
      return '仅自己可见'
    default:
      return '未知'
  }
}

// 创建文章
const handleCreate = () => {
  router.push('/articles/edit')
}

// 编辑文章
const handleEdit = (row: any) => {
  router.push(`/articles/edit/${row.id}`)
}

// 刷新列表
const refreshList = () => {
  getArticles()
}

onMounted(() => {
  getArticles()
})
</script>

<style scoped>
.article-list-container {
  min-height: 100vh;
  padding: 20px;
}

.article-list-content {
  width: 101%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #496E7C;
}

.create-btn {
  background: #749DAD;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background: #5d8191;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(116, 157, 173, 0.4);
}

.article-table-card {
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-table th) {
  font-weight: 600;
}

:deep(.el-link) {
  color: #496E7C;
}

:deep(.el-link:hover) {
  color: #749DAD;
}

:deep(.el-button--primary) {
  color: #496E7C;
}

:deep(.el-button--primary:hover) {
  color: #749DAD;
}

.article-title {
  color: #496E7C;
  font-weight: 500;
}
</style> 