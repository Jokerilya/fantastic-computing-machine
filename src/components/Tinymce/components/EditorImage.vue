<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <el-upload
        ref="uploadImg"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="qiniuHost"
        list-type="picture-card"
        :http-request="httpRequestFn"
      >
        <div slot="file" slot-scope="{file}" class="show_img_box">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          <div class="progress">
            <span v-if="parseInt(fileProgress[file.uid]) >= 100" class="delete_icon" @click="handleRemove(file)">
              <i class="el-icon-delete" />
            </span>
            <el-progress v-if="parseInt(fileProgress[file.uid]) < 100" style="color: #FFFFFF;" type="circle" :percentage="parseInt(fileProgress[file.uid])" />
          </div>
        </div>
        <i slot="default" class="el-icon-plus" />
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { qiniuHost } from '@/webConfig.js'
import { mapGetters } from 'vuex'
import { UploadImg } from '@/api/system.js'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      qiniuHost: qiniuHost,
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  computed: {
    ...mapGetters(['token']),
    fileProgress() {
      return this.$store.state.user.fileProgress
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    httpRequestFn(data) {
		const loading = this.$loading({text:'上传中..'})
		const formData = new FormData()
		formData.append('file',data.file)
        UploadImg(formData).then((res) => {
			console.log(res)
			this.$emit('uploadSuc', res)
			this.handleSuccess(res.data, data.file)
			if(this.checkAllSuccess()){
				loading.close()
				this.$message({
				    showClose: true,
				    message: '图片上传成功！点击确认插入文本编辑器',
				    type: 'success'
				})
			}
      }).catch(() => {
			this.$message({
			  showClose: true,
			  message: '文件上传失败！',
			  type: 'warning'
			})
			loading.close()
        })
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待图片上传成功。如果出现网络问题，请刷新页面并重新上传！')
        return
      }
	  console.log(arr)
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const fileList = this.$refs.uploadImg.uploadFiles
      const index = fileList.findIndex(fileItem => {
        return fileItem.uid === file.uid
      })
      fileList.splice(index, 1)
      const uid = file.uid
      delete this.listObj[uid]
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss">
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
.show_img_box{
  width: 148px;
  height: 148px;
  position: relative;
  .progress{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background: rgba(0,0,0,.7);
    .el-progress__text{
      color: #FFFFFF;
    }
  }
  .delete_icon{
    .el-icon-delete{
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -10px;
      margin-left: -10px;
      color: #FFFFFF;
      font-size: 20px;
      z-index: 2;
      cursor: pointer;
    }
  }
}
</style>
