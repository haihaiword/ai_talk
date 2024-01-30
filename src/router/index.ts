import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserInfoStore } from '@/stores/userInfo';

const userInfoStore = useUserInfoStore()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        noAuth: true,
      },
      component: () => import('../views/loginView.vue'),
    }
  ]
})

// 路由前置守卫
router.beforeEach((to, form, next) => {
  if (to.meta.noAuth || userInfoStore.authFormLocal()) {
    next()
  } else {
    router.push('/login')
  }
})

export default router
