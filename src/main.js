import Vue from "vue";
import { webName } from "./webConfig.js";
import webLogo from "./assets/logo.png"; // logo.png
import FirstTitle from "./components/First-title";
import vueMixin from "./vueMixin.js";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import service from './utils/request-axios'
import { Image, Model, Upload } from './components'
import uploadImg from "@/components/uploadImg/upload-img.vue";
import util from './utils'
// import echarts from 'echarts'   

// Vue.use(echarts)

Vue.component("first-title", FirstTitle);
Vue.prototype.$webData = {
  webName,
  webLogo,
  apiHost: process.env.VUE_APP_BASE_API
};
Vue.mixin(vueMixin);
// Vue.prototype.$store = store;

import "@/icons"; // icon
import "@/permission"; // permission control

Vue.component('y-image',Image)
Vue.component('upload-img',uploadImg)
Vue.component('upload',Upload)
Vue.component('model',Model)

Vue.prototype.util = util
Vue.prototype.$axios = service

// 引入vue-amap
import VueAMap from 'vue-amap';
// 初始化vue-amap
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '0592067faeab23b9a97a69e4336d5ee6',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geocoder','AMap.Geolocation','AMap.MarkerClusterer'],
  v: '1.4.4',
  uiVersion: '1.0'
});

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);

Vue.config.productionTip = false;

// 创建一个响应式对象 为了做消息推送更新
const messageList = Vue.observable({
  intervalId:null,
  repairMessgaeListTotal:null,
  repairMessgaeList:null
});
Vue.prototype.$messageList = messageList;


new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
