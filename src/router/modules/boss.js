// 招聘管理
import Layout from "@/layout";

const router = {
  path: "/boss",
  component: Layout,
  redirect: '/boss',
  name: "Boss",
  meta: { title: "招聘管理", icon: "el-icon-s-flag" },
  children: [
    {
      path: "queryResumeList",
      name: "queryResumeList",
      component: () => import("@/views/boss/queryResumeList"),
      meta: { title: "简历列表", icon: "el-icon-s-order" }
    },
    {
      path: "queryPostList",
      name: "queryPostList",
      component: () => import("@/views/boss/queryPostList"),
      meta: { title: "岗位列表", icon: "el-icon-s-cooperation" }
    },
    {
      path: "queryEnterpriseList",
      name: "queryEnterpriseList",
      component: () => import("@/views/boss/queryEnterpriseList"),
      meta: { title: "企业列表", icon: "el-icon-office-building" }
    },
    {
      path: "queryPositionType",
      name: "queryPositionType",
      component: () => import("@/views/boss/positiontypeList"),
      meta: { title: "职位类型列表", icon: "el-icon-data-analysis" }
    },
    {
      path: "companyType",
      name: "companyType",
      component: () => import("@/views/boss/companyType"),
      meta: { title: "公司认证类型", icon: "el-icon-notebook-1" }
    },
    {
      path: "companyWelfare",
      name: "companyWelfare",
      component: () => import("@/views/boss/companyWelfare"),
      meta: { title: "公司福利", icon: "el-icon-notebook-2" }
    },
  ]
};
export default router;
