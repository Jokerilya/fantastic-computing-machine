<template>
  <div class="content_box">
    <first-title title="职位类型列表" />
    <div class="select_view">
      <el-button
        type="primary"
        icon="el-icon-d-arrow-left"
        @click="backFcategoryFn"
        >返回一级分类</el-button
      >
      <el-button type="primary" icon="el-icon-plus" @click="addItemFn"
        >添加分类</el-button
      >
      <span class="mg_l15" style="color: #f56c6c"
        >注意：“修改”和“添加”数据项目后需要点击右侧“提交编辑”按钮才会生效哦</span
      >
    </div>
    <el-table
      :key="timeStamp"
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
        </template>
      </el-table-column>
      <el-table-column label="职位类型" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="请输入职位类型" />
        </template>
      </el-table-column>
      <el-table-column label="排序" header-align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort"
            type="number"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否首页显示" width="180" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.hot"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="300"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.id"
            type="primary"
            size="small"
            @click="getChildrenFn(scope.row.id)"
            >查看子分类</el-button
          >
          <el-button type="primary" size="small" @click="editItemFn(scope.row)"
            >提交编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryPositionType, editPositionType } from "@/api/boss";
import uploadImg from "@/components/uploadImg/upload-img.vue";
export default {
  name: "GoodsClass",
  components: {
    uploadImg,
  },
  data() {
    return {
      fatherCategoryArr: [],
      timeStamp: "",
      dataList: [],
      pid: 0,
      defDdata: {
        sort: 0,
        name: "",
      },
      dataConfig: {
        loading: true,
      },
    };
  },
  beforeMount() {
    this.queryProductCategoryFn();
  },
  computed: {},
  watch: {},
  methods: {
    queryProductCategoryFn() {
      queryPositionType(this.pid).then((res) => {
        const resData = this.resDataFn(res);
        this.dataList.splice(0, this.dataList.length, ...resData);
      });
    },
    //新增分类
    addItemFn() {
      this.dataList.unshift(Object.assign({}, this.defDdata));
    },
    //查看子分类
    getChildrenFn(id) {
      this.pid = id;
      this.queryProductCategoryFn();
    },
    //返回一级分类
    backFcategoryFn() {
      this.pid = 0;
      this.queryProductCategoryFn();
    },
    //编辑职位类型
    editItemFn(item) {
      editPositionType({
        id: item.id,
        name: item.name,
        pid: this.pid,
        sort: Number(item.sort),
        hot: item.hot,
      }).then((res) => {
        if (res.code === "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.queryProductCategoryFn();
        }
      });
    },
  },
};
</script>

<style scoped>
/deep/ .el-table .cell {
  display: flex;
  justify-content: center;
}
</style>
