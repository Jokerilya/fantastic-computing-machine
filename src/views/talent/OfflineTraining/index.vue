<template>
  <div class="content_box">
    <first-title title="线下培训管理" />
    <div class="select_view flex just-end">
      <router-link
        :to="{
          name: 'offlinetrainingDetail',
          query: {
            offlineId: 0,
          },
        }"
      >
        <el-button type="primary"><i class="el-icon-plus" />添加培训</el-button>
      </router-link>
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
      :header-cell-style="{ color: '#666' }"
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
        width="250"
        label="标题"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="封面图片"
        width="110"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.coverImage"
            fit="cover"
            :preview-src-list="[scope.row.coverImage]"
          />
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="电话"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        label="邮箱"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        label="地址"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="地理经度"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.longitude }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="地理纬度"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="180"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <!-- <el-link style="margin-right: 10px" :href="`#/product/product-detail?id=${scope.row.id}&pageNo=${dataConfig.pageNo}&pageSize=${dataConfig.pageSize}`" >
				<el-button type="primary" size="small">编辑</el-button>
          </el-link> -->
          <router-link
            style="margin-right: 10px"
            :to="{
              name: 'offlinetrainingDetail',
              query: {
                offlineId: scope.row.id,
              },
            }"
          >
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="el_pagination">
      <el-pagination
        background
        layout="prev, pager, next,total,sizes"
        :current-page="dataConfig.pageNo"
        :total="dataConfig.total"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="dataConfig.pageSize"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { getqueryOfflineTrainingList } from "@/api/talent";
export default {
  name: "",
  data() {
    return {
      dataList: [],
      dataConfig: {
        id: 0,
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
    getDataListFn() {
      getqueryOfflineTrainingList({
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
