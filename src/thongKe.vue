<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chartRef = ref(null)
const chartInstance = ref(null)

const monthlyRevenue = ref({})

const fetchOrders = async () => {
  const res = await axios.get('http://localhost:3000/orders')
  const orders = res.data

  const revenueByMonth = {}

  orders.forEach(order => {
    const date = new Date(order.createdAt)
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    const total = Number(order.total)

    if (!revenueByMonth[month]) {
      revenueByMonth[month] = total
    } else {
      revenueByMonth[month] += total
    }
  })

  monthlyRevenue.value = revenueByMonth
  renderChart()
}

const renderChart = () => {
  const labels = Object.keys(monthlyRevenue.value)
  const data = Object.values(monthlyRevenue.value)

  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  chartInstance.value = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Doanh thu theo tháng (VND)',
        data,
        backgroundColor: '#007bff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: 'Biểu đồ doanh thu theo tháng'
        }
      }
    }
  })
}

onMounted(fetchOrders)
</script>
<template>
    <router-link :to="`/admin`" class="btn btn-outline-dark mt-3" >Quay lại</router-link>
      <div class="container mt-4">
    <h3>Báo cáo doanh thu</h3>
    <canvas ref="chartRef"></canvas>
  </div>
</template>
<style scoped>
</style>