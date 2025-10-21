<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const sortedOrders = computed(() =>
    [...orders.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)
const orders = ref([])
const showDetails = ref({})

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

const toggleDetails = (orderId) => {
    showDetails.value[orderId] = !showDetails.value[orderId]
}

onMounted(async () => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'))
    if (storedUser?.id) {
        const res = await axios.get(`http://localhost:3000/orders?userId=${String(storedUser.id)}`)
        orders.value = res.data
    }
})
const fetchOrders = async () => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'))
    if (storedUser?.id) {
        const res = await axios.get(`http://localhost:3000/orders?userId=${String(storedUser.id)}`)
        orders.value = res.data
    }
}
const cancelOrder = async (orderId) => {
    const confirmCancel = confirm('Bạn có chắc muốn hủy đơn hàng này không?')
    if (!confirmCancel) return

    try {
        await axios.patch(`http://localhost:3000/orders/${orderId}`, {
            status: 'Đã hủy'
        })
        // Cập nhật lại danh sách đơn hàng
        const storedUser = JSON.parse(localStorage.getItem('currentUser'))
        const res = await axios.get(`http://localhost:3000/orders?userId=${storedUser.id}`)
        orders.value = res.data
    } catch (error) {
        alert('Không thể hủy đơn hàng. Vui lòng thử lại.')
        console.error(error)
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

</script>
<template>
    <div class="container py-5">
        <router-link :to="`/`" class="btn btn-outline-secondary me-2 mb-2">Trang chủ</router-link>
        <h2 class="mb-4">Đơn hàng của bạn</h2>
        <div v-if="orders.length === 0" class="alert alert-info">
            Bạn chưa có đơn hàng nào.
        </div>
        <div v-else>
            <div v-for="order in sortedOrders" :key="order.id" class="card mb-4 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Mã đơn hàng: <strong>{{ order.orderCode }}</strong></h5>
                    <div class="mt-4">
                        <div v-for="item in order.products" :key="item.productId"
                            class="d-flex align-items-center mb-3">
                            <img :src="item.image" alt="product" class="me-3"
                                style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
                            <div>
                                <h6 class="mb-1">{{ item.title }}</h6>
                                <p class="mb-0">SL: {{ item.quantity }}</p>
                                <p class="mb-0">Giá: {{ item.price.toLocaleString() }} đ</p>
                                <router-link v-if="order.status === 'Đã nhận được hàng'"
                                    :to="`/review/${item.productId}?orderCode=${order.orderCode}`" class="btn btn-outline-success mt-2">
                                    Đánh giá sản phẩm
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <p>Ngày đặt: {{ formatDate(order.createdAt) }}</p>
                    <p>Trạng thái: <span class="badge bg-warning text-dark">{{ order.status }}</span></p>
                    <p>Tổng tiền: <strong>{{ order.total.toLocaleString() }} đ</strong></p>


                    <!-- Hủy đơn hàng -->
                    <button v-if="order.status === 'Chờ xác nhận'" class="btn btn-danger mt-3"
                        @click="cancelOrder(order.id)">
                        Hủy đơn hàng
                    </button>
                    <button v-if="order.status === 'Đang giao hàng'" class="btn btn-primary mt-3"
                        @click="updateOrderStatus(order.id, 'Đã nhận được hàng')">
                        Đã nhận hàng
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {
    max-width: 1200px;
}
</style>