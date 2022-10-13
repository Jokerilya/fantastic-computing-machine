<!--维保订单详情-->
<template>
  <div class="box">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="订单详情" name="desc">
        <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <!-- <span>{{ util.global.getLabel('mainStatus',data.enterpriseMainStatus) }} - {{ util.global.getLabel('enterpriseSubStatus',data.enterpriseSubStatus) }}</span> -->
          <span>订单金额：{{ data.totalAmount }}</span>
          <span>待收款：{{ data.totalAmount }}</span>
          <span>待付款：{{ data.totalAmount }}</span>
          <!-- <span style="color:red">待定价!</span> -->
          <!-- v-if="data.orderTyper == 2" -->
          <div style="float:right">
            <el-button type="primary" size="mini" plain @click="jump2check" v-if="data.platformStatus == 0">检测定价</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              @click="srueAccomont()"
              v-if="['2204'].includes(data.enterpriseSubStatus)"
            >确认报价</el-button>
            <!-- <el-button type="primary" size="mini" plain @click="checkInit()" v-if="['2401','2403'].includes(data.enterpriseSubStatus)">订单验收</el-button> -->
            <!-- <el-button
              type="primary"
              size="mini"
              plain
              @click="platformPayInit()"
              v-if="['2306'].includes(data.enterpriseSubStatus)"
            >确认企业支付定价并打款给师傅</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              @click="platformPayInit()"
              v-if="['2502'].includes(data.enterpriseSubStatus)"
            >确认企业支付尾款</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              @click="platformPayInit()"
              v-if="data.enterpriseSubStatus=='2601' && data.masterSubStatus=='3501'"
            >打款至师傅(质保期到后)</el-button> -->
          </div>
        </div>
        <div>
          <!-- 需求信息 -->
          <el-descriptions title="需求信息">
            <el-descriptions-item label="设备产地">{{ data.devicePlace }}</el-descriptions-item>
            <el-descriptions-item label="设备类型">{{ data.deviceTypeName }}</el-descriptions-item>
            <el-descriptions-item label="设备品牌">{{ data.deviceBrand }}</el-descriptions-item>
            <el-descriptions-item label="设备系统">{{ data.deviceSystemName }}</el-descriptions-item>
            <el-descriptions-item label="设备数量">{{ data.num }}台</el-descriptions-item>
            <el-descriptions-item label="服务时间">{{ data.serviceTime }}</el-descriptions-item>
            <el-descriptions-item label="故障描述">{{ data.simpleDesc }}</el-descriptions-item>
            <el-descriptions-item label="设备视图">
              <!-- <div style="margin-bottom:10px">上传设备铝牌和故障相关照片和视频</div> -->
              <!-- <div> -->
              <el-image
                v-if="data.pictureList"
                style="width: 100px; height: 100px"
                lazy
                :src="data.pictureList[0]"
                :preview-src-list="data.pictureList"
              ></el-image>
              <video v-for="item in data.videoList" :key="item" :src="item"></video>
              <!-- </div> -->
            </el-descriptions-item>
          </el-descriptions>
          <!-- <div class="inhoudskop ">需求信息</div>
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
          </el-row>-->
          <el-descriptions title="企业联系方式">
            <el-descriptions-item label="企业名称">{{ data.enterpriseName }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ data.contactsPeople }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ data.phone }}</el-descriptions-item>
            <el-descriptions-item label="联系地址">{{ data.address }}</el-descriptions-item>
            <el-descriptions-item label="距离约">{{ data.distance }}km</el-descriptions-item>
          </el-descriptions>
          <el-descriptions title="师傅联系方式" v-if="data.enterpriseMainStatus>1">
            <el-descriptions-item label="联系人">{{ data.masterRealName }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ data.masterPhone }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- 故障解决方案 -->
        <el-descriptions title="故障解决方案" v-if="data.enterpriseMainStatus > 2" :column="1">
          <el-descriptions-item
            v-for="(item,index) in data.programmeList"
            :key="item.desc+index"
            :label="'解决方案'+(index+1)"
          >
            <el-row
              :gutter="20"
              v-for="(item,index) in data.programmeList"
              :key="item.desc+index"
              style="font-size:12px !important"
            >
              <el-col :span="24">
                <span>故障描述：</span>
                {{ item.desc }}
              </el-col>
              <el-col :span="24">
                <span>维保方案：</span>
                {{ item.analysis }}
              </el-col>
              <el-col :span="24">
                <span>维保方案:</span>
                {{ item.programme }}
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
        <!-- <div v-if="data.enterpriseMainStatus > 2">
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
              <span>维保方案:</span>
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
        </div>-->
        <!-- 配件明细 -->
        <el-descriptions title="配件明细" v-if="data.enterpriseMainStatus > 2" :column="1">
          <el-descriptions-item
            v-for="(item,index) in data.programmeList"
            :key="item.desc+index"
            :label="'配件'+(index+1)"
          >
            <div
              v-for="(item,index) in data.partsList"
              :key="item.name+index"
              style="font-size:12px !important"
            >
              {{item.name}}
              {{item.price}}元
              {{item.num}}
              {{item.unit}}
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="交付方案" v-if="data.enterpriseMainStatus > 2" :column="1">
          <el-descriptions-item label="完工信息">
            <div :gutter="20" v-for="(item) in data.completePictureList" :key="item">
              <img :src="item" style="height:100px" />
            </div>
            <div :gutter="20" v-for="(item) in data.completeVideoList" :key="item">
              <video :src="item" style="height:100px"></video>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="订单费用" v-if="data.enterpriseMainStatus > 2" :column="1">
          <!-- <el-descriptions-item v-for="(item,index) in data.programmeList" :key="item.desc+index" :label="'解决方案'+(index+1)"> -->
          <el-descriptions-item label="维保预付" v-if="data.depositAmount">{{ data.depositAmount }}</el-descriptions-item>
          <el-descriptions-item label="维保报价">{{ data.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="上门费用">{{ data.doorAmount }}</el-descriptions-item>
          <el-descriptions-item label="技术服务费">{{ data.technologyAmount }}</el-descriptions-item>
          <el-descriptions-item label="配件费">{{ data.partsAmount }}</el-descriptions-item>
          <el-descriptions-item label="其他费用">{{ data.otherAmount }}</el-descriptions-item>
          <!-- </el-descriptions-item> -->
        </el-descriptions>
        <!-- <div v-if="data.enterpriseMainStatus > 2">
          <el-row :gutter="20">
            <el-col :span="24">
              订单费用
            </el-col>
            <el-col :span="24">
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
        </div>-->
      </el-tab-pane>
      <!-- <el-tab-pane label="收付款" name="receiving">
        <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{ util.global.getLabel('mainStatus',data.enterpriseMainStatus) }}</span>
          <span>订单金额：{{ data.totalAmount }}</span>
          <span>待收款：{{ data.totalAmount }}</span>
          <span>待付款：{{ data.totalAmount }}</span>{{data.enterpriseSubStatus}}
          <div style="float:right">
            <el-button type="primary" size="mini" plain @click="platformPayInit()" v-if="['2306','2502'].includes(data.enterpriseSubStatus)">确认企业支付定价并打款给师傅/尾款</el-button>
            <el-button type="primary" size="mini" plain @click="platformPayInit()" v-if="data.enterpriseSubStatus=='2601'">打款师傅</el-button>
          </div>
        </div>
      </el-tab-pane>-->
      <el-tab-pane label="操作日志" name="log">
        <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{ util.global.getLabel('mainStatus',data.enterpriseMainStatus) }}</span>
        </div>
        <el-table :data="data.orderTrackOutList" border style="width: 100%">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="simpleDesc" label="描述"></el-table-column>
          <el-table-column fixed prop="operator" label="业务触发方">
            <template slot-scope="{row}">{{ util.global.getLabel('operator',row.operator) }}</template>
          </el-table-column>
          <el-table-column prop="type" label="状态所属方">
            <template slot-scope="{row}">{{ util.global.getLabel('operator',row.type) }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="触发时间"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <model ref="quotationForm" title="确认报价" @ok="sumbitQuotation" @close="resetQuotationForm">
      <el-form :model="quotationForm" status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="状态" prop="status" style="width:calc(100% - 120px)">
          <el-radio-group v-model="quotationForm.status">
            <el-radio
              v-for="item in util.global.rejectStatus"
              :key="item.label"
              :label="item.value"
              @change="changeStuta(item)"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="rejectReason" style="width:calc(100% - 120px)">
          <el-input type="text" v-model="quotationForm.rejectReason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </model>

    <model ref="checkForm" title="确认验收" @ok="sumbitCheck" @close="resetCheckForm">
      <el-form :model="checkForm" status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="状态" prop="status" style="width:calc(100% - 120px)">
          <el-radio-group v-model="checkForm.status">
            <el-radio
              v-for="item in util.global.rejectStatus"
              :key="item.label"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="rejectReason" style="width:calc(100% - 120px)">
          <el-input type="text" v-model="checkForm.rejectReason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </model>

    <model ref="platform" title="打款信息" @ok="sumbitPlatformPay()" @close="resetPlatformPay">
      <el-form status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="师傅卡号" style="width:calc(100% - 120px)">{{data.bankCode}}</el-form-item>
        <el-form-item label="所属银行" style="width:calc(100% - 120px)">{{data.bankName}}</el-form-item>
        <!-- 请核实打款信息，再点击确认按钮 -->
      </el-form>
    </model>
  </div>
</template>
<style lang="less" scoped>
.box {
  width: 100%;
  height: 100vh;
  overflow: auto;
  background: #fff;
}
.el-tabs__content {
  overflow: auto;
  height: 88vh;
}
.big_title {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid #666;
  margin-bottom: 10px;
  span {
    margin-right: 20px;
  }
}
/deep/.el-row {
  font-size: 16px !important;
}
/deep/.el-col {
  margin: 5px 0;
  > span {
    flex: 0 0 120px;
    text-align: start;
  }
}
.inhoudskop {
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  font-weight: 600;
  margin: 10px 0;
  border-bottom: 1px solid #666;
}
.flex {
  width: 200px;
  display: flex;
  justify-content: space-between;
}
/deep/.el-tabs__content {
  overflow: auto;
  height: 88vh;
}
</style>
<script>
import { getRepairOrderDetail } from "@/api/user.js";
import { examineMasterQuotation } from "@/api/order.js";
export default {
  title: "maintenance_order_desc",
  data() {
    return {
      orderSn: "",
      data: {},
      activeName: "desc",
      status: "",
      url: {
        handleMasterQuotation: "/admin/maintenance/handleMasterQuotation", // 企业确认报价
        handleConfirmDeposit: "/admin/maintenance/handleConfirmDeposit", // 企业确认支付定金/尾款
        handleEnterpriseCheck: "/admin/maintenance/handleEnterpriseCheck", // 企业验收
        handleConfirmDepositToMaster:
          "/admin/maintenance/handleConfirmDepositToMaster", // 平台确认企业定金并打款给师傅/平台确认企业支付尾款
        handleConfirmBalanceToMaster:
          "/admin/maintenance/handleConfirmBalanceToMaster" // 平台打款至师傅(质保期已到)
      },
      quotationForm: {
        rejectReason: ""
      },
      checkForm: {
        rejectReason: ""
      }
    };
  },
  methods: {
    changeStuta(e) {
      console.log(e);
      if (e.value == 1) {
        this.status = 2;
      } else {
        this.status = 3;
      }
      console.log(this.status);
    },
    srueAccomont() {
      this.$refs.quotationForm.open();
    },
    sumbitQuotation(fn) {
      let data = {  
        orderSn: this.orderSn,
        status: this.status,
        rejectReason:this.quotationForm.rejectReason
      };
      examineMasterQuotation(data).then(res => {
        if (res.success) {
          console.log("审核", res);
          this.$message({
            showClose: true,
            message: res.message,
            type: "success"
          });
        }
      });
    },
    // init() {
    //   this.$axios
    //     .get(
    //       "/admin/maintenance/getRepairOrderDetail?enterpriseOrderSn=" +
    //         location.hash.split("?enterpriseOrderSn=")[1]
    //     )
    //     .then(({ data }) => {
    //       this.data = data;
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // },
    // 显示企业报价弹框
    quotationInit() {
      this.quotationForm = {
        enterpriseOrderSn: this.data.orderSn,
        status: "0"
      };
      this.$refs.quotationForm.open();
    },
    // sumbitQuotation(fn) {
    //   if (
    //     this.quotationForm.status == "0" &&
    //     !this.quotationForm.rejectReason
    //   ) {
    //     this.$message.error("请输入驳回原因");
    //     return;
    //   }
    //   this.$axios
    //     .post(this.url.handleMasterQuotation, this.quotationForm)
    //     .then(data => {
    //       if (data.code == "000") {
    //         this.$message({
    //           showClose: true,
    //           message: data.message,
    //           type: "success"
    //         });
    //         this.resetQuotationForm(fn);
    //       }
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });

    // },
    resetQuotationForm(fn) {
      this._getRepairOrderDetail()
      fn(false);
    },
    jump2check() {
      this.$router.push({
        name: "checkPricing",
        query: { orderSn: this.data.orderSn }
      });
    },
    pay() {
      this.$axios
        .post(this.url.handleConfirmDeposit, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1],
          // type (integer, optional): 类型: 1 定金 2 尾款
          type: this.data.enterpriseSubStatus == 2305 ? 1 : 2
        })
        .then(data => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success"
            });
            this._getRepairOrderDetail()
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 显示企业报价弹框
    checkInit() {
      this.checkForm = {
        enterpriseOrderSn: this.data.orderSn,
        status: "0"
      };
      this.$refs.checkForm.open();
    },
    sumbitCheck(fn) {
      if (this.checkForm.status == "0" && !this.checkForm.rejectReason) {
        this.$message.error("请输入驳回原因");
        return;
      }
      this.$axios
        .post(this.url.handleEnterpriseCheck, this.checkForm)
        .then(data => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success"
            });
            this.resetCheckForm(fn);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    resetCheckForm(fn) {
      this._getRepairOrderDetail()
      fn(false);
    },
    handleConfirmDepositToMaster(fn) {
      this.$axios
        .post(this.url.handleConfirmDepositToMaster, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1],
          type: this.data.enterpriseSubStatus == "2306" ? 1 : 2
        })
        .then(data => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success"
            });
          }
          this.resetPlatformPay(fn);
        })
        .catch(err => {
          console.error(err);
        });
    },
    platformPayInit() {
      if (this.data.enterpriseSubStatus != "2502") {
        this.$refs.platform.open();
      } else {
        this.handleConfirmDepositToMaster();
      }
    },
    sumbitPlatformPay(fn) {
      if (this.data.enterpriseSubStatus == "2601") {
        this.remit(fn);
      } else {
        this.handleConfirmDepositToMaster(fn);
      }
    },
    resetPlatformPay(fn) {
      this._getRepairOrderDetail()
      fn(false);
    },
    _getRepairOrderDetail() {
      let params = {
        enterpriseOrderSn: this.orderSn
      };
      getRepairOrderDetail(params).then(res => {
        console.log("订单详情", res);
        if (res.success) {
          this.data = res.data;
          this.$message({
            showClose: true,
            message: res.message,
            type: "success"
          });
        }
      });
    },
    remit(fn) {
      this.$axios
        .post(this.url.handleConfirmBalanceToMaster, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1]
        })
        .then(data => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success"
            });
          }
          this.resetPlatformPay(fn);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted() {
    this._getRepairOrderDetail()
    console.info(this.$store);
  },
  created() {
    this.orderSn = this.$route.query.orderSn;
    console.log("订单号", this.orderSn);
    this._getRepairOrderDetail();
  }
};
</script>