// 供应商管理
import Layout from "@/layout";

const router = {
  path: "/school",
  component: Layout,
  redirect: "/school",
  name: "School",
  meta: { title: "商学院管理", icon: "el-icon-school" },
  children: [
    {
      path: "category",
      name: "Category",
      component: () => import("@/views/school/category"),
      meta: { title: "商学院类型", icon: "el-icon-pie-chart" }
    },
    {
      path: "list",
      name: "List",
      component: () => import("@/views/school/list"),
      meta: { title: "数据列表", icon: "el-icon-collection" }
    }
  ]
};
export default router;
