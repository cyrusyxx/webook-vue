<template>
  <div class="article-detail-container">
    <div class="article-detail-content" v-loading="loading">
      <template v-if="article">
        <el-card class="article-card" shadow="hover">
          <div class="article-header">
            <h1>{{ article.title }}</h1>
            <div class="article-meta">
              <span class="publish-time">发布时间: {{ formatDate(article.utime) }}</span>
              <span class="read-count">阅读量: {{ article.view_cnt || 0 }}</span>
            </div>
            <div class="article-actions">
              <el-button 
                :type="article.liked ? 'primary' : 'default'" 
                class="action-btn" 
                @click="handleLike"
              >
                <el-icon><Star /></el-icon>
                {{ article.liked ? '已点赞' : '点赞' }}
                <span class="count">{{ article.like_cnt || 0 }}</span>
              </el-button>
              <el-button 
                :type="article.collected ? 'primary' : 'default'" 
                class="action-btn" 
                @click="handleCollect"
              >
                <el-icon><Collection /></el-icon>
                {{ article.collected ? '已收藏' : '收藏' }}
                <span class="count">{{ article.collect_cnt || 0 }}</span>
              </el-button>
            </div>
          </div>

          <el-divider />

          <div class="article-content" v-html="article.content"></div>
        </el-card>

        <!-- 评论区域 -->
        <el-card class="comment-card" shadow="hover">
          <template #header>
            <div class="comment-header">
              <h2>评论</h2>
              <span class="comment-count">{{ comments.length }} 条评论</span>
            </div>
          </template>

          <!-- 评论表单 -->
          <div class="comment-form">
            <el-input
              v-model="commentContent"
              type="textarea"
              :rows="3"
              placeholder="写下你的评论..."
              :maxlength="500"
              show-word-limit
            />
            <div class="comment-form-actions">
              <el-button type="primary" @click="submitComment" :loading="submitting">
                发表评论
              </el-button>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comment-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-user">
                <div class="comment-user-info">
                  <span class="comment-username">{{ comment.user.nick_name || '匿名用户' }}</span>
                  <span class="comment-time">{{ formatDate(comment.ctime) }}</span>
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <el-button 
                  v-if="comment.user.id === userStore.profile?.id"
                  type="danger" 
                  link 
                  @click="deleteComment(comment.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </template>
      <template v-else>
        <el-empty description="文章不存在" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, Collection } from '@element-plus/icons-vue'
import { getPubArticleDetail, likeArticle, collectArticle } from '@/api/article'
import { useUserStore } from '@/stores/user'
import { getComments, addComment, deleteComment as deleteCommentApi } from '@/api/comment'

const route = useRoute()
const loading = ref(false)
const article = ref<any>(null)
const comments = ref<any[]>([])
const commentContent = ref('')
const submitting = ref(false)
const userStore = useUserStore()

