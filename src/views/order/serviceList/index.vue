<template>
	<div class="app-container">
		<div class="manage-top">
			<el-form :model="queryData" ref="ruleForm" label-width="88px" class="rule-form" label-position="right">
				<el-row :gutter="20">
					<el-col :span="5">
						<el-form-item label="订单类型">
							<el-select v-model="queryData.orderType" placeholder="请选择" style="width: 100%;">
								<el-option v-for="item in orderTypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="订单状态">
							<el-select v-model="queryData.status" placeholder="请选择" style="width: 100%;">
								<el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="提交时间">
							<el-date-picker v-model="queryData.queryTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker style="width:100%">
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<!-- <el-col :span="5">
						<el-form-item label="订单编号">
							<el-input v-model="queryData.orderSn" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="用户手机号">
							<el-input v-model="queryData.phone" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="用户昵称">
							<el-input v-model="queryData.userName" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col> -->
					<el-form-item>
						<el-col>
							<el-button type="primary" icon="el-icon-search" @click="getDataListFn">查询</el-button>
							<el-button type="danger" @click="resSetQueryFn">重置</el-button>
						</el-col>
					</el-form-item>
					
				</el-row>
			</el-form>
		</div>
		<!--  -->
		<div style="height: 16px;"></div>
		<div class="manage-table">
			<el-table ref="multipleTable" :data="dataList" v-loading="dataConfig.loading" @selection-change="handleSelectionChange"  style="width: 100%">
				<!-- <el-table-column type="selection" width="60"></el-table-column> -->
				<el-table-column label="订单编号" width="150" align="center">
					<template slot-scope="scope">
						{{scope.row.orderSn || scope.row.orderId}}
					</template>
				</el-table-column>
				<el-table-column prop="nickName" label="用户昵称" width="160" align="center"></el-table-column>
				<!-- <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column> -->
				<el-table-column label="订单类型" width="150" align="center">
					<template slot-scope="scope">
						<span style="color: #409EFF;" v-if="scope.row.orderType === 1">星选</span>
						<span style="color: #67C23A;" v-if="scope.row.orderType === 2">拼团</span>
						<span style="color: chocolate;" v-if="scope.row.orderType === 3">装机</span>
					 </template>
				</el-table-column>
				<el-table-column label="商品名称" width="150" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.title}}</span>
					 </template>
				</el-table-column>
				<el-table-column label="商品规格" width="150" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span>{{scope.row.skuName}}</span>
					 </template>
				</el-table-column>
				<el-table-column prop="refundMoney" label="退款金额" width="140" align="center"></el-table-column>
				<el-table-column label="退款状态" width="100" align="center">
					<template slot-scope="scope">
						<el-tag type="info" v-if="scope.row.status === 0">已取消</el-tag>
						<el-tag v-if="scope.row.status === 1">待审核</el-tag>
						<el-tag type="success" v-if="scope.row.status === 2">审核通过</el-tag>
						<el-tag type="danger" v-if="scope.row.status === 3">审核失败</el-tag>
					 </template>
				</el-table-column>
				<el-table-column label="提交时间" width="180" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.createTime}}</span>
					 </template>
				</el-table-column>
				<el-table-column label="退款原因" width="150" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.refundReason}}</span>
					 </template>
				</el-table-column>
				<el-table-column label="处理时间" width="180" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.examineTime}}</span>
					 </template>
				</el-table-column>
				<el-table-column label="操作" width="190" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button size="mini" type="infor" @click="detailFn(scope.row.id)">查看详情</el-button>
						<el-button size="mini" type="primary" @click="refundCheckHandle(scope.row.id)" v-if="scope.row.status === 1">退款审核</el-button>
					 </template>
				</el-table-column>
			</el-table>
		</div>
		<!--  -->
		<div style="height: 16px;"></div>
		<div class="table-block" v-show="dataList.length > 0">
			<el-pagination background @size-change="handleSizeChange" @current-change="currentChangeFn" :current-page.sync="dataConfig.pageNo" :page-size="dataConfig.pageSize" :page-sizes="[20, 30, 50, 100]" layout="total,sizes, prev, pager, next" :total="dataConfig.total">
			</el-pagination>
		</div>
		<!--  -->
		<el-dialog title="订单详情" :visible.sync="dialogVisible" width="1050px" :close-on-click-modal="false">
			<div class="order-detail-step">
				<el-steps :active="step" process-status="finish" align-center>
					<el-step title="提交订单" :description="details.createTime"></el-step>
					<el-step title="支付订单" :description="details.payTime"></el-step>
					<el-step title="平台发货" :description="details.shipTime"></el-step>
					<el-step title="确认收货" :description="details.confirmTime"></el-step>
				</el-steps>
			</div>
			<div style="height:20px"></div>
			<div class="order-status">
				<div class="order-status-left">
					订单状态：
					<span v-if="details.status === -1">已取消</span>
					<span v-if="details.status === -10">已退款</span>
					<span v-if="details.status === 0">待支付</span>
					<span v-if="details.status === 5">待发货</span>
					<span v-if="details.status === 10">已发货</span>
					<span v-if="details.status === 20">已完成</span>
				</div>
				<div class="order-status-right">
					<el-button type="primary" size="medium">修改收货人信息</el-button>
					<el-button type="primary" size="medium">修改收费信息</el-button>
					<el-button type="danger" size="medium">关闭订单</el-button>
				</div>
			</div>
			<div class="order-info">
				<div class="order-info-title"><span>基本信息</span></div>
				<el-table :data="orderInfo" style="width: 100%" border size="mini" :header-cell-style="{background:'#eee',color:'#454545'}">
				    <el-table-column prop="orderSn" label="订单编号" width="180" align="center"></el-table-column>
				    <el-table-column prop="phone" label="手机号" width="180" align="center"></el-table-column>
				    <el-table-column label="订单类型" width="120" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.orderType === 1">星选</span>
							<span v-if="scope.row.orderType === 2">拼团</span>
							<span v-if="scope.row.orderType === 3">装机</span>
						</template>
					</el-table-column>
				    <el-table-column label="订单状态" width="120" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.status === -1">已取消</span>
							<span v-if="scope.row.status === -10">已退款</span>
							<span v-if="scope.row.status === 0">待支付</span>
							<span v-if="scope.row.status === 5">待发货</span>
							<span v-if="scope.row.status === 10">已发货</span>
							<span v-if="scope.row.status === 20">已完成</span>
						</template>
					</el-table-column>
				    <el-table-column label="配送方式" width="120" align="center">
						<template slot-scope="scope">
							<span v-if="details.expNo">物流配送</span>
							<span v-else>未发货</span>
						</template>
					</el-table-column>
				    <el-table-column prop="date" label="物流单号" align="center">
						<template slot-scope="scope">
							<span v-if="details.expNo">物流配送</span>
							<span v-else>未发货</span>
						</template>
					</el-table-column>
				</el-table>
				<!--  -->
				<div class="order-info-title"><span>收货人信息</span></div>
				<el-table :data="expDetail" style="width: 100%" border size="mini" :header-cell-style="{background:'#eee',color:'#454545'}">
				    <el-table-column prop="receiver" label="收货人" align="center"></el-table-column>
				    <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
				    <el-table-column prop="addressDetail" label="收货地址" align="center"></el-table-column>
				</el-table>
				<!--  -->
				<div class="order-info-title"><span>商品信息</span></div>
				<el-table :data="details.list" style="width: 100%" border size="mini" :header-cell-style="{background:'#eee',color:'#454545'}">
				    <el-table-column prop="productName" label="商品" align="center"></el-table-column>
				    <el-table-column prop="skuName" label="规格" align="center"></el-table-column>
				    <el-table-column prop="quantity" label="数量" align="center"></el-table-column>
				    <el-table-column prop="price" label="小计" align="center">
						<template slot-scope="scope">
							<span>￥{{scope.row.price}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div style="display: flex;justify-content: flex-end;padding: 8px 0;">
					<span style="flex: 0 0 25%;text-align: center;">合计：<span style="color: red;">￥{{priceSum.toFixed(2) || 0}}</span></span>
				</div>
				<!--  -->
				<div class="order-info-title"><span>费用信息</span></div>
				<el-table :data="costInfo" style="width: 100%" border size="mini" :header-cell-style="{background:'#eee',color:'#454545'}">
				    <el-table-column prop="priceSum" label="商品合计" align="center"></el-table-column>
				    <el-table-column prop="expMoney" label="运费" align="center"></el-table-column>
				    <el-table-column prop="coupon" label="优惠券" align="center"></el-table-column>
				    <el-table-column prop="totalAmount" label="应付金额" align="center"></el-table-column>
				</el-table>
			</div>
		</el-dialog>
		<el-dialog title="退款审核" :visible.sync="refundCheckVisible" width="600px">
			<el-form label-width="90px">
				<el-form-item label="审核选项">
					<el-radio-group v-model="refundCheckIndex">
						<el-radio :label="item.id" v-for="item in refundCheckOptions" :key="item.id">{{item.value}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核原因">
					<el-input v-model="refundCheckReason" placeholder="请填写审核原因" type="textarea" :rows="3" resize="none"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="refundCheckVisible = false">取 消</el-button>
				<el-button type="primary" @click="refundCheckConfirm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {queryOrderRefund,getOrderDetailFn,handleOrderExamineFn} from "@/api/order.js";
	export default{
		data(){
			return{
				dataList: [],
				handleSelectionList:[], 
				dataConfig: {
					pageNo: 1,
					pageSize: 20,
					total: 0,
					loading: true,
				},
				queryData:{
					orderType:'',  // 订单类型
					status:'' , // 订单状态：-1-已取消 -10已退款 0-待支付 5-已审核 待发货 10-已发货 20交易完成
					queryTime:'',
					orderSn:'',
					phone:'',
					userName:''
				},
				orderTypeOptions:[
					{id:1,name:'装机'},
					{id:2,name:'拼团'},
					{id:3,name:'星选'}
				],
				statusOptions:[
					{id:-1,name:'已取消'},
					{id:-10,name:'已退款'},
					{id:0,name:'待支付'},
					{id:5,name:'待发货'},
					{id:10,name:'已发货'},
					{id:20,name:'交易完成'}
				],
				// 订单详情信息
				dialogVisible:false,
				step:0,
				details:{},
				orderInfo:[],
				expDetail:[],
				costInfo:[],
				priceSum:0,
				// 订单审核
				refundCheckVisible:false,
				refundCheckId:'',
				refundCheckOptions:[
					{value:'同意',id:2},
					{value:'拒绝',id:3},
				],
				refundCheckIndex:2,
				refundCheckReason:'',
			}
		},
		created() {
			this.getDataListFn()
		},
		methods:{
			// 选中的列表数据
			handleSelectionChange(val){
				this.handleSelectionList = val
			},
			async getDataListFn() {
				this.dataConfig.loading = true
				const res = await queryOrderRefund({
					pageNo: this.dataConfig.pageNo,
					pageSize: this.dataConfig.pageSize,
					phone: this.queryData.phone || undefined,
					status: this.queryData.status,
					orderSn: this.queryData.orderSn || undefined,
					orderType:this.queryData.orderType || undefined ,
					queryTime:this.queryData.queryTime.length === 0 ? "" : this.queryData.queryTime[0] + "/" + this.queryData.queryTime[1],
				})
				const resData = this.resDataFn(res);
				this.dataConfig.total = resData.total;
				this.dataList.splice(0, this.dataList.length, ...resData.records);
			},
			handleSizeChange(val) {
				this.dataConfig.pageSize = val
				this.getDataListFn()
			},
			currentChangeFn(pageNo) {
				this.dataConfig.pageNo = pageNo
				this.getDataListFn()
			},
			queryDataFn() {
				this.dataConfig.pageNo = 1
				this.dataConfig.pageSize = 20
				this.getDataListFn()
			},
			resSetQueryFn() {
				this.dataConfig.pageNo = 1
				this.dataConfig.pageSize = 20
				this.queryData = {
					deliveryType:'',
					status:'' ,
					queryTime:'',
					orderSn:'',
					phone:'',
					userName:''
				}
				this.getDataListFn()
			},
			// 审核退款
			refundCheckHandle(id){
				this.refundCheckId = id
				this.refundCheckVisible = true
			},
			// 审核
			async refundCheckConfirm(){
				// const loading = this.$loading()
				if(!this.refundCheckReason){
					this.$message.error('请输入审核原因');
					return
				}
				const res = await handleOrderExamineFn({
					id:this.refundCheckId,
					remark:this.refundCheckReason,
					status:this.refundCheckIndex
				})
				if(res.code === '000'){
					this.refundCheckVisible = false
					this.$message({
						message: '操作成功！',
						type: 'success'
					});
					this.getDataListFn()
				}
				if(res.code === '001') {
					this.refundCheckVisible = false
				}
				// loading.close()
			},
			// 查看订单详情
			async detailFn(id){
				this.step = 0
				this.orderInfo = []
				this.expDetail = []
				this.priceSum = 0
				this.costInfo = []
				// this.$router.push({name:'OrderDetail'})
				const res = await getOrderDetailFn({
					id
				})
				if(res.code === '000'){
					this.dialogVisible = true
					this.details = res.data
					if(this.details.payTime) this.step = 1
					if(this.details.shipTime) this.step = 2
					if(this.details.confirmTime) this.step = 3
					this.orderInfo.push({
						orderSn:this.details.orderSn,
						phone:this.details.phone,
						orderType:this.details.orderType,
						status:this.details.status,
						expNo:this.details.expNo
					})
					this.expDetail.push({
						receiver:this.details.expDetail.receiver,
						phone:this.details.expDetail.phone,
						addressDetail:this.details.expDetail.addressDetail
					})
					let priceSum = 0,numSum=0
					this.details.list.forEach(item=>{
						this.priceSum += item.price
					})
					this.costInfo.push({
						priceSum:this.priceSum,
						expMoney:0,  // 运费
						coupon:0,
						totalAmount:this.details.totalAmount
					})
				}
			}
		}
	}
</script>

<style>
/*  */
.order-status{display: flex;align-items: center;justify-content: space-between;padding: 10px 0;border-top: 1px solid #f5f5f5;border-bottom: 1px solid #F5F5F5;}
.order-status-left{}
.order-status-left span{color: red;}
.order-status-right{}
.order-info{}
.order-info-title{margin: 16px 0;}
.order-info-title span{font-size: 14px;font-weight: bold;color: #409EFF;}
</style>
