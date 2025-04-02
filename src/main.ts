import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'

console.log('开始初始化应用')

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

console.log('准备挂载应用')
app.mount('#app')
console.log('应用已挂载到 #app')

// 标记加载完成
document.body.classList.add('app-loaded')
console.log('应用加载完成标记已设置')
