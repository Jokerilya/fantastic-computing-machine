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

// import echarts from 'echarts'   

// Vue.use(echarts)

Vue.component("first-title", FirstTitle);
Vue.prototype.$webData = {
  webName,
  webLogo,
  apiHost: process.env.VUE_APP_BASE_API
};
Vue.mixin(vueMixin);
Vue.prototype.$store = store;

import "@/icons"; // icon
import "@/permission"; // permission control

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

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
