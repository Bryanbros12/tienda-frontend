// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '../stores/sessionStore.js'

// Lazy-load para mejor rendimiento
const HomeView    = () => import('../views/HomeView.vue')
const CatalogoView = () => import('../views/CatalogoView.vue')
const LoginView   = () => import('../views/LoginView.vue')
const AdminView   = () => import('../views/AdminView.vue')
const RegistroView = () => import('../views/RegistroView.vue')

const routes = [
  { path: '/',         name: 'home',     component: HomeView },
  { path: '/catalogo', name: 'catalogo', component: CatalogoView },
  { path: '/login',    name: 'login',    component: LoginView },
  { path: '/registro', name: 'registro', component: RegistroView },
  {
    path:      '/admin',
    name:      'admin',
    component: AdminView,
    meta:      { requiereAdmin: true },   // protegida
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard global: redirige si la ruta requiere admin y el usuario no lo es
router.beforeEach((to) => {
  if (to.meta.requiereAdmin) {
    const session = useSessionStore()
    if (!session.esAdmin) return { name: 'login' }
  }
})

export default router
