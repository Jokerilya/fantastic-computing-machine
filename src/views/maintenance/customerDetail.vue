<!--维保订单-->
<template>
  <div class="app-container">
    <!-- 头部信息部分 -->
    <div class="headInfo">
      <el-card>
        <div class="statusTop">
          <div class="statusTop_statu">
            <div v-if="orderMsg.status === 0" style="color:red">未支付</div>
            <div v-if="orderMsg.status === 1" style="color:green">已支付</div>
          </div>
          <div class="statusTop_code">
            <span>订单号: </span>
            <span> {{ orderMsg.orderSn }}</span>
          </div>
        </div>
        <hr />
        <div class="headInfo_content">
          <h2>基本信息</h2>
          <div class="content">
            <div class="itemLine">
              <div class="item">
                <span class="itemTitle">客户名称: </span>
                <span style="font-size: 18px;">{{
                  orderMsg.enterpriseName
                }}</span>
              </div>
            </div>
            <div class="itemLine">
              <div class="item">
                <span class="itemTitle">客户负责人: </span>
                <span style="font-size: 18px;">
                  {{ orderMsg.contactsPeople }}</span
                >
              </div>
            </div>
            <div class="itemLine">
              <div class="item">
                <span class="itemTitle">客户电话: </span>
                <span style="font-size: 18px;">
                  {{ orderMsg.contactsPhone }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空行 -->
    <div style="height: 16px;"></div>

    <!-- 列表表格部分 -->
    <el-table
      highlight-current-row
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="orderDetail"
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
            v-for="(item, index) in props.row.partsList"
            :key="index"
            label-width="200px"
            style="margin-left:110px;"
          >
            <el-form-item label="配件大类">
              <span style="">{{ item.category }}</span>
            </el-form-item>
            <el-form-item label="配件品牌">
              <span>{{ item.deviceBrand }}</span>
            </el-form-item>
            <el-form-item label="配件类型">
              <span>{{ item.deviceId }}</span>
            </el-form-item>
            <el-form-item label="配件型号">
              <span>{{ item.deviceModel }}</span>
            </el-form-item>
            <el-form-item label="配件名称">
              <span>{{ item.name }}</span>
            </el-form-item>
            <el-form-item label="配件规格">
              <span>{{ item.specification }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="no"
        label="设备编号"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column label="设备铭牌" show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          <y-image
            :src="row.nameplateImg ? row.nameplateImg.split(',')[0] : ''"
            :srcList="row.nameplateImg ? row.nameplateImg.split(',') : ''"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceTypeName"
        label="设备类型"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="deviceBrand"
        label="设备品牌"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="deviceModel"
        label="设备型号"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="deviceSystemName"
        label="设备系统"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="devicePlace"
        label="设备产地"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="维保价格"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="startTime"
        label="投保时间"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
      <el-table-column
        prop="endTime"
        label="到期时间"
        show-overflow-tooltip
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>
<style lang="less" scoped>
// 头部信息部分样式
.headInfo {
  .statusTop {
    padding: 10px 0;
    display: flex;
    .statusTop_statu {
      font-weight: 700;
      color: red;
      margin-right: 40px;
    }
    .statusTop_code {
      color: #707070;
      font-weight: 700;
    }
  }

  .headInfo_content {
    padding: 15px 30px 0 30px;
    h2 {
      color: #0b2059;
      margin-bottom: 20px;
    }
    .content {
      display: flex;
      justify-content: space-between;
      padding-right: 30%;
      .itemLine {
        display: flex;
        .item {
          color: #707070;
          font-size: 20px;
          .itemTitle {
            font-weight: 700;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
.cont {
  margin: 0 20px;
  font-size: 18px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #707070;
}

.name {
  margin: 20px 0;
  display: flex;
  font-size: 24px;
  justify-content: center;
  align-items: center;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #707070;
}
</style>
<script>
import { getMasterList, handleAssignMaster } from "@/api/user.js";
import { getButlerOrderDetail } from "@/api/order.js";
import tableMixin from "@/mixin/table";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      orderMsg: [],
      id: "",
      People: "",
      Name: "",
      Phone: "",
      orderDetail: [],
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
    this.id = this.$route.query.id;
    this._getButlerOrderDetail();
  },
  methods: {
    // 获取年保订单的信息
    _getButlerOrderDetail() {
      let data = {
        id: this.id,
      };
      getButlerOrderDetail(data).then((res) => {
        if (res) {
          this.orderDetail = res.data.deviceList;
          this.orderMsg = res.data;
          console.log("详情", res);
        }
      });
    },
    // 没用到开始 ----------------------------------------
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
    _getMasterList() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        realName: this.Name,
        phone: this.Phone,
      };
      getMasterList(params).then((res) => {
        if (res) {
          console.log(res);
          this.masterList = res.data.records;
          console.log("师傅列表", this.masterList);
        }
      });
    },
    queryDesc(row) {
      this.$router.push(
        "/maintenance/maintenance_order_desc?enterpriseOrderSn=" + row.orderSn
      );
      this.$router.push({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn },
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
    // 没用到结束 ----------------------------------------
  },
};
</script>
