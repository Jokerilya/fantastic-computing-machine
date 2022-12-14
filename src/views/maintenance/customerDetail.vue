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
    <el-card>
      <el-table
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="orderDetail"
        style="width: 100%;"
        height="80vh"
      >
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-table
              :data="row.partsList"
              border
              :cell-style="{ 'text-align': 'center' }"
              style="width: 100%"
              :header-cell-style="{
                background: '#f6f8fc',
                color: '#707070',
                'text-align': 'center',
              }"
            >
              <el-table-column prop="category" label="配件大类">
              </el-table-column>
              <el-table-column prop="deviceBrand" label="配件品牌">
              </el-table-column>
              <el-table-column prop="deviceModel" label="配件型号">
              </el-table-column>
              <el-table-column prop="name" label="配件名称"> </el-table-column>
              <el-table-column prop="specification" label="配件规格">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <a
                    href="#"
                    style="color:#0b2059;"
                    @click="editAccessoriesFn(row)"
                  >
                    编辑
                  </a>
                  <a
                    href="#"
                    style="color:#0b2059;"
                    @click="delAccessoriesFn(row.id)"
                  >
                    删除</a
                  >
                </template>
              </el-table-column>
            </el-table>
          </template> </el-table-column
        ><el-table-column
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
        <el-table-column
          prop="endTime"
          label="到期时间"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="{ row }">
            <a href="#" style="color:#0b2059;" @click="addAccessoriesFn(row.id)"
              >添加
            </a>
            <!-- <a href="#" style="color:#0b2059;">
            编辑
          </a> -->
            <a
              href="#"
              style="color:#0b2059;"
              @click="deleteDeviceInfo(row.id)"
            >
              删除</a
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增编辑配件 -->
    <addEditDialog
      :title="dislogTitle"
      ref="addEditDialog"
      :dialogVisible="dialogState"
      @closeFn="dialogState = false"
      @refreshList="_getButlerOrderDetail"
    ></addEditDialog>
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
import addEditDialog from "./components/addEditDialog.vue";
import { getMasterList, handleAssignMaster } from "@/api/user.js";
import { getButlerOrderDetail } from "@/api/order.js";
import tableMixin from "@/mixin/table";
import { deleteDeviceParts, deleteDeviceInfo } from "@/api/equipmentManagement";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      // 弹窗状态
      dialogState: false,
      dislogTitle: "",

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
  components: {
    addEditDialog: addEditDialog,
  },
  created() {
    this.id = this.$route.query.id;
    this._getButlerOrderDetail();
  },
  methods: {
    // 点击设备添加按钮 触发的事件 实际是添加配件
    addAccessoriesFn(id) {
      this.$refs.addEditDialog.accessoriesForm.deviceId = id;
      this.dislogTitle = "新增配件";
      this.dialogState = true;
    },
    // 点击配件编辑触发的事件
    async editAccessoriesFn(row) {
      this.$refs.addEditDialog.accessoriesForm = { ...row };
      this.dislogTitle = "编辑配件";
      this.dialogState = true;
    },
    // 点击设备删除触发的事件
    async deleteDeviceInfo(id) {
      const res = await confirm("您确定要删除该设备吗?");
      if (res) {
        await deleteDeviceInfo(id);
        this._getButlerOrderDetail();
      }
    },
    // 点击配件删除触发的事件
    async delAccessoriesFn(id) {
      const res = await confirm("您确定要删除该配件吗?");
      if (res) {
        await deleteDeviceParts(id);
        this._getButlerOrderDetail();
      }
    },
    // 获取年保订单的信息
    _getButlerOrderDetail() {
      let data = {
        id: this.id,
      };
      getButlerOrderDetail(data).then((res) => {
        if (res) {
          this.orderDetail = res.data.deviceList;
          this.orderMsg = res.data;
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
