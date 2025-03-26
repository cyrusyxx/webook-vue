<template>
  <div class="article-list">
    <div class="header">
      <h1>文章列表</h1>
      <el-button type="primary" @click="handleCreate">写作</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="articles"
      style="width: 100%"
    >
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <el-link type="primary" @click="handleView(row)">{{ row.title }}</el-link>
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
      
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
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
    articles.value = res.data
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
  router.push(`/articles/edit?id=${row.id}`)
}

// 查看文章
const handleView = (row: any) => {
  router.push(`/articles/${row.id}`)
}

onMounted(() => {
  getArticles()
})
</script>

<style scoped>
.article-list {
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
  font-size: 24px;
  font-weight: bold;
}
</style> 