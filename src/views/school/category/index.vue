<template>
  <div class="content_box">
    <first-title title="商学院类型" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.name"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户昵称"
      />
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
      <el-button type="primary" @click="addDataFn"
        ><i class="el-icon-plus" />添加商学院类型</el-button
      >
      <span class="mg_l15" style="color: #f56c6c"
        >注意：“修改”和“添加”商学院类型项目后需要点击右侧“提交编辑”按钮才会生效哦！</span
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column label="ID" width="80px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id">{{ scope.row.id }}</span>
          <span
            v-if="!scope.row.id"
            class="delete_icon"
            @click="deleteAddFn(scope.$index)"
            ><i class="el-icon-delete"
          /></span>
        </template>
      </el-table-column>
      <el-table-column label="图标" width="140px" align="center">
        <template slot-scope="scope">
          <upload-img
            width="100px"
            height="60px"
            :img="scope.row.img"
            @uploadSuc="uploadSucFn($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型名称" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="请输入类型名称" />
        </template>
      </el-table-column>
      <el-table-column label="数据类型" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.dataType" placeholder="请选择数据类型">
            <el-option
              v-for="item in dataTypes"
              :key="item.val"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editDataFn(scope.row)"
            >提交编辑</el-button
          >
          <el-button
            v-if="scope.row.id"
            type="danger"
            size="small"
            @click="deleteFn(scope)"
            ><i class="el-icon-delete" />删除</el-button
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
import uploadImg from "@/components/uploadImg/upload-img.vue";
import {
  querySchoolCategoryFn,
  editSchoolCategoryFn,
  delSchoolCategoryFn,
} from "@/api/school.js";
export default {
  name: "SchoolCategory",
  components: {
    uploadImg,
  },
  data() {
    return {
      dataList: [],
      queryData: {
        name: "",
      },
      dataTypes: [
        {
          name: "单数据",
          val: 1,
        },
        {
          name: "多数据",
          val: 2,
        },
      ],
      editData: {
        dataType: "", //数据类型 1单数据 2多数据
        id: "", //id
        img: "", //图标
        name: "", //类型名称
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
    this.querySchoolCategoryFn();
  },
  methods: {
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.querySchoolCategoryFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.querySchoolCategoryFn();
    },
    deleteFn(scope) {
      this.deleteAlert()
        .then(() => {
          const resData = delSchoolCategoryFn({ id: scope.row.id });
          return resData;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.querySchoolCategoryFn();
          }
        });
    },
    uploadSucFn(img, index) {
      this.$set(
        this.dataList,
        index,
        Object.assign({}, this.dataList[index], { img: img })
      );
    },
    editDataFn(val) {
      editSchoolCategoryFn({
        dataType: val.dataType, //数据类型 1单数据 2多数据
        id: val.id, //id
        img: val.img, //图标
        name: val.name, //类型名称
      }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.querySchoolCategoryFn();
        }
      });
    },
    addDataFn() {
      this.dataList.unshift(Object.assign({}, this.editData));
    },
    deleteAddFn(index) {
      this.dataList.splice(index, 1);
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData = {
        name: "",
      };
      this.querySchoolCategoryFn();
    },
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.querySchoolCategoryFn();
    },
    querySchoolCategoryFn() {
      this.dataConfig.loading = true;
      querySchoolCategoryFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        name: this.queryData.name,
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
.user_head {
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  background: #ddd;
  .upload {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url("../../../assets/indexBgI.jpg") no-repeat center / 100% 100%;
    font-size: #fff;
    text-align: center;
    line-height: 50px;
    display: none;
  }
  &:hover {
    .upload {
      display: block;
    }
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
