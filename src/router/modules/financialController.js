// 供应商管理
import Layout from "@/layout";

const router = {
  path: "/financialController",
  component: Layout,
  redirect: "/financialController",
  name: "financialController",
  meta: { title: "财务管理", icon: "el-icon-notebook-2" },
  children: [
    {
      path: "incomeExpenditrue",
      name: "incomeExpenditrue",
      component: () =>
        import("@/views/financialManagement/incomeExpenditrue.vue"),
      meta: { title: "收支明细" },
    },
  ],
};
export default router;
