import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout";
import systemRouter from "./modules/system.js";
// import contentRouter from './modules/content.js';
import activityRouter from "./modules/activity.js";
// import schoolRouter from './modules/school.js';
import orderRouter from "./modules/order.js";
import installRouter from "./modules/install.js";
import productRouter from "./modules/product.js";
// import userRouter from './modules/user.js';
import userListRouter from "./modules/userList.js";
import newsRouter from "./modules/news.js";
import talentRouter from "./modules/talent.js";
import bossRouter from "./modules/boss.js";
import maintenanceRouter from "./modules/maintenance.js";
import storeController from "./modules/storeController";

export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "el-icon-s-home", affix: true },
      },
      {
        path: "/401",
        component: () => import("@/views/401"),
        hidden: true,
      },
    ],
  },
  // {
  //   path: "/statistics",
  //   component: Layout,
  //   redirect: "/statistics",
  //   children: [
  //     {
  //       path: "/statistics",
  //       name: "Statistics",
  //       component: () => import("@/views/statistics/index"),
  //       meta: { title: "数据统计", icon: "dashboard" }
  //     }
  //   ]
  // },
  // userListRouter,
  maintenanceRouter,
  // storeController,
  systemRouter,
  activityRouter,
  // productRouter,
  // orderRouter,
  // installRouter,
  // newsRouter,
  // talentRouter,
  // bossRouter,
  // contentRouter,
  // schoolRouter,
  // userRouter,
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// router.beforeEach((to, from, next) => {
// 	const whiteList = ['/boss/htToweixinurlscheme']
// 	if (whiteList.indexOf(to.path) !== -1) {
// 		next('/boss/htToweixinurlscheme')
// 		return
// 	}else {
// 		next()
// 	}
// })

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
