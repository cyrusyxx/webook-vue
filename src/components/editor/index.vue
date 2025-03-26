<template>
  <div class="editor">
    <el-input
      v-model="title"
      placeholder="请输入标题"
      class="title-input"
      @input="handleChange"
    />
    
    <el-input
      v-model="content"
      type="textarea"
      :rows="15"
      placeholder="请输入正文"
      class="content-input"
      @input="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: {
    title: string
    content: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { title: string; content: string }): void
}>()

const title = ref(props.modelValue?.title || '')
const content = ref(props.modelValue?.content || '')

// 监听 props 变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    title.value = newVal.title
    content.value = newVal.content
  }
}, { deep: true })

// 处理输入变化
const handleChange = () => {
  emit('update:modelValue', {
    title: title.value,
    content: content.value
  })
}
</script>

<style scoped>
.editor {
  width: 100%;
}

.title-input {
  margin-bottom: 20px;
}

.content-input {
  font-size: 16px;
  line-height: 1.6;
}

:deep(.el-textarea__inner) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}
</style> 