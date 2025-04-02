<template>
  <div class="article-list-container">
    <div class="article-list-content">
      <div class="header">
        <h1>推荐文章</h1>
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
              <router-link :to="`/articles/${row.id}`" class="article-title">
                {{ row.title }}
              </router-link>
            </template>
          </el-table-column>
          
          <el-table-column prop="abstract" label="摘要" min-width="300" show-overflow-tooltip />
          
          <el-table-column prop="authorName" label="作者" width="120" />
          
          <el-table-column label="互动" width="200">
            <template #default="{ row }">
              <div class="interaction-info">
                <span class="interaction-item">
                  <el-icon><View /></el-icon> {{ row.viewCnt || 0 }}
                </span>
                <span class="interaction-item">
                  <el-icon><Star /></el-icon> {{ row.collectCnt || 0 }}
                </span>
                <span class="interaction-item">
                  <el-icon><ThumbUp /></el-icon> {{ row.likeCnt || 0 }}
                </span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="ctime" label="发布时间" width="180" />
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, Star, ThumbUp } from '@element-plus/icons-vue'
import { getPubArticleList, type Article } from '@/api/article'

const router = useRouter()
const loading = ref(false)
const articles = ref<Article[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取公共文章列表
const getArticles = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * pageSize.value
    const res = await getPubArticleList({
      offset,
      limit: pageSize.value
    })
    // 根据request.ts中的响应拦截器，res已经是data部分了
    articles.value = Array.isArray(res) ? res : []
    // 这里假设后端返回的文章列表不会超过总数，实际项目中可能需要另外的API获取总数
    total.value = Math.max(articles.value.length + offset, total.value)
    
    // 如果当前页没有数据且不是第一页，返回上一页
    if (articles.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
      getArticles()
    }
  } catch (error) {
    console.error('获取公共文章列表失败:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getArticles()
}

// 处理每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 重置到第一页
  getArticles()
}

onMounted(() => {
  console.log('Home component mounted!')
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 