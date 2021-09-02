<template>
  <div class="content_box">
    <first-title title="订单列表" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.phone"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户手机号"
      />
      <el-input
        v-model="queryData.orderSn"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入订单号"
      />
      下单时间：
      <el-date-picker
        v-model="queryData.queryTime"
        class="mg_r15 mg_t10"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-select
        v-model="queryData.status"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择订单状态"
      >
        <el-option
          v-for="item in orderStatus"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
      <el-button class="mg_t10" type="primary" @click="exportExlFn"
        >订单导出</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="ID"
        fixed
        width="60"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderSn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone || "暂无数据" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推荐用户昵称"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.parentName || "暂无数据" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推荐用户手机号"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.parentPhone || "暂无数据" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="支付金额" align="center" header-align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.payAmount }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="积分抵扣" align="center" header-align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.pointAmount }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="运费" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ payType[scope.row.payType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ orderStatusText["statu_" + scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="250"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="small"
            @click="getOrderDetailFn(scope.row.id)"
            >详情</el-button
          >
          <el-button
            type="primary"
            :disabled="scope.row.status != 5"
            size="small"
            @click="orderSend(scope.row.id)"
            >发货</el-button
          >
          <!-- <el-button
            type="primary"
            :disabled="scope.row.status != 0"
            size="small"
            @click="orderExamine(scope.row.id)"
            >审核</el-button
          > -->
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

    <el-dialog
      title="订单详情"
      :visible.sync="orderDetailVisible"
      width="1000px"
    >
      <div class="order_detail">
        <div
          v-for="(item, key) in orderDetailTitle"
          :key="key"
          class="detail"
          :class="{ detail2: key == 'list' }"
        >
          <span class="tit">{{ orderDetailTitle[key] }}</span>
          <span v-if="key == 'status'">{{
            orderStatusText["statu_" + orderDetail[key]]
          }}</span>
          <el-table
            v-else-if="key == 'list'"
            border
            :data="orderDetail[key]"
            style="width: 82%"
          >
            <el-table-column label="商品名称">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.productName"
                  placement="top-start"
                >
                  <span class="pro_name">{{ scope.row.productName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              align="center"
              header-align="center"
              label="商品单价"
            />
            <el-table-column label="商品规格">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.skuName"
                  placement="top-start"
                >
                  <span class="pro_name">{{ scope.row.skuName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="商品图片"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <img class="product_img" :src="scope.row.productImg" alt="" />
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              align="center"
              header-align="center"
              label="购买数量"
            />
            <!-- <el-table-column prop="weight" align="center" header-align="center" label="购买重量" /> -->
          </el-table>
          <span v-else-if="key == 'expNo'">
            <el-link
              v-if="orderDetail[key]"
              target="_block"
              :underline="false"
              :href="`https://m.kuaidi100.com/result.jsp?nu=${orderDetail[key]}`"
              type="primary"
              >{{ orderDetail[key] }}</el-link
            >
            <span v-if="!orderDetail[key]">暂无数据</span>
          </span>
          <span v-else>{{ orderDetail[key] || "暂无数据" }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDetailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="订单发货" :visible.sync="orderSendVisible" width="600px">
      <el-form ref="form" :model="orderSendData" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="orderSendData.id" disabled />
        </el-form-item>
        <el-form-item label="物流公司">
          <el-select
            filterable
            v-model="orderSendData.expId"
            style="width: 100%"
            placeholder="请选择物流公司"
          >
            <el-option
              v-for="item in expList"
              :key="item.id"
              :label="item.expName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发货单号">
          <el-input v-model="orderSendData.expNo" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderSendVisible = false">取消</el-button>
        <el-button type="primary" @click="handleOrderSendFn">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from "@/utils/index.js";
import {
  queryOrderFn,
  getOrderDetailFn,
  handleOrderSendFn,
  handleOrderExamineFn,
  queryOrderBasicFn,
  handleOrderExportFn,
} from "@/api/order.js";
export default {
  name: "OrderList",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      payType: { 1: "支付宝", 2: "微信", 3: "余额", 4: "积分" },
      orderSendVisible: false,
      orderSendData: {
        expName: "",
        expNo: "",
        id: "",
      },
      queryData: {
        phone: "",
        status: "",
        queryTime: [],
        orderSn: "",
      },
      orderDetailVisible: false,
      orderDetail: {},
      orderDetailTitle: {
        addressDetail: "收货地址",
        receiver: "收件人",
        orderSn: "订单号",
        status: "订单状态",
        remark: "订单备注",
        createTime: "下单时间",
        userName: "用户名称",
        phone: "联系电话",
        totalAmount: "支付金额",
        shipTime: "发货时间",
        expName: "物流公司名称",
        expNo: "物流单号",
        list: "购买商品信息",
      },
      expList: [],
      orderStatus: [
        { val: -1, name: "已取消" },
        { val: 0, name: "待支付" },
        { val: 5, name: "待发货" },
        { val: 10, name: "已发货" },
        { val: 15, name: "待评论" },
        { val: 20, name: "交易完成" },
      ],
    };
  },
  computed: {
    orderStatusText() {
      const obj = {};
      this.orderStatus.forEach((item) => {
        obj["statu_" + item.val] = item.name;
      });
      return obj;
    },
  },
  beforeMount() {
    this.getDataListFn();
  },
  methods: {
    orderSend(id) {
      this.orderDetail = {};
      this.orderSendData = {
        expName: "",
        expNo: "",
        id: "",
      };
      this.getOrderDetailFn(id, true);
      this.orderSendData.id = id;
      this.orderSendVisible = true;
      queryOrderBasicFn({}).then((res) => {
        this.expList = this.resDataFn(res);
      });
    },
    orderExamine(id) {
      handleOrderExamineFn({ id: id }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.getDataListFn();
        }
      });
    },
    handleOrderSendFn() {
      handleOrderSendFn(Object.assign({}, this.orderSendData)).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.orderSendVisible = false;
          this.getDataListFn();
        }
      });
    },
    getOrderDetailFn(id, hidePop) {
      getOrderDetailFn({ id: id }).then((res) => {
        const resData = this.resDataFn(res);
        this.orderDetailVisible = !hidePop;
        this.orderDetail = Object.assign({}, this.orderDetail, resData, {
          addressDetail: resData.expDetail.addressDetail,
          receiver: resData.expDetail.receiver,
          phone: resData.expDetail.phone,
        });
      });
    },
    exportExlFn() {
      handleOrderExportFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: -1,
        phone: this.queryData.phone,
        status: this.queryData.status,
        orderSn: this.queryData.orderSn,
        queryTime:
          this.queryData.queryTime.length == 0
            ? ""
            : this.queryData.queryTime[0] + "/" + this.queryData.queryTime[1],
      }).then((res) => {
        this.exportData(res, "订单导出数据" + parseTime(new Date()));
      });
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData = {
        phone: "",
        status: "",
        queryTime: [],
        orderSn: "",
      };
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
      queryOrderFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        phone: this.queryData.phone,
        status: this.queryData.status,
        orderSn: this.queryData.orderSn,
        queryTime:
          this.queryData.queryTime.length == 0
            ? ""
            : this.queryData.queryTime[0] + "/" + this.queryData.queryTime[1],
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataConfig.total = resData.total;
        this.dataList.splice(0, this.dataList.length, ...resData.records);
      });
    },
  },
};
</script>

<style lang="scss">
.product_img {
  width: 50px;
  height: 50px;
}
.order_info_tab_box {
  width: 100%;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 8px;
    background-color: #ddd;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
}
.order_info_tab {
  min-width: 800px;
  td {
    padding: 10px;
  }
}
.order_detail {
  line-height: 2.6em;
  font-size: 16px;
  color: #666;
  overflow: hidden;
  .pro_name {
    display: inline-block;
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 8px;
  }
  .detail {
    width: 50%;
    float: left;
    overflow: hidden;
  }
  .detail2 {
    width: 100%;
    clear: both;
  }
  .el-link {
    vertical-align: top;
  }
  a {
    font-size: 16px;
  }
  .tit {
    font-weight: bold;
    display: inline-block;
    width: 150px;
    padding-right: 30px;
    color: #333;
    text-align: right;
    float: left;
  }
}
</style>
