import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'docs',
      component: () => import('../views/DocView.vue'),
    },
    {
      path: '/tree',
      name: 'tree',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TreeView.vue'),
    },
    {
      path: '/cursor',
      name: 'cursor',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CursorView.vue'),
    },
  ],
})

export default router
