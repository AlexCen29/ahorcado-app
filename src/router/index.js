import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Admin from '../views/Admin.vue'
import User from '../views/User.vue'

const routes = [
  { path: '/', redirect: '/login' }, // Redirige a login por defecto
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admin', component: Admin },
  { path: '/user', component: User }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
