<!-- 入/出库单 -->
<template>
  <div class="storeOrderBox">
    <h2 class="bigTitle">出 / 入库单</h2>
    <!-- 表格 -->
    <el-card>
      <el-table :data="tableData">
        <el-table-column prop="orderType" label="订单类型" align="center">
          <template slot-scope="{ row }">
            {{
              row.orderType === 1
                ? "入库单"
                : row.orderType === 2
                ? "出库单 "
                : "/"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="businessType" label="业务类型" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center">
        </el-table-column>
        <el-table-column prop="orderSn" label="订单编号" align="center">
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button type="text">详情</el-button>
            <el-button type="text">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { queryStoreOrderList } from "@/api/storeController";
export default {
  data() {
    return {
      //  获取出入库列表需要的参数
      getStoreOrderListData: {
        pageNo: 1,
        pageSize: 10,
      },
      // 列表的总条数
      total: 0,
      tableData: [],
    };
  },
  methods: {
    async getStoreOrderList(data) {
      const res = await queryStoreOrderList(data);
      const { total } = res;
      this.total = total;
    },
  },
  created() {
    this.getStoreOrderList(this.getStoreOrderListData);
  },
};
</script>

<style scoped lang="less">
.storeOrderBox {
  padding: 20px 30px;
  .bigTitle {
    color: #0b2059;
    margin-bottom: 20px;
  }
}
</style>
