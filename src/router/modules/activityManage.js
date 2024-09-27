// 活动管理
import Layout from "@/layout";

const router = {
  path: "/activityManage",
  component: Layout,
  redirect: "/activityManage",
  name: "ActivityManage",
  meta: { title: "活动管理", icon: "el-icon-wind-power" },
  children: [
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
  ],
};
export default router;
