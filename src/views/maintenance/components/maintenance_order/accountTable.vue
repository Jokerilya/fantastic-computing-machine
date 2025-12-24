<template>
  <div class="accountTable">
    <el-table
      @selection-change="handleSelectionChange"
      :data="repairOrderList"
      highlight-current-row
      ref="accountTableRef"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="month" label="月份" align="center" />
      <el-table-column
        prop="createTime"
        label="创建时间"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="orderSn"
        label="订单号"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="goToOrderDesc(row)">{{
            row.orderSn
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="simpleDesc"
        label="故障描述"
        show-overflow-tooltip
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="设备码" show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          {{ row.no ? row.no : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="机台号" show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          {{ row.enterpriseDeviceNo ? row.enterpriseDeviceNo : "/" }}
        </template>
      </el-table-column>
      <el-table-column prop="masterRealName" label="师傅姓名" align="center">
        <template slot-scope="{ row }">
          {{ row.masterRealName ? row.masterRealName : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="人工费" align="center">
        <template slot-scope="{ row }">
          {{ row.doorAmount ? row.doorAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="配件费" align="center">
        <template slot-scope="{ row }">
          {{ row.partsAmount ? row.partsAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="税金" align="center">
        <template slot-scope="{ row }">
          {{ row.invoiceAmount ? row.invoiceAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="优惠减免费用" align="center">
        <template slot-scope="{ row }">
          {{ row.discountAmount ? row.discountAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column prop="payAmount" label="总金额" align="center">
        <template slot-scope="{ row }">
          {{ row.payAmount ? row.payAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column prop="checkTime" label="验收时间" align="center">
        <template slot-scope="{ row }">
          {{ row.checkTime ? row.checkTime : "/" }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryRepairOrderList } from "@/api/order";
export default {
  name: "AccountTable",
  props: {
    // 查询订单需要的参数
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      repairOrderList: [],
    };
  },
  computed: {},
  methods: {
    // 清除表格选中
    cleanTableChoose() {
      this.$refs.accountTableRef.clearSelection();
    },
    // 表格多选切换选择
    handleSelectionChange(val) {
      this.$emit("change-tableSelection", val);
    },
    // 查询订单
    async queryRepairOrderList() {
      let prams = JSON.parse(JSON.stringify(this.params));
      prams.pageType = 4;
      const res = await queryRepairOrderList(prams);
      if (res.code == "000") {
        this.repairOrderList = res.data.records;
        this.$emit("change-paginationTotal", res.data.total);
      }
    },
    // 跳转详情
    goToOrderDesc(row) {
      const routeData = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn },
      });
      window.open(routeData.href, "_blank");
    },
  },
  created() {
    this.queryRepairOrderList();
  },
};
</script>

<style scoped>
</style>
