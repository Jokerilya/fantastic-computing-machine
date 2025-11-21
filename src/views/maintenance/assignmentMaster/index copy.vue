<template>
  <div class="assignmentMasterBox">
    <div id="map-container" ref="mapContainer"></div>

    <div class="acceptOrdersMaster">
      <div class="title">
        附近共有<span class="num">{{ masters.length }}</span
        >位师傅接单
      </div>
      <div class="masterListBox">
        <div class="masterItem" v-for="item in masters" :key="item.name">
          <div class="masterItem_left">
            <div class="masterAvatar">
              <img
                src="https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20240723/UN96809320.jpg"
                alt=""
              />
            </div>
          </div>
          <div class="masterItem_right">
            <div class="masterName">
              <div>{{ item.name }}</div>
              <el-button type="text" style="font-size: 14px"> 指派 </el-button>
            </div>
            <div class="masterInfo">服务次数：{{ item.num }}次</div>
            <div class="masterInfo">服务区域：{{ item.area }}</div>
            <div class="masterInfo">服务技能：{{ item.skill }}</div>
          </div>
        </div>
      </div>
      <!-- 底部切换页 -->
      <div class="paginationBox">
        <el-pagination layout="prev, pager, next" :total="50"> </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TianDiMap",
  props: {
    company: {
      type: Object,
      default: () => ({
        name: "广东机将信息科技有限公司",
        lng: 113.7003,
        lat: 22.93421,
      }),
    },
  },
  data() {
    return {
      map: null,
      tiandituKey: "299cdd394ec7f801437bbf1f8595a262",
      overlays: [],
      masters: [
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
          num: 60,
          area: "桥头镇、石排镇、企石镇",
          skill: "加工中心/龙门式加工中心/三轴、加工中心/龙门式加工中心/四轴",
        },
        {
          name: "吴师傅",
          lng: 113.703,
          lat: 22.936,
          num: 25,
          area: "大岭山镇、长安镇、茶山镇",
          skill: "数控车床/排刀机/排刀式、数控车床/排刀机/简易车铣",
        },
      ],
    };
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    this.clearOverlays();
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  },
  watch: {
    masters: {
      handler(newList) {
        this.updateMasters(newList);
      },
      deep: true,
    },
  },
  methods: {
    initMap() {
      // 检查是否已加载
      if (window.T) {
        this._doInitMap();
        return;
      }

      const scriptId = "tianditu-script";
      if (document.getElementById(scriptId)) {
        // 如果脚本已存在但T还未定义，等待一下
        setTimeout(() => {
          if (window.T) {
            this._doInitMap();
          } else {
            this.retryInitMap();
          }
        }, 500);
        return;
      }

      // 使用更稳定的 API 加载方式
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${this.tiandituKey}`;
      script.onload = () => {
        // 给 API 一些初始化时间
        setTimeout(() => {
          this._doInitMap();
        }, 100);
      };
      script.onerror = (e) => {
        console.error("天地图 API 加载失败:", e);
        this.retryInitMap();
      };
      document.head.appendChild(script);
    },

    retryInitMap() {
      console.log("尝试重新初始化地图...");
      setTimeout(() => {
        this.initMap();
      }, 2000);
    },

    _doInitMap() {
      if (!window.T) {
        console.error("天地图 API 未正确加载");
        this.retryInitMap();
        return;
      }

      try {
        // 创建地图实例
        this.map = new T.Map(this.$refs.mapContainer, {
          projection: "EPSG:4326",
        });

        // 设置中心点和缩放级别
        const center = new T.LngLat(this.company.lng, this.company.lat);
        this.map.centerAndZoom(center, 16);

        // 方案1：使用矢量底图+矢量注记（推荐）
        this.addVectorLayers();

        // 方案2：如果方案1不行，尝试使用影像底图
        // this.addImageLayers();

        // 添加地图控件
        this.map.addControl(new T.Control.Zoom());
        this.map.addControl(new T.Control.MapType());

        // 添加标记
        this.addCompanyMarker(this.company);
        this.updateMasters(this.masters);

        console.log("地图初始化成功");
      } catch (error) {
        console.error("地图初始化失败:", error);
        this.retryInitMap();
      }
    },

    // 方案1：使用矢量图层
    addVectorLayers() {
      try {
        // 矢量底图
        const vecLayer = new T.TileLayer("vec", {
          projection: "EPSG:4326",
          maxZoom: 18,
          minZoom: 1,
        });

        // 矢量注记
        const cvaLayer = new T.TileLayer("cva", {
          projection: "EPSG:4326",
          maxZoom: 18,
          minZoom: 1,
        });

        // 简化的错误处理
        const handleTileError = (layerName) => (e) => {
          const el = document.querySelector(e.target.Ce.el);
          if (el) {
            el.style.display = "none";
          }
        };

        vecLayer.on("tileerror", handleTileError("底图"));
        cvaLayer.on("tileerror", handleTileError("注记"));

        this.map.addLayer(vecLayer);
        this.map.addLayer(cvaLayer);
      } catch (error) {
        console.error("添加矢量图层失败:", error);
        // 尝试使用影像图层作为备选
        this.addImageLayers();
      }
    },

    // 方案2：使用影像图层
    addImageLayers() {
      try {
        // 影像底图
        const imgLayer = new T.TileLayer("img", {
          projection: "EPSG:4326",
          maxZoom: 18,
          minZoom: 1,
        });

        // 影像注记
        const ciaLayer = new T.TileLayer("cia", {
          projection: "EPSG:4326",
          maxZoom: 18,
          minZoom: 1,
        });

        this.map.addLayer(imgLayer);
        this.map.addLayer(ciaLayer);

        console.log("使用影像图层作为备选方案");
      } catch (error) {
        console.error("添加影像图层失败:", error);
      }
    },

    addCompanyMarker(company) {
      try {
        const point = new T.LngLat(company.lng, company.lat);

        // 创建自定义图标
        const icon = new T.Icon({
          iconUrl:
            "https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20251104/HS43766082.png",
          iconSize: new T.Point(32, 32),
          iconAnchor: new T.Point(16, 32),
        });

        const marker = new T.Marker(point, { icon });
        this.map.addOverLay(marker);
        this.overlays.push(marker);

        // 添加标签
        const label = new T.Label({
          text: company.name,
          position: point,
          offset: new T.Point(0, -35),
        });

        this.map.addOverLay(label);
        this.overlays.push(label);
      } catch (error) {
        console.error("添加企业标记失败:", error);
      }
    },

    updateMasters(masters) {
      this.clearMasterMarkers();
      if (!Array.isArray(masters)) return;

      masters.forEach((master) => {
        if (!master.lng || !master.lat) return;

        try {
          const point = new T.LngLat(master.lng, master.lat);
          const icon = new T.Icon({
            iconUrl:
              "https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20251104/PW34165872.png",
            iconSize: new T.Point(32, 32),
            iconAnchor: new T.Point(16, 32),
          });

          const marker = new T.Marker(point, { icon });
          this.map.addOverLay(marker);
          this.overlays.push(marker);

          const label = new T.Label({
            text: master.name,
            position: point,
            offset: new T.Point(0, -35),
          });

          this.map.addOverLay(label);
          this.overlays.push(label);
        } catch (error) {
          console.error("添加师傅标记失败:", master, error);
        }
      });
    },

    clearMasterMarkers() {
      this.clearOverlays();
      // 重新添加企业标记
      if (this.map && this.company) {
        this.addCompanyMarker(this.company);
      }
    },

    clearOverlays() {
      this.overlays.forEach((overlay) => {
        try {
          if (this.map && overlay) {
            this.map.removeOverLay(overlay);
          }
        } catch (error) {
          console.warn("移除覆盖物失败:", error);
        }
      });
      this.overlays = [];
    },
  },
};
</script>

<style scoped lang="scss">
#map-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.assignmentMasterBox {
  position: relative;
}
.acceptOrdersMaster {
  z-index: 999;
  position: absolute;
  bottom: 150px;
  left: 20px;
  width: 400px;
  height: 750px;
  /* background-color: rgba(255, 255, 255, 0.8); */
  background-color: #fff;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 20px;
  .title {
    font-size: 15px;
    margin-bottom: 15px;
    background-color: #d5e6ff;
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    .num {
      color: #2670eb;
      font-size: 25px;
      margin: 0 5px;
    }
  }
  .masterListBox {
    height: 600px;
    overflow-y: auto;
    .masterItem {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      .masterItem_left {
        margin-right: 15px;
        .masterAvatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .masterItem_right {
        flex: 1;
        .masterName {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .masterInfo {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
      }
    }
  }
  .paginationBox {
    background-color: #fff;
    height: 50px;
    position: absolute;
    bottom: 10px;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
}
</style>