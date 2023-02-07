<!-- 入/出库单 -->
<template>
  <div class="storeOrderBox">
    <h2 class="bigTitle">出 / 入库单</h2>
    <!-- 表格 -->
    <el-card>
      <el-table :data="tableData">
        <el-table-column prop="orderType" label="订单类型" align="center">
          <template slot-scope="{ row }">
            {{ row.orderType === 1 ? "入库单" : "出库单 " }}
          </template>
        </el-table-column>
        <el-table-column prop="businessType" label="业务类型" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center">
        </el-table-column>
        <el-table-column prop="orderSn" label="订单编号" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button type="text">详情</el-button>
            <el-button type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
    </el-card>
  </div>
</template>

<script>
import { queryStoreOrderList } from "@/api/storeController";
export default {
  /**
   * @getStoreOrderListData 获取出入库列表需要的参数
   * @total 列表的总条数
   * @tableData 假设的数据 可删除
   */
  data() {
    return {
      getStoreOrderListData: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [
        {
          businessType: "采购入库",
          createTime: "2023-02-01",
          id: 2,
          orderSn: "RKD001",
          orderType: 1,
        },
        {
          businessType: "退货入库",
          createTime: "2023-02-01",
          id: 3,
          orderSn: "RKD002",
          orderType: 1,
        },
        {
          businessType: "调拨入库",
          createTime: "2023-02-01",
          id: 4,
          orderSn: "RKD003",
          orderType: 1,
        },
        {
          businessType: "其它入库",
          createTime: "2023-02-01",
          id: 5,
          orderSn: "RKD004",
          orderType: 1,
        },
        {
          businessType: "销售出库",
          createTime: "2023-02-01",
          id: 1,
          orderSn: "CKD001",
          orderType: 2,
        },
        {
          businessType: "退货出库",
          createTime: "2023-02-01",
          id: 6,
          orderSn: "CKD002",
          orderType: 2,
        },
        {
          businessType: "调拨出库",
          createTime: "2023-02-01",
          id: 7,
          orderSn: "CKD003",
          orderType: 2,
        },
        {
          businessType: "其它出库",
          createTime: "2023-02-01",
          id: 8,
          orderSn: "CKD004",
          orderType: 2,
        },
      ],
    };
  },
  methods: {
    async getStoreOrderList(data) {
      const res = await queryStoreOrderList(data);
      console.log(res);
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
