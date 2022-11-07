<!--维保订单-->
<template>
  <div class="app-container">
    <div class="manage-top">
      <el-form
        :model="searchForm"
        ref="ruleForm"
        label-width="88px"
        class="rule-form"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="5">
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
          </el-col>
          <el-col :span="5">
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
          <el-col :span="5">
            <el-button icon="el-icon-zoom-in" plain type="primary" @click="query()">查询</el-button>
            <el-button icon="el-icon-refresh" plain type="info" @click="reset()">重置</el-button>
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
      :data="dataList"
      style="width: 100%;"
      max-height="700"
    >
      <el-table-column prop="orderSn" label="订单编号" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column
        prop="no"
        label="设备编码"
        show-overflow-tooltip
        width="200"
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
        prop="simpleDesc"
        label="故障描述"
        show-overflow-tooltip
        width="200"
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
      <!-- <el-table-column
        prop="deviceSystemName"
        label="设备系统名"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column> -->
      <el-table-column
        prop="deviceTypeName"
        label="设备类型名"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column prop="num" label="设备数量" show-overflow-tooltip width="200" align="center"></el-table-column>
      <!-- <el-table-column
        prop="modalityType"
        label="维保模式"
        show-overflow-tooltip
        width="200"
        align="center"
      >
        <template slot-scope="{row}">{{ util.global.getLabel('modalityType',row.modalityType) }}</template>
      </el-table-column> -->
      <!-- <el-table-column prop="type" label="故障类型" show-overflow-tooltip width="200" align="center">
        <template slot-scope="{row}">{{ util.global.getLabel('malfunctionType',row.type) }}</template>
      </el-table-column> -->
      <el-table-column
        prop="enterpriseName"
        label="企业名称"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column prop="address" label="详细地址" show-overflow-tooltip width="200" align="center"></el-table-column>
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
      <!-- <el-table-column
        prop="depositAmount"
        label="定金"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="balanceAmount"
        label="尾款"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column> -->
      <el-table-column
        prop="rejectReason"
        label="驳回原因"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orderStatusName"
        label="状态"
        show-overflow-tooltip
        width="150"
        align="center"
        fixed="right"
      >
        <!-- <template
          slot-scope="{row}"
        >{{ util.global.getLabel('subStatus',row.subStatus) }}</template> -->
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        show-overflow-tooltip
        width="150"
        align="center"
        fixed="right"
      ></el-table-column>
      <el-table-column label="操作" width="300px" fixed="right">
        <template slot-scope="{row}">
          <div class="settings">
            <el-button type="info" size="mini" plain @click="queryDesc(row)">查看详情</el-button>
            <el-button
              type="info"
              size="mini"
              plain
              v-show="row.platformStatus == 1"
              @click="querySnatchList(row) "
            >指派列表</el-button>
          </div>
          <!-- :disabled="row.mainStatus !=1" -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="updatePageNo"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageCount"
    ></el-pagination>

    <model ref="snatch" title="指派列表" :isSubmit="false" :column="2" @close="closeSnatch">
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="师傅名称">
              <el-input placeholder="请输入师傅名称" v-model="Name"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="5">
          <el-form-item label="联系电话">
            <el-input placeholder="请输入联系电话" v-model="Phone"></el-input>
          </el-form-item>
          </el-col>-->
          <el-col :span="15">
            <el-button icon="el-icon-zoom-in" plain type="primary" @click="_getMasterList">查询</el-button>
            <el-button icon="el-icon-refresh" plain type="primary" @click="seedIt">提交</el-button>
            <el-button icon="el-icon-refresh" plain type="primary" @click="seedItout">抛入市场</el-button>
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
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="realPortrait"
          label="真实头像"
          show-overflow-tooltip
          width="160"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              style="width: 80px; height: 80px"
              :src="row.realPortrait.split(',')[0]"
              :preview-src-list="row.realPortrait.split(',')"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" show-overflow-tooltip width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="300px" fixed="right">
          <template slot-scope="{row}">
            <!-- <div class="settings">
              <el-button type="primary" size="mini" plain @click="_handleAssignMaster(row)">指派师傅</el-button>
               <el-button style=""></el-button>
            </div>-->
            <el-checkbox v-model="row.isSelect" true-label="row.uid" @change="changeMaster(row)"></el-checkbox>
          </template>
          <!-- <template slot-scope="scope">
            <el-checkbox v-model="scope.row.status"  @change="changeMaster(scope.row.uid)"></el-checkbox>
          </template>-->
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage "
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageCountMaster"
      ></el-pagination>
    </model>
    <!-- <div style="margin:20px 0">
      <el-button icon="el-icon-zoom-in" plain type="primary" >新增</el-button>
      <el-button icon="el-icon-zoom-in" plain type="primary" @click="_addOrder">信息录入</el-button>
    </div>-->
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
import { getMasterList, handleAssignMaster,queryAssignableMasterList } from "@/api/user.js";
import {
  queryRepairOrderList
} from "@/api/order.js";
import tableMixin from "@/mixin/table";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      dataList:[],
      pageCount: '',
      pageCountMaster:'',
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
    // this._getMasterList()
    this._queryAssignableMasterList();
    this._queryRepairOrderList()
  },
  methods: {
    _queryAssignableMasterList(){
        let data = {
        pageNo: this.currentPage,
        pageSize: 10,
        realName: this.Name,
      };
      queryAssignableMasterList(data).then(res => {
        if (res) {
          console.log(res);
          this.masterList = res.data.records;
          console.log("师傅列表", this.masterList);
          this.pageCountMaster = res.data.total;
          this.currentPage = res.data.current;
        }
      });
    },
    _queryRepairOrderList(){
      let data = {
        pageNo:this.currentPage,
        pageSize: 10,
        status: ''
      };
      queryRepairOrderList(data).then(res => {
        if (res) {
          this.dataList = res.data.records;
          this.pageCount = res.data.total;
          console.log("订单列表", this.dataList);
        }
      });
    },
    updatePageNo(val){
      this.currentPage = val;
      this._queryRepairOrderList()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.currentPage2 = val;
      this._getMasterList();
    },
    _addOrder() {
      this.$router.push({
        name: "maintenance"
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
    // _getMasterList() {
    //   let params = {
    //     pageNo: this.currentPage,
    //     pageSize: 10,
    //     realName: this.Name,
    //     phone: this.Phone
    //   };
    //   getMasterList(params).then(res => {
    //     if (res) {
    //       console.log(res);
    //       this.masterList = res.data.records;
    //       console.log("师傅列表", this.masterList);
    //       this.pageCount = res.data.total;
    //       this.currentPage = res.data.current;
    //     }
    //   });
    // },
    queryDesc(row) {
      this.$router.push({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn }
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
