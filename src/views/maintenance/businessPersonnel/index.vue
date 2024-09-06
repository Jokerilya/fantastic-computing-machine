<template>
  <!-- 业务人员 -->
  <div class="businessPersonnel">
    <!-- 顶部工具栏 -->
    <div class="topTool">
      <el-input
        placeholder="输入业务姓名"
        class="toolInput"
        v-model="querySalesmanListData.realName"
      >
      </el-input>
      <el-input
        placeholder="输入推荐人姓名"
        v-model="querySalesmanListData.recommendName"
        class="toolInput"
      >
      </el-input>
      <el-button class="toolBtn" @click="querySalesmanList(1)">查询</el-button>
      <el-button class="toolBtn" @click="resetFn">重置</el-button>
    </div>

    <el-card>
      <div class="businessPersonnelList">
        <el-table
          :cell-style="{ 'text-align': 'center' }"
          :data="salesmanList"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column label="姓名" prop="realName"></el-table-column>
          <el-table-column label="头像">
            <template slot-scope="{ row }">
              <el-image
                :src="
                  row.realPortrait
                    ? row.realPortrait
                    : 'https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20230317/EA03777079.jpg'
                "
                style="height: 100px; width: 100px"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="电话" prop="phone"></el-table-column>
          <el-table-column label="业务类型">
            <template slot-scope="{ row }">
              {{ row.type === 1 ? "兼职业务" : "全职业务" }}
            </template>
          </el-table-column>
          <el-table-column label="小程序码">
            <template slot-scope="{ row }">
              <el-image
                :src="row.programUrl"
                style="height: 100px; width: 100px"
                v-if="row.programUrl"
              ></el-image>
              <div v-else>\</div>
            </template>
          </el-table-column>
          <el-table-column
            label="推荐人"
            prop="recommendName"
          ></el-table-column>
          <el-table-column
            label="合同数量"
            prop="agreementNum"
          ></el-table-column>
          <el-table-column
            label="合同金额"
            prop="agreementFee"
          ></el-table-column>
          <el-table-column
            label="佣金金额"
            prop="commissionFee"
          ></el-table-column>
          <el-table-column
            label="推荐奖励金额"
            prop="recommendFee"
          ></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="goToPromotionTeam(row.invitationCode)"
                >推广团队</el-button
              >
              <el-button
                type="text"
                @click="goToGiveawayRewards(row.invitationCode)"
                >佣金奖励</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tableContent_footer">
        <el-pagination
          @current-change="currentChangeFn"
          :page-size="querySalesmanListData.pageSize"
          layout="jumper, prev, pager, next,total "
          :total="total"
          :current-page="querySalesmanListData.pageNo"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { querySalesmanList } from "@/api/user";
export default {
  data() {
    return {
      querySalesmanListData: {
        pageNo: 1,
        pageSize: 10,
        realName: null,
        recommendName: null,
      },
      salesmanList: null,
      total: null,
    };
  },
  created() {
    this.querySalesmanList();
  },
  methods: {
    // 跳转佣金奖励列表
    goToGiveawayRewards(invitationCode) {
      this.$router.push({
        name: "giveawayRewards",
        query: { invitationCode },
      });
    },
    // 跳转推广团队
    goToPromotionTeam(invitationCode) {
      this.$router.push({
        name: "promotionTeam",
        query: { invitationCode },
      });
    },
    // 查询业务人员列表
    async querySalesmanList(id) {
      if (id === 1) {
        this.querySalesmanListData.pageNo = 1;
      }
      const { data } = await querySalesmanList(this.querySalesmanListData);
      this.salesmanList = data.records;
      this.total = data.total;
      console.log(this.salesmanList);
    },
    // 重置
    resetFn() {
      this.querySalesmanListData = {
        pageNo: 1,
        pageSize: 10,
        realName: null,
      };
      this.querySalesmanList();
    },
    // 点击页码触发
    currentChangeFn(page) {
      this.querySalesmanListData.pageNo = page;
      this.querySalesmanList();
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
