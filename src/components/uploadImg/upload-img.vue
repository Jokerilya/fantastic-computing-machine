<template>
  <div class="upload_img" :class="{border_radius:radius}" :style="{width:width,height:height,border:'1px solid #ccc'}">
    <img v-if="img && type == 'img'" :src="img" alt="">
    <video v-if="img && type == 'video'" :src="img" />
    <span v-if="!img" class="no_text">点击上传</span>
    <el-upload
      class="upload-demo"
	    action=""
      :http-request="httpRequestFn"
      :show-file-list="false"
    >
      <div slot="trigger" v-if="img && type == 'file'">
        <i class="el-icon-document"></i>
        {{img}}
      </div>
      <div v-else slot="trigger" class="upload" />
    </el-upload>
  </div>
</template>

<script>
import { UploadImg } from '@/api/system.js'
export default {
  props: {
    type: {
      type: String,
      default: 'img'
    },
    img: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '60px'
    },
    height: {
      type: String,
      default: '60px'
    },
    radius: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    
    }
  },
  computed: {

  },
  methods: {
    httpRequestFn(data) {
      const loading = this.$loading({text:'上传中..'})
      const formData = new FormData()
      formData.append('file', data.file)
      UploadImg(formData).then((res) => {
        this.$emit('uploadSuc', res.data)
        this.$message({
          showClose: true,
          message: '文件上传成功！',
          type: 'success'
        })
        loading.close()
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '文件上传失败！',
          type: 'warning'
        })
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss">
.upload_img{
    position: relative;
    overflow: hidden;
    background: #ddd;
    display: flex;
    .upload{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: url('../../assets/upload.png') no-repeat center / auto 100%;
      font-size: #fff;
      text-align: center;
      line-height: 80px;
      display: none;
      background-color: rgba(0,0,0,0.78);
    }
    &:hover{
      .upload{
        display: block;
      }
    }
    img,video{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    video{
      width: 100%;
      height: 100%;
    }
    .no_text{
      margin: auto;
      color: #999;
      font-size: 12px;
    }
}
.border_radius{
  border-radius: 50%;
}
</style>
</style>
