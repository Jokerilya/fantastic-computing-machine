<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="manage-top">
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="60">
          <el-col :span="5">
            <el-form-item label="企业名称">
              <el-input placeholder="请输入企业名称" v-model="Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="联系电话">
              <el-input placeholder="请输入联系电话" v-model="Phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="联系人">
              <el-input placeholder="请输入联系人" v-model="People"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-button style="color: #2E4C9E;" plain @click="_getOrderList()"
              >查询</el-button
            >
            <el-button style="color: #2E4C9E;" plain @click="resetFn"
              >重置</el-button
            >
            <el-button style="color: #2E4C9E;" plain @click="exportVip"
              >导出</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 空行 -->
    <br /><br />

    <el-card>
      <!-- 表格内容 -->
      <div class="text" style="margin-bottom: 20px;">
        <!-- 表格 -->
        <el-table
          highlight-current-row
          v-loading.fullscreen.lock="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="orderList"
          style="width: 100%;"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
          }"
          :height="masterList.length > 8 ? '400' : ''"
        >
          <el-table-column
            prop="orderSn"
            label="订单号"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="statusName"
            label="订单状态"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="enterpriseName"
            label="企业名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="contactsPeople"
            label="企业联系人"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="contactsPhone"
            label="客户电话"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="salesmanRealName"
            label="客户经理"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="salesmanRealPhone"
            label="客户经理电话"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="下单时间"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="200"
          >
            <template slot-scope="{ row }">
              <div class="settings">
                <a href="#" style="color:#2E4C9E" @click="jump2Detail(row.id)"
                  >详情</a
                >
                <!-- <a href="#" style="color:#2E4C9E;margin: 0 20px;">编辑</a>
                <a href="#" style="color:#2E4C9E;">取消</a> -->
                <a
                  href="#"
                  style="color:#2E4C9E;margin-left:6px;"
                  @click="foremp(row)"
                  v-if="!row.uid"
                  >绑定企业</a
                >
                <a
                  href="#"
                  style="color:#2E4C9E;margin-left:6px;"
                  v-if="!row.salesmanRealName"
                  @click="bindingSalesmanFn(row.orderSn)"
                  >绑定业务员</a
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="footTool">
          <div class="footTool_left">
            <el-button @click="contractBtnFn" class="contractBtn"
              >管家合同模板下载</el-button
            >
            <el-upload
              class="upload-demo"
              action
              :http-request="httpRequestFn"
              multiple
              :show-file-list="false"
            >
              <el-button class="importBtn">年保设备批量导入</el-button>
            </el-upload>
            <span
              style="font-size: 12px;font-weight: 700;color: #606266;margin-left: 15px;"
              >注:请上传.XLSX格式文件合同</span
            >
          </div>
          <div class="footTool_right">
            <div class="pagingBtn">
              <el-pagination
                layout="jumper, prev, pager, next, total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="10"
                :total="pageCount"
                align="center"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 空行 -->
    <div style="margin:20px 0"></div>

    <!-- 绑定企业弹框-->
    <model
      ref="enterpriseList"
      title="企业列表"
      :isSubmit="false"
      :column="2"
      @close="closeSnatch"
    >
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="企业名称">
              <el-input
                placeholder="请输入企业名称"
                v-model="enterpriseName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-button
              icon="el-icon-zoom-in"
              plain
              type="primary"
              @click="_getEnterpriseList"
              >查询</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <el-table
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        border
        element-loading-spinner="el-icon-loading"
        :data="enterpriseList"
        style="width: 1500px;"
      >
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          show-overflow-tooltip
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="enterpriseAddress"
          label="企业地址"
          show-overflow-tooltip
          width="300"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="300px" fixed="right">
          <template slot-scope="{ row }">
            <div class="settings">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="_bindUserAccount(row)"
                >绑定企业</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </model>

    <!-- 绑定业务员弹框 -->
    <el-dialog
      :visible="dialogVisible"
      width="30%"
      :before-close="closeSalesmanFn"
    >
      <div class="bindingSalesmanTitle">
        绑定业务员
      </div>
      <div style="text-align: center;">
        <el-select
          filterable
          remote
          v-model="salesmanSelect"
          :remote-method="salesmanRemoteMethod"
          placeholder="请选择业务员"
          style="width: 200px;"
        >
          <el-option
            v-for="item in salesmanOptions"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSalesmanFn">取 消</el-button>
        <el-button type="primary" @click="salesmanConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
