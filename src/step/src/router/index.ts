import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'docs',
      component: () => import('../views/DocView.vue'),
    },
  ],
})

export default router
