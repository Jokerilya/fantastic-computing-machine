// 发票管理
import Layout from "@/layout";

const router = {
  path: "/invoiceManagement",
  component: Layout,
  redirect: "/invoiceManagement",
  name: "InvoiceManagement",
  meta: { title: "发票管理", icon: "el-icon-notebook-2" },
  children: [
    {
      path: "/invoiceManagement/invoiceList",
      name: "workerDetails",
      component: () => import("@/views/invoiceManagement/invoiceList"),
      meta: { title: "发票明细" },
    },
  ],
};
export default router;
