// 提现管理
import Layout from "@/layout";

const router = {
  path: "/withdrawalManagement",
  component: Layout,
  redirect: "/withdrawalManagement",
  name: "WithdrawalManagement",
  meta: { title: "提现管理", icon: "el-icon-notebook-1" },
  children: [
    {
      path: "/withdrawalManagement/index",
      name: "withdrawalManagementIndex",
      component: () => import("@/views/withdrawalManagement/index"),
      meta: { title: "提现明细" },
    },
  ],
};
export default router;
