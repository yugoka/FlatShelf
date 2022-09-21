import Vue from "vue"
import VueRouter from "vue-router"
import Browser from "../views/Browser.vue"
import Viewer from "../views/Viewer.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Search",
    component: Browser,
  },
  {
    path: "/view/:contentID",
    name: "View",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Viewer,
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
  },
]

const router = new VueRouter({
  routes,
})

export default router
