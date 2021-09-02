<template>
	<div class="app-container">
		<div class="manage-top" style="display: flex;">
			<el-form :model="queryData" label-width="88px" label-position="right" style="width: 100%;">
				<el-row :gutter="20">
					<el-col :span="5">
						<el-form-item label="供应商名称">
							<el-input v-model="queryData.name" placeholder="请输入供应商名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="法人姓名">
							<el-input v-model="queryData.legalPerson" placeholder="请输入法人姓名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="手机号">
							<el-input v-model="queryData.phone" maxlength="11" placeholder="请输入供应商手机号"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col>
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="getDataListFn">查询</el-button>
							<el-button type="danger" icon="el-icon-refresh" @click="resSetQueryFn">重置</el-button>
							<el-button type="success" icon="el-icon-plus" @click="addSupplier('new')">添加供应商</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div style="height: 16px;"></div>
		<div class="manage-table">
			<el-table ref="multipleTable" :data="dataList" v-loading="dataConfig.loading" style="width: 100%" border :header-cell-style="{color:'#666'}">
				<!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
				<el-table-column label="供应商编号" width="100" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.id || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="添加时间" width="160" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.createTime || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="供应商名称" width="180" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.name || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="供应商手机号" width="180" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.phone || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="供应商地址" width="200" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.address || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="法人姓名" width="100" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.legalPerson || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="开户银行" width="" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.bankName || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="银行卡号" width="" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.bankCode || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="银行卡类型" width="120" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.bankType === 1">对公</span>
						<span v-else-if="scope.row.bankType === 2">对私</span>
						<span v-else>未知</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" @click="addSupplier('edit',scope.row)">编辑</el-button>
						<el-button type="text" style="color: red;" @click="classifyDel(scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--  -->
		<div style="height: 16px;"></div>
		<div class="table-block" v-show="dataList.length > 0">
			<el-pagination background @size-change="handleSizeChange" @current-change="currentChangeFn" :current-page.sync="dataConfig.pageNo" :page-size="dataConfig.pageSize" :page-sizes="[10, 30, 50, 100]" layout="total,sizes, prev, pager, next" :total="dataConfig.total">
			</el-pagination>
		</div>
		<!--  -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="520px">
			<el-form :model="supplierForm" :rules="rules" ref="supplierForm" label-width="110px" style="padding-right: 20px;">
				<el-form-item label="供应商名称" prop="name">
					<el-input v-model="supplierForm.name" placeholder="请输入供应商名称"></el-input>
				</el-form-item>
				<el-form-item label="供应商手机号" prop="phone">
					<el-input v-model="supplierForm.phone" maxlength="11" placeholder="请输入供应商手机号"></el-input>
				</el-form-item>
				<el-form-item label="供应商地址" prop="address">
					<el-input v-model="supplierForm.address" placeholder="请输入供应商地址"></el-input>
				</el-form-item>
				<el-form-item label="法人姓名" prop="legalPerson">
					<el-input v-model="supplierForm.legalPerson" placeholder="请输入法人姓名"></el-input>
				</el-form-item>
				<el-form-item label="开户银行" prop="bankName">
					<el-input v-model="supplierForm.bankName" placeholder="请输入开户银行"></el-input>
				</el-form-item>
				<el-form-item label="银行卡号" prop="bankCode">
					<el-input v-model="supplierForm.bankCode" placeholder="请输入银行卡号"></el-input>
				</el-form-item>
				<el-form-item label="银行卡类型" prop="bankType">
					<el-select v-model="supplierForm.bankType" placeholder="请选择银行卡类型">
						<el-option :label="item.name" :value="item.id" v-for="(item,index) in supplierAccountType" :key="index"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" style="padding-right: 20px;">
				<el-button type="primary" @click="addSupplierSubmit('supplierForm')">确定{{dialogTitle === '编辑供应商'?'编辑':'添加'}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {querySupplierList,editSupplier,deleteSupplier,getSupplier} from '@/api/product.js'
	export default{
		data(){
			return{
				queryData:{
					legalPerson:'',  // 法人名称
					name:'',   // 供应商名称
					phone:'',  // 供应商手机号
				},
				dataList:[],
				dataConfig: {
					pageNo: 1,
					pageSize: 20,
					total: 0,
					loading: true,
				},
				// 
				dialogTitle:'添加供应商',
				dialogVisible:false,
				supplierAccountType:[
					{name:'对公',id:1},
					{name:'对私',id:2}
				],
				supplierForm:{
					address: "",
					bankCode: "",
					bankName: "",
					bankType: '',
					id: '' || undefined,
					legalPerson: "",
					name: "",
					phone: ""
				},
				rules:{
					address: [
						{ required: true, message: '请输入供应商地址', trigger: 'blur' },
					],
					bankCode: [
						{ required: true, message: '请输入银行卡号', trigger: 'blur' },
					],
					bankName: [
						{ required: true, message: '请输入开户行名称', trigger: 'blur' },
					],
					bankType: [
						{ required: true, message: '请选择银行卡类型', trigger: '' },
					],
					legalPerson: [
						{ required: true, message: '请输入法人姓名', trigger: 'blur' },
					],
					name: [
						{ required: true, message: '请输入供应商名称', trigger: 'blur' },
					],
					phone: [
						{ required: true, message: '请输入供应商手机号', trigger: 'blur' },
					]
				}
			}
		},
		created() {
			this.getDataListFn()
		},
		methods:{
			async getDataListFn() {
				this.dataConfig.loading = true
				const res = await querySupplierList({
					pageNo: this.dataConfig.pageNo,
					pageSize: this.dataConfig.pageSize,
					name:this.queryData.name || undefined,
					legalPerson:this.queryData.legalPerson || undefined,
					phone:this.queryData.phone || undefined
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
					legalPerson:'',  // 法人名称
					name:'',   // 供应商名称
					phone:'',  // 供应商手机号
				}
				this.getDataListFn()
			},
			// 添加/编辑供应商弹窗
			async addSupplier(type,data){
				const loading = this.$loading()
				this.dialogTitle = '添加供应商'
				for(let i in this.supplierForm){
					this.supplierForm[i] = ''
				}
				if(type !== 'new'){
					this.dialogTitle = '编辑供应商'
					const res = await getSupplier({
						id:data.id
					})
					if(res.code === '000'){
						delete res.data.delFlag
						delete res.data.createTime
						this.supplierForm = res.data
					}
				}
				loading.close()
				this.dialogVisible = true
			},
			// 添加/编辑供应商
			async addSupplierSubmit(formName){
				this.$refs[formName].validate(async (valid) => {
					if(!valid) {
						return false;
					}else{
						const res = await editSupplier(this.supplierForm)
						if(res.code === '000'){
							this.$message({
								type: 'success',
								message: '操作成功!'
							});
							this.dialogVisible = false
							this.getDataListFn()
						}
					}
				});
			},
			// 删除分类
			classifyDel(index,data){
				this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const res = await deleteSupplier({
						id:data.id
					})
					if(res.code === '000'){
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.dataList.splice(index,1)
					}
				}).catch(() => {
					
				});
			},
		}
	}
</script>

<style scoped>
.tab-title{display: flex;align-items: center;height: 40px;font-size: 15px;font-weight: bold;padding-bottom: 15px;}
.relation-list{display: flex;flex-wrap: wrap;}
.relation-item{display: flex;flex-direction: column;align-items: center;width: 120px;position: relative;margin: 0 10px 10px 0;}
.relation-item:nth-child(6n){margin-right: 0;}
.relation-item>i{font-size: 20px;position: absolute;right: 0;top: 0;z-index: 10;padding: 4px;cursor: pointer;}
.relation-item>i:hover{opacity: .8;}
.relation-item>span{margin-top: 6px;font-size: 14px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;}
</style>
