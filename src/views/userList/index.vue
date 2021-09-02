<template>
	<div class="app-container">
		<div class="manage-top">
			<el-form :model="queryData" ref="ruleForm" label-width="88px" class="rule-form" label-position="right">
				<el-row :gutter="20">
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
						<el-form-item label="用户状态">
							<el-select v-model="queryData.status" placeholder="请选择" style="width: 100%;">
								<el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="getDataListFn">查询</el-button>
							<el-button type="danger" @click="resSetQueryFn">重置</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<!--  -->
		<div style="height: 16px;"></div>
		<div class="manage-table">
			<el-table ref="multipleTable" :data="dataList" v-loading="dataConfig.loading" @selection-change="handleSelectionChange"  style="width: 100%">
				<!-- <el-table-column type="selection" width="60"></el-table-column> -->
				<el-table-column prop="uid" label="用户ID" width="230" align="center"></el-table-column>
				<el-table-column prop="createTime" label="注册时间" width="200" align="center"></el-table-column>
				<el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>
				<el-table-column prop="phone" label="手机号" width="200" align="center"></el-table-column>
				<el-table-column label="用户头像" width="200" align="center">
					<template slot-scope="scope">
						<el-image  style="width: 80px; height: 80px" :src="scope.row.portrait" :preview-src-list="[scope.row.portrait]"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="订单数量" width="150" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.orderNum}}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单总金额" width="180" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.payAmount}}</span>
					</template>
				</el-table-column>
				<el-table-column label="账号禁用" width="180" align="center">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="accountDisable(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="190" align="center" fixed="right">
					<template slot-scope="scope">
						<!-- <el-button size="mini" type="infor" @click="detailFn(scope.row.id)">查看详情</el-button> -->
						<el-button size="mini" type="danger">删除用户</el-button>
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
	</div>
</template>

<script>
	import {queryUserInfoFn,editUserInfoStatusFn} from "@/api/user.js";
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
					status:'' , // 订单状态：0-禁用 1-正常
					phone:'',
					userName:''
				},
				statusOptions:[
					{id:0,name:'禁用'},
					{id:1,name:'正常'}
				],
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
				const res = await queryUserInfoFn({
					pageNo: this.dataConfig.pageNo,
					pageSize: this.dataConfig.pageSize,
					phone: this.queryData.phone || undefined,
					status: this.queryData.status
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
			// 禁用启用账号
			async accountDisable(data){
				const loading = this.$loading()
				let status = data.status
				const res = await editUserInfoStatusFn({
					id:data.uid,
					status:data.status
				})
				loading.close()
				if(res.code === '000'){
					this.$message({
						message: '操作成功!',
						type: 'success'
					});
				}else{
					this.$nextTick(()=>{
						data.status = status
					})
				}
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
