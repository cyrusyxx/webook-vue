<template>
  <div class="article-detail" v-loading="loading">
    <template v-if="article">
      <div class="header">
        <h1>{{ article.title }}</h1>
        <div class="actions">
          <el-button type="primary" link @click="handleLike">
            <el-icon><StarOutlined /></el-icon>
            {{ article.liked ? '已点赞' : '点赞' }}
            <span class="count">({{ article.likeCnt }})</span>
          </el-button>
          <el-button type="primary" link @click="handleCollect">
            <el-icon><Collection /></el-icon>
            {{ article.collected ? '已收藏' : '收藏' }}
            <span class="count">({{ article.collectCnt }})</span>
          </el-button>
          <el-button type="primary" link @click="handleReward">
            <el-icon><MoneyCollectOutlined /></el-icon>
            打赏
          </el-button>
        </div>
      </div>

      <div class="content" v-html="article.content"></div>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { StarOutlined, Collection, MoneyCollectOutlined } from '@element-plus/icons-vue'
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
    const res = await getPubArticleDetail(parseInt(route.params.id as string))
    article.value = res.data
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  } finally {
    loading.value = false
  }
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
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

h1 {
  margin: 0 0 20px;
  font-size: 28px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 20px;
}

.count {
  margin-left: 4px;
  color: #666;
}

.content {
  line-height: 1.8;
  font-size: 16px;
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
}

.qrcode-container {
  text-align: center;
}

.qrcode-container img {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}

.tip {
  color: #666;
  font-size: 14px;
}
</style> 