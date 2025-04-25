<template>
  <div class="purseDetails">
    <el-card>
      <div class="master">
        <div class="masterTitle">钱包信息</div>
        <div class="masterInfo">
          <div class="masterInfoItem">
            <div class="masterInfoItem_label">师傅姓名：</div>
            <div class="masterInfoItem_value">
              <el-select
                v-model="masterInfoRealName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入师傅名称"
                :remote-method="querySearchRealName"
                @change="confirmMasterRealName"
              >
                <el-option
                  v-for="item in searchMasterList"
                  :key="item.uid"
                  :label="item.realName"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="masterInfoItem">
            <div class="masterInfoItem_label">余额：</div>
            <div class="masterInfoItem_value">
              ￥{{ accountMoneyList.balanceAmount }}
            </div>
          </div>
          <div class="masterInfoItem">
            <div class="masterInfoItem_label">冻结余额：</div>
            <div class="masterInfoItem_value">
              ￥{{ accountMoneyList.freezeBalanceAmount }}
            </div>
          </div>
          <div class="masterInfoItem">
            <div class="masterInfoItem_label">质保金额：</div>
            <div class="masterInfoItem_value">
              ￥{{ accountMoneyList.retentionMoney }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div class="searchBox">
      <div class="leftSearchData">
        <el-date-picker
          @change="changeQueryTimeData"
          v-model="queryTimeData"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin: 10px"
        >
        </el-date-picker>
        <el-select
          style="margin: 10px"
          v-model="queryMoneyListParams.isOut"
          placeholder="请选择"
        >
          <el-option
            v-for="item in isOutList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="queryMoneyListParams.moneyType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in moneyTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <el-button @click="searchQueryMoneyListFn">搜索</el-button>
        <el-button @click="resetQueryMoneyListFn">重置</el-button>
      </div>
    </div>
    <el-card>
      <el-table :data="moneyList" border style="width: 100%">
        <el-table-column align="center" prop="createTime" label="操作时间">
        </el-table-column>
        <el-table-column align="center" prop="accountTypeName" label="类型名称">
        </el-table-column>
        <el-table-column align="center" prop="accountDesc" label="描述">
        </el-table-column>
        <el-table-column align="center" prop="serialNumber" label="交易单号">
        </el-table-column>
        <el-table-column align="center" label="收支金额">
          <template slot-scope="{ row }">
            <div :style="{ color: row.type == 0 ? 'red' : 'green' }">
              {{ row.type == 0 ? "-" : "+" }}{{ row.operatingAmount }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 20px">
        <el-pagination
          :page-size="queryMoneyListParams.pageSize"
          background
          layout="prev, pager, next"
          :total="moneyListTotal"
          @current-change="changePageNo"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAccountMoney, queryMoneyList } from "@/api/user";
import { queryMasterName } from "@/api/order";
export default {
  data() {
    return {
      masterInfoRealName: null,
      searchMasterList: [],
      masterInfo: null,
      accountMoneyList: {
        retentionMoney: 0,
        freezeBalanceAmount: 0,
        balanceAmount: 0,
      },
      queryMoneyListParams: {
        isOut: "",
        moneyType: "",
        pageNo: 1,
        pageSize: 10,
        queryTime: null,
        uid: null,
      },
      moneyList: null,
      moneyListTotal: null,
      isOutList: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "入账",
        },
        {
          value: 0,
          label: "出账",
        },
      ],
      moneyTypeList: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "用户余额",
        },
        {
          value: 3,
          label: "质保金",
        },
        {
          value: 4,
          label: "冻结余额",
        },
      ],
      queryTimeData: null,
    };
  },
  methods: {
    // 确定师傅名称
    confirmMasterRealName(uid) {
      this.queryMoneyListParams.uid = uid;
      this.getAccountMoney();
      this.queryMoneyList();
    },
    // 查找师傅名称
    async querySearchRealName(e) {
      const res = await queryMasterName(e);
      if (res.code == "000") {
        this.searchMasterList = res.data;
      }
    },
    // 切换页码
    changePageNo(page) {
      this.queryMoneyListParams.pageNo = page;
      this.queryMoneyList();
    },
    // 点击重置触发
    resetQueryMoneyListFn() {
      this.queryMoneyListParams = {
        isOut: "",
        moneyType: "",
        pageNo: 1,
        pageSize: 10,
        queryTime: null,
      };
      this.queryMoneyListParams.uid = this.masterInfo.uid;
      this.queryTimeData = null;
      this.queryMoneyList();
    },
    // 点击搜索触发
    searchQueryMoneyListFn() {
      this.queryMoneyListParams.pageNo = 1;
      this.queryMoneyList();
    },
    // 选择时间范围
    changeQueryTimeData(e) {
      this.queryMoneyListParams.queryTime = e[0] + "/" + e[1];
    },
    // 用户金额明细
    async queryMoneyList() {
      const res = await queryMoneyList(this.queryMoneyListParams);
      if (res.code == "000") {
        this.moneyList = res.data.records;
        this.moneyListTotal = res.data.total;
      }
    },
    // 获取用户钱包详情
    async getAccountMoney() {
      const res = await getAccountMoney(this.masterInfo.uid);
      if (res.code == "000") {
        this.accountMoneyList = res.data;
      }
    },
  },
  created() {
    // this.masterInfo = this.$route.query.row;
    // this.queryMoneyListParams.uid = this.masterInfo.uid;
    // this.getAccountMoney();
    // this.queryMoneyList();
  },
};
</script>

<style scoped lang="scss">
.master {
  .masterTitle {
    font-weight: 700;
    margin-bottom: 20px;
  }

  .masterInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .masterInfoItem {
      flex: 1;
      display: flex;
      align-items: center;
      .masterInfoItem_label {
        margin-right: 5px;
      }
      .masterInfoItem_value {
      }
    }
  }
}

.purseDetails {
  padding: 20px;

  .searchBox {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .leftSearchData {
      display: flex;
      align-items: center;
    }
  }
}
</style>
