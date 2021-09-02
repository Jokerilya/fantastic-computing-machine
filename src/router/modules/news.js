// 供应商管理
import Layout from "@/layout";

const router = {
  path: "/news",
  component: Layout,
  redirect: "/news",
  name: "News",
  meta: { title: "新闻资讯", icon: "el-icon-mouse" },
  children: [
    {
      path: "news",
      name: "NewsList",
      component: () => import("@/views/news"),
      meta: { title: "新闻资讯", icon: "el-icon-reading" }
    },
  ]
};
export default router;
