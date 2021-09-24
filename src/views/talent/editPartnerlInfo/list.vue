<template>
  <div class="content_box">
    <first-title title="学院/企业管理" />
    <div class="select_view flex just-end">
      <router-link
        :to="{
          name: 'editPartnerlDetail',
          query: {
            parentId: 0,
          },
        }"
      >
        <el-button type="primary"
          ><i class="el-icon-plus" />添加学院/企业</el-button
        >
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
        label="学院/企业名称"
        fixed
        width="250"
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
        label="观看次数"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.watchedNum }}</span>
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
              name: 'editPartnerlDetail',
              query: {
                parentId: scope.row.id,
              },
            }"
          >
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <el-button size="small" type="danger" @click="delparentfunc(scope)"
            >删除</el-button
          >
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
import { getqueryPartnerlList, deletePartnerlInfo } from "@/api/talent";
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
      getqueryPartnerlList({
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
    //删除学院/企业
    delparentfunc(scope) {
      this.deleteAlert()
        .then(() => {
          const res = deletePartnerlInfo(scope.row.id);
          return res;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.$message.success('删除成功！')
            this.dataList.splice(scope.$index, 1);
          }
        });
    },
  },
};
</script>

<style lang="scss">
</style>
