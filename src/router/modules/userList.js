import Layout from '@/layout';

const router = {
	path: '/user',
	component: Layout,
	redirect: '/user',
	name: 'User',
	meta: { title: '用户管理', icon: 'el-icon-user-solid' },
	children: [
		{
			path: 'userList',
			name: 'UserList',
			component: () => import('@/views/userList'),
			meta: { title: '用户列表', icon: 'el-icon-user' },
		}
	]
};
export default router;
