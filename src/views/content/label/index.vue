<template>
  <div class="content_box">
    <first-title title="意见反馈管理" />
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
      <el-table-column label="用户昵称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="反馈类型" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.type === 0
              ? "其他"
              : scope.row.type === 1
              ? "产品建议"
              : scope.row.type === 2
              ? "软件使用"
              : "服务体验"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="反馈图片"
        align="center"
        header-align="center"
        width="200"
      >
        <template slot-scope="scope">
          <div>
            <el-image
              style="width: 80px; height: 80px; margin: 0 4px"
              :src="item"
              v-for="(item, key) in scope.row.images.split(',')"
              :key="key"
              fit="cover"
              :preview-src-list="scope.row.images.split(',')"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="反馈内容"
        width="300"
        align="center"
        header-align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span class="pro_name">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="反馈时间"
        width="180"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="处理状态" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? "未处理" : "已处理" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="处理结果" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.processResult }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="处理时间"
        width="180"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.processTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status !== 1"
            type="primary"
            size="small"
            @click="handleFeedback(scope.row.id)"
            >处理反馈</el-button
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

    <el-dialog title="处理反馈" :visible.sync="feedbackVisible" width="600px">
      <el-form ref="form" :model="feedbackData" label-width="80px">
        <el-form-item label="反馈ID">
          <el-input v-model="feedbackData.id" disabled />
        </el-form-item>
        <el-form-item label="处理结果">
          <el-input type="textarea" v-model="feedbackData.processResult" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="feedbackVisible = false">取消</el-button>
        <el-button type="primary" @click="handleFeedbackFn">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryOpinionLabelFn, editOpinionLabelFn } from "@/api/content.js";
export default {
  name: "Label",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      feedbackVisible: false,
      feedbackData: {
        id: "",
        processResult: "",
      },
    };
  },
  beforeMount() {
    this.queryOpinionLabelFn();
  },
  methods: {
    handleFeedback(id) {
      this.feedbackData = {
        processResult: "",
        id: "",
      };
      this.feedbackData.id = id;
      this.feedbackVisible = true;
    },
    handleFeedbackFn() {
      editOpinionLabelFn(this.feedbackData).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.feedbackVisible = false;
          this.queryOpinionLabelFn();
        }
      });
    },
    queryOpinionLabelFn() {
      queryOpinionLabelFn({
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
      this.queryOpinionLabelFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.queryOpinionLabelFn();
    },
  },
};
</script>

<style>
.pro_name {
  display: inline-block;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 8px;
}
</style>
