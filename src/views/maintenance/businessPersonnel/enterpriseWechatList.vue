<template>
  <div class="enterpriseWechatList">
    <first-title title="企业微信群列表" />
    <!-- 顶部工具栏 -->
    <div class="topTool">
      <el-form :inline="true">
        <el-form-item label="群名称:">
          <el-input
            placeholder="支持模糊查询"
            class="toolInput"
            style="width: 120px"
            v-model="queryEnterpriseWechatListParams.chatName"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务员:">
          <el-select
            class="toolInput"
            filterable
            style="width: 120px"
            :remote-method="remoteMethod"
            remote
            v-model="queryEnterpriseWechatListParams.salesmanId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in salesmanOptions"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内部联系人昵称:">
          <el-input
            placeholder="支持模糊查询"
            class="toolInput"
            style="width: 120px"
            v-model="queryEnterpriseWechatListParams.internalUsername"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务员绑定状态:">
          <el-select
            v-model="queryEnterpriseWechatListParams.bindSalesmanFlag"
            placeholder="请选择"
          >
            <el-option label="全部" :value="null"> </el-option>
            <el-option label="仅查询绑定业务员的群" :value="true"> </el-option>
            <el-option label="仅查询未绑定业务员的群" :value="false">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button class="toolBtn" @click="searchFn">查询</el-button>
        <el-button class="toolBtn" @click="resetFn">重置</el-button>
        <el-button class="toolBtn" @click="batchBindSalesman">
          批量绑定业务员</el-button
        >
        <el-button class="toolBtn" @click="handleRepairOrderBind">
          同步维修订单</el-button
        >
      </div>
    </div>
    <el-card>
      <div class="customerManagementlList">
        <el-table
          ref="customerManagementlListTable"
          :cell-style="{ 'text-align': 'center' }"
          :data="enterpriseWechatList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="群创建时间" prop="createTime">
            <template slot-scope="{ row }">
              {{ row.createTime ? row.createTime : "/" }}
            </template>
          </el-table-column>
          <el-table-column label="企业微信群名称" prop="chatName">
            <template slot-scope="{ row }">
              {{ row.chatName ? row.chatName : "/" }}
            </template>
          </el-table-column>
          <el-table-column label="外部联系人昵称" prop="externalUsername">
            <template slot-scope="{ row }">
              {{ row.externalUsername ? row.externalUsername : "/" }}
            </template>
          </el-table-column>
          <el-table-column label="内部联系人昵称" prop="internalUsername">
            <template slot-scope="{ row }">
              {{ row.internalUsername ? row.internalUsername : "/" }}
            </template>
          </el-table-column>
          <el-table-column label="业务员" prop="salesmanId">
            <template slot-scope="{ row }">
              {{ row.salesmanName ? row.salesmanName : "/" }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="text" @click="openEnterpriseWechatBind(row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tableContent_footer">
        <el-pagination
          layout="jumper, prev, pager, next,total"
          :page-size="queryEnterpriseWechatListParams.pageSize"
          :total="queryEnterpriseWechatListTotal"
          @current-change="currentChangeFn"
          :current-page="queryEnterpriseWechatListParams.pageNo"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 群绑定业务员 -->
    <el-dialog
      :visible.sync="enterpriseWechatBindVisible"
      :before-close="closeEnterpriseWechatBind"
      title="群绑定业务员"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form>
        <el-form-item label="绑定群名:">
          {{ handleEnterpriseWechatBindParams.chatName }}
        </el-form-item>
        <el-form-item label="业务员:">
          <el-select
            filterable
            :remote-method="remoteMethod"
            remote
            v-model="handleEnterpriseWechatBindParams.salesmanId"
            placeholder="请输入业务员"
          >
            <el-option
              v-for="item in salesmanOptions"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEnterpriseWechatBind">取 消</el-button>
        <el-button type="primary" @click="handleEnterpriseWechatBind"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  querySalesmanList,
  queryEnterpriseWechatList,
  handleEnterpriseWechatBind,
  handleRepairOrderBind,
} from "@/api/user";
export default {
  data() {
    return {
      enterpriseWechatList: [],
      queryEnterpriseWechatListParams: {
        pageNo: 1,
        pageSize: 10,
        chatName: null,
        salesmanId: null,
        internalUsername: null,
        bindSalesmanFlag: null,
      },
      handleEnterpriseWechatBindParams: {
        salesmanId: "",
        chatIds: "",
        chatName: null,
      },
      queryEnterpriseWechatListTotal: 0,
      salesmanOptions: [],
      enterpriseWechatBindVisible: false,
    };
  },
  methods: {
    // 点击搜索按钮
    searchFn() {
      this.queryEnterpriseWechatListParams.pageNo = 1;
      this.queryEnterpriseWechatList();
    },
    // 同步维修订单
    async handleRepairOrderBind() {
      const res = await handleRepairOrderBind();
      if (res.code == "000") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.queryEnterpriseWechatList();
      }
    },
    // 批量绑定业务员
    batchBindSalesman() {
      this.enterpriseWechatBindVisible = true;
    },
    // 重置查询条件
    resetFn() {
      this.queryEnterpriseWechatListParams = {
        pageNo: 1,
        pageSize: 10,
        chatName: null,
        salesmanId: null,
        internalUsername: null,
        bindSalesmanFlag: null,
      };
      this.salesmanOptions = [];
      this.$refs.customerManagementlListTable.clearSelection();
      this.queryEnterpriseWechatList();
    },
    // 多选框选中数据
    handleSelectionChange(val) {
      if (val.length > 0) {
        let chatIds = "";
        let chatNames = "";
        val.forEach((item) => {
          chatIds += item.id + ",";
          chatNames += item.chatName + ",";
        });
        this.handleEnterpriseWechatBindParams.chatIds = chatIds.slice(0, -1);
        this.handleEnterpriseWechatBindParams.chatName = chatNames.slice(0, -1);
      } else {
        this.handleEnterpriseWechatBindParams.chatIds = "";
        this.handleEnterpriseWechatBindParams.chatName = null;
      }
    },
    // 确认绑定业务员
    async handleEnterpriseWechatBind() {
      const res = await handleEnterpriseWechatBind(
        this.handleEnterpriseWechatBindParams
      );
      if (res.code == "000") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.closeEnterpriseWechatBind();
        this.queryEnterpriseWechatList();
        this.$refs.customerManagementlListTable.clearSelection();
      }
    },
    // 打开群绑定业务员弹窗
    openEnterpriseWechatBind(row) {
      this.enterpriseWechatBindVisible = true;
      this.handleEnterpriseWechatBindParams.chatIds = row.id;
      this.handleEnterpriseWechatBindParams.chatName = row.chatName
        ? row.chatName
        : "/";
    },
    // 关闭群绑定业务员弹窗
    closeEnterpriseWechatBind() {
      this.enterpriseWechatBindVisible = false;
      this.handleEnterpriseWechatBindParams.salesmanId = "";
    },
    // 推荐人搜索
    async remoteMethod(query) {
      const params = {
        pageNo: 1,
        pageSize: 999,
        realName: query,
      };
      const res = await querySalesmanList(params);
      if (res.code == "000") {
        this.salesmanOptions = res.data.records;
      }
    },
    // 分页点击
    currentChangeFn(page) {
      this.queryEnterpriseWechatListParams.pageNo = page;
      this.queryEnterpriseWechatList();
    },
    // 企业微信外部群列表
    async queryEnterpriseWechatList() {
      const res = await queryEnterpriseWechatList(
        this.queryEnterpriseWechatListParams
      );
      if (res.code == "000") {
        this.enterpriseWechatList = res.data.records;
        this.queryEnterpriseWechatListTotal = res.data.total;
      }
    },
  },
  created() {
    this.queryEnterpriseWechatList();
  },
};
</script>

<style scoped lang="less">
.enterpriseWechatList {
  padding: 20px;
  .topTool {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .toolInput {
      width: 240px;
      margin-right: 15px;
    }
    .toolBtn {
      color: #2e4c9e;
    }
  }
  .tableContent_footer {
    text-align: center;
    height: 50px;
  }

  .customerManagementlList {
    padding: 20px;
  }

  .recordLine {
    display: flex;
    .label {
      font-weight: 700;
      width: 90px;
    }
    .content {
      flex: 1;
    }
  }
}
</style>
