import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = import.meta.env.VITE_URL_API || 'http://localhost:3000'

const store = createStore({
    state() {
        return {
            products: [],
            carts: [],
            favorites: [],
            loading: false,
            error: null
        }
    },

    getters: {
        cartItems(state) {
            return state.carts
        },
        favoriteItems(state) {
            return state.favorites
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
        },
        setFavorites(state, favorites) {
            state.favorites = favorites
        },
        add_favorite(state, item) {
            const exists = state.favorites.find(f => f.productId === item.productId)
            if (!exists) {
                state.favorites.push(item)
            }
        },
        remove_favorite(state, id) {
            state.favorites = state.favorites.filter(item => item.id !== id)
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
                const productRes = await axios.get(`${API_URL}/products/${product.id}`)
                const productData = productRes.data

                if (productData.quantity === 0) {
                    alert(`Sản phẩm "${product.title}" đã hết hàng.`)
                    return
                }
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
        },
        async fetchFavorites({ commit }, userId) {
            try {
                const res = await axios.get(`${API_URL}/favorites?idUser=${userId}`)
                commit('setFavorites', res.data)
            } catch (err) {
                console.error('Lỗi khi tải danh sách yêu thích:', err)
            }
        },

        async addToFavorites({ commit }, product) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (!currentUser || !currentUser.id) {
                alert('Bạn cần đăng nhập để thêm vào yêu thích!')
                return
            }

            try {
                const res = await axios.get(`${API_URL}/favorites?idUser=${currentUser.id}`)
                const exists = res.data.find(item => item.productId === String(product.id))

                if (exists) {
                    alert('Sản phẩm đã có trong danh sách yêu thích!')
                    return
                }

                const newFavorite = {
                    idUser: currentUser.id,
                    productId: String(product.id),
                    title: product.title,
                    price: product.price,
                    image: product.image
                }

                await axios.post(`${API_URL}/favorites`, newFavorite)
                commit('add_favorite', newFavorite)
                alert('Đã thêm vào danh sách yêu thích!')
            } catch (err) {
                console.error('Lỗi khi thêm vào yêu thích:', err)
                alert('Thêm vào yêu thích thất bại!')
            }
        },

        async removeFromFavorites({ commit }, id) {
            try {
                await axios.delete(`${API_URL}/favorites/${id}`)
                commit('remove_favorite', id)
                alert('Đã xóa khỏi danh sách yêu thích!')
            } catch (err) {
                console.error('Lỗi khi xóa khỏi yêu thích:', err)
                alert('Xóa khỏi yêu thích thất bại!')
            }
        }
    }
})

export default store
