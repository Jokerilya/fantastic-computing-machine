<template>
  <div class="app-container">
    <div class="manage-top">
      <el-form
        :model="queryData"
        ref="ruleForm"
        label-width="120px"
        class="rule-form"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="用户类型">
              <el-select v-model="queryData.type" placeholder="请选择用户类型">
                <el-option label="普通用户" value="1"></el-option>
                <el-option label="企业用户" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否绑定手机号">
              <el-select
                v-model="queryData.phoneFlag"
                placeholder="请选择是否绑定手机号"
              >
                <el-option label="未绑定" value="0"></el-option>
                <el-option label="已绑定" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="用户手机号">
              <el-input
                v-model="queryData.phone"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="用户昵称">
              <el-input
                v-model="queryData.userName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="用户状态">
              <el-select v-model="queryData.status" placeholder="请选择">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="注册渠道">
              <el-select
                v-model="queryData.registerChannel"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in registerOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="getDataListFn"
                >查询</el-button
              >
              <el-button type="danger" @click="resSetQueryFn">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--  -->
    <div style="height: 16px"></div>
    <div class="manage-table">
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="dataConfig.loading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="60"></el-table-column> -->
        <el-table-column
          prop="nickName"
          label="用户昵称"
          width="250"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column label="用户头像" width="200" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.portrait"
              :preview-src-list="[scope.row.portrait]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="注册渠道" width="200" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.registerChannel === 1
                ? "百度基木鱼"
                : scope.row.registerChannel === 2
                ? "海报资料包"
                : scope.row.registerChannel === 3
                ? "各类手机模拟应用"
                : scope.row.registerChannel === 4
                ? "早报节日等图片"
                : scope.row.registerChannel === 5
                ? "2021年机床展注册"
                : "小程序/PC注册"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业认证名称" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.enterpriseName || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业认证邮箱" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.email || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="纳税人识别号" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.taxpayerNo || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业认证地址" width="250" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.enterpriseAddress || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业营业执照" width="200" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.businessLicense"
              :preview-src-list="[scope.row.businessLicense]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="订单数量" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单总金额" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="uid"
          label="用户ID"
          width="230"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column label="是否VIP" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.vipFlag"
              :active-value="1"
              :inactive-value="0"
              @change="accountvip(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="账号禁用" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="accountDisable(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="infor" @click="detailFn(scope.row.id)">查看详情</el-button> -->
            <!-- <el-button size="mini" type="danger">删除用户</el-button> -->
            <el-button
              size="mini"
              type="primary"
              @click="editinfowallet(scope.row)"
              >修改用户余额</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="
                $router.push({
                  path: '/user/userwalletlist',
                  query: { uid: scope.row.uid },
                })
              "
              >钱包流水</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  -->
    <editinfodrawer
      @close="opendrawer = false"
      :opendrawer="opendrawer"
      :userdetail="userdetail"
    />
    <div style="height: 16px"></div>
    <div class="table-block" v-show="dataList.length > 0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="currentChangeFn"
        :current-page.sync="dataConfig.pageNo"
        :page-size="dataConfig.pageSize"
        :page-sizes="[20, 30, 50, 100]"
        layout="total,sizes, prev, pager, next"
        :total="dataConfig.total"
      >
      </el-pagination>
    </div>
    <!--  -->
  </div>
</template>

<script>
import editinfodrawer from "./editdrawer.vue";
import {
  queryUserInfoFn,
  editUserInfoStatusFn,
  editUservip,
} from "@/api/user.js";
export default {
  components: {
    editinfodrawer,
  },
  data() {
    return {
      userdetail: {},
      opendrawer: false,
      dataList: [],
      handleSelectionList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      queryData: {
        type: "",
        status: "", // 订单状态：0-禁用 1-正常
        phone: "",
        userName: "",
        phoneFlag: "",
        registerChannel: "",
      },
      statusOptions: [
        { id: 0, name: "禁用" },
        { id: 1, name: "正常" },
      ],
      registerOptions: [
        { id: 0, name: "小程序/PC注册" },
        { id: 1, name: "百度基木鱼" },
        { id: 2, name: "海报资料包" },
        { id: 3, name: "各类手机模拟应用" },
        { id: 4, name: "早报节日等图片" },
        { id: 5, name: "2021年机床展注册" },
      ],
    };
  },
  created() {
    this.getDataListFn();
  },
  methods: {
    // 选中的列表数据
    handleSelectionChange(val) {
      this.handleSelectionList = val;
    },
    async getDataListFn() {
      this.dataConfig.loading = true;
      const res = await queryUserInfoFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        phone: this.queryData.phone || undefined,
        status: this.queryData.status,
        type: this.queryData.type,
        phoneFlag: Number(this.queryData.phoneFlag)||'',
        registerChannel: Number(this.queryData.registerChannel)||'',
      });
      const resData = this.resDataFn(res);
      this.dataConfig.total = resData.total;
      this.dataList.splice(0, this.dataList.length, ...resData.records);
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    queryDataFn() {
      this.dataConfig.pageNo = 1;
      this.dataConfig.pageSize = 20;
      this.getDataListFn();
    },
    resSetQueryFn() {
      this.dataConfig.pageNo = 1;
      this.dataConfig.pageSize = 20;
      this.queryData = {
        deliveryType: "",
        status: "",
        queryTime: "",
        orderSn: "",
        phone: "",
        userName: "",
        type: "",
        phoneFlag: "",
        registerChannel: "",
      };
      this.getDataListFn();
    },
    //修改用户余额
    editinfowallet(info) {
      this.userdetail = Object.assign(this.userdetail, info);
      this.opendrawer = true;
    },
    // 禁用启用账号
    async accountDisable(data) {
      const loading = this.$loading();
      let status = data.status;
      const res = await editUserInfoStatusFn({
        id: data.uid,
        status: data.status,
      });
      loading.close();
      if (res.code === "000") {
        this.$message({
          message: "操作成功!",
          type: "success",
        });
      } else {
        this.$nextTick(() => {
          data.status = status;
        });
      }
    },
    //修改用户vip
    async accountvip(data) {
      const loading = this.$loading();
      let status = data.vipFlag;
      const res = await editUservip({
        uid: data.uid,
        status: data.vipFlag,
      });
      loading.close();
      if (res.code === "000") {
        this.$message({
          message: "操作成功!",
          type: "success",
        });
      } else {
        this.$nextTick(() => {
          data.vipFlag = status;
        });
      }
    },
    // 查看订单详情
    async detailFn(id) {
      this.step = 0;
      this.orderInfo = [];
      this.expDetail = [];
      this.priceSum = 0;
      this.costInfo = [];
      // this.$router.push({name:'OrderDetail'})
      const res = await getOrderDetailFn({
        id,
      });
      if (res.code === "000") {
        this.dialogVisible = true;
        this.details = res.data;
        if (this.details.payTime) this.step = 1;
        if (this.details.shipTime) this.step = 2;
        if (this.details.confirmTime) this.step = 3;
        this.orderInfo.push({
          orderSn: this.details.orderSn,
          phone: this.details.phone,
          orderType: this.details.orderType,
          status: this.details.status,
          expNo: this.details.expNo,
        });
        this.expDetail.push({
          receiver: this.details.expDetail.receiver,
          phone: this.details.expDetail.phone,
          addressDetail: this.details.expDetail.addressDetail,
        });
        let priceSum = 0,
          numSum = 0;
        this.details.list.forEach((item) => {
          this.priceSum += item.price;
        });
        this.costInfo.push({
          priceSum: this.priceSum,
          expMoney: 0, // 运费
          coupon: 0,
          totalAmount: this.details.totalAmount,
        });
      }
    },
  },
};
</script>

<style>
/*  */
.order-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
}
.order-status-left {
}
.order-status-left span {
  color: red;
}
.order-status-right {
}
.order-info {
}
.order-info-title {
  margin: 16px 0;
}
.order-info-title span {
  font-size: 14px;
  font-weight: bold;
  color: #409eff;
}
</style>
