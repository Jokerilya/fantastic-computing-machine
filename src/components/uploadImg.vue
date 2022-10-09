<template>
  <div id="uploadFile">
    <div class="uploadFile-box">
      <div
        v-for="(item, index) in imgList"
        :key="item.fileId"
        class="fileBox"
        :style="{ width: widthHeight + 'px', height: widthHeight + 'px' }"
      >
        <el-image :src="item.url" :preview-src-list="[item.url]" ref="elImage"></el-image>
        <div
          class="fileBox-icon"
          :style="{
            width: widthHeight + 'px',
            height: widthHeight + 'px',
            lineHeight: widthHeight * 1.15 + 'px',
            fontSize: widthHeight / 5 + 'px'
          }"
          v-if="btnIsShow"
        >
          <i class="icon el-icon-zoom-in" @click="handleZoomIn(item, index)"></i>
          <i class="icon el-icon-download" @click="handleDown(item, index)"></i>
          <i class="icon el-icon-delete" @click="handleDel(item, index)"></i>
        </div>
      </div>
      <el-upload
        v-show="btnIsShow && imgList.length < limit"
        class="avatar-uploader"
        action="#"
        :http-request="httpRequest"
        :multiple="multiple"
        :accept="accept"
        :show-file-list="false"
        :file-list="imgList"
        :limit="limit"
        :on-exceed="onExceed"
        v-loading="loading"
      >
        <i
          class="el-icon-plus avatar-uploader-icon"
          :style="{
            width: widthHeight + 'px',
            height: widthHeight + 'px',
            lineHeight: widthHeight + 'px',
            fontSize: widthHeight / 5 + 'px'
          }"
        ></i>
      </el-upload>
    </div>
  </div>
</template>
<script>
/*****
 * 使用示例  <upload-img :IDS.sync="form.imgIds" :imgList.sync="form.imgs" :submitSuccess.sync="submitSuccess" :limit="1"/>
 * submitSuccess 
 */
