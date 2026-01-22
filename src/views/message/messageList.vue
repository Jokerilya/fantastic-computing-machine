<template>
  <div class="message-list">
    <div class="top-controls">
      <div class="search-group">
        <div class="search-item">
          <span class="label">订单号</span>
          <el-input
            v-model.trim="queryParams.orderSn"
            placeholder="请输入订单号"
            clearable
            @keyup.enter.native="handleSearch"
            style="width: 200px"
          ></el-input>
        </div>
        <div class="search-item">
          <span class="label">状态</span>
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="未读" :value="0"></el-option>
            <el-option label="已读" :value="1"></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">模块</span>
          <el-select
            v-model="queryParams.module"
            placeholder="请选择模块"
            clearable
          >
            <el-option
              v-for="item in moduleOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="btn-group">
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleSearch"
          >搜索</el-button
        >
        <el-button plain icon="el-icon-refresh" @click="handleReset"
          >重置</el-button
        >
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="operationPeople"
          label="操作人"
          align="center"
          min-width="120"
        ></el-table-column>

        <el-table-column label="模块" align="center" min-width="120">
          <template slot-scope="{ row }">
            <el-tag :type="getModuleTagType(row.module)">{{
              formatModuleName(row.module)
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="订单号" align="center" min-width="180">
          <template slot-scope="{ row }">
            {{ row.orderSn || "暂无订单号" }}
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.status === 1 ? 'info' : 'danger'">
              {{ row.status === 1 ? "已读" : "未读" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="message"
          label="内容"
          align="center"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="操作" align="center" fixed="right" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleAction(row)"
              >前往操作</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="queryParams.pageSize"
          :current-page.sync="queryParams.pageNo"
          @current-change="fetchData"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { queryRepairMessgae, handleUnReadMessage } from "@/api/order";

// 静态配置：模块与路由映射表 (策略模式)
// value: 后端返回的key
// text: 显示文本
// route: 路由配置 (支持 name 或 path)
const MODULE_CONFIG = {
  order: {
    text: "订单操作",
    route: { name: "maintenance_order_desc", queryKey: "orderSn" },
  },
  master: { text: "师傅操作", route: { name: "worker" } },
  enterprise: { text: "企业操作", route: { name: "enterpriseList" } },
  product_consult: { text: "产品咨询", route: { path: "/activity/message" } },
  butler_order: {
    text: "年保过期",
    route: { path: "/maintenance/customerDetail", queryKey: "orderSn" },
  },
  invoice: {
    text: "发票操作",
    route: { path: "/invoiceManagement/invoiceList" },
  },
  keepOrder: {
    text: "保养操作",
    route: { path: "/maintenance/upkeepDetailModule" },
  },
};

export default {
  name: "MessageList",
  data() {
    return {
      loading: false,
      // 将模块配置转换为数组供 Select 使用
      moduleOptions: Object.entries(MODULE_CONFIG).map(([key, val]) => ({
        value: key,
        text: val.text,
      })),
      queryParams: {
        status: null,
        orderSn: null,
        module: null,
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 核心查询逻辑
    async fetchData() {
      this.loading = true;
      try {
        const res = await queryRepairMessgae(this.queryParams);
        if (res.code === "000") {
          this.total = res.data.total;
          this.tableData = res.data.records || [];
        } else {
          this.tableData = [];
          this.total = 0;
        }
      } catch (error) {
        console.error("获取消息列表失败", error);
        this.$message.error("获取数据失败");
      } finally {
        this.loading = false;
      }
    },

    // 搜索
    handleSearch() {
      this.queryParams.pageNo = 1;
      this.fetchData();
    },

    // 重置
    handleReset() {
      // 技巧：利用 $options.data() 获取组件初始状态，避免手动一一赋值
      const defaultData = this.$options.data();
      this.queryParams = { ...defaultData.queryParams };
      this.fetchData();
    },

    // 格式化模块名称 (替代 Template 中的复杂逻辑)
    formatModuleName(moduleKey) {
      return MODULE_CONFIG[moduleKey]?.text || "暂无模块";
    },

    // 可选：为不同模块设置不同颜色的 Tag
    getModuleTagType(moduleKey) {
      // 简单示例，可根据业务扩展
      return moduleKey === "order" ? "" : "warning";
    },

    // 处理跳转操作
    async handleAction(row) {
      if (!row.module) return;

      const config = MODULE_CONFIG[row.module];
      if (!config) {
        this.$message.warning("未配置该模块的跳转路径");
        return;
      }

      // 1. 构建路由跳转对象
      const routeLocation = { ...config.route };

      // 如果配置了需要传参 (如 orderSn)
      if (routeLocation.queryKey && row[routeLocation.queryKey]) {
        // 兼容 path 和 name 两种跳转方式的 query 传参
        routeLocation.query = {
          ...routeLocation.query, // 保留原有的query
          [routeLocation.queryKey]: row[routeLocation.queryKey],
        };
        // 清理掉自定义属性 queryKey，防止污染 vue-router
        delete routeLocation.queryKey;
      }

      // 2. 标记已读 (异步操作，不阻塞跳转，但建议处理错误)
      if (row.status === 0) {
        handleUnReadMessage(row.id)
          .then((res) => {
            if (res.code === "000") {
              // 如果需要在当前页更新状态，可以在这里手动将 row.status 设为 1
              // 但因为马上跳转了，通常不需要
            }
          })
          .catch((err) => console.error("标记已读失败", err));
      }

      // 3. 执行跳转
      this.$router.push(routeLocation);
    },
  },
};
</script>

<style scoped lang="less">
.message-list {
  padding: 20px;

  .top-controls {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;

    .search-group {
      display: flex;
      flex-wrap: wrap;

      .search-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        margin-bottom: 10px;

        .label {
          font-weight: 700;
          font-size: 14px;
          color: #606266;
          margin-right: 10px;
          white-space: nowrap;
        }
      }
    }
  }

  .table-card {
    .pagination-container {
      margin-top: 20px;
      text-align: right; // 分页通常靠右
    }
  }
}
</style>