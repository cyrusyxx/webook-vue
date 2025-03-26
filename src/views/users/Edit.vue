<template>
  <div class="user-edit" v-loading="loading">
    <el-card class="edit-card">
      <template #header>
        <h2>编辑个人信息</h2>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="edit-form"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>

        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="关于我" prop="aboutMe">
          <el-input
            v-model="form.aboutMe"
            type="textarea"
            :rows="4"
            placeholder="介绍一下你自己"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getProfile, editProfile } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const formRef = ref<FormInstance>()

const form = ref({
  nickname: '',
  birthday: '',
  aboutMe: ''
})

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  birthday: [
    { required: true, message: '请选择生日', trigger: 'change' }
  ],
  aboutMe: [
    { max: 500, message: '不能超过 500 个字符', trigger: 'blur' }
  ]
}

// 获取个人信息
const getProfileData = async () => {
  loading.value = true
  try {
    const res = await getProfile()
    const data = res.data
    form.value = {
      nickname: data.Nickname,
      birthday: data.Birthday,
      aboutMe: data.AboutMe
    }
  } catch (error) {
    ElMessage.error('获取个人信息失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await editProfile(form.value)
        ElMessage.success('保存成功')
        router.push('/users/profile')
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}

// 取消编辑
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  getProfileData()
})
</script>

<style scoped>
.user-edit {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.edit-card {
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.edit-form {
  max-width: 500px;
  margin: 0 auto;
}
</style> 