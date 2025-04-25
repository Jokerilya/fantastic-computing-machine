<template>
  <div class="content_box">
    <div style="display: flex; justify-content: space-between">
      <div class="topTool">
        <el-input
          placeholder="请输入标题"
          class="toolInput"
          v-model="querySysNoticeListParmas.title"
        >
        </el-input>
        <el-select
          placeholder="请选择类型"
          class="toolInput"
          v-model="querySysNoticeListParmas.type"
        >
          <el-option
            v-for="item in typeList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="topTool">
        <el-button @click="openSystemNoticeDialog">新增</el-button>
        <el-button @click="querySysNoticeList">搜索</el-button>
        <el-button @click="resetSearchFn">重置</el-button>
      </div>
    </div>

    <el-table
      border
      :data="sysNoticeList"
      class="list"
      style="min-height: auto"
    >
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        label="消息类型"
        prop="type"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          {{ row.type == 1 ? "企业公告" : "师傅公告" }}
        </template>
      </el-table-column>
      <el-table-column
        label="标题"
        prop="title"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        label="内容"
        align="center"
        width="100"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="openHtmlContentDialog(row)"
            >查看内容</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        prop="sort"
        align="center"
        width="100"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        width="150"
        label="操作"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="openSystemNoticeDialog(row)"
            >编辑</el-button
          >
          <el-button type="text" @click="deleteSysNotice(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 16px"></div>
    <div
      class="table-block"
      style="text-align: center"
      v-show="typeList.length > 0"
    >
      <el-pagination
        background
        @current-change="currentChangeFn"
        :current-page="querySysNoticeListParmas.pageNo"
        :page-size="querySysNoticeListParmas.pageSize"
        :page-sizes="[20, 30, 50, 100]"
        layout="total, prev, pager, next"
        :total="sysNoticeListTotle"
      >
      </el-pagination>
    </div>

    <!-- 新增编辑系统消息框 -->
    <el-dialog
      center
      :title="systemNoticeDialogTitle"
      :visible="systemNoticeDialogVisible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="systemNoticeForm"
        :rules="systemNoticeRules"
        ref="systemNoticeRef"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="消息类型" prop="type">
          <el-select
            v-model="systemNoticeForm.type"
            placeholder="请选择消息类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            placeholder="请填写排序"
            v-model.number="systemNoticeForm.sort"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            placeholder="请填写标题"
            v-model="systemNoticeForm.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <VueEditor
            v-model="systemNoticeForm.content"
            useCustomImageHandler
            @image-added="handleImageAdded"
            :editorToolbar="customToolbar"
          ></VueEditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSystemNoticeDialog">取 消</el-button>
        <el-button type="primary" @click="saveSysNoticeDetail">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="htmlContentDialogTitle"
      :visible="htmlContentDialogVisible"
      width="40%"
      :before-close="closeHtmlContentDialog"
      :show-close="false"
    >
      <!-- 使用 v-html 渲染富文本 -->
      <div v-html="richTextContent" style="padding: 0 20px"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  querySysNoticeList,
  saveSysNoticeDetail,
  deleteSysNotice,
} from "@/api/notice";
import { UploadImg } from "@/api/system";
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor,
  },
  data() {
    return {
      sysNoticeList: [],
      sysNoticeListTotle: null,
      querySysNoticeListParmas: {
        title: null,
        type: null,
        pageNo: 1,
        pageSize: 10,
      },
      typeList: [
        {
          value: 1,
          label: "企业公告",
        },
        {
          value: 2,
          label: "师傅公告",
        },
      ],
      systemNoticeDialogTitle: "新增系统消息框",
      systemNoticeDialogVisible: false,
      systemNoticeForm: {
        type: null,
        sort: null,
        title: null,
        content: null,
      },
      systemNoticeRules: {
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "change" }],
      },
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image"],
      ],
      richTextContent: null,
      htmlContentDialogTitle: "内容展示",
      htmlContentDialogVisible: false,
    };
  },
  methods: {
    // 切换页数
    currentChangeFn(page) {
      this.querySysNoticeListParmas.pageNo = page;
      this.querySysNoticeList();
    },
    // 重置搜索
    resetSearchFn() {
      this.querySysNoticeListParmas.pageNo = 1;
      this.querySysNoticeListParmas.title = null;
      this.querySysNoticeListParmas.type = null;
      this.querySysNoticeList();
    },
    // 关闭内容展示框
    closeHtmlContentDialog() {
      this.htmlContentDialogVisible = false;
    },
    // 打开内容展示框
    openHtmlContentDialog(row) {
      this.htmlContentDialogTitle = "标题: " + row.title;
      this.richTextContent = row.content;
      this.htmlContentDialogVisible = true;
    },
    // 删除系统消息
    async deleteSysNotice(row) {
      const controls = await this.$confirm(
        `您确定要删除该消息通知【${row.title}】吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      if (controls == "confirm") {
        const res = await deleteSysNotice(row.id);
        if (res.code == "000") {
          await this.querySysNoticeList();
          this.$message({
            message: "删除成功",
            type: "success",
          });
        }
      }
    },
    // 关闭系统消息框
    async closeSystemNoticeDialog() {
      await this.$refs["systemNoticeRef"].resetFields();
      this.systemNoticeDialogVisible = false;
    },
    // 保存系统消息
    async saveSysNoticeDetail() {
      await this.$refs["systemNoticeRef"].validate();
      const res = await saveSysNoticeDetail(this.systemNoticeForm);
      if (res.code == "000") {
        await this.querySysNoticeList();
        this.closeSystemNoticeDialog();
        this.$message({
          message: "操作成功",
          type: "success",
        });
      }
    },
    // 图片调整方法
    resizeImage(file, targetWidth) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            // 计算目标高度（按比例缩放）
            const scale = targetWidth / img.width;
            const targetHeight = img.height * scale;

            // 创建 Canvas 元素
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // 设置 Canvas 尺寸为目标宽高
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // 在 Canvas 上绘制调整后的图片
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // 导出调整后的图片为 Blob 文件
            canvas.toBlob(
              (blob) => {
                blob.name = file.name; // 保留原文件名
                resolve(blob);
              },
              file.type || "image/jpeg", // 保持原图片格式
              0.9 // 图片质量（可选）
            );
          };

          img.onerror = (error) => {
            reject(error);
          };
        };

        reader.onerror = (error) => {
          reject(error);
        };

        // 开始读取文件
        reader.readAsDataURL(file);
      });
    },
    // 处理图片
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const resizedFile = await this.resizeImage(file, 350);
      let formData = new FormData();
      formData.append("file", resizedFile, file.name);
      const res = await UploadImg(formData);
      if (res.code == "000") {
        let url = res.data;
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
      }
    },
    // 打开系统消息框
    openSystemNoticeDialog(row) {
      // 编辑
      if (row.id) {
        this.systemNoticeForm = { ...row };
        this.systemNoticeDialogTitle = "编辑系统消息框";
      }
      // 新增
      else {
        this.systemNoticeDialogTitle = "新增系统消息框";
      }
      this.systemNoticeDialogVisible = true;
    },
    // 查询系统消息列表
    async querySysNoticeList() {
      const res = await querySysNoticeList(this.querySysNoticeListParmas);
      if (res.code == "000") {
        this.sysNoticeList = res.data.records;
        this.sysNoticeListTotle = res.data.total;
      }
    },
  },
  created() {
    this.querySysNoticeList();
  },
};
</script>

<style scoped lang="scss">
.topTool {
  display: flex;
  margin-bottom: 20px;
  .toolInput {
    width: 170px;
    margin-right: 10px;
  }
  .toolSelect {
    width: 130px;
    margin-right: 10px;
  }
  .toolBtn {
    color: #2e4c9e;
  }
}
</style>
