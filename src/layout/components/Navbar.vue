<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <div class="user_info">
        <span>{{ name }}</span>
      </div> -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <div class="user_info">
            <span style="color:#fff;">{{ name }}</span>
          </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { handleUnReadMessage, queryUnReadMessgae } from "@/api/order";

export default {
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

    // 查询未处理订单
    async getQueryUnprocessedOrder() {
      const res = await queryUnReadMessgae();
      let QueryUnprocessedOrder = res.data;
      QueryUnprocessedOrder.forEach((i) => {
        const item = this.$notify({
          title: "待操作",
          message: i.orderSn + i.message,
          type: "success",
          duration: 0,
          position: "bottom-right",
          onClick: async () => {
            const res = await handleUnReadMessage(i.id);
            if (res.message === "操作成功") {
              this.$router.push(
                "/maintenance/maintenance_order_desc?orderSn=" + i.orderSn
              );
              item.close();
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
          },
        });
        setTimeout(() => {
          item.close();
        }, 60000);
      });
    },
  },

  created() {
    this.getQueryUnprocessedOrder();
    setInterval(() => {
      this.getQueryUnprocessedOrder();
    }, 61000);
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
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
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
