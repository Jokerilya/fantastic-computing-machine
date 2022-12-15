<template>
  <div class="equipmentDetails">
    <!-- 设备基本信息内容 -->
    <div class="equipmentDetails_basicInfo" v-if="equipmentDetails">
      <h2 class="basicInfo_title">设备基本信息</h2>
      <el-card>
        <div class="basicInfo_content">
          <div class="itemLine">
            <div class="item">
              <span class="item_title">贴片编码</span
              ><span>{{ equipmentDetails.no }}</span>
            </div>
            <div class="item">
              <span class="item_title">保养周期</span>
              <span>{{ equipmentDetails.cycle ? "" : "保密" }}</span>
            </div>
            <div class="item">
              <span class="item_title">出厂时间</span>
              <span>{{ changeTimeFn(equipmentDetails.factoryTime) }}</span>
            </div>
          </div>
          <div class="itemLine">
            <div class="item">
              <span class="item_title">设备类型</span
              ><span>{{ equipmentDetails.deviceTypeName }}</span>
            </div>
            <div class="item">
              <span class="item_title">设备品牌</span
              ><span>{{ equipmentDetails.deviceBrand }}</span>
            </div>
            <div class="item">
              <span class="item_title">设备型号</span
              ><span>{{ equipmentDetails.deviceModel }}</span>
            </div>
          </div>
          <div class="itemLine">
            <div class="item">
              <span class="item_title">设备轴数</span><span>保密</span>
            </div>
            <div class="item">
              <span class="item_title">设备系统</span
              ><span>{{ equipmentDetails.deviceSystemName }}</span>
            </div>
            <div class="item">
              <span class="item_title">设备产地</span
              ><span>{{ equipmentDetails.devicePlace }}</span>
            </div>
          </div>
          <div class="itemLine">
            <div class="item">
              <span class="item_title">维保时间</span
              ><span
                >{{ changeTimeFn(equipmentDetails.startTime) }}
                {{ changeTimeFn(equipmentDetails.endTime) }}</span
              >
            </div>
            <div class="item">
              <span class="item_title">价格</span
              ><span>{{ equipmentDetails.price }}.00</span>
            </div>
          </div>
          <div class="itemLine">
            <div class="item">
              <span class="item_title">企业设备编码</span
              ><span>{{ equipmentDetails.enterpriseDeviceNo }}</span>
            </div>
            <div class="item">
              <span class="item_title">企业设备位置</span
              ><span>{{ equipmentDetails.enterpriseDevicePosition }}</span>
            </div>
          </div>
          <div class="itemLine" v-if="equipmentDetails.nameplateImg">
            <div class="item">
              <span class="item_title">铭牌图片</span
              ><span>
                <img :src="equipmentDetails.nameplateImg" alt="" />
              </span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 设备配置信息内容 -->
    <div class="equipmentDetails_configInfo">
      <h2 class="configInfo_title">设备基本信息</h2>
      <el-card>
        <!-- 放配件表格 -->
        <el-table
          :data="partsList"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column label="编号">
            <template slot-scope="scope">{{ scope.$index + 1 }} </template>
          </el-table-column>
          <el-table-column prop="category" label="项目大类"></el-table-column>
          <el-table-column prop="name" label="项目名称"> </el-table-column>
          <el-table-column prop="deviceBrand" label="品牌"> </el-table-column>
          <el-table-column prop="deviceModel" label="型号"> </el-table-column>
          <el-table-column label="单位">mm</el-table-column>
          <el-table-column porp="specification" label="规格"> </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div>
      <el-card>
        <el-button @click="vipBtnFn" :type="activeBtn === 0 ? 'primary' : ''"
          >年保记录</el-button
        >
        <el-button
          @click="ordinaryBtnFn"
          :type="activeBtn === 1 ? 'primary' : ''"
          style="margin-bottom: 20px;"
          >工单记录</el-button
        >
        <!-- 年保记录 -->
        <el-table
          v-show="activeBtn === 0"
          :data="butlerList"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column prop="orderSn" label="订单号"> </el-table-column>
          <el-table-column prop="status" label="订单状态">
            <template slot-scope="{ row }">
              <div v-if="row.status === 1" style="color:green">生效中</div>
              <div v-if="row.status === 2" style="color:red">已过期</div>
            </template>
          </el-table-column>
          <el-table-column prop="contactsPeople" label="客户负责人">
          </el-table-column>
          <el-table-column prop="contactsPhone" label="客户电话">
          </el-table-column>
          <el-table-column prop="salesman" label="跟单业务员">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <a style="color:#2e4c9e" @click.prevent="goDetailsVip(row.id)"
                >详情</a
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 工单记录 -->
        <el-table
          v-show="activeBtn === 1"
          :data="repairList"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
        >
          <el-table-column prop="orderSn" label="订单号" width="150">
          </el-table-column>
          <el-table-column prop="orderStatusName " label="订单状态" width="150">
            <template slot-scope="{ row }">
              {{ row.orderStatusName }}
            </template>
          </el-table-column>
          <el-table-column prop="contactsPeople" label="客户负责人" width="150">
          </el-table-column>
          <el-table-column prop="contactsPhone" label="客户电话" width="150">
          </el-table-column>
          <el-table-column prop="masterPhone" label="师傅名称" width="150">
          </el-table-column>
          <el-table-column
            prop="masterRealName"
            label="师傅联系电话"
            width="150"
          >
          </el-table-column>
          <el-table-column prop="type" label="故障类型" width="150">
            <template slot-scope="{ row }">
              <div v-if="row.type">
                <div v-if="row.type.includes(1)">电气故障</div>
                <div v-if="row.type.includes(2)">机械故障</div>
                <div v-if="row.type.includes(3)">系统故障</div>
                <div v-if="row.type.includes(4)">其他故障</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="simpleDesc" label="故障描述" width="150">
          </el-table-column>
          <el-table-column prop="createTime" label="下单时间" width="150">
          </el-table-column>
          <el-table-column prop="totalAmount" label="总费用" width="150">
            <template slot-scope="{ row }">
              {{ row.totalAmount }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="{ row }">
              <a
                href="#"
                style="color:#2e4c9e"
                @click.prevent="goDetailsOrdinary(row.orderSn)"
                >详情</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEquipmentDetails } from "@/api/equipmentManagement";

