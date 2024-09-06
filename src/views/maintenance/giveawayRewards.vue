<template>
  <!-- 业务人员 -->
  <div class="businessPersonnel">
    <!-- 顶部工具栏 -->
    <!-- <div class="topTool">
      <el-select
        class="toolInput"
        v-model="queryCommissionRewardListParams.type"
        placeholder="选择要查询的身份"
      >
        <el-option
          v-for="(item, index) in standingOptions"
          :key="index + 1"
          :label="item"
          :value="index + 1"
        >
        </el-option>
      </el-select>
      <el-input
        v-model="queryCommissionRewardListParams.realName"
        placeholder="输入姓名"
        class="toolInput"
      >
      </el-input>
      <el-button class="toolBtn">查询</el-button>
      <el-button class="toolBtn">重置</el-button>
    </div> -->

    <el-card>
      <div class="businessPersonnelList">
        <el-table
          :cell-style="{ 'text-align': 'center' }"
          :data="commissionRewardList"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column prop="accountDesc" label="账务描述">
          </el-table-column>
          <el-table-column prop="triggerRealName" label="真实姓名">
          </el-table-column>
          <el-table-column prop="serialNumber" label="流水号">
          </el-table-column>
          <el-table-column prop="operatingAmount" label="操作金额">
            <template slot-scope="{ row }">
              ￥{{ row.operatingAmount }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tableContent_footer">
        <el-pagination
          @current-change="currentChangeFn"
          layout="jumper, prev, pager, next,total "
          :total="commissionRewardListTotal"
          :current-page="queryCommissionRewardListParams.pageNo"
          :page-size="queryCommissionRewardListParams.pageSize"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getPromotionInfo, queryCommissionRewardList } from "@/api/commission";
export default {
  data() {
    return {
      standingOptions: ["企业", "师傅", "业务"],
      queryCommissionRewardListParams: {
        pageNo: 1,
        pageSize: 10,
        type: null,
        uid: null,
      },
      commissionRewardList: [],
      commissionRewardListTotal: null,
    };
  },
  async created() {
    const invitationCode = this.$route.query.invitationCode;
    const res = await getPromotionInfo(invitationCode);
    this.queryCommissionRewardListParams.type = res.data.type;
    this.queryCommissionRewardListParams.uid = res.data.uid;
    this.queryCommissionRewardListParams.realName = res.data.realName;
    this.queryCommissionRewardList();
  },
  methods: {
    // 切换页码
    currentChangeFn(page) {
      this.queryCommissionRewardListParams.pageNo = page;
      this.queryCommissionRewardList();
    },

    // 查询佣金奖励列表
    async queryCommissionRewardList() {
      const res = await queryCommissionRewardList(
        this.queryCommissionRewardListParams
      );
      this.commissionRewardList = res.data.records;
      this.commissionRewardListTotal = res.data.total;
    },
  },
};
</script>

<style lang="less" scoped>
// 顶部工具栏
.topTool {
  display: flex;
  margin-bottom: 20px;
  .toolInput {
    width: 170px;
    margin-right: 10px;
  }
  .toolBtn {
    color: #2e4c9e;
  }
}

// 表格内容部分
.businessPersonnel {
  padding: 20px;
  .businessPersonnelList {
    padding: 20px;
  }
  .tableContent_footer {
    text-align: center;
    height: 50px;
  }
}
</style>
