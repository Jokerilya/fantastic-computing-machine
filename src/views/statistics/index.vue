<template>
  <div class="dashboard">
    <first-title title="数据统计" size="big" />
    <div class="row_div">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="12" :lg="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <i class="icon el-icon-document" /><span class="tit">订单量统计(单)</span>
            </div>
            <div class="item_content">
              <div v-for="(item,index) in modeOrderQuantity" :key="index" class="line">
                <span class="left_tit">{{ types[item.type] }}订单</span><span class="right_num">{{ item.quantity }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <i class="icon el-icon-wallet" /><span class="tit">订单金额统计(元)</span>
            </div>
            <div class="item_content">
              <div v-for="(item,index) in modeOrderPayMoney" :key="index" class="line">
                <span class="left_tit">{{ types[item.type] }}订单</span><span class="right_num"><span>￥</span>{{ item.payMoney.toFixed(2) }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <i class="icon el-icon-user" /><span class="tit">会员统计(人)</span>
            </div>
            <div class="item_content">
              <div v-for="(item,index) in member" :key="index" class="line">
                <span class="left_tit">{{ levelName['leve_'+item.level] }}</span><span class="right_num">{{ item.memberQuantity }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <i class="icon el-icon-coin" /><span class="tit">平台积分池统计</span>
            </div>
            <div class="item_content">
              <div class="line">
                <span class="left_tit">累计已发放</span>
                <span class="right_num">{{ pointsPool.totalPoint || 0 }}</span>
              </div>
              <div class="line">
                <span class="left_tit">累计已领取</span>
                <span class="right_num">{{ pointsPool.pointsIssued || 0 }}</span>
              </div>
              <div class="line">
                <span class="left_tit">未领取</span>
                <span class="right_num">{{ pointsPool.pointsNotIssued || 0 }}</span>
              </div>
              <div class="line">
                <span class="left_tit">复购发放</span>
                <span class="right_num">{{ pointsPool.repurchase || 0 }}</span>
              </div>
              <div class="line">
                <span class="left_tit">升级发放</span>
                <span class="right_num">{{ pointsPool.upgradeBuy || 0 }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :lg="12">
        <first-title title="订单量可视化对比" size="normal" />
        <div class="chart-wrapper" style="margin: 20px 0;">
          <pie-chart v-if="modeOrderQuantity.length > 0" :chart-data="orderChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <first-title title="会员可视化对比" size="normal" />
        <div class="chart-wrapper" style="margin: 20px 0;">
          <pie-chart v-if="member.length > 0" :chart-data="memberChartData" />
        </div>
      </el-col>
    </el-row>

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row> -->

  </div>
</template>

<script>
// import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
import { modeOrderPayMoneyFn, modeOrderQuantityFn, memberFn, pointsPoolFn } from '@/api/statistics.js'
import PieChart from './components/PieChart'

export default {
  name: 'Statistics',
  components: {
    PieChart
  },
  data() {
    return {
      types: {
        '1': '拼团',
        '2': '参团',
        '3': '优选',
        '4': '兑换'
      },
      modeOrderQuantity: [],
      modeOrderPayMoney: [],
      member: [],
      pointsPool: {}
    }
  },
  computed: {
    levelList() {
      return this.$store.state.member.levelList
    },
    levelName() {
      const levelName = {}
      this.levelList.forEach((item) => {
        levelName['leve_' + item.id] = item.name
      })
      return levelName
    },
    orderChartData() {
      const arr = []
      this.modeOrderQuantity.forEach((item, index) => {
        arr[index] = {}
        arr[index].name = this.types[item.type]
        arr[index].value = item.quantity
      })
      console.log(arr)
      return arr
    },
    memberChartData() {
      const arr = []
      this.member.forEach((item, index) => {
        arr[index] = {}
        arr[index].name = this.levelName['leve_' + item.level]
        arr[index].value = item.memberQuantity
      })
      console.log(arr)
      return arr
    }
  },
  created() {
    if (this.levelList.length == 0) {
      this.$store.dispatch('member/actionLevelListFn').then(() => {
        console.log(this.levelList)
        console.log(this.levelName)
      })
    }
    this.modeOrderQuantityFn()
    this.modeOrderPayMoneyFn()
    this.memberFn()
    this.pointsPoolFn()
  },
  methods: {
    modeOrderQuantityFn() {
      modeOrderQuantityFn().then((data) => {
        const resData = this.resDataFn(data)
        if (resData) {
          console.log(resData)
          this.modeOrderQuantity.splice(0, this.modeOrderQuantity.length, ...resData)
        }
      })
    },
    modeOrderPayMoneyFn() {
      modeOrderPayMoneyFn().then((data) => {
        const resData = this.resDataFn(data)
        if (resData) {
          console.log(resData)
          this.modeOrderPayMoney.splice(0, this.modeOrderPayMoney.length, ...resData)
        }
      })
    },
    memberFn() {
      memberFn().then((data) => {
        const resData = this.resDataFn(data)
        if (resData) {
          console.log(resData)
          this.member.splice(0, this.member.length, ...resData)
        }
      })
    },
    pointsPoolFn() {
      pointsPoolFn().then((data) => {
        const resData = this.resDataFn(data)
        if (resData) {
          console.log(resData)
          this.pointsPool = Object.assign({}, this.pointsPool, resData)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px 24px;
  .row_div{
    padding: 20px 0;
    .tit{
      font-weight: bold;
    }
    .icon{
      font-size: 20px;
      margin-right: 7px;
      vertical-align: -5%;
    }
    .item_content{
      height: 210px;
      padding: 0 20px;
      overflow-y: auto;
      .line{
        overflow: hidden;
        height: auto;
        padding: 7px 0;
        color: #666;
        line-height: 26px;
        .left_tit{
          font-size: 16px;
          float: left;
        }
        .right_num{
          font-size: 24px;
          float: right;
          font-weight: bold;
          span{
            font-size: 18px;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
