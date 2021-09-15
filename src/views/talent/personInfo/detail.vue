<template>
  <div class="content_box">
    <first-title :title="personId === 0 ? '新增精英列表' : '编辑精英列表'" />
    <div class="bg-white" style="padding: 50px 20px">
      <el-form ref="form" :rules="rules" label-width="180px" :model="formdata">
        <el-form-item label="精英名称：" prop="name">
          <el-input
            style="width: 250px"
            v-model="formdata.name"
            placeholder="请输入精英名称"
          />
        </el-form-item>
        <el-form-item
          class="float_item"
          style="height: auto"
          label="精英头像:"
          prop="headUrl"
        >
          <upload-img
            width="80px"
            height="80px"
            :img="formdata.headUrl"
            @uploadSuc="uploadSucFn"
          />
        </el-form-item>
        <el-form-item label="精英电话：" prop="phone">
          <el-input
            style="width: 250px"
            v-model="formdata.phone"
            placeholder="请输入精英电话"
          />
        </el-form-item>
        <el-form-item label="精英学历：" prop="education">
          <el-select v-model="formdata.education" placeholder="请选择精英学历">
            <el-option
              v-for="(item, i) in typeList"
              :key="i"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序(越小越前)：" prop="sort">
          <el-input
            type="number"
            style="width: 250px"
            v-model="formdata.sort"
            placeholder="请输入排序数"
          />
        </el-form-item>
        <el-form-item label="工作时间：" prop="workTime">
          <el-input
            type="number"
            style="width: 250px"
            v-model="formdata.workTime"
            placeholder="请输入精英工作时间"
          />
        </el-form-item>
        <el-form-item label="精英级别：" prop="level">
          <el-select v-model="formdata.level" placeholder="请选择精英级别">
            <el-option :label="'高级技工'" :value="3"></el-option>
            <el-option :label="'初级技工'" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="精英年龄：" prop="age">
          <el-input
            type="number"
            style="width: 250px"
            v-model="formdata.age"
            placeholder="请输入精英年龄"
          />
        </el-form-item>
        <el-form-item style="clear: both" label="精英擅长：">
          <el-table
            class="list_table"
            :data="formdata.lables"
            border
            style="width: 560px"
          >
            <el-table-column label="精英擅长领域(例如:CNC数控大师)" width="250">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.name"
                  class="spec_name"
                  placeholder="填写精英擅长信息"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              header-align="center"
              min-width="300"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="delListFn(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button
            size="small"
            icon="el-icon-plus"
            style="margin-top: 15px"
            type="primary"
            @click="addListItemFn"
            >添加精英擅长信息</el-button
          >
        </el-form-item>
        <el-form-item style="clear: both" label="精英工作经历：">
          <el-table
            class="list_table"
            :data="formdata.experience"
            border
            style="width: 100%"
          >
            <el-table-column label="公司名称" width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.companyName"
                  class="spec_name"
                  placeholder="填写公司名称"
                />
              </template>
            </el-table-column>
            <el-table-column label="工作职位" width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.jobTitle"
                  class="spec_name"
                  placeholder="填写工作职位"
                />
              </template>
            </el-table-column>
            <el-table-column label="入职时间" width="300" align="center">
              <template slot-scope="scope">
                <el-date-picker
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  v-model="scope.row.entryTime"
                  type="date"
                  placeholder="入职时间"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="工作描述" min-width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="scope.row.workDescription"
                  class="spec_name"
                  placeholder="填写工作描述"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              header-align="center"
              width="300"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="delworklistFn(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button
            size="small"
            icon="el-icon-plus"
            style="margin-top: 15px"
            type="primary"
            @click="addworkItemFn"
            >添加精英工作经历</el-button
          >
        </el-form-item>
        <el-form-item style="clear: both" label="精英个人优势：" prop="summary">
          <el-input
            style="width: 400px"
            type="textarea"
            :rows="8"
            placeholder="请输入精英个人优势"
            v-model="formdata.summary"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            class="mr10"
            plain
            @click="$router.push({ name: 'personList' })"
            >取消</el-button
          >
          <el-button type="primary" :disabled="submitIng" @click="submit">{{
            submitIng ? "提交中..." : "确认提交"
          }}</el-button>
          <span v-show="submitIng" style="margin-left: 15px; color: #f56c6c"
            >提交中,请勿重复点击!</span
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getPersonnelInfo, editPersonnelInfo } from "@/api/talent.js";
import uploadImg from "@/components/uploadImg/upload-img.vue";
import Tinymce from "@/components/Tinymce";
export default {
  name: "",
  components: {
    Tinymce,
    uploadImg,
  },
  props: {},
  data() {
    return {
      personId: "",
      submitIng: false,
      typeList: [
        { value: "小学", name: "小学" },
        { value: "初中", name: "初中" },
        { value: "高中", name: "高中" },
        { value: "大专", name: "大专" },
        { value: "本科", name: "本科" },
        { value: "研究生", name: "研究生" },
        { value: "硕士", name: "硕士" },
        { value: "博士", name: "博士" },
      ],
      formdata: {
        age: "",
        education: "",
        experience: [],
        headUrl: "",
        lables: [],
        level: "",
        name: "",
        phone: "",
        sort: "",
        summary: "",
        workTime: "",
      },
      rules: {},
    };
  },
  mounted() {
    let aaa = this.$route.query.personId;
    this.personId = Number(aaa);
    if (Number(aaa) !== 0) {
      this.getPersonDetail();
    }
  },
  created() {},
  activated() {},
  watch: {},
  methods: {
    //添加精英擅长列表
    addListItemFn() {
      this.formdata.lables.push({ name: "" });
    },
    //删除精英擅长列表
    delListFn(index) {
      this.formdata.lables.splice(index, 1);
    },
    //添加精英工作经历列表
    addworkItemFn() {
      this.formdata.experience.push({
        companyName: "",
        entryTime: "",
        jobTitle: "",
        workDescription: "",
      });
    },
    //删除精英工作经历列表
    delworklistFn(index) {
      this.formdata.experience.splice(index, 1);
    },
    //submit
    submit() {
      let arr = [];
      const postData = { ...this.formdata };
      postData.id = this.personId;
      postData.age = Number(postData.age);
      postData.level = Number(postData.level);
      postData.sort = Number(postData.sort);
      postData.workTime = Number(postData.workTime);
      postData.experience = JSON.stringify(postData.experience);
      postData.lables.map((item) => {
        arr.push(item.name);
      });
      let str = arr.toString();
      postData.lables = str;
      this.submitIng = true;
      editPersonnelInfo(postData)
        .then((res) => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: this.personId === 0 ? "新增成功！" : "编辑成功！",
              type: "success",
            });
            this.$router.go(-1);
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
        });
    },
    //获取详情
    getPersonDetail() {
      if (this.personId == 0) return;
      getPersonnelInfo(this.personId).then((res) => {
        const resData = this.resDataFn(res);
        this.formdata.age = resData.age;
        this.formdata.education = resData.education;
        this.formdata.experience = resData.experienceList;
        this.formdata.headUrl = resData.headUrl;
        this.formdata.level = resData.level;
        this.formdata.name = resData.name;
        this.formdata.phone = resData.phone;
        this.formdata.sort = resData.sort;
        this.formdata.summary = resData.summary;
        this.formdata.workTime = resData.workTime;
        let arr = [];
        resData.lableList.map(item=>{
          let obj = {}
          obj.name = item
          arr.push(obj)
        })
        this.formdata.lables = arr
      });
    },
    //图片上传返回
    uploadSucFn(img) {
      this.formdata.headUrl = img;
    },
  },
};
</script>

<style lang="scss">
</style>
