<template>
  <div class="examineItem">
    <!-- <div class="operateBtn">
      <el-button
        type="primary"
        plain
        @click="
          examTemplate(
            'https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/%E5%B8%88%E5%82%85%E8%80%83%E9%A2%98%E6%A8%A1%E6%9D%BF.xlsx'
          )
        "
        >考题模板</el-button
      >
      <el-button type="primary" plain @click="openExamineVisible"
        >新增考核</el-button
      >
    </div> -->
    <el-card>
      <el-table border :data="complaintList">
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="realName" label="师傅名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="relationOrderSn"
          label="企业订单号"
        >
        </el-table-column>
        <el-table-column align="center" prop="orderSn" label="师傅订单号">
        </el-table-column>
        <el-table-column align="center" prop="content" label="投诉内容">
        </el-table-column>
      </el-table>
    </el-card>

    <div class="tabelPagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="complaintListlenght"
        :page-size="queryRepairOrderComplaintParmas.pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { queryRepairOrderComplaint } from "@/api/order";
export default {
  data() {
    return {
      complaintList: [],
      complaintListlenght: 0,
      queryRepairOrderComplaintParmas: {
        pageNo: 1,
        pageSize: 10,
      },
    };
  },
  methods: {
    // 切换页码
    changePage(page) {
      this.queryRepairOrderComplaintParmas.pageNo = page;
      this.queryRepairOrderComplaint();
    },
    // 获取投诉列表
    async queryRepairOrderComplaint() {
      const res = await queryRepairOrderComplaint(
        this.queryRepairOrderComplaintParmas
      );
      if (res.code == "000") {
        this.complaintList = res.data.records;
        this.complaintListlenght = res.data.total;
      }
    },
  },
  created() {
    this.queryRepairOrderComplaint();
  },
};
</script>

<style scoped lang="scss">
.examineItem {
  padding: 20px;

  .operateBtn {
    text-align: right;
    padding-bottom: 20px;
  }
}
.tabelPagination {
  margin-top: 20px;
  text-align: center;
}
</style>
