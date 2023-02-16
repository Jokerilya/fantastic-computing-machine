<template>
  <div class="assignedWorker">
    <!-- 查询工具栏 -->
    <div class="searchTool">
      <div class="workerName">
        <h4 style="color: #999;">师傅名称</h4>
        <div class="inp">
          <el-input
            clearable
            placeholder="请输入你的师傅名称"
            v-model="params.realName"
            @input="realNameBlurFn"
          ></el-input>
        </div>
        <h4 style="color: #999;width: 90px;;margin-left: 20px;">
          指派的师傅:
        </h4>
        <div class="assignedWorkerList">
          <span
            v-for="(item, index) in masterNameList"
            :key="item"
            class="item"
            @click="delAssignedWorker(index)"
          >
            {{ item }}
          </span>
          <div class="notiveText">
            ( 注:点击姓名即可删除！)
          </div>
        </div>
      </div>
      <div class="operationBtnList">
        <el-button
          class="thrownIntoMarketBtn"
          type="primary"
          @click="openRegionChooseDialog"
        >
          区域指派</el-button
        >
        <el-button
          class="thrownIntoMarketBtn"
          type="warning"
          @click="assignedBtn('market')"
          >抛入市场</el-button
        >
        <el-button
          class="thrownIntoMarketBtn"
          type="success"
          @click="assignedBtn('worker')"
          >指派师傅</el-button
        >
      </div>
    </div>

    <!-- 师傅表格 -->
    <div class="workerTable">
      <el-card>
        <el-table
          v-show="tableShow"
          height="70vh"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
          }"
          :data="masterList"
          style="width: 100%"
        >
          <el-table-column label="多选" align="center" width="100px">
            <template slot-scope="{ row }">
              <input
                type="checkbox"
                style="zoom:120%"
                @click="manyPeopleAssigned(row.show, row.uid, row.realName)"
                v-model="row.show"
              />
            </template>
          </el-table-column>
          <el-table-column label="师傅头像" align="center" width="100px">
            <template slot-scope="{ row }">
              <img :src="row.realPortrait" width="75px" height="75px" />
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="师傅" align="center">
          </el-table-column>
          <el-table-column prop="phone" label="师傅电话" align="center">
          </el-table-column>
          <el-table-column prop="identity" label="角色" align="center">
          </el-table-column>
          <el-table-column label="服务状态" align="center">
            <template>
              可接单状态
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="入驻时间" align="center">
          </el-table-column>
          <el-table-column label="所属" align="center">
            <template>
              广东机床加工有限公司
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <a
                href="#"
                class="operationBtn"
                @click="
                  $router.push('/maintenance/worker/workerDetails?id=' + row.id)
                "
                >详情</a
              >
              <!-- <a href="#" class="operationBtn">订单</a> -->
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部分页 -->
        <div class="pagingTool">
          <el-pagination
            :total="total"
            :page-size="10"
            @current-change="currentChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </el-card>
    </div>

    <!-- 区域选择 -->
    <el-dialog
      title="区域指派"
      width="30%"
      :visible="regionChooseDialog"
      :show-close="false"
    >
      <div class="content">
        <el-select
          v-model="cityValue"
          placeholder="请选择市"
          style="margin-right: 20px;"
          @change="cityValueChage"
        >
          <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          multiple
          collapse-tags
          placeholder="请选择区"
          v-model="districtValue"
        >
          <el-option
            v-for="item in districtList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer">
        <el-button @click="regionChooseDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmRegionChoose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryAssignableMasterList, handleAssignMaster } from "@/api/user";
