import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/home.vue"),
  },
  {
    path: "/case1",
    name: "case1",
    component: () => import("../views/case1.vue"),
  },
  {
    path: "/case2",
    name: "case2",
    component: () => import("../views/case2"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
