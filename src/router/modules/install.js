// 装机管理
import Layout from '@/layout';

const router = {
	path: '/install',
	component: Layout,
	redirect: '/install',
	name: 'Install',
	meta: { title: '装机管理', icon: 'el-icon-menu' },
	children: [
		{
			path: 'installList',
			name: 'InstallList',
			component: () => import('@/views/install/installList'),
			meta: { title: '装机列表', icon: 'el-icon-tickets' },
		},
		// {
		// 	path: 'installClassify',
		// 	name: 'InstallClassify',
		// 	component: () => import('@/views/install/installClassify'),
		// 	meta: { title: '配件分类', icon: 'el-icon-tickets' },
		// },
		{
			path: 'installEdit',
			name: 'InstallEdit',
			component: () => import('@/views/install/installEdit'),
			meta: { title: '添加/编辑装机', icon: 'el-icon-tickets' },
			hidden:true
		},
		{
			path: 'installModel',
			name: 'InstallModel',
			component: () => import('@/views/install/installModel'),
			meta: { title: '装机型号', icon: 'el-icon-s-open' },
		}
	],
};
export default router;