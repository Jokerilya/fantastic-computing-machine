<template>
  <div class="content_box">
    <first-title title="更换商品" />
    <div class="select_view">
      <el-cascader
        v-if="typeID !== 1"
        style="width: 300px"
        v-model="querydata.categoryId"
        class="mg_r15 mg_t10"
        placeholder="请选择商品分类"
        expand-trigger="hover"
        :props="categoryList"
        :show-all-levels="false"
      />
      <el-button
        v-if="typeID !== 1"
        class="mg_r15 mg_t10"
        type="primary"
        @click="queryDataListFn"
        >查询</el-button
      >
      <span class="mg_t10"
        >已选择商品ID:{{ selectarr.length === 0 ? "" : selectarr }}</span
      >
    </div>
    <div class="select_view">
      <el-table
        ref="table"
        border
        :data="dataList"
        @select="selectionRow"
        @select-all="handleselectAll"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          label="ID"
          width="60px"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          align="center"
          min-width="350px"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{ typeID == 1 ? scope.row.name : scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="typeID!==1"
          label="商品图"
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
          label="商品原价"
          align="center"
          width="350px"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.originalPrice || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商品价格"
          align="center"
          width="350px"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="el_pagination">
        <el-pagination
          v-if="typeID!==1"
          background
          layout="prev, pager, next,total,sizes"
          :current-page="dataConfig.pageNo"
          :total="dataConfig.total"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="dataConfig.pageSize"
          @current-change="currentChangeFn"
          @size-change="handleSizeChange"
        />
      </div>
      <el-button class="" type="primary" @click="submitFn">确定</el-button>
    </div>
  </div>
</template>

<script>
import { queryInstallListFn } from "@/api/install";
import {
  queryProductFn,
  queryProductCategoryFn,
  updateRecommendProduct,
} from "@/api/product";
export default {
  name: "",
  data() {
    return {
      typeID: -1,
      realselectarr: [],
      selectarr: [],
      productIds: [],
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        loading: true,
      },
      querydata: {
        categoryId: "", //商品分类id
      },
      categoryList: {
        lazy: true,
        checkStrictly: false,
        lazyLoad(node, resolve) {
          queryProductCategoryFn({
            pid: node.value || 0,
          }).then((res) => {
            const resData = res.data;
            const nodes = resData.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          });
        },
      },
    };
  },
  beforeMount() {},
  mounted() {
    this.typeID = Number(this.$route.query.typeID);
    if (this.typeID === 1) {
      this.getinstallproductList();
    }
  },
  computed: {
    realcategoryId() {
      if (!this.querydata.categoryId) return false;
      return this.querydata.categoryId.pop();
    },
  },
  watch: {},
  methods: {
    //获取商品
    getDataListFn() {
      if (!this.querydata.categoryId && this.typeID === 1)
        return this.$message.error("请选择商品分类");
      queryProductFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        categoryId: this.realcategoryId,
        isShelves: "",
        title: "",
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataConfig.total = resData.total;
        resData.records.forEach((item) => {
          item.isShelves = item.isShelves == 1;
          let isselect = this.selectarr.indexOf(item.id) !== -1;
          if (isselect) {
            this.openselction(item);
          }
        });
        this.dataList.splice(0, this.dataList.length, ...resData.records);
      });
    },
    //获取装机商品
    getinstallproductList() {
      queryInstallListFn({
        name: "",
        pageNo: 1,
        pageSize: 9999,
        queryTime: "",
      }).then((ele) => {
        this.dataList = ele.data.records;
      });
    },
    //查询商品
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 10,
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
    //判断是否选中
    openselction(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    //表格单行点击
    selectionRow(selection, row) {
      if (this.selectarr.length === 2)
        return this.$message.error("最多选择两个");
      let selected = selection.length && selection.indexOf(row) !== -1; //为true时选中，为 0 时（false）未选中
      if (selected) {
        this.selectarr.push(row.id);
      } else {
        let ind = this.selectarr.indexOf(row.id);
        if (ind > -1) {
          this.selectarr.splice(ind, 1);
        }
      }
    },
    handleselectAll() {
      this.$message.error("最多选择两个");
      this.$refs.table.clearSelection();
    },
    //提交
    submitFn() {
      if (this.selectarr.length === 0) return this.$message.error("请选择商品");
      if (this.selectarr.length === 1)
        return this.$message.error("至少选择两个商品");
      updateRecommendProduct({
        id: Number(this.$route.query.typeID),
        productIds: this.selectarr.join(","),
      }).then((res) => {
        if (res.code === "000") {
          this.$message.success("提交成功");
          setTimeout(() => {
            this.$router.push({ name: "weixinindexproducttuijianList" });
          }, 750);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.content-view {
  padding: 20px;
  background: #fff;
}
</style>
