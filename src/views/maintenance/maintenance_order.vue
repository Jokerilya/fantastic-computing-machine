<!--维保订单-->
<template>
  <div class="app-container">
    <!-- 顶部工具栏部分 -->
    <div class="manage-top">
      <el-form
        v-model="searchForm"
        ref="ruleForm"
        label-width="80px"
        class="rule-form"
        label-position="right"
      >
        <el-row :gutter="20">
          <!-- <el-col :span="5">
            <el-form-item label="设备类型">
              <el-select v-model="searchForm.deviceTypeId" placeholder="请选择">
                <el-option
                  v-for="item in typeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label="订单状态">
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option
                  v-for="item in util.global.mainStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="企业名称">
              <el-input
                v-model="searchForm.enterpriseName"
                placeholder="企业名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单类型">
              <el-select v-model="searchForm.orderType" placeholder="请选择">
                <el-option label="散单" :value="1">散单</el-option>
                <el-option label="年保" :value="2">年保</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="display: flex;">
            <el-button
              icon="el-icon-zoom-in"
              plain
              type="primary"
              @click="query_queryRepairOrderList"
              >查询</el-button
            >
            <el-button
              style="margin-right: 10px;"
              icon="el-icon-refresh"
              plain
              type="info"
              @click="resetFn"
              >重置</el-button
            >
            <el-upload
              class="upload-demo"
              action
              multiple
              :http-request="workOrderImport"
              :show-file-list="false"
            >
              <el-button class="importBtn">工单批量下单</el-button>
            </el-upload>
            <el-button
              style="margin-left: 10px;"
              type="warning"
              plain
              @click="templateDownload"
            >
              批量下单模板下载
            </el-button>
            <el-button
              style="margin-left: 10px;"
              type="success"
              plain
              @click="$router.push('/maintenance/agentOrder')"
            >
              代客户下单
            </el-button>
            <el-button type="success" plain @click="exportList">
              导出
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 空行 -->
    <div style="height: 16px;"></div>

    <el-card>
      <!-- 维保订单列表表格部分 -->
      <el-table
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="dataList"
        height="65vh"
      >
        <el-table-column
          prop="orderSn"
          label="订单编号"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          label="工单类型"
          show-overflow-tooltip
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.orderType === 2">年保</div>
            <div v-if="row.orderType === 1">散单</div>
          </template>
        </el-table-column>
        <el-table-column
          label="订单价格"
          show-overflow-tooltip
          width="100"
          align="center"
        >
          <template slot-scope="{ row }"> ￥{{ row.totalAmount }} </template>
        </el-table-column>
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          show-overflow-tooltip
          width="230"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="no"
          label="设备编码"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceTypeName"
          label="设备类型"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceBrand"
          label="设备品牌"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="devicePlace"
          label="设备产地"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="simpleDesc"
          label="故障描述"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="contactsPeople"
          label="联系人"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="contactsPhone"
          label="联系电话"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="masterRealName"
          label="师傅名称"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="masterPhone"
          label="师傅联系电话 "
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="orderStatusName"
          label="状态"
          show-overflow-tooltip
          width="150"
          fixed="right"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
          width="150"
          fixed="right"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <div class="settings">
              <el-button type="info" size="mini" plain @click="queryDesc(row)"
                >查看详情</el-button
              >
              <!-- <el-button
                v-if="
                  row.orderStatusName === '待平台指派' ||
                    row.orderStatusName === '待师傅接单'
                "
                type="info"
                size="mini"
                plain
                @click="querySnatchList(row)"
                >指派列表</el-button
              > -->
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="enterpriseName"
          label="企业名称"
          show-overflow-tooltip
          width="230"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="详细地址"
          show-overflow-tooltip
          width="350"
          align="center"
        ></el-table-column>   
        <el-table-column
          prop="type"
          label="故障类型"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="num"
          label="设备数量"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column> -->
      </el-table>

      <!-- 分页 -->
      <div style="text-align: center;margin-top:20px ;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="updatePageNo"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="pageCount"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 指派列表模态框 -->
    <!-- <model
      ref="snatch"
      title="指派列表"
      :isSubmit="false"
      :column="2"
      @close="closeSnatch"
    >
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="20">
          <el-col :span="5" style="margin-right: 130px;">
            <el-form-item label="师傅名称">
              <el-input
                placeholder="请输入师傅名称"
                style="width: 200px;"
                v-model="Name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-button
              icon="el-icon-zoom-in"
              plain
              type="primary"
              @click="_getMasterList"
              >查询</el-button
            >
            <el-button
              icon="el-icon-refresh"
              plain
              type="primary"
              @click="seedIt"
              >提交</el-button
            >
            <el-button
              icon="el-icon-refresh"
              plain
              type="primary"
              @click="seedItout"
              >抛入市场</el-button
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
        :data="masterList"
        style="width: 1500px;"
      >
        <el-table-column
          prop="realName"
          label="真实姓名"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="realPortrait"
          label="真实头像"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <el-image
              style="width: 80px; height: 80px"
              :src="row.realPortrait.split(',')[0]"
              :preview-src-list="row.realPortrait.split(',')"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="{ row }">
            <el-checkbox
              size="medium"
              v-model="row.isSelect"
              true-label="row.uid"
              @change="changeMaster(row)"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageCountMaster"
      ></el-pagination>
    </model> -->
  </div>
