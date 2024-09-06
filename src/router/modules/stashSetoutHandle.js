// 仓库代处理管理
import Layout from '@/layout';

const router = {
	path: '/stashSetoutHandle',
	component: Layout,
	redirect: '/stashSetoutHandle',
	name: 'StashSetoutHandle',
	meta: { title: '仓库代处理', icon: 'el-icon-house' },
	children: [
		{
			path: 'stashSetoutHandleFn',
			name: 'stashSetoutHandleFn',
			component: () => import('@/views/stashSetoutHandle/index'),
			meta: { title: '仓库代处理', icon: 'el-icon-house' },
		},
	],
};

export default router;
