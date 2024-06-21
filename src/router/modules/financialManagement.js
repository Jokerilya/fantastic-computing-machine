// 财务管理
import Layout from "@/layout";

const router = {
  path: "/financialManagement",
  component: Layout,
  redirect: "/financialManagement",
  name: "FinancialManagement",
  meta: { title: "财务管理", icon: "el-icon-notebook-1" },
  children: [
    {
      path: "/financialManagement/incomeExpenditrue",
      name: "workerDetails",
      component: () => import("@/views/financialManagement/incomeExpenditrue"),
      meta: { title: "收支明细" },
    },
  ],
};
export default router;
