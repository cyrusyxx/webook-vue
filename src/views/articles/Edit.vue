<template>
  <div class="article-edit">
    <h1>创作中心</h1>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      
      <el-form-item label="内容" prop="content">
        <editor v-model="form.content" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handlePublish">发表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import Editor from '@/components/editor/index.vue'
import { getArticleDetail, editArticle, publishArticle } from '@/api/article'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const form = ref({
  title: '',
  content: '',
  id: undefined as number | undefined
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

// 获取文章详情
const getArticle = async (id: string) => {
  try {
    const res = await getArticleDetail(parseInt(id))
    form.value = res.data
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  }
}

// 保存文章
const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await editArticle(form.value)
        ElMessage.success('保存成功')
        router.push('/articles')
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}

// 发表文章
const handlePublish = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await publishArticle(form.value)
        ElMessage.success('发表成功')
        router.push(`/articles/${res.data}`)
      } catch (error) {
        ElMessage.error('发表失败')
      }
    }
  })
}

onMounted(() => {
  const id = route.query.id as string
  if (id) {
    getArticle(id)
  }
})
</script>

<style scoped>
.article-edit {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}
</style> 