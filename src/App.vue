<script setup lang="ts">
// App.vue
import { onMounted, onErrorCaptured } from 'vue'

console.log('App.vue 组件被创建')

onMounted(() => {
  console.log('App.vue 组件已挂载')
})

// 捕获应用中的错误
onErrorCaptured((err, instance, info) => {
  console.error('应用错误:', err)
  console.error('错误来源:', instance)
  console.error('错误信息:', info)
  return false // 阻止错误继续传播
})
</script>

<template>
  <router-view />
</template>

<style>
#app {
  min-height: 100vh;
}
</style>
