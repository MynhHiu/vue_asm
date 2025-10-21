<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter();
const isLoggedIn = ref(!!localStorage.getItem('currentUser'))


onMounted(async () => {
  console.log(`the component is now mounted.`)
  const response = await axios.get('http://localhost:3000/products');
  if (response.status == 200) {
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

const categories = computed(() => {
  const unique = new Set(products.value.map(p => p.category))
  return Array.from(unique)
})

const filters = reactive({
  category: '',
  keyword: '',
  minPrice: '',
  maxPrice: ''
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const priceVND = Number(String(p.price).replace(/,/g, ''))
    const min = Number(filters.minPrice)
    const max = Number(filters.maxPrice)

    const matchCategory = filters.category ? p.category === filters.category : true
    const matchKeyword = filters.keyword ? p.title.toLowerCase().includes(filters.keyword.toLowerCase()) : true
    const matchMinPrice = filters.minPrice ? priceVND >= min : true
    const matchMaxPrice = filters.maxPrice ? priceVND <= max : true

    return matchCategory && matchKeyword && matchMinPrice && matchMaxPrice
  })
})

const topProducts = ref([])

const fetchTopProducts = async () => {
  const ordersRes = await axios.get('http://localhost:3000/orders')
  const orders = ordersRes.data

  const productSales = {}

  orders.forEach(order => {
    order.products.forEach(p => {
      productSales[p.productId] = (productSales[p.productId] || 0) + p.quantity
    })
  })

  const sorted = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const topIds = sorted.map(([id]) => id)
  const productsRes = await axios.get('http://localhost:3000/products')
  const allProducts = productsRes.data

  topProducts.value = allProducts.filter(p => topIds.includes(p.id))
}

onMounted(async () => {
  const response = await axios.get('http://localhost:3000/products')
  if (response.status == 200) {
    products.value = response.data
  }

  await fetchTopProducts()
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
            <router-link class="nav-link" to="/products">Product</router-link>
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link" to="/carts">Cart</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/orders">Order</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/yeuThich">Yêu Thích</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <router-link v-if="!isLoggedIn" class="btn btn-outline-primary me-2" to="/login">Login</router-link>
          <button v-else @click="logout" class="btn btn-danger">Đăng xuất</button>
        </div>
      </div>
    </div>
  </nav>
  <div class="row mb-4">
    <div class="col-md-3">
      <select v-model="filters.category" class="form-select">
        <option value="">Tất cả danh mục</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    <div class="col-md-3">
      <input v-model="filters.keyword" type="text" class="form-control" placeholder="Tìm theo tên sản phẩm" />
    </div>
    <div class="col-md-2">
      <input v-model="filters.minPrice" type="number" class="form-control" placeholder="Giá từ" />
    </div>
    <div class="col-md-2">
      <input v-model="filters.maxPrice" type="number" class="form-control" placeholder="Giá đến" />
    </div>
  </div>

  <main class="container pb-5">
    <div class="row g-4">
      <!-- Products list -->
      <section class="col-lg-12">
        <div class="product-grid">
          <div v-for="item in filteredProducts" :key="item.id" class="product-card card shadow-sm">
            <router-link :to="`/products/${item.id}`">
              <img :src="item.image" alt="Products" class="card-img-top product-thumb" />
            </router-link>
            <div class="card-body">
              <h5 class="card-title">{{ item.title }}</h5>
              <span class="badge bg-dark mb-2">{{ item.category }}</span>
              <p class="card-text fw-bold text-primary">
                {{ item.price }}₫
              </p>
              <router-link :to="`/products/${item.id}`" class="btn btn-outline-primary btn-sm w-100">Xem chi
                tiết</router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="container mt-4">
      <h4>Top 5 sản phẩm bán chạy</h4>
      <div class="row g-3">
        <div v-for="item in topProducts" :key="item.id" class="col-md-3">
          <div class="card h-100 shadow-sm">
            <router-link :to="`/products/${item.id}`">
              <img :src="item.image" alt="product" class="card-img-top product-thumb" />
            </router-link>
            <div class="card-body">
              <h6 class="card-title">{{ item.title }}</h6>
              <p class="card-text fw-bold text-primary">
                {{ item.price }}₫
              </p>
              <router-link :to="`/products/${item.id}`" class="btn btn-outline-primary btn-sm w-100">Xem chi
                tiết</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<style scoped>
.header {
  display: flex;
}

h2 {
  margin-left: 30px;
}

button {
  margin-left: 30px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* Mỗi hàng 4 sản phẩm */
  gap: 24px;
  margin-top: 24px;
}

.product-card {
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.product-thumb {
  height: 180px;
  object-fit: contain;
  background: #f8f9fa;
  padding: 12px;
}
</style>