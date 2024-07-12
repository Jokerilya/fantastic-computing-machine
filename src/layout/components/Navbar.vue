<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <div class="message">
        <el-popover placement="bottom" width="320" trigger="click">
          <div style="font-size: 12px">
            <div>
              <div
                style="
                  border-bottom: 1px solid #ababab;
                  padding: 4px 0;
                  cursor: pointer;
                "
                v-for="item in $messageList.repairMessgaeList"
                :key="item.id"
                @click="goToControls(item)"
              >
                <div style="display: flex; align-items: center">
                  <div style="color: #ababab">{{ item.createTime }}</div>
                </div>
                <div style="color: #409eff">
                  {{ item.message }}
                </div>
              </div>
            </div>
            <div style="color: #409eff; margin-top: 8px; text-align: center">
              <span style="cursor: pointer" @click="goToMessageList"
                >查看全部消息</span
              >
            </div>
          </div>
          <!-- <div>
            查看全部信息
          </div> -->
          <el-badge
            slot="reference"
            class="item"
            :value="$messageList.repairMessgaeListTotal"
            :max="99"
          >
            <div style="width: 23px; height: 23px">
              <el-image
                src="https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20240701/VC41071633.png"
              >
              </el-image>
            </div>
          </el-badge>
        </el-popover>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <div class="user_info">
            <span style="color: #fff">{{ name }}</span>
          </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { queryRepairMessgae, handleUnReadMessage } from "@/api/order";

export default {
  data() {
    return {};
  },
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["name", "sidebar", "avatar"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login`);
    },
    // 默认拿最新未读信息5条
    async queryRepairMessgae() {
      const res = await queryRepairMessgae({
        pageNo: 1,
        pageSize: 5,
        status: 0,
      });
      Vue.prototype.$messageList.repairMessgaeListTotal = res.data.total;
      Vue.prototype.$messageList.repairMessgaeList = res.data.records;
    },
    // 跳转信息列表
    goToMessageList() {
      this.$router.push({
        name: "messageList",
      });
    },
    // 前往操作
    async goToControls(row) {
      if (
        row.module == "order" ||
        row.module == "enterprise" ||
        row.module == "master" ||
        row.module == "product_consult" ||
        row.module == "butler_order"
      ) {
        if (row.module == "order") {
          this.$router.push({
            name: "maintenance_order_desc",
            query: {
              orderSn: row.orderSn,
              // 为了详情刷新 需要加一个id
              id: Math.floor(Math.random() * (999 - 100 + 1)) + 100,
            },
          });
        }
        if (row.module == "enterprise") {
          this.$router.push({
            name: "enterpriseList",
          });
        }
        if (row.module == "master") {
          this.$router.push({
            name: "worker",
          });
        }
        if (row.module == "product_consult") {
          this.$router.push("/activity/message");
        }
        if (row.module == "butler_order") {
          this.$router.push(
            `/maintenance/customerDetail?orderSn=${row.orderSn}&id=${
              Math.floor(Math.random() * (999 - 100 + 1)) + 100
            }`
          );
        }
        const res = await handleUnReadMessage(row.id);
        if (res.message == "操作成功") {
          this.queryRepairMessgae();
        }
      }
    },
  },
  created() {
    this.queryRepairMessgae();
    if (!Vue.prototype.$messageList.intervalId) {
      Vue.prototype.$messageList.intervalId = setInterval(
        this.queryRepairMessgae,
        1 * 60 * 1000
      );
    }
  },
  beforeDestroy() {
    if (Vue.prototype.$messageList.intervalId) {
      Vue.prototype.$messageList.intervalId = null;
      Vue.prototype.$messageList.repairMessgaeListTotal = null;
      Vue.prototype.$messageList.repairMessgaeList = null;
      clearInterval(Vue.prototype.$messageList.intervalId);
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #3d3d3d;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .user_info {
    float: left;
    margin-right: 15px;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .message {
      margin-right: 30px;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      cursor: pointer;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        img {
          float: left;
          margin-right: 10px;
          margin-top: 5px;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -6px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
