<template>
  <div class="purseDetails">
    <el-form label-width="80px" class="rule-form" label-position="right">
      <el-row :gutter="20" style="margin-bottom: 15px">
        <el-col :span="5">
          <el-form-item label="师傅名称">
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
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="账户类型">
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
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="进/出账">
            <el-select
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
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            @change="changeQueryTimeData"
            v-model="queryTimeData"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button @click="handleUserMoneyExport">导出</el-button>
          <el-button @click="searchQueryMoneyListFn">搜索</el-button>
          <el-button @click="resetQueryMoneyListFn">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-card>
      <div class="masterInfo">
        <div class="masterInfo_left">
          <div class="masterInfoItem">
            <div class="masterInfoItem_label">可提现余额：</div>
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
        <div class="masterInfo_right">
          <el-button type="danger" @click="handleRetentionWithdrawal">
            返还质保金
          </el-button>
        </div>
      </div>
      <el-table :data="moneyList" border style="width: 100%" height="65vh">
        <el-table-column align="center" prop="createTime" label="操作时间">
        </el-table-column>
        <el-table-column align="center" prop="accountTypeName" label="类型名称">
        </el-table-column>
        <el-table-column align="center" prop="accountDesc" label="描述">
        </el-table-column>
        <el-table-column align="center" prop="serialNumber" label="交易单号">
        </el-table-column>
        <el-table-column align="center" label="账户类型">
          <template slot-scope="{ row }">
            {{ moneyTypeLabel(row.moneyType) }}
          </template>
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
import { queryMasterName, handleUserMoneyExport } from "@/api/order";
import { handleRetentionWithdrawal } from "@/api/master";
export default {
  data() {
    return {
      masterInfoRealName: null,
      searchMasterList: [],
      accountMoneyList: {
        retentionMoney: 0,
        freezeBalanceAmount: 0,
        balanceAmount: 0,
      },
      queryMoneyListParams: {
        isOut: "",
        moneyType: "",
        pageNo: 1,
        pageSize: 50,
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
    // 返还质保金
    async handleRetentionWithdrawal() {
      this.$confirm("您确定该师傅不再平台接单?", "返还质保金", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleRetentionWithdrawal(
          this.queryMoneyListParams.uid
        );
        if (res.code == "000") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
        }
      });
    },
    // 点击导出触发的事件
    handleUserMoneyExport() {
      if (!this.queryMoneyListParams.uid) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: "<strong>请先填写选择师傅</strong>",
        });
        return;
      }
      const index = this.searchMasterList.findIndex(
        (e) => e.uid == this.queryMoneyListParams.uid
      );
      const realName = this.searchMasterList[index].realName;

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，要+1
      const day = String(now.getDate()).padStart(2, "0");

      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      const data = this.queryMoneyListParams;
      data.pageSize = 1000;
      handleUserMoneyExport(data).then((res) => {
        if (res) {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.download = `${realName}_钱包明细_${year}${month}${day}`; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          loading.close();
        }
      });
    },
    // 类型转含义
    moneyTypeLabel(value) {
      const index = this.moneyTypeList.findIndex((e) => e.value == value);
      return this.moneyTypeList[index].label;
    },
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
        pageSize: 50,
        queryTime: null,
      };
      this.queryMoneyListParams.uid = null;
      this.queryTimeData = null;
      this.queryMoneyList();
    },
    // 点击搜索触发
    searchQueryMoneyListFn() {
      if (!this.queryMoneyListParams.uid) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: "<strong>请先填写选择师傅</strong>",
        });
        return;
      }
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
      const res = await getAccountMoney(this.queryMoneyListParams.uid);
      if (res.code == "000") {
        this.accountMoneyList = res.data;
      }
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.masterTitle {
  font-weight: 700;
  margin-bottom: 20px;
}

.masterInfo {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .masterInfo_left {
    display: flex;
    align-items: center;
  }

  .masterInfoItem {
    margin-right: 30px;
    display: flex;
    align-items: center;
    .masterInfoItem_label {
    }
    .masterInfoItem_value {
      color: red;
    }
  }
}

.purseDetails {
  padding: 30px 20px 20px 20px;

  .searchBox {
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
