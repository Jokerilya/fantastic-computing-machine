<template>
  <div class="handoverSheetTable">
    <el-table border :data="checklistTableList">
      <el-table-column
        prop="month"
        label="故障日期"
        width="140"
        fixed
        align="center"
      />
      <el-table-column
        prop="relationOrderSn"
        label="平台订单号"
        width="150"
        fixed
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="goToOrderDesc(row)">{{
            row.relationOrderSn
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderSn"
        label="师傅订单号"
        width="150"
        align="center"
      />
      <el-table-column prop="enterpriseName" label="企业名称" width="140" />
      <el-table-column label="订单类型" width="80" align="center">
        <template slot-scope="{ row }">
          {{ row.orderTypeName ? row.orderTypeName : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="工单渠道" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.workOrderChannel ? row.workOrderChannel : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="工单属性" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.workOrderProperty ? row.workOrderProperty : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="师傅" width="90" align="center">
        <template slot-scope="{ row }">
          {{ row.masterRealName ? row.masterRealName : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="masterType"
        label="师傅类型"
        width="90"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.masterType ? row.masterType : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="师傅人工" width="110" align="center">
        <template slot-scope="{ row }">
          {{ row.doorAmount ? row.doorAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="师傅代买配件费" width="150" align="center">
        <template slot-scope="{ row }">
          {{ row.partsAmount ? row.partsAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="运营费用25%" width="110" align="center">
        <template slot-scope="{ row }">
          <div :style="{ color: row.serviceAmount > 0 ? 'red' : '' }">
            {{ row.serviceAmount ? row.serviceAmount : "/" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="质保金" width="110" align="center">
        <template slot-scope="{ row }">
          <div :style="{ color: row.retentionMoney > 0 ? 'red' : '' }">
            {{ row.retentionMoney ? row.retentionMoney : "/" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="应付师傅总费用" width="130" align="center">
        <template slot-scope="{ row }">
          {{ row.payAmount ? row.payAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="散单应收款" width="130" align="center">
        <template slot-scope="{ row }">
          {{ row.enterprisePayAmount ? row.enterprisePayAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="客户验收" width="120" align="center">
        <template slot-scope="{ row }"> {{ row.checkTime }} </template>
      </el-table-column>
      <el-table-column label="申请人" width="120" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-model="row.kefuName"
            size="small"
            placeholder="请填写申请人"
            v-if="checklistTableListEdit"
          ></el-input>
          <div v-else>
            {{ row.kefuName ? row.kefuName : "/" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客服交单时间" width="180" align="center">
        <template slot-scope="{ row }">
          <el-date-picker
            v-if="checklistTableListEdit"
            v-model="row.documentSubmitDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            size="small"
            style="width: 100%"
          ></el-date-picker>
          <div v-else>
            {{ row.documentSubmitDate ? row.documentSubmitDate : "/" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提成" width="150" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-model.number="row.commission"
            size="small"
            placeholder="输入提成"
            v-if="checklistTableListEdit"
          ></el-input>
          <div v-else>
            {{ row.commission ? row.commission : "/" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单量" width="150" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-model.number="row.validOrderNum"
            size="small"
            placeholder="输入单量"
            v-if="checklistTableListEdit"
          ></el-input>
          <div v-else>
            {{ row.validOrderNum ? row.validOrderNum : "/" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="230" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-model="row.remark"
            size="small"
            placeholder="输入备注"
            v-if="checklistTableListEdit"
          ></el-input>
          <div v-else>
            {{ row.remark ? row.remark : "/" }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  queryEnrollRepairOrderList,
  updateOnlineEnrollRepairOrder,
} from "@/api/order";
export default {
  name: "HandoverSheetTable",
  props: {
    // 查询订单需要的参数
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checklistTableList: [],
      checklistTableListEdit: false,
    };
  },
  computed: {},
  methods: {
    // 补充订单主表信息
    async updateOnlineEnrollRepairOrder() {
      const res = await updateOnlineEnrollRepairOrder(this.checklistTableList);
      if (res.code == "000") {
        await this.queryEnrollRepairOrderList();
        this.checklistTableListEdit = false;
        this.$emit("change-checklistTableListEdit", false);
      }
    },
    // 点击编辑映射到表格
    changeChecklistTableListEdit(flag) {
      this.checklistTableListEdit = flag;
      if (flag == false) {
        this.queryEnrollRepairOrderList();
      }
    },
    // 跳转详情
    goToOrderDesc(row) {
      const routeData = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn: row.relationOrderSn },
      });
      window.open(routeData.href, "_blank");
    },
    // 获取交接单列表
    async queryEnrollRepairOrderList() {
      const res = await queryEnrollRepairOrderList(this.params);
      if (res.code == "000") {
        this.checklistTableList = res.data.records;
        this.$emit("change-paginationTotal", res.data.total);
      }
    },
  },
  created() {
    this.queryEnrollRepairOrderList();
  },
};
</script>

<style scoped>
</style>
