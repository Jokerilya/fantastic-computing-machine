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
      meta: { title: "轮播图", icon: "el-icon-picture-outline" }
    },
    {
      path: "ad",
      name: "Ad",
      component: () => import("@/views/activity/ad"),
      meta: { title: "Ad广告图", icon: "el-icon-picture" }
    },
    {
      path: "partner",
      name: "Partner",
      component: () => import("@/views/activity/partner"),
      meta: { title: "合作伙伴", icon: "el-icon-s-custom" }
    },
    {
      path: "message",
      name: "Message",
      component: () => import("@/views/activity/message"),
      meta: { title: "盒子预约信息", icon: "el-icon-date" }
    },
    // {
    //   path: "coupon",
    //   name: "Coupon",
    //   component: () => import("@/views/activity/coupon"),
    //   meta: { title: "优惠券", icon: "el-icon-money" }
    // }
  ]
};
export default router;
