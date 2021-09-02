// 供应商管理
import Layout from '@/layout';

const router = {
	path: '/content',
	component: Layout,
	redirect: '/content',
	name: 'Content',
	meta: { title: '内容管理', icon: 'el-icon-s-flag' },
	children: [
		{
			path: 'notice',
			name: 'Notice',
			component: () => import('@/views/content/notice'),
			meta: { title: '资讯管理', icon: 'el-icon-data-board' },
		},
		{
			path: 'label',
			name: 'Label',
			component: () => import('@/views/content/label'),
			meta: { title: '意见反馈管理', icon: 'el-icon-price-tag' },
		},
		// {
		//   path: "help",
		//   name: "Help",
		//   component: () => import("@/views/content/help"),
		//   meta: { title: "帮助中心", icon: "el-icon-help" }
		// }
	],
};
export default router;
