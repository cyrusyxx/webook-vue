# WeBook Vue

WeBook 是一个基于 Vue 3 + TypeScript + Element Plus 的博客系统。

## 功能特性

- 用户认证
  - 邮箱密码登录
  - 短信验证码登录
  - 微信扫码登录
  - 用户注册

- 文章管理
  - 文章编辑
  - 文章发布
  - 文章列表
  - 文章详情
  - 点赞收藏

- 个人中心
  - 个人信息
  - 个人资料编辑

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus
- Axios

## 开发环境

- Node.js >= 16
- pnpm >= 8

## 开始使用

1. 安装依赖

```bash
pnpm install
```

2. 启动开发服务器

```bash
pnpm dev
```

3. 构建生产版本

```bash
pnpm build
```

## 环境变量

- `VITE_API_BASE_URL`: API 基础地址
  - 开发环境: http://localhost:8080
  - 生产环境: https://api.webook.com

## 项目结构

```
src/
  ├── api/          # API 接口
  ├── assets/       # 静态资源
  ├── components/   # 公共组件
  ├── layouts/      # 布局组件
  ├── router/       # 路由配置
  ├── stores/       # 状态管理
  ├── styles/       # 全局样式
  ├── utils/        # 工具函数
  └── views/        # 页面组件
```
