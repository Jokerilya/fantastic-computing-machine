<template>
	<div class="app-container">
		<div class="manage-top">
			<el-page-header @back="goBack" content="添加/编辑装机"></el-page-header>
		</div>
		<div style="height: 2px;"></div>
		<div class="manage-top">
			<el-tabs v-model="tabSelectVal">
			    <el-tab-pane :label="item.name" :name="item.lable" v-for="(item,index) in tabs" :key="item.lable"></el-tab-pane>
			</el-tabs>
			<div class="tab-content" v-show="tabSelectVal === 'first'">
				<div class="tab-title">
					<span>商品信息</span>
				</div>
				<el-form :model="queryData" :rules="firstRules" ref="ruleForm" label-position="right" label-width="160px" class="demo-ruleForm">
					<el-form-item label="商品名称" prop="name">
						<el-input v-model="queryData.name" placeholder="请输入商品名称"></el-input>
					</el-form-item>
					<el-form-item label="装机介绍" >
						<el-input type="textarea" v-model="queryData.descVal" rows="3" resize="none" placeholder="请输入装机介绍"></el-input>
					</el-form-item>
					<el-form-item label="装机封面图" prop="img">
						<upload-img width="80px" height="80px" :img="queryData.img" @uploadSuc="uploadSucFn"/>
					</el-form-item>
					<el-form-item label="装机轮播图" prop="carouselImg">
						<upload-imgs :imgs="queryData.carouselImg" @uploadSuc="uploadImgsSucFn" @deleteImg="deleteImgFn"/>
						<!-- <span style="color: gray;">只能上传jpg/png格式图片</span> -->
					</el-form-item>
					<el-form-item label="小程序装机轮播图" prop="appletCarouselImg">
						<upload-imgs :imgs="queryData.appletCarouselImg" @uploadSuc="uploadappletImgsSucFn" @deleteImg="deleteappletImgFn"/>
						<!-- <span style="color: gray;">只能上传jpg/png格式图片</span> -->
					</el-form-item>
					<el-form-item label="产品类型">
						<el-radio-group v-model="queryData.type" @change="installTypeChange">
						    <el-radio :label="1">整机</el-radio>
						    <el-radio :label="2">加工中心</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="装机型号" prop="modelId">
						<el-select v-model="queryData.modelId" filterable placeholder="请选择" style="width: 250px;">
						    <el-option v-for="item in installSubType" :key="item.id" :label="item.modelName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="产品档次">
						<el-radio-group v-model="queryData.gradeType">
						    <el-radio :label="1">低</el-radio>
						    <el-radio :label="2">中</el-radio>
						    <el-radio :label="3">高</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="商品运费">
						<el-input v-model="queryData.expMoney" v-if="!expMoneyStatus" :placeholder="'请输入商品运费'" style="width: 250px;"></el-input>
						<el-select v-else v-model="queryData.expId" filterable placeholder="请选择运费模板" style="width: 250px;">
						    <el-option v-for="item in queryExpRuleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
						<el-checkbox v-model="expMoneyStatus" style="margin-left: 20px;" @change="expMoneyChange">按运费模板计算</el-checkbox>
					</el-form-item>
					<el-form-item label="起始销量">
						<el-input v-model.number="queryData.startSales" placeholder="请输入起始销量"></el-input>
					</el-form-item>
					<el-form-item label="商品状态">
						<el-switch v-model="queryData.isShelves"></el-switch>
						<span v-show="queryData.isShelves" style="color: #409EFF;margin-left: 6px;">上架状态</span>
						<span v-show="!queryData.isShelves" style="color: #999;margin-left: 6px;">下架状态</span>
					</el-form-item>
					<el-form-item style="clear: both;width: 800px;" label="商品详情" >
					  <tinymce :id="'agreement_' + queryData.id" v-model="queryData.content" :height="600"/>
					</el-form-item>
					<el-form-item>
						<!-- <el-button type="infor" style="width: 200px;">保存</el-button> -->
						<el-button type="primary" style="width: 200px;" @click="nextStpe(0,'ruleForm')">下一步</el-button>
					</el-form-item>
				</el-form>
			</div>
			<!--  -->
			<div class="tab-content" v-show="tabSelectVal === 'second'">
				<div class="tab-title">
					<span>关联分类</span>
				</div>
				<div class="tab-content-tag">
					<span style="color:red;font-size: 13px;">选择要关联的分类，点击添加</span>
				</div>
				<div class="tab-content-tag" v-show="classifyTags.length > 0">
					<el-tag v-for="(item,index) in classifyTags" :key="index" closable @close="classifyTagsClose(index)">{{item.name}}</el-tag>
					<!-- <el-button icon="el-icon-plus" type="primary" size="small" style="margin-left: 10px;">新增</el-button> -->
				</div>
				<div class="tab-content-tag">
					<!-- <el-select v-model="classifyTagsValue" filterable placeholder="请选择" size="medium" style="width: 400px;">
						<el-option v-for="item in classifyTagsOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select> -->
					<el-cascader ref="cascader" v-model="classifyTagsValue" @change="classifyTagsChange" size="medium" style="width: 400px;" :props="props" :show-all-levels="false"></el-cascader>
					<el-button type="primary" size="medium" icon="el-icon-plus" style="margin-left: 10px;" @click="classifyTagsHandle">添加</el-button>
				</div>
				<div class="tab-title">
					<span>分类关联商品</span>
				</div>
				<el-table ref="multipleTable" :data="classifyTags" style="width: 980px" border :header-cell-style="{backgroundColor:'#f5f5f5'}">
					<el-table-column prop="orderSn" label="序号" width="100" align="center">
						<template slot-scope="scope">
							<span>{{scope.$index + 1}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="name"  label="分类" width="170" align="center"></el-table-column>
					<el-table-column  label="是否必选" width="130" align="center">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.isMandatory"></el-switch>
						 </template>
					</el-table-column>
					<el-table-column label="是否多选" width="130" align="center">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.isChoice"></el-switch>
						 </template>
					</el-table-column>
					<el-table-column label="默认商品" width="200" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.productName || '无'}}</span>
						 </template>
					</el-table-column>
					<!-- <el-table-column label="价格" width="100" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.price || '0'}}</span>
						 </template> -->
					</el-table-column>
					<el-table-column label="关联商品" align="center">
						<template slot-scope="scope">
							<el-button type="text" style="font-size: 14px;" @click="relationShow(scope.row,scope.$index)">{{scope.row.productNum}}</el-button>
						 </template>
					</el-table-column>
				</el-table>
				<div style="height: 30px;"></div>
				<el-button type="infor" style="width: 200px;" @click="tabSelectVal = 'first'">上一步</el-button>
				<el-button type="primary" style="width: 200px;" @click="nextStpe(2,'ruleForm')">保存</el-button>
			</div>
			<!--  -->
			<el-dialog title="关联商品" :visible.sync="dialogVisible" width="810px" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
				<div class="relation-box">
					<div class="tab-title">
						<span>已关联商品</span>
					</div>
					<div class="relation-list" v-if="relationData.relatedOuts.length > 0">
						<div class="relation-item" v-for="(item,index) in relationData.relatedOuts" :key="index">
							<i class="el-icon-close" @click="relationConfirm(0,index)"></i>
							<el-image style="width: 120px; height: 120px;margin-bottom: 6px;border: 1px solid #F4F4F5;" :src="item.coverImage" fit="fill"></el-image>
							<el-button style="width: 100%;margin-bottom: 4px;" :type="item.isDefault? 'primary' : 'infor'" size="small" @click="setDefault(index)">{{item.isDefault?'已设为默认':'设为默认'}}</el-button>
							<span style="line-height: 1.2;" :title="item.title">{{item.title}}</span>
							<span :title="item.simpleDesc">{{item.simpleDesc || '暂无简介'}}</span>
							<span>{{item.price}}元</span>
						</div>
					</div>
					<div style="display: flex;justify-content: center;padding: 40px 0;color: #787878;" v-else><span>暂无已关联商品</span></div>
				</div>
				<div style="height: 1px;border-bottom: 1px solid #F4F4F5;margin: 16px 0;"></div>
				<div class="relation-box">
					<div class="tab-title">
						<span>可关联商品</span>
					</div>
					<div class="relation-list" v-if="relationData.notRelatedOuts.length > 0">
						<div class="relation-item" v-for="(item,index) in relationData.notRelatedOuts" :key="index">
							<el-image style="width: 120px; height: 120px;margin-bottom: 6px;border: 1px solid #F4F4F5;" :src="item.coverImage" fit="fill"></el-image>
							<el-button style="width: 100%;margin-bottom: 4px;" type="infor" size="small" @click="relationConfirm(1,index)">确认关联</el-button>
							<span style="line-height: 1.2;" :title="item.title">{{item.title}}</span>
							<span :title="item.simpleDesc">{{item.simpleDesc || '暂无简介'}}</span>
							<span>{{item.price}}元</span>
						</div>
					</div>
					<div style="display: flex;justify-content: center;padding: 40px 0;color: #787878;" v-else><span>暂无可关联商品</span></div>
				</div>
				<span slot="footer">
					<el-button type="primary" @click="relationSubmit">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {queryProductParts,queryInstallProductParts,queryProductRelated,editProductInstall,editProductParts,queryExpRule,getProductInstall,installedModelList} from '@/api/install.js'
	import {queryProductCategoryFn} from '@/api/product.js'
	import uploadImg from "@/components/uploadImg/upload-img.vue";
	import uploadImgs from "@/components/uploadImgs/upload-imgs.vue";
	import lodash from 'lodash'
	import Tinymce from "@/components/Tinymce";
	export default{
		name: "instalEdit",
		components: {
		  uploadImg,
		  uploadImgs,
		  Tinymce
		},
		data(){
			return{
				queryData:{
					name:'',
					descVal:'',
					img:'',
					carouselImg:[],
					appletCarouselImg:[],
					expType:2,   //运费类型 1运费模板计算 2固定金额 ,
					expMoney:'' ,
					expId:'',
					startSales:'',
					isShelves:true,  // 0下架 1上架
					type:1,   // 类型 1 整机 2 加工中心
					modelId:'',  // 装机型号
					gradeType:1   ,//装机产品档次 1低 2中 3高 ,
					content:'',
					id:'',
				},
				expMoneyStatus:false,
				firstRules:{
					 name:[
						{ required: true, message: '请输入商品名称', trigger: 'blur' },
					 ],
					 img:[
					 	{ required: true, message: '请上传装机封面图', trigger: 'upload' },
					 ],
					 carouselImg:[
						{ required: true, message: '请上传装机轮播图', trigger: 'upload' },
					 ],
					 appletCarouselImg:[
						{ required: true, message: '请上传小程序装机轮播图', trigger: 'upload' },
					 ],
					 modelId:[
						 { required: true, message: '请上选择产品型号', trigger: 'change' },
					 ]
				},
				tabSelectVal:'first',
				tabs:[
					{name:'商品信息',lable:'first'},
					{name:'装机配置',lable:'second'}
				],
				classifyTags:[],
				classifyTagsOptions:[],
				classifyTagsValue:[],
				// 
				dialogVisible:false,
				dialogIndex:0,
				relationData:{  // 关联商品数据
					notRelatedOuts:[],   // 未关联商品 
					relatedOuts:[],   // 已关联商品 
				},
				queryExpRuleList:[],
				id:'',  // 装机id
				// 联级分类
				props: {
					lazy: true,
					lazyLoad (node, resolve) {
						const { level } = node;
						queryProductCategoryFn({pid:node.value || 0}).then(res=>{
							const resData = res.data;
							const nodes = resData.map(item=>({
								value: item.id,
								label: item.name,
								leaf: level >= 1
							}))
							resolve(nodes)
						})
					}
				},
				labelName:'',  // 选中的装机分类名称
				installSubType:[],
			}
		},
		async created(){
			this.id = this.$route.query.id
			 await this.installedModelList(this.queryData.type)
			this.getClassifyInfo(this.id)
			this.getQueryExpRule()
		},
		async activated() {
			this.id = this.$route.query.id
			await this.installedModelList(this.queryData.type)
			this.getClassifyInfo(this.id)
			this.getQueryExpRule()
		},
		methods:{
			// 返回上一页
			goBack(){
				this.$router.go(-1)
			},
			installTypeChange(type){
				this.installedModelList(type)
			},
			// 获取装机型号列表
			async installedModelList(type){
				const res = await installedModelList({
					type
				})
				if(res.code === '000'){
					this.installSubType = res.data
				}
			},
			// 获取运费模板
			async getQueryExpRule(){
				const res = await queryExpRule({
					pageNo:1,
					pageSize:50
				})
				if(res.code === '000'){
					this.queryExpRuleList = res.data.records
				}
			},
			// 运费方式切换
			expMoneyChange(val){
				if(val){
					this.queryData.expMoney = ''
					this.queryData.expType = 1
				}else{
					this.queryData.expId = ''
					this.queryData.expType = 2
				}
			},
			// 获取装机信息
			async getClassifyInfo(id){
				if(!id) return
				let res = await getProductInstall({
					pageNo: id? undefined : 1,
					pageSize:id? undefined : 50,
					id:id || undefined
				})
				res = this.resDataFn(res)
				
				res.carouselImg = res.carouselImg ? res.carouselImg.split(',') : []
				this.classifyTags = res.data
				res.data.forEach(item=>{
					item.isChoice = item.isChoice ? true : false
					item.isMandatory = item.isMandatory ? true : false
				})
				for(let i in this.queryData){
					for(let j in res){
						if(i === j){
							this.queryData[i] = res[j]
							if(i === 'isShelves'){
								this.queryData[i] = this.queryData[i] ? true : false
							}
							if(i === 'expType'){
								if(this.queryData[i] === 1){   // 运费模板计算
									this.expMoneyStatus = true
								}
								if(this.queryData[i] === 2){   // 固定金额
									this.expMoneyStatus = false
								}
							}
						}
					}
				}
				// this.queryData.id = res.data.id
				// this.queryData.content = res.data.content
			},
			// 选择分类
			classifyTagsChange(val){
				this.labelName = this.$refs.cascader.getCheckedNodes()[0].label
				/* for(let i in res.records){
					res.records[i].classifyId = res.records[i].id
					res.records[i].isChoice = false
					res.records[i].isMandatory = false
					res.records[i].productId = ''
					res.records[i].productIds = []
					res.records[i].productNum = 0
					res.records[i].skuId = ''
					res.records[i].productName = '未设置'
				}
				this.classifyTagsOptions = res.records */
			},
			// 添加关联分类
			classifyTagsHandle(){
				// let item = this.classifyTagsOptions.filter(item=>item.id === this.classifyTagsValue)
				let item = [
					{
						id:'',
						classifyId:this.classifyTagsValue[1],
						name:this.labelName,
						isChoice:false,
						isMandatory:false,
						productId:'',
						productIds:[],
						productNum:0,
						skuId:'',
						productName:'未设置',
						// price:0,
					}
				]
				if(item.length > 0){
					let index = this.classifyTags.findIndex(p=>p.classifyId === item[0].classifyId)
					if(index === -1){
						this.classifyTags.push(item[0])
						// this.labelName = ''
					}else{
						this.$message.error('该分类已存在，请勿重复添加');
					}
				}else{
					this.$message.error('请选要添加的分类');
				}
			},
			// 删除关联分类
			classifyTagsClose(i){
				this.classifyTags = this.classifyTags.filter((item,index)=>index !== i)
			},
			uploadSucFn(img) {
			  this.queryData.img = img;
			},
			uploadImgsSucFn(img) {
			  this.queryData.carouselImg.push(img);
			},
			//小程序轮播图上传
			uploadappletImgsSucFn(img) {
				this.queryData.appletCarouselImg.push(img);
			},
			deleteImgFn(index) {
			  this.queryData.carouselImg.splice(index, 1);
			},
			//小程序轮播图删除
			deleteappletImgFn(index) {
			  this.queryData.appletCarouselImg.splice(index, 1);
			},
			// 下一步 & 提交
			nextStpe(type,formName) {
				if(type === 0){
					this.$refs[formName].validate((valid) => {
						if (!valid) {
							return false;
						}else{
							this.tabSelectVal = 'second'
							console.log(this.queryData)
						}
					});	
				}else if(type === 2){
					this.$refs[formName].validate(async (valid) => {
						if (!valid) {
							this.tabSelectVal = 'first'
							return false;
						}else{
							if(this.classifyTags.length === 0){
								this.$message.error('请先关联分类');
							}else{
								const index = this.classifyTags.findIndex(item=>item.productNum === 0)
								if(index !== -1){
									this.$message.error('分类"'+ this.classifyTags[index].name +'"未设置关联商品');
									return
								}
								const arr = lodash.cloneDeep(this.classifyTags)
								arr.forEach(item=>{
									item.isChoice = item.isChoice ? 1 : 0
									item.isMandatory = item.isMandatory ? 1 : 0
									item.productIds = typeof item.productIds !== 'string' ? item.productIds.join(',') : item.productIds
									delete item.name
									delete item.productName
								})
								const data = {
									appletCarouselImg:this.queryData.appletCarouselImg.join(','),
									carouselImg: this.queryData.carouselImg.join(','),
									descVal: this.queryData.descVal,
									expId: this.expMoneyStatus ? this.queryData.expId : undefined,
									expMoney: this.expMoneyStatus ? undefined : this.queryData.expMoney,
									expType: this.queryData.expType,
									id: this.id,
									img: this.queryData.img,
									isShelves: this.queryData.isShelves ? 1 : 0,
									list: arr.length > 0 ? arr : null,
									name: this.queryData.name,
									startSales: this.queryData.startSales,
									type:this.queryData.type ?? 1,
									modelId:this.queryData.modelId,
									gradeType:this.queryData.gradeType ?? 1,
									content:this.queryData.content
								}
								const loading = this.$loading()
								try{
									const res = await editProductInstall(data)
									if(res.code === '000'){
										this.$message({
											showClose: true,
											message: '操作成功！',
											type: 'success'
										});
										this.goBack()
									}
									loading.close()
								}catch(e){
									loading.close()
								}
							}
						}
					});
				}
			},
			// 查看关联商品
			async relationShow(data,index){
				this.dialogIndex = index
				const loading = this.$loading()
				try{
					const res = await queryProductRelated({
						classifyId:data.classifyId,
						id:this.id ? data.id : undefined
					})
					if(res.code === '000'){
						if(res.data.relatedOuts === null){
							res.data.relatedOuts = []
						}else{
							// 所有已关联商品默认为默认选择
							for(let i in res.data.relatedOuts){
								res.data.relatedOuts[i].isDefault = 1
							}
						}
						if(res.data.notRelatedOuts === null){
							res.data.notRelatedOuts = []
						}
						
						this.relationData = res.data

						this.dialogVisible = true
					}
					loading.close()
				}catch(e){
					loading.close()
				}
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
					// this.relationData.relatedOuts.forEach(item=>item.isDefault = 0)
					this.relationData.relatedOuts.forEach(item=>item.isDefault = 1)
				}
			},
			// 设为默认
			setDefault(index){
				/* for(let i in this.relationData.relatedOuts){
					this.relationData.relatedOuts[i].isDefault = false
				}
				this.relationData.relatedOuts[index].isDefault = true */
			},
			// 提交关联修改
			relationSubmit(){
				this.dialogVisible = false
				this.classifyTags[this.dialogIndex].productNum = this.relationData.relatedOuts.length
				// this.classifyTags[this.dialogIndex].price
				
				let index = this.relationData.relatedOuts.findIndex(item=>item.isDefault)
				if(index >= 0){
					// this.classifyTags[this.dialogIndex].productName = this.relationData.relatedOuts[index].title || '未设置'
					// this.classifyTags[this.dialogIndex].productId = this.relationData.relatedOuts[index].id
					// this.classifyTags[this.dialogIndex].price = this.relationData.relatedOuts[index].price
				}else{
					this.classifyTags[this.dialogIndex].price = 0
					this.classifyTags[this.dialogIndex].productName = '未设置'
					this.classifyTags[this.dialogIndex].productId = ''
				}
				// 
				let arr = []
				for(let i in this.relationData.relatedOuts){
					arr.push(this.relationData.relatedOuts[i].title)
				}
				this.classifyTags[this.dialogIndex].productName = arr.join('；')
				// 
				this.classifyTags[this.dialogIndex].productIds = this.relationData.relatedOuts.map(item=>{
					return item.id
				})
				// console.log(this.classifyTags)
			}
		}
	}
</script>

<style scoped>
.manage-top{padding-bottom: 22px;}
.demo-ruleForm{width: 500px;}
.tab-title{display: flex;align-items: center;height: 40px;font-size: 15px;font-weight: bold;padding-bottom: 15px;}
.el-tag+.el-tag {
    margin-left: 10px;
}
.tab-content-tag{display: flex;align-items: center;margin-bottom: 16px;}
/*  */
.relation-list{display: flex;flex-wrap: wrap;}
.relation-item{display: flex;flex-direction: column;align-items: center;width: 120px;position: relative;margin: 0 10px 10px 0;}
.relation-item:nth-child(6n){margin-right: 0;}
.relation-item>i{font-size: 20px;position: absolute;right: 0;top: 0;z-index: 10;cursor: pointer;padding: 4px;}
.relation-item>i:hover{opacity: .8;}
.relation-item>span{margin-top: 6px;color: #333;font-weight: normal;font-size: 12px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;}
.relation-item>span:nth-of-type(2){font-size: 12px;color: #666;font-weight: normal;}
.relation-item>span:nth-of-type(3){font-size: 12px;color: red;font-weight: normal;}
.relation-item:hover i{color: red;}
</style>
