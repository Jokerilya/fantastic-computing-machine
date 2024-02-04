<template>
  <!-- 自动派单 -->
  <div class="autoSendOrders">
    <div class="autoSendOrders_table">
      <el-card>
        <el-table
          :data="autoSendOrdersList"
          border
          style="width: 100%"
          height="75vh"
        >
          <el-table-column prop="createTime" label="创建时间" align="center">
          </el-table-column>
          <el-table-column prop="orderSn" label="订单编号" align="center">
          </el-table-column>
          <el-table-column label="指派状态" align="center">
            <template slot-scope="{ row }">
              <div v-if="row.status == 1">
                当前指派第{{ row.ranking }}位师傅
              </div>
              <div v-else style="color: red">已过期,请手动指派师傅</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" @click="goToDesc(row.orderSn)">
                详情
              </el-button>
              <el-button
                type="text"
                @click="openAutoSendOrdersRecordsDialog(row.children)"
              >
                自动派单记录
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 自动派单记录 -->
    <el-dialog
      title="自动派单记录"
      :visible="autoSendOrdersRecordsDialog"
      width="50%"
      :before-close="closeAutoSendOrdersRecordsDialog"
    >
      <el-table :data="autoSendOrdersRecords">
        <el-table-column prop="realName" label="师傅姓名" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" align="center">
        </el-table-column>
        <el-table-column prop="levelName" label="等级" align="center">
        </el-table-column>
        <el-table-column prop="integral" label="积分" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <div :style="{ color: row.status == 2 ? 'red' : '' }">
              {{
                row.status == 0
                  ? "待指派"
                  : row.status == 1
                  ? "待接单"
                  : "已过期"
              }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { queryAutomaticAssignList } from "@/api/order.js";
export default {
  data() {
    return {
      autoSendOrdersRecordsDialog: false,
      autoSendOrdersList: [],
      autoSendOrdersRecords: [],
    };
  },
  methods: {
    // 跳转详情
    goToDesc(orderSn) {
      this.$router.push({
        name: "maintenance_order_desc",
        query: { orderSn },
      });
    },
    // 关闭自动抢单记录
    closeAutoSendOrdersRecordsDialog() {
      this.autoSendOrdersRecordsDialog = false;
    },
    // 打开自动抢单记录
    openAutoSendOrdersRecordsDialog(children) {
      this.autoSendOrdersRecordsDialog = true;
      this.autoSendOrdersRecords = children;
    },
    // 查询自动抢单列表
    async queryAutomaticAssignList() {
      const res = await queryAutomaticAssignList();
      this.autoSendOrdersList = res.data;
      console.log(36, this.autoSendOrdersList);
    },
  },
  created() {
    this.queryAutomaticAssignList();
  },
};
</script>

<style lang="less" scoped>
.autoSendOrders {
  padding: 20px;
}
</style>
