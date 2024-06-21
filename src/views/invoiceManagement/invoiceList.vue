<template>
  <div class="invoiceList">
    <div class="topTool">
      <el-input
        v-model="queryRepairInvoiceOrderListParams.relationOrderSn"
        placeholder="输入订单编号"
        class="toolInput"
      >
      </el-input>
      <el-select
        placeholder="选择开票状态"
        class="toolSelect"
        v-model="queryRepairInvoiceOrderListParams.status"
      >
        <el-option label="开票中" :value="1"></el-option>
        <el-option label="已开票" :value="2"></el-option>
      </el-select>
      <el-button class="toolBtn" @click="searchBtn">查询</el-button>
      <el-button class="toolBtn" @click="resetBtn">重置</el-button>
    </div>
    <el-card>
      <el-table
        :cell-style="{ 'text-align': 'center' }"
        :data="invoiceList"
        style="width: 100%"
        :header-cell-style="{
          background: '#f6f8fc',
          color: '#707070',
          'text-align': 'center',
        }"
      >
        <el-table-column label="创建时间" prop="createTime"> </el-table-column>
        <el-table-column label="发票单号" prop="orderSn"> </el-table-column>
        <el-table-column label="订单编号" prop="relationOrderSn">
        </el-table-column>
        <el-table-column label="公司" prop="enterpriseName"> </el-table-column>
        <el-table-column label="联系电话" prop="phone"> </el-table-column>
        <el-table-column label="地址" prop="enterpriseAddress">
        </el-table-column>
        <el-table-column label="税号" prop="taxpayerNo"> </el-table-column>
        <el-table-column label="税率">
          <template slot-scope="{ row }"> {{ row.taxPoints * 100 }}% </template>
        </el-table-column>
        <el-table-column label="开户银行" prop="bankName"> </el-table-column>
        <el-table-column label="银行卡号" prop="bankCode"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{ row }">
            <div
              :style="{
                color: row.status == 1 ? 'red' : row.status == 0 ? '' : 'green',
              }"
            >
              {{
                row.status == 1
                  ? "开票中"
                  : row.status == 0
                  ? "待支付"
                  : "已开票"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              v-if="row.status == 2"
              @click="viewInvoice(row.fileUrl)"
              >查看发票</el-button
            >
            <el-upload
              v-else
              action="#"
              :http-request="uploadInvoice"
              :data="{ orderSn: row.orderSn }"
              :show-file-list="false"
            >
              <el-button type="text">上传发票</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>

      <div class="bottomPagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="invoiceListTotal"
          :page-size="queryRepairInvoiceOrderListParams.pageSize"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.invoiceList {
  padding: 20px;
  .topTool {
    display: flex;
    margin-bottom: 20px;
    .toolInput {
      width: 170px;
      margin-right: 10px;
    }
    .toolSelect {
      width: 130px;
      margin-right: 10px;
    }
    .toolBtn {
      color: #2e4c9e;
    }
  }

  .bottomPagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<script>
import { queryRepairInvoiceOrderList, uploadRepairInvoice } from "@/api/order";
import { UploadImg } from "@/api/system";
export default {
  data() {
    return {
      invoiceList: [],
      queryRepairInvoiceOrderListParams: {
        pageNo: 1,
        pageSize: 8,
        relationOrderSn: "",
        status: "",
      },
      invoiceListTotal: null,
    };
  },
  methods: {
    // 查看发票
    viewInvoice(fileUrl) {
      if (fileUrl) {
        window.open(fileUrl, "_blank");
      }
    },
    // 上传发票
    async uploadInvoice(data) {
      const orderSn = data.data.orderSn;
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      const obj = {
        fileUrl: res.data,
        orderSn,
      };
      const result = await uploadRepairInvoice(obj);
      console.log(137, result);
      if (result.message == "操作成功") {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        this.queryRepairInvoiceOrderList();
      }
    },
    // 切换页码
    changePage(page) {
      console.log(119, page);
      this.queryRepairInvoiceOrderListParams.pageNo = page;
      this.queryRepairInvoiceOrderList();
    },
    // 重置
    resetBtn() {
      this.queryRepairInvoiceOrderListParams = {
        pageNo: 1,
        pageSize: 10,
        relationOrderSn: "",
        status: "",
      };
      this.queryRepairInvoiceOrderList();
    },
    // 查询按钮
    searchBtn() {
      this.queryRepairInvoiceOrderListParams.pageNo = 1;
      this.queryRepairInvoiceOrderListParams.pageSize = 10;
      this.queryRepairInvoiceOrderList();
    },
    // 查询开票列表
    async queryRepairInvoiceOrderList() {
      const res = await queryRepairInvoiceOrderList(
        this.queryRepairInvoiceOrderListParams
      );
      this.invoiceList = res.data.records;
      this.invoiceListTotal = res.data.total;
    },
  },
  created() {
    this.queryRepairInvoiceOrderList();
  },
};
</script>
