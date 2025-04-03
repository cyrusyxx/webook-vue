<template>
  <div class="article-list-container">
    <div class="article-list-content">
      <div class="header">
        <h1>热榜</h1>
      </div>

      <el-card class="article-table-card" shadow="hover">
        <el-table
          v-loading="loading"
          :data="articles"
          style="width: 100%"
          :header-cell-style="{background: '#f8f9fa', color: '#496E7C'}"
        >
          <el-table-column type="index" label="排行" width="80" align="center">
            <template #default="{ $index }">
              <div class="rank-number" :class="{
                'rank-first': $index === 0,
                'rank-second': $index === 1,
                'rank-third': $index === 2
              }">
                {{ $index + 1 }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="title" label="标题" min-width="200">
            <template #default="{ row }">
              <router-link :to="`/articles/${row.id}`" class="article-title">
                {{ row.title }}
              </router-link>
            </template>
          </el-table-column>
          
          <el-table-column prop="abstract" label="摘要" min-width="300" show-overflow-tooltip />
          
          <el-table-column prop="author_name" label="作者" width="120" />
          
          <el-table-column label="互动" width="200">
            <template #default="{ row }">
              <div class="interaction-info">
                <span class="interaction-item">
                  <el-icon><View /></el-icon> {{ row.viewCnt || 0 }}
                </span>
                <span class="interaction-item">
                  <el-icon><Pointer /></el-icon> {{ row.likeCnt || 0 }}
                </span>
                <span class="interaction-item">
                  <el-icon><Star /></el-icon> {{ row.collectCnt || 0 }}
                </span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="ctime" label="发布时间" width="180" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, Star, Pointer } from '@element-plus/icons-vue'
import { getTopArticles, type Article } from '@/api/article'

const router = useRouter()
const loading = ref(false)
const articles = ref<Article[]>([])

// 获取热榜文章
const getArticles = async () => {
  loading.value = true
  try {
    const res = await getTopArticles()
    articles.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('获取热榜文章失败:', error)
    ElMessage.error('获取热榜文章失败')
  } finally {
    loading.value = false
  }
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
  width: 100%;
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

.article-title {
  color: #496E7C;
  font-weight: 500;
  text-decoration: none;
}

.article-title:hover {
  color: #409eff;
  text-decoration: underline;
}

.interaction-info {
  display: flex;
  align-items: center;
}

.interaction-item {
  display: flex;
  align-items: center;
  margin-right: 12px;
  color: #909399;
}

.interaction-item .el-icon {
  margin-right: 4px;
}

.rank-number {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background-color: #f5f7fa;
  color: #909399;
  font-weight: 600;
  margin: 0 auto;
}

.rank-first {
  background-color: #f56c6c;
  color: white;
}

.rank-second {
  background-color: #f78989;
  color: white;
}

.rank-third {
  background-color: #f9a6a6;
  color: white;
}
</style> 