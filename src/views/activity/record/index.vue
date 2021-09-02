<template>
  <div class="content_box">
    <first-title title="奖品列表" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.nickName"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户昵称"
      />
      <el-select
        v-model="queryData.type"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择奖品类型"
      >
        <el-option
          v-for="item in types"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="ID"
        fixed
        width="60"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抽取时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖励名称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖励类型" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | resType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型值" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品图片" align="center" header-align="center">
        <template slot-scope="scope">
          <span class="prize_img"><img :src="scope.row.url" alt="" /></span>
        </template>
      </el-table-column>
      <el-table-column label="消耗积分" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usePoint }}</span>
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
import { queryLuckDrawRecordFn } from "@/api/activity";
export default {
  name: "Luck",
  filters: {
    resType(val) {
      if (val == 1) return "商品";
      if (val == 2) return "优惠券";
      if (val == 3) return "积分";
      if (val == 4) return "未获奖";
    },
  },
  data() {
    return {
      dataList: [],
      types: [
        { name: "商品", val: 1 },
        { name: "优惠券", val: 2 },
        { name: "积分", val: 3 },
        { name: "未获奖", val: 4 },
      ],
      queryData: {
        nickName: "",
        type: "",
      },
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
    };
  },
  beforeMount() {
    this.getDataListFn();
  },
  methods: {
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData = {
        nickName: "",
        type: "",
      };
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
    getDataListFn() {
      queryLuckDrawRecordFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        nickName: this.queryData.nickName,
        type: this.queryData.type,
      }).then((res) => {
        const resData = this.resDataFn(res);
        resData.records.forEach((item) => {
          item.status = item.status == 1;
        });
        this.dataConfig.total = resData.total;
        this.dataList.splice(0, this.dataList.length, ...resData.records);
      });
    },
  },
};
</script>

<style lang="scss">
.prize_img {
  display: inline-block;
  width: 60px;
  height: 60px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
