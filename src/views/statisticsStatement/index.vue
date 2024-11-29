<template>
  <div class="statisticsStatement">
    <el-card>
      <h1>订单统计报表</h1>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div>
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="handleRepairOrderExportV2ParamsQuery"
            value-format="yyyy-MM-dd"
            @change="timeChangeChart"
          >
          </el-date-picker>
          <span style="margin-left: 10px; font-size: 20px; color: red"
            >ps:请选择三个月内</span
          >
        </div>
        <div>
          <el-button style="margin-left: 20px" @click="exportListV2">
            导出
          </el-button>
          <el-button style="margin-left: 20px" @click="exportByFaults">
            导出(故障项目)
          </el-button>
        </div>
      </div>
      <div class="chartBox">
        <div class="chartLeft">
          <div
            v-if="chartLeftData.data.length > 0"
            id="chartLeft"
            :style="{ width: '700px', height: '600px' }"
          ></div>
          <div class="orderRank">
            <div>
              师傅完成订单排行
              <span style="margin-left: 30px">合计:{{ totalOrderNum }}单</span>
            </div>
            <div
              class="masterItemOrder"
              v-for="(item, index) in chartLeftData.data.length"
              :key="item.name"
            >
              <div
                class="numLv"
                :style="{
                  color:
                    index == 0
                      ? '#e66a59'
                      : index == 1
                      ? '#f4a739'
                      : index == 2
                      ? '#f6ca3a'
                      : '#000',
                }"
              >
                {{ index + 1 }}
              </div>
              <div class="masterName">{{ chartLeftData.nameList[index] }}</div>
              <div>完成单量:{{ chartLeftData.data[index] }}单</div>
            </div>
          </div>
        </div>
        <div class="chartRight">
          <div
            v-if="chartLeftData.data.length > 0"
            id="chartRight"
            :style="{ width: '700px', height: '600px' }"
          ></div>
          <div class="orderRank">
            <div>
              师傅完成订单金额排行
              <span style="margin-left: 30px"
                >合计:{{ totalOrderAmount }}元</span
              >
            </div>
            <div
              class="masterItemOrder"
              v-for="(item, index) in chartRightData.data.length"
              :key="item.name"
            >
              <div
                class="numLv"
                :style="{
                  color:
                    index == 0
                      ? '#e66a59'
                      : index == 1
                      ? '#f4a739'
                      : index == 2
                      ? '#f6ca3a'
                      : '#000',
                }"
              >
                {{ index + 1 }}
              </div>
              <div class="masterName">{{ chartRightData.nameList[index] }}</div>
              <div>完成金额:{{ chartRightData.data[index] }}元</div>
            </div>
          </div>
        </div>
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
export default {
  data() {
    return {
      // 左边图数据
      chartLeftData: {
        chartName: "师傅完成订单对比图",
        data: [],
        nameList: [],
      },
      // 右边图数据
      chartRightData: {
        chartName: "完成订单金额对比图",
        data: [],
        nameList: [],
      },
      handleRepairOrderExportV2ParamsQuery: null,
      handleRepairOrderExportV2Params: {
        queryTime: "",
      },
      totalOrderAmount: null,
      totalOrderNum: null,
    };
  },
  async created() {
    this.getNowDate();
    await this.queryMasterOrderRankData();
    this.drawChartLeft();
    this.drawChartRight();
  },
  methods: {
    // 拿排行数据
    async queryMasterOrderRankData() {
      const res = await queryMasterOrderRankData(
        this.handleRepairOrderExportV2Params
      );
      // 修改左边的数据
      let orderNumList = res.data.orderNumList;
      let leftData = [];
      let leftNameList = [];
      orderNumList.forEach((item) => {
        leftData.push(item.value);
        leftNameList.push(item.realName);
      });
      this.chartLeftData.data = leftData;
      this.chartLeftData.nameList = leftNameList;

      // 修改右边的数据
      let orderAmountList = res.data.orderAmountList;
      let rightData = [];
      let rightNameList = [];
      orderAmountList.forEach((item) => {
        rightData.push(item.value);
        rightNameList.push(item.realName);
      });
      this.chartRightData.data = rightData;
      this.chartRightData.nameList = rightNameList;

      this.totalOrderAmount = res.data.totalOrderAmount;
      this.totalOrderNum = res.data.totalOrderNum;
    },
    /**
     * 计算前多少天的日子
     * @param dateString 要往前推的日子 例:"2023-05-10"
     * @param days  计算几天  例:90
     */
    subtractDays(dateString, days) {
      const date = new Date(dateString);
      date.setDate(date.getDate() - days);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始计数
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    // 获取今天的日期 拿到本月的
    getNowDate() {
      const today = new Date();

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const subtractDay = this.subtractDays(`${year}-${month}-${day}`, 90);
      this.handleRepairOrderExportV2ParamsQuery = [
        subtractDay,
        `${year}-${month}-${day}`,
      ];
      this.handleRepairOrderExportV2Params.queryTime = `${subtractDay}~${year}-${month}-${day}`;
    },

    // 计算时间段中间时间
    daysBetween(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffInTime = Math.abs(d2 - d1);
      const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
      return diffInDays;
    },
    // 选择时间后获取新数据刷新页面图形
    async timeChangeChart(val) {
      const days = this.daysBetween(val[0], val[1]);
      this.days = days;
      if (days > 95) {
        this.$message({
          message: "请选择三个月内",
          type: "warning",
        });
        return;
      }
      if (val) {
        this.handleRepairOrderExportV2Params.queryTime = val[0] + "~" + val[1];
        await this.queryMasterOrderRankData();
        this.drawChartLeft();
        this.drawChartRight();
      } else {
        this.handleRepairOrderExportV2Params.queryTime = null;
        await this.queryMasterOrderRankData();
        this.drawChartLeft();
        this.drawChartRight();
      }
    },
    // 维保订单列表数据导出
    async exportByFaults() {
      if (this.days > 95) {
        this.$message({
          message: "请选择三个月内",
          type: "warning",
        });
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      const res = await handleRepairOrderExportByFaults(
        this.handleRepairOrderExportV2Params
      );
      if (res) {
        const link = document.createElement("a");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = "维保列表新版"; //下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loading.close();
      }
    },
    // 导出新版
    async exportListV2() {
      if (this.days > 95) {
        this.$message({
          message: "请选择三个月内",
          type: "warning",
        });
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      const res = await handleRepairOrderExportV2(
        this.handleRepairOrderExportV2Params
      );
      if (res) {
        const link = document.createElement("a");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = "维保列表新版"; //下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loading.close();
      }
    },
    // 绘画左边的图
    drawChartLeft() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("chartLeft"));
      // const text_data = this.chartLeftData.data
      //   .map((item) => item.name)
      //   .slice(0, 3);
      // 绘制图表
      myChart.setOption({
        title: {
          text: this.chartLeftData.chartName,
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          show: false,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: this.chartLeftData.nameList,
          inverse: true,
        },
        series: [
          {
            type: "bar",
            data: this.chartLeftData.data,
            itemStyle: {
              color: "#5470c6",
            },
          },
        ],
        // title: {
        //   text: this.chartLeftData.chartName,
        //   left: "center",
        // },
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{a} <br/>{b}: {c} ({d}%)",
        // },
        // legend: {
        //   top: "10%",
        //   left: "center",
        //   selectedMode: false,
        //   data: text_data,
        //   show: false,
        //   // 要在师傅名字后面加一个数量
        //   formatter: (name) => {
        //     const index = this.chartLeftData.data.findIndex(
        //       (item) => item.name == name
        //     );
        //     return name + " " + this.chartLeftData.data[index].value;
        //   },
        // },
        // color: ["#6eb158", "#cdcdcd", "#3f8cff"],
        // series: [
        //   {
        //     name: "完成单量",
        //     type: "pie",
        //     radius: "50%",
        //     data: this.chartLeftData.data,
        //     emphasis: {
        //       itemStyle: {
        //         shadowBlur: 10,
        //         shadowOffsetX: 0,
        //         shadowColor: "rgba(0, 0, 0, 0.5)",
        //       },
        //     },
        //     label: {
        //       formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}:}{c}  {per|{d}%}  ",
        //       backgroundColor: "",
        //       borderColor: "",
        //       borderWidth: 1,
        //       borderRadius: 4,
        //       rich: {},
        //     },
        //   },
        // ],
      });
    },
    // 绘画右边的图
    drawChartRight() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("chartRight"));
      // const text_data = this.chartRightData.data
      //   .map((item) => item.name)
      //   .slice(0, 3);
      // 绘制图表
      myChart.setOption({
        title: {
          text: this.chartRightData.chartName,
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          show: false,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: this.chartRightData.nameList,
          inverse: true,
        },
        series: [
          {
            type: "bar",
            data: this.chartRightData.data,
          },
        ],
        // title: {
        //   text: this.chartRightData.chartName,
        //   left: "center",
        // },
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{a} <br/>{b}: {c} ({d}%)",
        // },
        // legend: {
        //   top: "10%",
        //   left: "center",
        //   selectedMode: false,
        //   data: text_data,
        //   show: false,
        //   // 标签长度太长做如下限制
        //   formatter: (name) => {
        //     const index = this.chartRightData.data.findIndex(
        //       (item) => item.name == name
        //     );
        //     return name + " " + this.chartRightData.data[index].value;
        //   },
        // },
        // // color: ["#6eb158", "#cdcdcd", "#3f8cff"],
        // series: [
        //   {
        //     name: "完成订单金额",
        //     type: "pie",
        //     radius: "50%",
        //     data: this.chartRightData.data,
        //     emphasis: {
        //       itemStyle: {
        //         shadowBlur: 10,
        //         shadowOffsetX: 0,
        //         shadowColor: "rgba(0, 0, 0, 0.5)",
        //       },
        //     },
        //     label: {
        //       formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}:}{c}  {per|{d}%}  ",
        //       backgroundColor: "",
        //       borderColor: "",
        //       borderWidth: 1,
        //       borderRadius: 4,
        //       rich: {},
        //     },
        //   },
        // ],
      });
    },
  },
};
</script>

<style scoped lang="less">
.statisticsStatement {
  padding: 20px;
  .chartBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    .chartLeft,
    .chartRight {
      display: flex;
      flex-direction: column;
      align-items: left;
      .orderRank {
        margin-left: 10%;
        width: 50%;
        font-size: 15px;
        font-weight: 700;
        .masterItemOrder {
          display: flex;
          justify-content: space-between;
          padding: 5px 10px;
          position: relative;
          .numLv {
            font-size: 18px;
            font-weight: 400;
          }
          .masterName {
            margin: 0 10px;
          }
        }
      }
    }
  }
}
</style>
