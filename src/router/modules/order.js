// 订单管理
import Layout from '@/layout';

const router = {
	path: '/order',
	component: Layout,
	redirect: '/order',
	name: 'Order',
	meta: { title: '订单管理', icon: 'el-icon-menu' },
	children: [
		{
			path: 'orderList',
			name: 'OrderList',
			component: () => import('@/views/order/orderList'),
			meta: { title: '订单列表', icon: 'el-icon-tickets' },
		},
		{
			path:'orderDetail',
			name:'OrderDetail',
			component: () => import('@/views/order/orderDetail'),
			meta: { title: '订单详情'},
			hidden:true
		},
		{
			path: 'serviceList',
			name: 'ServiceList',
			component: () => import('@/views/order/serviceList'),
			meta: { title: '售后列表', icon: 'el-icon-document-checked'},
		}
	],
};
export default router;