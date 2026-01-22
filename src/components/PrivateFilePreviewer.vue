<template>
  <div class="private-preview-wrapper" style="display: inline-block">
    <el-button
      type="text"
      :icon="getIcon"
      :loading="loading"
      @click="handlePreview"
    >
      {{ btnText }}
    </el-button>

    <el-image-viewer
      v-if="showImageViewer"
      :on-close="closeViewer"
      :url-list="previewList"
      :z-index="3000"
    />

    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      width="70%"
      append-to-body
      destroy-on-close
      @close="closeViewer"
    >
      <div v-if="activeType === 'video'" class="video-container">
        <video :src="previewList[0]" controls width="100%" autoplay></video>
      </div>
      <div v-else-if="activeType === 'pdf'" class="pdf-container">
        <iframe
          :src="previewList[0]"
          width="100%"
          height="600px"
          frameborder="0"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { generatePresignedUrl } from "@/api/system";

export default {
  name: "PrivateFilePreviewer",
  components: { ElImageViewer },
  props: {
    // 支持字符串或数组
    filePaths: {
      type: [String, Array],
      default: () => [],
    },
    // 手动指定模式：auto(自动识别), image, video, pdf
    mode: {
      type: String,
      default: "auto",
    },
    customText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      showImageViewer: false,
      showDialog: false,
      previewList: [], // 签名后的链接列表
      activeType: "", // 当前预览的文件类型
      dialogTitle: "文件预览",
    };
  },
  computed: {
    getExt() {
      const path = Array.isArray(this.filePaths)
        ? this.filePaths[0]
        : this.filePaths;
      if (!path) return "";
      const cleanPath = path.split("?")[0];
      return cleanPath.split(".").pop().toLowerCase();
    },
    getIcon() {
      const ext = this.getExt;
      if (["mp4", "webm", "ogg"].includes(ext)) return "el-icon-video-camera";
      if (ext === "pdf") return "el-icon-document";
      return "el-icon-picture";
    },
    btnText() {
      if (this.customText) {
        return this.customText;
      }
      const ext = this.getExt;
      if (["mp4", "webm", "ogg"].includes(ext)) return "播放视频";
      if (ext === "pdf") return "查看PDF";
      return "查看图片";
    },
  },
  methods: {
    // 新增一个清洗路径的私有方法
    cleanPath(path) {
      if (typeof path !== "string") return path;
      // 如果路径包含 '?'，则截取 '?' 之前的内容
      return path.split("?")[0];
    },

    async handlePreview() {
      let pathArray = [];

      if (Array.isArray(this.filePaths)) {
        pathArray = this.filePaths;
      } else if (
        typeof this.filePaths === "string" &&
        this.filePaths.trim() !== ""
      ) {
        pathArray = this.filePaths
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
      }

      if (pathArray.length === 0) {
        this.$message.warning("暂无文件");
        return;
      }

      this.loading = true;
      try {
        const cleanedPaths = pathArray.map((path) => this.cleanPath(path));
        const promises = cleanedPaths.map((path) =>
          generatePresignedUrl(path).then((res) => res.data || res)
        );
        const urls = await Promise.all(promises);
        this.previewList = urls.filter((u) => u);
        const ext = cleanedPaths[0].split(".").pop().toLowerCase();
        if (["mp4", "webm", "ogg"].includes(ext)) {
          this.activeType = "video";
          this.dialogTitle = "视频预览";
          this.showDialog = true;
        } else if (ext === "pdf") {
          this.activeType = "pdf";
          this.dialogTitle = "PDF预览";
          this.showDialog = true;
        } else {
          // 默认为图片预览
          this.activeType = "image";
          this.showImageViewer = true;
          document.body.style.overflow = "hidden";
        }
      } catch (error) {
        this.$message.error("获取预览链接失败");
      } finally {
        this.loading = false;
      }
    },
    closeViewer() {
      this.showImageViewer = false;
      this.showDialog = false;
      this.previewList = [];
      document.body.style.overflow = "";
    },
  },
};
</script>

<style scoped>
.video-container,
.pdf-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}
</style>