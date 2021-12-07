<template>
  <div class="content_box">
    <first-title title="Banner" />
    <div class="select_view">
      <el-button type="primary" @click="addDataFn"
        ><i class="el-icon-plus" />添加Banner</el-button
      >
      <span class="mg_l15" style="color: #f56c6c"
        >注意：“修改”和“添加”Banner后需要点击右侧“提交编辑”按钮才会生效哦！</span
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="ID"
        width="60px"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
          <span
            v-if="!scope.row.id"
            class="delete_icon"
            @click="deleteAddFn(scope.$index)"
            ><i class="el-icon-delete"
          /></span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" header-align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.name"
            type="text"
            placeholder="请输入名称"
          />
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="220">
        <template slot-scope="scope">
          <upload-img
            width="200px"
            height="100px"
            :img="scope.row.imgUrl"
            @uploadSuc="uploadSucFn($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="事件类型" align="center" header-align="center" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.eventType" placeholder="请选择">
            <el-option
              v-for="item in eventTypes"
              :key="item.event"
              :label="item.name"
              :value="item.event"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="事件类型值(id或网址)"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.eventParam" />
        </template>
      </el-table-column>
      <el-table-column label="广告位置" align="center" header-align="center" width="200">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.positionType"
            placeholder="请选择广告位置"
          >
            <el-option
              v-for="item in positionTypes"
              :key="item.event"
              :label="item.name"
              :value="item.event"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="排序(越小越前)"
        align="center"
        header-align="center" width="160"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort"
            type="number"
            placeholder="请输入排序"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="状态(开启/关闭)"
        align="center"
        header-align="center" width="120"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.id == undefined"
            @change="statusChangeFn($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="200"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="editBankTypeFn(scope.row)"
            >提交编辑</el-button
          >
          <el-button
            v-if="scope.row.id"
            type="danger"
            size="small"
            @click="delItemFn(scope.row.id)"
            ><i class="el-icon-delete" />删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import uploadImg from "@/components/uploadImg/upload-img.vue";
import { queryBannerFn, editBannerFn, delBannerFn } from "@/api/activity";
export default {
  name: "Banner",
  components: {
    uploadImg,
  },
  data() {
    return {
      dataList: [],
      positionType: [
        // 1首页 2商学院
        { name: "首页", val: 1 },
        // { name: "商学院", val: 2 },
      ],
      editData: {
        name: "",
        id: "",
        sort: "",
        imgUrl: "",
        status: 1,
        eventParam: "",
        eventType: "",
        positionType: "",
      },
      dataConfig: {
        loading: true,
      },
      positionTypes: [
        {
          event: 1,
          name: "小程序首页",
        },
        {
          event: 2,
          name: "PC官网首页",
        },
        {
          event: 3,
          name: "PC商城首页",
        },
        {
          event: 4,
          name: "PC商城-智推装机",
        },
        {
          event: 5,
          name: "PC商城-机将星选",
        },
        {
          event: 6,
          name: "PC商城-拼团",
        },
        {
          event: 7,
          name: "PC商城-机将机件",
        },
        {
          event: 8,
          name: "小程序-tab机云",
        },
        {
          event: 9,
          name: "小程序首页-星选",
        },
        {
          event: 10,
          name: "小程序首页-配件",
        },
        {
          event: 11,
          name: "PC人才首页",
        },
        {
          event: 12,
          name: "小程序商城首页头部",
        },
        {
          event: 13,
          name: "小程序商城首页活动中部",
        }
      ],
      eventTypes: [
        {
          event: 1,
          name: "普通商品",
        },
        {
          event: 2,
          name: "装机产品",
        },
        {
          event: 3,
          name: "页面外链",
        },
      ],
    };
  },
  beforeMount() {
    this.getDataListFn();
  },
  methods: {
    editBankTypeFn(row) {
      editBannerFn(
        Object.assign({}, row, {
          status: row.status ? 1 : 0,
          createTime: undefined,
        })
      ).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.getDataListFn();
        }
      });
    },
    addDataFn() {
      this.dataList.unshift(Object.assign({}, this.editData));
    },
    deleteAddFn(index) {
      this.dataList.splice(index, 1);
    },
    delItemFn(id) {
      this.deleteAlert()
        .then(() => {
          const res = delBannerFn({ id: id });
          return res;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.getDataListFn();
          }
        });
    },
    uploadSucFn(img, index) {
      this.$set(
        this.dataList,
        index,
        Object.assign({}, this.dataList[index], { imgUrl: img })
      );
    },
    statusChangeFn(val, index) {
      let editData = this.dataList[index];
      editBannerFn(
        Object.assign({}, editData, {
          status: val ? 1 : 0,
          createTime: undefined,
        })
      )
        .then((res) => {
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
          } else {
            this.dataList[index].status = !val;
          }
        })
        .catch(() => {
          this.dataList[index].status = !val;
        });
    },
    getDataListFn() {
      queryBannerFn().then((res) => {
        const resData = this.resDataFn(res);
        this.dataList = resData;
      });
    },
  },
};
</script>

<style lang="scss"></style>
