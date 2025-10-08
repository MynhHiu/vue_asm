<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = reactive({
  id: '',
  userName: '',
  email: '',
  fullName: ''
})

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem('currentUser'))
  if (storedUser && storedUser.id) {
    // Lấy user mới nhất từ API theo id
    const response = await axios.get(`http://localhost:3000/users/${storedUser.id}`)
    const apiUser = response.data
    user.id = apiUser.id
    user.userName = apiUser.userName
    user.email = apiUser.email
    user.fullName = apiUser.fullName
    if (user.userName === 'admin') {
      router.push('/admin')
    }
  }
})

const saveProfile = async () => {
  try {
    await axios.patch(`http://localhost:3000/users/${user.id}`, {
      fullName: user.fullName,
      email: user.email
    })
    alert('Đã lưu thông tin!')
  } catch (error) {
    alert('Lưu thất bại!')
  }
}
</script>
<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="w-100" style="max-width: 1200px;">
      <div class="card border-0 shadow">
        <div class="card-body p-4">
          <h2 class="mb-4">Xin Chào, {{ user.userName }}</h2>
          <form @submit.prevent="saveProfile">
            <div class="mb-3">
              <label class="form-label">Tên đăng nhập</label>
              <input v-model="user.userName" class="form-control" disabled />
            </div>
            <div class="mb-3">
              <label class="form-label">Họ tên</label>
              <input v-model="user.fullName" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="user.email" class="form-control" />
            </div>
            <button type="submit" class="btn btn-primary w-100">Lưu thông tin</button>
          </form>
          <router-link :to="`/`" class="btn btn-link mt-3">Trang chủ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>