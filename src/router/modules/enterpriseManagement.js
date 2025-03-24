// 企业管理
import Layout from '@/layout';

const router = {
	path: '/enterpriseManagement',
	component: Layout,
	redirect: '/enterpriseManagement',
	name: 'enterpriseManagement',
	meta: { title: '企业管理', icon: 'el-icon-office-building' },
	children: [
    {
      path: "/maintenance/enterpriseList",
      name: "enterpriseList",
      component: () => import("@/views/maintenance/enterpriseList"),
      meta: { title: "企业列表" },
    },
    {
			path: 'enterpriseWechat',
			name: 'enterpriseWechat',
			component: () => import('@/views/system/enterpriseWechat'),
			meta: { title: '关联微群' }
		},
  ],
};
export default router;