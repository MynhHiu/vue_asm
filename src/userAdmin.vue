<script setup>
import { ref, onMounted} from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter();

const users = ref([])

onMounted(async() => {
  console.log(`the component is now mounted.`)
  const response = await axios.get('http://localhost:3000/users');
  if(response.status == 200) {
    users.value = response.data
  }
})

const loadDuLieu = async () => {
    console.log(`the component is now mounted.`)
    const response = await axios.get('http://localhost:3000/users');
    if (response.status == 200) {
      users.value = response.data
    }
}


</script>
<template>
  <div class="container mt-4">
    <router-link :to="`/admin`"><h2 class="h5 mb-3">Quay Lại</h2></router-link>
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th scope="col">Tên đăng nhập</th>
          <th scope="col">Họ tên</th>
          <th scope="col">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item.id">
          <td>{{ item.userName }}</td>
          <td>{{ item.fullName }}</td>
          <td>{{ item.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
</style>