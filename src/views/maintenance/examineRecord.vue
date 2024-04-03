<template>
  <div class="examineRecord">
    <el-card>
      <el-table border :data="masterAssessmentRecords">
        <el-table-column align="center" prop="createTime" label="时间">
        </el-table-column>
        <el-table-column align="center" prop="realName" label="真实姓名">
        </el-table-column>
        <el-table-column align="center" prop="passLine" label="及格线">
        </el-table-column>
        <el-table-column align="center" prop="point" label="得分">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="{ row }">
            {{ row.status == 1 ? "通过" : "未通过" }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { queryMasterAssessmentRecords } from "@/api/order";
export default {
  data() {
    return {
      masterAssessmentRecords: null,
      masterAssessmentRecordsId: null,
    };
  },
  methods: {
    // 查询考核记录
    async queryMasterAssessmentRecords() {
      const res = await queryMasterAssessmentRecords(
        this.masterAssessmentRecordsId
      );
      this.masterAssessmentRecords = res.data;
    },
  },
  created() {
    this.masterAssessmentRecordsId = Number(this.$route.query.id);
    this.queryMasterAssessmentRecords();
  },
};
</script>

<style scoped lang="scss">
.examineRecord {
  padding: 20px;
}
</style>
