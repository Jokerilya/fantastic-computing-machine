<!--维保订单详情-->
<template>
  <div class="box">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="订单详情" name="desc">
        <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{ util.global.getLabel('mainStatus',data.enterpriseMainStatus) }}</span>
          <div style="float:right">
            <el-button type="primary" size="mini" plain @click="quotationInit()" v-if="data.enterpriseMainStatus==3">确认报价</el-button>
            <el-button type="primary" size="mini" plain @click="quotationInit()" v-if="data.enterpriseMainStatus==4">确认报价</el-button>
          </div>
        </div>
        <!-- 需求信息 -->
        <div>
          <div class="inhoudskop ">需求信息</div>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>设备产地：</span>
              {{ data.devicePlace }}
            </el-col>
            <el-col :span="4">
              <span>设备类型：</span>
              {{ data.deviceTypeName }}
            </el-col>
            <el-col :span="4">
              <span>设备品牌：</span>
              {{ data.deviceBrand }}
            </el-col>
            <el-col :span="4">
              <span>设备系统：</span>
              {{ data.deviceSystemName }}
            </el-col>
            <el-col :span="4">
              <span>设备数量：</span>
              {{ data.num }}
            </el-col>
            <el-col :span="4">
              <span>服务时间：</span>
              {{ data.serviceTime }}
            </el-col>
            <el-col :span="24">
              <span>故障描述：</span>
              {{ data.simpleDesc }}
            </el-col>
            <el-col :span="24" style="display:flex;">
              <span>设备视图：</span>
              <div>
                <div style="margin-bottom:10px">上传设备铝牌和故障相关照片和视频</div>
                <div>
                  <el-image v-if="data.pictureList" style="width: 100px; height: 100px" lazy :src="data.pictureList[0]" :preview-src-list="data.pictureList"></el-image>
                  <video v-for="item in data.videoList" :key="item" :src="item"></video>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-descriptions title="企业联系方式">
              <el-descriptions-item label="企业名称"> {{ data.enterpriseName }} </el-descriptions-item>
              <el-descriptions-item label="联系人"> {{ data.contactsPeople }} </el-descriptions-item>
              <el-descriptions-item label="联系电话"> {{ data.phone }} </el-descriptions-item>
              <el-descriptions-item label="联系地址"> {{ data.address }} </el-descriptions-item>
              <el-descriptions-item label="距离约"> {{ data.distance }}km </el-descriptions-item>
          </el-descriptions>
          <el-descriptions title="师傅联系方式" v-if="data.enterpriseMainStatus>1">
              <el-descriptions-item label="联系人"> {{ data.contactsPeople }} </el-descriptions-item>
              <el-descriptions-item label="联系电话"> {{ data.phone }} </el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- 故障解决方案 -->
        <div v-if="data.enterpriseMainStatus > 2">
          <div class="inhoudskop">
            故障解决方案
          </div>
          <el-row :gutter="20" v-for="(item,index) in data.programmeList" :key="item.desc+index">
            <el-col :span="24">
              解决方案{{index+1}}：
            </el-col>
            <el-col :span="8">
              <span>故障描述：</span>
              {{ item.desc }}
            </el-col>
            <el-col :span="8">
              <span>维保方案：</span>
              {{ item.analysis }}
            </el-col>
            <el-col :span="8">
              <span>设备产地</span>
              {{ item.programme }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>维保大小：</span>
              {{ util.global.getLabel('modalityType',data.modalityType) }}
            </el-col>
            <el-col :span="4">
              <span>质保周期：</span>
              {{ data.warrantyTime }}/天
            </el-col>
            <el-col :span="4">
              <span>预计完成日期：</span>
              {{ data.estimateServiceTime }}
            </el-col>
          </el-row>
          <div>
            完工照片：
            {{ data.completePictureList }}
            {{ data.completeVideoList }}
          </div>
        </div>
        <!-- 配件明细 -->
        <div v-if="data.enterpriseMainStatus > 2">
          <div v-if="data.partsList" class="inhoudskop">
            配件明细
          </div>
          <div v-for="(item,index) in data.partsList" :key="item.name+index">
            {{item.name}}
            {{item.price}}元
            {{item.num}}
            {{item.unit}}
          </div>
          <el-row :gutter="20">
            <el-col :span="24">
              订单费用
            </el-col>
            <el-col :span="24" v-if="data.depositAmount">
              <span>维保预付</span>
              <div>¥{{ data.depositAmount }}</div>
            </el-col>
            <el-col :span="24">
              <span>维保报价</span>
              <div>
                <div>¥{{ data.totalAmount }}</div>
                <div class="flex">
                  <div>上门费用</div>
                  <div>¥{{ data.doorAmount }}</div>
                </div>
                <div class="flex">
                  <div>技术服务费</div>
                  <div>¥{{ data.technologyAmount }}</div>
                </div>
                <div class="flex">
                  <div>配件费</div>
                  <div>¥{{ data.partsAmount }}</div>
                </div>
                <div class="flex">
                  <div>其他费用</div>
                  <div>¥{{ data.otherAmount }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收付款" name="receiving">
        <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{ util.global.getLabel('mainStatus',data.enterpriseMainStatus) }}</span>
          <span>订单金额：{{ data.totalAmount }}</span>
          <span>待收款：{{ data.totalAmount }}</span>
          <span>待付款：{{ data.totalAmount }}</span>
        </div>
        
        
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log">
        <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{ util.global.getLabel('mainStatus',data.enterpriseMainStatus) }}</span>
        </div>
        <el-table :data="data.OrderTrackOut" border style="width: 100%">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="simpleDesc" label="描述"></el-table-column>
          <el-table-column fixed prop="operator" label="业务触发方">
            <template slot-scope="{row}">
              {{ util.global.getLabel('operator',row.operator) }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="状态所属方">
            <template slot-scope="{row}">
              {{ util.global.getLabel('operator',row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px" fixed="right">
              <template slot-scope="{row}">
                  <el-button type="text" size="small">查看</el-button>
                  <el-button type="text" size="small">编辑</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>


    <model ref="quotationForm" title="确认报价" @ok="sumbitQuotation" @close="resetQuotationForm">
      <el-form :model="quotationForm" :rules="rules" status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="状态" prop="status" style="width:calc(100% - 120px)">
          <el-radio-group v-model="quotationForm.status">
            <el-radio v-for="item in util.global.rejectStatus" :key="item.label" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="rejectReason" style="width:calc(100% - 120px)">
            <el-input type="text" v-model="quotationForm.rejectReason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </model>
  </div>
</template>
<style lang="less" scoped>
  .box {
    width: 100%;
    height: 100vh;
    background: #FFF;
  }
  .big_title{
    color: #333;
    font-size: 18px;
    font-weight: 600;
    height: 40px;
    line-height: 40px;
    border-bottom: 2px solid #666;
    margin-bottom: 10px;
    span{
      margin-right: 20px;
    }
  }
  /deep/.el-row{
    font-size: 16px !important;
  }
  /deep/.el-col{
    margin: 5px 0;
    >span{
      flex: 0 0 120px;
      text-align: start;
    }
  }
  .inhoudskop{
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    font-weight:600;
    margin: 10px 0;
    border-bottom: 1px solid #666;
  }
  .flex{
    width: 200px;
    display: flex;
    justify-content: space-between;
  }
</style>
<script>
  export default {
    title: 'maintenance_order_desc',
    data() {
      return {
        data: {},
        activeName: 'desc',
        url: {
          handleMasterQuotation: '/admin/maintenance/handleMasterQuotation'
        },
        quotationForm:{},
      }
    },
    methods: {
      init() {
        this.$axios.get('/admin/maintenance/getRepairOrderDetail?enterpriseOrderSn=' + location.hash.split(
          '?enterpriseOrderSn=')[1]).then(({data}) => {
          this.data = data
        }).catch((err) => {
          console.error(err)
        })
      },
      // 显示企业报价弹框
      quotationInit(){
        this.quotationForm = {
          enterpriseOrderSn: this.data.orderSn,
          status: "0"
        }
        this.$refs.quotationForm.open()
      },
      sumbitQuotation(fn){
        this.$axios.post(this.url.handleMasterQuotation,this.quotationForm).then((data)=>{
          if(data.code == '000'){
            this.$message({
              showClose: true,
              message: data.message,
              type: 'success'
            });
            this.resetQuotationForm(fn)
          }
        }).catch((err)=>{
          console.error(err)
        })
      },
      resetQuotationForm(fn){
        this.init()
        fn(false)
      }
    },
    mounted() {
      this.init()
    }
  }
</script>