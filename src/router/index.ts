import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getProfile, refreshToken } from '@/api/user'
import { ElMessage } from 'element-plus'

console.log('路由模块初始化')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/home/Home.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/users',
    component: () => import('../layouts/UserLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/users/Login.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/users/Register.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/users/Profile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'edit',
        name: 'Edit',
        component: () => import('../views/users/Edit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'login_sms',
        name: 'LoginSms',
        component: () => import('../views/users/LoginSms.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'login_wechat',
        name: 'LoginWechat',
        component: () => import('../views/users/LoginWechat.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/articles',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'ArticleList',
        component: () => import('../views/articles/List.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'top',
        name: 'ArticleTop',
        component: () => import('../views/articles/Top.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'create',
        name: 'ArticleCreate',
        component: () => import('../views/articles/Create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'edit/:id?',
        name: 'ArticleEdit',
        component: () => import('../views/articles/Edit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':id',
        name: 'ArticleDetail',
        component: () => import('../views/articles/Detail.vue'),
        meta: { requiresAuth: false }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  console.log('路由跳转:', { from: from.path, to: to.path })
  try {
    const userStore = useUserStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // 如果路由需要认证
    if (requiresAuth) {
      // 检查是否有token
      if (!userStore.token) {
        console.log('需要登录权限，重定向到登录页')
        next({
          path: '/users/login',
          query: { redirect: to.fullPath }
        })
      } else {
        // 尝试验证token有效性
        try {
          await getProfile()
          next() // token有效，继续导航
        } catch (error: any) {
          console.error('Token验证失败:', error)
          
          // 如果是401错误且有refreshToken，尝试刷新token
          if (error.response?.status === 401 && userStore.refreshToken) {
            try {
              console.log('路由守卫尝试刷新token')
              await refreshToken()
              // 刷新token成功，继续导航
              next()
            } catch (refreshError) {
              console.error('刷新token失败，需要重新登录:', refreshError)
              userStore.logout()
              ElMessage.error('登录已过期，请重新登录')
              next({
                path: '/users/login',
                query: { redirect: to.fullPath }
              })
            }
          } else {
            // token无效且无法刷新，清除状态并跳转登录页
            userStore.logout()
            ElMessage.error('登录已过期，请重新登录')
            next({
              path: '/users/login',
              query: { redirect: to.fullPath }
            })
          }
        }
      }
    } else {
      next() // 不需要认证的路由直接放行
    }
  } catch (error) {
    console.error('路由守卫发生错误:', error)
    next() // 即使发生错误也尝试导航
  }
})

// 导航错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

console.log('路由模块加载完成')

export default router 