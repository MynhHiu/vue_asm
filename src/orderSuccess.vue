<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const orderCode = ref('')

onMounted(() => {
  const storedOrder = localStorage.getItem('lastOrderCode')
  if (storedOrder) {
    orderCode.value = storedOrder
  }
})
</script>
<template>
  <div class="order-success-container">
    <div class="card">
      <div class="card-body text-center">
        <h2 class="text-success mb-3">Đặt hàng thành công!</h2>
        <p class="lead">Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.</p>
        <p>Mã đơn hàng của bạn là: <strong>{{ orderCode }}</strong></p>
        <router-link to="/" class="btn btn-primary mt-4">Về trang chủ</router-link>
      </div>
    </div>
  </div>
</template>
<style scoped>
.order-success-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.card {
  max-width: 500px;
  width: 100%;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.card-body {
  padding: 2rem;
}
</style>