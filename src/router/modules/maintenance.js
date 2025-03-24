// 供应商管理
import Layout from "@/layout";

const router = {
  path: "/maintenance",
  component: Layout,
  redirect: "/maintenance",
  name: "Maintenance",
  meta: { title: "维保管理", icon: "el-icon-mouse" },
  children: [
    {
      path: "/maintenance/programme_order",
      name: "programme_order",
      component: () => import("@/views/maintenance/programme_order"),
      meta: { title: "编程订单" },
      hidden: true,
    },
    // {
    //   path: "/maintenance/autoSendOrders",
    //   name: "autoSendOrders",
    //   component: () => import("@/views/maintenance/autoSendOrders"),
    //   meta: { title: "自动派单" },
    // },
    {
      path: "/maintenance/maintenance",
      name: "maintenance",
      component: () => import("@/views/maintenance/maintenance"),
      meta: { title: "新增订单", noShow: "true" },
    },
    {
      path: "/maintenance/equipmentManagement/addEquipment",
      name: "addEquipment",
      component: () =>
        import("@/views/maintenance/equipmentManagement/addEquipment.vue"),
      meta: { title: "新增设备管理", noShow: "true" },
    },
  ],
};
export default router;
