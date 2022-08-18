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
      meta: { title: "设备系统" }
    },
    {
      path: "/maintenance/type",
      name: "Type",
      component: () => import("@/views/maintenance/type"),
      meta: { title: "设备类型" }
    },
    {
      path: "/maintenance/programme_order",
      name: "programme_order",
      component: () => import("@/views/maintenance/programme_order"),
      meta: { title: "编程订单" }
    },
    {
      path: "/maintenance/maintenance_order",
      name: "maintenance_order",
      component: () => import("@/views/maintenance/maintenance_order"),
      meta: { title: "维保订单" }
    },
    {
      path: "/maintenance/maintenance_order_desc",
      name: "maintenance_order_desc",
      component: () => import("@/views/maintenance/maintenance_order_desc"),
      meta: { title: "维保订单详情", noShow: 'true' }
    },
    {
      path: "/maintenance/worker",
      name: "worker",
      component: () => import("@/views/maintenance/worker"),
      meta: { title: "师傅列表" }
    },
    {
      path: "/maintenance/enterpriseList",
      name: "enterpriseList",
      component: () => import("@/views/maintenance/enterpriseList"),
      meta: { title: "企业列表" }
    },
    
  ]
};
export default router;
