import { request } from '@/utils/request'

export interface Article {
  id?: number
  title: string
  content: string
  status?: number
  abstract?: string
  author_name?: string
  liked?: boolean
  like_cnt?: number
  collected?: boolean
  collect_cnt?: number
  view_cnt?: number
  ctime?: string
  utime?: string
  image_urls?: string[]
}

export interface ArticleListParams {
  offset: number
  limit: number
}

export interface EditArticleParams {
  id?: number
  title: string
  content: string
  image_urls?: string[]
}

// 编辑文章
export const editArticle = (params: EditArticleParams) => {
  return request.post('/article/edit', params)
}

// 发布文章
export const publishArticle = (params: EditArticleParams) => {
  return request.post('/article/publish', params)
}

// 撤回文章
export const withdrawArticle = (id: number) => {
  return request.post('/article/withdraw', { id })
}

// 获取文章列表
export const getArticleList = (params: ArticleListParams) => {
  return request.post('/article/list', params)
}

// 获取文章详情
export const getArticleDetail = (id: number) => {
  return request.get(`/article/detail/${id}`)
}

// 获取公开文章详情
export const getPubArticleDetail = (id: number) => {
  return request.get(`/article/pub/${id}`)
}

// 点赞文章
export const likeArticle = (id: number, like: boolean) => {
  return request.post('/article/pub/like', { id, like })
}

// 收藏文章
export const collectArticle = (id: number, cid: number, collect: boolean) => {
  return request.post('/article/pub/collect', { id, cid, collect })
}

// 获取公共文章列表
export const getPubArticleList = (params: ArticleListParams) => {
  return request.post('/article/pub/list', params)
}

// 获取热榜文章
export const getTopArticles = () => {
  return request.get('/article/pub/top')
} 