import Vue from 'vue'
import VueRouter from 'vue-router'
import V4Countries from '../views/V4Countries.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'V4Countries',
    component: V4Countries
  },
  {
    path: '/selectCountry',
    name: 'SelectCountry',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SelectCountry.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
