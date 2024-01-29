import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: () => import('../views/loginView.vue'),
    }
  ]
})

// 路由前置守卫
// router.beforeEach((to, form, next) => {
//   if (userlogin) {
//     next()
//   } else {
//     next('/login')
//   }
// })

export default router
