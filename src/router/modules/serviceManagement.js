// 业务管理
import Layout from "@/layout";

const router = {
  path: "/serviceManagement",
  component: Layout,
  redirect: "/serviceManagement",
  name: "ServiceManagement",
  meta: { title: "业务管理", icon: "el-icon-suitcase-1" },
  children: [
    {
      path: "/serviceManagement/businessPersonnel",
      name: "businessPersonnel",
      component: () => import("@/views/maintenance/businessPersonnel/index"),
      meta: { title: "业务人员" },
    },
    {
      path: "/serviceManagement/customerManagement",
      name: "customerManagement",
      component: () => import("@/views/maintenance/customerManagement"),
      meta: { title: "客户管理" },
    },
    {
      path: "/serviceManagement/giveawayRewards",
      name: "giveawayRewards",
      component: () => import("@/views/maintenance/giveawayRewards"),
      meta: { title: "分佣奖励" },
      hidden:true
    },
    {
      path: "/serviceManagement/promotionTeam",
      name: "promotionTeam",
      component: () => import("@/views/maintenance/promotionTeam"),
      meta: { title: "推广团队" },
      hidden:true
    },
  ],
};
export default router;
