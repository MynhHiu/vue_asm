<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter();

const posts = ref([])
const post = reactive({
  title: '',
  time: '',
  image: '',
  description: ''
})

const emit = defineEmits(['remove'])

onMounted(async() => {
  console.log(`the component is now mounted.`)
  const response = await axios.get('http://localhost:3000/posts');
  if(response.status == 200) {
    posts.value = response.data
  }
})

const handleDeleteEmit = (id) => {
  emit("remove", id)
}

const handleDelete = async (id) => {
    const isConfirm = confirm(`Ban co muon xoa id = ${id} nay khong`)
    if (isConfirm) {
    //b2:
    const response = await axios.delete(`http://localhost:3000/posts/${id}`);
    if (response.status == 200) {
      //b3: load lại giao diện
      loadDuLieu()
      // posts.value = response.data
      alert('xoá thành công')
    }

  }
}
const loadDuLieu = async () => {
    console.log(`the component is now mounted.`)
    const response = await axios.get('http://localhost:3000/posts');
    if (response.status == 200) {
      posts.value = response.data
    }
}
const handleSubmit = async () => {
  if (post.title === "") {
    alert('title khong de trong')
  }
  const payload = {
    title: post.title,
    time: post.time,
    image: post.image,
    description: post.description,
    creator: 'admin',
    tags: 'news'
  }
  const response = await axios.post('http://localhost:3000/posts', payload);
  console.log(response);
  if (response.status == 201) {
    loadDuLieu()
    clearData()
    alert('đã thêm thành công')
  }

}

const clearData = () => {
  Object.assign(post, {
    title: '',
    time: '',
    image: '',
    description: ''
  })
}
const goTo = (id) => {
  router.push(`/posts/${id}`)
}

const isLoggedIn = ref(!!localStorage.getItem('currentUser'))

const logout = () => {
  localStorage.removeItem('currentUser')
  isLoggedIn.value = false
  router.push('/')
}
</script>
<template>
  <main class="container py-4">
    <header class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h3 m-0">Latest Posts</h1>
      <form class="d-none d-sm-flex" role="search">
        <input class="form-control form-control-sm" type="search" placeholder="Search posts" />
      </form>
    </header>
    <router-link :to="`/`"><h2 class="h5 mb-1">Trang chủ</h2></router-link>

    <div class="list-group">
      <!-- Post item -->
      <div v-for="item in posts" :key="item.id"
           class="list-group-item list-group-item-action py-3">
        <div class="row g-3 align-items-start">
          <div class="col-12 col-sm-auto">
            <img :src="item.image" alt="Post" class="post-thumb img-thumbnail mb-2 mb-sm-0" />
          </div>
          <div class="col">
            <div class="d-flex w-100 justify-content-between align-items-center">
              <router-link :to="`/posts/${item.id}`">
                <h2 class="h5 mb-1">{{ item.title }}</h2>
              </router-link>
              <small class="text-muted">{{ item.time}} min read</small>
            </div>
            <div class="mb-2">
              <small class="text-muted">by <strong>{{ item.creator}}</strong></small>
            </div>
            <p class="post-excerpt mb-2">
              {{ item.description }}
            </p>
            <div class="d-flex gap-2 mb-2">
              <span class="badge bg-primary">News</span>
              <span class="badge bg-secondary">Tutorial</span>
            </div>
          </div>
        </div>
        <button @click="goTo(item.id)" class="btn btn-outline-info btn-sm">Chi Tiết</button>
      </div>
    </div>
  </main>
</template>
<style scoped>

.success {
    color: green;
}

.error {
    color: red;
}
.post-excerpt {
      display: -webkit-box;
      /* -webkit-line-clamp: 2; */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .post-thumb {
      width: 120px; height: 80px; object-fit: cover; border-radius: .5rem;
    }
    @media (max-width: 575.98px) {
      .post-thumb { width: 100%; height: 160px; }
    }
</style>