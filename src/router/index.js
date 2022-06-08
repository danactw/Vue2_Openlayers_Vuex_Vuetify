import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/interaction',
    name: 'InteractionMap',
    component: () => import('../views/InteractionMap.vue')
  },
  {
    path: '/vector',
    name: 'VectorMap',
    component: () => import('../views/VectorMap.vue')
  },
  {
    path: '/userauth',
    name: 'UserAuth',
    component: () => import('../views/UserAuth.vue')
  },
  {
    path: '/userprofile',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue')
  },
  {
    path: '/shoppingcart',
    name: 'ShoppingCart',
    component: () => import('../views/ShoppingCart.vue')
  },
  {
    path: '/ordertracking',
    name: 'OrderTracking',
    component: () => import('../views/OrderTracking.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
