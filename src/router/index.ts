import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/users/login'
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
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !userStore.token) {
    next({
      path: '/users/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router 