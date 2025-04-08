import { request } from '@/utils/request'

export interface Comment {
  id: number
  content: string
  article_id: number
  user: {
    id: number
    email: string
    password: string
    phone: string
    nick_name: string
    birthday: string
    description: string
    union_id: string
    open_id: string
  }
  ctime: string
  utime: string
}

export interface AddCommentParams {
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
  return request.get<Comment[]>(`/article/${articleId}/comments?limit=${params.limit}&offset=${params.offset}`)
}

// 发表评论
export const addComment = (articleId: number, content: string) => {
  return request.post(`/article/${articleId}/comment`, { content })
}

// 删除评论
export const deleteComment = (articleId: number, commentId: number) => {
  return request.post(`/article/${articleId}/comment/${commentId}/delete`)
} 