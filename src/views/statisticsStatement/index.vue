<template>
  <div class="statistics-container">
    <el-card shadow="hover">
      <div slot="header" class="header-box">
        <span class="title">订单统计报表</span>
      </div>

      <div class="filter-container">
        <div class="filter-left">
          <div style="display: flex; align-items: center">
            <span class="label">统计时间：</span>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :clearable="false"
              size="small"
              style="width: 240px"
            >
            </el-date-picker>

            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              style="margin-left: 10px"
              :loading="loading"
              @click="handleSearch"
            >
              查询
            </el-button>

            <span
              class="tip-text"
              style="margin-left: 15px; font-size: 12px; color: #999"
            >
              <i class="el-icon-info"></i> 请选择三个月内的时间段
            </span>
          </div>
        </div>

        <div class="filter-right">
          <el-button-group>
            <el-button
              icon="el-icon-download"
              size="small"
              @click="handleExport('normal')"
              :loading="exportLoading"
            >
              导出(配件)
            </el-button>
            <el-button
              icon="el-icon-document"
              size="small"
              @click="handleExport('fault')"
              :loading="exportLoading"
            >
              导出(故障项目)
            </el-button>
          </el-button-group>
        </div>
      </div>

      <div class="chart-content" v-loading="loading">
        <el-row :gutter="20">
          <el-col :span="12" :xs="24">
            <div class="chart-wrapper">
              <div ref="chartLeft" class="echart-box"></div>

              <div class="rank-box">
                <div class="rank-header">
                  <span>师傅完成订单排行</span>
                  <span class="total-tag">合计：{{ totalOrderNum }} 单</span>
                </div>
                <div class="rank-list">
                  <div
                    class="rank-item"
                    v-for="(item, index) in leftRankList"
                    :key="index"
                  >
                    <div class="rank-index" :class="'top-' + (index + 1)">
                      {{ index + 1 }}
                    </div>
                    <div class="rank-name">{{ item.name }}</div>
                    <div class="rank-value">{{ item.value }} 单</div>
                    <div
                      class="rank-bar"
                      :style="{ width: (item.value / maxOrderNum) * 100 + '%' }"
                    ></div>
                  </div>
                  <div v-if="leftRankList.length === 0" class="empty-text">
                    暂无数据
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :span="12" :xs="24">
            <div class="chart-wrapper">
              <div ref="chartRight" class="echart-box"></div>

              <div class="rank-box">
                <div class="rank-header">
                  <span>师傅完成金额排行</span>
                  <span class="total-tag">合计：{{ totalOrderAmount }} 元</span>
                </div>
                <div class="rank-list">
                  <div
                    class="rank-item"
                    v-for="(item, index) in rightRankList"
                    :key="index"
                  >
                    <div class="rank-index" :class="'top-' + (index + 1)">
                      {{ index + 1 }}
                    </div>
                    <div class="rank-name">{{ item.name }}</div>
                    <div class="rank-value">{{ item.value }} 元</div>
                    <div
                      class="rank-bar"
                      :style="{
                        width: (item.value / maxOrderAmount) * 100 + '%',
                      }"
                    ></div>
                  </div>
                  <div v-if="rightRankList.length === 0" class="empty-text">
                    暂无数据
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  handleRepairOrderExportV2,
  handleRepairOrderExportByFaults,
  queryMasterOrderRankData,
} from "@/api/order.js";

// 引入 echarts，如果是 vue-echarts 或全局引入可忽略此行
import * as echarts from "echarts";

