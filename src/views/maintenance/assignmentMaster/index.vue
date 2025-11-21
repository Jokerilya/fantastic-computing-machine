<template>
  <div class="assignmentMasterBox">
    <!-- 地图容器：fixed 布局防止 vh 溢出 -->
    <div id="map-container" ref="mapContainer"></div>

    <!-- 接单师傅浮层 -->
    <div class="acceptOrdersMaster">
      <div class="title">
        附近共有<span class="num">{{ masters.length }}</span
        >位师傅接单
      </div>

      <!-- 列表区域：flex 自适应高度，避免绝对定位导致的布局问题 -->
      <div class="masterListBox">
        <div class="masterItem" v-for="item in masters" :key="item.name">
          <div class="masterItem_left">
            <div class="masterAvatar">
              <!-- 支持动态头图，兜底默认图 -->
              <img
                :src="item.avatar || ICONS.defaultAvatar"
                alt="头像"
                loading="lazy"
              />
            </div>
          </div>
          <div class="masterItem_right">
            <div class="masterName">
              <div>{{ item.name }}</div>
              <!-- 按钮样式优化：更符合科技感 & 可点击反馈 -->
              <el-button
                type="primary"
                size="mini"
                @click="handleAssign(item)"
                style="font-size: 14px"
              >
                指派
              </el-button>
            </div>
            <div class="masterInfo">服务次数：{{ item.num }}次</div>
            <div class="masterInfo">服务区域：{{ item.area }}</div>
            <!-- ✅ 技能标签化：更美观、易读 -->
            <div class="masterInfo">
              服务技能：
              <el-tag
                v-for="skill in splitSkills(item.skill)"
                :key="skill"
                size="small"
                effect="light"
                style="margin-right: 4px; margin-top: 2px"
              >
                {{ skill }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="paginationBox">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="10"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 🔔 注意：本组件专为 Vue2 + 天地图 API 4.0 设计
// 坐标系说明：手机 GPS 为 WGS-84；天地图底图用 GCJ-02（火星坐标），必须转换！
import coordTransform from "@/utils/coordTransform";
export default {
  name: "TianDiMap",
  props: {
    company: {
      type: Object,
      default: () => ({
        name: "广东机将信息科技有限公司",
        lng: 113.7003, // WGS-84 原始坐标
        lat: 22.93421,
      }),
    },
    // 可扩展：支持外部传入师傅列表（便于父组件控制）
    mastersData: {
      type: Array,
      default: () => [],
    },
    // 地图Key建议通过环境变量注入，避免硬编码泄露
    tiandituKey: {
      type: String,
      default:
        process.env.VUE_APP_TIANDITU_KEY || "299cdd394ec7f801437bbf1f8595a262",
    },
  },
  data() {
    return {
      map: null,
      // ✅ 图标URL统一管理，便于维护和换肤
      ICONS: {
        company:
          "https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20251104/HS43766082.png",
        master:
          "https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20251104/PW34165872.png",
        defaultAvatar:
          "https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20240723/UN96809320.jpg",
      },
      // 📍 分层管理覆盖物：避免企业标记被误删
      companyOverlays: [], // [marker, label]
      masterOverlays: [], // 所有师傅的 marker + label

      // ✅ 支持 props 数据驱动（更符合组件化思想）
      masters: [],
      total: 100, // 实际应由接口返回
      // loading: false, // 骨架屏开关（预留）
    };
  },
  created() {
    // 初始化防抖函数（避免频繁更新标记）
    this.debounceUpdateMasters = this.$utils
      ? this.$utils.debounce
      : this.makeDebounce(300);

    // 同步外部传入数据
    this.masters = this.mastersData.length
      ? this.mastersData
      : this.getMockMasters();
  },
  mounted() {
    console.log("🚀 mapContainer:", this.$refs.mapContainer);
    this.initMap();
  },
  beforeDestroy() {
    // Vue2 生命周期钩子（若升级 Vue3 可改用 beforeUnmount）
    this.destroyMap();
  },
  watch: {
    // 监听外部传入数据变化
    mastersData: {
      handler(newVal) {
        if (Array.isArray(newVal)) {
          this.masters = newVal;
          this.debounceUpdateMasters(newVal);
        }
      },
      immediate: true,
    },
    // 仅当 masters 引用变化时触发（避免 deep 监听性能开销）
    masters(newVal) {
      this.debounceUpdateMasters(newVal);
    },
  },
  methods: {
    // =============== 🌐 地图初始化 ===============
    initMap() {
      if (window.T) {
        this._doInitMap();
        return;
      }

      const scriptId = "tianditu-script";
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        // 脚本已加载，等待 API 就绪
        const checkT = () => {
          if (window.T) {
            this._doInitMap();
          } else {
            setTimeout(checkT, 200);
          }
        };
        checkT();
        return;
      }

      // 动态加载天地图 SDK
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${this.tiandituKey}`;
      script.onload = () => {
        // 给 SDK 100ms 初始化缓冲
        setTimeout(() => this._doInitMap(), 100);
      };
      script.onerror = () => {
        console.error("[天地图] SDK 加载失败");
        this.$message.error("地图服务初始化失败，请检查网络或稍后重试");
      };
      document.head.appendChild(script);
    },

    _doInitMap() {
      if (!window.T) {
        console.error("[天地图] window.T 未定义");
        return;
      }

      try {
        console.log("[天地图] 开始创建地图实例...");

        this.map = new T.Map(this.$refs.mapContainer, {
          projection: "EPSG:4326",
        });

        console.log("[天地图] 地图实例创建成功");

        // 设置中心点
        const { lng, lat } = this.gcj02FromWgs84(
          this.company.lng,
          this.company.lat
        );
        const center = new T.LngLat(lng, lat);
        this.map.centerAndZoom(center, 16);

        console.log("[天地图] 地图中心设置成功");

        // 添加图层
        this.addVectorLayers();
        console.log("[天地图] 图层添加成功");

        // 添加控件
        this.map.addControl(new T.Control.Zoom());
        this.map.addControl(new T.Control.MapType());
        console.log("[天地图] 控件添加成功");

        // 添加标记
        this.addCompanyMarker(this.company);
        this.updateMasters(this.masters);
        console.log("[天地图] 标记添加成功");
      } catch (error) {
        console.error("[天地图] 初始化失败:", error);
        this.$message.error("地图初始化失败：" + (error.message || "未知错误"));
      }
    },

    // =============== 🗺️ 图层管理 ===============
    addVectorLayers() {
      try {
        const vec = new T.TileLayer("vec", { maxZoom: 18 });
        const cva = new T.TileLayer("cva", { maxZoom: 18 });

        // 简化 tileerror 处理（静默跳过错误瓦片）
        const hideOnError = (e) => {
          const el = e.target?.Ce?.el;
          if (el && el.style) el.style.display = "none";
        };
        vec.on("tileerror", hideOnError);
        cva.on("tileerror", hideOnError);

        this.map.addLayer(vec);
        this.map.addLayer(cva);
      } catch (err) {
        console.warn("[天地图] 矢量图层失败，降级为影像图层", err);
        this.addImageLayers();
      }
    },

    addImageLayers() {
      try {
        const img = new T.TileLayer("img", { maxZoom: 18 });
        const cia = new T.TileLayer("cia", { maxZoom: 18 });
        this.map.addLayer(img);
        this.map.addLayer(cia);
      } catch (err) {
        console.error("[天地图] 影像图层也失败", err);
      }
    },

    // =============== 📍 覆盖物管理 ===============
    addCompanyMarker(company) {
      try {
        // ✅ 坐标转换！
        console.log("[坐标] 原始:", company.lng, company.lat);
        const { lng, lat } = this.gcj02FromWgs84(company.lng, company.lat);
        console.log("[坐标] 转换后:", lng, lat);

        if (isNaN(lng) || isNaN(lat)) {
          console.error("坐标转换失败", company);
          return;
        }
        const point = new T.LngLat(lng, lat);

        const icon = new T.Icon({
          iconUrl: this.ICONS.company,
          iconSize: new T.Point(32, 32),
          iconAnchor: new T.Point(16, 32),
        });

        const marker = new T.Marker(point, { icon });
        const label = new T.Label({
          text: company.name,
          position: point,
          offset: new T.Point(0, -35),
          textStyle: { color: "#1890ff", fontSize: "12px" },
        });

        this.map.addOverLay(marker);
        this.map.addOverLay(label);
        this.companyOverlays = [marker, label];

        // 📌 预留：点击企业标记回调
        marker.addEventListener("click", () => {
          this.$emit("company-click", company);
        });
      } catch (err) {
        console.error("[标记] 添加企业失败", err);
      }
    },

    updateMasters(masters) {
      this.clearMasterMarkers(); // 只清师傅，不碰企业

      if (!Array.isArray(masters) || masters.length === 0) return;

      masters.forEach((master) => {
        if (!master.lng || !master.lat) return;

        try {
          // ✅ 坐标转换！
          const { lng, lat } = this.gcj02FromWgs84(master.lng, master.lat);
          const point = new T.LngLat(lng, lat);

          const icon = new T.Icon({
            iconUrl: this.ICONS.master,
            iconSize: new T.Point(28, 28), // 略小，避免遮挡
            iconAnchor: new T.Point(14, 28),
          });

          const marker = new T.Marker(point, { icon, title: master.name });
          const label = new T.Label({
            text: master.name,
            position: point,
            offset: new T.Point(0, -30),
            textStyle: { fontSize: "11px", color: "#666" },
          });

          this.map.addOverLay(marker);
          this.map.addOverLay(label);
          this.masterOverlays.push(marker, label);

          // 📌 预留：点击师傅标记回调（如高亮列表项）
          marker.addEventListener("click", () => {
            this.$emit("master-click", master);
            // 可滚动列表到对应项：this.scrollToMaster(master)
          });
        } catch (err) {
          console.warn("[标记] 添加师傅失败", master.name, err);
        }
      });
    },

    clearMasterMarkers() {
      this.masterOverlays.forEach((overlay) => {
        try {
          this.map?.removeOverLay(overlay);
        } catch (e) {
          /* 忽略 */
        }
      });
      this.masterOverlays = [];
    },

    destroyMap() {
      // 安全销毁：先清覆盖物，再 destroy
      this.clearMasterMarkers();
      this.companyOverlays.forEach((o) => this.map?.removeOverLay(o));
      if (this.map) {
        this.map.destroy();
        this.map = null;
      }
    },

    // =============== 🧭 坐标转换（WGS-84 → GCJ-02）==============
    // 来源：coordtransform 开源算法（MIT），轻量无依赖
    gcj02FromWgs84(lng, lat) {
      if (this.outOfChina(lat, lng)) return { lat, lng };
      const a = 6378245.0;
      const ee = 0.006693421622965943;

      function transformLat(x, y) {
        let ret =
          -100.0 +
          2.0 * x +
          3.0 * y +
          0.2 * y * y +
          0.1 * x * y +
          0.2 * Math.sqrt(Math.abs(x));
        ret +=
          ((20.0 * Math.sin(6.0 * x * Math.PI) +
            20.0 * Math.sin(2.0 * x * Math.PI)) *
            2.0) /
          3.0;
        ret +=
          ((20.0 * Math.sin(y * Math.PI) +
            40.0 * Math.sin((y / 3.0) * Math.PI)) *
            2.0) /
          3.0;
        ret +=
          ((160.0 * Math.sin((y / 12.0) * Math.PI) +
            320 * Math.sin((y * Math.PI) / 30.0)) *
            2.0) /
          3.0;
        return ret;
      }

      function transformLng(x, y) {
        let ret =
          300.0 +
          x +
          2.0 * y +
          0.1 * x * x +
          0.1 * x * y +
          0.1 * Math.sqrt(Math.abs(x));
        ret +=
          ((20.0 * Math.sin(6.0 * x * Math.PI) +
            20.0 * Math.sin(2.0 * x * Math.PI)) *
            2.0) /
          3.0;
        ret +=
          ((20.0 * Math.sin(x * Math.PI) +
            40.0 * Math.sin((x / 3.0) * Math.PI)) *
            2.0) /
          3.0;
        ret +=
          ((150.0 * Math.sin((x / 12.0) * Math.PI) +
            300.0 * Math.sin((x / 30.0) * Math.PI)) *
            2.0) /
          3.0;
        return ret;
      }

      let dLat = transformLat(lng - 105.0, lat - 35.0);
      let dLng = transformLng(lng - 105.0, lat - 35.0);

      const radLat = (lat / 180.0) * Math.PI;
      const magic = 1 - ee * Math.sin(radLat) * Math.sin(radLat);
      const sqrtMagic = Math.sqrt(magic);

      dLat =
        (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
      dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);

      return {
        lat: lat + dLat,
        lng: lng + dLng,
      };
    },

    outOfChina(lng, lat) {
      return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
    },

    // =============== 🛠️ 工具方法 ===============
    splitSkills(skillStr) {
      // 支持多种分隔符（兼顾你现有数据）
      return (skillStr || "")
        .split(/、|\/|\s+/)
        .filter((s) => s.trim())
        .map((s) => s.trim());
    },

    // 简易防抖（若项目无 lodash/$utils）
    makeDebounce(wait) {
      let timeout;
      return (func) => {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
      };
    },

    // =============== 🖱️ 交互事件 ===============
    handleAssign(master) {
      this.$emit("assign", master);
      // 示例：弹窗确认
      // this.$confirm(`确定指派任务给【${master.name}】？`, '指派确认', {
      //   type: 'warning'
      // }).then(() => { /* call API */ });
    },

    handlePageChange(page) {
      this.$emit("page-change", page);
      // 可触发分页加载
    },

    // =============== 🧪 Mock 数据（开发用）==============
    getMockMasters() {
      return [
        {
          name: "王师傅",
          lng: 113.71,
          lat: 22.935,
          num: 20,
          area: "茶山镇、石排镇、企石镇",
          skill: "数控车床/排刀机/排刀式、数控车床/排刀机/简易车铣",
        },
        {
          name: "陈师傅",
          lng: 113.702,
          lat: 22.929,
          num: 35,
          area: "横沥镇、桥头镇、大岭山镇",
          skill: "加工中心/立式加工中心/三轴、加工中心/立式加工中心/四轴",
        },
        {
          name: "林师傅",
          lng: 113.708,
          lat: 22.933,
          num: 50,
          area: "长安镇、茶山镇、石排镇",
          skill: "加工中心/龙门式加工中心/三轴、加工中心/龙门式加工中心/四轴",
        },
        {
          name: "李师傅",
          lng: 113.695,
          lat: 22.937,
          num: 15,
          area: "大岭山镇、桥头镇、企石镇",
          skill: "数控车床/排刀机/排刀式、数控车床/排刀机/简易车铣",
        },
        {
          name: "张师傅",
          lng: 113.699,
          lat: 22.928,
          num: 40,
          area: "横沥镇、长安镇、茶山镇",
          skill: "加工中心/立式加工中心/三轴、加工中心/立式加工中心/四轴",
        },
        {
          name: "周师傅",
          lng: 113.705,
          lat: 22.931,
          num: 25,
          area: "石排镇、企石镇、大岭山镇",
          skill: "加工中心/龙门式加工中心/三轴、加工中心/龙门式加工中心/四轴",
        },
        {
          name: "吴师傅",
          lng: 113.703,
          lat: 22.936,
          num: 30,
          area: "桥头镇、长安镇、茶山镇",
          skill: "数控车床/排刀机/排刀式、数控车床/排刀机/简易车铣",
        },
        {
          name: "郑师傅",
          lng: 113.707,
          lat: 22.93,
          num: 45,
          area: "大岭山镇、横沥镇、石排镇",
          skill: "加工中心/立式加工中心/三轴、加工中心/立式加工中心/四轴",
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
// 根容器全屏
.assignmentMasterBox {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

// 地图占满屏幕
#map-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

// 浮层面板
.acceptOrdersMaster {
  position: absolute;
  z-index: 1000;
  bottom: 20px;
  left: 20px;
  width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  .title {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    padding: 12px;
    background: linear-gradient(90deg, #e6f0ff, #d5e6ff);
    border-radius: 8px 8px 0 0;
    .num {
      color: #1890ff;
      font-size: 24px;
      font-weight: bold;
      margin: 0 6px;
    }
  }

  .masterListBox {
    height: calc(100% - 48px - 48px);
    overflow-y: auto;
    padding: 0 16px 16px;

    .masterItem {
      display: flex;
      padding: 14px 0;
      border-bottom: 1px solid #f5f7fa;

      &:last-child {
        border-bottom: none;
      }

      .masterItem_left {
        flex-shrink: 0;
        margin-right: 14px;
        .masterAvatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .masterItem_right {
        flex: 1;
        min-width: 0;

        .masterName {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .masterInfo {
          font-size: 13px;
          color: #606266;
          line-height: 1.6;
          margin-bottom: 8px;

          // 技能标签自动换行
          .el-tag {
            margin-bottom: 4px;
          }
        }
      }
    }
  }

  .paginationBox {
    flex-shrink: 0;
    padding: 12px 0;
    background: #fafafa;
    border-top: 1px solid #eee;
    text-align: center;
  }
}
</style>