import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Admin from '../views/Admin.vue'
import User from '../views/User.vue'
import Game from '../views/Game.vue'

const routes = [
  { path: '/', redirect: '/login' }, //rdirige a login por defecto
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admin', component: Admin },
  { path: '/user', component: User },
  { path: '/game', component: Game },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