</template>

<style lang="less" scoped></style>

<script>
import {
  getMasterList,
  handleAssignMaster,
  queryAssignableMasterList,
} from "@/api/user.js";
import {
  uploadBatchRepairOrder,
  queryRepairOrderList,
  downloadBatchRepairOrderTemplate,
  handleRepairOrderExport,
} from "@/api/order.js";
import tableMixin from "@/mixin/table";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      exportParams: null,
      searchForm: {
        deviceTypeId: "",
        status: "",
        orderType: "",
        enterpriseName: "",
      },
      dataList: [],
      pageCount: null,
      pageCountMaster: "",
      currentPage: 1,
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
    this._queryAssignableMasterList();
    this._queryRepairOrderList();
  },
  methods: {
    // 查询列表
    query_queryRepairOrderList() {
      this.currentPage = 1;
      this._queryRepairOrderList();
    },
    // 导出
    async exportList() {
      this.exportParams.pageSize = 10000;
      const res = await handleRepairOrderExport(this.exportParams);
      if (res) {
        const link = document.createElement("a");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = "维保列表"; //下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    // 重置
    resetFn() {
      this.currentPage = 1;
      this.searchForm = {
        deviceTypeId: "",
        status: "",
      };
      this._queryRepairOrderList();
    },
    // 批量下单模板下载
    async templateDownload() {
      const res = await downloadBatchRepairOrderTemplate();
      window.location.href = res.data;
    },
    // 点击工单导入
    async workOrderImport(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await uploadBatchRepairOrder(formData);
      if (res.message === "操作成功") {
        this.$message({
          message: "已成功批量下单",
          type: "success",
        });
        this._queryAssignableMasterList();
        this._queryRepairOrderList();
      }
    },
    // 获取指派列表模态框里的师傅列表
    _queryAssignableMasterList() {
      let data = {
        pageNo: this.currentPage,
        pageSize: 10,
        realName: this.Name,
      };
      queryAssignableMasterList(data).then((res) => {
        if (res) {
          this.masterList = res.data.records;
          this.pageCountMaster = res.data.total;
          this.currentPage = res.data.current;
        }
      });
    },
    // 获取维保订单列表
    _queryRepairOrderList() {
      const loading = this.$loading({ text: "加载中.." });
      let data = {
        pageNo: this.currentPage,
        pageSize: 10,
        ...this.searchForm,
      };
      this.exportParams = data;
      queryRepairOrderList(data).then((res) => {
        if (res) {
          this.dataList = res.data.records;
          this.pageCount = res.data.total;
        }
        loading.close();
      });
    },
    // 点击页码触发的事件
    updatePageNo(val) {
      this.currentPage = val;
      this._queryRepairOrderList();
    },
    // 点击指派列表模态框的页码触发的事件
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.currentPage2 = val;
      this._getMasterList();
    },
    // 点击指派列表模态框操作里多选框的事件
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
    // 点击派列表模态框抛入市场的事件
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
    // 点击派列表模态框提交的事件
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
    //  点击查看详情触发的事件
    queryDesc(row) {
      this.$router.push({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn },
      });
    },
    // 点击指派列表触发的事件
    // querySnatchList({ orderSn: enterpriseOrderSn }) {
    //   this.$refs.snatch.open();
    //   this.enterpriseOrderSn = enterpriseOrderSn;
    // },
    // 指派列表模态框关闭的事件
    closeSnatch(fn) {
      fn(false);
    },
    // 有用到 不知道干嘛
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
    _addOrder() {
      this.$router.push({
        name: "maintenance",
      });
    },
    _getMasterList() {
      let params = {
        pageNo: this.currentPage,
        pageSize: 10,
        realName: this.Name,
        phone: this.Phone,
      };
      getMasterList(params).then((res) => {
        if (res) {
          this.masterList = res.data.records;
          console.log("师傅列表", this.masterList);
          this.pageCount = res.data.total;
          this.currentPage = res.data.current;
        }
      });
    },
  },
};
</script>
