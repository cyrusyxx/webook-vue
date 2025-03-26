export interface Article {
  id: number
  title: string
  content: string
  summary: string
  authorId: number
  author: {
    id: number
    username: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
}

export interface ArticleForm {
  title: string
  content: string
  summary: string
}

export interface ArticleQuery {
  page: number
  pageSize: number
  keyword?: string
  authorId?: number
} 