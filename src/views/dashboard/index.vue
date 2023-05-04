<template>
  <div class="content_box">
    <div class="count-wrap">
      <div class="count-title">营收概况</div>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-card
            shadow="hover"
            :body-style="{ background: '#ff7970', height: '300px' }"
          >
            <div class="count-top">
              <i class="el-icon-date"></i>
              <span>设备总数 </span>
              <span>{{ panelData.deviceInfoCount || 0 }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card
            shadow="hover"
            :body-style="{ background: '#ffba44', height: '300px' }"
          >
            <div class="count-top">
              <i class="el-icon-printer"></i>
              <span>签约客户数</span>
              <span>{{ panelData.enterpriseCount || 0 }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card
            shadow="hover"
            :body-style="{ background: '#648cff', height: '300px' }"
          >
            <div class="count-top">
              <i class="el-icon-document-copy"></i>
              <span>入驻师傅数</span>
              <span>{{ panelData.masterInfoCount || 0 }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card
            shadow="hover"
            :body-style="{ background: '#4fccb0', height: '300px' }"
          >
            <div class="count-top">
              <i class="el-icon-data-line"></i>
              <span>业务人员数</span>
              <span>{{ panelData.salesmanCount || 0 }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--  -->
    <div style="height: 16px;"></div>
    <div class="count-wrap">
      <div class="count-title">待办事项</div>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card shadow="never" style="border: 0;">
            <router-link :to="{ name: 'OrderList' }" class="count-content">
              <i class="el-icon-date"></i>
              <div class="count-content-box">
                <span>{{ panelData.totalCount || 0 }}</span>
                <span>维修订单总数</span>
              </div>
            </router-link>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" style="border: 0;">
            <router-link :to="{ name: 'OrderList' }" class="count-content">
              <i class="el-icon-circle-check" style="background: #05abed;"></i>
              <div class="count-content-box">
                <span>{{ panelData.incompleteCount || 0 }}</span>
                <span>待完成维修数</span>
              </div>
            </router-link>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" style="border: 0;">
            <router-link :to="{ name: 'ServiceList' }" class="count-content">
              <i class="el-icon-refresh" style="background: #f44235;"></i>
              <div class="count-content-box">
                <span>{{ panelData.completeCount || 0 }}</span>
                <span>已完成维修数</span>
              </div>
            </router-link>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--  -->
    <!-- <div style="height: 16px;"></div>
    <div class="count-wrap">
      <div class="count-title">营收统计</div>
      <div class="count-tab">
        <span @click="getChartData(1)" :class="{ cur: type === 1 }">本周</span>
        <span @click="getChartData(2)" :class="{ cur: type === 2 }">本月</span>
      </div>
      <div class="myCharts" ref="myCharts"></div>
    </div> -->
  </div>
</template>
<script>
import { queryChartStatistics, queryStatistics } from "@/api/admin";
var echarts = require("echarts");
export default {
  name: "Dashboard",
  data() {
    return {
      panelData: {},
      chartData: {},
      type: 1,
    };
  },
  beforeMount() {
    this.initPanelData();
    this.getChartData(1);
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    // 获取数据
    initPanelData() {
      queryStatistics().then((res) => {
        const resData = this.resDataFn(res);
        this.panelData = resData;
      });
    },
    // 获取图表数据
    getChartData(type) {
      this.type = type;
      queryChartStatistics({
        type, //type 1 周 2 月
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.chartData = resData;
        this.initCharts();
      });
    },
    // 初始化图表
    initCharts() {
      this.chart = echarts.init(this.$refs.myCharts);
      this.setOptions();
    },
    setOptions() {
      let xAxisData = [],
        seriesData = [],
        text = "周";
      for (let i in this.chartData.list) {
        xAxisData.push(this.chartData.list[i].date);
        seriesData.push(this.chartData.list[i].money);
      }
      if (this.type === 2) {
        text = "月";
      }
      this.chart.setOption({
        title: {
          left: "150px",
          text:
            "本" + text + "订单总数 " + this.chartData.num ||
            0 + "     本" + text + "订单总额 " + this.chartData.money ||
            0,
        },
        tooltip: {},
        xAxis: {
          data: xAxisData,
        },
        yAxis: {},
        series: [
          {
            name: "本周",
            type: "line",
            smooth: true,
            data: seriesData,
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss">
.count-wrap {
  background: #fff;
  padding: 18px;
}
.count-title {
  padding: 18px 0;
  font-weight: bold;
  font-size: 25px;
}
.count-top {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding-top: 150px;
  position: relative;
  color: #fff;
  > i {
    font-size: 100px;
    position: absolute;
    left: 48.5%;
    top: 25%;
    transform: translate(-46%, -50%);
  }
  > span {
    font-size: 25px;
    font-weight: 700;
    padding-bottom: 30px;
  }
  > span:nth-of-type(2) {
    font-size: 35px;
    font-weight: bold;
  }
}
.count-content {
  display: flex;
  flex-direction: column;
  padding: 50px 0 50px 0;
  position: relative;
  > i {
    font-size: 32px;
    background: #f4c735;
    border-radius: 50%;
    position: absolute;
    left: 18%;
    top: 50%;
    transform: translate(-46%, -50%);
    padding: 14px;
    color: #fff;
  }
  .count-content-box {
    padding-left: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 252px;
    span {
      font-size: 16px;
      margin: 4px 0;
      font-weight: bold;
    }
    span:nth-of-type(2) {
      font-size: 14px;
      color: #454545;
    }
  }
}
.count-content::before {
  content: "";
  width: 1px;
  height: 54px;
  background: #eee;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
// .count-content::after{content: '';width: 1px;height: 50px;background: #f0f0f0;position: absolute;right: 33%;top: 50%;transform: translateY(-50%);}
.myCharts {
  height: 350px;
}
.count-tab {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 200px;
  span {
    margin-left: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
  }
  span.cur {
    color: #409eff;
  }
}
</style>
