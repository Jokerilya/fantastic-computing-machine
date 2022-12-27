<template>
  <el-dialog
    @close="closeFn"
    @open="openFn"
    :visible="dialogVisible"
    width="50%"
    :before-close="closeFn"
    :showClose="false"
  >
    <div v-if="orderDetails">
      <div class="orderDetails">
        <h2 style="text-align:center;">
          {{
            rowList.serviceTypeName === "维保师傅支付" ? "支付详情" : "收款详情"
          }}
        </h2>
        <div class="content">
          <div class="line">
            <div class="item">
              <span class="title"
                >{{ orderDetails.masterRealName ? "师傅" : "普通" }}订单</span
              >
              <span class="desc">{{ rowList.orderSn }}</span>
            </div>
            <div class="item" v-if="orderDetails.masterRealName">
              <span class="title">师傅名称</span>
              <span class="desc">{{ orderDetails.masterRealName }}</span>
            </div>
          </div>
          <div class="line">
            <div class="item">
              <span class="title">收支账号</span>
              <span class="desc">{{ orderDetails.contactsPeople }}</span>
            </div>
            <div class="item">
              <span class="title">联系电话</span>
              <span class="desc">{{ orderDetails.contactsPhone }}</span>
            </div>
          </div>
          <div class="line">
            <div class="item">
              <span class="title">支付日期</span>
              <span class="desc">{{ rowList.payTime }}</span>
            </div>
            <div class="item">
              <span class="title">订单金额</span>
              <span class="desc">{{ rowList.payMoney }}元</span>
            </div>
          </div>
        </div>
      </div>
      <div class="moneyDetails">
        <h2 style="padding-left: 20px;">金额明细</h2>
        <div class="content">
          <div class="line">
            <span class="title">上门费用</span>
            <span class="desc">{{ orderDetails.doorAmount }}元</span>
          </div>
          <div class="line">
            <span class="title">技术服务费</span>
            <span class="desc">{{ orderDetails.technologyAmount }}元</span>
          </div>
          <div class="line">
            <span class="title"
              >配件费<i
                v-if="
                  orderDetails.partsList && orderDetails.partsList.length !== 0
                "
                v-show="!partsDetailsShow"
                class="el-icon-caret-bottom"
                @click="partsDetailsShow = true"
              ></i
              ><i
                v-if="
                  orderDetails.partsList && orderDetails.partsList.length !== 0
                "
                v-show="partsDetailsShow"
                class="el-icon-caret-top"
                @click="partsDetailsShow = false"
              ></i
            ></span>
            <span class="desc">{{ orderDetails.partsAmount }}元</span>
          </div>
          <div class="partsLine" v-if="partsDetailsShow">
            <div class="item" v-for="item in orderDetails.partsList">
              <div class="loginPurchase">
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
              <div class="name">{{ item.name }}</div>
              <div class="price">{{ item.price }}元</div>
              <div class="num">{{ item.num }}个</div>
            </div>
          </div>
          <div class="line">
            <span class="title">其他</span>
            <span class="desc">{{ orderDetails.otherAmount }}元</span>
          </div>
          <div class="line">
            <span class="title">总金额</span>
            <span class="desc">{{ orderDetails.totalAmount }}元</span>
          </div>
          <div class="line">
            <span class="title" style="color: red;">支付金额</span>
            <span class="desc" style="color: red;"
              >{{ orderDetails.payAmount ? orderDetails.payAmount : 0 }}元</span
            >
            <span style="margin-left: 20px;">(不包含平台采购配件费)</span>
          </div>
        </div>
      </div>
      <div style="display: flex;justify-content: flex-end;">
        <el-button @click="closeFn" class="closeBtn">关闭</el-button>
        <el-button class="comfirmBtn" v-if="payBtnShow" @click="comfirmFn"
          >确定付款</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getRepairOrderCollectionInfo } from "@/api/financialController";
import { handleMasterPayment } from "@/api/order";

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    payBtnShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rowList: null,
      orderDetails: null,
      partsDetailsShow: true,
    };
  },
  created() {},
  methods: {
    // 弹窗close触发的事件
    closeFn() {
      this.rowList = null;
      this.orderDetails = null;
      this.partsDetailsShow = true;
      this.$emit("handleClose");
    },
    // 弹窗open触发的事件
    async openFn() {
      const loading = this.$loading();
      const res = await getRepairOrderCollectionInfo(this.rowList.orderSn);
      this.orderDetails = res.data;
      loading.close();
    },
    // 确定按钮
    async comfirmFn() {
      const res = await handleMasterPayment(this.rowList.orderSn);
      if (res.message === "操作成功") {
        this.$message({
          message: "支付成功!",
          type: "success",
        });
        await this.$emit("refreshpage");
        await this.closeFn();
      }
    },
  },
};
</script>

<style lang="less" scoped>
// 按钮样式
.closeBtn {
  background-color: #fff;
  color: #0b2059;
  border: 1px solid #0b2059;
  width: 110px;
  height: 40px;
}
.comfirmBtn {
  background-color: #2e4c9e;
  color: #fff;
  width: 110px;
  height: 40px;
}

// 收款详情
.orderDetails {
  color: #707070;
  .content {
    padding: 20px 20px;
    .line {
      display: flex;
      margin-bottom: 20px;
      .item {
        flex: 1;
        display: flex;
        align-items: center;
        padding-right: 20px;
        .title {
          color: #707070;
          font-weight: 700;
          font-size: 22px;
          margin-right: 20px;
        }
        .desc {
          font-size: 18px;
        }
      }
    }
  }
}

.moneyDetails {
  color: #707070;

  .content {
    padding: 20px 20px 20px 60px;
    .partsLine {
      width: 70%;
      .item {
        font-size: 18px;
        margin-bottom: 20px;
        display: flex;
        padding-left: 50px;
        width: 70%;
        position: relative;
        .loginPurchase {
          position: absolute;
          left: 5px;
          top: -5px;
        }
        .name {
          flex: 1;
        }
        .price {
          flex: 1;
        }
        .num {
          flex: 1;
        }
      }
    }
    .line {
      margin-bottom: 20px;
      .title {
        display: inline-block;
        width: 150px;
        color: #707070;
        font-weight: 700;
        font-size: 22px;
        margin-right: 20px;
      }
      .desc {
        font-size: 18px;
      }
    }
  }
}
</style>
