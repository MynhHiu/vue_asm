<script setup>
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'

const store = useStore()
const currentUser = JSON.parse(localStorage.getItem('currentUser'))

onMounted(() => {
    if (currentUser && currentUser.id) {
        store.dispatch('fetchFavorites', currentUser.id)
    }
})

const favorites = computed(() => store.state.favorites || [])

const removeItem = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích không?')
    if (confirmDelete) {
        store.dispatch('removeFromFavorites', id)
    }
}

const addToCart = (item) => {
    const product = {
        id: item.productId,
        title: item.title,
        price: item.price,
        image: item.image
    }
    store.dispatch('addToCart', product)
}

</script>

<template>
    <router-link class="btn btn-outline-dark mt-3" to="/">Quay lại</router-link>
    <div class="container mt-4">
        <h3>Sản phẩm yêu thích của bạn</h3>

        <div v-if="Array.isArray(favorites) && favorites.length">
            <div v-for="item in favorites" :key="item.id" class="cart-item">
                <img :src="item.image" alt="product" />
                <div class="cart-item-info">
                    <div class="cart-item-title">{{ item.title }}</div>
                    <div class="cart-item-price">{{ item.price }} đ</div>
                    <button @click="addToCart(item)" class="btn btn-sm btn-success mt-2 me-2">Thêm vào giỏ hàng</button>
                    <router-link :to="`/products/${item.productId}`" class="btn btn-sm btn-warning mt-2 me-2">Chi tiết</router-link>
                    <button @click="removeItem(item.id)" class="btn btn-sm btn-danger mt-2">Xóa</button>
                </div>
            </div><br>
        </div>

        <div v-else>
            <p>Sản phẩm yêu thích của bạn đang trống.</p>
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