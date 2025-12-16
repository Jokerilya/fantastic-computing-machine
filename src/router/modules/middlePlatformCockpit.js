import Layout from "@/layout";

const router = {
  path: "/middlePlatformCockpit",
  component: Layout,
  redirect: "/middlePlatformCockpit",
  name: "MiddlePlatformCockpit",
  meta: { title: "中台驾驶舱", icon: "el-icon-data-analysis" },
  children: [
    {
      path: "middlePlatformCockpit",
      name: "middlePlatformCockpit",
      component: () => import("@/views/middlePlatformCockpit/index"),
      meta: { title: "中台驾驶舱", icon: "el-icon-data-analysis" },
    },
  ],
};
export default router;
