<template>
  <div class="content_box">
    <first-title title="商品橱窗管理" />
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
          <span v-if="scope.row.id">{{ scope.row.id }}</span>
          <i
            v-if="!scope.row.id"
            class="el-icon-delete el_delete"
            @click="deleteAddItemFn(scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="橱窗名称" header-align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="请输入内容" />
        </template>
      </el-table-column>
      <el-table-column label="简介" header-align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.descVal"
            type="textare"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column label="橱窗位置" align="center" header-align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" placeholder="请选择橱窗位置">
            <el-option
              v-for="item in dataTypes"
              :key="item.val"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
        label="橱窗商品"
        align="center"
        header-align="center"
        width="240"
      >
        <template slot-scope="scope">
          <el-select
            filterable
            multiple
            collapse-tags
            v-model="scope.row.productIds"
            placeholder="请选择橱窗商品"
          >
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="是否显示" align="center" header-align="center">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.isShow"
            @change="statusChangeFn(scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column label="发布时间" header-align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="240"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editItemFn(scope.row)"
            >提交编辑</el-button
          >
          <el-button
            v-if="scope.row.id"
            type="danger"
            size="small"
            @click="deleteItemFn(scope.row)"
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
        :page-sizes="[20, 30, 40, 50]"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import {
  queryProductCupboardFn,
  editProductCupboardFn,
  productCupboardShowFn,
  queryProductFn,
} from "@/api/product";
import uploadImg from "@/components/uploadImg/upload-img.vue";
export default {
  name: "GoodsClass",
  components: {
    uploadImg,
  },
  data() {
    return {
      dataList: [],
      dataTypes: [
        {
          name: "VIP产品",
          val: 1,
        },
        {
          name: "热门商品",
          val: 2,
        },
        {
          name: "合伙人商品",
          val: 3,
        },
      ],
      productList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
    };
  },
  beforeMount() {
    this.queryProductCupboardFn();
    this.getProductListFn();
  },
  methods: {
    getProductListFn() {
      queryProductFn({
        pageNo: 1,
        pageSize: 1000,
        isShelves: 1,
        title: "",
      }).then((res) => {
        const resData = this.resDataFn(res);
        for (let item of resData.records) {
          item.id = item.id.toString();
        }
        this.productList.splice(0, this.productList.length, ...resData.records);
      });
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.queryProductCupboardFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.queryProductCupboardFn();
    },
    async statusChangeFn(id) {
      await productCupboardShowFn({
        id: id,
      }).then((res) => {
        if (res.code == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
        }
      });
      this.queryProductCupboardFn();
    },
    editItemFn(itemData) {
      this.dataConfig.loading = true;
      editProductCupboardFn({
        id: itemData.id,
        name: itemData.name,
        descVal: itemData.descVal,
        productIds: itemData.productIds.toString(),
      })
        .then((res) => {
          this.dataConfig.loading = false;
          const resData = this.resDataFn(res);
          if (resData === "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.queryProductCupboardFn();
          }
        })
        .catch(() => {
          this.dataConfig.loading = false;
        });
    },
    queryProductCupboardFn() {
      queryProductCupboardFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      }).then((res) => {
        const resData = this.resDataFn(res);
        for (let item of resData.records) {
          item.productIds = item.productIds.split(",");
        }
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
      });
    },
  },
};
</script>

<style>
</style>
