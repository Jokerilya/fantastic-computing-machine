<template>
  <div class="content_box">
    <first-title title="人才精英管理" />
    <div class="select_view flex just-end">
      <router-link
        :to="{
          name: 'personInfoDetail',
          query: {
            personId: 0,
          },
        }"
      >
        <el-button type="primary"><i class="el-icon-plus" />添加精英</el-button>
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
        label="精英名称"
        width="200"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="精英图片"
        width="110"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.headUrl"
            fit="cover"
            :preview-src-list="[scope.row.headUrl]"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="年龄"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="学历"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.education }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="电话"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="工作时间"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.workTime }}年</span>
        </template>
      </el-table-column>
      <el-table-column
        label="个人简介"
        align="center"
        header-align="center"
        width="300px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.summary }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="擅长"
        align="center"
        header-align="center"
        width="200px"
      >
        <template slot-scope="scope">
          <div class="flex flex-d">
            <span v-for="(item, i) in scope.row.lableList" :key="i">{{
              item
            }}</span>
          </div>
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
              name: 'personInfoDetail',
              query: {
                personId: scope.row.id,
              },
            }"
          >
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <el-button size="small" type="danger" @click="delpersonfunc(scope)">删除</el-button>
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
import { getqueryPersonnelList,deletePersonnelInfo } from "@/api/talent";
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
      getqueryPersonnelList({
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
    //删除
    delpersonfunc(scope) {
      this.deleteAlert()
        .then(() => {
          const res = deletePersonnelInfo(scope.row.id);
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
