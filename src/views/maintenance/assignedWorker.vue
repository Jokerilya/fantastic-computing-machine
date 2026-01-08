<template>
  <div class="assignedWorker">
    <div class="searchTool">
      <div class="filter-section">
        <div class="filter-item">
          <span class="label">师傅名称</span>
          <el-input
            class="filter-input"
            clearable
            placeholder="请输入师傅名称"
            v-model="params.realName"
            @keyup.enter.native="handleSearch"
            @clear="handleSearch"
          ></el-input>
        </div>

        <div class="filter-item">
          <span class="label">服务地区</span>
          <el-cascader
            class="filter-input"
            v-model="params.areaId"
            :options="serviceAreasList"
            :props="serviceAreasProps"
            clearable
            @change="handleSearch"
          ></el-cascader>
        </div>

        <div class="selected-info" v-if="masterNameList.length > 0">
          <span class="label">已选师傅 ({{ masterNameList.length }}):</span>
          <div class="tags-wrapper">
            <el-tag
              v-for="item in masterNameList"
              :key="item"
              size="small"
              effect="plain"
              class="worker-tag"
            >
              {{ item }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="operation-btns">
        <el-button type="info" plain @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button
          type="success"
          plain
          @click="handleTakeOrder"
          :disabled="loading"
        >
          代师傅接单
        </el-button>
        <el-button
          type="success"
          @click="assignedBtn('worker')"
          :disabled="loading || masterUidList.length === 0"
        >
          确认指派
        </el-button>
      </div>
    </div>

    <div class="workerTable">
      <el-card shadow="never">
        <el-table
          v-if="!isMobile"
          ref="masterListRef"
          height="70vh"
          v-loading="loading"
          :header-cell-style="{ background: '#f6f8fc', color: '#707070' }"
          :data="masterList"
          style="width: 100%"
          @selection-change="handleChangeWorker"
          :row-key="getRowKeys"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55"
            align="center"
          >
          </el-table-column>

          <el-table-column label="师傅头像" align="center" width="100">
            <template slot-scope="{ row }">
              <div class="avatar-wrapper">
                <el-image
                  class="user-avatar"
                  :src="row.realPortrait ? row.realPortrait.split(',')[0] : ''"
                  fit="cover"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <el-image
                  v-if="isVerified(row.number)"
                  class="verified-badge"
                  src="https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20240927/AU04149909.png"
                >
                </el-image>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="realName"
            label="师傅姓名"
            align="center"
            width="150"
          >
          </el-table-column>
          <el-table-column label="工作状态" align="center" width="120">
            <template slot-scope="{ row }">
              {{
                row.workStatus == 1
                  ? "上线"
                  : row.workStatus == 3
                  ? "离线"
                  : "--"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系电话"
            align="center"
            width="120"
          >
          </el-table-column>

          <el-table-column label="签约类型" align="center" width="100">
            <template slot-scope="{ row }">
              <el-tag :type="getWorkerTypeTag(row.type)" size="mini">
                {{ getWorkerTypeText(row.type) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="orderNum"
            label="当月单量"
            align="center"
            width="100"
          >
            <template slot-scope="{ row }">
              {{ row.orderNum || 0 }} 单
            </template>
          </el-table-column>

          <el-table-column
            label="当前进行中订单"
            align="center"
            min-width="180"
          >
            <template slot-scope="{ row }">
              <div v-if="row.orderSnList && row.orderSnList.length > 0">
                <div
                  v-for="item in row.orderSnList"
                  :key="item"
                  class="order-link-wrapper"
                >
                  <el-link
                    type="primary"
                    :underline="false"
                    @click="queryDesc(item)"
                  >
                    {{ item }}
                  </el-link>
                </div>
              </div>
              <span v-else class="text-gray">暂无进行中订单</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="serviceAreas"
            label="服务地区"
            align="center"
            width="250"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="serviceTypes"
            label="服务类型"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="createTime"
            label="入驻时间"
            align="center"
            width="160"
          >
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="100"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button type="text" @click="goToDetail(row.id)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="mobile-card-list">
          <div
            v-for="row in masterList"
            :key="row.id"
            class="mobile-card"
            :class="{ 'is-selected': isCardSelected(row) }"
            @click="toggleCardSelection(row)"
          >
            <div class="card-header">
              <div class="user-info">
                <div class="checkbox-mock">
                  <i class="el-icon-check" v-if="isCardSelected(row)"></i>
                </div>
                <el-avatar
                  :src="row.realPortrait ? row.realPortrait.split(',')[0] : ''"
                  size="medium"
                ></el-avatar>
                <span class="name">{{ row.realName }}</span>
                <el-tag
                  :type="getWorkerTypeTag(row.type)"
                  size="mini"
                  style="margin-left: 5px"
                  >{{ getWorkerTypeText(row.type) }}</el-tag
                >
              </div>
              <el-button type="text" @click.stop="goToDetail(row.id)"
                >详情</el-button
              >
            </div>

            <div class="card-body">
              <p><i class="el-icon-phone"></i> {{ row.phone }}</p>
              <p>
                <i class="el-icon-s-order"></i> 当月单量:
                {{ row.orderNum || 0 }}
              </p>
              <p>
                <i class="el-icon-map-location"></i>
                {{ row.serviceAreas || "暂无地区" }}
              </p>
              <div
                class="ongoing-orders"
                v-if="row.orderSnList && row.orderSnList.length"
              >
                <span>进行中: </span>
                <el-link
                  v-for="item in row.orderSnList"
                  :key="item"
                  type="primary"
                  style="margin-right: 5px; font-size: 12px"
                  @click.stop="queryDesc(item)"
                  >{{ item }}</el-link
                >
              </div>
            </div>
          </div>
        </div>

        <div class="pagingTool">
          <el-pagination
            :current-page.sync="params.pageNo"
            :page-size="params.pageSize"
            :total="total"
            @current-change="handlePageChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </el-card>
    </div>

    <el-dialog
      title="区域指派"
      :width="isMobile ? '90%' : '500px'"
      :visible.sync="regionChooseDialog"
    >
      <div class="dialog-content">
        <el-select
          v-model="cityValue"
          placeholder="请选择市"
          style="width: 200px; margin-right: 15px"
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
          style="width: 200px"
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
import { handleTakeOrder } from "@/api/proxy";
import { queryAssignableMasterList, handleAssignMaster } from "@/api/user";
import { addressFn } from "@/api/system";

// 引入JSON数据，建议放在静态资源或通过API获取，这里保持原样
import cityAddressData from "../../utils/city-address.json";

export default {
  name: "AssignedWorker",
  data() {
    return {
      isMobile: false, // 是否为移动端
      loading: false, // 表格加载状态
      districtValue: [],
      districtList: [],
      cityValue: null,
      cityList: [],
      regionChooseDialog: false,
      enterpriseOrderSn: "",

      // 查询参数
      params: {
        pageNo: 1,
        pageSize: 10,
        realName: "",
        areaId: null,
      },

      serviceAreasList: [],
      serviceAreasProps: {
        checkStrictly: false,
        emitPath: false,
        value: "id",
        label: "name",
        children: "child",
      },

      masterList: [],
      total: 0,

      // 选中的数据
      masterUidList: [],
      masterNameList: [],
    };
  },

  // 在 created 或 mounted 中添加监听
  mounted() {
    this.checkDevice();
    window.addEventListener("resize", this.checkDevice);
  },

  // 记得销毁监听
  beforeDestroy() {
    window.removeEventListener("resize", this.checkDevice);
  },

  created() {
    // 初始化路由参数
    const { masterNameList, masterUidList, orderSn } = this.$route.query;

    // 确保是数组格式
    this.masterNameList = [].concat(masterNameList || []);
    this.masterUidList = [].concat(masterUidList || []);

    this.enterpriseOrderSn = orderSn || "";
    this.serviceAreasList = cityAddressData;

    this.initCityData();
    this.fetchMasterList();
  },

  methods: {
    // 1. 检测设备宽度
    checkDevice() {
      this.isMobile = document.body.clientWidth < 768; // 768px 作为平板/手机分界线
    },

    // 2. 手机端卡片点击切换选中状态 (模拟表格的 selection-change)
    toggleCardSelection(row) {
      const index = this.masterUidList.indexOf(row.uid);
      if (index > -1) {
        // 已选中，则移除
        this.masterUidList.splice(index, 1);
        this.masterNameList.splice(index, 1);
        // 如果切回 PC 端，需要同步表格状态（可选，视需求而定）
        if (this.$refs.masterListRef) {
          this.$refs.masterListRef.toggleRowSelection(row, false);
        }
      } else {
        // 未选中，则添加
        this.masterUidList.push(row.uid);
        this.masterNameList.push(row.realName);
        if (this.$refs.masterListRef) {
          this.$refs.masterListRef.toggleRowSelection(row, true);
        }
      }
    },
    // 3. 辅助判断卡片是否被选中
    isCardSelected(row) {
      return this.masterUidList.includes(row.uid);
    },
    // 初始化省市数据
    async initCityData() {
      try {
        const res = await addressFn(440000); // 440000 是广东省代码
        this.cityList = res.data;
      } catch (error) {
        console.error("获取城市列表失败", error);
      }
    },

    // 获取列表数据
    async fetchMasterList() {
      this.loading = true;
      try {
        const res = await queryAssignableMasterList(this.params);
        if (res.code === "000") {
          this.masterList = res.data.records;
          this.total = res.data.total;
        }
      } catch (error) {
        console.error("获取师傅列表失败", error);
        this.$message.error("获取师傅列表失败，请稍后重试");
      } finally {
        this.loading = false;
      }
    },

    // 搜索
    handleSearch() {
      this.params.pageNo = 1;
      this.fetchMasterList();
    },

    // 重置
    handleReset() {
      this.params.realName = "";
      this.params.areaId = null;
      this.handleSearch();
    },

    // 分页切换
    handlePageChange(val) {
      this.params.pageNo = val;
      this.fetchMasterList();
    },

    // 表格多选变化
    handleChangeWorker(selection) {
      // 提取选中项的ID和Name
      this.masterUidList = selection.map((item) => item.uid);
      this.masterNameList = selection.map((item) => item.realName);
    },

    // 指定Table Row Key
    getRowKeys(row) {
      return row.id;
    },

    // 判断是否是大V
    isVerified(numberStr) {
      return numberStr && (numberStr.includes("V") || numberStr.includes("v"));
    },

    // 辅助函数：获取工种类型文本
    getWorkerTypeText(type) {
      const map = { 1: "普通兼职", 2: "签约", 3: "全职" };
      return map[type] || "未知";
    },

    // 辅助函数：获取工种Tag样式
    getWorkerTypeTag(type) {
      const map = { 1: "info", 2: "warning", 3: "success" };
      return map[type] || "";
    },

    // 跳转订单详情
    queryDesc(orderSn) {
      const routeData = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn },
      });
      window.open(routeData.href, "_blank");
    },

    // 跳转师傅详情
    goToDetail(id) {
      this.$router.push({
        path: "/maintenance/worker/workerDetails",
        query: { id },
      });
    },

    // 代师傅接单
    async handleTakeOrder() {
      if (this.masterUidList.length !== 1) {
        return this.$message.warning("请选择且仅选择一名师傅进行操作");
      }

      try {
        await this.$confirm(
          `确定代师傅【${this.masterNameList[0]}】接单吗？`,
          "提示",
          {
            type: "warning",
          }
        );

        const params = {
          uid: this.masterUidList[0],
          relationOrderSn: this.enterpriseOrderSn,
        };
        const res = await handleTakeOrder(params);
        if (res.message === "操作成功") {
          this.$message.success("接单成功");
          this.navigateBackToOrder();
        }
      } catch (error) {
        // 取消或失败
      }
    },

    // 确认指派
    async assignedBtn(judge) {
      const isWorkerAssign = judge === "worker";

      // 如果是指派师傅，需要校验
      if (isWorkerAssign && this.masterUidList.length === 0) {
        return this.$message.warning("请至少选择一名师傅");
      }

      try {
        const confirmText = isWorkerAssign
          ? `确定指派选中的 ${this.masterUidList.length} 位师傅吗？`
          : "确定将订单抛入市场吗？";

        await this.$confirm(confirmText, "指派确认", { type: "warning" });

        const params = {
          enterpriseOrderSn: this.enterpriseOrderSn,
          masterUidList: isWorkerAssign ? this.masterUidList : [],
        };

        const res = await handleAssignMaster(params);
        if (res.message === "操作成功") {
          this.$message.success("指派成功");
          this.navigateBackToOrder();
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 区域指派逻辑
    async confirmRegionChoose() {
      if (!this.districtValue || this.districtValue.length === 0) {
        return this.$message.warning("请选择区域");
      }
      const res = await handleAssignMaster({
        areaIdList: this.districtValue,
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUidList: null,
      });
      if (res.message === "操作成功") {
        this.$message.success("区域指派成功");
        this.navigateBackToOrder();
      }
    },

    // 城市切换联动
    async cityValueChage(val) {
      this.districtValue = []; // 清空下一级选中
      const res = await addressFn(val);
      this.districtList = res.data;
    },

    // 统一返回跳转
    navigateBackToOrder() {
      this.$router.push({
        name: "maintenance_order_desc",
        query: { orderSn: this.enterpriseOrderSn },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.assignedWorker {
  padding: 20px;
  background-color: #fff;
  min-height: 100vh;

  .searchTool {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;

    .filter-section {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 20px;
      flex: 1;

      .filter-item {
        display: flex;
        align-items: center;

        .label {
          color: #606266;
          font-weight: 500;
          margin-right: 10px;
          white-space: nowrap;
        }

        .filter-input {
          width: 220px;
        }
      }

      .selected-info {
        display: flex;
        align-items: center;
        margin-left: 10px;
        padding-left: 20px;
        border-left: 1px solid #e0e0e0;

        .label {
          color: #909399;
          margin-right: 10px;
        }

        .tags-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;

          .worker-tag {
            // max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .operation-btns {
      display: flex;
      gap: 10px;
      margin-left: 20px;
    }
  }

  .workerTable {
    .avatar-wrapper {
      position: relative;
      width: 60px;
      height: 60px;
      margin: 0 auto;

      .user-avatar {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background: #f5f7fa;
        display: flex;
        justify-content: center;
        align-items: center;

        .image-slot {
          font-size: 20px;
          color: #c0c4cc;
        }
      }

      .verified-badge {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 2;
        pointer-events: none; // 防止遮挡头像点击
      }
    }

    .order-link-wrapper {
      line-height: 1.5;
    }

    .text-gray {
      color: #909399;
      font-size: 12px;
    }

    .pagingTool {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end; // 分页通常靠右
      padding-bottom: 20px;
    }
  }

  .dialog-content {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
}

/* === 响应式适配 === */
@media screen and (max-width: 768px) {
  .assignedWorker {
    padding: 10px; // 减少边距

    .searchTool {
      flex-direction: column; // 上下排列
      padding: 15px;

      .filter-section {
        width: 100%;

        .filter-item {
          width: 100%;
          margin-bottom: 10px;
          display: flex;

          .label {
            width: 70px; // 固定标签宽度，对齐输入框
            flex-shrink: 0;
          }

          .filter-input {
            width: 100% !important; // 输入框占满
            flex: 1;
          }
        }

        .selected-info {
          margin: 10px 0;
          padding-left: 0;
          border-left: none;
          width: 100%;

          .label {
            display: block;
            margin-bottom: 5px;
          }
        }
      }

      .operation-btns {
        margin-left: 0;
        margin-top: 15px;
        width: 100%;
        display: flex;
        flex-wrap: wrap; // 按钮换行
        justify-content: space-between;

        .el-button {
          flex: 1 0 45%; // 按钮两列排布
          margin-left: 0 !important;
          margin-bottom: 10px;

          &:nth-child(2n) {
            margin-left: 10px !important;
          }
        }
      }
    }

    // 手机端卡片样式
    .mobile-card-list {
      height: 65vh;
      overflow-y: auto;

      .mobile-card {
        border: 1px solid #ebeef5;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        background: #fff;
        position: relative;
        transition: all 0.3s;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 8px;

          .user-info {
            display: flex;
            align-items: center;

            .checkbox-mock {
              width: 18px;
              height: 18px;
              border: 1px solid #dcdfe6;
              border-radius: 2px;
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fff;
              transition: all 0.2s; // 加个过渡动画

              i {
                color: #fff;
                font-size: 12px;
                font-weight: bold;
              }
            }
          }

          .name {
            font-weight: bold;
            margin-left: 8px;
            font-size: 15px;
          }
        }

        // --- 核心修改在这里 ---
        // 选中状态样式 (注意这里的写法，确保层级能够覆盖默认样式)
        &.is-selected {
          border-color: #409eff;
          background-color: #f0f9eb;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

          // 强制选中时修改内部 checkbox-mock 的样式
          .card-header .user-info .checkbox-mock {
            background-color: #409eff !important; // 加 !important 确保生效
            border-color: #409eff !important;
          }
        }
        // --------------------

        .card-body {
          // ... 保持原有不变
          color: #606266;
          font-size: 13px;

          p {
            margin: 6px 0;
            display: flex;
            align-items: center;
            i {
              margin-right: 6px;
              color: #909399;
            }
          }

          .ongoing-orders {
            margin-top: 8px;
            background: #f4f4f5;
            padding: 5px;
            border-radius: 4px;
          }
        }
      }
    }

    // 弹窗内部
    .dialog-content {
      flex-direction: column;
      align-items: center;

      .el-select {
        margin-right: 0 !important;
        margin-bottom: 15px;
        width: 100% !important;
      }
    }
  }
}
</style>