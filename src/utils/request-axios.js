import axios from "axios";
// import md5 from 'md5'
import { MessageBox, Message, Loading } from "element-ui";
import store from "@/store";
// import { setUserInfo, getMenuId, getUserInfo } from '@/utils/auth'
import { getToken } from "@/utils/auth";
require("es6-promise").polyfill();

import CryptoJS from "crypto-js";
// 密钥
var key = CryptoJS.enc.Hex.parse("d86d7bab3d6ac01ad9dc6a897652f2d2");

// 加密
function Encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// 解密
function Decrypt(word) {
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

var loadingInstance;

// create an axios instance
// 创建一个axios请求实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000000, // request timeout
});

//  接口不需要加密
const forbiddenUrl = [
  "/admin/base/uploadImg",
  "/admin/financial/handlePaymentListImport",
  "/admin/maintenance/uploadBatchRepairOrder",
  "/admin/maintenance/uploadButlerOrder?type=2",
  "/admin/maintenance/uploadButlerOrder?type=3",
  "/admin/maintenance/uploadButlerOrderByOwn",
  "/admin/maintenance/handleMasterInfoExport",
  "/admin/maintenance/handleEnterpriseInfoExport",
  "/admin/maintenance/handleRepairEnterpriseOrderExport",
  "/admin/maintenance/handleButlerOrderExport",
  "/admin/maintenance/handleRepairOrderExport",
  "/admin/maintenance/uploadDeviceKeepOrder",
  "/admin/financial/handlePaymentListExport",
  "/admin/maintenance/handleRepairOrderExportV2",
  "/admin/maintenance/handleRepairOrderExportByFaults",
  "/admin/maintenance/editMasterAssessmentItem",
];

service.interceptors.request.use((request) => {
  if (store.getters.token) {
    request.headers["admin-token"] = getToken();
  }
  // post 的数据加密  判断在测试环境下
  if (request.method == "post" || request.method == "POST") {
    loadingInstance = Loading.service({
      lock: true,
      text: "加载中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    // 图片接口 导入的接口不需要
    if (process.env.NODE_ENV != "development") {
      let pass = true;
      forbiddenUrl.forEach((item) => {
        if (request.url.indexOf(item) != -1) {
          pass = false;
        }
      });
      if (pass) {
        request.data = Encrypt(JSON.stringify(request.data));
        request.headers["Content-Type"] = "application/json";
        request.dataType = "text";
      }
    }
  }

  return request;
});
// response interceptor
// 服务响应拦截
service.interceptors.response.use(
  /**
   * 如果您想获得http信息，如头信息或状态信息
   * 请返回响应=>响应
   */
  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 你也可以通过HTTP状态码来判断状态
   */
  (response) => {
    if (response.config.method == "post" || response.config.method == "POST") {
      loadingInstance.close();
    }
    if (response.config.responseType == "blob") {
      return response;
    } else {
      // 图片接口不需要  判断在测试环境下
      if (process.env.NODE_ENV != "development") {
        let pass = true;
        forbiddenUrl.forEach((item) => {
          if (response.config.url.indexOf(item) != -1) {
            pass = false;
          }
        });
        if (pass) {
          response.data = JSON.parse(Decrypt(response.data));
        }
      }

      const res = response.data;
      if (res.code == "000") {
        return res;
      } else if (res.code == "002" || res.code == "004" || res.code == "007") {
        store.dispatch("user/logout").then(() => {
          location.reload();
        });
      } else if (res.code == "009") {
        Message({
          message: "您暂无操作权限！",
          type: "error",
          duration: 5 * 1000,
        });
      } else {
        Message({
          message: res.errorMessage || res.message || "Error",
          type: "error",
          duration: 5 * 1000,
        });
        return Promise.reject(
          new Error(res.errorMessage || res.message || "Error")
        );
      }
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    loadingInstance.close();
    return Promise.reject(error);
  }
);
export default service;
