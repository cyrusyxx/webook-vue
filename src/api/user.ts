import { request } from '@/utils/request'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  confirmPassword: string
}

export interface Profile {
  Email: string
  Phone: string
  Nickname: string
  Birthday: string
  AboutMe: string
}

export interface EditProfileParams {
  nickname: string
  birthday: string
  aboutMe: string
}

export interface SMSLoginParams {
  phone: string
  code: string
}

// 登录
export const login = (params: LoginParams) => {
  return request.post('/user/login', params)
}

// 注册
export const register = (params: RegisterParams) => {
  return request.post('/user/signup', params)
}

// 退出
export const logout = () => {
  return request.post('/user/logout')
}

// 获取个人信息
export const getProfile = () => {
  return request.get('/user/profile')
}

// 编辑个人信息
export const editProfile = (params: EditProfileParams) => {
  return request.post('/user/edit', params)
}

// 发送短信验证码
export const sendSMSCode = (phone: string) => {
  return request.post('/user/login_sms/code/send', { phone })
}

// 短信登录
export const loginBySMS = (params: SMSLoginParams) => {
  return request.post('/user/login_sms/code/verify', params)
}

// 刷新 token
export const refreshToken = () => {
  return request.post('/user/refresh_token')
} 