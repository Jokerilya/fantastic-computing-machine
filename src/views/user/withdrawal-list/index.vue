<template>
  <div class="content_box">
    <first-title title="提现记录" />
    <div class="select_view">
      <el-row :gutter="20" style="text-align: center">
        <el-col :span="6">待审核金额: {{ withdrawalBeReviewedSum }}</el-col>
        <el-col :span="6">已通过金额: {{ withdrawalReviewedSum }}</el-col>
        <el-col :span="6">总提现金额: {{ withdrawalSum }}</el-col>
      </el-row>
    </div>
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.phone"
        style="width: 160px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户手机账号"
      />
      <el-input
        v-model="queryData.nickName"
        style="width: 160px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户昵称"
      />
      <el-select
        v-model="queryData.status"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择审核状态"
      >
        <el-option
          v-for="(item, key) in status"
          :key="key"
          :label="item"
          :value="key"
        />
      </el-select>
      <el-select
        v-model="queryData.moneyType"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择账户类型"
      >
        <el-option
          v-for="item in moneyType"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      提现时间：
      <el-date-picker
        v-model="queryData.queryTime"
        class="mg_r15 mg_t10"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
      <el-button class="mg_t10" type="primary" @click="exportExlFn"
        >记录导出</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column type="expand" fixed>
        <template slot-scope="scope">
          <el-form label-position="left" class="table_from">
            <el-form-item label="银行名称/支付宝">
              <span>{{ scope.row.bankName || "未填写" }}</span>
            </el-form-item>
            <el-form-item label="银行卡号/支付宝账户">
              <span>{{ scope.row.bankCode || "未填写" }}</span>
            </el-form-item>
            <el-form-item label="收款人姓名">
              <span>{{ scope.row.payeeName || "未填写" }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="用户昵称"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户手机号"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提现流水号"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.serialNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="账户类型"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.accountType === 1
              ? "用户余额"
              : scope.row.accountType === 2
              ? "用户积分"
              : "代理余额"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提现金额"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.quota }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提现手续费"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.handlingFee }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实际到账"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.actualArrival }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审核状态"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ status[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提现发起时间"
        width="180"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审核时间"
        width="180"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.reviewTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核备注" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="120"
        align="left"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            @click="auditWithdrawFn(scope.row)"
            >审核提现</el-button
          >
          <!-- <el-button type="success" size="small" @click="exportListFn()">导出</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="el_pagination">
      <el-pagination
        background
        layout="prev, pager, next,total,sizes"
        :current-page="dataConfig.pageNo"
        :total="dataConfig.total"
        :page-sizes="[20, 30, 40, 50]"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
    <el-dialog title="审核用户提现" :visible.sync="auditVisible" width="600px">
      <el-form ref="form" :model="auditData" label-width="160px">
        <el-form-item label="银行名称/支付宝：">
          <span>{{ auditData.bankName }}</span>
        </el-form-item>
        <el-form-item label="银行卡号/支付宝账户：">
          <span>{{ auditData.bankCode }}</span>
        </el-form-item>
        <el-form-item label="收款人：">
          <span>{{ auditData.payeeName }}</span>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select
            v-model="subAuditData.status"
            class="mg_r15 mg_t10"
            style="width: 160px"
            placeholder="请选择审核状态"
          >
            <el-option
              v-for="(item, key) in auditStatus"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注：">
          <el-input v-model="subAuditData.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import {
  queryWithdrawalFn,
  handleWithdrawalExamineFn,
  handleWithdrawalExportFn,
} from "@/api/user.js";
export default {
  name: "WithdrawalList",
  data() {
    return {
      dataList: [],
      moneyType: [
        { name: "用户余额", val: 1 },
        { name: "代理余额", val: 3 },
      ],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      auditVisible: false,
      auditData: {
        bankName: "",
        bankCode: "",
        payeeName: "",
      },
      withdrawalBeReviewedSum: 0,
      withdrawalReviewedSum: 0,
      withdrawalSum: 0,
      subAuditData: {
        id: "",
        status: "",
        remark: "",
      },
      status: {
        0: "审核中",
        1: "已通过",
        2: "已驳回",
        3: "已打款",
      },
      auditStatus: {
        1: "已通过",
        2: "已驳回",
      },
      queryData: {
        uid: "", // 1 2 3
        phone: "", // 1 2
        nickName: "", // 1 2 3
        moneyType: "", // 3
        queryTime: [], // 1 2 3
      },
    };
  },
  beforeMount() {
    this.getDataListFn();
  },
  methods: {
    submitAudit() {
      handleWithdrawalExamineFn(Object.assign({}, this.subAuditData)).then(
        (res) => {
          const resData = this.resDataFn(res);
          if (resData === "000") {
            this.auditVisible = false;
            this.$message({
              showClose: true,
              message: "审核成功！",
              type: "success",
            });
            this.withdrawListFn();
          }
        }
      );
    },
    auditWithdrawFn(data) {
      this.auditVisible = true;
      this.auditData.bankName = data.bankName;
      this.auditData.bankCode = data.bankCode;
      this.auditData.payeeName = data.payeeName;
      this.subAuditData.id = data.id;
    },
    exportExlFn() {
      handleWithdrawalExportFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: -1,
        uid: this.queryData.uid,
        nickName: this.queryData.nickName || undefined,
        phone: this.queryData.phone || undefined,
        moneyType: this.queryData.moneyType || undefined,
        queryTime:
          this.queryData.queryTime.length == 0
            ? ""
            : this.queryData.queryTime[0] + "/" + this.queryData.queryTime[1],
      }).then((res) => {
        this.exportData(res, "提现记录导出数据" + parseTime(new Date()));
      });
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData.phone = "";
      this.queryData.nickName = "";
      this.queryData.queryTime = [];
      this.getDataListFn();
    },
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.getDataListFn();
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    getDataListFn() {
      this.dataConfig.loading = true;
      queryWithdrawalFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        uid: this.queryData.uid,
        nickName: this.queryData.nickName || undefined,
        phone: this.queryData.phone || undefined,
        moneyType: this.queryData.moneyType || undefined,
        queryTime:
          this.queryData.queryTime.length == 0
            ? ""
            : this.queryData.queryTime[0] + "/" + this.queryData.queryTime[1],
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.withdrawalBeReviewedSum = resData.withdrawalBeReviewedSum;
        this.withdrawalReviewedSum = resData.withdrawalReviewedSum;
        this.withdrawalSum = resData.withdrawalSum;
        this.dataList.splice(0, this.dataList.length, ...resData.data.records);
        this.dataConfig.total = resData.data.total;
      });
    },
  },
};
</script>

<style lang="scss">
</style>
