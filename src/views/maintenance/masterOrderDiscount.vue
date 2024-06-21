<template>
  <div class="masterOrderDiscount">
    <!-- 顶部 -->
    <div class="topControls">
      <div class="topControlsSearchInfo">
        <div class="topControlsSearchInfoItem">
          <div class="label">师傅姓名</div>
          <div>
            <el-input
              v-model="queryMasterOrderDiscountListParams.realName"
              placeholder="请输入师傅姓名"
            ></el-input>
          </div>
        </div>
        <div class="topControlsSearchInfoItem">
          <div class="label">企业订单号</div>
          <div>
            <el-input
              v-model="queryMasterOrderDiscountListParams.relationOrderSn"
              placeholder="请输入企业订单号"
            ></el-input>
          </div>
        </div>
        <div class="topControlsSearchInfoItem">
          <div class="label">查询时间</div>
          <div>
            <el-date-picker
              v-model="queryTime"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeQueryTime"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="topControlsBtn">
        <el-button type="primary" plain @click="openMergeOrderDialog(null)"
          >新增</el-button
        >
        <el-button type="primary" plain @click="serachMasterOrderDiscountList"
          >搜索</el-button
        >
        <el-button type="primary" plain @click="resetMasterOrderDiscountList"
          >重置</el-button
        >
      </div>
    </div>

    <!-- 表格 -->
    <el-card style="padding: 20px">
      <el-table :data="masterOrderDiscountList" style="width: 100%">
        <el-table-column
          width="200"
          prop="targetTime"
          label="折扣计算时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="200"
          prop="realName"
          label="师傅名称"
          align="center"
        >
        </el-table-column>
        <el-table-column label="企业订单号" align="center" width="200">
          <template slot-scope="{ row }">
            <div
              v-for="item in row.relationOrderSnList"
              :key="item"
              @click.prevent="goToOrderDesc(item)"
              style="color: #409eff; cursor: pointer"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="openMergeOrderDialog(row.id, row.relationOrderSnList)"
            >
              修改
            </el-button>
            <el-button type="text" @click="deleteMasterDiscountLog(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="tabelPagination">
        <el-pagination
          :total="masterOrderDiscountListTotal"
          @current-change="changeMasterOrderDiscountListPage"
          :current-page="queryMasterOrderDiscountListParams.pageNo"
          background
          layout="prev, pager, next"
          :page-size="queryMasterOrderDiscountListParams.pageSize"
        >
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="手动合并订单"
      :visible="mergeOrderVisible"
      :before-close="closeMergeOrderDialog"
      :close-on-click-modal="false"
      width="30%"
      center
    >
      <h3>需要合并的订单如下:</h3>
      <div style="margin: 15px 0; color: red">
        注:订单号必须满足同个师傅,设备产地国产
      </div>
      <el-form>
        <el-form-item
          v-for="(item, index) in mergeOrderList"
          :key="`订单号${index + 1}`"
          :label="`订单号${index + 1}`"
        >
          <div style="display: flex; align-items: center">
            <el-input
              placeholder="请填写订单编号"
              v-model="mergeOrderList[index]"
            ></el-input>
            <el-button
              v-if="index != 0"
              style="margin-left: 15px"
              @click="delOrderNum(index)"
            >
              删除
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-button @click="addOrderNum">新增订单号</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmMasterOrder">确 定</el-button>
        <el-button @click="closeMergeOrderDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryMasterOrderDiscountList,
  handleMergeMasterOrder,
  deleteMasterDiscountLog,
} from "@/api/order";
export default {
  data() {
    return {
      masterOrderDiscountListTotal: null,
      masterOrderDiscountList: [],
      queryMasterOrderDiscountListParams: {
        pageNo: 1,
        pageSize: 10,
        queryTime: null,
        realName: null,
        relationOrderSn: null,
      },
      queryTime: null,

      //合并订单
      mergeOrderVisible: false,
      mergeOrderList: [],
      handleMergeMasterOrderParams: {
        id: null,
        relationOrderSn: null,
      },
    };
  },
  methods: {
    // 删除合并记录
    async deleteMasterDiscountLog(id) {
      const res = await this.$confirm("您确定删除这条合并记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      if (res == "confirm") {
        const result = await deleteMasterDiscountLog({
          id,
        });
        if (result.message == "操作成功") {
          this.$message({
            message: result.message,
            type: "success",
          });
          this.queryMasterOrderDiscountList();
        }
      }
    },
    // 确认合并订单号
    async confirmMasterOrder() {
      const arr = [...this.mergeOrderList];
      // 去除空值的数组
      let filteredArray = arr.filter(function (item) {
        return item !== null && item !== undefined && item !== "";
      });
      // 至少一个订单
      if (filteredArray.length == 0) {
        this.$message({
          message: "至少填写一个订单号",
          type: "warning",
        });
        return;
      }
      this.handleMergeMasterOrderParams.relationOrderSn =
        filteredArray.join(",");
      const res = await handleMergeMasterOrder(
        this.handleMergeMasterOrderParams
      );
      if (res.message == "操作成功") {
        this.closeMergeOrderDialog();
        this.queryMasterOrderDiscountList();
      }
    },
    // 删除订单号
    delOrderNum(index) {
      this.mergeOrderList.splice(index, 1);
    },
    // 关闭合并订单框
    closeMergeOrderDialog() {
      this.handleMergeMasterOrderParams = {
        id: null,
        relationOrderSn: null,
      };
      this.mergeOrderList = [];
      this.mergeOrderVisible = false;
    },
    // 新增订单号
    addOrderNum() {
      this.mergeOrderList.push("");
    },
    // 打开合并订单框
    openMergeOrderDialog(id, list) {
      if (id) {
        this.handleMergeMasterOrderParams.id = id;
        this.mergeOrderList = [...list];
        console.log("修改");
      } else {
        this.mergeOrderList.push("");
      }
      this.mergeOrderVisible = true;
    },
    // 跳转详情页
    goToOrderDesc(orderSn) {
      this.$router.push({
        name: "maintenance_order_desc",
        query: { orderSn },
      });
    },
    // 重置列表
    resetMasterOrderDiscountList() {
      this.queryTime = null;
      this.queryMasterOrderDiscountListParams = {
        pageNo: 1,
        pageSize: 10,
        queryTime: null,
        realName: null,
        relationOrderSn: null,
      };
      this.queryMasterOrderDiscountList();
    },
    // 修改查询时间
    changeQueryTime() {
      this.queryMasterOrderDiscountListParams.queryTime =
        this.queryTime[0] + "~" + this.queryTime[1];
    },
    // 查询列表
    async queryMasterOrderDiscountList() {
      const res = await queryMasterOrderDiscountList(
        this.queryMasterOrderDiscountListParams
      );
      this.masterOrderDiscountList = res.data.records;
      this.masterOrderDiscountListTotal = res.data.total;
    },
    // 切换页面
    async changeMasterOrderDiscountListPage(page) {
      this.queryMasterOrderDiscountListParams.pageNo = page;
      this.queryMasterOrderDiscountList();
    },
    // 点击搜索
    serachMasterOrderDiscountList() {
      this.queryMasterOrderDiscountListParams.pageNo = 1;
      this.queryMasterOrderDiscountList();
    },
  },
  created() {
    // 查询折扣记录列表
    this.queryMasterOrderDiscountList();
  },
};
</script>

<style lang="less"  scoped>
.masterOrderDiscount {
  padding: 20px;
  .topControls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .topControlsSearchInfo {
      display: flex;
      align-items: center;
      .topControlsSearchInfoItem {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .label {
          font-weight: 700;
          font-size: 16px;
          color: #606266;
          margin-right: 20px;
        }
      }
    }
  }

  .tabelPagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
