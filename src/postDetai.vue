<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
const route = useRoute()
const router = useRouter()
const id = route.params.id
const post = reactive({})

onMounted(()=> {
    Loadulieu()
})

const Loadulieu = async () => {
    if (id) {
        const response = await axios.get(`http://localhost:3000/posts/${id}`);
        if (response.status == 200) {
            Object.assign(post, response.data)
        }
    }

}
const goBack = () => {
    router.back()
}
</script>
<template>
  <div class="container mt-4">
    <div class="row g-4 align-items-start">
      <div class="col-12 col-md-4 text-center">
        <img
          :src="post.image || 'https://via.placeholder.com/250'"
          alt="Post"
          class="img-fluid rounded shadow-sm mb-3"
          style="max-width: 250px;"
        />
      </div>
      <div class="col-12 col-md-8">
        <div class="d-flex w-100 justify-content-between align-items-center mb-2">
          <h2 class="h4 mb-0">{{ post.title }}</h2>
          <button @click="handleDeleteEmit(post.id)" class="btn btn-outline-danger btn-sm ms-2">Remove</button>
        </div>
        <div class="mb-2">
          <small class="text-muted">
            by <strong>{{ post.creator}}</strong>
            · {{ post.time}} min read
          </small>
        </div>
        <p class="lead mb-3">{{ post.description }}</p>
        <div class="d-flex gap-2 mb-3">
          <span class="badge bg-primary">News</span>
          <span class="badge bg-secondary">Tutorial</span>
        </div>
        <button @click="goBack()" class="btn btn-outline-secondary">Quay lại</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>