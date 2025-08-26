<template>
  <div class="tagManage">
    <first-title title="标签管理" />
    <div class="tagListItem" v-for="(item, index) in tagList" :key="item.title">
      <h4>{{ item.moduleName }}</h4>
      <div class="tagListBox">
        <el-tag
          :key="tag"
          v-for="tag in item.content"
          closable
          :disable-transitions="false"
          @close="handleClose(tag, index)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="item.inputVisible"
          v-model="item.inputValue"
          size="small"
          :ref="item.ref"
          @keyup.enter.native="handleInputConfirm(index)"
          @blur="handleInputConfirm(index)"
        >
        </el-input>
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput(index)"
          >+ 新增</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { queryLabelList, editLabel } from "@/api/label";
export default {
  data() {
    return {
      tagList: [],
    };
  },
  methods: {
    // 获取标签列表
    async queryLabelList() {
      const res = await queryLabelList();
      if (res.code == "000") {
        res.data.forEach((item) => {
          item.inputVisible = false;
          item.inputValue = null;
          item.ref = item.module + "Ref";
          if (item.content) {
            item.content = item.content.split(",");
          } else {
            item.content = [];
          }
        });
        this.tagList = res.data;
      }
    },
    // 删除标签
    async handleClose(tag, index) {
      let tagListCopy = [...this.tagList[index].content];
      tagListCopy.splice(tagListCopy.indexOf(tag), 1);
      let editData = {
        content: tagListCopy.join(","),
        id: this.tagList[index].id,
        module: this.tagList[index].module,
      };
      const res = await editLabel(editData);
      if (res.code == "000") {
        this.tagList[index].content.splice(
          this.tagList[index].content.indexOf(tag),
          1
        );
      } else {
        this.$message({
          showClose: true,
          message: "删除失败",
          type: "error",
        });
      }
    },
    // 打开新增标签输入框
    showInput(index) {
      this.tagList[index].inputVisible = true;
      this.$nextTick((_) => {
        let ref = this.tagList[index].ref;
        this.$refs[ref][0].$refs.input.focus();
      });
    },
    // 确定新增标签
    async handleInputConfirm(index) {
      let inputValue = this.tagList[index].inputValue;
      if (inputValue) {
        let tagListCopy = [...this.tagList[index].content];
        tagListCopy.push(inputValue);
        let editData = {
          content: tagListCopy.join(","),
          id: this.tagList[index].id,
          module: this.tagList[index].module,
        };
        const res = await editLabel(editData);
        if (res.code == "000") {
          this.tagList[index].content.push(inputValue);
        } else {
          this.$message({
            showClose: true,
            message: "新增失败",
            type: "error",
          });
        }
      }
      this.tagList[index].inputVisible = false;
      this.tagList[index].inputValue = "";
    },
  },
  created() {
    this.queryLabelList();
  },
};
</script>

<style scoped lang="scss">
.tagManage {
  padding: 20px;
  .tagListItem {
    margin-top: 10px;
    h4 {
      font-size: 22px;
    }
    .tagListBox:hover {
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); /* 悬停时更明显的阴影 */
    }
    .tagListBox {
      padding: 20px;
      margin-top: 20px;
      border: 2px solid #eaeefb;
      border-radius: 3px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-start;
      align-items: center;
      justify-content: flex-start;
    }
  }
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
