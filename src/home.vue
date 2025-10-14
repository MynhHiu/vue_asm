<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter();
const isLoggedIn = ref(!!localStorage.getItem('currentUser'))


onMounted(async() => {
  console.log(`the component is now mounted.`)
  const response = await axios.get('http://localhost:3000/products');
  if(response.status == 200) {
    products.value = response.data
  }
})
const logout = () => {
  localStorage.removeItem('currentUser')
  isLoggedIn.value = false
  router.push('/')
}
const products = ref([])

const product = reactive({
  id: '',
  title: '',
  price: '',
  image: '',
  category: '',
  description: ''
})



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
          <!-- <li class="nav-item">
            <router-link class="nav-link" to="/posts">Post</router-link>
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link" to="/products">Product</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/carts">Cart</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <router-link v-if="!isLoggedIn" class="btn btn-outline-primary me-2" to="/login">Login</router-link>
          <button v-else @click="logout" class="btn btn-danger">Đăng xuất</button>
        </div>
      </div>
    </div>
  </nav>
  <main class="container pb-5">
    <div class="row g-4">
      <!-- Products list -->
      <section class="col-lg-12">
        <div class="product-grid">
          <div v-for="item in products" :key="item.id" class="product-card card shadow-sm">
            <router-link :to="`/products/${item.id}`">
              <img :src="item.image" alt="Products" class="card-img-top product-thumb" />
            </router-link>
            <div class="card-body">
              <h5 class="card-title">{{ item.title }}</h5>
              <span class="badge bg-dark mb-2">{{ item.category }}</span>
              <p class="card-text fw-bold text-primary">{{ item.price }}$</p>
              <router-link :to="`/products/${item.id}`" class="btn btn-outline-primary btn-sm w-100">Xem chi tiết</router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
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
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Mỗi hàng 4 sản phẩm */
  gap: 24px;
  margin-top: 24px;
}
.product-card {
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
}
.product-thumb {
  height: 180px;
  object-fit: contain;
  background: #f8f9fa;
  padding: 12px;
}
</style>