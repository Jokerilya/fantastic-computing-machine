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
  ],
};
export default router;
