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
      </div>
    </div>

    <!-- 师傅表格 -->
    <div class="workerTable">
      <el-card>
        <el-table
          height="70vh"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
          }"
          :data="masterList"
          style="width: 100%"
        >
          <el-table-column label="师傅头像" align="center">
            <template slot-scope="{ row }">
              <img :src="row.realPortrait" width="75px" height="75px" />
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="师傅" align="center">
          </el-table-column>
          <el-table-column prop="phone" label="师傅电话" align="center">
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
              <a href="#" class="operationBtn" @click="assignedBtn(row.uid)"
                >指派</a
              >
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
  </div>
</template>

<script>
import { queryAssignableMasterList, handleAssignMaster } from "@/api/user";
export default {
  data() {
    return {
      enterpriseOrderSn: "", //指派需要的企业工单订单编号
      params: {
        // 师傅查询需要的数据
        pageNo: 1,
        pageSize: 10,
        realName: "",
      },
      masterList: null, //师傅列表
      total: null, //师傅总条数
    };
  },
  methods: {
    // 指派按钮
    async assignedBtn(uid) {
      const res = await handleAssignMaster({
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUidList: [uid],
      });
      if (res.message === "操作成功") {
        this.$message({
          message: "指派成功",
          type: "success",
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
      const res = await queryAssignableMasterList(this.params);
      this.masterList = res.data.records;
      this.total = res.data.total;
    },
  },
  created() {
    this.enterpriseOrderSn = this.$route.query.orderSn; //指派需要的企业工单订单编号
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
    .workerName {
      display: flex;
      align-items: center;
      h4 {
        width: 80px;
      }
      .inp {
        width: 250px;
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
