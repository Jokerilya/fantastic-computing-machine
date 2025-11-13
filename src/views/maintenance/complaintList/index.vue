<template>
  <div class="examineItem">
    <!-- <div class="operateBtn">
      <el-button
        type="primary"
        plain
        @click="
          examTemplate(
            'https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/%E5%B8%88%E5%82%85%E8%80%83%E9%A2%98%E6%A8%A1%E6%9D%BF.xlsx'
          )
        "
        >考题模板</el-button
      >
      <el-button type="primary" plain @click="openExamineVisible"
        >新增考核</el-button
      >
    </div> -->
    <el-card>
      <el-table border :data="complaintList">
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="realName" label="师傅名称">
        </el-table-column>
        <el-table-column align="center" label="企业订单号">
          <template slot-scope="{ row }">
            <div
              @click="goToOrderDetails(row.relationOrderSn)"
              style="color: #409eff; cursor: pointer"
            >
              {{ row.relationOrderSn }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderSn" label="师傅订单号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="complaintContent"
          label="投诉内容"
        >
        </el-table-column>
        <el-table-column align="center" label="更多">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="openJudgDialog(row, '审核')"
              v-if="!row.platformProcessResult"
              >审核</el-button
            >
            <el-button type="text" @click="openJudgDialog(row, '详情')" v-else
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="tabelPagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="complaintListlenght"
        :page-size="queryRepairOrderComplaintParmas.pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="审核投诉信息"
      :visible="reviewComplaintVisible"
      :before-close="closeJudgDialog"
      :close-on-click-modal="false"
      width="40%"
      center
    >
      <el-tabs v-model="complaintActiveName">
        <el-tab-pane label="基础信息" name="first">
          <div class="reviewComplaintBox">
            <el-descriptions title="投诉基础信息" :column="2">
              <el-descriptions-item label="企业名称">{{
                complaintInfo[0] ? complaintInfo[0].enterpriseName : "/"
              }}</el-descriptions-item>
              <el-descriptions-item label="订单号">{{
                complaintInfo[0] ? complaintInfo[0].relationOrderSn : "/"
              }}</el-descriptions-item>
              <el-descriptions-item
                v-if="judgDialogType == '详情'"
                label="平台处理结果"
                >{{
                  complaintInfo[0]
                    ? complaintInfo[0].platformProcessResult
                    : "/"
                }}</el-descriptions-item
              >
              <el-descriptions-item
                v-if="judgDialogType == '详情'"
                label="平台备注"
                >{{
                  complaintInfo[0] ? complaintInfo[0].platformRemark : "/"
                }}</el-descriptions-item
              >
            </el-descriptions>
            <el-descriptions
              :title="index == 0 ? '对师傅的投诉' : ''"
              v-for="(item, index) in complaintInfo"
              :key="item.id"
              :column="2"
            >
              <el-descriptions-item label="投诉对象">{{
                item.realName
              }}</el-descriptions-item>
              <el-descriptions-item label="投诉内容">{{
                item.complaintContent
              }}</el-descriptions-item>
              <el-descriptions-item
                label="投诉图片"
                v-if="item.complaintImages"
              >
                <div
                  v-for="img in item.complaintImages"
                  :key="img"
                  style="display: inline-block; margin-right: 10px"
                >
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="img"
                    :preview-src-list="item.complaintImages"
                  >
                  </el-image>
                </div>
              </el-descriptions-item>
              <el-descriptions-item
                v-if="judgDialogType == '详情'"
                label="师傅处理结果"
                >{{ item.masterProcessResult }}</el-descriptions-item
              >
            </el-descriptions>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="处理信息"
          name="second"
          v-if="judgDialogType == '审核'"
        >
          <el-form
            v-for="(item, index) in handleExamineRepairOrderComplaintParms.list"
            :key="item.orderSn"
          >
            <el-form-item label="处理对象:">
              {{ item.realName }}
            </el-form-item>
            <el-form-item label="师傅处理结果:">
              <el-input
                placeholder="请输入师傅处理结果"
                v-model="item.masterProcessResult"
              ></el-input>
            </el-form-item>

            <el-divider
              v-if="
                index == handleExamineRepairOrderComplaintParms.list.length - 1
              "
            ></el-divider>

            <el-form-item
              label="平台处理结果:(对外展示)"
              v-if="
                index == handleExamineRepairOrderComplaintParms.list.length - 1
              "
            >
              <el-input
                placeholder="请输入平台处理结果"
                v-model="item.platformProcessResult"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="平台备注:(对内展示)"
              v-if="
                index == handleExamineRepairOrderComplaintParms.list.length - 1
              "
            >
              <el-input
                placeholder="请输入平台备注"
                v-model="item.platformRemark"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="judgDialogType == '审核'" @click="closeJudgDialog"
          >取 消</el-button
        >
        <el-button
          v-if="judgDialogType == '审核'"
          type="primary"
          @click="handleExamineRepairOrderComplaint"
          >确 定</el-button
        >
        <el-button @click="closeJudgDialog" v-if="judgDialogType == '详情'">
          关 闭
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryRepairOrderComplaint,
  handleExamineRepairOrderComplaint,
} from "@/api/order";
export default {
  data() {
    return {
      complaintList: [],
      complaintListlenght: 0,
      queryRepairOrderComplaintParmas: {
        pageNo: 1,
        pageSize: 10,
      },
      reviewComplaintVisible: false,
      complaintInfo: [],
      complaintActiveName: "first",
      handleExamineRepairOrderComplaintParms: {
        list: [
          {
            masterProcessResult: "",
            masterReply: "",
            orderSn: "",
            platformProcessResult: "",
            platformRemark: "",
          },
        ],
        relationOrderSn: "",
      },
      judgDialogType: "审核",
    };
  },
  methods: {
    // 校验list
    validateList(list) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const { masterProcessResult } = item;
        if (
          masterProcessResult == null ||
          String(masterProcessResult).trim() === ""
        ) {
          this.$message({
            message: `${item.realName}师傅处理结果不能为空`,
            type: "warning",
          });
          return false;
        }
      }
      const lastItem = list[list.length - 1];
      const { platformProcessResult, platformRemark } = lastItem;
      if (
        platformProcessResult == null ||
        String(platformProcessResult).trim() === ""
      ) {
        this.$message({
          message: `请填写平台处理结果，不能为空`,
          type: "warning",
        });
        return false;
      }
      if (platformRemark == null || String(platformRemark).trim() === "") {
        this.$message({
          message: `请填写平台备注，不能为空`,
          type: "warning",
        });
        return {
          valid: false,
        };
      }
      return true;
    },
    // 审核维保订单投诉
    async handleExamineRepairOrderComplaint() {
      const result = this.validateList(
        this.handleExamineRepairOrderComplaintParms.list
      );
      if (result) {
        const res = await handleExamineRepairOrderComplaint(
          this.handleExamineRepairOrderComplaintParms
        );
        if (res.code == "000") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.closeJudgDialog();
          this.queryRepairOrderComplaint();
        }
      }
    },
    // 跳转订单详情
    goToOrderDetails(orderSn) {
      const targetRoute = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn },
      });
      window.open(targetRoute.href, "_blank");
    },
    // 关闭审判对话框
    closeJudgDialog() {
      this.reviewComplaintVisible = false;
      this.complaintInfo = [];
      this.complaintActiveName = "first";
      this.handleExamineRepairOrderComplaintParms = {
        list: [
          {
            masterProcessResult: "",
            masterReply: "",
            orderSn: "",
            platformProcessResult: "",
            platformRemark: "",
          },
        ],
        relationOrderSn: "",
      };
    },
    // 打开审判对话框
    async openJudgDialog(row, type) {
      this.judgDialogType = type;
      await this.queryRepairOrderComplaintAll(row.relationOrderSn);
      this.reviewComplaintVisible = true;
    },

    // 审判投诉 回显企业投诉信息
    async queryRepairOrderComplaintAll(relationOrderSn) {
      const res = await queryRepairOrderComplaint({
        pageNo: 1,
        pageSize: 10,
        relationOrderSn,
      });
      if (res.code == "000") {
        res.data.records.forEach((item) => {
          if (item.complaintImages) {
            item.complaintImages = item.complaintImages.split(",");
          }
        });
        this.complaintInfo = res.data.records;
        this.handleExamineRepairOrderComplaintParms.list = res.data.records.map(
          (item) => ({
            masterProcessResult: "",
            masterReply: "",
            orderSn: item.orderSn,
            platformProcessResult: "",
            platformRemark: "",
            realName: item.realName,
          })
        );
        this.handleExamineRepairOrderComplaintParms.relationOrderSn =
          relationOrderSn;
      }
    },
    // 切换页码
    changePage(page) {
      this.queryRepairOrderComplaintParmas.pageNo = page;
      this.queryRepairOrderComplaint();
    },
    // 获取投诉列表
    async queryRepairOrderComplaint() {
      const res = await queryRepairOrderComplaint(
        this.queryRepairOrderComplaintParmas
      );
      if (res.code == "000") {
        this.complaintList = res.data.records;
        this.complaintListlenght = res.data.total;
      }
    },
  },
  created() {
    this.queryRepairOrderComplaint();
  },
};
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 8px;
}
.examineItem {
  padding: 20px;

  .operateBtn {
    text-align: right;
    padding-bottom: 20px;
  }
}
.tabelPagination {
  margin-top: 20px;
  text-align: center;
}
</style>
