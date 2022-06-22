<!--维保订单-->
<template>
	<div class="app-container">
		<div class="manage-top">
			<el-form :model="searchForm" ref="ruleForm" label-width="88px" class="rule-form" label-position="right">
				<el-row :gutter="20">
					<el-col :span="5">
						<el-form-item label="设备类型">
              <el-select v-model="searchForm.deviceTypeId" placeholder="请选择">
                <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
					<el-col :span="5">
						<el-form-item label="订单状态">
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option v-for="item in util.global.mainStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
					<el-col :span="5">
            <el-button icon="el-icon-zoom-in" plain type="primary" @click="query()">查询</el-button>
            <el-button icon="el-icon-refresh" plain type="info" @click="reset()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
		<div style="height: 16px;"></div>
    <el-table highlight-current-row v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading" :data="dataList" style="width: 100%;">
      <el-table-column prop="orderSn" label="订单编号" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="simpleDesc" label="故障描述" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="deviceBrand" label="设备品牌" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="devicePlace" label="设备产地" show-overflow-tooltip width="150" align="center"></el-table-column>
      <el-table-column prop="deviceSystemName" label="设备系统名" show-overflow-tooltip width="150" align="center"></el-table-column>
      <el-table-column prop="deviceTypeName" label="设备类型名" show-overflow-tooltip width="150" align="center"></el-table-column>
      <el-table-column prop="num" label="设备数量" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="modalityType" label="维保模式" show-overflow-tooltip width="200" align="center">
        <template slot-scope="{row}">
          {{ util.global.getLabel('modalityType',row.modalityType) }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="故障类型" show-overflow-tooltip width="200" align="center">
        <template slot-scope="{row}">
          {{ util.global.getLabel('malfunctionType',row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="enterpriseName" label="企业名称" show-overflow-tooltip width="100" align="center"></el-table-column>
      <el-table-column prop="address" label="详细地址" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="contactsPeople" label="联系人" show-overflow-tooltip width="150" align="center"></el-table-column>
      <el-table-column prop="contactsPhone" label="联系电话" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="depositAmount" label="定金" show-overflow-tooltip width="100" align="center"></el-table-column>
      <el-table-column prop="balanceAmount" label="尾款" show-overflow-tooltip width="150" align="center"></el-table-column>
      <el-table-column prop="rejectReason" label="驳回原因" show-overflow-tooltip width="150" align="center"></el-table-column>
      <el-table-column prop="mainStatus" label="状态" show-overflow-tooltip width="150" align="center" fixed="right">
         <template slot-scope="{row}">
          {{ util.global.getLabel('mainStatus',row.mainStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" show-overflow-tooltip width="150" align="center" fixed="right" ></el-table-column>
      <el-table-column label="操作" width="300px" fixed="right">
        <template slot-scope="{row}">
          <div class="settings">
            <el-button type="info" size="mini" plain @click="queryDesc(row)">查看详情</el-button>
            <el-button type="info" size="mini" plain @click="querySnatchList(row)" :disabled="row.mainStatus<=0">抢单列表</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="updatePageNo"
      :current-page="page.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="page.dataNum"
      layout="total, sizes, prev, pager, next, jumper" :total="page.dataSumNum">
    </el-pagination>

    <model ref="snatch" title="抢单列表" :isSubmit="false" :column="2" @close="closeSnatch">
      <el-table highlight-current-row v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" border
        element-loading-spinner="el-icon-loading" :data="snatchList" style="width: 100%;">
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip width="160" align="center"></el-table-column>
        <el-table-column prop="industryExperience" label="行业经验" show-overflow-tooltip width="160" align="center"></el-table-column>
        <el-table-column prop="industryExperienceImages" label="行业经验照片" show-overflow-tooltip width="160" align="center">
          <template slot-scope="{row}">
            <el-image style="width: 80px; height: 80px" :src="row.industryExperienceImages.split(',')[0]" :preview-src-list="row.industryExperienceImages.split(',')"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="orderSn" label="订单编号" show-overflow-tooltip width="160" align="center"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" show-overflow-tooltip width="160" align="center"></el-table-column>
        <el-table-column prop="realPortrait" label="真实头像" show-overflow-tooltip width="160" align="center">
          <template slot-scope="{row}">
            <el-image style="width: 80px; height: 80px" :src="row.realPortrait.split(',')[0]" :preview-src-list="row.realPortrait.split(',')"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="serviceAreas" label="服务地区" width="240" align="center">
          <template slot-scope="{row}">
            <el-tag effect="plain" v-for="item in row.serviceAreas.split(',')" :key="item">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serviceTypes" label="服务类型" width="240" align="center">
          <template slot-scope="{row}">
            <el-tag effect="plain" v-for="item in row.serviceTypes.split(',')" :key="item">
              {{getType(item)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skillCertificateImages" label="技能证书图书" show-overflow-tooltip width="160" align="center">
          <template slot-scope="{row}">
            <el-image style="width: 80px; height: 80px" :src="row.skillCertificateImages.split(',')[0]" :preview-src-list="row.skillCertificateImages.split(',')"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px" fixed="right">
          <template slot-scope="{row}">
            <div class="settings">
              <el-button type="primary" size="mini" plain :disabled="param.mainStatus!=1" @click="assign(row.orderSn)">指派师傅</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </model>
    <!-- <model ref="editModel" title="分配师傅接单" @ok="edit" @close="resetEditForm">
      <el-form :model="editForm" :rules="rules" ref="editForm" status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="接单人" prop="worker" style="width:calc(100% - 120px)">
            <el-input type="text" v-model="editForm.worker" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="接单人手机" prop="workerPhone" style="width:calc(100% - 120px)">
            <el-input type="number" v-model="editForm.workerPhone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </model> -->
  </div>
</template>
<style lang="less" scoped>

</style>
<script>
  import tableMixin from '@/mixin/table'
  export default {
    title: 'course',
    mixins: [tableMixin],
    data() {
      return {
        loading: false,
        typeData:[],
        courseList:[],
        snatchList:[],
        courseDistriList:[],
        url: {
          query: '/admin/maintenance/queryRepairOrderList',
          queryType:'/admin/maintenance/queryDeviceTypeList',
          querySnatch:'/admin/maintenance/queryMasterGrabOrderList',
          assign:'/admin/maintenance/handleAssignMaster',
          handleMasterQuotation: '/admin/maintenance/handleMasterQuotation'
        },
        rules: {
          worker: [{
            required: true,
            message: '请输入接单人',
            trigger: 'blur'
          }],
          workerPhone: [{
            required: true,
            message: '请输入接单人手机',
            trigger: 'blur'
          }],
        },
        finishForm:{
          payAmount:0
        },
        param:{},
        quotationForm:{},
      }
    },
    methods: {
      queryDesc(row){
        this.$router.push('/maintenance/maintenance_order_desc?enterpriseOrderSn='+row.orderSn)
      },
      querySelectData(){
        this.loading = true;
        this.$axios.post(this.url.queryType).then(( {data} ) => {
          this.typeData = data
        }).catch(function (error) {
          console.info(error);
        });
        this.loading = false
      },
      querySnatchList({orderSn:enterpriseOrderSn,mainStatus}){
        this.param = {
          mainStatus : mainStatus,
          enterpriseOrderSn : enterpriseOrderSn
        }
        this.$axios.get(this.url.querySnatch+"?enterpriseOrderSn="+enterpriseOrderSn).then(({data})=>{
          this.snatchList = data
          this.$refs.snatch.open()
        }).catch((error)=>{
          console.error(error)
        })
      },
      closeSnatch(fn){
        fn(false)
      },
      assign(masterOrderSn){
        this.$axios.post(this.url.assign,{
          enterpriseOrderSn : this.param.enterpriseOrderSn,
          masterOrderSn: masterOrderSn
        }).then((data)=>{
          if(data.code == '000'){
            this.$message({
              showClose: true,
              message: data.message,
              type: 'success'
            });
            this.$refs.snatch.close()
            this.query()
          }
        }).catch((err)=>{
          console.error(err)
        })
      },
      getType(val) {
        return this.typeData.filter((item)=>{
          if(item.id == val){
            return item
          }
        })[0].name
      }
    }
  }

</script>