import { addressFn } from "@/api/system";
export default {
  data() {
    return {
      districtValue: null,
      districtList: null, //区级的列表
      cityValue: null,
      cityList: null, //市级的列表
      regionChooseDialog: false,
      enterpriseOrderSn: "", //指派需要的企业工单订单编号
      params: {
        // 师傅查询需要的数据
        pageNo: 1,
        pageSize: 10,
        realName: "",
      },
      masterList: null, //师傅列表
      total: null, //师傅总条数

      masterUidList: [], //要指派师傅pdi的列表
      masterNameList: [], //要指派师傅姓名的列表
      tableShow: true,
    };
  },
  methods: {
    // 确定区域
    async confirmRegionChoose() {
      const res = await handleAssignMaster({
        areaIdList: this.districtValue,
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUidList: null,
      });
      if (res.message === "操作成功") {
        this.$message({
          message: "指派成功",
          type: "success",
        });
        this.$router.push({
          name: "maintenance_order_desc",
          query: { orderSn: this.enterpriseOrderSn },
        });
      }
    },
    // 市级发生改变
    async cityValueChage() {
      // 获取区级
      const districtList = await addressFn(this.cityValue);
      this.districtList = districtList.data;
    },
    // 打开选择区域
    openRegionChooseDialog() {
      this.regionChooseDialog = true;
    },
    // 删除指派师傅
    delAssignedWorker(index) {
      this.$confirm(
        "您确定取消指派" + this.masterNameList[index] + "?",
        "取消指派",
        {
          type: "warning",
        }
      ).then(() => {
        this.masterUidList.splice(index, 1);
        this.masterNameList.splice(index, 1);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // 勾选指派多选框
    manyPeopleAssigned(show, uid, name) {
      if (!show) {
        if (this.masterUidList.indexOf(uid) === -1) {
          this.masterUidList.push(uid);
        }
        if (this.masterNameList.indexOf(name) === -1) {
          this.masterNameList.push(name);
        }
      } else {
        const uidIndex = this.masterUidList.indexOf(uid);
        this.masterUidList.splice(uidIndex, 1);
        const nameIndex = this.masterNameList.indexOf(name);
        this.masterNameList.splice(nameIndex, 1);
        console.log(this.masterUidList);
      }
    },
    // 指派按钮
    async assignedBtn(judge) {
      let params = {
        enterpriseOrderSn: this.enterpriseOrderSn,
      };
      if (judge === "worker") {
        params.masterUidList = this.masterUidList;
      } else {
        params.masterUidList = [];
      }
      const res = await handleAssignMaster(params);
      if (res.message === "操作成功") {
        this.$message({
          message: "指派成功",
          type: "success",
        });
        this.$router.push({
          name: "maintenance_order_desc",
          query: { orderSn: this.enterpriseOrderSn },
        });
      }
    },
    // 输入框的值发生改变的事件
    realNameBlurFn() {
      this.params.pageNo = 1;
      this.getMasterList();
    },
    // 页码发生改变的时候
    currentChange(page) {
      this.params.pageNo = page;
      this.getMasterList();
    },
    // 获取可指派师傅列表
    async getMasterList() {
      const loading = this.$loading();
      this.tableShow = false;
      const res = await queryAssignableMasterList(this.params);
      this.masterList = res.data.records;
      this.masterList.forEach((item) => {
        item.show = false;
      });
      this.total = res.data.total;
      this.tableShow = true;
      loading.close();
    },
  },
  async created() {
    const { masterNameList, masterUidList, orderSn } = this.$route.query;
    if (masterNameList) {
      masterNameList.forEach((item) => {
        this.masterNameList.push(item);
      });
    }
    if (masterUidList) {
      masterUidList.forEach((item) => {
        this.masterUidList.push(item);
      });
    }
    // 获取广东省的市
    const cityList = await addressFn(440000);
    this.cityList = cityList.data;

    this.enterpriseOrderSn = orderSn; //指派需要的企业工单订单编号
    this.getMasterList();
  },
};
</script>

<style lang="less" scoped>
.operationBtn {
  margin-right: 10px;
  color: #0b2059;
}
.assignedWorker {
  padding: 20px;
  .searchTool {
    display: flex;
    justify-content: space-between;
    position: relative;

    .workerName {
      display: flex;
      align-items: center;
      h4 {
        width: 80px;
      }
      .inp {
        width: 250px;
      }
      .assignedWorkerList {
        color: #1186f4;

        .notiveText {
          font-size: 14px;
          color: red;
          position: absolute;
          bottom: -8px;
          left: 24.3%;
          width: 160px;
        }
      }
    }
  }

  .workerTable {
    margin-top: 20px;
    .pagingTool {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
