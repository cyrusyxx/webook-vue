<template>
  <div class="article-edit">
    <div class="header">
      <h1>{{ id ? '编辑文章' : '写文章' }}</h1>
      <div class="actions">
        <el-button @click="handleSave" :loading="saving">保存</el-button>
        <el-button type="primary" @click="handlePublish" :loading="publishing">发布</el-button>
      </div>
    </div>

    <Editor v-model="article" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Editor from '@/components/editor/index.vue'
import { getArticleDetail, editArticle, publishArticle } from '@/api/article'

const route = useRoute()
const router = useRouter()
const id = ref(route.query.id ? Number(route.query.id) : undefined)

const article = ref({
  title: '',
  content: ''
})
const saving = ref(false)
const publishing = ref(false)

// 获取文章详情
const getDetail = async () => {
  if (!id.value) return
  
  try {
    const res = await getArticleDetail(id.value)
    article.value = {
      title: res.title,
      content: res.content
    }
  } catch (error) {
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
    await editArticle({
      id: id.value,
      title: article.value.title,
      content: article.value.content
    })
    ElMessage.success('保存成功')
    router.push('/articles')
  } catch (error) {
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
    await publishArticle({
      id: id.value,
      title: article.value.title,
      content: article.value.content
    })
    ElMessage.success('发布成功')
    router.push('/articles')
  } catch (error) {
    ElMessage.error('发布失败')
  } finally {
    publishing.value = false
  }
}

onMounted(() => {
  if (id.value) {
    getDetail()
  }
})
</script>

<style scoped>
.article-edit {
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

.actions {
  display: flex;
  gap: 10px;
}
</style> 