export default {
  data() {
    return {
      activeBtn: 0, // 按钮选中的样式
      id: "",
      equipmentDetails: null,
      partsList: null, //配件列表
      butlerList: null, //年保记录
      repairList: null, //工单记录
    };
  },
  methods: {
    // 点击工单记录的详情跳转
    goDetailsOrdinary(orderSn) {
      this.$router.push({
        name: "maintenance_order_desc",
        query: { orderSn },
      });
    },
    // 点击年保记录的详情跳转
    goDetailsVip(id) {
      this.$router.push({
        name: "customerDetail",
        query: { id },
      });
    },
    // 改变时间格式
    changeTimeFn(time) {
      return time.slice(0, 10);
    },
    //点击工单记录触发的事件
    ordinaryBtnFn() {
      this.activeBtn = 1;
    },
    // 点击年保记录触发的事件
    vipBtnFn() {
      this.activeBtn = 0;
    },
  },
  async created() {
    this.id = this.$route.query.id;
    const res = await getEquipmentDetails({ id: this.id });
    console.log(res.data);
    this.equipmentDetails = res.data;
    this.partsList = res.data.partsList;
    this.butlerList = res.data.butlerList;
    this.repairList = res.data.repairList;
  },
};
</script>

<style lang="less" scoped>
// 设备基本信息内容
.equipmentDetails {
  padding: 20px;
  .equipmentDetails_basicInfo {
    .basicInfo_title {
      color: #0b2059;
      margin: 0 0 20px 30px;
    }
    .basicInfo_content {
      padding: 0 0 0 20px;
      .itemLine {
        height: 45px;
        display: flex;

        .item {
          width: 33%;
          display: flex;
          align-items: center;
          color: #707070;
          font-size: 15px;
          span {
            flex: 5;
          }
          .item_title {
            flex: 3;
            font-size: 20px;
            font-weight: 700;
          }
        }
      }
    }
  }
}

// 设备配置信息内容
.equipmentDetails_configInfo {
  margin-bottom: 20px;
  .configInfo_title {
    color: #0b2059;
    margin: 20px 30px;
  }
}
</style>
