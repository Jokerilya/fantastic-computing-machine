<template>
	<div class="app-container">
		<div class="manage-top">
			<el-form :model="queryData" ref="ruleForm" label-width="88px" class="rule-form" label-position="right">
				<el-row :gutter="20">
					<el-col :span="5">
						<el-form-item label="装机名称">
							<el-input v-model="queryData.name" placeholder="请输入装机名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col style="width: 458px;">
						<el-form-item label="上传时间">
							<el-date-picker v-model="queryData.queryTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker style="width:100%">
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-button type="primary" icon="el-icon-search" @click="getDataListFn">查询</el-button>
						<el-button type="infor" icon="el-icon-refresh" @click="resSetQueryFn">重置</el-button>
						<el-button type="success" icon="el-icon-circle-plus-outline" @click="installedit">添加装机</el-button>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<!--  -->
		<div style="height: 16px;"></div>
		<div class="manage-table">
			<el-table ref="multipleTable" :data="dataList" v-loading="dataConfig.loading" @selection-change="handleSelectionChange" :default-sort="{prop:'sort',order:'descending'}">
				<!-- <el-table-column type="selection" width="60"></el-table-column> -->
				<el-table-column prop="id" label="编号" width="100" align="center"></el-table-column>
				<el-table-column label="类型" width="120" align="center">
					<template slot-scope="scope">
						<span>装机</span>
					 </template>
				</el-table-column>
				<el-table-column prop="name" label="装机名称" width="200" align="center"></el-table-column>
				<el-table-column prop="modelName" label="装机型号" width="200" align="center"></el-table-column>
				<el-table-column prop="price" label="价格" width="170" align="center" sortable></el-table-column>
				<el-table-column prop="sales" label="销量" width="170" align="center" sortable></el-table-column>
				<el-table-column prop="sort" label="序号" width="170" align="center" sortable></el-table-column>
				<el-table-column label="产品状态" width="200" align="center">
					<template slot-scope="scope">
						<el-tag :type="scope.row.isShelves?'success':'danger'">{{isShelvesType[scope.row.isShelves]}}</el-tag>
					 </template>
				</el-table-column>
				<el-table-column label="上传时间" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.createTime}}</span>
					 </template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" @click="listHandle(0,scope.row)">编辑</el-button>
						<el-button type="text" @click="listHandle(1,scope.row)">{{scope.row.isShelves?'下架':'上架'}}</el-button>
						<el-button type="text" @click="listHandle(2,scope.row)" style="color: orangered;">删除</el-button>
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
	</div>
</template>

<script>
	import {queryInstallListFn,delProductInstall,handleProductDropOff} from '@/api/install.js'
	export default{
		data(){
			return{
				dataList:[],
				handleSelectionList:[],
				dataConfig: {
					pageNo: 1,
					pageSize: 20,
					total: 0,
					loading: true,
				},
				queryData:{
					name:'',
					queryTime:'',
				},
				isShelvesType:['下架','上架'],
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
				const res = await queryInstallListFn({
					pageNo: this.dataConfig.pageNo,
					pageSize: this.dataConfig.pageSize,
					name: this.queryData.name || undefined,
					queryTime:this.queryData.queryTime ? this.queryData.queryTime[0] + "/" + this.queryData.queryTime[1] : undefined,
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
			// 添加/编辑装机
			installedit(){
				this.$router.push({name:'InstallEdit'})
			},
			// 操作表格
			async listHandle(e,data){
				if(e === 0){
					this.$router.push({name:'InstallEdit',query:{id:data.id}})
				}else if(e === 1){
					let text = '上架'
					if(data.isShelves){
						text = '下架'
					}
					this.$confirm('此操作将'+text+'该商品, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(async () => {
						const res = await handleProductDropOff({
							id:data.id
						})
						if(res.code === '000'){
							this.$message({
								type: 'success',
								message: '操作成功!'
							});
							this.dataList = this.dataList.filter(item=>item.id !== data.id)
						}
					}).catch(() => {
						
					});
				}else if(e === 2){
					this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(async () => {
						const res = await delProductInstall({
							id:data.id
						})
						if(res.code === '000'){
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.dataList = this.dataList.filter(item=>item.id !== data.id)
						}
					}).catch(() => {
						
					});
				}
			},
			
		}
	}
</script>

<style>
</style>
