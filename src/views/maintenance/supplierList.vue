<template>
  <div class="supplierList">
    <!-- 顶部 -->
    <div class="topControls">
      <div class="topControlsSearchInfo">
        <div class="topControlsSearchInfoItem">
          <div class="label">供应商名称</div>
          <div>
            <el-input
              placeholder="请输入供应商名称"
              v-model="supplierInfoListParams.query"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="topControlsBtn">
        <el-button type="primary" plain @click="searchSupplierInfoList"
          >搜索</el-button
        >
        <el-button type="primary" plain @click="resetSupplierInfoList"
          >重置</el-button
        >
        <el-button
          type="primary"
          plain
          @click="openAddEditSupplierInfoDialog('add')"
          >新增</el-button
        >
      </div>
    </div>

    <!-- 表格 -->
    <el-card style="padding: 20px">
      <el-table :data="supplierInfoList" style="width: 100%">
        <el-table-column
          prop="people"
          label="负责人"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="负责人电话"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" align="center">
        </el-table-column>
        <el-table-column prop="supplierAddress" label="地址" align="center">
        </el-table-column>
        <el-table-column prop="businessScope" label="范围" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="openAddEditSupplierInfoDialog('edit', row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="tabelPagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="supplierInfoListTotal"
          :page-size="10"
          :current-page="supplierInfoListParams.pageNo"
          @current-change="changesupplierInfoListPage"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增编辑框 -->
    <el-dialog
      center
      :title="addEditSupplierInfoDialogTitle"
      :visible="addEditSupplierInfoVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="40%"
    >
      <el-form
        :rules="supplierInfoRules"
        ref="supplierInfoForm"
        :model="supplierInfo"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="负责人" prop="people">
          <el-input
            v-model="supplierInfo.people"
            placeholder="请输入负责人"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人电话" prop="phone">
          <el-input
            v-model="supplierInfo.phone"
            placeholder="请输入负责人电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input
            v-model="supplierInfo.supplierName"
            placeholder="请输入供应商名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商地址" prop="supplierAddress">
          <el-input
            v-model="supplierInfo.supplierAddress"
            placeholder="请输入供应商地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="经营范围" prop="businessScope">
          <el-input
            v-model="supplierInfo.businessScope"
            placeholder="请输入经营范围"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- @click="confirmInsuranceInfo" -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddEditSupplierInfoDialog">取 消</el-button>
        <el-button type="primary" @click="confirmSupplierInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryMaintenanceSupplierInfo,
  editMaintenanceSupplierInfo,
} from "@/api/order";
export default {
  data() {
    return {
      supplierInfoList: [],
      supplierInfoListParams: {
        pageNo: 1,
        pageSize: 10,
        query: "",
      },
      supplierInfoListTotal: null,

      addEditSupplierInfoDialogTitle: "新增供应商",
      addEditSupplierInfoVisible: false,
      supplierInfo: {
        businessScope: null,
        people: null,
        phone: null,
        supplierAddress: null,
        supplierName: null,
      },

      supplierInfoRules: {
        people: [{ required: true, message: "请填写负责人", trigger: "blur" }],
        phone: [{ required: true, message: "请填写联系电话", trigger: "blur" }],
        supplierAddress: [
          { required: true, message: "请填写供应商地址", trigger: "blur" },
        ],
        supplierName: [
          { required: true, message: "请填写供应商名称", trigger: "blur" },
        ],
        businessScope: [
          { required: true, message: "请填写经营范围 ", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 查询供应商信息
    async queryMaintenanceSupplierInfo() {
      const res = await queryMaintenanceSupplierInfo(
        this.supplierInfoListParams
      );
      this.supplierInfoList = res.data.records;
      this.supplierInfoListTotal = res.data.total;
    },
    // 切换页码
    changesupplierInfoListPage(page) {
      this.supplierInfoListParams.pageNo = page;
      this.queryMaintenanceSupplierInfo();
    },
    // 搜索供应商列表
    searchSupplierInfoList() {
      this.supplierInfoListParams.pageNo = 1;
      this.queryMaintenanceSupplierInfo();
    },
    // 重置供应商列表
    resetSupplierInfoList() {
      this.supplierInfoListParams = {
        pageNo: 1,
        pageSize: 10,
        query: "",
      };
      this.queryMaintenanceSupplierInfo();
    },
    // 打开新增修改供应商
    openAddEditSupplierInfoDialog(type, data) {
      if (type == "edit") {
        this.supplierInfo = { ...data };
      }
      this.addEditSupplierInfoVisible = true;
    },
    // 关闭新增修改供应商弹框
    closeAddEditSupplierInfoDialog() {
      this.supplierInfo = {
        businessScope: null,
        people: null,
        phone: null,
        supplierAddress: null,
        supplierName: null,
      };
      this.$refs["supplierInfoForm"].resetFields();
      this.addEditSupplierInfoVisible = false;
    },
    // 确定新增修改供应商
    async confirmSupplierInfo() {
      await this.$refs["supplierInfoForm"].validate();
      const res = await editMaintenanceSupplierInfo(this.supplierInfo);
      if (res.message == "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.queryMaintenanceSupplierInfo();
        this.closeAddEditSupplierInfoDialog();
      }
    },
  },
  created() {
    this.queryMaintenanceSupplierInfo();
  },
};
</script>

<style lang="less" scoped>
.supplierList {
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
