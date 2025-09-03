// 供应商管理
import Layout from "@/layout";

const systemRouter = {
  path: "/system",
  component: Layout,
  redirect: "/system",
  name: "System",
  meta: { title: "系统管理", icon: "el-icon-s-tools" },
  children: [
    {
      path: "/tagManage",
      name: "TagManage",
      component: () => import("@/views/tagManage/index.vue"),
      meta: { title: "标签管理" },
    },
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
      path: "/maintenance/supplierList",
      name: "supplierList",
      component: () => import("@/views/maintenance/supplierList.vue"),
      meta: { title: "供应商" },
    },
    {
      path: "faultItemsExamine",
      name: "faultItemsExamine",
      component: () => import("@/views/system/faultItemsExamine"),
      meta: { title: "故障项目管理" },
    },
    {
      path: "setup-operator",
      name: "SetupOperator",
      component: () => import("@/views/system/setup-operator"),
      meta: { title: "后台操作员管理" },
    },
    {
      path: "setup-role",
      name: "SetupRole",
      component: () => import("@/views/system/setup-role"),
      meta: { title: "后台角色管理" },
    },
    {
      path: "setup-menu",
      name: "SetupMenu",
      component: () => import("@/views/system/setup-menu"),
      meta: { title: "菜单管理" },
    },
    {
      path: "base-info",
      name: "BaseInfo",
      component: () => import("@/views/system/base-info"),
      meta: { title: "系统参数配置" },
    },
    {
      path: "agreement",
      name: "Agreement",
      component: () => import("@/views/system/agreement"),
      meta: { title: "系统说明" },
    },
    {
      path: "exp",
      name: "Exp",
      component: () => import("@/views/system/exp"),
      meta: { title: "运费模板" },
    },
    {
      path: "base-logList",
      name: "BaseLogList",
      component: () => import("@/views/system/base-logList"),
      meta: { title: "系统日志" },
    },
    // {
    // 	path: 'app-version',
    // 	name: 'AppVersion',
    // 	component: () => import('@/views/system/app-version'),
    // 	meta: { title: 'App版本管理', icon: 'el-icon-mobile-phone' },
    // },
    {
      path: "masterLvManage",
      name: "masterLvManage",
      component: () => import("@/views/system/masterLvManage"),
      meta: { title: "师傅等级管理" },
    },
    // {
    // 	path: 'faultyPricingCount',
    // 	name: 'faultyPricingCount',
    // 	component: () => import('@/views/system/faultyPricingCount'),
    // 	meta: { title: '故障项定价统计' }
    // },
    // 供应商
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
  ],
};
export default systemRouter;
