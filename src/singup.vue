<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const users = ref([])

const form = reactive({
    userName: '',
    password: ''
})
const message = ref('')
const messageColor = ref('')
const router = useRouter()

const loadDuLieu = async () => {
    const response = await axios.get('http://localhost:3000/users');
    if (response.status == 200) {
      users.value = response.data
    }
}

onMounted(() => {
    loadDuLieu()
})

const handleRegister = async () => {
    if(form.userName === "" || form.password === ""){
        message.value = 'Dữ liệu không được để trống'
        messageColor.value = 'error'
        return
    }
    const existed = users.value.find(u => u.userName === form.userName)
    if (existed) {
        message.value = 'Tên đăng nhập đã tồn tại'
        messageColor.value = 'error'
        return
    }
    const payload = {
        userName: form.userName,
        password: form.password
    }
    const response = await axios.post('http://localhost:3000/users', payload)
    if (response.status === 201) {
        message.value = 'Đăng ký thành công!'
        messageColor.value = 'success'
        router.push('/login')
    } else {
        message.value = 'Đăng ký thất bại'
        messageColor.value = 'error'
    }
}

</script>
<template>
  <div class="container mt-5">
    <h2 class="mb-4">Đăng ký tài khoản</h2>
    <form @submit.prevent="handleRegister" class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <label for="username" class="form-label">Tên đăng nhập</label>
        <input v-model="form.userName" type="text" class="form-control" id="username" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mật khẩu</label>
        <input v-model="form.password" type="password" class="form-control" id="password" required />
      </div>
      <button type="submit" class="btn btn-success w-100">Đăng ký</button>
      <router-link :to="`/login`"><h2 class="h5 mb-1">Đăng nhập</h2></router-link>
      <div class="mt-3 text-center">
        <span :class="messageColor">{{ message }}</span>
      </div>
    </form>
  </div>
</template>
<style scoped>
.success {
  color: green;
}
.error {
  color: red;
}
</style>