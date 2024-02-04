// 供应商管理
import Layout from '@/layout';

const systemRouter = {
	path: '/system',
	component: Layout,
	redirect: '/system',
	name: 'System',
	meta: { title: '系统管理', icon: 'el-icon-s-tools' },
	children: [
		{
			path: 'agreement',
			name: 'Agreement',
			component: () => import('@/views/system/agreement'),
			meta: { title: '系统说明', icon: 'el-icon-document' },
		},
		{
			path: 'exp',
			name: 'Exp',
			component: () => import('@/views/system/exp'),
			meta: { title: '运费模板', icon: 'el-icon-truck' }
		},
		{
			path: 'base-logList',
			name: 'BaseLogList',
			component: () => import('@/views/system/base-logList'),
			meta: { title: '系统日志', icon: 'el-icon-tickets' },
		},
		{
			path: 'setup-menu',
			name: 'SetupMenu',
			component: () => import('@/views/system/setup-menu'),
			meta: { title: '菜单管理', icon: 'el-icon-s-operation' },
		},
		{
			path: 'setup-role',
			name: 'SetupRole',
			component: () => import('@/views/system/setup-role'),
			meta: { title: '后台角色管理', icon: 'el-icon-coordinate' },
		},
		{
			path: 'base-info',
			name: 'BaseInfo',
			component: () => import('@/views/system/base-info'),
			meta: { title: '系统参数配置', icon: 'el-icon-c-scale-to-original' },
		},
		{
			path: 'setup-operator',
			name: 'SetupOperator',
			component: () => import('@/views/system/setup-operator'),
			meta: { title: '后台操作员管理', icon: 'el-icon-user' },
		},
		// {
		// 	path: 'app-version',
		// 	name: 'AppVersion',
		// 	component: () => import('@/views/system/app-version'),
		// 	meta: { title: 'App版本管理', icon: 'el-icon-mobile-phone' },
		// },
		
		{
			path: 'masterLvManage',
			name: 'masterLvManage',
			component: () => import('@/views/system/masterLvManage'),
			meta: { title: '师傅等级管理', icon: 'el-icon-trophy' }
		},
		{
			path: 'faultItemsExamine',
			name: 'faultItemsExamine',
			component: () => import('@/views/system/faultItemsExamine'),
			meta: { title: '故障项目管理', icon: 'el-icon-setting' }
		},
		{
			path: 'faultyPricingCount',
			name: 'faultyPricingCount',
			component: () => import('@/views/system/faultyPricingCount'),
			meta: { title: '故障项定价统计', icon: 'el-icon-setting' }
		}
	],
};
export default systemRouter;
