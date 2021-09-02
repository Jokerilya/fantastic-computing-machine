<template>
  <div class="content_box">
    <first-title title="团队列表" />
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column label="头像" align="center" header-align="center">
        <template slot-scope="scope">
          <el-image
            class="head_url"
            :src="scope.row.portrait"
            :preview-src-list="[scope.row.portrait]"
          />
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否店主" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isShop === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="是否合伙人" align="center" header-align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.isPartner === 1 ? "是" : "否" }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="会员等级" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.levelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理身份" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.agentId === 1
              ? "省代理"
              : scope.row.agentId === 2
              ? "区代理"
              : scope.row.agentId === 3
              ? "市代理"
              : "未成为代理"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入团时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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
import { queryTeamFn } from "@/api/user.js";
export default {
  name: "DetailedList",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      queryData: {
        uid: "", // 1 2 3
      },
    };
  },
  beforeMount() {
    this.queryData.uid = this.$route.query.id;
    this.getDataListFn();
  },
  methods: {
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
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
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    getDataListFn() {
      if (!this.queryData.uid) return;
      this.dataConfig.loading = true;
      queryTeamFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        uid: this.queryData.uid,
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
      });
    },
  },
};
</script>


<style lang="scss">
.head_url {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  overflow: hidden;
  display: inline-block;
}
</style>
