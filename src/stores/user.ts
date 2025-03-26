import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Profile } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const profile = ref<Profile | null>(null)

  // 设置token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 清除token
  const clearToken = () => {
    token.value = ''
    localStorage.removeItem('token')
  }

  // 设置用户信息
  const setProfile = (newProfile: Profile) => {
    profile.value = newProfile
  }

  // 清除用户信息
  const clearProfile = () => {
    profile.value = null
  }

  // 退出登录
  const logout = () => {
    clearToken()
    clearProfile()
  }

  return {
    token,
    profile,
    setToken,
    clearToken,
    setProfile,
    clearProfile,
    logout
  }
}) 