// 订单管理
import Layout from "@/layout";

const router = {
  path: "/orderManagement",
  component: Layout,
  redirect: "/orderManagement",
  name: "orderManagement",
  meta: { title: "订单管理", icon: "el-icon-tickets" },
  children: [
    {
      path: "/maintenance/maintenance_order",
      name: "maintenance_order",
      component: () => import("@/views/maintenance/maintenance_order"),
      meta: { title: "维保工单" },
    },
    // 保养
    {
      path: "/maintenance/upkeepDetailModule",
      name: "upkeepDetailModule",
      component: () => import("@/views/maintenance/upkeepDetailModule"),
      meta: { title: "保养工单" },
    },
    {
      path: "/maintenance/maintenance_order_desc",
      name: "maintenance_order_desc",
      component: () => import("@/views/maintenance/maintenance_order_desc"),
      meta: { title: "维保订单详情", noShow: "true" },
    },
    {
      path: "/maintenance/customer",
      name: "customer",
      component: () => import("@/views/maintenance/customer"),
      meta: { title: "年保合同" },
    },
    {
      path: "/maintenance/equipmentManagement",
      name: "equipmentManagement",
      component: () =>
        import("@/views/maintenance/equipmentManagement/equipmentManagement"),
      meta: { title: "设备管理" },
    },
    {
      path: "/maintenance/customerDetail",
      name: "customerDetail",
      component: () => import("@/views/maintenance/customerDetail"),
      meta: { title: "年保订单详情", noShow: "true" },
    },

    // {
    //   path: "/financialManagement/incomeExpenditrue",
    //   name: "workerDetails",
    //   component: () => import("@/views/financialManagement/incomeExpenditrue"),
    //   meta: { title: "收支明细" },
    // },
    // {
    //   path: "/maintenance/masterOrderDiscount",
    //   name: "masterOrderDiscount",
    //   component: () => import("@/views/maintenance/masterOrderDiscount.vue"),
    //   meta: { title: "折扣明细" },
    // },
    // {
    //   path: "/maintenance/faultItemPricing",
    //   name: "faultItemPricing",
    //   component: () => import("@/views/maintenance/faultItemPricing"),
    //   meta: { title: "审核定价" },
    // },
    {
      path: "/maintenance/checkPricing",
      name: "checkPricing",
      component: () => import("@/views/maintenance/checkPricing"),
      meta: { title: "检测定价", noShow: "true" },
    },
    {
      path: "/maintenance/amendPricing",
      name: "amendPricing",
      component: () => import("@/views/maintenance/amendPricing"),
      meta: { title: "修改定价", noShow: "true" },
    },
    {
      path: "/maintenance/assignedWorker",
      name: "assignedWorker",
      component: () => import("@/views/maintenance/assignedWorker"),
      meta: { title: "指派师傅", noShow: "true" },
    },
    // 发票
    {
      path: "/invoiceManagement/invoiceList",
      name: "workerDetails",
      component: () => import("@/views/invoiceManagement/invoiceList"),
      meta: { title: "发票明细" },
    },

    // 物流
    {
      path: "/maintenance/logisticsDetails",
      name: "logisticsDetails",
      component: () => import("@/views/maintenance/logisticsDetails"),
      meta: { title: "物流详情" },
      hidden: true,
    },
    {
      path: "/coupon",
      name: "Coupon",
      component: () => import("@/views/activity/coupon"),
      meta: { title: "优惠券管理" },
    },
    {
      path: "/receiveRecords",
      name: "ReceiveRecords",
      component: () => import("@/views/activity/coupon/receiveRecords"),
      meta: { title: "领取记录", noShow: "true" },
    },
    {
      path: "/assignmentMaster",
      name: "assignmentMaster",
      component: () => import("@/views/maintenance/assignmentMaster"),
      meta: { title: "指派师傅" },
      //   hidden: false,
    },
  ],
};
export default router;
