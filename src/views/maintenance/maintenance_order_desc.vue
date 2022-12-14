<!--维保订单详情-->
<template>
  <div class="box">
    <el-tabs v-model="activeName" type="border-card">
      <div class="big_title">
        <div class="bigTitleLeft">
          <div class="item" style="color: red;font-size: 18px;">
            <i style="font-style: normal;" v-if="data.platformStatus === -1">
              师傅</i
            >{{ data.orderStatusName }}
          </div>
          <div class="item">
            <div>订单号:</div>
            <div>{{ data.orderSn }}</div>
          </div>
          <div class="item">
            <div>下单时间:</div>
            <div>{{ data.createTime }}</div>
          </div>
          <div class="item">
            <div>紧急程度:</div>
            <div v-if="data.degree === 1" style="color: green;">一般</div>
            <div v-if="data.degree === 2" style="color: red;">紧急</div>
          </div>
        </div>
        <div>
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
            @click="
              $router.push('/maintenance/amendPricing?orderSn=' + data.orderSn)
            "
            v-if="
              data.platformStatus === -1 ||
                data.platformStatus === 1 ||
                data.platformStatus === 2
            "
            >修改报价</el-button
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
            size="mini"
            type="primary"
            plain
            v-if="
              data.platformStatus === -1 ||
                data.platformStatus === 1 ||
                data.platformStatus === 2 ||
                data.platformStatus === 3
            "
            @click="
              $router.push(
                '/maintenance/assignedWorker?orderSn=' + data.orderSn
              )
            "
          >
            指派师傅
          </el-button>
          <el-button
            v-if="
              data.enterpriseMainStatus >= -1 && data.enterpriseMainStatus <= 3
            "
            type="primary"
            size="mini"
            plain
            @click="clickCancelOrderDialog"
            >取消订单</el-button
          >

          <!-- <el-button
            type="primary"
            size="mini"
            plain
            @click="_handleMasterPayment()"
            v-if="['3502'].includes(data.masterSubStatus)"
            >打款至师傅</el-button
          > -->
        </div>
      </div>

      <!-- 企业描述tab -->
      <el-tab-pane label="企业描述" name="desc">
        <div class="information" style="padding: 20px;">
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
                联系人员: <span>{{ data.contactsPeople }}</span>
              </div>
              <div>
                联系电话: <span>{{ data.phone }}</span>
              </div>
              <div>
                联系地址: <span>{{ data.address }}</span>
              </div>
            </div>
          </div>
          <!-- 创建人 操作人 -->
          <div class="people">
            <div class="createPeople" v-if="data.createPeople">
              <div class="title">创建人:</div>
              <div class="content">{{ data.createPeople }}</div>
            </div>
            <div class="handlePeople" v-if="data.operationPeople">
              <div class="title">负责人:</div>
              <div class="content">{{ data.operationPeople }}</div>
            </div>
          </div>

          <!-- 故障描述 -->
          <div class="twoline">
            <div class="title">故障描述:</div>
            <div class="content">{{ data.simpleDesc }}</div>
          </div>
          <!-- 故障类型 -->
          <div class="twoline" v-if="data.originType">
            <div class="title">故障类型:</div>
            <div class="content">
              <span v-if="data.originType.includes(1)">电气故障，</span>
              <span v-if="data.originType.includes(2)">机械故障，</span>
              <span v-if="data.originType.includes(3)">系统故障</span>
            </div>
          </div>
          <!-- 设备视图 -->
          <div
            class="threeline"
            v-if="!(data.pictureList === null && data.videoList === null)"
          >
            <div class="title">设备视图:</div>
            <div>
              <img
                v-for="item in data.pictureList"
                :key="item"
                :src="item"
                style="width: 200px;height: 200px;"
              />
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
      </el-tab-pane>

      <!-- 检测结果tab -->
      <el-tab-pane
        label="检测结果"
        name="meg"
        v-if="!(data.platformStatus == 0 && data.enterpriseMainStatus >= 0)"
      >
        <div class="meg">
          <!-- 师傅联系方式 -->
          <div class="masterContact" v-if="data.enterpriseMainStatus > 1">
            <div class="title">师傅联系方式:</div>
            <div class="item">
              <span class="label">联系人:</span>
              <span class="content">{{ data.masterRealName }}</span>
            </div>
            <div class="item">
              <span class="label">联系电话:</span>
              <span class="content">{{ data.masterPhone }}</span>
            </div>
          </div>

          <!--故障类型  -->
          <div class="faultParts" v-if="data.type">
            <div class="title">故障类型:</div>
            <div class="content">{{ data.type }}</div>
          </div>

          <!-- 故障部位 -->
          <div class="faultParts" v-if="data.servicePositions">
            <div class="title">故障部位:</div>
            <div class="content">{{ data.servicePositions }}</div>
          </div>

          <!-- 故障解决方案 -->
          <div class="solvePlan">
            <div
              class="title"
              v-if="data.programmeList && data.programmeList.length !== 0"
            >
              故障解决方案:
            </div>
            <div class="planItem" v-for="(item, index) in data.programmeList">
              <div class="label">解决方案{{ index + 1 }}</div>
              <div class="programmeItem">
                <div class="item">
                  故障描述: <span>{{ item.desc }}</span>
                </div>
                <div class="item">
                  故障分析: <span>{{ item.analysis }}</span>
                </div>
                <div class="item">
                  故障方案: <span>{{ item.programme }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 质保周期 -->
          <div v-if="data.warrantyTime" class="qualityProtectTime">
            <div class="title">质保周期:</div>
            <div class="time">{{ data.warrantyTime }}/天</div>
            <div class="title" style="margin-left: 50px;">预计完成时间:</div>
            <div class="time">
              {{ data.serviceCompleteTime ? data.serviceCompleteTime : "未定" }}
            </div>
          </div>

          <!-- 配件明细 -->
          <div class="accessoriesDetail" v-if="judgeParts()">
            <div class="title">配件明细</div>
            <div>
              <div
                class="item"
                style="position: relative;"
                v-for="(item, index) in data.partsList"
              >
                <div style="font-size: 18px;">配件{{ index + 1 }}:</div>
                <div class="name">{{ item.name }}</div>
                <div class="price">{{ item.price }}元</div>
                <div class="num">{{ item.num }}{{ item.unit }}</div>
                <div style="position: absolute;left: -35px;top: -3px;">
                  <img
                    src="@/assets/logo/masterPurchase.png"
                    width="28px"
                    v-if="item.type !== 2"
                  />
                  <img
                    src="@/assets/logo/platformPurchase.png"
                    width="28px"
                    v-if="item.type === 2"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 服务进度 -->
          <div class="servicePlan" v-if="data.enterpriseMainStatus === 3">
            <div class="topLine">
              <div class="title">服务进度</div>
              <div class="annotation">
                （不必填，维修时间长，需要配合客户填写进度）
              </div>
            </div>
            <div class="content">
              <div
                class="item"
                v-for="(item, index) in data.serviceProgressList"
              >
                <div class="title">进度描述{{ index + 1 }}</div>
                <div>
                  <div class="time">{{ item.time }}</div>
                  <div class="decs">{{ item.content }}</div>
                </div>
              </div>
            </div>
            <div class="releaseDesc">
              <div class="title">进度描述</div>
              <div class="inp">
                <el-input
                  v-model="content"
                  type="textarea"
                  resize="none"
                  :rows="6"
                  placeholder="输入当前维修进度信息"
                >
                </el-input>
                <div class="confirmBtn">
                  <el-button class="btn" @click="descConfirm">确定</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 完工信息 -->
          <div class="finishWork" v-if="data.completePictureList">
            <div class="title">完工信息:</div>
            <div class="pic" v-for="item in data.completePictureList">
              <el-image
                v-if="item"
                style="width: 150px; height: 150px;margin-right: 10px;"
                lazy
                :src="item"
                :preview-src-list="data.completePictureList"
              ></el-image>
            </div>
          </div>

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

          <!-- 取消订单原因 -->
          <div class="cancelOrder" v-if="data.cancelReason">
            <div class="title">取消订单原因:</div>
            <div class="content">{{ data.cancelReason }}</div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 操作日志tab -->
      <el-tab-pane label="操作日志" name="log">
        <!-- <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{
            util.global.getLabel("mainStatus", data.enterpriseMainStatus)
          }}</span>
        </div> -->
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

    <!-- 取消订单的原因弹窗 -->
    <el-dialog
      :visible="cancelOrderDialog"
      width="50%"
      :before-close="closecancelOrderDialog"
    >
      <div style="text-align: center;padding: 0 70px;">
        <div style="color:#707070 ;font-size: 20px;font-weight: 700;">
          取消说明
        </div>
        <el-input
          type="textarea"
          resize="none"
          :rows="10"
          v-model="delOrderinpValue"
          style="margin-top: 20px;"
          placeholder="请输入取消订单的原因"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button
          style="width: 150px;background-color: #ffffff;color:#2e4c9e ;"
          @click="closecancelOrderDialog"
          >取 消</el-button
        >
        <el-button
          style="width: 150px;background-color: #2e4c9e;"
          type="primary"
          @click="_cancelRepairOrder"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
