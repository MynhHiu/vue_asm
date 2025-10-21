<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const orders = ref([])

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusClass = (status) => {
  switch (status) {
    case 'Chờ xác nhận': return 'badge bg-warning text-dark'
    case 'Đã xác nhận': return 'badge bg-primary'
    case 'Đang giao hàng': return 'badge bg-info text-dark'
    case 'Đã nhận được hàng': return 'badge bg-success'
    case 'Đã hủy': return 'badge bg-danger'
    default: return 'badge bg-secondary'
  }
}


const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await axios.patch(`http://localhost:3000/orders/${orderId}`, {
      status: newStatus
    })
    await fetchOrders()
  } catch (error) {
    alert(`Không thể cập nhật trạng thái đơn hàng sang "${newStatus}".`)
    console.error(error)
  }
}
const fetchOrders = async () => {
  const res = await axios.get('http://localhost:3000/orders')
  orders.value = res.data
}

onMounted(fetchOrders)

const sortedOrders = computed(() =>
  [...orders.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)
console.log('orders:', orders.value)
</script>
<template>
  <router-link :to="`/admin`" class="btn btn-outline-dark mt-3">Quay lại</router-link>
  <div class="container py-5">
    <h2 class="mb-4">Quản lý đơn hàng</h2>
    <div v-if="orders.length === 0" class="alert alert-info">
      Chưa có đơn hàng nào.
    </div>
    <div v-else>
      <div v-for="order in sortedOrders" :key="order.id" class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Mã đơn hàng: <strong>{{ order.orderCode }}</strong></h5>
          <p>Người đặt: {{ order.fullName }} ({{ order.email }})</p>
          <p>Ngày đặt: {{ formatDate(order.createdAt) }}</p>
          <p>Trạng thái:
            <span :class="statusClass(order.status)">
              {{ order.status }}
            </span>
          </p>
          <p>Tổng tiền: <strong>{{ order.total.toLocaleString() }} đ</strong></p>

          <div class="row mt-3">
            <div v-for="item in order.products" :key="item.productId" class="d-flex align-items-center mb-3">
              <img :src="item.image" alt="product"
                style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" class="me-3" />
              <div>
                <h6 class="mb-1">{{ item.title }}</h6>
                <p class="mb-0">SL: {{ item.quantity }}</p>
                <p class="mb-0">Giá: {{ item.price.toLocaleString() }} đ</p>
              </div>
            </div>
          </div>

          <button v-if="order.status === 'Chờ xác nhận'" class="btn btn-success mt-3"
            @click="updateOrderStatus(order.id, 'Đang giao hàng')">
            Xác nhận đơn hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  max-width: 1000px;
}
</style>