export default {
  name: "OrderStatistics",
  data() {
    return {
      loading: false,
      exportLoading: false,
      dateRange: [], // [startDate, endDate]

      // 数据概览
      totalOrderAmount: 0,
      totalOrderNum: 0,

      // 列表数据 (为了方便v-for渲染，处理成对象数组)
      leftRankList: [],
      rightRankList: [],

      // ECharts 实例
      chartInstanceLeft: null,
      chartInstanceRight: null,
    };
  },
  computed: {
    // 用于计算排行榜的比例条
    maxOrderNum() {
      return this.leftRankList.length
        ? Math.max(...this.leftRankList.map((i) => i.value)) || 1
        : 1;
    },
    maxOrderAmount() {
      return this.rightRankList.length
        ? Math.max(...this.rightRankList.map((i) => i.value)) || 1
        : 1;
    },
  },
  mounted() {
    this.initDefaultDate();
    this.initCharts(); // 初始化图表实例
    // this.handleSearch(); // 获取初始数据
    // 监听窗口大小变化，自适应图表
    window.addEventListener("resize", this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
    if (this.chartInstanceLeft) this.chartInstanceLeft.dispose();
    if (this.chartInstanceRight) this.chartInstanceRight.dispose();
  },
  methods: {
    // 1. 初始化默认时间 (最近90天)
    initDefaultDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);

      this.dateRange = [this.formatDate(start), this.formatDate(end)];
    },

    // 2. 核心查询逻辑
    async handleSearch() {
      if (!this.validateDate()) return;

      this.loading = true;
      try {
        const params = {
          queryTime: this.dateRange
            ? `${this.dateRange[0]}~${this.dateRange[1]}`
            : null,
        };

        const res = await queryMasterOrderRankData(params);

        if (res && res.data) {
          this.processData(res.data);
          this.updateCharts();
        }
      } catch (error) {
        console.error(error);
        this.$message.error("获取统计数据失败");
      } finally {
        this.loading = false;
      }
    },

    // 3. 数据处理 (将API分开的数组合并，方便前端渲染)
    processData(data) {
      this.totalOrderNum = data.totalOrderNum || 0;
      this.totalOrderAmount = data.totalOrderAmount || 0;

      // 处理左侧数据
      this.leftRankList = (data.orderNumList || []).map((item) => ({
        name: item.realName,
        value: item.value,
      }));

      // 处理右侧数据
      this.rightRankList = (data.orderAmountList || []).map((item) => ({
        name: item.realName,
        value: item.value,
      }));
    },

    // 4. 初始化图表对象 (只执行一次)
    // 修改 initCharts 方法，给个默认空状态提示
    initCharts() {
      this.chartInstanceLeft = echarts.init(this.$refs.chartLeft);
      this.chartInstanceRight = echarts.init(this.$refs.chartRight);

      // 设置默认的空标题，告诉用户需要点击查询
      const emptyOption = {
        title: {
          text: "请点击上方“查询”按钮获取数据",
          left: "center",
          top: "center",
          textStyle: {
            color: "#909399",
            fontWeight: "normal",
            fontSize: 14,
          },
        },
      };

      this.chartInstanceLeft.setOption(emptyOption);
      this.chartInstanceRight.setOption(emptyOption);
    },

    // 5. 更新图表数据
    updateCharts() {
      this.setChartOption(
        this.chartInstanceLeft,
        "师傅完成订单对比图",
        this.leftRankList
      );
      this.setChartOption(
        this.chartInstanceRight,
        "完成订单金额对比图",
        this.rightRankList
      );
    },

    // 通用图表配置
    setChartOption(instance, title, dataList) {
      const names = dataList.map((i) => i.name);
      const values = dataList.map((i) => i.value);

      const option = {
        title: {
          text: title,
          left: "center",
          textStyle: { fontSize: 16, fontWeight: 600 },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        grid: {
          left: "3%",
          right: "8%",
          bottom: "3%",
          containLabel: true,
        },
        // 新增：数据区域缩放组件
        dataZoom: [
          {
            type: "slider",
            show: true,
            yAxisIndex: [0], // 控制Y轴
            left: "93%", // 放置在右侧
            start: 0, // 默认起始位置 0%
            end: 40, // 默认结束位置 40% (大约显示前10-15个)
            width: 20, // 滚动条宽度
            handleSize: "80%", // 手柄大小
            showDetail: false, // 拖拽时不显示详细数值
            borderColor: "transparent",
            fillerColor: "#e6f7ff", // 填充颜色
            handleStyle: {
              color: "#409eff",
            },
          },
          {
            type: "inside", // 允许鼠标滚轮滚动
            yAxisIndex: [0],
            start: 0,
            end: 40,
          },
        ],
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: names,
          inverse: true, // 让排名高的在上面
        },
        series: [
          {
            type: "bar",
            data: values,
            itemStyle: {
              // 使用渐变色让柱子更现代
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            barMaxWidth: 20, // 限制最大宽度
            // 柱子圆角
            itemStyle: {
              borderRadius: [0, 10, 10, 0], // 右上右下圆角
              color: "#409eff",
            },
          },
        ],
      };
      instance.setOption(option, true); // true 表示不合并，重绘
    },

    // 6. 导出功能整合
    async handleExport(type) {
      if (!this.validateDate()) return;

      this.exportLoading = true;
      const params = {
        queryTime: this.dateRange
          ? `${this.dateRange[0]}~${this.dateRange[1]}`
          : "",
      };

      try {
        let res;
        let fileName = "维保统计报表";

        if (type === "normal") {
          res = await handleRepairOrderExportV2(params);
          fileName = "维保列表_配件版";
        } else {
          res = await handleRepairOrderExportByFaults(params);
          fileName = "维保列表_故障项目版";
        }

        if (res) {
          this.downloadFile(res.data, fileName);
        }
      } catch (e) {
        console.error(e);
        this.$message.error("导出失败，请稍后重试");
      } finally {
        this.exportLoading = false;
      }
    },

    // 辅助：下载文件
    downloadFile(data, fileName) {
      const blob = new Blob([data], { type: "application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}_${this.formatDate(new Date())}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    },

    // 辅助：日期校验
    validateDate() {
      if (!this.dateRange || this.dateRange.length < 2) {
        this.$message.warning("请选择时间范围");
        return false;
      }
      const d1 = new Date(this.dateRange[0]);
      const d2 = new Date(this.dateRange[1]);
      const days = (d2 - d1) / (1000 * 60 * 60 * 24);

      if (days > 95) {
        this.$message.warning("查询时间跨度不能超过3个月");
        return false;
      }
      return true;
    },

    // 辅助：格式化日期
    formatDate(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    },

    resizeCharts() {
      this.chartInstanceLeft && this.chartInstanceLeft.resize();
      this.chartInstanceRight && this.chartInstanceRight.resize();
    },
  },
};
</script>

<style scoped lang="less">
.statistics-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 头部样式 */
.header-box {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

/* 筛选区样式 */
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;

  .filter-left {
    display: flex;
    align-items: center;
    .label {
      font-weight: 500;
      margin-right: 8px;
    }
    .tip-text {
      margin-left: 15px;
      font-size: 12px;
      color: #909399; /* 改为灰色，更柔和 */
      i {
        color: #e6a23c; /* 图标用橙色警告 */
      }
    }
  }
}

/* 图表区域样式 */
.chart-content {
  .chart-wrapper {
    background: #fff;
    padding: 10px;

    /* ECharts 高度 */
    .echart-box {
      width: 100%;
      height: 400px;
    }

    /* 排行榜样式优化 */
    .rank-box {
      margin-top: 20px;
      border: 1px solid #ebeef5;
      border-radius: 8px; /* 圆角更大一点 */
      padding: 20px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05); /* 添加轻微阴影，更有层次感 */

      .rank-header {
        display: flex;
        justify-content: space-between;
        align-items: center; /* 垂直居中 */
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 15px;
        border-bottom: 1px solid #f0f0f0; /* 线条更淡 */
        padding-bottom: 15px;

        .total-tag {
          color: #409eff;
          font-size: 14px;
          background: #ecf5ff;
          padding: 4px 10px;
          border-radius: 4px;
        }
      }

      .rank-list {
        /* 修改点1：高度增加，确保能放下至少10-12个数据 */
        max-height: 600px;
        overflow-y: auto;
        padding-right: 5px;

        /* 美化滚动条(保持不变) */
        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-thumb {
          background: #dcdfe6;
          border-radius: 3px;
        }

        .rank-item {
          display: flex;
          align-items: center;

          /* 修改点2：微调内边距，从 10px 改为 8px，视觉更精致 */
          padding: 8px 0;

          position: relative;

          /* 修改点3：微调下边距，从 8px 改为 5px，让列表更连贯 */
          margin-bottom: 5px;

          border-bottom: 1px dashed #f5f7fa;

          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          /* 排名数字 (样式保持不变) */
          .rank-index {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 4px;
            background: #f0f2f5;
            color: #909399;
            font-size: 12px;
            margin-right: 15px;
            font-weight: bold;
            flex-shrink: 0;

            &.top-1 {
              background: #f56c6c;
              color: #fff;
            }
            &.top-2 {
              background: #e6a23c;
              color: #fff;
            }
            &.top-3 {
              background: #e6a23c;
              color: #fff;
              opacity: 0.7;
            }
          }

          /* 名字宽度微调，防止名字太长换行 */
          .rank-name {
            min-width: 80px;
            max-width: 120px;
            font-size: 14px;
            color: #606266;
            margin-right: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            z-index: 2;
          }

          .rank-value {
            flex: 1;
            text-align: right;
            font-family: "DIN Alternate", "Helvetica Neue", sans-serif;
            font-weight: bold;
            color: #303133;
            font-size: 15px;
            z-index: 2;
          }

          /* 进度条 (样式保持不变) */
          .rank-bar {
            position: absolute;
            left: 45px;
            bottom: 5px;
            height: 4px;
            background: linear-gradient(
              90deg,
              #409eff 0%,
              rgba(64, 158, 255, 0.2) 100%
            );
            border-radius: 2px;
            z-index: 1;
            opacity: 0.6;
          }
        }
      }
    }
  }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: flex-start;
    .filter-left,
    .filter-right {
      margin-bottom: 10px;
      width: 100%;
    }
    .el-date-editor {
      width: 100% !important;
    }
  }
}
</style>