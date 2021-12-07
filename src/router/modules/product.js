// 供应商管理
import Layout from '@/layout';

const router = {
	path: '/product',
	component: Layout,
	redirect: '/product',
	name: 'Product',
	meta: { title: '商品管理', icon: 'el-icon-s-goods' },
	children: [
		{
			path: 'product-list',
			name: 'ProductList',
			component: () => import('@/views/product/product-list'),
			meta: { title: '商品列表', icon: 'el-icon-goods' },
		},
		{
			path: 'product-detail',
			name: 'ProductDetail',
			hidden: true,
			component: () => import('@/views/product/product-detail'),
			meta: { title: '新增/编辑商品', icon: 'el-icon-goods' },
		},
		// {
		// 	path: 'agent-list',
		// 	name: 'AgentProductList',
		// 	component: () => import('@/views/product/agent-list'),
		// 	meta: { title: '代理商品列表', icon: 'el-icon-shopping-bag-1' },
		// },
		// {
		// 	path: 'agent-detail',
		// 	name: 'AgentProductDetail',
		// 	hidden: true,
		// 	component: () => import('@/views/product/agent-detail'),
		// 	meta: { title: '新增/编辑代理商品', icon: 'el-icon-goods' },
		// },
		{
			path: 'category-list',
			name: 'CategoryList',
			component: () => import('@/views/product/category-list'),
			meta: { title: '商品分类', icon: 'el-icon-present' },
		},
		{
			path: 'supplierList',
			name: 'SupplierList',
			component: () => import('@/views/product/supplierList'),
			meta: { title: '供应商管理', icon: 'el-icon-connection' },
		},
		{
			path: 'weixinindexproducttuijianList',
			name: 'weixinindexproducttuijianList',
			component: () => import('@/views/product/weixinindex-producttuijian/producttuijian'),
			meta: { title: '小程序首页商品推荐', icon: 'el-icon-sell' },
		},
		{
			path: 'dataCollect',
			name: 'dataCollect',
			component: () => import('@/views/product/data-collect'),
			meta: { title: '数据采集', icon: 'el-icon-document-checked' },
		},
		{
			path: 'updateproducttuijianList',
			name: 'updateproducttuijianList',
			component: () => import('@/views/product/weixinindex-producttuijian/update'),
			meta: { title: '更换小程序推荐商品', icon: 'el-icon-sell' },
			hidden:true
		},
		// {
		// 	path: 'cupboard-list',
		// 	name: 'CupboardList',
		// 	component: () => import('@/views/product/cupboard-list'),
		// 	meta: { title: '商品橱窗', icon: 'el-icon-monitor' },
		// },
		// {
		// 	path: 'comment-list',
		// 	name: 'CommentList',
		// 	component: () => import('@/views/product/comment-list'),
		// 	meta: { title: '商品评论', icon: 'el-icon-chat-dot-square' },
		// },
	],
};
export default router;