export default {
  name: 'UploadImg',
  props: {
    multiple: {
      //是否支持多选文件
      default: false,
      type: Boolean
    },
    accept: {
      //接受上传的文件类型
      default: 'image/*',
      type: String
    },
    btnIsShow: {
      //用作图片预览时隐藏按钮
      type: Boolean,
      default: true
    },
    widthHeight: {
      //需要显示的宽高
      default: 100,
      type: [Number, String]
    },
    limit: {
      //最大上传数量
      default: 1,
      type: Number
    },
    maxSize: {
      //最大 文件大小
      type: Number,
      default: 5 //单位 MB
    },
    imgList: {
      // 传入回显的图片信息
      // type: Array,
      default: () => [],
      required: true
    },
    IDS: {
      //后端需要的ids 数组
      // type: Array,
      default: () => []
    },
    submitSuccess: {
      // required: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      deleImgArr: [], //缓存本次用户操作删除的图片
      upLoadImgArr: [] // 缓存本次用户操作实时上传成功的图片
    }
  },
  watch: {
    imgList: {
      // 处理IDS
      handler(val) {
        if (!(val instanceof Array)) {
          console.log('当前传入的数据类型为：' + typeof val, '==> imgList 需要传入数组')
          this.$emit('update:imgList', [])
          return
        }
        let IDS = val.map(item => item.fileId)
        this.$emit('update:IDS', IDS)
      },
      immediate: true
    },
    submitSuccess: {
      handler(val) {
        if(val) this.handleFormSubmitSucess()
      }
    }
  },
  mounted() {
    this.$emit('update:submitSuccess', false)
  },
  //组件销毁前
  beforeDestroy() {
    if(this.upLoadImgArr.length && this.$listeners['update:submitSuccess']) {
      console.log('组件销毁前删除用户上传成功没点提交到后端的图片');
      this.$api.deleteFile(this.upLoadImgArr)
    }
  },

  methods: {
    //用户提交表单到后端成功后，检查有需要删除的图片
    handleFormSubmitSucess() {
      if(this.deleImgArr.length){
        this.$api.deleteFile(this.deleImgArr) //调删除接口，不关注成功与否
      }
      //清空 操作缓存记录
      this.deleImgArr = []
      this.upLoadImgArr = [] //清空缓存，避免组件销毁时删除
      this.$nextTick(()=>{
        this.$emit('update:submitSuccess', false)
      })
    },
    onExceed() {
      this.$message.warning(`最大上传图片个数为${this.limit}个！`)
    },
    /**
     * 自定义上传文件请求内容
     *
     * */
    async httpRequest(fileData) {
      this.loading = true
      let file = fileData.file
      //判断需不需要压缩
      if (file.size / 1024 / 1024 > this.maxSize) {
        let comFile = await this.compressFile(file, 1000)
        // console.log(comFile);
        if (comFile.size / 1024 / 1024 > this.maxSize) {
          //压过一次后 还是很大，减少宽度再压一次
          let againComFile = await this.compressFile(comFile, 800)
          file = againComFile
        } else {
          file = comFile
        }
      }
      let formData = new FormData()
      formData.append('file', file)
      try {
        const res = await this.$api.upFileStream(formData)
        if (res.code == 1) {
          this.upLoadImgArr.push(res.data[0].fileId) // 缓存本次用户操作实时上传成功的图片名称（后端用文件名称删除），用于不提交时删除
          let list = [...this.imgList, ...res.data]
          this.$emit('update:imgList', list)
        } else {
          this.$emit('update:imgList', [...this.imgList]) //重置 file-list
          this.$message.warning(res.msg)
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        this.$message.warning('服务器错误，请联系管理员')
        this.$emit('update:imgList', [...this.imgList]) //重置 file-list
      }
    },
    // ********************** 放大|下载|删除 *********************//
    handleZoomIn(item, idx) {
      this.$refs.elImage[idx].clickHandler()
    },
    handleDown(item) {
      // 如果是url先转为base64再下载
      if (item.url.indexOf('https:') != -1) {
        this.urlImgBase64(item)
      } else {
        this.downLoadFile(item.url, item.name)
      }
    },
    handleDel(file, index) {
      this.$confirm('删除后不可找回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let fileId = file.fileId
          this.deleImgArr.push(fileId)
          let list = [...this.imgList]
          list.splice(index, 1)
          this.$emit('update:imgList', list)
          // 后端说不需要调删除接口了，表单替换会自动删除
          if(!this.$listeners['update:submitSuccess']) this.$api.deleteFile([fileId])
        })
        .catch(() => {})
    },

    // ********************** 下载 | url转base64 方法 *********************//
    downLoadFile(url, name) {
      if ('download' in document.createElement('a')) {
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        //设置新下载的文件名
        let downLoadFileName = decodeURI(name)
        link.setAttribute('download', downLoadFileName)
        document.body.appendChild(link)
        link.click()
      } else {
        //IE下载
        // navigator.msSaveBlob(new Blob([stream]), name)
      }
    },
    // URL地址转为base64
    urlImgBase64(item) {
      const that = this
      var image = new Image()
      image.src = item.imageUrl
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, image.width, image.height)
        var dataURL = canvas.toDataURL('image/png')
        that.downLoadFile(dataURL, item.name)
      }
    },
    /**
     * 压缩图片
     * @param file 图片文件
     * @param maxWidth 压缩图片的最大宽度 默认最大为1000
     */
    compressFile(file, maxWidth = 1000) {
      return new Promise(resolve => {
        let type = file.type
        let reader = new FileReader()
        reader.readAsDataURL(file) //转base64
        reader.onload = function (e) {
          let image = new Image() //新建一个img标签（还没嵌入DOM节点)
          image.src = e.target.result
          image.onload = function () {
            let canvas = document.createElement('canvas'), // 新建canvas
              context = canvas.getContext('2d')
            let scale = image.width / maxWidth
            let height = image.height / scale
            canvas.width = maxWidth
            canvas.height = height
            context.drawImage(image, 0, 0, maxWidth, height)
            let data = canvas.toDataURL(type, 1) // 0.1压缩至以前的0.1倍
            let arr = data.split(','),
              mime = arr[0].match(/:(.*?);/)[1], // 转成blob
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            let files = new window.File([new Blob([u8arr], { type: mime })], 'test.' + type.split('/')[1], { type: type }) // 转成file
            resolve(files)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#uploadFile {
  .uploadFile-box {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .fileBox {
      display: inline-block;
      width: 100px;
      height: 100px;
      line-height: 100px;
      border-radius: 4px;
      overflow: hidden;
      // border: 1px solid #ededed;
      background-color: #ededed;
      margin: 2px 5px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-image {
        width: 100%;
        height: 100%;
      }

      .fileBox-img {
        width: 100px;
        height: 100px;
        border-radius: 4px;
      }
      .fileBox-icon {
        background-color: rgba(0, 0, 0, 0.4);
        display: none;
        width: 100px;
        height: 100px;
        line-height: 115px;
        border-radius: 4px;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 10;
        text-align: center;
        font-size: 20px;
        .icon {
          color: #fff;
          margin: 6%;
          cursor: pointer;
        }
        .icon:hover {
          color: #409eff;
        }
      }

      .fileBox-block {
        display: block !important;
      }
    }
    .fileBox:hover .fileBox-icon {
      display: block !important;
    }
    /deep/.avatar-uploader {
      margin: 2px 5px;
      .el-upload {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        .avatar-uploader-icon {
          border: 1px dashed #ededed;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          font-size: 28px;
          color: #8c939d;
          width: 100px;
          height: 100px;
          line-height: 100px;
          text-align: center;
        }
        .avatar-uploader-icon:hover {
          border-color: #409eff;
        }
      }
    }
  }
}
</style>
