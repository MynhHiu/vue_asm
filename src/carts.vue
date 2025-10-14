<script setup>
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'

const store = useStore()
const currentUser = JSON.parse(localStorage.getItem('currentUser'))

// Lấy giỏ hàng từ Vuex (dùng state trực tiếp nếu không có module 'cart')
const carts = computed(() => store.state.carts || [])

onMounted(() => {
  if (currentUser?.id) {
    store.dispatch('fetchCart', currentUser.id)
  }
})

const increaseQuantity = (item) => {
  store.dispatch('updateQuantity', { id: item.id, quantity: item.quantity + 1 })
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    store.dispatch('updateQuantity', { id: item.id, quantity: item.quantity - 1 })
  }
}

const removeItem = (id) => {
  const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?')
  if (confirmDelete) {
    store.dispatch('removeFromCart', id)
  }
  
}
</script>

<template>
  <router-link class="btn btn-outline-dark mt-3" to="/">Quay lại</router-link>
  <div class="container mt-4">
    <h3>🛒 Giỏ hàng của bạn</h3>

    <div v-if="Array.isArray(carts) && carts.length">
      <div v-for="item in carts" :key="item.id" class="cart-item">
        <img :src="item.image" alt="product" />
        <div class="cart-item-info">
          <div class="cart-item-title">{{ item.title }}</div>
          <div class="cart-item-price">{{ item.price }}$</div>
          <div class="cart-item-quantity">
            Số lượng:
            <button @click="decreaseQuantity(item)" class="btn btn-sm btn-outline-secondary">−</button>
            <span class="mx-2">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="btn btn-sm btn-outline-secondary">+</button>
          </div>
          <button @click="removeItem(item.id)" class="btn btn-sm btn-danger mt-2">Xóa</button>
        </div>
      </div><br>
      <button class="btn-checkout">Mua ngay</button>
    </div>

    <div v-else>
      <p>Giỏ hàng đang trống.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.cart-item-price {
  color: #28a745;
  font-weight: bold;
}

.cart-item-quantity {
  font-size: 14px;
  color: #555;
}

.cart-total {
  text-align: right;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.btn-checkout {
  background-color: #ffc107;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-checkout:hover {
  background-color: #e0a800;
}

</style>