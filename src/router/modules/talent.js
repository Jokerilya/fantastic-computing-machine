// 供应商管理
import Layout from "@/layout";

const router = {
  path: "/talent",
  component: Layout,
  redirect: '/talent',
  name: "Talent",
  meta: { title: "人才管理", icon: "el-icon-user-solid" },
  children: [
    {
      path: "editPartnerlInfo/list",
      name: "editPartnerlInfo",
      component: () => import("@/views/talent/editPartnerlInfo/list"),
      meta: { title: "学院/企业列表", icon: "el-icon-school" }
    },
    {
      path: "editPartnerlInfo/detail",
      name: "editPartnerlDetail",
      hidden:true,
      component: () => import("@/views/talent/editPartnerlInfo/detail"),
      meta: { title: "新增/编辑(学院/企业)列表", icon: "el-icon-star-on" }
    },
    {
      path: "personinfo/list",
      name: "personList",
      component: () => import("@/views/talent/personInfo/list"),
      meta: { title: "人才精英列表", icon: "el-icon-cpu" }
    },
    {
      path: "personInfo/detail",
      name: "personInfoDetail",
      hidden:true,
      component: () => import("@/views/talent/personInfo/detail"),
      meta: { title: "新增/编辑精英列表", icon: "el-icon-star-on" }
    },
    {
      path: "offlineapply/list",
      name: "offlineapplyList",
      component: () => import("@/views/talent/OfflineApply"),
      meta: { title: "线下培训报名列表", icon: "el-icon-postcard" }
    },
    {
      path: "offlinetraining/list",
      name: "offlinetrainingList",
      component: () => import("@/views/talent/OfflineTraining"),
      meta: { title: "线下培训列表", icon: "el-icon-bangzhu" }
    },
    {
      path: "offlinetraining/detail",
      name: "offlinetrainingDetail",
      hidden:true,
      component: () => import("@/views/talent/OfflineTraining/detail"),
      meta: { title: "新增/编辑线下培训列表", icon: "el-icon-star-on" }
    },
  ]
};
export default router;
