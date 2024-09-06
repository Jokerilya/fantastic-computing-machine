<template>
  <!-- 业务人员 -->
  <div class="businessPersonnel">
    <el-card>
      <div class="businessPersonnelList">
        <el-table
          :cell-style="{ 'text-align': 'center' }"
          :data="promotionTeamList"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column label="头像" center>
            <template slot-scope="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="
                  row.realPortrait
                    ? row.realPortrait
                    : 'https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20230317/EA03777079.jpg'
                "
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="真实姓名" center>
          </el-table-column>
          <el-table-column label="身份" center>
            <template slot-scope="{ row }">
              {{ beInvitedUidTypeArr[row.beInvitedUidType - 1] }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" center>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" center>
          </el-table-column>
          <el-table-column label="操作" center>
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="goToGiveawayRewards(row.invitationCode)"
              >
                佣金奖励
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tableContent_footer">
        <el-pagination
          @current-change="currentChangeFn"
          :page-size="queryPromotionTeamListParams.pageSize"
          layout="jumper, prev, pager, next,total"
          :total="promotionTeamListTotal"
          :current-page="queryPromotionTeamListParams.pageNo"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getPromotionInfo, queryPromotionTeamList } from "@/api/commission";
export default {
  data() {
    return {
      queryPromotionTeamListParams: {
        pageNo: 1,
        pageSize: 10,
        type: null,
        uid: null,
        realName: null,
      },
      promotionTeamList: [],
      promotionTeamListTotal: null,
      beInvitedUidTypeArr: ["企业", "师傅", "业务"],
    };
  },
  async created() {
    const invitationCode = this.$route.query.invitationCode;
    const res = await getPromotionInfo(invitationCode);
    this.queryPromotionTeamListParams.type = res.data.type;
    this.queryPromotionTeamListParams.uid = res.data.uid;
    this.queryPromotionTeamList();
  },
  methods: {
    // 切换页码
    currentChangeFn(page) {
      this.queryPromotionTeamListParams.pageNo = page;
      this.queryPromotionTeamList();
    },
    // 跳转佣金奖励列表
    goToGiveawayRewards(invitationCode) {
      this.$router.push({
        name: "giveawayRewards",
        query: { invitationCode },
      });
    },
    // 查询推广团队列表
    async queryPromotionTeamList() {
      const res = await queryPromotionTeamList(
        this.queryPromotionTeamListParams
      );
      this.promotionTeamList = res.data.records;
      this.promotionTeamListTotal = res.data.total;
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
