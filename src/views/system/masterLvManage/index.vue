<template>
  <!-- 师傅登记管理 -->
  <div class="masterLvManage">
    <first-title title="师傅等级管理" />
    <div class="masterLvManage_table">
      <el-card>
        <el-table
          border
          style="width: 100%"
          :data="masterLevelList"
          :span-method="objectSpanMethod"
        >
          <el-table-column
            prop="name"
            label="等级名称"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column prop="value" label="积分" align="center" width="120">
          </el-table-column>
          <el-table-column label="定位" align="center" width="180">
            <template slot-scope="{ row }">
              {{ locationList[row.id - 1] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="orderSn"
            label="晋升\降级机制"
            align="center"
            width="200"
          >
            <template>
              {{ illustrate }}
            </template>
          </el-table-column>
          <el-table-column label="平台权益" align="center">
            <template slot-scope="{ row }">
              <div
                v-for="(item, index) in row.welfareItemVoList"
                :key="item.title"
              >
                {{ index + 1 }}.{{ item.title }}:{{ item.simpleDesc }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="平台资质要求" align="center">
            <template slot-scope="{ row }">
              {{ aptitudeList[row.id - 1] }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { queryMasterLevelList } from "@/api/order.js";
export default {
  data() {
    return {
      masterLevelList: [],
      illustrate:
        "(1)积分≤当前层级的:平台作出提醒警示。且给与工程师30天时间进行补救且若积分仍≤当前层级,平台将根据实际积分层级进行调整，工程师新的业务收益根据层级变化后进行相应调整。(2)积分≥当前层级的：平台次日将给与晋升为下一层级功工程师，新的业务收益根据层级变化后进行相应调整。(3)积分>S层级积分的,可通过平台积分置换功能获取相应增益服务。(4)积分≤80分的:平台给与工程师10天期间调整,若积分仍≤80分的将自动除名,工程师3个月内不得再申请入驻。",
      welfareList: [
        "工程师:(1)A3抢单资源权益;(2)推荐政策权益;用户:(1)推荐政策权益;(2)积分换购礼品权益;",
        "(1)A2抢单资源权益;(2)推荐政策权益;(3)A2平台优先派单资源;(4)层级溢价结算权益;",
        "(1)A1抢单资源权益;(2)推荐政策权益;(3)A1优先派单资源;(4)层级溢价结算权益;(5)A1补贴政策权益;(6)优先结款权益;",
        "(1)A1抢单资源权益;(2)推荐政策权益;(3)A1优先派单资源;(4)层级溢价结算权益;(5)A1补贴政策权益;(6)优先结款权益;",
        "(1)A1抢单资源权益;(2)推荐政策权益;(3)A1优先派单资源;(4)层级溢价结算权益;(5)S1补贴政策权益;(6)区域独享扶持政策;(7)优先结款权益;",
      ],
      locationList: [
        "储备工程师/入驻用户",
        "一级工程师",
        "二级工程师",
        "三级工程师",
        "四级/团级工程师",
      ],
      aptitudeList: [
        "①通过平台身份认证；②通过平台操作培训、考核；",
        "①通过平台身份认证；②通过平台操作培训、考核；③通过平台业务拓展培训、考核；④签订并履行平台服务体系标准及遵守规则；",
        "①通过平台身份认证；②通过平台操作培训、考核；③通过平台业务拓展培训、考核；④签订并履行平台服务体系标准及遵守规则；",
        "①通过平台身份认证；②通过平台操作培训、考核；③通过平台业务拓展培训、考核；④签订并履行平台服务体系标准及遵守规则；",
        "①通过平台身份认证；②通过平台操作培训、考核；③通过平台业务拓展培训、考核；④签订并履行平台服务体系标准及遵守规则；⑤签订并履行团级管理风险责任书及遵守团级工程师平台规则；",
      ],
    };
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        if (rowIndex % 5 === 0) {
          return {
            rowspan: 5,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    async queryMasterLevelList() {
      const res = await queryMasterLevelList();
      this.masterLevelList = res.data;
    },
  },
  created() {
    this.queryMasterLevelList();
  },
};
</script>

<style lang="less" scoped>
.masterLvManage {
  padding: 20px;
}
</style>
