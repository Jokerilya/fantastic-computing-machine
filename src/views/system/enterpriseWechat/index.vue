<template>
  <div class="faultItemsExamine">
    <first-title title="企业微群管理" />
    <div class="faultItemsExamine_top">
      <div class="faultItemsExamine_top_left">
        <div class="faultItemsExamine_top_item">
          <div class="label">企业状态:</div>
          <div>
            <el-select
              placeholder="请选择"
              v-model="queryEnterpriseWechatListParams.type"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="faultItemsExamine_top_item">
          <div class="label">企业名称:</div>
          <div>
            <el-input
              placeholder="请输入企业名称"
              v-model="queryEnterpriseWechatListParams.enterpriseName"
            ></el-input>
          </div>
        </div>

        <div class="faultItemsExamine_top_item">
          <div class="label">群名称:</div>
          <div>
            <el-input
              placeholder="请输入群名称"
              v-model="queryEnterpriseWechatListParams.groupName"
            ></el-input>
          </div>
        </div>
      </div>

      <div class="faultItemsExamine_top_right">
        <el-button type="primary" @click="searchList">搜索</el-button>
        <el-button type="success" @click="openSaveEnterpriseWechatDialog(null)"
          >新增</el-button
        >
      </div>
    </div>
    <div class="faultItemsExamine_table">
      <el-card>
        <el-table border style="width: 100%" :data="enterpriseWechatList">
          <el-table-column
            label="企业名称"
            prop="enterpriseName"
            align="center"
          >
          </el-table-column>

          <el-table-column label="微信群名称" prop="wechatGroup" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="{ row }">
              {{ row.type == 1 ? "未入驻" : "已入驻" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="openSaveEnterpriseWechatDialog(row)"
                >修改</el-button
              >
              <el-button type="text" @click="deleteEnterpriseWechat(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="faultItemsExamine_table_pagination">
          <el-pagination
            @current-change="changePage"
            background
            :page-size="queryEnterpriseWechatListParams.pageSize"
            :total="enterpriseWechatListTotal"
            layout="prev, pager, next"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>

    <el-dialog
      :title="saveEnterpriseWechatDialogTitle"
      :visible="saveEnterpriseWechatDialog"
      :before-close="closeSaveEnterpriseWechatDialog"
      width="35%"
      center
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          label-width="120px"
          label-position="left"
          ref="saveEnterpriseWechatParamsRef"
          :rules="saveEnterpriseWechatParamsRules"
          :model="saveEnterpriseWechatParams"
        >
          <el-form-item label="状态:" prop="type">
            <el-radio-group
              v-model="saveEnterpriseWechatParams.type"
              @change="changeType"
            >
              <el-radio :label="1">未入驻</el-radio>
              <el-radio :label="2">已入驻</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="公司名称:" prop="enterpriseName">
            <el-input
              v-if="saveEnterpriseWechatParams.type == 1"
              placeholder="请填写公司名称"
              v-model="saveEnterpriseWechatParams.enterpriseName"
            ></el-input>
            <el-select
              v-if="saveEnterpriseWechatParams.type == 2"
              v-model="saveEnterpriseWechatParams.enterpriseName"
              filterable
              remote
              placeholder="先输入公司名选择"
              :remote-method="queryEnterpriseList"
              :loading="loading"
              @change="changeEnterpriseName"
            >
              <el-option
                v-for="item in alreadyEnteredList"
                :key="item.id"
                :label="item.enterpriseName"
                :value="item.enterpriseName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="微信群名称:" prop="wechatGroup">
            <el-input
              placeholder="请输入微信群名称"
              v-model="saveEnterpriseWechatParams.wechatGroup"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSaveEnterpriseWechatDialog">取 消</el-button>
        <el-button type="primary" @click="saveEnterpriseWechat"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
import {
  queryEnterpriseWechatList,
  saveEnterpriseWechat,
  deleteEnterpriseWechat,
} from "@/api/admin";
import { queryEnterpriseName } from "@/api/boss";
export default {
  data() {
    return {
      enterpriseWechatList: [],
      enterpriseWechatListTotal: 0,
      queryEnterpriseWechatListParams: {
        enterpriseName: null,
        groupName: null,
        type: null,
        pageNo: 1,
        pageSize: 10,
      },
      typeList: [
        {
          label: "全选",
          value: null,
        },
        {
          label: "未入驻",
          value: 1,
        },
        {
          label: "已入驻",
          value: 2,
        },
      ],

      saveEnterpriseWechatDialog: false,
      saveEnterpriseWechatParams: {
        enterpriseName: null,
        enterpriseId: null,
        type: 1,
        wechatGroup: null,
      },
      saveEnterpriseWechatDialogTitle: "新增企业微群信息",
      saveEnterpriseWechatParamsRules: {
        enterpriseName: [
          { required: true, message: "请填写企业名称", trigger: "change" },
        ],
        wechatGroup: [
          { required: true, message: "请填写群名称", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择入驻状态", trigger: "change" },
        ],
      },
      alreadyEnteredList: [],
    };
  },
  methods: {
    // 切换页面
    changePage(page) {
      this.queryEnterpriseWechatListParams.pageNo = page;
      this.queryEnterpriseWechatList();
    },
    // 删除企业微群信息
    deleteEnterpriseWechat(row) {
      this.$confirm(
        `您确定要删除这条信息[${row.enterpriseName}-${row.wechatGroup}]吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const res = await deleteEnterpriseWechat(row.id);
        if (res.code == "000") {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.queryEnterpriseWechatList();
        }
      });
    },
    // 搜索列表
    searchList() {
      this.queryEnterpriseWechatListParams.pageNo = 1;
      this.queryEnterpriseWechatList();
    },
    // 确定新增修改
    async saveEnterpriseWechat() {
      const res = await saveEnterpriseWechat(this.saveEnterpriseWechatParams);
      if (res.code == "000") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.queryEnterpriseWechatList();
        this.closeSaveEnterpriseWechatDialog();
      }
    },
    // 选择企业名称
    changeEnterpriseName(e) {
      const obj = this.alreadyEnteredList.find(
        (item) => item.enterpriseName == e
      );
      this.saveEnterpriseWechatParams.enterpriseId = obj.id;
    },
    // 关闭新增修改企业微群信息框
    closeSaveEnterpriseWechatDialog() {
      this.saveEnterpriseWechatParams = {
        enterpriseName: null,
        enterpriseId: null,
        type: 1,
        wechatGroup: null,
      };
      this.$refs["saveEnterpriseWechatParamsRef"].resetFields();
      this.saveEnterpriseWechatDialog = false;
    },
    // 修改企业状态
    changeType(e) {
      this.saveEnterpriseWechatParams.id = null;
      this.saveEnterpriseWechatParams.enterpriseName = null;
    },
    // 打开新增修改企业微群信息框
    openSaveEnterpriseWechatDialog(data) {
      if (data) {
        this.saveEnterpriseWechatDialogTitle = "编辑企业微群信息";
        this.saveEnterpriseWechatParams = { ...data };
      } else {
        this.saveEnterpriseWechatDialogTitle = "新增企业微群信息";
      }
      this.saveEnterpriseWechatDialog = true;
    },
    // 查询已入驻公司名称
    async queryEnterpriseList(query) {
      if (query !== "") {
        const res = await queryEnterpriseName(query);
        if (res.code == "000") {
          this.alreadyEnteredList = res.data;
        }
      } else {
        this.alreadyEnteredList = [];
      }
    },
    // 查询企业微群列表
    async queryEnterpriseWechatList() {
      const res = await queryEnterpriseWechatList(
        this.queryEnterpriseWechatListParams
      );
      if (res.code == "000") {
        this.enterpriseWechatList = res.data.records;
        this.enterpriseWechatListTotal = res.data.total;
      }
    },
  },
  created() {
    this.queryEnterpriseWechatList();
  },
};
</script>
  
  <style scoped lang="less">
.faultItemsExamine {
  padding: 20px;
  .faultItemsExamine_top {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 20px;

    .faultItemsExamine_top_left {
      display: flex;
      align-items: center;
      .faultItemsExamine_top_item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .label {
          color: #606266;
          font-size: 14px;
          font-weight: 700;
          margin-right: 20px;
        }
      }
    }
    .faultItemsExamine_top_right {
      display: flex;
      align-items: center;
    }
  }

  .faultItemsExamine_table {
    .faultItemsExamine_table_pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
  