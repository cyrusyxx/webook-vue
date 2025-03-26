<template>
  <div class="border border-gray-200 rounded-lg">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
      class="border-b border-gray-200"
    />
    <Editor
      :defaultConfig="editorConfig"
      v-model="valueHtml"
      mode="default"
      @onCreated="handleCreated"
      class="min-h-[500px]"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

// 内容 HTML
const valueHtml = ref('')

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
}

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'uploadVideo',
    'insertTable',
    'groupImage',
    'groupVideo',
    'insertTable',
    'codeBlock',
    'bulletedList',
    'numberedList',
    'todo',
    'groupIndent',
    'groupAlign',
    'groupFontSize',
    'groupFontFamily',
    'groupColor',
    'groupBackgroundColor',
    'groupLineHeight',
    'groupTextStyle',
    'groupMore',
  ],
}

// 监听 props 变化
watch(
  () => props.modelValue,
  (val) => {
    if (val !== valueHtml.value) {
      valueHtml.value = val
    }
  },
  { immediate: true }
)

// 监听编辑器内容变化
watch(
  () => valueHtml.value,
  (val) => {
    emit('update:modelValue', val)
  }
)
</script> 