// 服务进度
.servicePlan {
  .topLine {
    display: flex;
    align-items: center;
    .title {
      width: 150px;
      color: #707070;
      font-size: 24px;
      font-weight: 600;
    }
    .annotation {
      color: #999999;
      font-size: 18px;
    }
  }
  .releaseDesc {
    margin: 20px 0;
    display: flex;
    .title {
      width: 150px;
      color: #999999;
      font-size: 18px;
      font-weight: 700;
    }
    .inp {
      width: 70%;
      position: relative;

      .confirmBtn {
        position: absolute;
        right: 15px;
        bottom: 10px;
        .btn {
          width: 85px;
          background-color: #2e4c9e;
          height: 35px;
          color: #fff;
        }
      }
    }
  }
  .content {
    .item {
      display: flex;
      margin-top: 20px;
      .title {
        width: 150px;
        color: #999999;
        font-size: 18px;
        font-weight: 700;
      }
      .time {
        color: #999999;
        margin-bottom: 10px;
      }
      .decs {
        color: #0b2059;
      }
    }
  }
}

// 创建人  操作人
.people {
  display: flex;
  margin-bottom: 20px;
  .createPeople,
  .handlePeople {
    display: flex;
    width: 350px;
    align-items: center;
    .title {
      color: #707070;
      font-size: 24px;
      font-weight: 700;
      margin-right: 30px;
    }

    .content {
      color: #0b2059;
    }
  }
}
//取消订单原因
.cancelOrder {
  display: flex;
  margin-bottom: 20px;
  align-items: center;

  .title {
    width: 200px;
    color: #707070;
    font-size: 24px;
    font-weight: 600;
  }

  .content {
    color: red;
    font-size: 20px;
  }
}
// 故障部位
.faultParts {
  display: flex;
  margin-bottom: 20px;
  align-items: center;

  .title {
    width: 150px;
    color: #707070;
    font-size: 24px;
    font-weight: 600;
  }

  .content {
    color: #0b2059;
    font-size: 20px;
  }
}
// 故障解决方案
.solvePlan {
  .title {
    width: 200px;
    color: #707070;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .planItem {
    display: flex;
    margin-bottom: 20px;

    .label {
      color: #707070;
      font-size: 20px;
      margin-right: 50px;
    }

    .programmeItem {
      color: #707070;
      font-size: 18px;
      .item {
        margin-bottom: 10px;
        span {
          margin-left: 10px;
          color: #0b2059;
          font-size: 16px;
        }
      }
    }
  }
}

