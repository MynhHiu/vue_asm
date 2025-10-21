<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const reviews = ref([])

const fetchReviews = async () => {
  try {
    const res = await axios.get('http://localhost:3000/reviews')
    reviews.value = res.data
  } catch (error) {
    console.error('Không thể tải danh sách đánh giá:', error)
  }
}

const updateStatus = async (reviewId, newStatus) => {
  try {
    await axios.patch(`http://localhost:3000/reviews/${reviewId}`, {
      status: newStatus
    })
    await fetchReviews()
  } catch (error) {
    alert('Không thể cập nhật trạng thái đánh giá.')
    console.error(error)
  }
}

const deleteReview = async (reviewId) => {
  const confirmDelete = confirm('Bạn có chắc muốn xóa đánh giá này không?')
  if (!confirmDelete) return

  try {
    await axios.delete(`http://localhost:3000/reviews/${reviewId}`)
    await fetchReviews()
  } catch (error) {
    alert('Không thể xóa đánh giá.')
    console.error(error)
  }
}

onMounted(fetchReviews)
</script>
<template>
<router-link :to="`/admin`" class="btn btn-outline-dark mt-3">Quay lại</router-link>
<div class="container py-5">
    <h2 class="mb-4">Quản lý đánh giá sản phẩm</h2>
    <div v-if="reviews.length === 0" class="alert alert-info">
      Chưa có đánh giá nào.
    </div>
    <div v-else>
      <div v-for="review in reviews" :key="review.id" class="card mb-3 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Sản phẩm ID: {{ review.productId }}</h5>
          <p><strong>Người dùng:</strong> {{ review.userId }}</p>
          <p><strong>Đơn hàng:</strong> {{ review.orderCode }}</p>
          <p><strong>Điểm:</strong> {{ review.rating }} sao</p>
          <p><strong>Bình luận:</strong> {{ review.comment }}</p>
          <p>
            <strong>Trạng thái:</strong>
            <span class="badge" :class="{
              'bg-warning text-dark': review.status === 'Chờ duyệt',
              'bg-success': review.status === 'Đã duyệt',
              'bg-danger': review.status === 'Bị từ chối'
            }">
              {{ review.status }}
            </span>
          </p>
          <div class="mt-3">
            <button class="btn btn-success me-2" @click="updateStatus(review.id, 'Đã duyệt')">Duyệt</button>
            <button class="btn btn-danger me-2" @click="updateStatus(review.id, 'Bị từ chối')">Từ chối</button>
            <button class="btn btn-outline-secondary" @click="deleteReview(review.id)">Xóa</button>
          </div>
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