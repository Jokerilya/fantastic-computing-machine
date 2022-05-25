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
					<el-col :span="5">
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
					</el-col>
					<el-col :span="5">
						<el-button type="primary" icon="el-icon-search" @click="getDataListFn">查询</el-button>
						<el-button type="danger" icon="el-icon-refresh" @click="resSetQueryFn">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<!--  -->
		<div style="height: 16px;"></div>
		<div class="manage-table">
			<el-table ref="multipleTable" :data="dataList" v-loading="dataConfig.loading" @selection-change="handleSelectionChange"  style="width: 100%">
				<!-- <el-table-column type="selection" width="60"></el-table-column> -->
				<el-table-column prop="orderSn" label="订单编号" width="200" align="center"></el-table-column>
				<el-table-column prop="userName" label="昵称" width="220" align="center"></el-table-column>
				<el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
				<el-table-column label="订单类型" width="150" align="center">
					<template slot-scope="scope">
						<span style="color: #409EFF;" v-if="scope.row.orderType === 1">星选</span>
						<span style="color: #67C23A;" v-if="scope.row.orderType === 2">拼团</span>
						<span style="color: chocolate;" v-if="scope.row.orderType === 3">装机</span>
					 </template>
				</el-table-column>
				<el-table-column label="商品数量" width="150" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span>{{scope.row.totalQty}}</span>
					 </template>
				</el-table-column>
				<el-table-column prop="payAmount" label="订单金额" width="140" align="center"></el-table-column>
				<el-table-column label="订单状态" width="100" align="center">
					<template slot-scope="scope">
						<el-tag type="info" v-if="scope.row.status === -1">已取消</el-tag>
						<el-tag type="info" v-if="scope.row.status === -10">已退款</el-tag>
						<el-tag type="warning" v-if="scope.row.status === 0">待支付</el-tag>
						<el-tag type="danger" v-if="scope.row.status === 5">待发货</el-tag>
						<el-tag v-if="scope.row.status === 10">已发货</el-tag>
						<el-tag type="success" v-if="scope.row.status === 15">已完成</el-tag>
					 </template>
				</el-table-column>
				<el-table-column label="下单时间" width="180" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.createTime}}</span>
					 </template>
				</el-table-column>
				<el-table-column label="支付时间" width="180" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.payTime}}</span>
					 </template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="detailFn(scope.row.id)">查看详情</el-button>
						<el-button size="mini" type="success" v-if="scope.row.orderType === 3 && scope.row.status === 0">汇款信息</el-button>
						<el-button size="mini" type="success" v-if="scope.row.orderType !== 3 && scope.row.status === 5" style="min-width: 80px;" @click="detailFn(scope.row.id)">去发货</el-button>
						<el-button size="mini" type="infor" v-if="scope.row.status > 5" @click="orderHandle(3,scope.row.id)">物流信息</el-button>
						<el-button size="mini" type="infor" v-if="scope.row.orderType !== 3 && scope.row.status === 0">关闭订单</el-button>
						<!-- <el-button size="mini" type="danger" v-if="scope.row.status === -1">删除订单</el-button> -->
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
					<span v-if="details.status === 15">已完成</span>
				</div>
				<div class="order-status-right">
					<el-button type="primary" size="medium" @click="orderHandle(0)" v-if="details.status >= 0 && details.status <=5">修改收货人信息</el-button>
					<el-button type="primary" size="medium" @click="orderHandle(1)" v-if="details.orderType === 3">汇款信息</el-button>
					<el-button type="primary" size="medium" @click="orderHandle(2)" v-if="details.status > 0 && details.status <=5">发货</el-button>
					<el-button type="primary" size="medium" @click="orderHandle(3)" v-if="details.status > 5">物流信息</el-button>
					<!-- <el-button type="primary" size="medium">修改收费信息</el-button> -->
					<!-- <el-button type="danger" size="medium">关闭订单</el-button> -->
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
							<span v-if="scope.row.status === 15">已完成</span>
						</template>
					</el-table-column>
				    <el-table-column label="配送方式" width="120" align="center">
						<template slot-scope="scope">
							<span v-if="details.expDetail.expNo">物流配送</span>
							<span v-else>无</span>
						</template>
					</el-table-column>
				    <el-table-column prop="date" label="物流单号" align="center">
						<template slot-scope="scope">
							<span v-if="details.expDetail.expNo">{{details.expDetail.expNo}}</span>
							<span v-else>无</span>
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
					<span style="flex: 0 25% 0;text-align: center;">合计：<span style="color: red;">￥{{priceSum.toFixed(2) || 0}}</span></span>
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
		<!--  -->
		<el-dialog title="修改收货信息" :visible.sync="dialogEditVisible" width="500px">
			<el-form :model="addressForm" label-width="80px" :rules="addressFormRule" ref="addressForm">
				<el-form-item label="收货人" prop="receiver">
					<el-input v-model="addressForm.receiver" type="text" placeholder="请输入收货人姓名"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="addressForm.phone" type="text" maxlength="11" placeholder="请输入收货人手机号"></el-input>
				</el-form-item>
				<el-form-item label="收货地区" prop="pca">
					<el-cascader v-if="dialogEditVisible" v-model="addressForm.pca" :props="props" style="width: 100%;"></el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="addressDetail">
					<el-input v-model="addressForm.addressDetail" type="textarea" placeholder="请输入详细地址" rows="3" resize="none"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogEditVisible = false">取 消</el-button>
				<el-button type="primary" @click="addressEditTap('addressForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!--  -->
		<el-dialog title="线下打款信息" :visible.sync="dialogPayVisible" width="500px">
			<el-form label-width="100px" >
				<el-form-item label="打款人姓名" prop="receiver">
					<span>{{details.payName || '无'}}</span>
				</el-form-item>
				<el-form-item label="打款人账号" prop="phone">
					<span>{{details.payBankCode || '无'}}</span>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--  -->
		<el-dialog title="订单发货" :visible.sync="dialogSendVisible" width="500px">
			<el-form :model="sendForm" label-width="80px" :rules="sendFormRule" ref="sendForm">
				<el-form-item label="物流公司" prop="expId">
					<el-select v-model="sendForm.expId" filterable placeholder="请选择" style="width: 100%;">
					    <el-option v-for="item in sendOptions" :key="item.id" :label="item.expName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="物流单号" prop="expNo">
					<el-input v-model="sendForm.expNo" type="text" placeholder="请输入物流单号"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogSendVisible = false">取 消</el-button>
				<el-button type="primary" @click="sendHandle('sendForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!--  -->
		<el-dialog title="物流信息" :visible.sync="dialogExpVisible" width="700px">
			<div class="exp-title">
				<p>{{expInfo.expName}}<span>{{expInfo.expNo}}</span></p>
			</div>
			<el-timeline v-if="expInfo.list.length > 0">
			    <el-timeline-item v-for="(item, index) in expInfo.list" :key="index" :timestamp="item.time">
					{{item.remark}}
			    </el-timeline-item>
			</el-timeline>
			<div v-else style="text-align: center;padding: 30px 0;">
				<span>暂无物流信息</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {queryOrderFn,getOrderDetailFn,updateOrderReceiptInfo,queryOrderBasicFn,handleOrderSendFn,getOrderExp} from "@/api/order.js";
	import {addressFn} from "@/api/system.js";
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
					status:'' , // 订单状态：-1-已取消 -10已退款 0-待支付 5-已审核 待发货 10-已发货 15交易完成
					queryTime:'',
					orderSn:'',
					phone:'',
					userName:''
				},
				orderTypeOptions:[
					{id:1,name:'星选'},
					{id:2,name:'拼团'},
					{id:3,name:'装机'}
				],
				statusOptions:[
					{id:-1,name:'已取消'},
					{id:-10,name:'已退款'},
					{id:0,name:'待支付'},
					{id:5,name:'待发货'},
					{id:10,name:'已发货'},
					{id:15,name:'交易完成'}
				],
				// 订单详情信息
				id:'',
				dialogVisible:false,
				step:0,
				details:{
					expDetail:{}
				},
				orderInfo:[],
				expDetail:[],
				costInfo:[],
				priceSum:0,
				// 修改收货信息
				dialogEditVisible:false,
				addressForm:{
					receiver:'',
					phone:'',
					pca:[],
					addressDetail:'',
				},
				addressFormRule:{
					receiver:[
						{ required: true, message: '请输入收货人信息', trigger: 'blur' }
					],
					phone:[
						{ required: true, message: '请输入收货人手机号', trigger: 'blur' }
					],
					pca:[
						{ required: true, message: '请选择收货地址', trigger: 'blur' }
					],
					addressDetail:[
						{ required: true, message: '请输入详细地址', trigger: 'blur' }
					]
				},
				props: {
					lazy: true,
					lazyLoad: async (node, resolve)=> {
						const { level } = node;
						// 处理回显
						if (!this.addressForm.pca.length) {
							this.addressForm.pca = await this.getAddressInfo()
						}
						let pid = node.data ? node.data.value : undefined
						addressFn({pid}).then(res=>{
							const nodes = res.data.map(item => ({
								value: item.id,
								label: item.name,
								leaf: level >= 2
							}));
							// 通过调用resolve将子节点数据返回，通知组件数据加载完成
							resolve(nodes);
						})
					}
				},
				// 打款信息
				dialogPayVisible:false,
				// 发货
				dialogSendVisible:false,
				sendForm:{
					expId:'',
					expNo:'',
				},
				sendFormRule:{
					expId:[
						{ required: true, message: '请选择物流公司', trigger: 'blur' }
					],
					expNo:[
						{ required: true, message: '请输入物流单号', trigger: 'blur' }
					]
				},
				sendOptions:[],
				/*  */
				dialogExpVisible:false,
				expInfo:{
					list:[]
				}
			}
		},
		created() {
			this.getDataListFn()
		},
		methods:{
			// 处理地址数据回显
			getAddressInfo(){
				return new Promise((resolve, reject)=>{
					setTimeout(()=>{
						resolve([this.details.expDetail.proId+'',this.details.expDetail.cityId+'',this.details.expDetail.areaId+'']);
					}, 0);
				});
			},
			// 快递公司列表查询
			async queryOrderBasicFn(){
				const res = await queryOrderBasicFn()
				if(res.code === '000'){
					this.sendOptions = res.data
				}
			},
			// 选中的列表数据
			handleSelectionChange(val){
				this.handleSelectionList = val
			},
			async getDataListFn() {
				this.dataConfig.loading = true
				const res = await queryOrderFn({
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
			// 查看订单详情
			async detailFn(id){
				this.id = id
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
						addressDetail:this.details.expDetail.addrPrefix + this.details.expDetail.addressDetail
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
			},
			// 订单操作
			async orderHandle(e,id){
				// e: 0修改收货人信息 1汇款信息 2发货 3物流信息
				if(e === 0){
					this.dialogEditVisible = true
					this.addressForm.receiver = this.details.expDetail.receiver,
					this.addressForm.phone = this.details.expDetail.phone,
					this.addressForm.addressDetail= this.details.expDetail.addressDetail
				}else if(e === 1){
					this.dialogPayVisible = true
				}else if(e === 2){
					await this.queryOrderBasicFn()
					this.dialogSendVisible = true
				}else{
					// this.$message({
					// 	message:'物流信息'
					// })
					this.getOrderExp(id || this.id)
				}
			},
			// 提交收货人信息修改
			async addressEditTap(formName){
				this.$refs[formName].validate(async (valid) => {
					if(!valid){
						return
					}else{
						const loading = this.$loading()
						const res = await updateOrderReceiptInfo({
							receiver:this.addressForm.receiver,
							phone:this.addressForm.phone,
							proId:this.addressForm.pca[0],
							cityId:this.addressForm.pca[1],
							areaId:this.addressForm.pca[2],
							addressDetail:this.addressForm.addressDetail,
							orderCode:this.details.orderSn
						})
						if(res.code === '000'){
							this.dialogEditVisible = false
							this.$message({
								message: '操作成功！',
								type: 'success'
							});
							this.detailFn(this.id)
						}
						loading.close()
					}
				});
			},
			// 发货操作
			async sendHandle(formName){
				this.$refs[formName].validate(async (valid) => {
					if(!valid){
						return
					}else{
						const res  = await handleOrderSendFn({
							expId:this.sendForm.expId,
							expNo:this.sendForm.expNo,
							id:this.id
						})
						if(res.code === '000'){
							this.dialogSendVisible = false
							this.$message({
								message: '操作成功！',
								type: 'success'
							});
							this.detailFn(this.id)
						}
					}
				})
			},
			// 查看物流详情
			async getOrderExp(orderId){
				const res = await getOrderExp({
					orderId
				})
				if(res.code === '000'){
					if(!res.data.list) res.data.list = []
					this.expInfo = res.data
					this.dialogExpVisible = true
				}
			},
		}
	}
</script>

<style lang="scss">
/*  */
.order-status{display: flex;align-items: center;justify-content: space-between;padding: 10px 0;border-top: 1px solid #f5f5f5;border-bottom: 1px solid #F5F5F5;}
.order-status-left{}
.order-status-left span{color: red;}
.order-status-right{}
.order-info{}
.order-info-title{margin: 16px 0;}
.order-info-title span{font-size: 14px;font-weight: bold;color: #409EFF;}
.exp-title{
	padding-bottom: 16px;
	p{
		span{color: #409EFF;margin-left: 10px;}
	}
}
</style>
