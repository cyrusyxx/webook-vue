import { request } from '@/utils/request'

export interface Comment {
  id: number
  content: string
  article_id: number
  user: {
    id: number
    nickname: string
    avatar?: string
  }
  ctime: string
  utime: string
}

export interface AddCommentParams {
  article_id: number
  content: string
}

export interface CommentListParams {
  limit: number
  offset: number
}

// 获取文章评论列表
export const getComments = (articleId: number, params: CommentListParams = { limit: 10, offset: 0 }) => {
  if (!articleId) {
    return Promise.resolve([])
  }
  return request.get<Comment[]>(`/article/${articleId}/comments`, { params })
}

// 发表评论
export const addComment = (params: AddCommentParams) => {
  return request.post('/comment/add', params)
}

// 删除评论
export const deleteComment = (commentId: number) => {
  return request.post(`/comment/delete/${commentId}`)
} 