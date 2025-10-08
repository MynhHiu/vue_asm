import { createMemoryHistory, createRouter } from 'vue-router'

import home from './home.vue'
import post from './post.vue'
import postDetai from './postDetai.vue'
import productDetai from './productDetai.vue'
import login from './login.vue'
import singup from './singup.vue'
import profile from './profile.vue'
import admin from './admin.vue'
import products from './products.vue'
import postAdmin from './postAdmin.vue'
import productAdmin from './productAdmin.vue'
import userAdmin from './userAdmin.vue'

const routes = [
    {path: '/', component: home, meta: { isAuth: false }},
    {path:'/posts', component: post, meta: { isAuth: false }},
    {path: '/posts/:id', component: postDetai, meta: { isAuth: false }},
    {path: '/products/:id', component: productDetai, meta: { isAuth: false }},
    {path: '/login', component: login, meta: { isAuth: false }},
    {path: '/products', component: products, meta: { isAuth: false }},
    {path: '/singup', component: singup, meta: { isAuth: false }},
    {path: '/profile', component: profile, meta: { isAuth: true }},
    {path: '/postAdmin', component: postAdmin, meta: { isAuth: true }},
    {path: '/productAdmin', component: productAdmin, meta: { isAuth: true }},
    {path: '/userAdmin', component: userAdmin, meta: { isAuth: true }},
    {path: '/admin', component: admin, meta: { isAuth: true }}
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
    const currentUser = localStorage.getItem('currentUser');
    if (to.meta.isAuth && !currentUser) {
        next('/login');
    } else {
        next();
    }
})

export default router