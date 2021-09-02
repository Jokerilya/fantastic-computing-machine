<template>
	<div class="app-container">
		<div class="manage-top" style="display: flex;">
			<el-form :model="queryData" label-width="88px" label-position="right" style="width: 100%;">
				<el-row :gutter="20">
					<el-col :span="5">
						<el-form-item label="分类名称">
							<el-input v-model="queryData.name" placeholder="请输入分类名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-button type="primary" icon="el-icon-search" @click="getDataListFn">查询</el-button>
						<el-button type="danger" icon="el-icon-refresh" @click="resSetQueryFn">重置</el-button>
						<el-button type="success" icon="el-icon-plus" @click="addClassify">添加分类</el-button>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div style="height: 16px;"></div>
		<div class="manage-table">
			<el-table ref="multipleTable" :data="dataList" v-loading="dataConfig.loading" style="width: 100%" border :header-cell-style="{color:'#666'}">
				<!-- <el-table-column type="selection" width="60"></el-table-column> -->
				<!-- <el-table-column label="序号" width="80" align="center">
					<template slot-scope="scope">
						<span>{{scope.$index + 1}}</span>
					</template>
				</el-table-column> -->
				<el-table-column label="编号" width="100" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.id || '--'}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="分类图标" width="140" align="center">
					<template slot-scope="scope">
						<div style="display: flex;justify-content: center;">
							<upload-img width="54px" height="54px" :img="scope.row.icon" @uploadSuc="uploadSucFn($event,scope.row)"/>
						</div>
					</template>
				</el-table-column> -->
				<el-table-column label="分类名称"  align="center">
					<template slot-scope="scope">
						<el-input v-model="scope.row.name" placeholder="请输入分类名称"></el-input>
					</template>
				</el-table-column>
				<!-- <el-table-column label="是否可多选"  align="center">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.multipleChoice"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="是否为必选" align="center">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.need"></el-switch>
					</template>
				</el-table-column> -->
				<el-table-column label="是否启用"  align="center">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.status"></el-switch>
					</template>
				</el-table-column>
				<!-- <el-table-column label="关联商品" align="center">
					<template slot-scope="scope">
						<el-button type="text" style="font-size: 14px;" @click="relationShow(scope.row)">{{scope.row.count}}</el-button>
					</template>
				</el-table-column> -->
				<el-table-column label="操作" width="200" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" @click="editClassifyFn(scope.row)">提交{{scope.row.id?'编辑':''}}</el-button>
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
		<el-dialog title="关联商品" :visible.sync="dialogVisible" width="810px">
			<div class="relation-box">
				<div class="tab-title">
					<span>已关联商品</span>
				</div>
				<div class="relation-list" v-if="relationData.relatedOuts.length > 0">
					<div class="relation-item" v-for="(item,index) in relationData.relatedOuts" :key="index">
						<i class="el-icon-close" @click="relationConfirm(0,index)"></i>
						<el-image style="width: 120px; height: 120px;margin-bottom: 6px;border: 1px solid #F4F4F5;" :src="item.coverImage" fit="fill"></el-image>
						<el-button style="width: 100%;" :type="item.isDefault? 'primary' : 'infor'" size="small" @click="setDefault(index)">{{item.isDefault?'取消默认':'设为默认'}}</el-button>
						<span>{{item.title}}</span>
					</div>
				</div>
				<div style="display: flex;justify-content: center;padding: 40px 0;color: #787878;" v-else><span>暂无关联商品</span></div>
			</div>
			<div style="height: 1px;border-bottom: 1px solid #F4F4F5;margin: 16px 0;"></div>
			<div class="relation-box">
				<div class="tab-title">
					<span>可关联商品</span>
				</div>
				<div class="relation-list" v-if="relationData.notRelatedOuts.length > 0">
					<div class="relation-item" v-for="(item,index) in relationData.notRelatedOuts" :key="index">
						<el-image style="width: 120px; height: 120px;margin-bottom: 6px;border: 1px solid #F4F4F5;" :src="item.coverImage" fit="fill"></el-image>
						<el-button style="width: 100%;" type="infor" size="small" @click="relationConfirm(1,index)">确认关联</el-button>
						<span>{{item.title}}</span>
					</div>
				</div>
				<div style="display: flex;justify-content: center;padding: 40px 0;color: #787878;" v-else><span>暂无可关联商品</span></div>
			</div>
			<span slot="footer">
				<el-button type="primary" @click="relationSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import uploadImg from "@/components/uploadImg/upload-img.vue";
	import {queryProductParts,delProductParts,editProductParts,queryProductRelated} from '@/api/install.js'
	export default{
		components:{uploadImg},
		data(){
			return{
				queryData:{
					name:'',
				},
				dataList:[],
				dataConfig: {
					pageNo: 1,
					pageSize: 20,
					total: 0,
					loading: true,
				},
				// 
				dialogVisible:false,
				relationData:{  // 关联商品数据
					notRelatedOuts:[],   // 未关联商品 
					relatedOuts:[],   // 已关联商品 
				},
			}
		},
		created() {
			this.getDataListFn()
		},
		methods:{
			async getDataListFn() {
				this.dataConfig.loading = true
				const res = await queryProductParts({
					pageNo: this.dataConfig.pageNo,
					pageSize: this.dataConfig.pageSize,
					name:this.queryData.name || undefined
				})
				const resData = this.resDataFn(res);
				this.dataConfig.total = resData.total;
				for(let i in resData.records){
					resData.records[i].multipleChoice = Boolean(resData.records[i].multipleChoice)
					resData.records[i].need = Boolean(resData.records[i].need)
					resData.records[i].status = Boolean(resData.records[i].status)
				}
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
			uploadSucFn(img,data) {
				data.icon = img
			},
			// 添加分类
			addClassify(){
				const obj = {
					icon: "",
					id: '' || undefined,
					name: "",
					multipleChoice: false,
					need: false,
					status: true
				}
				this.dataList.unshift(obj)
			},
			// 查看关联商品
			async relationShow(data){
				const loading = this.$loading()
				const res = await queryProductRelated({
					classifyId:data.id,
					productId:'' || undefined,
					productIds:'' || undefined,
					skuId:'' || undefined
				})
				if(res.code === '000'){
					this.relationData = res.data
					this.dialogVisible = true
				}
				loading.close()
			},
			// 提交编辑/添加
			async editClassifyFn(data){
				/* if(!data.icon){
					this.$message.error('请上传分类图标')
				}else */if(!data.name){
					this.$message.error('请输入分类名称')
				}else{
					const res = await editProductParts({
						// icon: data.icon,
						id: data.id || undefined,
						name: data.name,
						// multipleChoice: data.multipleChoice ? 1 : 0,
						// need: data.need ? 1 : 0,
						status: data.status ? 1 : 0
					})
					if(res.code === '000'){
						this.$message({
							message: '操作成功!',
							type: 'success'
						});
						this.getDataListFn()
					}
				}
			},
			// 删除分类
			classifyDel(index,data){
				if(!data.id){
					this.dataList.splice(index,1)
				}else{
					this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(async () => {
						const res = await delProductParts({
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
				}
			},
			// 设为默认
			setDefault(index){
				this.relationData.relatedOuts[index].isDefault = !this.relationData.relatedOuts[index].isDefault
			},
			// 设置关联
			relationConfirm(e,index){
				let item
				if(e === 0){
					item = this.relationData.relatedOuts[index]
					this.relationData.notRelatedOuts.push(item)
					this.relationData.relatedOuts.splice(index,1)
				}else{
					item = this.relationData.notRelatedOuts[index]
					this.relationData.relatedOuts.push(item)
					this.relationData.notRelatedOuts.splice(index,1)
					this.relationData.relatedOuts.forEach(item=>item.isDefault = 0)
				}
			},
			// 确认管理商品
			async relationSubmit(){
				const res = await a()
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
