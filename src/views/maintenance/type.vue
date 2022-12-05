<template>
  <div class="app-container">
    <div class="select_view">
      <el-button icon="el-icon-plus" type="primary" @click="addInit()"
        >新增</el-button
      >
      <!-- <el-button icon="el-icon-zoom-in" type="primary" @click="query()"
        >查询</el-button
      > -->
      <el-button icon="el-icon-refresh" type="info" @click="reset()"
        >重置</el-button
      >
    </div>
    <div style="height: 16px;"></div>
    <el-table
      highlight-current-row
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="dataList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" width="45" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        prop="id"
        label="id"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="imgUrl" label="图片">
        <template slot-scope="{ row }">
          <y-image :src="row.imgUrl" />
        </template>
      </el-table-column>
      <!-- <el-table-column prop="isTop" label="是否置顶" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :class="util.global.whetherEnum[row.isTop].class">
            {{util.global.whetherEnum[row.isTop].label}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :class="util.global.StatusEnum[row.status].class">
            {{util.global.StatusEnum[row.status].label}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{new Date(row.createTime).format('yyyy-MM-dd hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{new Date(row.updateTime).format('yyyy-MM-dd hh:mm:ss')}}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="300px">
        <template slot-scope="{ row }">
          <div class="settings">
            <el-button type="warning" size="mini" plain @click="editInit(row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              plain
              @click="delMessage(row.id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination background @size-change="handleSizeChange" @current-change="updatePageNo"
      :current-page="page.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="page.dataNum"
      layout="total, sizes, prev, pager, next, jumper" :total="page.dataSumNum">
    </el-pagination> -->

    <model
      ref="addModel"
      title="新增设备类型"
      @ok="handleAdd"
      @close="resetAddForm"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="设备类型名称"
          prop="name"
          style="width:calc(100% - 120px)"
        >
          <el-input
            type="text"
            v-model="addForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="父级id"
          prop="pid"
          style="width:calc(100% - 120px)"
        >
          <el-select v-model.number="addForm.pid" placeholder="请选择">
            <el-option
              :label="item - 1"
              :value="item - 1"
              :key="item - 1"
              v-for="item in equipmentTypeNum"
            ></el-option>
          </el-select>
          <!-- <el-input
            type="number"
            v-model="addForm.pid"
            autocomplete="off"
          ></el-input> -->
        </el-form-item>
        <el-form-item label="排序" prop="sort" style="width:calc(100% - 120px)">
          <el-input
            type="number"
            v-model="addForm.sort"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="设备类型图片"
          prop="icon"
          style="width:calc(100% - 120px)"
        >
          <div class="typeUpload">
            <el-upload
              action="#"
              list-type="picture-card"
              :http-request="httpRequest"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </model>

    <model
      ref="editModel"
      title="编辑设备类型"
      @ok="handleEdit"
      @close="resetEditForm"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="设备类型名称"
          prop="name"
          style="width:calc(100% - 120px)"
        >
          <el-input
            type="text"
            v-model="editForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" style="width:calc(100% - 120px)">
          <el-input
            type="number"
            v-model="editForm.sort"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="设备类型图片"
          prop="icon"
          style="width:calc(100% - 120px)"
        >
          <upload
            ref="editImg"
            type="image/*"
            limit="1"
            :size="1024 ** 2 * 2"
          />
        </el-form-item>
      </el-form>
    </model>
  </div>
</template>
<style lang="less" scoped>
.typeUpload {
  width: 150px;
  height: 150px;
  overflow: hidden;
}
</style>
<script>
import { deleteDeviceType, editDeviceType } from "@/api/order";
import { UploadImg } from "@/api/system";
import tableMixin from "@/mixin/table";
export default {
  name: "Carousel",
  mixins: [tableMixin],
  data() {
    return {
      equipmentTypeNum: null,
      loading: false,
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        sequence: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
          },
        ],
      },
      addForm: {},
      url: {
        query: "/admin/maintenance/queryDeviceTypeList",
        edit: "/admin//maintenance/editDeviceType",
        //   updateStatus:'/admin/edit_carousel_info_status',
        //   updateTopStatus:'/admin/edit_carousel_info_top'
      },
    };
  },
  methods: {
    // 点击删除触发的事件
    delMessage(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteDeviceType(id);
          if (res.message === "操作成功") {
            this.$message({
              message: "删除成功",
              type: "success",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 上传图片的函数
    async httpRequest(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      this.addForm.imgUrl = res.data;
    },
    query() {
      this.loading = true;
      this.$axios
        .post(this.url.query, {
          pageNo: this.page.pageNo,
          pageSize: this.page.dataNum,
          ...this.searchForm,
        })
        .then(({ data }) => {
          this.dataList = data;
          this.equipmentTypeNum = data.length + 1;
        })
        .catch(function(error) {
          console.info(error);
        });
      this.loading = false;
    },
    uploadSucFn(img) {
      console.info(img);
    },
    grantInit() {
      this.$refs.addModel.open();
    },
    handleSubmitForm(fn) {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          if (this.$refs.img.isNull()) {
            this.$message.error("请上传设备类型图片");
            return false;
          }
          let img = (await this.$refs.img.uploadFile())[0];
          this.submitForm(fn, {
            imgUrl: img,
          });
          this.$refs.img.reset([]);
        } else {
          return false;
        }
      });
    },
    handleClose(fn) {
      this.addForm = {};
      if (fn) fn(false);
    },
    addInit() {
      this.$refs.addModel.open();
    },
    handleAdd(fn) {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          const res = await editDeviceType(this.addForm);
          if (res.message === "操作成功") {
            this.$message({
              message: "已添加成功",
              type: "success",
            });
            this.$refs.addModel.close();
            this.query();
          }
        } else {
          return false;
        }
      });
    },
    resetAddForm(fn) {
      if (fn) fn(false);
    },
    editInit(row) {
      let form = this.editForm;
      this.editForm = row;
      this.$refs.editModel.open();
      this.$nextTick(() => {
        this.$refs.editImg.reset(
          row.imgUrl
            ? [
                {
                  url: this.editForm.imgUrl,
                },
              ]
            : []
        );
      });
    },
    handleEdit(fn) {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          if (this.$refs.editImg.isNull()) {
            this.$message.error("请上传图标文件");
            return false;
          }
          let img = (await this.$refs.editImg.uploadFile())[0];
          this.edit(fn, {
            imgUrl: img,
          });
        } else {
          return false;
        }
      });
    },
    resetEditForm(fn) {
      if (fn) fn(false);
    },
  },
};
</script>
