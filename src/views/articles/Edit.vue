<template>
  <div class="article-edit-container">
    <div class="article-edit-content">
      <div class="header">
        <h1>{{ id ? '编辑文章' : '创建新文章' }}</h1>
        <div class="actions">
          <el-button @click="router.push('/articles')" plain>取消</el-button>
          <el-button @click="handleSave" :loading="saving">
            <el-icon class="el-icon--left"><Document /></el-icon>
            保存草稿
          </el-button>
          <el-button type="primary" @click="handlePublish" :loading="publishing">
            <el-icon class="el-icon--left"><Position /></el-icon>
            发布文章
          </el-button>
        </div>
      </div>

      <el-card class="editor-card" shadow="hover">
        <Editor v-model="article" />
      </el-card>
      
      <div class="tips">
        <el-alert
          title="编辑提示"
          type="info"
          description="请填写文章标题和内容，文章发布后将显示在您的个人主页。您可以随时编辑或删除已发布的文章。"
          show-icon
          :closable="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, Position } from '@element-plus/icons-vue'
import Editor from '@/components/editor/index.vue'
import { getArticleDetail, editArticle, publishArticle, type EditArticleParams } from '@/api/article'

const route = useRoute()
const router = useRouter()
const id = ref(route.params.id ? Number(route.params.id) : undefined)

const article = ref({
  title: '',
  content: ''
})
const saving = ref(false)
const publishing = ref(false)

// 获取文章详情
const getDetail = async () => {
  if (!id.value) return
  
  console.log('获取文章详情，ID:', id.value, typeof id.value)
  
  try {
    const res = await getArticleDetail(id.value)
    article.value = {
      title: res.title,
      content: res.content
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
    ElMessage.error('获取文章详情失败')
  }
}

// 保存文章
const handleSave = async () => {
  if (!article.value.title || !article.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  saving.value = true
  try {
    // 创建请求参数对象，仅在id有值时才包含id字段
    const params: EditArticleParams = {
      title: article.value.title,
      content: article.value.content
    }
    
    // 仅当id存在且不为undefined时添加id字段
    if (id.value !== undefined) {
      params.id = id.value
    }
    
    await editArticle(params)
    ElMessage.success('保存成功')
    router.push('/articles')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 发布文章
const handlePublish = async () => {
  if (!article.value.title || !article.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  publishing.value = true
  try {
    // 创建请求参数对象，仅在id有值时才包含id字段
    const params: EditArticleParams = {
      title: article.value.title,
      content: article.value.content
    }
    
    // 仅当id存在且不为undefined时添加id字段
    if (id.value !== undefined) {
      params.id = id.value
    }
    
    await publishArticle(params)
    ElMessage.success('发布成功')
    router.push('/articles')
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败')
  } finally {
    publishing.value = false
  }
}

onMounted(() => {
  console.log('路由参数:', route.params, route.query, route.path)
  if (id.value) {
    getDetail()
  }
})
</script>

<style scoped>
.article-edit-container {
  min-height: 100vh;
  padding: 20px;
  width: 1000px;
  margin: 0 auto;
}

.article-edit-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #496E7C;
}

.actions {
  display: flex;
  gap: 15px;
}

.editor-card {
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

:deep(.el-card__body) {
  padding: 30px;
}

.tips {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .article-edit-content {
    padding: 15px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}
</style> 