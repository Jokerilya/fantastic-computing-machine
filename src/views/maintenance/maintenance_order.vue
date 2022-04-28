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
                <el-option v-for="item in util.global.maintenanceStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
      <el-table-column prop="address" label="详细地址" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="cancelReason" label="取消原因" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="cancelTime" label="取消时间" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="completeTime" label="完成时间" show-overflow-tooltip width="200" align="center"></el-table-column>

      
      <el-table-column prop="contactsPeople" label="联系人" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="contactsPhone" label="联系电话" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="createTime" label="添加时间" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="deviceKnife" label="设备刀组" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="devicePlace" label="设备产地" show-overflow-tooltip width="200" align="center"></el-table-column>

      <el-table-column prop="deviceSystemName" label="设备系统名" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="deviceTypeName" label="设备类型名" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="enterpriseName" label="企业名称" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="images" label="故障图片" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <y-image :src="row.imgUrl?row.imgUrl.split(',')[0]:''" 
            :srcList="row.imgUrl?row.imgUrl.split(','):''"/>
        </template>
      </el-table-column>
      <el-table-column prop="completeImages" label="完结图片" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <y-image :src="row.completeImages?row.completeImages.split(',')[0]:''" 
            :srcList="row.completeImages?row.completeImages.split(','):''"/>
        </template>
      </el-table-column>
      <el-table-column prop="latitude" label="纬度" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="longitude" label="经度" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="num" label="设备数量" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="orderSn" label="订单编号" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="payAmount" label="订单需支付金额" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系方式" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="receiveTime" label="接单时间" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="serviceArea" label="服务区域" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="serviceTime" label="服务时间" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="simpleDesc" label="故障描述" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" show-overflow-tooltip width="200" align="center">
        <template slot-scope="{row}">
          <span :class="util.global.maintenanceStatus[row.status].class">
            {{util.global.maintenanceStatus[row.status].label}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="故障类型" show-overflow-tooltip width="200" align="center">
        <template slot-scope="{row}">
          <span :class="util.global.malfunctionType[row.type].class">
            {{util.global.malfunctionType[row.type].label}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="需求标题" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="worker" label="接单师傅" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="workerPhone" label="师傅电话" show-overflow-tooltip width="200" align="center"></el-table-column>

      <el-table-column label="操作" width="300px" fixed="right">
        <template slot-scope="{row}">
          <div class="settings">
            <el-button type="warning" size="mini" plain @click="editInit(row,['orderSn'])" :disabled="row.status != 1">分配师傅</el-button>
            <el-button type="warning" size="mini" plain @click="dispatch(row)" :disabled="row.status != 2">派遣师傅</el-button>
            <el-button type="warning" size="mini" plain @click="finishInit(row)" :disabled="row.status != 3">完结此单</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="updatePageNo"
      :current-page="page.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="page.dataNum"
      layout="total, sizes, prev, pager, next, jumper" :total="page.dataSumNum">
    </el-pagination>

    <model ref="editModel" title="分配师傅接单" @ok="edit" @close="resetEditForm">
      <el-form :model="editForm" :rules="rules" ref="editForm" status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="接单人" prop="worker" style="width:calc(100% - 120px)">
            <el-input type="text" v-model="editForm.worker" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="接单人手机" prop="workerPhone" style="width:calc(100% - 120px)">
            <el-input type="number" v-model="editForm.workerPhone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </model>

    <model ref="finishModel" title="完结此单" @ok="finish" @close="resetFinishForm">
      <el-form :model="finishForm" :rules="rules" ref="finishForm" status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="订单金额" prop="payAmount" style="width:calc(100% - 120px)">
            <el-input-number  v-model="finishForm.payAmount" :precision="2" :step="0.5" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="图片" prop="completeImages" style="width:calc(100% - 120px)">
            <upload ref="finishImg" type="image/*" limit="9" :size="1024**2*2" />
        </el-form-item>
      </el-form>
    </model>
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
        courseDistriList:[],
        url: {
          query: '/admin/maintenance/queryRepairOrderList',
          queryType:'/admin/maintenance/queryDeviceTypeList',
          edit: '/admin/maintenance/orderTaking',
          dispatch: '/admin/maintenance/handleHavingOrder',
          finish: '/admin/maintenance/handleCompleteOrder'
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
      }
    },
    methods: {
      querySelectData(){
        this.loading = true;
        this.$axios.post(this.url.queryType).then(( {data} ) => {
          this.typeData = data
        }).catch(function (error) {
          console.info(error);
        });
        this.loading = false
      },
      dispatch(row){
        this.$axios.post(this.url.dispatch,{
          orderSn:row.orderSn
        }).then(({code,message})=>{
            this.util.message(this, code, message)
            this.resetEditForm();
            this.query();
            fn(false)
        }).catch(function (error) {
          console.info(error);
        });
      },
      
      finishInit(row) {
        this.finishForm.orderSn = row.orderSn
        this.$refs.finishModel.open()
      },
      finish(fn) {
        this.$refs.finishForm.validate(async (valid) => {
          if (valid) {
            if (this.$refs.finishImg.isNull()) {
              this.$message.error('请上传图片')
              return false
            }
            let finishImg = (await this.$refs.finishImg.uploadFile()).join(',')
            this.$refs.finishImg.reset([])
            this.$axios.post(this.url.finish, { ...this.finishForm, completeImages :finishImg }).then((data) => {
              this.util.message(this, data.code, data.message)
              this.resetFinishForm();
              this.query();
              fn(false)
            }).catch(function (error) {
              console.info(error);
            });
          } else {
            return false
          }
        });
      },
      resetFinishForm(fn) {
        if(fn)
          fn(false)
      },
    },
    mounted(){
      console.info(this.handleEdit)
    }
  }

</script>
