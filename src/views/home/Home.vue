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
          
          <el-table-column prop="author_name" label="作者" width="120" />
          
          <el-table-column label="互动" width="200">
            <template #default="{ row }">
              <div class="interaction-info">
                <span class="interaction-item">
                  <el-icon><View /></el-icon> {{ row.view_cnt || 0 }}
                </span>
                <span class="interaction-item">
                  <el-icon><Pointer /></el-icon> {{ row.like_cnt || 0 }}
                </span>
                <span class="interaction-item">
                  <el-icon><Star /></el-icon> {{ row.collect_cnt || 0 }}
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
            :pager-count="5"
            layout="sizes, prev, pager, next"
            :total="calculateTotal()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, Star, Pointer } from '@element-plus/icons-vue'
import { getPubArticleList, type Article } from '@/api/article'

// 打印调试信息
console.log('Home 组件初始化')
console.log('可用图标:', Object.keys({ View, Star, Pointer }))

const router = useRouter()
const loading = ref(false)
const articles = ref<Article[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const hasNextPage = ref(true)

// 计算总页数，始终至少显示当前页+1页（除非当前页已经是最后一页）
const calculateTotal = () => {
  const baseTotal = currentPage.value * pageSize.value
  return hasNextPage.value ? baseTotal + pageSize.value : baseTotal
}

// 获取公共文章列表
const getArticles = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * pageSize.value
    const res = await getPubArticleList({
      offset,
      limit: pageSize.value + 1 // 多获取一条判断是否有下一页
    })
    
    // 判断是否有下一页
    if (Array.isArray(res) && res.length > pageSize.value) {
      // 有下一页，移除多余的数据
      hasNextPage.value = true
      articles.value = res.slice(0, pageSize.value)
    } else {
      // 没有下一页
      hasNextPage.value = false
      articles.value = Array.isArray(res) ? res : []
    }
    
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