// 检测结果
.meg {
  padding: 20px;
  // 质保周期
  .qualityProtectTime {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .title {
      color: #707070;
      font-size: 24px;
      font-weight: 600;
    }
    .time {
      margin-left: 20px;
      color: #0b2059;
    }
  }

  // 配件明细
  .accessoriesDetail {
    margin-bottom: 20px;
    display: flex;
    .title {
      width: 150px;
      color: #707070;
      font-size: 24px;
      font-weight: 600;
    }
    .item {
      display: flex;
      width: 350px;
      margin-bottom: 20px;
      .name {
        padding-right: 30px;
        margin-left: 20px;
        color: #707070;
      }
      .price {
        flex: 2;
        color: red;
      }
      .num {
        flex: 2;
        color: #0b2059;
      }
    }
  }
}
// 师傅联系方式
.masterContact {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .title {
    width: 200px;
    color: #707070;
    font-size: 24px;
    font-weight: 600;
  }
  .item {
    width: 300px;
    color: #707070;
    font-size: 18px;
    .content {
      margin-left: 20px;
      color: #0b2059;
    }
  }
}

// 完工信息
.finishWork {
  display: flex;
  margin-bottom: 20px;
  .title {
    width: 150px;
    color: #707070;
    font-size: 24px;
    font-weight: 600;
  }
}

.information {
  .oneline {
    display: flex;
    margin-bottom: 30px;
    .item1,
    .item3 {
      width: 150px;
      color: #707070;
      font-size: 24px;
      font-weight: 600;
    }

    .item2 {
      width: 350px;
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
      width: 150px;
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
  display: flex;
  justify-content: space-between;
  color: #707070;
  font-size: 16px;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid #666;
  margin-bottom: 10px;
  .bigTitleLeft {
    display: flex;
    width: 750px;
    justify-content: space-between;
    .item {
      display: flex;
    }
  }
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
  editOrderServiceProgress,
  examineMasterQuotation,
  handleMasterPayment,
  cancelRepairOrder,
} from "@/api/order.js";
export default {
  title: "maintenance_order_desc",
  data() {
    return {
      content: "",
      // 取消订单
      delOrderinpValue: "",
      cancelOrderDialog: false,

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
    // 点击确定添加描述
    async descConfirm() {
      const data = {
        content: this.content,
        orderSn: this.data.orderSn,
      };
      const res = await editOrderServiceProgress(data);
      if (res.message === "操作成功") {
        location.reload();
      }
    },
    // 点击取消订单触发的时间
    clickCancelOrderDialog() {
      this.cancelOrderDialog = true;
    },
    // 关闭取消订单弹窗的时间
    closecancelOrderDialog() {
      this.cancelOrderDialog = false;
      this.delOrderinpValue = "";
    },

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
    // 点击取消订单弹窗确定的事件
    _cancelRepairOrder() {
      let params = {
        orderSn: this.orderSn,
        cancelReason: this.delOrderinpValue,
      };
      cancelRepairOrder(params).then((res) => {
        if (res) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$router.push("/maintenance/maintenance_order");
        }
      });
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
          this.$router.push("/maintenance/maintenance_order");
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
        query: { orderSn: this.data.orderSn, edit: true },
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
