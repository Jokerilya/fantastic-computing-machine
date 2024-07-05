<template>
  <div class="messageList">
    <!-- 顶部 -->
    <div class="topControls">
      <div class="topControlsSearchInfo">
        <div class="topControlsSearchInfoItem">
          <div class="label">订单号</div>
          <div>
            <el-input
              placeholder="请输入订单号"
              v-model="queryRepairMessgaeParams.orderSn"
            ></el-input>
          </div>
        </div>
        <div class="topControlsSearchInfoItem">
          <div class="label">状态</div>
          <div>
            <el-select
              placeholder="请选择状态"
              v-model="queryRepairMessgaeParams.status"
            >
              <el-option label="未读" :value="0"> </el-option>
              <el-option label="已读" :value="1"> </el-option>
            </el-select>
          </div>
        </div>
        <div class="topControlsSearchInfoItem">
          <div class="label">模块</div>
          <div>
            <el-select
              placeholder="请选择状态"
              v-model="queryRepairMessgaeParams.module"
            >
              <el-option
                :label="item.text"
                :value="item.value"
                v-for="item in repairMessgaemoduleType"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="topControlsBtn">
        <el-button type="primary" plain @click="searchRepairMessgaeList"
          >搜索</el-button
        >
        <el-button type="primary" plain @click="resetRepairMessgaeList"
          >重置</el-button
        >
      </div>
    </div>

    <!-- 表格 -->
    <el-card style="padding: 20px">
      <el-table :data="repairMessgaeList" style="width: 100%">
        <el-table-column prop="createTime" label="添加时间" align="center">
        </el-table-column>
        <el-table-column prop="operationPeople" label="操作人" align="center">
        </el-table-column>
        <el-table-column label="模块" align="center">
          <template slot-scope="{ row }">
            {{
              row.module
                ? repairMessgaemoduleType[
                    repairMessgaemoduleType.findIndex(
                      (item) => item.value == row.module
                    )
                  ].text
                : "暂无模块"
            }}
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center">
          <template slot-scope="{ row }">
            {{ row.orderSn ? row.orderSn : "暂无订单号" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            {{ row.status == 1 ? "已读" : "未读" }}
          </template>
        </el-table-column>
        <el-table-column prop="message" label="内容" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="goToControls(row)"
              >前往操作</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="tabelPagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="repairMessgaeListTotal"
          :page-size="10"
          :current-page="queryRepairMessgaeParams.pageNo"
          @current-change="changeRepairMessgaeListPage"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { queryRepairMessgae } from "@/api/order";
export default {
  data() {
    return {
      queryRepairMessgaeParams: {
        status: null,
        orderSn: null,
        module: null,
        pageNo: 1,
        pageSize: 10,
      },
      repairMessgaeList: [],
      repairMessgaeListTotal: null,
      repairMessgaemoduleType: [
        {
          text: "订单操作",
          value: "order",
        },
        {
          text: "师傅操作",
          value: "master",
        },
        {
          text: "企业操作",
          value: "enterprise",
        },
        {
          text: "产品咨询",
          value: "product_consult",
        },
      ],
    };
  },
  methods: {
    // 查询平台信息
    async queryRepairMessgae() {
      const res = await queryRepairMessgae(this.queryRepairMessgaeParams);
      this.repairMessgaeListTotal = res.data.total;
      this.repairMessgaeList = res.data.records;
    },
    // 切换页码
    changeRepairMessgaeListPage(page) {
      this.queryRepairMessgaeParams.pageNo = page;
      this.queryRepairMessgae();
    },
    // 搜索
    searchRepairMessgaeList() {
      this.queryRepairMessgaeParams.pageNo = 1;
      this.queryRepairMessgae();
    },
    // 重置
    resetRepairMessgaeList() {
      this.queryRepairMessgaeParams = {
        status: null,
        orderSn: null,
        module: null,
        pageNo: 1,
        pageSize: 10,
      };
      this.queryRepairMessgae();
    },
    // 前往操作
    goToControls(row) {
      if (row.module == "order") {
        this.$router.push({
          name: "maintenance_order_desc",
          query: { orderSn: row.orderSn },
        });
      }
      if (row.module == "enterprise") {
        this.$router.push({
          name: "enterpriseList",
        });
      }
      if (row.module == "master") {
        this.$router.push({
          name: "worker",
        });
      }
      if (row.module == "product_consult") {
        this.$router.push("/activity/message");
      }
      this.queryRepairMessgae();
    },
  },
  created() {
    this.queryRepairMessgae();
  },
};
</script>

<style scoped lang="less">
.messageList {
  padding: 20px;
  .topControls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .topControlsSearchInfo {
      display: flex;
      align-items: center;
      .topControlsSearchInfoItem {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .label {
          font-weight: 700;
          font-size: 16px;
          color: #606266;
          margin-right: 20px;
        }
      }
    }
  }

  .tabelPagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
