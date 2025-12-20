<template>
  <div class="orderSummaryTable">
    <el-table :data="orderSummaryTableList" border>
      <el-table-column prop="month" label="月份" width="100" align="center" />
      <el-table-column prop="degree" label="紧急程度" width="80" align="center">
        <template slot-scope="{ row }">
          {{ row.degreeName ? row.degreeName : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="故障日期"
        width="140"
        align="center"
      />
      <el-table-column
        prop="orderSn"
        label="订单编号"
        width="150"
        fixed
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="goToOrderDesc(row)">{{
            row.orderSn
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" width="80" align="center">
        <template slot-scope="{ row }">
          {{
            row.orderType == 1
              ? "散单"
              : row.orderType == 2
              ? "年保"
              : row.orderType == 3
              ? "年卡"
              : "/"
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderStatusName"
        label="订单状态"
        width="110"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="enterpriseName" label="企业名称" width="140" />
      <el-table-column
        prop="lastOrderCreateTime"
        label="距上次下单"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.lastOrderCreateTime ? row.lastOrderCreateTime : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="contactsPeople"
        label="联系人"
        width="120"
        align="center"
      />
      <el-table-column
        prop="contactsPhone"
        label="联系电话"
        width="120"
        align="center"
      />
      <el-table-column prop="address" label="客户地址" width="250" />
      <el-table-column
        prop="enterpriseDeviceNo"
        label="客户机台号"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          {{ row.enterpriseDeviceNo ? row.enterpriseDeviceNo : "/" }}
        </template>
      </el-table-column>
      <el-table-column prop="no" label="设备编码" width="115" align="center">
        <template slot-scope="{ row }">
          {{ row.no ? row.no : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceTypeName"
        label="设备类型"
        width="120"
        align="center"
      />
      <el-table-column
        prop="deviceSystemName"
        label="设备系统"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.deviceSystemName ? row.deviceSystemName : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceBrand"
        label="设备品牌"
        width="120"
        align="center"
      />
      <el-table-column
        prop="devicePlace"
        label="设备产地"
        width="80"
        align="center"
      />
      <el-table-column prop="simpleDesc" label="故障描述" width="200" />
      <el-table-column label="派单时间" width="150" align="center">
        <template slot-scope="{ row }">
          {{ row.assignTime ? row.assignTime : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="masterRealName"
        label="师傅姓名"
        width="90"
        align="center"
      >
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
      <el-table-column label="多师傅接单" width="150" align="center">
        <template slot-scope="{ row }">
          {{ row.multipleWorkMaster }}
        </template>
      </el-table-column>
      <el-table-column label="业务员" width="90" align="center">
        <template slot-scope="{ row }">
          {{ row.salesmanName ? row.salesmanName : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="完成时间" width="150" align="center">
        <template slot-scope="{ row }">
          {{ row.submitCheckTime ? row.submitCheckTime : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="人工费(企业)" width="110" align="center">
        <template slot-scope="{ row }">
          {{ row.doorAmount ? row.doorAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="配件费(企业)" width="110" align="center">
        <template slot-scope="{ row }">
          {{ row.partsAmount ? row.partsAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="税金(企业)" width="110" align="center">
        <template slot-scope="{ row }">
          {{ row.invoiceAmount ? row.invoiceAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="优惠减免(企业)" width="130" align="center">
        <template slot-scope="{ row }">
          {{ row.discountAmount ? row.discountAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="payAmount"
        label="支付金额(企业)"
        width="130"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.payAmount ? row.payAmount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="维修时长" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.workDuration ? row.workDuration : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="返修次数" width="100" align="center">
        <template slot-scope="{ row }">
          {{ row.returnCount ? row.returnCount : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="是否收款" width="120" align="center">
        <template slot-scope="{ row }"> {{ row.payFlag }} </template>
      </el-table-column>
      <el-table-column label="客服" width="170" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-if="orderSummaryTableListEdit"
            v-model="row.kefuName"
            size="small"
            placeholder="请填写负责人"
          ></el-input>
          <div v-else>
            {{ row.kefuName ? row.kefuName : "/" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单量" width="110" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-if="orderSummaryTableListEdit"
            v-model.number="row.validOrderNum"
            size="small"
            type="number"
            placeholder="请选择"
            @input="changeValidOrderNum(row)"
          ></el-input>
          <div v-else>
            {{ row.validOrderNum ? row.validOrderNum + "单" : "/" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="回访日期" width="150" align="center">
        <template slot-scope="{ row }">
          <el-date-picker
            v-if="orderSummaryTableListEdit"
            v-model="row.visitDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            size="small"
            style="width: 100%"
          ></el-date-picker>
          <div v-else>{{ row.visitDate ? row.visitDate : "/" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="交单日期" width="150" align="center">
        <template slot-scope="{ row }">
          <el-date-picker
            v-if="orderSummaryTableListEdit"
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
      <el-table-column label="返修原因" width="230" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-if="orderSummaryTableListEdit"
            v-model="row.reworkReason"
            size="small"
            placeholder="输入返修原因"
          ></el-input>
          <div v-else>{{ row.reworkReason ? row.reworkReason : "/" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="跟踪详情" width="230" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-if="orderSummaryTableListEdit"
            v-model="row.orderFollow"
            size="small"
            placeholder="输入跟踪详情"
          ></el-input>
          <div v-else>{{ row.orderFollow ? row.orderFollow : "/" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="回访结果" width="230" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-if="orderSummaryTableListEdit"
            v-model.number="row.visitResult"
            size="small"
            placeholder="输入回访结果"
          ></el-input>
          <div v-else>{{ row.visitResult ? row.visitResult : "/" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="停机状况" width="230" align="center">
        <template slot-scope="{ row }">
          <el-input
            v-if="orderSummaryTableListEdit"
            v-model="row.shutdownSituation"
            size="small"
            placeholder="输入停机情况"
          ></el-input>
          <div v-else>
            {{ row.shutdownSituation ? row.shutdownSituation : "/" }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryRepairOrderList, updateOnlineRepairOrder } from "@/api/order";
export default {
  name: "OrderSummaryTable",
  props: {
    // 查询订单需要的参数
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderSummaryTableList: [],
      orderSummaryTableListEdit: false,
    };
  },
  computed: {},
  methods: {
    // 跳转详情
    goToOrderDesc(row) {
      const routeData = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn },
      });
      window.open(routeData.href, "_blank");
    },
    // 补充订单主表信息
    async updateOnlineRepairOrder() {
      const res = await updateOnlineRepairOrder(this.orderSummaryTableList);
      if (res.code == "000") {
        await this.queryRepairOrderList();
        this.orderSummaryTableListEdit = false;
        this.$emit("change-orderSummaryTableListEdit", false);
      }
    },
    // 点击编辑映射到表格
    changeOrderSummaryTableListEdit(flag) {
      this.orderSummaryTableListEdit = flag;
    },
    // 查询总表列表
    async queryRepairOrderList() {
      const res = await queryRepairOrderList(this.params);
      if (res.code == "000") {
        this.orderSummaryTableList = res.data.records;
        this.$emit("change-paginationTotal", res.data.total);
      }
    },
  },
  created() {
    this.queryRepairOrderList();
  },
};
</script>

<style scoped>
</style>
