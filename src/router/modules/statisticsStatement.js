import Layout from "@/layout";

const router = {
    path: "/statisticsStatement",
    component: Layout,
    redirect: "/statisticsStatement",
    name: "StatisticsStatement",
    meta: { title: "统计报表", icon: "el-icon-data-line" },
    children: [
      {
        path: "statisticsStatement",
        name: "statisticsStatement",
        component: () => import("@/views/statisticsStatement/index"),
        meta: { title: "统计报表", icon: "el-icon-data-line" },
      },
    ],
  };
  export default router;