import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Admin from '../views/Admin.vue'
import User from '../views/User.vue'
import Game from '../views/Game.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/user', component: User, meta: { requiresAuth: true } },
  { path: '/game', component: Game, meta: { requiresAuth: true } },
  { path: '/guest', component: Game, meta: { isGuest: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//proteccion de rutas
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('authToken');
  const user = JSON.parse(sessionStorage.getItem('authUser'));

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token || !user) {
      next({ path: '/login' });
    } else if (to.matched.some(record => record.meta.requiresAdmin) && user.rol !== 'ADMIN') {
      next('/game'); //redirige si no es admin
    } else {
      next();
    } 
  } else if (to.matched.some(record => record.meta.isGuest)) {
    if (token && user) {
      next('/game'); //redirige a /game si ya est autenticado
    } else {
      next(); //permite acceso si no esta autenticado
    }
  } else {
    if ((to.path === '/login' || to.path === '/register') && token) {
      next('/game');
    } else {
      next();
    }
  }
});


export default router;
