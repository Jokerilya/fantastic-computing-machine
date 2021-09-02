<template>
  <div class="content_box">
    <first-title title="账目列表" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.phone"
        style="width: 160px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户手机账号"
      />
      <el-input
        v-model="queryData.nickName"
        style="width: 160px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户昵称"
      />
      <el-input
        v-model="queryData.orderSn"
        style="width: 160px"
        class="mg_r15 mg_t10"
        placeholder="请输入订单号"
      />
      <el-select
        v-model="queryData.levelId"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择用户等级"
        clearable
      >
        <el-option
          v-for="item in levelList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
	  <el-date-picker
	    v-model="queryData.startTime"
	    class="mg_r15 mg_t10"
	    type="date"
		value-format="yyyy-MM-dd"
	    placeholder="选择开始日期">
	  </el-date-picker>
	  <el-date-picker
	    v-model="queryData.endTime"
	    class="mg_r15 mg_t10"
	    type="date"
		value-format="yyyy-MM-dd"
	    placeholder="选择结束日期">
	  </el-date-picker>
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
      <el-button class="mg_t10" type="primary" @click="exportExlFn"
        >记录导出</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="UID"
        width="140"
        align="center"
        header-align="center"
        fixed
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单号"
        width="150"
        align="center"
        header-align="center"
        fixed
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orderSn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户昵称"
        width="140"
        align="center"
        header-align="center"
        fixed
      >
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户手机号"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易单号"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.payCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易方式"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.payType === 2 ? "微信" : "余额" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="支付金额"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.payAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="会员等级"
        align="center"
        header-align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.levelName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="否是店主"
        align="center"
        header-align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.isShop === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="否是合伙人"
        align="center"
        header-align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.isPartner === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推荐人UID"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.invitationUid }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推荐人昵称"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.parentName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推荐人手机号"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.parentPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="拨出业绩奖励"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.achievementMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拨出平级奖励"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.levelMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拨出超越奖励"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.transcendMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拨出区域奖励"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.areaMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拨出补货奖励"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.replenishMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拨出分享奖励"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.shareMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拨出股权"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.thighMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="支付时间"
        width="180"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.payTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="el_pagination">
      <el-pagination
        background
        layout="prev, pager, next,total,sizes"
        :current-page="dataConfig.pageNo"
        :total="dataConfig.total"
        :page-sizes="[20, 30, 40, 50]"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import { queryPayFn, queryLevelInfoFn, payExportFn } from "@/api/user.js";
export default {
  name: "BillList",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      levelList: [],
      queryData: {
        levelId: "",
        orderSn: "",
        phone: "", // 1 2
        nickName: "", // 1 2 3
        moneyType: "",
      },
    };
  },
  beforeMount() {
    this.getDataListFn();
    queryLevelInfoFn({
      pageNo: 1,
      pageSize: -1,
    }).then((res) => {
      const resData = this.resDataFn(res);
      this.levelList = resData.records;
    });
  },
  methods: {
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData.phone = "";
      this.queryData.nickName = "";
      this.queryData.orderSn = "";
      this.queryData.levelId = "";
	  this.queryData.startTime="";
	  this.queryData.endTime="";
      this.getDataListFn();
    },
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.getDataListFn();
    },
    exportExlFn() {
      payExportFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: -1,
        nickName: this.queryData.nickName || undefined,
        phone: this.queryData.phone || undefined,
        levelId: this.queryData.levelId || undefined,
        orderSn: this.queryData.orderSn || undefined,
		startTime:this.queryData.startTime,
		endTime:this.queryData.endTime,
      }).then((res) => {
        this.exportData(res, "账目列表导出数据" + parseTime(new Date()));
      });
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    getDataListFn() {
      this.dataConfig.loading = true;
      queryPayFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        nickName: this.queryData.nickName || undefined,
        phone: this.queryData.phone || undefined,
        levelId: this.queryData.levelId || undefined,
        orderSn: this.queryData.orderSn || undefined,
		startTime:this.queryData.startTime,
		endTime:this.queryData.endTime,
      }).then((res) => {
        const resData = this.resDataFn(res);
        for (let item of resData.records) {
          for (let l of this.levelList) {
            if (item.levelId === l.id) {
              item.levelName = l.name;
            }
          }
        }
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
      });
    },
  },
};
</script>

<style lang="scss">
</style>
