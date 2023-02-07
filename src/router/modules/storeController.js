// 库存模块
import Layout from "@/layout";

const router = {
  path: "/storeController",
  component: Layout,
  redirect: "/storeController",
  name: "StoreController",
  meta: { title: "仓储管理", icon: "el-icon-s-shop" },
  children: [
    {
      path: "/storeController/storeStock",
      name: "StoreStock",
      component: () => import("@/views/storeController/storeStock"),
      meta: { title: "实时库存" },
    },
    {
      path: "/storeController/storeOrder",
      name: "StoreOrder",
      component: () => import("@/views/storeController/storeOrder"),
      meta: { title: "出 / 入库" },
    },
  ],
};
export default router;
