// 师傅管理
import Layout from '@/layout';

const router = {
	path: '/masterManagement',
	component: Layout,
	redirect: '/masterManagement',
	name: 'masterManagement',
	meta: { title: '师傅管理', icon: 'el-icon-user' },
	children: [
    {
      path: "/maintenance/worker",
      name: "worker",
      component: () => import("@/views/maintenance/worker/worker.vue"),
      meta: { title: "师傅列表" },
    },
    {
      path: "/maintenance/worker/workerDetails",
      name: "workerDetails",
      component: () => import("@/views/maintenance/worker/workerDetails"),
      meta: { title: "师傅详情", noShow: "true" },
    },
    // 师傅考核
    {
      path: "/maintenance/examineItem",
      name: "examineItem",
      component: () => import("@/views/maintenance/examineItem"),
      meta: { title: "师傅考核" },
    },
    {
      path: "/maintenance/examineRecord",
      name: "examineRecord",
      component: () => import("@/views/maintenance/examineRecord"),
      meta: { title: "师傅考核记录" },
      hidden:true
    },
     {
      path: "/maintenance/purse/purseDetails",
      name: "purseDetails",
      component: () => import("@/views/maintenance/purse/purseDetails.vue"),
      meta: { title: "钱包明细" },
    },
    {
      path: "/withdrawalManagement/index",
      name: "withdrawalManagementIndex",
      component: () => import("@/views/withdrawalManagement/index"),
      meta: { title: "提现明细" },
    },
     {
      path: "/maintenance/insuranceManage",
      name: "insuranceManage",
      component: () => import("@/views/maintenance/insuranceModule/index.vue"),
      meta: { title: "保险明细" },
    },
	],
};
export default router;