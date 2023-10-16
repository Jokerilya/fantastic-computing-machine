<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <router-view :key="key" /> -->
      <keep-alive :include="cachedViews">
        <!--这个是新增的-->
        <router-view></router-view>
      </keep-alive>
    </transition>

    <!-- 做一个客服操作的提示 -->
    <div class="serviceTip">
      <ServiceTip></ServiceTip>
    </div>
  </section>
</template>

<script>
import ServiceTip from "../components/ServiceTip.vue";
export default {
  name: "AppMain",
  components: {
    ServiceTip,
  },
  computed: {
    key() {
      return this.$route.path;
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
  },
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 85px);
  width: 100%;
  position: relative;
  overflow: auto;
}
.fixed-header + .app-main {
  padding-top: 50px;
}

.serviceTip {
  z-index: 4;
  position: fixed;
  right: 0px;
  bottom: 0px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
