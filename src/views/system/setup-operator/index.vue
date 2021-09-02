<template>
  <div class="content_box">
    <first-title title="系统操作员管理" />
    <div class="select_view">
      <el-button type="primary" @click="addDataFn"
        ><i class="el-icon-plus" />添加系统操作员</el-button
      >
      <span class="mg_l15" style="color: #f56c6c"
        >注意：“修改”和“添加”系统操作员项目后需要点击右侧“提交编辑”按钮才会生效哦，登录密码如果不修改可以不填！</span
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column label="ID" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.id">{{ scope.row.id }}</span>
          <span
            v-if="!scope.row.id"
            class="delete_icon"
            @click="deleteAddFn(scope.$index)"
            ><i class="el-icon-delete"
          /></span>
        </template>
      </el-table-column>
      <el-table-column label="管理员头像" width="100px" align="center">
        <template slot-scope="scope">
          <upload-img
            width="60px"
            height="60px"
            :radius="true"
            :img="scope.row.portrait"
            @uploadSuc="uploadSucFn($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="管理员账号">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.userAccount"
            placeholder="请输入用户账号"
          />
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <el-select v-model="scope.row.roleId" placeholder="请选择角色名称">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.realName" placeholder="请输入真实姓名" />
        </template>
      </el-table-column>
      <el-table-column label="状态(启用/禁用)" align="center" width="140px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :disabled="scope.row.id == undefined"
            @change="statusChangeFn($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="联系电话">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.telPhone"
            maxlength="11"
            placeholder="请输入联系电话"
          />
        </template>
      </el-table-column>
      <el-table-column label="密码(不填及不修改)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.passWord" placeholder="请输入密码" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editDataFn(scope.row)"
            >提交编辑</el-button
          >
          <el-button
            v-if="scope.row.id"
            type="danger"
            size="small"
            @click="deleteFn(scope)"
            ><i class="el-icon-delete" />删除</el-button
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
  </div>
</template>

<script>
import uploadImg from "@/components/uploadImg/upload-img.vue";
import {
  userListFn,
  userDetailFn,
  addOrUpdateFn,
  removeUserFn,
  roleListFn,
  updateStatusFn,
} from "@/api/system.js";
import { mapGetters } from "vuex";
import md5 from "js-md5";
export default {
  name: "SetupOperator",
  components: {
    uploadImg,
  },
  data() {
    return {
      dataList: [],
      roles: [],
      editData: {
        portrait:
          "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
        realName: "",
        roleId: "",
        status: true,
        telPhone: "",
        userAccount: "",
      },
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
    };
  },
  beforeMount() {
    this.roleListFn();
    this.userListFn();
  },
  computed: {
    ...mapGetters(["name"]),
    apiHost() {
      return process.env.VUE_APP_BASE_API;
    },
  },
  methods: {
    roleListFn() {
      roleListFn({
        pageNo: 1,
        pageSize: 100,
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.roles.splice(0, this.roles.length, ...resData.records);
      });
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.userListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.userListFn();
    },
    statusChangeFn(val, index) {
      updateStatusFn({
        id: this.dataList[index].id,
        status: val ? 1 : 0,
      })
        .then((res) => {
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
          }
          this.userListFn();
        })
        .catch(() => {
          this.dataList[index].status = !val;
        });
    },
    deleteFn(scope) {
      this.deleteAlert()
        .then(() => {
          const resData = removeUserFn({ id: scope.row.id });
          return resData;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.userListFn();
          }
        });
    },
    uploadSucFn(img, index) {
      this.$set(
        this.dataList,
        index,
        Object.assign({}, this.dataList[index], { portrait: img })
      );
    },
    editDataFn(val) {
      const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (val.telPhone.length != 11) {
        this.$message({
          showClose: true,
          message: "请输入11位手机号！",
          type: "warning",
        });
        return;
      } else if (!reg.test(val.telPhone)) {
        this.$message({
          showClose: true,
          message: "请输入正确的手机号！",
          type: "warning",
        });
        return;
      }
      addOrUpdateFn({
        id: val.id,
        portrait: val.portrait,
        realName: val.realName,
        roleId: val.roleId,
        telPhone: val.telPhone,
        passWord: val.passWord ? md5(val.passWord) : undefined,
        userAccount: val.userAccount,
      }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.userListFn();
        }
      });
    },
    addDataFn() {
      this.dataList.unshift(Object.assign({}, this.editData));
    },
    deleteAddFn(index) {
      this.dataList.splice(index, 1);
    },
    userDetailFn() {
      this.dataList.forEach((item, index) => {
        if (item.id) {
          userDetailFn({ id: item.id }).then((res) => {
            const resData = this.resDataFn(res);
            this.$set(
              this.dataList,
              index,
              Object.assign({}, item, {
                roleId: resData.roleId || 1,
              })
            );
          });
        }
      });
    },
    userListFn() {
      userListFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      }).then((res) => {
        const resData = this.resDataFn(res);
        resData.records.forEach((item) => {
          item.status = item.status == 1;
        });
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
        this.userDetailFn();
      });
    },
  },
};
</script>

<style lang="scss">
.user_head {
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  background: #ddd;
  .upload {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url("../../../assets/upload.png") no-repeat center / 100% 100%;
    font-size: #fff;
    text-align: center;
    line-height: 50px;
    display: none;
  }
  &:hover {
    .upload {
      display: block;
    }
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
