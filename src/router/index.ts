import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import { rr } from "./factory"
import Game from "@/views/Game"

Vue.use(VueRouter)

const routes = rr([
  {
    path: "/",
    name: "Game",
    component: Game,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/tsx",
    name: "TSX",
    component: () => import(/* webpackChunkName: "tsx" */ "../views/Tsx"),
  },
])

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
