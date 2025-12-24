import axios from "axios";
import { MessageBox, Message, Loading } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

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

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000000,
});

//  接口不需要加密
const forbiddenUrl = [
  "/admin/base/uploadImg",
  "/admin/financial/handlePaymentListImport",
  "/admin/maintenance/uploadBatchRepairOrder",
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
  "/admin/maintenance/handleOnlineRepairEnterpriseOrderExport",
  "/admin/maintenance/importButlerOrder",
  "/admin/maintenance/handleDeviceInfoExport",
];

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["admin-token"] = getToken();
    }
    // post 的数据加密  判断在测试环境下
    if (config.method == "post" || config.method == "POST") {
      if (config.url !== "/admin/maintenance/queryRepairMessgae") {
        loadingInstance = Loading.service({
          lock: true,
          text: "加载中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
      }
      // 图片接口 导入的接口不需要
      if (process.env.NODE_ENV != "development") {
        let pass = true;
        forbiddenUrl.forEach((item) => {
          if (config.url.indexOf(item) != -1) {
            pass = false;
          }
        });
        if (pass) {
          config.data = Encrypt(JSON.stringify(config.data));
          config.headers["Content-Type"] = "application/json";
          config.dataType = "text";
        }
      }
    }

    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.config.method == "post" || response.config.method == "POST") {
      if (response.config.url !== "/admin/maintenance/queryRepairMessgae") {
        loadingInstance.close();
      }
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
