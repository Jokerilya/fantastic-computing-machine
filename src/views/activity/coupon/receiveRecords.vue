<template>
  <div class="content_box">
    <first-title title="优惠券领取记录" />
    <div class="select_view flexBox">
      <div>
        <el-select
          style="width: 200px; margin-right: 15px"
          v-model="receiveRecordsParams.couponId"
          placeholder="请选择优惠券名称"
        >
          <el-option
            v-for="item in allCouponList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <el-select
          style="width: 200px; margin-right: 15px"
          v-model="receiveRecordsParams.useStatus"
          placeholder="请选择使用状态"
        >
          <el-option
            v-for="item in useStatuList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-select
          style="width: 200px; margin-right: 15px"
          v-model="receiveRecordsParams.uid"
          filterable
          remote
          @change="queryOwnedCouponsList"
          :remote-method="queryUserInfoFn"
          placeholder="请输入用户手机号码"
        >
          <el-option
            v-for="item in personalOptions"
            :key="item.uid"
            :label="item.nickName"
            :value="item.uid"
          >
          </el-option>
        </el-select>

        <el-select
          style="width: 200px; margin-right: 15px"
          v-model="receiveRecordsParams.enterpriseId"
          filterable
          remote
          @change="queryOwnedCouponsList"
          :remote-method="queryEnterpriseName"
          placeholder="请输入企业名称"
        >
          <el-option
            v-for="item in enterpriseOptions"
            :key="item.id"
            :label="item.enterpriseName"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <el-input
          style="width: 200px"
          placeholder="请输入使用订单号"
          v-model="receiveRecordsParams.targetOrderSn"
        >
        </el-input>
      </div>
      <div>
        <el-button class="mg_t10" type="primary" @click="resetFn"
          >重置</el-button
        >
        <el-button class="mg_t10" type="primary" @click="receiveRecordsList"
          >查询</el-button
        >
      </div>
    </div>
    <el-table border :data="receiveRecords">
      <el-table-column label="编号" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.couponCode }}
        </template>
      </el-table-column>
      <el-table-column label="发放类型" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.type == 0 ? "手动赠送" : "平台发放" }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="领取企业"
        align="center"
        header-align="center"
        width="200"
      >
        <template slot-scope="{ row }">
          <span>{{ row.enterpriseName ? row.enterpriseName : "/" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="领取用户"
        align="center"
        header-align="center"
        width="110px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.userName ? row.userName : "/" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="使用门槛"
        align="center"
        header-align="center"
        width="80px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.minPoint ? "￥" + row.minPoint : "无门槛" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="减免费用"
        align="center"
        header-align="center"
        width="80px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.offerAmount ? "￥" + row.offerAmount : "0" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="发放门槛" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.grantStandard ? "￥" + row.grantStandard : "无门槛"
          }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="总发行量" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.publishCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用数量" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.useCount ? row.useCount : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已领取数量" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.receiveCount ? row.receiveCount : 0 }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="有效时长" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.expiryTime ? row.expiryTime + "天" : "无" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="源订单号" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sourceOrderSn ? row.sourceOrderSn : "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用订单号" align="center" header-align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="queryOrderDesc(row)"
            v-if="row.targetOrderSn"
            >{{ row.targetOrderSn }}</el-button
          >
          <div v-else>未使用</div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        header-align="center"
        width="90px"
      >
        <template slot-scope="{ row }">
          <span v-if="row.useStatus == 0" style="color: red">未使用</span>
          <span v-else-if="row.useStatus == 1" style="color: green"
            >已使用</span
          >
          <span v-else>已过期</span>
        </template>
      </el-table-column>
      <el-table-column label="领取时间" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.endTime ? row.endTime : "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark ? row.remark : "无" }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="el_pagination" style="text-align: center">
      <el-pagination
        background
        layout="prev, pager, next , total"
        :total="receiveRecordsTotal"
        :page-size="receiveRecordsParams.pageSize"
        @current-change="currentChangeFn"
      />
    </div>
  </div>
</template>

<script>
import { queryUserInfoFn } from "@/api/user";
import { queryEnterpriseName } from "@/api/boss";
import { receiveRecords, queryCoupon } from "@/api/activity";
export default {
  data() {
    return {
      receiveRecords: [],
      receiveRecordsTotal: 0,
      receiveRecordsParams: {
        couponId: null,
        pageNo: 1,
        pageSize: 10,
        useStatus: null,
        uid: null,
        enterpriseId: null,
      },
      allCouponList: [],
      useStatuList: [
        {
          value: 0,
          label: "未使用",
        },
        {
          value: 1,
          label: "已使用",
        },
        {
          value: 2,
          label: "已过期",
        },
      ],
      personalOptions: [],
      enterpriseOptions: [],
    };
  },
  async created() {
    await this.queryAllCoupon();
    if (this.$route.params.id) {
      this.receiveRecordsParams.couponId = this.$route.params.id;
    }

    this.receiveRecordsList();
  },
  beforeMount() {},
  methods: {
    //  点击查看详情触发的事件
    queryOrderDesc(row) {
      const routeData = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn: row.targetOrderSn },
      });
      window.open(routeData.href, "_blank");
    },
    // 模糊查询企业
    async queryEnterpriseName(query) {
      if (query !== "") {
        const res = await queryEnterpriseName(query);
        if (res.code == "000") {
          this.enterpriseOptions = res.data;
        }
      } else {
        this.enterpriseOptions = [];
      }
    },
    // 确定查询已有优惠券
    async queryOwnedCouponsList(e) {
      if (typeof e === "number" && !isNaN(e)) {
        this.receiveRecordsParams.enterpriseId = e;
      } else {
        this.receiveRecordsParams.uid = e;
      }
    },
    // 获取用户列表
    async queryUserInfoFn(e) {
      const res = await queryUserInfoFn({
        phone: e,
        pageNo: 1,
        pageSize: 100,
      });
      if (res.code == "000") {
        this.personalOptions = res.data.records;
      }
    },
    // 重置领取列表
    resetFn() {
      this.receiveRecordsParams = {
        couponId: null,
        pageNo: 1,
        pageSize: 10,
        useStatus: null,
        uid: null,
        enterpriseId: null,
      };
      this.personalOptions = [];
      this.enterpriseOptions = [];
      this.receiveRecordsList();
    },
    // 查询所有优惠券
    async queryAllCoupon() {
      const res = await queryCoupon({
        pageNo: 1,
        pageSize: 100,
      });
      if (res.code == "000") {
        this.allCouponList = res.data.records;
      }
    },
    // 切换列表页码
    currentChangeFn(page) {
      this.receiveRecordsParams.pageNo = page;
      this.receiveRecordsList();
    },
    // 获取领取记录列表
    async receiveRecordsList() {
      const res = await receiveRecords(this.receiveRecordsParams);
      if (res.code == "000") {
        this.receiveRecords = res.data.records;
        this.receiveRecordsTotal = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.flexBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 10px;
}
</style>
