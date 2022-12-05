<template>
  <el-dialog
    :visible="dialogVisible"
    width="40%"
    :before-close="handleClose"
    :showClose="false"
  >
    <div>
      <div class="orderDetails">
        <h2 style="text-align:center;">收款详情</h2>
        <div class="content">
          <div class="line">
            <div class="item">1</div>
            <div class="item">1</div>
          </div>
          <div class="line">
            <div class="item">1</div>
            <div class="item">1</div>
          </div>
          <div class="line">
            <div class="item">1</div>
            <div class="item">1</div>
          </div>
        </div>
      </div>
      <div class="moneyDetails">
        <h2 style="text-align:center;">金额明细</h2>
        <div class="content">
          <div class="line">1</div>
          <div class="line">1</div>
          <div class="line">1</div>
          <div class="line">1</div>
        </div>
      </div>
      <div style="display: flex;justify-content: flex-end;">
        <el-button @click="handleClose" class="closeBtn">关闭</el-button>
        <el-button class="comfirmBtn" v-if="payBtnShow">确定付款</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
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
  methods: {
    handleClose() {
      this.$emit("handleClose");
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
      margin-bottom: 10px;
      .item {
        flex: 1;
      }
    }
  }
}

.moneyDetails {
  color: #707070;
  .content {
    padding: 20px 20px;
    .line {
      margin-bottom: 10px;
    }
  }
}
</style>
