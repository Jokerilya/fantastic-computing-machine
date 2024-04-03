<template>
  <div class="ServiceTip" v-if="!(unReadMessgaeList.length == 0)">
    <!-- 点击触发列表 -->
    <div class="clickOpenList" @click="clickListShow">
      <div class="title">
        待处理订单
        <div class="tipIcon" v-if="!listShow">
          {{ unReadMessgaeList.length }}
        </div>
      </div>
      <div>
        <!-- 上箭头 -->
        <el-image
          v-if="!listShow"
          class="arrow"
          src="https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20231013/NW05537733.png"
        ></el-image>
        <!-- 下箭头 -->
        <el-image
          v-if="listShow"
          class="arrow"
          src="https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20231013/AG66615094.png"
        ></el-image>
      </div>
    </div>
    <!-- 通知订单列表 -->
    <!-- <div class="orderTipList" v-if="listShow">
      <div
        class="orderTipListItem"
        :style="{ backgroundColor: item.bgcChange ? '#efefef' : '#fff' }"
        v-for="(item, index) in unReadMessgaeList"
        :key="item.id"
        @click="goToDesc(item)"
        @mouseenter="changeBgcColor(item, index, true)"
        @mouseleave="changeBgcColor(item, index, false)"
      >
        <div class="orderSn">{{ item.orderSn }}</div>
        <div class="message">{{ item.message }}</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { handleUnReadMessage, queryUnReadMessgae } from "@/api/order";
export default {
  data() {
    return {
      listShow: false,
      unReadMessgaeList: [],
    };
  },
  methods: {
    // 改变信息的背景颜色
    changeBgcColor(item, index, judge) {
      let arr = item;
      arr.bgcChange = judge;
      this.$set(this.unReadMessgaeList, index, arr);
    },
    // 跳转详情页
    async goToDesc(item) {
      await handleUnReadMessage(item.id);
      this.$router.push(
        "/maintenance/maintenance_order_desc?orderSn=" + item.orderSn
      );
      setTimeout(() => {
        this.queryUnReadMessgae();
        location.reload();
      }, 1000);
    },
    // 点击列表展开隐藏
    clickListShow() {
      this.queryUnReadMessgae();
      this.listShow = !this.listShow;
    },
    // 获取未操作订单列表
    async queryUnReadMessgae() {
      const res = await queryUnReadMessgae();
      this.unReadMessgaeList = res.data;
      this.unReadMessgaeList.forEach((item) => {
        item.bgcChange = false;
      });
    },
  },
  created() {
    // this.queryUnReadMessgae();
    // setInterval(() => {
    //   this.queryUnReadMessgae();
    // }, 61000);
  },
};
</script>

<style lang="scss" scoped>
.ServiceTip {
  width: 20vw;
  color: #fff;
  font-size: 1vw;
  border-left: 2px solid hsl(0, 0%, 24%);

  .orderTipList {
    height: 60vh;
    background-color: #ffffff;
    overflow: scroll;
    .orderTipListItem {
      padding: 0.8vw 1vw;
      cursor: pointer;
      border-bottom: 1px solid #999;
      .orderSn {
        color: #000;
        margin-bottom: 0.6vw;
      }
      .message {
        color: #999;
      }
    }

    .orderTipListItemBgc {
      background-color: #efefef;
    }
  }

  .clickOpenList {
    align-items: center;
    justify-content: space-between;
    background-color: #3d3d3d;
    display: flex;
    height: 3vw;
    width: 100%;
    padding: 0 1vw;
    .title {
      display: flex;
      align-items: center;
      font-weight: 700;
      .tipIcon {
        margin-left: 0.5vw;
        background-color: #f56c6c;
        height: 1vw;
        width: 2vw;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8vw;
        border-radius: 1vw;
      }
    }

    .arrow {
      cursor: pointer;
      height: 1vw;
      width: 1vw;
    }
  }
}
</style>
