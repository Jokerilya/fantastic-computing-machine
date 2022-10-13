<!--维保订单-->
<template>
  <div class="app-container">
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
            <el-button icon="el-icon-zoom-in" plain type="primary" @click="_getOrderList()">查询</el-button>
            <el-button icon="el-icon-refresh" plain type="info" @click="_queryButlerOrderList">重置</el-button>
            <el-button icon="el-icon-zoom-in" plain type="primary" @click="_addOrder">信息录入</el-button>
            <el-upload
              class="upload-demo"
              action
              :http-request="httpRequestFn"
              multiple
            >
              <el-button size="small" type="primary">合同上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传.XLSX格式文件合同</div>
            </el-upload>
            <!-- <el-upload
              action
              list-type="picture-card"
              :on-remove="handleRemove"
              :http-request="httpRequestFnfujian"
            >
              <i class="el-icon-plus"></i>
            </el-upload> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="height: 16px;"></div>
    <el-table
      highlight-current-row
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="orderList"
      style="width: 100%;"
    >
      <el-table-column prop="orderSn" label="订单号" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="status" label="订单状态" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column prop="status" label="付款状态" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column
        prop="enterpriseName"
        label="客户名称"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="contactsPeople"
        label="客户负责人"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="contactsPhone"
        label="客户电话"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>

      <el-table-column label="操作" width="300px" fixed="right">
        <template slot-scope="{row}">
          <div class="settings">
            <el-button type="info" size="mini" plain @click="jump2Detail(row)">查看详情</el-button>
            <!-- <el-button type="info" size="mini" plain>编辑</el-button> -->
          </div>
          <!-- :disabled="row.mainStatus !=1" -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="updatePageNo"
      :current-page="page.pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.dataNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.dataSumNum"
    ></el-pagination>

    <div style="margin:20px 0"></div>
  </div>
</template>
<style lang="less" scoped>
.manage-top {
  width: 1500px;
}
.upload-demo{
  margin: 10px 0;
}
</style>
<script>
import { getMasterList, handleAssignMaster } from "@/api/user.js";
import { queryButlerOrderList,uploadButlerOrder } from "@/api/order.js";
import tableMixin from "@/mixin/table";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      orderSn: "",
      People: "",
      Name: "",
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
        handleMasterQuotation: "/admin/maintenance/handleMasterQuotation"
      },
      rules: {
        worker: [
          {
            required: true,
            message: "请输入接单人",
            trigger: "blur"
          }
        ],
        workerPhone: [
          {
            required: true,
            message: "请输入接单人手机",
            trigger: "blur"
          }
        ]
      },
      finishForm: {
        payAmount: 0
      },
      param: {},
      quotationForm: {}
    };
  },
  created() {
    this._getMasterList();
    this._queryButlerOrderList();
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    httpRequestFn(data) {
      const loading = this.$loading({ text: "上传中.." });
      const formData = new FormData();
      formData.append("file", data.file);
      uploadButlerOrder(formData)
        .then(res => {
          this.$emit("uploadSuc", res.data);
          this.$message({
            showClose: true,
            message: "文件上传成功！",
            type: "success"
          });
          loading.close();
          // this.deviceList.nameplateImg = res.data;
          // console.log(this.deviceList.nameplateImg, "文件上传");
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "文件上传失败！",
            type: "warning"
          });
          loading.close();
        });
    },
    _getOrderList() {
      let params = {
        contactsPeople: this.People,
        contactsPhone: this.Phone,
        enterpriseName: this.Nmae,
        pageNo: 1,
        pageSize: 10
      };
      queryButlerOrderList(params).then(res => {
        if (res) {
          this.orderList = res.data.records;
          console.log("列表", res);
        }
      });
    },
    _addOrder() {
      this.$router.push({
        name: "maintenance"
      });
    },
    _queryButlerOrderList() {
      let params = {
        contactsPeople: "",
        contactsPhone: "",
        enterpriseName: "",
        pageNo: 1,
        pageSize: 10
      };
      queryButlerOrderList(params).then(res => {
        if (res) {
          this.orderList = res.data.records;
          console.log("列表", res);
        }
      });
    },
    jump2Detail(row) {
      this.$router.push({
        name: "customerDetail",
        query: { id: row.id }
      });
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
        masterUidList: []
      };
      handleAssignMaster(params).then(res => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success"
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false"
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
        masterUidList: id
      };
      handleAssignMaster(params).then(res => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success"
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false"
          });
        }
      });
    },
    _handleAssignMaster(row) {
      console.log(row);
      let params = {
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUid: row.uid
      };
      handleAssignMaster(params).then(res => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success"
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false"
          });
        }
      });
    },
    _getMasterList() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        realName: this.Name,
        phone: this.Phone
      };
      getMasterList(params).then(res => {
        if (res) {
          console.log(res);
          this.masterList = res.data.records;
          console.log("师傅列表", this.masterList);
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
    closeSnatch(fn) {
      fn(false);
    },
    assign(masterOrderSn) {
      this.$axios
        .post(this.url.assign, {
          enterpriseOrderSn: this.param.enterpriseOrderSn,
          masterOrderSn: masterOrderSn
        })
        .then(data => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success"
            });
            this.$refs.snatch.close();
            this.query();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getType(val) {
      return this.typeData.filter(item => {
        if (item.id == val) {
          return item;
        }
      })[0].name;
    }
  }
};
</script>
