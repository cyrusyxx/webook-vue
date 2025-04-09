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
    
    <div class="border border-gray-200 rounded-lg mt-4">
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
        class="min-h-[400px]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import axios from 'axios'

const props = defineProps<{
  modelValue: {
    title: string
    content: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { title: string; content: string }): void
}>()

// 标题和内容
const title = ref(props.modelValue?.title || '')
const valueHtml = ref(props.modelValue?.content || '')

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

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

// 处理输入变化
const handleChange = () => {
  emit('update:modelValue', {
    title: title.value,
    content: valueHtml.value
  })
}

// 上传图片
function customUploadImage(file: File, insertFn: (url: string, alt: string, href: string) => void) {
  // 图片服务器地址
  const uploadUrl = 'http://47.112.100.83:8000/upload'
  
  // 创建 FormData
  const formData = new FormData()
  formData.append('file', file)
  
  // 显示上传中消息
  const loadingMsg = ElMessage({
    message: '图片上传中...',
    type: 'info',
    duration: 0
  })
  
  // 上传图片
  axios.post(uploadUrl, formData)
    .then(response => {
      // 关闭上传中消息
      loadingMsg.close()
      
      // 获取图片 URL
      const url = response.data.url
      
      // 插入图片到编辑器
      insertFn(url, file.name, url)
      
      ElMessage.success('图片上传成功')
    })
    .catch(error => {
      // 关闭上传中消息
      loadingMsg.close()
      
      console.error('图片上传失败:', error)
      ElMessage.error('图片上传失败')
    })
}

// 上传视频
function customUploadVideo(file: File, insertFn: (url: string) => void) {
  // 视频服务器地址
  const uploadUrl = 'http://47.112.100.83:8000/upload'
  
  // 创建 FormData
  const formData = new FormData()
  formData.append('file', file)
  
  // 显示上传中消息
  const loadingMsg = ElMessage({
    message: '视频上传中...',
    type: 'info',
    duration: 0
  })
  
  // 上传视频
  axios.post(uploadUrl, formData)
    .then(response => {
      // 关闭上传中消息
      loadingMsg.close()
      
      // 获取视频 URL
      const url = response.data.url
      
      // 插入视频到编辑器
      insertFn(url)
      
      ElMessage.success('视频上传成功')
    })
    .catch(error => {
      // 关闭上传中消息
      loadingMsg.close()
      
      console.error('视频上传失败:', error)
      ElMessage.error('视频上传失败')
    })
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义上传图片函数
      customUpload: customUploadImage
    },
    insertVideo: {
      // 校验视频链接
      checkVideo: (src: string) => {
        // 简化处理，直接返回 true
        return true
      },
      // 自定义上传视频
      customUpload: customUploadVideo
    }
  }
}

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  insertKeys: {
    index: 24, // 位置放在后面一些
    keys: ['uploadImage', 'insertVideo']
  }
}

// 监听 props 变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    title.value = newVal.title || ''
    valueHtml.value = newVal.content || ''
  }
}, { deep: true })

// 监听编辑器内容变化
watch(
  () => valueHtml.value,
  (val) => {
    handleChange()
  }
)
</script>

<style>
/* 修复编辑器弹出菜单层级问题的全局样式 */
.w-e-panel-container, 
.w-e-menu-panel, 
.w-e-dropdown-panel,
.w-e-drop-list,
.w-e-drop-panel {
  z-index: 2500 !important;
}

.w-e-tooltip,
.w-e-bar-item-group {
  z-index: 2501 !important;
}

/* 特别处理颜色选择器 */
.w-e-color-picker-container,
div[data-w-e-type="color-picker"] {
  z-index: 2502 !important;
}
</style>

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

/* 编辑器弹窗层级 */
:deep(.w-e-toolbar) {
  z-index: 2000 !important;
}

:deep(.w-e-text-container) {
  z-index: 1500 !important;
}
</style> 