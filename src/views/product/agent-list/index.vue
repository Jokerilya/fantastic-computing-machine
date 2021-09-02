<template>
  <div class="content_box">
    <first-title title="代理商品管理" />
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
      <el-table-column
        label="商品标题"
        fixed
        width="160"
        align="left"
        header-align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="商品型号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mode }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="封面图片"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.images"
            fit="cover"
            :preview-src-list="[scope.row.coverImage]"
          />
        </template>
      </el-table-column>
      <el-table-column label="代理等级" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.level === 1
              ? "省"
              : scope.row.level === 2
              ? "市"
              : scope.row.level === 3
              ? "区"
              : "镇代"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="赠送招商库存"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赠送股权" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.thighAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="直推奖励" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareReward }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简推奖励" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.betweenReward }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        fixed="right"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? "正常" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-link
            style="margin-right: 10px"
            :href="`#/product/agent-detail?data=${JSON.stringify(
              scope.row
            )}&pageNo=${dataConfig.pageNo}&pageSize=${dataConfig.pageSize}`"
          >
            <el-button type="primary" size="small">编辑</el-button>
          </el-link>
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
        :page-size="dataConfig.pageSize"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { queryProductAgentFn } from "@/api/product";
export default {
  name: "ProductList",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
    };
  },
  beforeMount() {
    if (this.$route.query.pageNo) {
      this.dataConfig.pageNo = Number(this.$route.query.pageNo);
    }
    if (this.$route.query.pageSize) {
      this.dataConfig.pageSize = Number(this.$route.query.pageSize);
    }
    this.getDataListFn();
  },
  methods: {
    getDataListFn() {
      queryProductAgentFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataConfig.total = resData.total;
        this.dataList.splice(0, this.dataList.length, ...resData.records);
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
  },
};
</script>

<style lang="scss">
</style>
