<template>
  <div class="content_box">
    <first-title title="公司福利列表" />
    <div class="select_view">
      <el-button type="primary" icon="el-icon-plus" @click="addItemFn"
        >添加福利</el-button
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
      <el-table-column label="公司福利名称" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="请输入公司福利名称" />
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
          <el-button type="primary" size="small" @click="editItemFn(scope.row)"
            >提交编辑</el-button
          >
          <el-button size="small" type="danger" @click="delfunc(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryWelfare,editWelfare,deleteWelfare } from "@/api/boss";
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
      queryWelfare().then((res) => {
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
      editWelfare({
        id: item.id,
        name: item.name,
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
    //删除岗位
    delfunc(scope) {
      this.deleteAlert()
        .then(() => {
          const res = deleteWelfare({
            id: scope.row.id,
          });
          return res;
        })
        .then((res) => {
          if (res.code == "000") {
            this.$message.success("删除成功！");
            this.dataList.splice(scope.$index, 1);
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
