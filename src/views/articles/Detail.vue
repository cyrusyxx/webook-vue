<template>
  <div class="article-detail-container">
    <div class="article-detail-content" v-loading="loading">
      <template v-if="article">
        <el-card class="article-card" shadow="hover">
          <div class="article-header">
            <h1>{{ article.title }}</h1>
            <div class="article-meta">
              <span class="publish-time">发布时间: {{ formatDate(article.ctime) }}</span>
              <span class="read-count">阅读量: {{ article.readCnt || 0 }}</span>
            </div>
            <div class="article-actions">
              <el-button 
                :type="article.liked ? 'primary' : 'default'" 
                class="action-btn" 
                @click="handleLike"
              >
                <el-icon><Star /></el-icon>
                {{ article.liked ? '已点赞' : '点赞' }}
                <span class="count">({{ article.likeCnt }})</span>
              </el-button>
              <el-button 
                :type="article.collected ? 'primary' : 'default'" 
                class="action-btn" 
                @click="handleCollect"
              >
                <el-icon><Collection /></el-icon>
                {{ article.collected ? '已收藏' : '收藏' }}
                <span class="count">({{ article.collectCnt }})</span>
              </el-button>
              <el-button type="default" class="action-btn" @click="handleReward">
                <el-icon><Money /></el-icon>
                打赏
              </el-button>
            </div>
          </div>

          <el-divider />

          <div class="article-content" v-html="article.content"></div>
        </el-card>
      </template>
      <template v-else>
        <el-empty description="文章不存在" />
      </template>

      <!-- 打赏二维码弹窗 -->
      <el-dialog
        v-model="showQRCode"
        title="打赏"
        width="300px"
        :close-on-click-modal="false"
        @close="handleCloseQRCode"
      >
        <div class="qrcode-container">
          <img :src="qrcodeUrl" alt="打赏二维码" />
          <p class="tip">请使用微信扫码支付</p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, Collection, Money } from '@element-plus/icons-vue'
import { getPubArticleDetail, likeArticle, collectArticle } from '@/api/article'
import { request } from '@/utils/request'

const route = useRoute()
const loading = ref(false)
const article = ref<any>(null)
const showQRCode = ref(false)
const qrcodeUrl = ref('')
let rewardId = 0

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
    article.value = res.data
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
const formatDate = (timestamp: number) => {
  if (!timestamp) return '未知时间'
  const date = new Date(timestamp * 1000)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 点赞
const handleLike = async () => {
  if (!article.value) return
  
  try {
    await likeArticle(article.value.id, !article.value.liked)
    if (article.value.liked) {
      article.value.likeCnt--
    } else {
      article.value.likeCnt++
    }
    article.value.liked = !article.value.liked
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 收藏
const handleCollect = async () => {
  if (!article.value || article.value.collected) return
  
  try {
    await collectArticle(article.value.id, 0)
    article.value.collectCnt++
    article.value.collected = true
  } catch (error) {
    ElMessage.error('收藏失败')
  }
}

// 打赏
const handleReward = async () => {
  if (!article.value) return
  
  try {
    const res = await request.post('/articles/pub/reward', {
      id: article.value.id,
      amt: 1
    })
    if (res.data.code === 0) {
      qrcodeUrl.value = res.data.data.codeURL
      rewardId = res.data.data.rid
      showQRCode.value = true
    } else {
      ElMessage.error(res.data.msg || '打赏失败')
    }
  } catch (error) {
    ElMessage.error('打赏失败')
  }
}

// 关闭打赏弹窗
const handleCloseQRCode = async () => {
  if (rewardId > 0) {
    try {
      const res = await request.post('/reward/detail', {
        rid: rewardId
      })
      if (res.data.code === 0 && res.data.data === 'RewardStatusPayed') {
        ElMessage.success('打赏成功')
      }
    } catch (error) {
      console.error('检查打赏状态失败', error)
    }
  }
}

onMounted(() => {
  getArticle()
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

.qrcode-container {
  text-align: center;
}

.qrcode-container img {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
  border-radius: 6px;
}

.tip {
  color: #496E7C;
  font-size: 14px;
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
</style> 