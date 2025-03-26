import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

export interface Result<T = any> {
  code: number
  msg: string
  data: T
}

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    const { data } = response
    const newToken = response.headers['x-jwt-token']
    const newRefreshToken = response.headers['x-refresh-token']

    if (newToken) {
      localStorage.setItem('token', newToken)
    }
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken)
    }

    if (data.code !== 0) {
      ElMessage.error(data.msg || '请求失败')
      return Promise.reject(new Error(data.msg || '请求失败'))
    }

    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/users/login'
    }
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default instance 