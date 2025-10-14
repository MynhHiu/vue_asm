import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = import.meta.env.VITE_URL_API || 'http://localhost:3000'

const store = createStore({
    state() {
        return {
            products: [],
            carts: [],
            loading: false,
            error: null
        }
    },

    getters: {
        cartItems(state) {
            return state.carts
        }
    },

    mutations: {
        setProducts(state, products) {
            state.products = products
        },
        setCarts(state, carts) {
            state.carts = carts
        },
        add_cart(state, payload) {
            const existItem = state.carts.find(item => item.productId === payload.productId)
            if (existItem) {
                existItem.quantity++
            } else {
                state.carts.push({ ...payload, quantity: 1 })
            }
        },
        remove_cart(state, id) {
            state.carts = state.carts.filter(item => item.id !== id)
        },
        setLoading(state, status) {
            state.loading = status
        },
        setError(state, error) {
            state.error = error
        },
        setCartItems(state, items) {
            state.cartItems = items
        }
    },

    actions: {
        async fetchProducts({ commit }) {
            commit('setLoading', true)
            try {
                const res = await axios.get(`${API_URL}/products`)
                commit('setProducts', res.data)
            } catch (err) {
                commit('setError', err)
            } finally {
                commit('setLoading', false)
            }
        },

        async fetchCart({ commit }, userId) {
            try {
                const res = await axios.get(`${API_URL}/carts?idUser=${userId}`)
                commit('setCarts', res.data)
            } catch (err) {
                console.error('Lỗi khi tải giỏ hàng:', err)
            }
        },

        async addToCart({ commit }, product) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (!currentUser || !currentUser.id) {
                alert('Bạn cần đăng nhập để thêm vào giỏ hàng!')
                return
            }

            try {
                const res = await axios.get(`${API_URL}/carts?idUser=${currentUser.id}`)
                const existingItem = res.data.find(item => item.productId === String(product.id))

                if (existingItem) {
                    await axios.patch(`${API_URL}/carts/${existingItem.id}`, {
                        quantity: existingItem.quantity + 1
                    })
                } else {
                    const newItem = {
                        idUser: currentUser.id,
                        productId: String(product.id),
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    }
                    await axios.post(`${API_URL}/carts`, newItem)
                    commit('add_cart', newItem)
                }

                alert('Đã thêm vào giỏ hàng!')
            } catch (error) {
                console.error('Lỗi khi thêm vào giỏ hàng:', error)
                alert('Thêm vào giỏ hàng thất bại!')
            }
        },
        removeFromCart({ commit }, id) {
            axios.delete(`${API_URL}/carts/${id}`)
                .then(() => {
                    commit('remove_cart', id)
                    alert('Sản phẩm đã được xóa khỏi giỏ hàng!')
                })
                .catch(err => {
                    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', err)
                    alert('Xóa sản phẩm thất bại!')
                })
        },
        updateQuantity({ commit, state }, { id, quantity }) {
            const item = state.carts.find(i => i.id === id)
            if (!item) return

            axios.patch(`${API_URL}/carts/${id}`, { quantity })
                .then(() => {
                    item.quantity = quantity
                })
                .catch(err => {
                    console.error('Lỗi khi cập nhật số lượng:', err)
                })
        }
    }
})

export default store
