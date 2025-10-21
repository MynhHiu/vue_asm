<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()

const user = reactive({
  id: '',
  fullName: '',
  email: '',
  sdt: '',
  diaChi: ''
})

const carts = ref([])
const totalCart = ref(0)

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem('currentUser'))
  if (storedUser?.id) {
    const res = await axios.get(`http://localhost:3000/users/${storedUser.id}`)
    const data = res.data
    user.id = data.id
    user.fullName = data.fullName || ''
    user.email = data.email || ''
    user.sdt = data.sdt || ''
    user.diaChi = data.diaChi || ''
  }

  const cartRes = await axios.get(`http://localhost:3000/carts?idUser=${storedUser.id}`)
  carts.value = cartRes.data
  totalCart.value = carts.value.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/,/g, ''))
    return sum + item.quantity * price
  }, 0)
})

const handleCheckout = async () => {
  try {
    const ordersRes = await axios.get('http://localhost:3000/orders')
    const existingOrders = ordersRes.data
    const nextOrderNumber = existingOrders.length + 1
    const orderCode = `DH${nextOrderNumber}`
    const newOrder = {
      orderCode,
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      sdt: user.sdt,
      diaChi: user.diaChi,
      paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'cod',
      products: carts.value.map(cart => ({
        productId: cart.productId,
        title: cart.title,
        quantity: cart.quantity,
        price: cart.price,
        image: cart.image
      })),
      total: totalCart.value,
      status: 'Chờ xác nhận',
      createdAt: new Date().toISOString()
    }

    await axios.post('http://localhost:3000/orders', newOrder)
    localStorage.setItem('lastOrderCode', orderCode)
    const storedOrder = localStorage.getItem('lastOrderCode')
    router.push('/orderSuccess')
    
    for (const cart of carts.value) {
      try {
        const productRes = await axios.get(`http://localhost:3000/products/${cart.productId}`)
        const product = productRes.data

        const newQuantity = product.quantity - cart.quantity
        await axios.patch(`http://localhost:3000/products/${cart.productId}`, {
          quantity: newQuantity < 0 ? 0 : newQuantity
        })
      } catch (err) {
        console.error(`Lỗi khi cập nhật số lượng sản phẩm ${cart.productId}:`, err)
      }
      await axios.delete(`http://localhost:3000/carts/${cart.id}`)
    }

    carts.value = []
    totalCart.value = 0
  } catch (error) {
    alert('Có lỗi xảy ra khi đặt hàng.')
    console.error(error)
  }
}
</script>
<template>
  <router-link class="btn btn-outline-dark mt-3" to="/carts">Quay lại</router-link>
  <div class="container">
    <h1 class="h4 mb-3">Thanh toán</h1>
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <form id="checkoutForm" @submit.prevent="handleCheckout" class="needs-validation">
              <p class="form-section-title mb-2"> Thông tin liên hệ</p>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Họ và tên</label>
                  <input type="text" class="form-control" v-model="user.fullName" required placeholder="Nguyễn Văn A" />
                  <div class="invalid-feedback">Vui lòng nhập họ và tên.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="user.email" required placeholder="ban@email.com" />
                  <div class="invalid-feedback">Email chưa hợp lệ.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số điện thoại</label>
                  <input type="tel" class="form-control" v-model="user.sdt" required placeholder="09xxxxxxxx" />
                  <div class="invalid-feedback">Vui lòng nhập số điện thoại.</div>
                </div>
              </div>

              <hr class="my-4" />

              <p class="form-section-title mb-2"> Địa chỉ giao hàng</p>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Địa chỉ</label>
                  <input type="text" class="form-control" v-model="user.diaChi" required
                    placeholder="Số nhà, đường, phường/xã" />
                  <div class="invalid-feedback">Vui lòng nhập địa chỉ.</div>
                </div>
              </div>

              <hr class="my-4" />
              <p class="form-section-title mb-2"> Phương thức thanh toán</p>
              <div class="row g-3">
                <div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" value="cod" name="payment" id="payCOD" checked />
                    <label class="form-check-label" for="payCOD">Thanh toán khi nhận hàng (COD)</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" value="vnpay" name="payment" id="payCard" />
                    <label class="form-check-label" for="payCard">Thẻ VNPAY</label>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary mt-3">Thanh toán</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <h6 class="mb-3">Giỏ hàng</h6>
            <table class="table table-sm align-middle">
              <thead>
                <tr>
                  <th scope="col">Tên</th>
                  <th scope="col" class="text-center">SL</th>
                  <th scope="col" class="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cart in carts" :key="cart.id">
                  <td>
                  <td>{{ cart.title }}</td>
                  </td>
                  <td class="text-center">{{ cart.quantity }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-danger" @click="handleRemove(cart.id)">Xoá</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between">
              <strong>Tổng:</strong>
              <strong>{{ totalCart.toLocaleString('vi-VN') }}₫</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>