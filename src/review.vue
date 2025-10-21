<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const productId = route.params.productId
const product = ref(null)
const rating = ref(5)
const comment = ref('')
const currentUser = JSON.parse(localStorage.getItem('currentUser'))
const reviews = ref([])
const orderCode = route.query.orderCode

const submitReview = async () => {
    if (!comment.value || rating.value < 1 || rating.value > 5) {
        alert('Vui lòng nhập đánh giá hợp lệ.')
        return
    }

    const newReview = {
        userId: currentUser.id,
        productId: productId,
        orderCode: orderCode,
        rating: rating.value,
        comment: comment.value,
        status: 'Chờ duyệt',
        createdAt: new Date().toISOString()
    }

    try {
        await axios.post('http://localhost:3000/reviews', newReview)
        reviews.value.push(newReview)
        alert('Đánh giá đã được gửi!')
        comment.value = ''
        rating.value = 5
    } catch (error) {
        alert('Không thể gửi đánh giá.')
        console.error(error)
    }
}

onMounted(async () => {
    try {
        const res = await axios.get(`http://localhost:3000/products/${productId}`)
        product.value = res.data

        const resReviews = await axios.get(`http://localhost:3000/reviews?productId=${productId}&orderCode=${orderCode}&userId=${currentUser.id}`)

        reviews.value = resReviews.data
    } catch (error) {
        console.error('Không thể tải dữ liệu:', error)
    }
})
</script>

<template>
    <div class="container py-5">
        <router-link :to="`/orders`" class="btn btn-outline-secondary me-2 mb-2">Quay lại</router-link>
        <h2 class="mb-4">Đánh giá sản phẩm</h2>

        <div v-if="product">
            <h4>{{ product.title }}</h4>
            <img :src="product.image" alt="product" style="width: 120px; border-radius: 8px;" />
            <p class="mt-2">Giá: {{ product.price.toLocaleString() }} đ</p>

            <div v-if="reviews.length === 0" class="mt-4">
                <label class="form-label">Chấm điểm (1–5):</label>
                <input type="number" v-model="rating" min="1" max="5" class="form-control" />

                <label class="form-label mt-3">Nhận xét:</label>
                <textarea v-model="comment" class="form-control" rows="4"
                    placeholder="Viết cảm nhận của bạn..."></textarea>

                <button class="btn btn-success mt-3" @click="submitReview">Gửi đánh giá</button>
            </div>

            <div v-else class="mt-5">
                <h5 class="mb-3">Đánh giá của bạn</h5>
                <div v-for="review in reviews" :key="review.createdAt" class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <h6 class="card-title">{{ review.rating }} sao</h6>
                        <p class="card-text">{{ review.comment }}</p>
                        <span class="badge" :class="{
                            'bg-warning text-dark': review.status === 'Chờ duyệt',
                            'bg-success': review.status === 'Đã xác nhận',
                            'bg-danger': review.status === 'Bị từ chối'
                        }">
                            {{ review.status }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="alert alert-warning">
            Không tìm thấy thông tin sản phẩm.
        </div>

    </div>
</template>

<style scoped>
.container {
    max-width: 800px;
}
</style>