// 获取文章详情
const getArticle = async () => {
  loading.value = true
  try {
    const articleId = parseInt(route.params.id as string)
    if (isNaN(articleId)) {
      ElMessage.error('无效的文章ID')
      return
    }
    console.log('正在获取文章详情, ID:', articleId)
    const res = await getPubArticleDetail(articleId)
    article.value = res
    if (!article.value) {
      ElMessage.error('文章不存在或已被删除')
    }
  } catch (error: any) {
    console.error('获取文章详情失败:', error)
    ElMessage.error(error.response?.data?.message || '获取文章详情失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (timestamp: string | number) => {
  if (!timestamp) return '未知时间'
  
  // 如果是字符串，直接返回
  if (typeof timestamp === 'string') {
    return timestamp
  }
  
  // 如果是数字，转换为日期格式
  const date = new Date(timestamp * 1000)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 点赞
const handleLike = async () => {
  if (!article.value) return
  
  try {
    await likeArticle(article.value.id, !article.value.liked)
    if (article.value.liked) {
      article.value.like_cnt = (article.value.like_cnt || 1) - 1
    } else {
      article.value.like_cnt = (article.value.like_cnt || 0) + 1
    }
    article.value.liked = !article.value.liked
    ElMessage.success(article.value.liked ? '点赞成功' : '取消点赞成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 收藏
const handleCollect = async () => {
  if (!article.value) return
  
  try {
    // 如果已经收藏，则取消收藏
    if (article.value.collected) {
      await collectArticle(article.value.id, 0, false) // 使用collect=false表示取消收藏
      article.value.collect_cnt = (article.value.collect_cnt || 1) - 1
      article.value.collected = false
      ElMessage.success('取消收藏成功')
    } else {
      // 否则添加收藏
      await collectArticle(article.value.id, 0, true) // 使用collect=true表示添加收藏
      article.value.collect_cnt = (article.value.collect_cnt || 0) + 1
      article.value.collected = true
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 获取评论列表
const getCommentList = async () => {
  try {
    const articleId = parseInt(route.params.id as string)
    if (isNaN(articleId)) {
      console.warn('无效的文章ID')
      comments.value = []
      return
    }
    const res = await getComments(articleId, { limit: 10, offset: 0 })
    comments.value = res || []
  } catch (error) {
    console.error('获取评论列表失败:', error)
    ElMessage.error('获取评论列表失败')
    comments.value = []
  }
}

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  if (!userStore.token) {
    ElMessage.warning('请先登录')
    return
  }

  submitting.value = true
  try {
    const articleId = parseInt(route.params.id as string)
    if (isNaN(articleId)) return
    await addComment(articleId, commentContent.value)
    commentContent.value = ''
    ElMessage.success('评论成功')
    getCommentList()
  } catch (error) {
    console.error('发表评论失败:', error)
    ElMessage.error('发表评论失败')
  } finally {
    submitting.value = false
  }
}

// 删除评论
const deleteComment = async (commentId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const articleId = parseInt(route.params.id as string)
    if (isNaN(articleId)) return
    await deleteCommentApi(articleId, commentId)
    ElMessage.success('删除成功')
    getCommentList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error('删除评论失败')
    }
  }
}

onMounted(() => {
  getArticle()
  getCommentList()
})
</script>

<style scoped>
.article-detail-container {
  min-height: 100vh;
  padding: 20px;
}

.article-detail-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.article-card {
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.article-header {
  padding-bottom: 20px;
}

h1 {
  margin: 0 0 20px;
  font-size: 28px;
  font-weight: 600;
  color: #496E7C;
}

.article-meta {
  display: flex;
  gap: 20px;
  color: #91B2BE;
  font-size: 14px;
  margin-bottom: 20px;
}

.article-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:not(.el-button--primary) {
  color: #496E7C;
  border-color: #91B2BE;
}

.action-btn.el-button--primary {
  background-color: #749DAD;
  border-color: #749DAD;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(116, 157, 173, 0.3);
}

.count {
  margin-left: 4px;
  font-size: 12px;
  color: inherit;
}

.article-content {
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  padding: 20px 0;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 15px 0;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  color: #496E7C;
  margin-top: 30px;
  margin-bottom: 15px;
}

.article-content :deep(p) {
  margin: 15px 0;
}

.article-content :deep(a) {
  color: #749DAD;
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

:deep(.el-divider) {
  margin: 10px 0;
  border-top: 1px solid #eaedf1;
}

@media (max-width: 768px) {
  .article-detail-content {
    padding: 10px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .article-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-btn {
    width: 100%;
  }
}

.comment-card {
  margin-top: 20px;
  border-radius: 12px;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-header h2 {
  margin: 0;
  font-size: 20px;
  color: #496E7C;
}

.comment-count {
  color: #91B2BE;
  font-size: 14px;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-user {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.comment-user-info {
  margin-left: 10px;
}

.comment-username {
  font-weight: 500;
  color: #496E7C;
}

.comment-time {
  margin-left: 10px;
  font-size: 12px;
  color: #91B2BE;
}

.comment-content {
  margin: 10px 0;
  line-height: 1.6;
  color: #333;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}
</style> 