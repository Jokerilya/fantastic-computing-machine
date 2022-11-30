<!--维保订单详情-->
<template>
  <div class="box">
    <el-tabs v-model="activeName" type="border-card">
      <!-- 订单详情页面 -->
      <el-tab-pane label="订单详情" name="desc">
        <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span
            >订单金额：<span style="color:red ;">{{
              data.totalAmount
            }}</span></span
          >
          <div style="float:right">
            <el-button
              type="primary"
              size="mini"
              plain
              @click="jump2check"
              v-if="data.platformStatus == 0 && data.enterpriseMainStatus >= 0"
              >检测定价</el-button
            >
            <el-button
              type="primary"
              size="mini"
              plain
              @click="sumbitQuotation()"
              v-if="['2204'].includes(data.enterpriseSubStatus)"
              >确认报价</el-button
            >
            <!-- <el-button type="primary" size="mini" plain @click="platformPayInit()">打款至师傅</el-button> -->
            <el-button
              type="primary"
              size="mini"
              plain
              @click="_changePayment()"
              v-if="data.masterSubStatus < 3502 && data.masterSubStatus > 0"
              >修改报价</el-button
            >
            <el-button
              type="primary"
              size="mini"
              plain
              @click="_cancelRepairOrder()"
              v-if="
                data.enterpriseMainStatus > -1 && data.enterpriseMainStatus <= 3
              "
              >取消订单</el-button
            >
            <el-button
              type="primary"
              size="mini"
              plain
              @click="_handleMasterPayment()"
              v-if="['3502'].includes(data.masterSubStatus)"
              >打款至师傅</el-button
            >
          </div>
        </div>

        <div class="information">
          <!-- 需求信息+企业信息 -->
          <div class="oneline">
            <div class="item1">需求信息:</div>
            <div class="item2">
              <div v-if="data.no">
                设备编码: <span>{{ data.no }}</span>
              </div>
              <div>
                设备产地: <span>{{ data.devicePlace }}</span>
              </div>
              <div>
                设备类型: <span>{{ data.deviceTypeName }}</span>
              </div>
              <div>
                设备品牌: <span>{{ data.deviceBrand }}</span>
              </div>
              <div>
                设备数量: <span>{{ data.num }}台</span>
              </div>
              <div>
                设备系统: <span>{{ data.deviceSystemName }}</span>
              </div>
              <div>
                服务时间: <span>{{ data.serviceTime }}</span>
              </div>
            </div>
            <div class="item3">企业信息:</div>
            <div class="item4">
              <div>
                企业名称: <span>{{ data.enterpriseName }}</span>
              </div>
              <div>
                联系人: <span>{{ data.contactsPeople }}</span>
              </div>
              <div>
                联系电话: <span>{{ data.phone }}</span>
              </div>
              <div>
                联系地址: <span>{{ data.address }}</span>
              </div>
            </div>
          </div>
          <!-- 故障描述 -->
          <div class="twoline">
            <div class="title">故障描述:</div>
            <div class="content">{{ data.simpleDesc }}</div>
          </div>
          <!-- 故障类型 -->
          <div class="twoline">
            <div class="title">故障类型:</div>
            <div class="content">{{ data.type }}</div>
          </div>
          <!-- 设备视图 -->
          <div class="threeline">
            <div class="title">设备视图:</div>
            <div>
              <video
                style="margin-right:40px;"
                width="300px"
                height="300px"
                v-for="item in data.videoList"
                :key="item"
                :src="item"
                controls="true"
              ></video>
            </div>
          </div>
          <!-- 故障解决方案 -->
          <div class="fourline"></div>
        </div>

        <!-- 之前的版本需求信息 -->
        <!-- <el-descriptions title="需求信息">
            <el-descriptions-item label="设备编码" v-if="data.no">{{
              data.no
            }}</el-descriptions-item>
            <el-descriptions-item label="设备产地">{{
              data.devicePlace
            }}</el-descriptions-item>
            <el-descriptions-item label="设备类型">{{
              data.deviceTypeName
            }}</el-descriptions-item>
            <el-descriptions-item label="设备品牌">{{
              data.deviceBrand
            }}</el-descriptions-item>
            <el-descriptions-item label="设备系统">{{
              data.deviceSystemName
            }}</el-descriptions-item>
            <el-descriptions-item label="设备数量"
              >{{ data.num }}台</el-descriptions-item
            >
            <el-descriptions-item label="服务时间">{{
              data.serviceTime
            }}</el-descriptions-item>
            <el-descriptions-item label="故障描述">{{
              data.simpleDesc
            }}</el-descriptions-item>
            <el-descriptions-item label="故障类型">{{
              data.type
            }}</el-descriptions-item>
            <el-descriptions-item label=""></el-descriptions-item>
            <el-descriptions-item label="设备视图">
              <el-image
                v-if="data.pictureList"
                style="width: 100px; height: 100px"
                lazy
                :src="data.pictureList[0]"
                :preview-src-list="data.pictureList"
              ></el-image>
              <video
                v-for="item in data.videoList"
                :key="item"
                :src="item"
              ></video>
            </el-descriptions-item>
          </el-descriptions> -->
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
        <!-- <el-descriptions title="企业联系方式">
            <el-descriptions-item label="企业名称">{{
              data.enterpriseName
            }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{
              data.contactsPeople
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              data.phone
            }}</el-descriptions-item>
            <el-descriptions-item label="联系地址">{{
              data.address
            }}</el-descriptions-item>
            <el-descriptions-item label="距离约"
              >{{ data.distance }}km</el-descriptions-item
            >
          </el-descriptions> -->
        <!-- <el-descriptions
            title="师傅联系方式"
            v-if="data.enterpriseMainStatus > 1"
          >
            <el-descriptions-item label="联系人">{{
              data.masterRealName
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              data.masterPhone
            }}</el-descriptions-item>
          </el-descriptions> -->

        <!-- 故障解决方案 -->
        <el-descriptions title="故障解决方案" v-if="judgeFault()" :column="1">
          <el-descriptions-item
            v-for="(item, index) in data.programmeList"
            :key="item.desc + index"
            :label="'解决方案'"
          >
            <el-row style="font-size:12px !important">
              <el-col :span="24">
                <span>故障描述：</span>
                {{ item.desc }}
              </el-col>
              <el-col :span="24">
                <span>故障分析：</span>
                {{ item.analysis }}
              </el-col>
              <el-col :span="24">
                <span>维保方案:</span>
                {{ item.programme }}
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 时间 -->
        <div v-if="data.warrantyTime">
          <div class="inhoudskop">
            时间
          </div>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>质保周期：</span>
              {{ data.warrantyTime }}/天
            </el-col>
            <el-col :span="8" v-if="data.estimateServiceTime">
              <span>预计完成日期：</span>
              {{ data.estimateServiceTime }}
            </el-col>
          </el-row>
        </div>

        <!-- 配件明细 -->
        <el-descriptions title="配件明细" v-if="judgeParts()" :column="1">
          <el-descriptions-item
            v-for="(item, index) in data.partsList"
            :key="item.desc + index"
            :label="'配件' + (index + 1)"
          >
            <div
              v-for="(item, index) in data.partsList"
              :key="item.name + index"
              style="font-size:12px !important"
            >
              （名称） {{ item.name }} ￥{{ item.price }} （数量）
              {{ item.num }}
              {{ item.unit }}
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 完工信息 -->
        <el-descriptions
          title="完工信息"
          v-if="data.completePictureList"
          :column="1"
        >
          <el-descriptions-item>
            <el-image
              v-if="data.completePictureList"
              style="width: 300px; height: 300px"
              lazy
              :src="data.completePictureList[1]"
              :preview-src-list="data.completePictureList"
            ></el-image>
            <video
              width="300px"
              height="300px"
              v-for="item in data.videoList"
              :key="item"
              :src="item"
            ></video>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 订单费用 -->
        <div class="information" v-if="judgeOrderCost()">
          <div class="oneline">
            <div class="item1">订单费用:</div>
            <div class="item2">
              <div>
                上门费用: <span>￥{{ data.doorAmount }}.00</span>
              </div>
              <div>
                技术服务费: <span>￥{{ data.technologyAmount }}.00</span>
              </div>
              <div>
                配件费: <span>￥{{ data.partsAmount }}.00</span>
              </div>
              <div>
                其他费用: <span>￥{{ data.otherAmount }}.00</span>
              </div>
              <div>
                合计:
                <span style="color: red;"
                  >￥{{
                    data.doorAmount +
                      data.technologyAmount +
                      data.partsAmount +
                      data.otherAmount
                  }}.00</span
                >
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 操作日志页面 -->
      <el-tab-pane label="操作日志" name="log">
        <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{
            util.global.getLabel("mainStatus", data.enterpriseMainStatus)
          }}</span>
        </div>
        <el-table :data="data.orderTrackOutList" border style="width: 100%">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="simpleDesc" label="描述"></el-table-column>
          <el-table-column fixed prop="operator" label="业务触发方">
            <template slot-scope="{ row }">{{
              util.global.getLabel("operator", row.operator)
            }}</template>
          </el-table-column>
          <el-table-column prop="type" label="状态所属方">
            <template slot-scope="{ row }">{{
              util.global.getLabel("operator", row.type)
            }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="触发时间"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 确认报价的模态框 -->
    <model
      ref="quotationForm"
      title="确认报价"
      @ok="sumbitQuotation"
      @close="resetQuotationForm"
    >
      <el-form
        :model="quotationForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="状态"
          prop="status"
          style="width:calc(100% - 120px)"
        >
          <el-radio-group v-model="quotationForm.status">
            <el-radio
              v-for="item in util.global.rejectStatus"
              :key="item.label"
              :label="item.value"
              @change="changeStuta(item)"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="驳回原因"
          prop="rejectReason"
          style="width:calc(100% - 120px)"
        >
          <el-input
            type="text"
            v-model="quotationForm.rejectReason"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </model>

    <!-- 修改报价的弹窗 -->
    <el-dialog
      title="修改报价"
      :visible.sync="changePayment"
      :close-on-click-modal="true"
      :modal="true"
      :show-close="true"
      :center="true"
    >
      <el-from label-width="1000px">
        <div class="addPart">
          <div class="addcontent">
            <div class="name">上门费用:</div>
            <el-input v-model="parts.doorAmount" placeholder="元"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">其他费用:</div>
            <el-input v-model="parts.otherAmount" placeholder="元"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">配件费用:</div>
            <el-input v-model="parts.partsAmount" placeholder="元"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">技术服务费:</div>
            <el-input
              v-model="parts.technologyAmount"
              placeholder="元"
            ></el-input>
          </div>
        </div>
      </el-from>
      <div class="addPartBtn">
        <el-button type="primary" @click="changeFalse">取消</el-button>
        <el-button type="primary" @click="changeTrue">确认修改</el-button>
      </div>
    </el-dialog>

    <!-- 确认验收的模态框 -->
    <model
      ref="checkForm"
      title="确认验收"
      @ok="sumbitCheck"
      @close="resetCheckForm"
    >
      <el-form
        :model="checkForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="状态"
          prop="status"
          style="width:calc(100% - 120px)"
        >
          <el-radio-group v-model="checkForm.status">
            <el-radio
              v-for="item in util.global.rejectStatus"
              :key="item.label"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="驳回原因"
          prop="rejectReason"
          style="width:calc(100% - 120px)"
        >
          <el-input
            type="text"
            v-model="checkForm.rejectReason"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </model>

    <!-- 打款信息的模态框 -->
    <model
      ref="platform"
      title="打款信息"
      @ok="sumbitPlatformPay()"
      @close="resetPlatformPay"
    >
      <el-form status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="师傅卡号" style="width:calc(100% - 120px)">{{
          data.bankCode
        }}</el-form-item>
        <el-form-item label="所属银行" style="width:calc(100% - 120px)">{{
          data.bankName
        }}</el-form-item>
        <!-- 请核实打款信息，再点击确认按钮 -->
      </el-form>
    </model>
  </div>
</template>

<style lang="less" scoped>
// 11.22版需求信息开始
.information {
  padding: 30px 60px;
  .oneline {
    display: flex;
    margin-bottom: 30px;
    .item1,
    .item3 {
      margin-right: 30px;
      color: #707070;
      font-size: 24px;
      font-weight: 600;
    }

    .item2 {
      margin-right: 20vw;
      div {
        color: #707070;
        font-size: 18px;
        margin-bottom: 15px;
        span {
          margin-left: 10px;
          color: #0b2059;
        }
      }
    }

    .item4 {
      div {
        color: #707070;
        font-size: 18px;
        margin-bottom: 20px;
        span {
          margin-left: 10px;
          color: #0b2059;
        }
      }
    }
  }

  .twoline {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    .title {
      margin-right: 30px;
      color: #707070;
      font-size: 24px;
      font-weight: 600;
    }

    .content {
      color: #0b2059;
    }
  }

  .threeline {
    display: flex;
    margin-bottom: 30px;
    .title {
      margin-right: 30px;
      color: #707070;
      font-size: 24px;
      font-weight: 600;
    }
  }
}

// 11.22版需求信息结束
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
import {
  examineMasterQuotation,
  handleMasterPayment,
  updateMasterPrice,
  cancelRepairOrder,
} from "@/api/order.js";
export default {
  title: "maintenance_order_desc",
  data() {
    return {
      changePayment: false,
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
          "/admin/maintenance/handleConfirmBalanceToMaster", // 平台打款至师傅(质保期已到)
      },
      quotationForm: {
        rejectReason: "",
      },
      checkForm: {
        rejectReason: "",
      },
      parts: {
        orderSn: "",
        doorAmount: "",
        otherAmount: "",
        partsAmount: "",
        technologyAmount: "",
      },
    };
  },
  mounted() {
    this._getRepairOrderDetail();
    console.info(this.$store);
  },
  created() {
    this.orderSn = this.$route.query.orderSn;
    this._getRepairOrderDetail();
  },
  methods: {
    // 判断配件明细
    judgeParts() {
      if (!this.data.partsList) {
        return false;
      } else if (this.data.partsList && this.data.partsList.length === 0) {
        return false;
      } else {
        return true;
      }
    },
    // 判断故障解决方案
    judgeFault() {
      if (!this.data.programmeList) {
        return false;
      } else if (
        this.data.programmeList.analysis === undefined &&
        this.data.programmeList.desc === undefined &&
        this.data.programmeList.programme === undefined
      ) {
        return false;
      } else {
        return true;
      }
    },
    // 判断订单费用
    judgeOrderCost() {
      const {
        doorAmount,
        technologyAmount,
        partsAmount,
        otherAmount,
      } = this.data;
      if (
        doorAmount === 0 &&
        technologyAmount === 0 &&
        (otherAmount === 0) & (partsAmount === 0)
      ) {
        return false;
      } else {
        return true;
      }
    },
    // 点击取消订单触发的事件
    _cancelRepairOrder() {
      let params = {
        orderSn: this.orderSn,
      };
      cancelRepairOrder(params).then((res) => {
        if (res) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$router.push({
            name: "maintenance_order",
          });
        }
      });
    },
    // 点击修改报价的弹窗的取消按钮的事件
    changeFalse() {
      this.changePayment = false;
    },
    // 点击修改报价的弹窗的确认修改按钮的事件
    async changeTrue() {
      this.parts.orderSn = this.orderSn;
      const res = await updateMasterPrice(this.parts);
      if (res.message === "操作成功") {
        this.$message({
          showClose: true,
          message: res.message,
          type: "success",
        });
        await this._getRepairOrderDetail();
        this.changePayment = false;
      }
    },
    // 点击修改报价的事件
    _changePayment() {
      this.changePayment = true;
    },
    // 暂时不知道干嘛!!!!!
    changeStuta(e) {
      if (e.value == 1) {
        this.status = 2;
      } else {
        this.status = 3;
      }
    },
    // 没用到
    srueAccomont() {
      this.$refs.quotationForm.open();
    },
    // 点击打款至师傅触发的事件
    _handleMasterPayment() {
      let params = {
        orderSn: this.orderSn,
      };
      handleMasterPayment(params).then((res) => {
        if (res) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
        }
      });
    },
    // 点击确定报价触发的事件
    sumbitQuotation() {
      let data = {
        orderSn: this.orderSn,
        status: 2,
        rejectReason: "",
      };
      examineMasterQuotation(data).then((res) => {
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
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
    // 没用到
    quotationInit() {
      this.quotationForm = {
        enterpriseOrderSn: this.data.orderSn,
        status: "0",
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
    // 关闭确认报价的模态框的事件
    resetQuotationForm(fn) {
      this._getRepairOrderDetail();
      fn(false);
    },
    // 点击检测定价触发的事件
    jump2check() {
      this.$router.push({
        name: "checkPricing",
        query: { orderSn: this.data.orderSn },
      });
    },
    // 没用过
    pay() {
      this.$axios
        .post(this.url.handleConfirmDeposit, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1],
          // type (integer, optional): 类型: 1 定金 2 尾款
          type: this.data.enterpriseSubStatus == 2305 ? 1 : 2,
        })
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
            this._getRepairOrderDetail();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 显示企业报价弹框
    checkInit() {
      this.checkForm = {
        enterpriseOrderSn: this.data.orderSn,
        status: "0",
      };
      this.$refs.checkForm.open();
    },
    // 确认验收的模态框确定的事件
    sumbitCheck(fn) {
      if (this.checkForm.status == "0" && !this.checkForm.rejectReason) {
        this.$message.error("请输入驳回原因");
        return;
      }
      this.$axios
        .post(this.url.handleEnterpriseCheck, this.checkForm)
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
            this.resetCheckForm(fn);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 确认验收的模态框关闭的事件
    resetCheckForm(fn) {
      this._getRepairOrderDetail();
      fn(false);
    },
    handleConfirmDepositToMaster(fn) {
      this.$axios
        .post(this.url.handleConfirmDepositToMaster, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1],
          type: this.data.enterpriseSubStatus == "2306" ? 1 : 2,
        })
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
          }
          this.resetPlatformPay(fn);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 没用到
    platformPayInit() {
      if (this.data.enterpriseSubStatus != "2502") {
        this.$refs.platform.open();
      } else {
        this.handleConfirmDepositToMaster();
      }
    },
    // 打款信息的模态框确定的事件
    sumbitPlatformPay(fn) {
      if (this.data.enterpriseSubStatus == "2601") {
        this.remit(fn);
      } else {
        this.handleConfirmDepositToMaster(fn);
      }
    },
    // 打款信息的模态框确定的事件
    remit(fn) {
      this.$axios
        .post(this.url.handleConfirmBalanceToMaster, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1],
        })
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
          }
          this.resetPlatformPay(fn);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 打款信息的模态框取消的事件
    resetPlatformPay(fn) {
      this._getRepairOrderDetail();
      fn(false);
    },
    // 打款信息的模态框取消的事件
    _getRepairOrderDetail() {
      let params = {
        enterpriseOrderSn: this.orderSn,
      };
      getRepairOrderDetail(params).then((res) => {
        if (res.success) {
          console.log(res);
          this.data = res.data;
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
        }
      });
    },
  },
};
</script>
