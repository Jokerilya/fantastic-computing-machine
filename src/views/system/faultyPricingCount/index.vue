<template>
  <div class="faultyPricingCount">
    <first-title title="故障项定价统计" />
    <el-card>
      <el-table
        border
        style="width: 100%"
        height="500"
        :data="faultItemApplyList"
      >
        <el-table-column prop="position" label="故障部位" align="center">
        </el-table-column>
        <el-table-column label="机床类型" align="center">
          <template slot-scope="{ row }">
            {{ row.machineType == 1 ? "加工中心" : "数控车床" }}
          </template>
        </el-table-column>
        <el-table-column prop="simpleDesc" label="故障项目" align="center">
        </el-table-column>
        <el-table-column
          prop="masterAmount"
          label="师傅展示价格"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="generalAmount"
          label="散单企业展示价格"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="annualAmount"
          label="年保企业展示价格"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="openApplicationRecord(row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="定价申请记录"
      width="40%"
      :visible="applicationRecordShow"
      :before-close="closeApplicationRecord"
    >
      <el-table border height="350" :data="faultItemApplyDetails">
        <el-table-column prop="amount" label="提交价格" align="center">
        </el-table-column>
        <el-table-column prop="count" label="提交次数" align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryFaultItemApplyList,
  queryFaultItemApplyDetails,
} from "@/api/order";
export default {
  data() {
    return {
      faultItemApplyList: [],
      applicationRecordShow: false,
      faultItemApplyDetails: [],
    };
  },
  methods: {
    // 获取列表
    async queryFaultItemApplyList() {
      const res = await queryFaultItemApplyList();
      this.faultItemApplyList = res.data;
    },
    async openApplicationRecord(id) {
      const res = await queryFaultItemApplyDetails(id);
      this.faultItemApplyDetails = res.data;
      this.applicationRecordShow = true;
    },
    closeApplicationRecord() {
      this.applicationRecordShow = false;
    },
  },
  created() {
    this.queryFaultItemApplyList();
  },
};
</script>

<style lang="less" scoped>
.faultyPricingCount {
  padding: 20px;
}
</style>
