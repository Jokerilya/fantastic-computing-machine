<template>
	<div class="app-container">
		<div class="manage-top" style="display: flex;">
			<el-form :model="queryData" label-width="88px" label-position="right" style="width: 100%;">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="型号名称">
							<el-input v-model="queryData.name" placeholder="请输入型号名称"></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="15">
						<el-form-item label="添加日期">
							<el-date-picker v-model="queryData.queryTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
					</el-col> -->
				</el-row>
				<el-row :gutter="20">
					<el-col>
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="getDataListFn">查询</el-button>
							<el-button type="danger" icon="el-icon-refresh" @click="resSetQueryFn">重置</el-button>
							<el-button type="success" icon="el-icon-plus" @click="addModel('new')">添加装机型号</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div style="height: 16px;"></div>
		<div class="manage-table">
			<el-table ref="multipleTable" :data="dataList" v-loading="dataConfig.loading" style="width: 100%" border :header-cell-style="{color:'#666'}">
				<!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
				<el-table-column label="编号" width="100" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.id || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="封面图片" width="300" align="center">
					<template slot-scope="scope">
						<el-image style="width: 80px;height: 80px;" :preview-src-list="[scope.row.coverImage]" :src="scope.row.coverImage "></el-image>
					</template>
				</el-table-column>
				<el-table-column label="型号名称" header-align="center">
					<template slot-scope="scope">
						<span>{{scope.row.modelName  || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="描述" align="center" width="300">
					<template slot-scope="scope">
						<span>{{scope.row.simpleDesc || '--'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="机器类型" align="center" >
					<template slot-scope="scope">
						<span v-if="scope.row.type === 1">数据中心</span>
						<span v-if="scope.row.type === 2">加工中心</span>
					</template>
				</el-table-column>
				<el-table-column label="是否显示" align="center" >
					<template slot-scope="scope">
						<span></span>
						<el-tag v-if="scope.row.status === 0" type="info">隐藏</el-tag>
						<el-tag v-if="scope.row.status === 1" type="success">显示</el-tag>
					</template>
				</el-table-column>
				
				<el-table-column label="操作" width="150" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" @click="addModel('edit',scope.row)">编辑</el-button>
						<el-button type="text" style="color: red;" @click="classifyDel(scope.$index,scope.row)">删除</el-button>
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
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
			<el-form :model="ModelForm" :rules="rules" ref="ModelForm" label-width="110px" style="padding-right: 20px;">
				<el-form-item label="型号标题" prop="title">
					<el-input v-model="ModelForm.modelName" placeholder="请输入装机型号的标题"></el-input>
				</el-form-item>
				<el-form-item label="型号封面图" prop="coverPicture">
					<upload-img width="80px" height="80px" :img="ModelForm.coverImage" @uploadSuc="uploadSucFn"/>
				</el-form-item>
				<el-form-item label="型号类型" prop="content">
					<el-radio-group v-model="ModelForm.type">
					    <el-radio :label="1">数据中心</el-radio>
					    <el-radio :label="2">加工中心</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="描述" prop="content">
					<el-input type="textarea" v-model="ModelForm.simpleDesc" resize="none" :rows="3"></el-input>
				</el-form-item>
				<el-form-item label="分类状态" prop="content">
					<el-radio-group v-model="ModelForm.status">
					    <el-radio :label="1">显示</el-radio>
					    <el-radio :label="0">隐藏</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" style="padding-right: 20px;">
				<el-button type="primary" @click="addModelSubmit('ModelForm')">确定{{dialogTitle === '编辑装机型号'?'编辑':'添加'}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {queryProductInstallModel,editProductInstallModel,delProductInstallModel} from '@/api/install.js'
	import uploadImg from "@/components/uploadImg/upload-img.vue";
	export default{
		components:{uploadImg},
		data(){
			return{
				dataList:[],
				dataConfig: {
					pageNo: 1,
					pageSize: 20,
					total: 0,
					loading: true,
				},
				queryData:{
					name:'',
					// queryTime:[],
				},
				// 
				dialogTitle:'添加装机型号',
				dialogVisible:false,
				ModelForm:{
					modelName:'',
					coverImage:'',
					type:1,
					simpleDesc:'',
					status:1
				},
				rules:{
					modelName: [
						{ required: true, message: '请输入装机型号的名称', trigger: 'blur' },
					],
					coverImage: [
						{ required: true, message: '请上传封面图', trigger: 'upload' },
					],
					simpleDesc: [
						{ required: true, message: '请输入描述', trigger: 'blur' },
					],
				}
			}
		},
		created() {
			this.getDataListFn()
		},
		methods:{
			async getDataListFn() {
				this.dataConfig.loading = true
				const res = await queryProductInstallModel({
					name:this.queryData.name || undefined,
					// queryTime:this.queryData.queryTime.length > 0 ? this.queryData.queryTime.join('/') : undefined,
					pageNo: this.dataConfig.pageNo,
					pageSize: this.dataConfig.pageSize,
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
				this.getDataListFn()
			},
			uploadSucFn(img) {
			  this.ModelForm.coverImage = img;
			},
			// 添加/编辑装机型号弹窗
			async addModel(type,data){
				this.dialogTitle = '添加装机型号'
				for(let i in this.ModelForm){
					if(typeof this.ModelForm[i] === 'number'){
						this.ModelForm[i] = 1
					}else{
						this.ModelForm[i] = ''
					}
				}
				if(type === 'edit'){
					this.dialogTitle = '编辑装机型号'
					this.ModelForm = data
				}
				this.dialogVisible = true
			},
			// 添加/编辑
			async addModelSubmit(formName){
				this.$refs[formName].validate(async (valid) => {
					if(!valid) {
						return false;
					}else{
						if(this.dialogTitle === '添加装机型号'){
							delete this.ModelForm.id
						}
						delete this.ModelForm.createTime
						const res = await editProductInstallModel(this.ModelForm)
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
			// 删除
			classifyDel(index,data){
				this.$confirm('此操作将永久删除该条资讯, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const res = await delProductInstallModel({
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
