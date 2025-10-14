<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'

const API = import.meta.env.VITE_URL_API || 'http://localhost:3000'
const route = useRoute()
const router = useRouter()
const store = useStore()
const product = ref({})
const relatedProducts = ref([])

const loadProduct = async () => {
  try {
    const res = await axios.get(`${API}/products/${route.params.id}`)
    product.value = res.data

    const all = await axios.get(`${API}/products`)
    relatedProducts.value = all.data
      .filter(p => p.category === product.value.category && p.id !== product.value.id)
      .slice(0, 4)
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm:', err)
  }
}

onMounted(() => {
  loadProduct()
})

const handleAddCart = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (!currentUser || !currentUser.id) {
    router.push(`/login?callback=products/${route.params.id}`)
    return
  }

  store.dispatch('addToCart', product.value)
}
</script>

<template>
  <div class="container mt-4">
    <router-link :to="`/`" class="btn btn-outline-secondary mb-3">Quay lại</router-link>

    <div class="row g-4">
      <div class="col-md-5 text-center">
        <img :src="product.image || 'https://via.placeholder.com/250'" alt="product image" class="img-fluid rounded shadow" />
      </div>
      <div class="col-md-7">
        <h2 class="fw-bold">{{ product.title }}</h2>
        <div class="mb-2">
          <span class="badge bg-primary me-2">{{ product.category }}</span>
          <span class="badge bg-success fs-5 px-3 py-2">{{ product.price }}$</span>
        </div>
        <p class="lead">{{ product.description }}</p>
        <div class="d-flex gap-3 mt-4">
          <button @click="handleAddCart" class="btn btn-warning btn-lg fw-bold">Thêm vào giỏ hàng</button>
          <button class="btn btn-danger btn-lg fw-bold">Mua ngay</button>
        </div>
      </div>
    </div>

    <hr class="my-5" />
    <h4>Sản phẩm liên quan</h4>
    <div class="row g-3">
      <div v-for="item in relatedProducts" :key="item.id" class="col-md-3">
        <div class="card h-100 shadow-sm">
          <router-link :to="`/products/${item.id}`">
            <img :src="item.image" alt="related product" class="card-img-top" style="height: 140px; object-fit: contain;" />
          </router-link>
          <div class="card-body">
            <h6 class="card-title">{{ item.title }}</h6>
            <div class="text-primary fw-bold mb-2">{{ item.price }}$</div>
            <router-link :to="`/products/${item.id}`" class="btn btn-outline-primary btn-sm w-100">Xem chi tiết</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px 24px;
  margin-bottom: 32px;
}
.product-image {
  max-width: 480px;
  max-height: 480px;
  object-fit: contain;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  width: 100%;
  margin: 0 auto;
}
h2 {
  font-size: 2rem;
}
.badge.bg-success {
  font-size: 1.2rem;
}
.lead {
  color: #444;
}
.btn-lg {
  min-width: 160px;
}
</style>