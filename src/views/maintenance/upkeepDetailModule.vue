<template>
  <!-- 保养明细模块 -->
  <div class="upkeepDetailModuleBox">
    <!-- 顶部工具栏 -->
    <div class="topTool">
      <el-input
        v-model="queryUpkeepListParameter.no"
        placeholder="输入设备编号"
        class="toolInput"
      >
      </el-input>
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-right: 10px;"
        value-format="yyyy-MM-dd"
        @change="changeData"
      >
      </el-date-picker>

      <el-button class="toolBtn" @click="queryUpkeepListFn(1)">查询</el-button>
      <el-button class="toolBtn" @click="resetUpkeepListFn">重置</el-button>
      <el-button class="toolBtn" @click="exportBtn" style="margin-right: 10px;"
        >导入模板</el-button
      >
      <el-upload
        class="upload-demo"
        action
        multiple
        :http-request="importUpkeepListFn"
        :show-file-list="false"
      >
        <el-button class="toolBtn">导入</el-button>
      </el-upload>
    </div>

    <!-- 表格内容部分 -->
    <div class="tableContent" v-if="upkeepList">
      <el-card>
        <div class="tableContent_table">
          <el-table
            :cell-style="{ 'text-align': 'center' }"
            :data="upkeepList"
            style="width: 100%"
            :header-cell-style="{
              background: '#f6f8fc',
              color: '#707070',
              'text-align': 'center',
            }"
          >
            <el-table-column width="150" label="设备编号" prop="no">
            </el-table-column>
            <el-table-column label="保养日期">
              <template slot-scope="{ row }">
                {{ row.keepTime.substr(0, 10) }}
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              prop="type"
              label="保养类型"
            ></el-table-column>
            <el-table-column prop="person" label="保养人"></el-table-column>
            <el-table-column label="保养内容" prop="content"> </el-table-column>
            <el-table-column prop="fault" label="排除故障"></el-table-column>
            <el-table-column
              prop="totalCostFee"
              label="总成本"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <a
                  style="color: #0b2059;margin-right: 10px;"
                  @click.prevent="openUpkeepDetailsDialogFn(row)"
                  >详情</a
                >
                <a
                  style="color: #0b2059;"
                  @click.prevent="delUpkeepDetails(row.id)"
                  >删除</a
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tableContent_footer">
          <div class="footer_pagination">
            <el-pagination
              @current-change="currentChangeFn"
              :page-size="queryUpkeepListParameter.pageSize"
              layout="jumper, prev, pager, next,total "
              :total="total"
              :current-page="queryUpkeepListParameter.pageNo"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 详情 -->
    <el-dialog
      :visible="upkeepDetailsDialog"
      width="50%"
      :before-close="closeUpkeepDetailsDialogFn"
      :showClose="false"
    >
      <div v-if="upkeepDetails">
        <div class="orderDetails">
          <h2 style="text-align:center;">
            保养详情
          </h2>
          <div class="content">
            <div class="line">
              <div class="item">
                <span class="title">设备编号</span>
                <span class="desc">{{ upkeepDetails.no }}</span>
              </div>
              <div class="item">
                <span class="title">保养日期</span>
                <span class="desc">{{
                  upkeepDetails.keepTime && upkeepDetails.keepTime.substr(0, 10)
                }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">保养类型</span>
                <span class="desc">{{ upkeepDetails.type }}</span>
              </div>
              <div class="item">
                <span class="title">保养人</span>
                <span class="desc">{{ upkeepDetails.person }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">保养内容</span>
                <span class="desc">{{ upkeepDetails.content }}</span>
              </div>
              <div class="item">
                <span class="title">排除故障</span>
                <span class="desc">{{ upkeepDetails.fault }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">配件名称</span>
                <span class="desc">{{ upkeepDetails.partsNames }}</span>
              </div>
              <div class="item">
                <span class="title">配件费用</span>
                <span class="desc">{{ upkeepDetails.totalPartsFee }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">人工费用</span>
                <span class="desc">{{ upkeepDetails.totalArtificialFee }}</span>
              </div>
              <div class="item">
                <span class="title">总成本</span>
                <span class="desc">{{ upkeepDetails.totalCostFee }}</span>
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex;justify-content: flex-end;">
          <el-button @click="closeUpkeepDetailsDialogFn" class="closeBtn"
            >关闭</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryDeviceKeepOrder,
  deleteDeviceKeepOrder,
  uploadDeviceKeepOrder,
} from "../../api/upkeep.js";
export default {
  data() {
    return {
      queryUpkeepListParameter: {
        no: null,
        pageSize: 10,
        pageNo: 1,
        startTime: null,
        endTime: null,
      },
      date: null,
      upkeepList: [
        {
          transCode: 200,
        },
      ],
      total: null,
      upkeepDetails: [],

      upkeepDetailsDialog: false,
    };
  },
  methods: {
    // 改变时间格式
    changeData() {
      this.queryUpkeepListParameter.startTime = this.date[0] + " 00:00:00";
      this.queryUpkeepListParameter.endTime = this.date[1] + " 23:59:59";
    },

    // 查询
    async queryUpkeepListFn(id) {
      if (id === 1) {
        this.queryUpkeepListParameter.pageNo = 1;
      }
      const res = await queryDeviceKeepOrder(this.queryUpkeepListParameter);
      const { records, total } = res.data;
      this.upkeepList = records;
      this.total = total;
    },

    // 重置
    resetUpkeepListFn() {
      this.queryUpkeepListParameter = {
        no: null,
        pageSize: 10,
        pageNo: 1,
        startTime: null,
        endTime: null,
      };
      this.queryUpkeepListFn();
    },

    // 模板导出
    exportBtn() {
      window.location.replace(
        "https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20230225/IE75181320.xlsx"
      );
    },

    // 导入
    async importUpkeepListFn(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await uploadDeviceKeepOrder(formData);
      if (res.message === "操作成功") {
        this.$message({
          message: "保养记录导入成功",
          type: "success",
        });
        this.resetUpkeepListFn();
      }
    },

    // 点击页码触发
    currentChangeFn(page) {
      this.queryUpkeepListParameter.pageNo = page;
      this.queryUpkeepListFn();
    },

    // 关闭保养详情
    closeUpkeepDetailsDialogFn() {
      this.upkeepDetailsDialog = false;
    },

    // 打开保养详情
    openUpkeepDetailsDialogFn(row) {
      this.upkeepDetails = row;
      this.upkeepDetailsDialog = true;
    },

    // 删除保养详情
    async delUpkeepDetails(id) {
      const confirm = await this.$confirm("您确定删除该保养记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      if (confirm == "confirm") {
        const res = await deleteDeviceKeepOrder(id);
        if (res.message === "操作成功") {
          this.queryUpkeepListFn();
        }
      }
    },
  },
  created() {
    this.queryUpkeepListFn();
  },
};
</script>

<style lang="less" scoped>
.upkeepDetailModuleBox {
  padding: 20px;
  // 顶部工具栏
  .topTool {
    display: flex;
    margin-bottom: 20px;
    .toolInput {
      width: 170px;
      margin-right: 10px;
    }
    .toolSelect {
      width: 130px;
      margin-right: 10px;
    }
    .toolBtn {
      color: #2e4c9e;
    }
  }

  // 表格内容部分
  .tableContent {
    .tableContent_title {
      color: #0b2059;
      font-weight: 700;
      font-size: 20px;
      padding-left: 30px;
    }
    .tableContent_table {
      margin: 30px 0;
    }
    .tableContent_footer {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: center;
    }
  }

  // 详情
  .orderDetails {
    color: #707070;
    .content {
      padding: 20px 20px;
      .line {
        display: flex;
        margin-bottom: 20px;
        .item {
          flex: 1;
          display: flex;
          align-items: center;
          padding-right: 20px;
          .title {
            width: 150px;
            color: #707070;
            font-weight: 700;
            font-size: 22px;
          }
          .desc {
            font-size: 18px;
            flex: 1;
          }
        }
      }
    }
  }

  // 按钮样式
  .closeBtn {
    background-color: #fff;
    color: #0b2059;
    border: 1px solid #0b2059;
    width: 110px;
    height: 40px;
  }
}
</style>
