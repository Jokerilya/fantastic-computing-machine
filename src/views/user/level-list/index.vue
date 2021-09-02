<template>
  <div class="content_box">
    <first-title title="用户等级" />
    <!-- <div class="select_view">
      <span style="color: #f56c6c"
        >注意：“修改”会员等级后需要点击右侧“提交编辑”按钮才会生效哦！</span
      >
    </div> -->
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="ID"
        width="60"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级名称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="升级条件-等级ID"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.levelId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="升级条件-等级数量"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.levelNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="升级条件-团队店主数量"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.shareTeamNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="升级条件-店主数量"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.shareNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="editDataFn(scope.row.id)"
            >编辑</el-button
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

    <el-dialog title="编辑用户等级" :visible.sync="dialogVisible" width="800px">
      <div>
        <el-form ref="form" :model="editData" label-width="170px">
          <el-form-item label="ID">
            <el-input v-model="editData.id" :disabled="true" />
          </el-form-item>
          <el-form-item label="等级名称">
            <el-input v-model="editData.name" placeholder="请输入等级名称" />
          </el-form-item>
          <el-form-item label="升级条件-等级ID">
            <el-input
              v-model="editData.levelId"
              type="number"
              placeholder="请输入升级条件-等级ID"
            />
          </el-form-item>
          <el-form-item label="升级条件-等级数量">
            <el-input
              v-model="editData.levelNum"
              type="number"
              placeholder="请输入升级条件-等级数量"
            />
          </el-form-item>
          <el-form-item label="升级条件-团队店主数量">
            <el-input
              v-model="editData.shareTeamNum"
              type="number"
              placeholder="请输入升级条件-团队店主数量"
            />
          </el-form-item>
          <el-form-item label="升级条件-店主数量">
            <el-input
              v-model="editData.shareNum"
              type="number"
              placeholder="请输入升级条件-店主数量"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDataFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryLevelInfoFn,
  getLevelInfoDetailFn,
  editLevelInfoFn,
} from "@/api/user.js";
export default {
  name: "LevelList",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      dialogVisible: false,
      editData: {
        id: 0,
        levelId: 0,
        levelNum: 0,
        name: "",
        shareNum: 0,
        shareTeamNum: 0,
      },
    };
  },
  beforeMount() {
    this.getDataListFn();
  },
  methods: {
    submitDataFn() {
      editLevelInfoFn(this.editData).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.getDataListFn();
          this.dialogVisible = false;
        }
      });
    },
    editDataFn(id) {
      this.editData = {
        id: 0,
        levelId: 0,
        levelNum: 0,
        name: "",
        shareNum: 0,
        shareTeamNum: 0,
      };
      getLevelInfoDetailFn({ id: id }).then((res) => {
        const resData = this.resDataFn(res);
        this.editData = Object.assign({}, this.editData, resData);
        this.dialogVisible = true;
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
    getDataListFn() {
      this.dataConfig.loading = true;
      queryLevelInfoFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
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
</style>
