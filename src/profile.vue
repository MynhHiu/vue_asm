<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoggedIn = ref(true)
const user = reactive({
  id: '',
  userName: '',
  email: '',
  fullName: '',
  diaChi: '',
  sdt: '',
  tuoi: '',
  gioiTinh: '',
  sanPhamMongMuon: ''
})

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem('currentUser'))
  if (storedUser && storedUser.id) {
    const response = await axios.get(`http://localhost:3000/users/${storedUser.id}`)
    const apiUser = response.data
    user.id = apiUser.id
    user.userName = apiUser.userName
    user.email = apiUser.email
    user.fullName = apiUser.fullName
    user.diaChi = apiUser.diaChi || ''
    user.sdt = apiUser.sdt || ''
    user.tuoi = apiUser.tuoi || ''
    user.gioiTinh = apiUser.gioiTinh || ''
    user.sanPhamMongMuon = apiUser.sanPhamMongMuon || ''
    if (user.userName === 'admin') {
      router.push('/admin')
    }
  }
})

const saveProfile = async () => {
  try {
    await axios.patch(`http://localhost:3000/users/${user.id}`, {
      fullName: user.fullName,
      email: user.email,
      tuoi: user.tuoi,
      gioiTinh: user.gioiTinh,
      sanPhamMongMuon: user.sanPhamMongMuon,
      diaChi: user.diaChi,
      sdt: user.sdt
    })
    alert('Đã lưu thông tin!')
  } catch (error) {
    alert('Lưu thất bại!')
  }
}
</script>
<template>
  <div class="container d-flex align-items-center justify-content-between">
      <router-link :to="`/`" class="btn btn-outline-secondary me-2 mb-2" ><h2 class="h5 mb-1">Trang chủ</h2></router-link>
    </div>
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
            <div class="mb-3">
              <label class="form-label">Số Điện Thoại</label>
              <input v-model="user.sdt" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Địa Chỉ</label>
              <input v-model="user.diaChi" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Tuổi</label>
              <input v-model="user.tuoi" type="number" min="0" class="form-control" />
            </div>
            <div class="mb-3">
            <label class="form-label">Giới tính</label>
              <select v-model="user.gioiTinh" class="form-control">
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Sản phẩm mong muốn</label>
              <input v-model="user.sanPhamMongMuon" class="form-control" placeholder="Nhập tên sản phẩm bạn thích" />
            </div>
            <button type="submit" class="btn btn-primary w-100">Lưu thông tin</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>