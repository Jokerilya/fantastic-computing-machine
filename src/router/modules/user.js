// 供应商管理
import Layout from '@/layout';

const router = {
	path: '/user',
	component: Layout,
	redirect: '/user',
	name: 'User',
	meta: { title: '用户管理', icon: 'el-icon-user-solid' },
	children: [
		{
			path: 'user-list',
			name: 'UserList',
			component: () => import('@/views/user/user-list'),
			meta: { title: '用户列表', icon: 'el-icon-user' },
		},
		{
			path: 'agent-list',
			name: 'Agentist',
			component: () => import('@/views/user/agent-list'),
			meta: { title: '代理列表', icon: 'el-icon-suitcase' },
		},
		{
			path: 'level-list',
			name: 'LevelList',
			component: () => import('@/views/user/level-list'),
			meta: { title: '用户等级', icon: 'el-icon-medal-1' },
		},
		{
			path: 'detailed-list',
			name: 'DetailedList',
			hidden: true,
			component: () => import('@/views/user/detailed-list'),
			meta: { title: '账务明细' },
		},
		{
			path: 'bill-list',
			name: 'BillList',
			component: () => import('@/views/user/bill-list'),
			meta: { title: '账目列表', icon: 'el-icon-notebook-2' },
		},
		{
			path: 'withdrawal-list',
			name: 'WithdrawalList',
			component: () => import('@/views/user/withdrawal-list'),
			meta: { title: '提现记录', icon: 'el-icon-money' },
		},
		{
			path: 'team-list',
			name: 'TeamList',
			hidden: true,
			component: () => import('@/views/user/team-list'),
			meta: { title: '团队列表' },
		},
		{
			path: 'stock-list',
			name: 'StockList',
			hidden: true,
			component: () => import('@/views/user/stock-list'),
			meta: { title: '补货库存列表' },
		},
	],
};
export default router;
