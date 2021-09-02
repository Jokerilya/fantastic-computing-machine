<template>
  <div class="content_box">
    <first-title title="App版本管理" />
    <div class="form_box">
      <el-form ref="form" class="form" :model="versionData" label-width="150px">
        <el-form-item label="信息ID">
          <el-input v-model="versionData.id" disabled="disabled" type="number" />
        </el-form-item>
        <el-form-item label="iOS Appid">
          <el-input v-model="versionData.appId" type="number" placeholder="请输入iOS Appid" />
        </el-form-item>
        <el-form-item label="App版本号">
          <el-input v-model="versionData.appVersion" placeholder="请输入App版本号" />
        </el-form-item>
        <el-form-item label="地址版本号">
          <el-input v-model="versionData.addrVersion" placeholder="请输入地址版本号" />
        </el-form-item>
        <el-form-item label="安卓下载地址">
          <el-input v-model="versionData.androidUrl" placeholder="请输入安卓下载地址" />
        </el-form-item>
        <el-form-item label="热更新下载地址">
          <el-input v-model="versionData.updateUrl" placeholder="请输入热更新下载地址" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="versionData.descval" rows="3" type="textarea" placeholder="请输入描述 " />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editVersionFn">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getVersionFn, editVersionFn } from '@/api/system.js'
export default {
  name: 'AppVersion',
  data() {
    return {
      versionData: {
        'addrVersion': '',
        'androidUrl': '',
        'appId': '',
        'appVersion': '',
        'descval': '',
        'id': '',
        'updateUrl': ''
      }
    }
  },
  beforeMount() {
    this.getVersionFn()
  },
  methods: {
    editVersionFn() {
      editVersionFn(this.versionData).then((res) => {
        const resData = this.resDataFn(res)
        if (resData == '000') {
          this.$message({
            showClose: true,
            message: '修改成功！',
            type: 'success'
          })
        }
        this.getVersionFn()
      })
    },
    getVersionFn() {
      getVersionFn().then((res) => {
        const resData = this.resDataFn(res)
        if (typeof resData === 'object') {
          this.versionData = Object.assign({}, this.versionData, resData)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.form_box{
   padding: 50px 30px;
   background: #FFFFFF;
   min-height: 800px;
   .form{
     width: auto;
     max-width: 600px;
   }
}
</style>
