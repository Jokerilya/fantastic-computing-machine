<template>
  <!-- 业务人员 -->
  <div class="customerManagement">
    <!-- 顶部工具栏 -->
    <div class="topTool">
      <el-input
        placeholder="请输入公司名称"
        class="toolInput"
        v-model="enterpriseName"
      ></el-input>
      <el-button class="toolBtn" @click="searchFn">查询</el-button>
      <el-button class="toolBtn" @click="resetSearch">重置</el-button>
    </div>

    <el-card>
      <div class="customerManagementlList">
        <el-table
          :cell-style="{ 'text-align': 'center' }"
          :data="customerPoolList"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column
            label="公司名称"
            prop="enterpriseName"
          ></el-table-column>
          <el-table-column
            label="设备台数"
            prop="deviceScale"
          ></el-table-column>
          <el-table-column label="设备类型">
            <template slot-scope="{ row }">
              {{ changDeviceTypeIds(row.deviceTypeIds) }}
            </template>
          </el-table-column>
          <el-table-column
            label="联系人员"
            prop="maintenancePeople"
          ></el-table-column>
          <el-table-column
            label="联系电话"
            prop="maintenancePhone"
          ></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{ row }">
              {{
                row.status === 0
                  ? "已释放"
                  : row.status === 1
                  ? "跟进中"
                  : "已签约"
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="text" @click="openRecordDialog(row.id)"
                >跟进记录</el-button
              >
              <el-button type="text" @click="openAuditDialog(row.id)"
                >申请记录</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tableContent_footer">
        <el-pagination
          @current-change="currentChangeFn"
          layout="jumper, prev, pager, next,total "
          :total="total"
          :page-size="pageSize"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 跟进记录框 -->
    <el-dialog
      title="跟进记录"
      width="30%"
      :visible="recordDialog"
      :before-close="closeRecordDialog"
      :close-on-click-modal="false"
      center
    >
      <div style="height: 55vh;overflow: auto;">
        <el-collapse accordion>
          <el-collapse-item
            v-for="(item, index) in customerVisitList"
            :key="index"
          >
            <template slot="title">
              {{ "第" + (index + 1) + "次跟进记录" }}
            </template>
            <div class="recordLine">
              <div class="label">
                沟通内容:
              </div>
              <div class="content">
                {{ item.content }}
              </div>
            </div>
            <div class="recordLine">
              <div class="label">
                客户意向:
              </div>
              <div class="content">
                {{ item.intention }}
              </div>
            </div>
            <div class="recordLine">
              <div class="label">
                签约状态:
              </div>
              <div class="content">
                {{ item.status === 0 ? "未签约" : "已签约" }}
              </div>
            </div>
            <div class="recordLine">
              <div class="label">
                拜访时间:
              </div>
              <div class="content">
                {{ item.createTime }}
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>

    <!-- 跟进审核框 -->
    <el-dialog
      title="申请记录"
      width="50%"
      :visible="auditDialog"
      :before-close="closeAuditDialog"
      :close-on-click-modal="false"
      center
    >
      <div style="height: 55vh;overflow: auto;">
        <el-table
          :data="customerApplyVisitList"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column label="申请时间" prop="createTime"></el-table-column>
          <el-table-column label="业务员名称" prop="realName"></el-table-column>
          <el-table-column label="业务员电话" prop="phone"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.status === 0"
                type="text"
                @click="openChooseAuditDialog(row.id)"
                >操作</el-button
              >
              <div v-else>{{ row.status === 1 ? "已通过" : "已驳回" }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      title="审核请求"
      width="30%"
      :visible="chooseAuditVisible"
      center
      :before-close="closeChooseAuditDialog"
    >
      <div style="display: flex;justify-content: center;">
        <el-select v-model="statusValue" placeholder="请选择">
          <el-option label="同意" :value="1"></el-option>
          <el-option label="驳回" :value="2"> </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeChooseAuditDialog">取 消</el-button>
        <el-button type="primary" @click="comfirmBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryCustomerPool,
  queryCustomerVisitList,
  queryCustomerApplyVisitList,
  handleCustomerApplyVisit,
} from "@/api/user";
export default {
  data() {
    return {
      statusValue: null,
      chooseAuditVisible: false,
      customerApplyVisitId: null,
      customerVisitList: [],
      customerPoolList: [],
      customerApplyVisitList: [],
      recordDialog: false,
      auditDialog: false,
      chooseId: null,
      pageNo: 1,
      pageSize: 8,
      total: 0,
      enterpriseName: null,
    };
  },
  methods: {
    // 搜索框
    searchFn() {
      this.pageNo = 1;
      this.queryCustomerPool();
    },
    // 重置搜索
    resetSearch() {
      this.enterpriseName = null;
      this.queryCustomerPool();
    },
    // 点击页码触发
    currentChangeFn(page) {
      this.pageNo = page;
      this.queryCustomerPool(this.customerApplyVisitId);
    },
    // 确定客户的申请
    async comfirmBtn() {
      const res = await handleCustomerApplyVisit({
        id: this.customerApplyVisitId,
        status: this.statusValue,
      });
      if (res.message === "操作成功") {
        this.closeChooseAuditDialog();
        this.openAuditDialog();
      }
    },
    /* 关闭 */
    closeChooseAuditDialog() {
      this.statusValue = null;
      this.chooseAuditVisible = false;
    },
    // 打开选择审核申请框
    openChooseAuditDialog(id) {
      this.customerApplyVisitId = id;
      this.chooseAuditVisible = true;
    },
    // 转换类型的JSON格式
    changDeviceTypeIds(deviceTypeIds) {
      let str = "";
      if (deviceTypeIds) {
        let arr = JSON.parse(deviceTypeIds);
        arr.forEach((item) => {
          str += item + " ";
        });
      }
      return str == "" ? "暂无" : str;
    },
    // 获取客户池
    async queryCustomerPool() {
      const res = await queryCustomerPool({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        enterpriseName: this.enterpriseName,
      });
      this.total = res.data.total;
      this.customerPoolList = res.data.records;
    },
    // 关闭跟进记录框
    closeAuditDialog() {
      this.auditDialog = false;
    },
    //打开跟进审核框
    async openAuditDialog(id) {
      this.customerApplyVisitId = id;
      const res = await queryCustomerApplyVisitList({
        customerId: id,
        pageNo: 1,
        pageSize: 999,
      });
      this.customerApplyVisitList = res.data.records;
      this.auditDialog = true;
    },
    // 关闭跟进记录框
    closeRecordDialog() {
      this.recordDialog = false;
    },
    // 打开跟进记录框
    async openRecordDialog(id) {
      const res = await queryCustomerVisitList({
        customerId: id,
        pageNo: 1,
        pageSize: 999,
      });
      this.customerVisitList = res.data.records;
      this.recordDialog = true;
    },
  },
  created() {
    this.queryCustomerPool();
  },
};
</script>

<style scoped lang="less">
.customerManagement {
  padding: 20px;
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
