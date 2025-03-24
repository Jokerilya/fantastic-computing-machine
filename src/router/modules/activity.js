// 供应商管理
import Layout from "@/layout";

const router = {
  path: "/activity",
  component: Layout,
  redirect: "/activity",
  name: "Activity",
  meta: { title: "运营管理", icon: "el-icon-mouse" },
  children: [
    {
      path: "banner",
      name: "Banner",
      component: () => import("@/views/activity/banner"),
      meta: { title: "轮播图" },
    },
    {
      path: "ad",
      name: "Ad",
      component: () => import("@/views/activity/ad"),
      meta: { title: "Ad广告图" },
    },
    {
      path: "partner",
      name: "Partner",
      component: () => import("@/views/activity/partner"),
      meta: { title: "合作伙伴" },
    },
    {
      path: "news",
      name: "NewsList",
      component: () => import("@/views/news"),
      meta: { title: "新闻资讯" }
    },
    {
      path: "activityProductList",
      name: "activityProductList",
      component: () => import("@/views/activityManage/activityProductList"),
      meta: { title: "活动产品列表" },
    },
    {
      path: "activityProductOrderList",
      name: "activityProductOrderList",
      component: () => import("@/views/activityManage/activityProductOrderList"),
      meta: { title: "产品订单列表" },
    },
    {
      path: "/activity/message",
      name: "Message",
      component: () => import("@/views/activity/message"),
      meta: { title: "产品咨询列表" },
    },
    // {
    //   path: "coupon",
    //   name: "Coupon",
    //   component: () => import("@/views/activity/coupon"),
    //   meta: { title: "优惠券", icon: "el-icon-money" }
    // }
  ],
};
export default router;
