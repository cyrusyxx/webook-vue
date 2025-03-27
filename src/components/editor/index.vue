<template>
  <div class="editor">
    <div class="title-container">
      <el-input
        v-model="title"
        placeholder="请输入文章标题..."
        class="title-input"
        @input="handleChange"
        maxlength="100"
        show-word-limit
      >
        <template #prefix>
          <el-icon><Edit /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="content-container">
      <el-input
        v-model="content"
        type="textarea"
        :rows="18"
        placeholder="请输入文章内容..."
        class="content-input"
        @input="handleChange"
        resize="none"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Edit } from '@element-plus/icons-vue'

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

.title-container {
  margin-bottom: 25px;
}

.title-input {
  border-radius: 8px;
}

:deep(.el-input__inner) {
  font-size: 24px;
  font-weight: 600;
  height: 60px;
  color: #333;
  padding-left: 12px;
}

:deep(.el-input__prefix) {
  font-size: 18px;
  color: #999;
}

.content-container {
  position: relative;
}

.content-input {
  font-size: 16px;
  line-height: 1.8;
}

:deep(.el-textarea__inner) {
  padding: 16px;
  border-radius: 8px;
  border-color: #e0e0e0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}

:deep(.el-textarea__inner:focus) {
  border-color: #7BB9D0;
  box-shadow: 0 0 0 2px rgba(123, 185, 208, 0.2);
}

:deep(.el-input__count) {
  background: transparent;
  font-size: 12px;
  color: #999;
}
</style> 