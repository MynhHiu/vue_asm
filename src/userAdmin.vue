<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const orders = ref([])
const error = ref(null)

const fetchData = async () => {
  try {
    const [userRes, orderRes] = await Promise.all([
      axios.get('http://localhost:3000/users'),
      axios.get('http://localhost:3000/orders')
    ])
    users.value = userRes.data
    orders.value = orderRes.data

    const spendingMap = {}
    orders.value.forEach(order => {
      const userId = order.userId
      const amount = Number(order.total)
      if (!spendingMap[userId]) {
        spendingMap[userId] = amount
      } else {
        spendingMap[userId] += amount
      }
    })

    users.value = users.value.map(user => ({
      ...user,
      totalSpent: spendingMap[user.id] || 0
    }))
  } catch (err) {
    error.value = 'Lỗi khi tải dữ liệu.'
    console.error(err)
  }
}

const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

const deleteUser = async (id, userName) => {
  if (userName === 'admin') {
    alert('Không thể xóa tài khoản admin!')
    return
  }
  const confirmDelete = confirm('Bạn có chắc muốn xóa người dùng này?')
  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`)
      users.value = users.value.filter(user => user.id !== id)
    } catch (err) {
      alert('Lỗi khi xóa người dùng.')
      console.error(err)
    }
  }
}

onMounted(fetchData)
</script>


<template>
  <div class="container mt-4">
    <router-link to="/admin" class="btn btn-outline-dark mb-3">Quay lại</router-link>

    <h3>Danh sách khách hàng & Chi tiêu</h3>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <table class="table table-striped table-bordered" v-if="users.length">
      <thead class="table-dark">
        <tr>
          <th>Tên đăng nhập</th>
          <th>Họ tên</th>
          <th>Email</th>
          <th>Tổng chi tiêu</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item.id">
          <td>{{ item.userName }}</td>
          <td>{{ item.fullName || 'Chưa cập nhật' }}</td>
          <td>{{ item.email || 'Chưa có email' }}</td>
          <td>{{ formatCurrency(item.totalSpent) }}</td>
          <td>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteUser(item.id, item.userName)"
              :disabled="item.userName === 'admin'"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-muted">Không có dữ liệu người dùng.</div>
  </div>
</template>



<style scoped>
.container {
  max-width: 1500px;
}
</style>