// 绑定业务员弹框
.bindingSalesmanTitle {
  text-align: center;
  color: #757275;
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 20px;
}
// 下载合同按钮
.contractBtn {
  margin-right: 15px;
  background-color: #767676;
  color: #fff;
}
// 底部工具栏
.footTool {
  background-color: #fff;
  display: flex;
  padding: 20px 50px 10px 50px;
  justify-content: space-between;
  .footTool_left {
    display: flex;
    align-items: center;
    .addBtn {
      height: 38px;
      width: 130px;
      background-color: #2e4c9e;
      color: #fff;
      margin-right: 10px;
      font-weight: 700;
    }
    .importBtn {
      width: 130px;
      background-color: #d4e0ff;
      color: #0b2059;
      font-weight: 700;
    }
  }
}
.manage-top {
  width: 1500px;
}
.upload-demo {
  margin: 10px 0;
}
</style>

<script>
import {
  getMasterList,
  handleAssignMaster,
  queryUserName,
  getEnterpriseList,
  bindUserAccount,
} from "@/api/user.js";
import {
  bindSalesmanAccount,
  queryButlerOrderList,
  uploadButlerOrder,
  downloadButlerOrderTemplate,
  handleButlerOrderExport,
} from "@/api/order.js";
import tableMixin from "@/mixin/table";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      dialogVisible: false,
      salesmanSelect: null, //选中的推荐人名字
      salesmanOptions: null, //选择人的列表
      salesmanOrderSn: "",

      pageCount: 0, //总条数
      currentPage: 1,
      bindOrderSn: "", //点击绑定账号的编号
      bindUid: "", //点击绑定企业后的uid
      enterpriseName: "", //企业名称
      enterpriseList: [],
      orderSn: "",
      People: "",
      Phone: "",
      orderList: [],
      tabelList: [],
      changeData: [],
      masterList: [],
      loading: false,
      typeData: [],
      courseList: [],
      snatchList: [],
      courseDistriList: [],
      Name: "",
      Phone: "",
      enterpriseOrderSn: "",
      url: {
        query: "/admin/maintenance/queryRepairOrderList",
        queryType: "/admin/maintenance/queryDeviceTypeList",
        querySnatch: "/admin/maintenance/queryMasterGrabOrderList",
        assign: "/admin/maintenance/handleAssignMaster",
        handleMasterQuotation: "/admin/maintenance/handleMasterQuotation",
      },
      rules: {
        worker: [
          {
            required: true,
            message: "请输入接单人",
            trigger: "blur",
          },
        ],
        workerPhone: [
          {
            required: true,
            message: "请输入接单人手机",
            trigger: "blur",
          },
        ],
      },
      finishForm: {
        payAmount: 0,
      },
      param: {},
      quotationForm: {},
    };
  },
  created() {
    this._getMasterList();
    this._queryButlerOrderList();
    this._getEnterpriseList();
  },
  methods: {
    // 导出功能
    async exportVip() {
      const data = {
        pageNo: 1,
        pageSize: 1000,
        enterpriseName: this.Name,
        contactsPeople: this.People,
        contactsPhone: this.Phone,
      };
      const res = await handleButlerOrderExport(data);
      console.log(res);
    },
    // 关闭绑定业务员弹窗
    closeSalesmanFn() {
      this.salesmanSelect = null;
      this.dialogVisible = false;
    },
    // 确定绑定业务员事件
    async salesmanConfirm() {
      const res = await bindSalesmanAccount({
        id: this.salesmanSelect,
        orderSn: this.salesmanOrderSn,
      });
      if (res.message === "操作成功") {
        this.$message({
          message: "绑定成功",
          type: "success",
        });
      }
      await this._getOrderList();
      this.closeSalesmanFn();
    },
    // 查询业务员 触发的事件
    async salesmanRemoteMethod(val) {
      const res = await queryUserName(val);
      this.salesmanOptions = res.data;
    },
    // 点击绑定业务员触发的事件
    bindingSalesmanFn(orderSn) {
      this.salesmanOrderSn = orderSn;
      this.dialogVisible = true;
    },
    // 重置功能
    resetFn() {
      this.Name = "";
      this.Phone = "";
      this.People = "";
      this._getOrderList();
    },
    // 点击管家合同下载
    async contractBtnFn() {
      const res = await downloadButlerOrderTemplate();
      window.location.href = res.data;
    },
    // 点击页数触发的事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this._queryButlerOrderList();
    },
    // 点击绑定企业的事件
    _bindUserAccount(e) {
      console.log(e);
      this.bindUid = e.uid;
      let params = {
        orderSn: this.bindOrderSn,
        uid: this.bindUid,
      };
      bindUserAccount(params).then((res) => {
        if (res) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
        }
        this.$refs.enterpriseList.close();
        this._queryButlerOrderList();
      });
    },
    // 点击绑定账号弹框里查询的事件
    _getEnterpriseList() {
      let params = {
        pageNo: 1,
        pageSize: 20,
        name: this.enterpriseName,
        phone: "",
      };
      getEnterpriseList(params).then((res) => {
        if (res) {
          this.enterpriseList = res.data.records;
        }
      });
    },
    // 点击绑定账号的事件
    foremp(e) {
      this.$refs.enterpriseList.open();
      this.bindOrderSn = e.orderSn;
    },
    // 上传文件的函数
    httpRequestFn(data) {
      const loading = this.$loading({ text: "上传中.." });
      const formData = new FormData();
      formData.append("file", data.file);
      uploadButlerOrder(formData)
        .then((res) => {
          this.$emit("uploadSuc", res.data);
          this.$message({
            showClose: true,
            message: "文件上传成功！",
            type: "success",
          });
          loading.close();
          this._getOrderList();
          // this.deviceList.nameplateImg = res.data;
          // console.log(this.deviceList.nameplateImg, "文件上传");
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "文件上传失败！",
            type: "warning",
          });
          loading.close();
        });
    },
    // 查询列表的事件
    _getOrderList() {
      let params = {
        contactsPeople: this.People,
        contactsPhone: this.Phone,
        enterpriseName: this.Name,
        pageNo: 1,
        pageSize: 10,
      };
      queryButlerOrderList(params).then((res) => {
        if (res) {
          this.orderList = res.data.records;
          this.pageCount = res.data.total;
          this.currentPage = res.data.current;
        }
      });
    },
    // 查询订单列表的事件
    _queryButlerOrderList() {
      let params = {
        contactsPeople: "",
        contactsPhone: "",
        enterpriseName: "",
        pageNo: this.currentPage,
        pageSize: 10,
      };
      queryButlerOrderList(params).then((res) => {
        if (res) {
          this.orderList = res.data.records;
          this.pageCount = res.data.total;
          this.currentPage = res.data.current;
        }
      });
    },
    // 点击详情 携带参数跳转详情页面
    jump2Detail(id) {
      this.$router.push("/maintenance/customerDetail?id=" + id);
    },
    // 拿到师傅列表 不知道干嘛
    _getMasterList() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        realName: this.Name,
        phone: this.Phone,
      };
      getMasterList(params).then((res) => {
        if (res) {
          this.masterList = res.data.records;
        }
      });
    },
    // 绑定账号弹框关闭事件
    closeSnatch(fn) {
      fn(false);
    },

    // 没用到开始--------------------------------------------
    assign(masterOrderSn) {
      this.$axios
        .post(this.url.assign, {
          enterpriseOrderSn: this.param.enterpriseOrderSn,
          masterOrderSn: masterOrderSn,
        })
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
            this.$refs.snatch.close();
            this.query();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getType(val) {
      return this.typeData.filter((item) => {
        if (item.id == val) {
          return item;
        }
      })[0].name;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    changeMaster(row) {
      console.log("row", row.uid);
      this.tabelList.push(row.uid);
      // this.tabelList.forEach((item, index) => {
      //   if (item.isSelect == 0) {
      //     this.tabelList.splice(index, 1);
      //   }else{
      //      this.tabelList.push(row.uid);
      //   }
      // });
      console.log("list", this.tabelList);
    },
    seedItout() {
      let params = {
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUidList: [],
      };
      handleAssignMaster(params).then((res) => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false",
          });
        }
      });
    },
    seedIt() {
      let id = this.tabelList;
      id.join(",");
      console.log("选中id", id);
      let params = {
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUidList: id,
      };
      handleAssignMaster(params).then((res) => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false",
          });
        }
      });
    },
    _handleAssignMaster(row) {
      console.log(row);
      let params = {
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUid: row.uid,
      };
      handleAssignMaster(params).then((res) => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false",
          });
        }
      });
    },
    querySelectData() {
      this.loading = true;
      this.$axios
        .post(this.url.queryType)
        .then(({ data }) => {
          this.typeData = data;
        })
        .catch(function(error) {
          console.info(error);
        });
      this.loading = false;
    },
    querySnatchList({ orderSn: enterpriseOrderSn }) {
      this.$refs.snatch.open();
      this.enterpriseOrderSn = enterpriseOrderSn;
    },
    // 没用结束--------------------------------------------
  },
};
</script>
