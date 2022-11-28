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
      path: "/maintenance/system",
      name: "System",
      component: () => import("@/views/maintenance/system"),
      meta: { title: "设备系统" },
    },
    {
      path: "/maintenance/type",
      name: "Type",
      component: () => import("@/views/maintenance/type"),
      meta: { title: "设备类型" },
    },
    {
      path: "/maintenance/programme_order",
      name: "programme_order",
      component: () => import("@/views/maintenance/programme_order"),
      meta: { title: "编程订单" },
      hidden: true,
    },
    {
      path: "/maintenance/maintenance_order",
      name: "maintenance_order",
      component: () => import("@/views/maintenance/maintenance_order"),
      meta: { title: "维保订单" },
    },
    {
      path: "/maintenance/maintenance_order_desc",
      name: "maintenance_order_desc",
      component: () => import("@/views/maintenance/maintenance_order_desc"),
      meta: { title: "维保订单详情", noShow: "true" },
    },
    {
      path: "/maintenance/worker",
      name: "worker",
      component: () => import("@/views/maintenance/worker"),
      meta: { title: "师傅列表" },
    },
    {
      path: "/maintenance/enterpriseList",
      name: "enterpriseList",
      component: () => import("@/views/maintenance/enterpriseList"),
      meta: { title: "企业列表" },
    },
    {
      path: "/maintenance/checkPricing",
      name: "checkPricing",
      component: () => import("@/views/maintenance/checkPricing"),
      meta: { title: "检测定价", noShow: "true" },
    },

    {
      path: "/maintenance/customer",
      name: "customer",
      component: () => import("@/views/maintenance/customer"),
      meta: { title: "年保订单" },
    },
    {
      path: "/maintenance/customerDetail",
      name: "customerDetail",
      component: () => import("@/views/maintenance/customerDetail"),
      meta: { title: "年保订单详情", noShow: "true" },
    },
    {
      path: "/maintenance/text",
      component: () => import("@/views/maintenance/text.vue"),
      meta: { title: "测试", noShow: "true" },
    },
    {
      path: "/maintenance/equipmentManagement",
      name: "equipmentManagement",
      component: () =>
        import("@/views/maintenance/equipmentManagement/equipmentManagement"),
      meta: { title: "设备管理" },
    },
    {
      path: "/maintenance/equipmentManagement/equipmentDetails",
      name: "equipmentDetails",
      component: () =>
        import("@/views/maintenance/equipmentManagement/equipmentDetails"),
      meta: { title: "设备详情", noShow: "true" },
    },
    {
      path: "/maintenance/agentOrder",
      name: "agentOrder",
      component: () => import("@/views/maintenance/agentOrder"),
      meta: { title: "设备详情", noShow: "true" },
    },

    // 暂时 不用这个功能 后续看情况补上
    // {
    //   path: "/maintenance/maintenance",
    //   name: "maintenance",
    //   component: () => import("@/views/maintenance/maintenance"),
    //   meta: { title: "新增订单", noShow: "true" },
    // },
    // {
    //   path: "/maintenance/equipmentManagement/addEquipment",
    //   name: "addEquipment",
    //   component: () =>
    //     import("@/views/maintenance/equipmentManagement/addEquipment.vue"),
    //   meta: { title: "新增设备管理", noShow: "true" },
    // },
  ],
};
export default router;
