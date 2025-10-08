<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter();
const isLoggedIn = ref(!!localStorage.getItem('currentUser'))

const logout = () => {
  localStorage.removeItem('currentUser')
  isLoggedIn.value = false
  router.push('/')
}


</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/">Trang chủ</router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/profile">Profile</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/posts">Post</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">Product</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <router-link v-if="!isLoggedIn" class="btn btn-outline-primary me-2" to="/login">Login</router-link>
          <button v-else @click="logout" class="btn btn-danger">Đăng xuất</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.header {
    display: flex;
}
h2{
    margin-left: 30px;
}
button{
    margin-left: 30px;
}
</style>