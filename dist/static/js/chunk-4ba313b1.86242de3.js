(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-4ba313b1"],
  {
    "019b": function(e, t, r) {
      "use strict";
      r.r(t);
      var a = function() {
          var e = this,
            t = e.$createElement,
            r = e._self._c || t;
          return r(
            "div",
            { staticClass: "app-container" },
            [
              r(
                "div",
                { staticClass: "manage-top" },
                [
                  r(
                    "el-form",
                    {
                      ref: "ruleForm",
                      staticClass: "rule-form",
                      attrs: {
                        "label-width": "100px",
                        "label-position": "left",
                        inline: !0,
                      },
                      model: {
                        value: e.searchForm,
                        callback: function(t) {
                          e.searchForm = t;
                        },
                        expression: "searchForm",
                      },
                    },
                    [
                      r(
                        "el-form-item",
                        { attrs: { label: "师傅名称" } },
                        [
                          r(
                            "el-select",
                            {
                              style: {
                                width: e.sidebar.opened ? "10.5vw" : "9vw",
                              },
                              attrs: {
                                filterable: "",
                                placeholder: "请选择师傅",
                                "remote-method": e.searchMaster,
                                remote: "",
                              },
                              on: { change: e.changeInquireMasterFn },
                              model: {
                                value: e.searchForm.masterUid,
                                callback: function(t) {
                                  e.$set(e.searchForm, "masterUid", t);
                                },
                                expression: "searchForm.masterUid",
                              },
                            },
                            e._l(e.masterSearchList, function(e) {
                              return r("el-option", {
                                key: e.uid,
                                attrs: { label: e.realName, value: e.uid },
                              });
                            }),
                            1
                          ),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "订单类型" } },
                        [
                          r(
                            "el-select",
                            {
                              style: {
                                width: e.sidebar.opened ? "10.5vw" : "9vw",
                              },
                              attrs: { placeholder: "请选择订单类型" },
                              model: {
                                value: e.searchForm.orderType,
                                callback: function(t) {
                                  e.$set(e.searchForm, "orderType", t);
                                },
                                expression: "searchForm.orderType",
                              },
                            },
                            [
                              r(
                                "el-option",
                                { attrs: { label: "散单", value: 1 } },
                                [e._v("散单")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "年保", value: 2 } },
                                [e._v("年保")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "年卡", value: 3 } },
                                [e._v("年卡")]
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "订单编号" } },
                        [
                          r("el-input", {
                            style: {
                              width: e.sidebar.opened ? "10.5vw" : "9vw",
                            },
                            attrs: { placeholder: "请输入订单编号" },
                            model: {
                              value: e.searchForm.orderSn,
                              callback: function(t) {
                                e.$set(e.searchForm, "orderSn", t);
                              },
                              expression: "searchForm.orderSn",
                            },
                          }),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "企业名称" } },
                        [
                          r("el-input", {
                            style: {
                              width: e.sidebar.opened ? "10.5vw" : "9vw",
                            },
                            attrs: { placeholder: "请输入企业名称" },
                            model: {
                              value: e.searchForm.enterpriseName,
                              callback: function(t) {
                                e.$set(e.searchForm, "enterpriseName", t);
                              },
                              expression: "searchForm.enterpriseName",
                            },
                          }),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "紧急程度" } },
                        [
                          r(
                            "el-select",
                            {
                              style: {
                                width: e.sidebar.opened ? "10.5vw" : "9vw",
                              },
                              attrs: { placeholder: "请选择紧急程度" },
                              model: {
                                value: e.searchForm.degree,
                                callback: function(t) {
                                  e.$set(e.searchForm, "degree", t);
                                },
                                expression: "searchForm.degree",
                              },
                            },
                            [
                              r(
                                "el-option",
                                { attrs: { label: "全部", value: null } },
                                [e._v("全部")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "一般", value: 1 } },
                                [e._v("一般")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "常规", value: 0 } },
                                [e._v("常规")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "紧急", value: 2 } },
                                [e._v("紧急")]
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "设备编码" } },
                        [
                          r("el-input", {
                            style: {
                              width: e.sidebar.opened ? "10.5vw" : "9vw",
                            },
                            attrs: { placeholder: "请输入设备编码" },
                            model: {
                              value: e.searchForm.no,
                              callback: function(t) {
                                e.$set(e.searchForm, "no", t);
                              },
                              expression: "searchForm.no",
                            },
                          }),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "结算类型" } },
                        [
                          r(
                            "el-select",
                            {
                              style: {
                                width: e.sidebar.opened ? "10.5vw" : "9vw",
                              },
                              attrs: { placeholder: "请选择结算类型" },
                              model: {
                                value: e.searchForm.settlementType,
                                callback: function(t) {
                                  e.$set(e.searchForm, "settlementType", t);
                                },
                                expression: "searchForm.settlementType",
                              },
                            },
                            [
                              r(
                                "el-option",
                                { attrs: { label: "现结", value: 1 } },
                                [e._v("现结")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "月结", value: 2 } },
                                [e._v("月结 ")]
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "数据审核" } },
                        [
                          r(
                            "el-select",
                            {
                              style: {
                                width: e.sidebar.opened ? "10.5vw" : "9vw",
                              },
                              attrs: { placeholder: "请选择数据审核" },
                              model: {
                                value: e.searchForm.dataExamineStatus,
                                callback: function(t) {
                                  e.$set(e.searchForm, "dataExamineStatus", t);
                                },
                                expression: "searchForm.dataExamineStatus",
                              },
                            },
                            [
                              r(
                                "el-option",
                                { attrs: { label: "全部", value: null } },
                                [e._v("全部")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "审核中", value: 1 } },
                                [e._v("审核中")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "审核通过", value: 2 } },
                                [e._v("审核通过")]
                              ),
                              r(
                                "el-option",
                                { attrs: { label: "审核驳回", value: 3 } },
                                [e._v("审核驳回")]
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "设备类型" } },
                        [
                          r("el-cascader", {
                            style: {
                              width: e.sidebar.opened ? "10.5vw" : "9vw",
                            },
                            attrs: {
                              options: e.typeList,
                              placeholder: "请选择设备类型",
                              props: e.serviceTypesProps,
                            },
                            model: {
                              value: e.searchForm.deviceTypeId,
                              callback: function(t) {
                                e.$set(e.searchForm, "deviceTypeId", t);
                              },
                              expression: "searchForm.deviceTypeId",
                            },
                          }),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "设备型号" } },
                        [
                          r("el-input", {
                            style: {
                              width: e.sidebar.opened ? "10.5vw" : "9vw",
                            },
                            attrs: { placeholder: "请填写设备型号" },
                            model: {
                              value: e.searchForm.deviceModel,
                              callback: function(t) {
                                e.$set(e.searchForm, "deviceModel", t);
                              },
                              expression: "searchForm.deviceModel",
                            },
                          }),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "创建时间" } },
                        [
                          r("el-date-picker", {
                            staticStyle: { width: "13vw" },
                            attrs: {
                              type: "daterange",
                              "value-format": "yyyy-MM-dd",
                              "range-separator": "至",
                              "start-placeholder": "开始日期",
                              "end-placeholder": "结束日期",
                            },
                            on: { change: e.changeQueryTimeCopy },
                            model: {
                              value: e.queryTimeCopy,
                              callback: function(t) {
                                e.queryTimeCopy = t;
                              },
                              expression: "queryTimeCopy",
                            },
                          }),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "仅选择超时" } },
                        [
                          r("el-switch", {
                            attrs: {
                              "active-color": "#409eff",
                              "inactive-color": "#909399",
                            },
                            model: {
                              value: e.searchForm.timeoutFlag,
                              callback: function(t) {
                                e.$set(e.searchForm, "timeoutFlag", t);
                              },
                              expression: "searchForm.timeoutFlag",
                            },
                          }),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "仅选择斯耐克" } },
                        [
                          r("el-switch", {
                            attrs: {
                              "active-color": "#409eff",
                              "inactive-color": "#909399",
                            },
                            model: {
                              value: e.searchForm.snkFlag,
                              callback: function(t) {
                                e.$set(e.searchForm, "snkFlag", t);
                              },
                              expression: "searchForm.snkFlag",
                            },
                          }),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              r(
                "el-row",
                { attrs: { gutter: 20 } },
                [
                  r(
                    "el-col",
                    { attrs: { span: 17 } },
                    [
                      r(
                        "el-radio-group",
                        {
                          staticStyle: { "margin-bottom": "30px" },
                          on: { input: e.changeOrderState },
                          model: {
                            value: e.searchForm.status,
                            callback: function(t) {
                              e.$set(e.searchForm, "status", t);
                            },
                            expression: "searchForm.status",
                          },
                        },
                        e._l(e.statusObjList, function(t) {
                          return r(
                            "el-radio-button",
                            { key: t.num, attrs: { label: t.num } },
                            [
                              e._v(
                                e._s(t.desc) +
                                  "(" +
                                  e._s(e.orderSubscript[t.str]) +
                                  ")"
                              ),
                            ]
                          );
                        }),
                        1
                      ),
                    ],
                    1
                  ),
                  r(
                    "el-col",
                    {
                      staticStyle: { "text-align": "right" },
                      attrs: { span: 7 },
                    },
                    [
                      r(
                        "el-button",
                        {
                          attrs: {
                            plain: "",
                            disabled: 0 == e.multipleSelection.length,
                          },
                          on: { click: e.handleBatchProxyPayment },
                        },
                        [e._v(" 批量代付款 ")]
                      ),
                      r(
                        "el-button",
                        {
                          attrs: { plain: "", type: "primary" },
                          on: { click: e.query_queryRepairOrderList },
                        },
                        [e._v("查询")]
                      ),
                      r(
                        "el-button",
                        {
                          staticStyle: { "margin-right": "10px" },
                          attrs: { plain: "", type: "info" },
                          on: { click: e.resetFn },
                        },
                        [e._v("重置")]
                      ),
                      r(
                        "el-dropdown",
                        {
                          staticStyle: { "margin-right": "10px" },
                          attrs: { trigger: "click" },
                          on: { command: e.exportListFn },
                        },
                        [
                          r(
                            "el-button",
                            { attrs: { type: "success", plain: "" } },
                            [e._v(" 导出 ")]
                          ),
                          r(
                            "el-dropdown-menu",
                            { attrs: { slot: "dropdown" }, slot: "dropdown" },
                            [
                              r(
                                "el-dropdown-item",
                                { attrs: { command: "导出" } },
                                [e._v("导出")]
                              ),
                              r(
                                "el-dropdown-item",
                                { attrs: { command: "导出V2" } },
                                [e._v("导出V2")]
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      r(
                        "el-dropdown",
                        {
                          attrs: { trigger: "click" },
                          on: { command: e.tableListFn },
                        },
                        [
                          r(
                            "el-button",
                            { attrs: { type: "success", plain: "" } },
                            [e._v(" 表格 ")]
                          ),
                          r(
                            "el-dropdown-menu",
                            { attrs: { slot: "dropdown" }, slot: "dropdown" },
                            [
                              r("el-dropdown-item", [e._v("对账单")]),
                              r("el-dropdown-item", [e._v("订单总表")]),
                              r("el-dropdown-item", [e._v("年/散单交接单")]),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              r(
                "el-card",
                [
                  r(
                    "el-table",
                    {
                      directives: [
                        {
                          name: "loading",
                          rawName: "v-loading.fullscreen.lock",
                          value: e.loading,
                          expression: "loading",
                          modifiers: { fullscreen: !0, lock: !0 },
                        },
                      ],
                      key: e.multipleOperation,
                      attrs: {
                        "highlight-current-row": "",
                        "element-loading-text": "拼命加载中",
                        "element-loading-spinner": "el-icon-loading",
                        data: e.dataList,
                      },
                      on: { "selection-change": e.handleSelectionChange },
                    },
                    [
                      e.multipleOperation
                        ? r("el-table-column", {
                            attrs: { type: "selection", width: "55" },
                          })
                        : e._e(),
                      r("el-table-column", {
                        attrs: {
                          prop: "orderSn",
                          label: "订单编号",
                          "show-overflow-tooltip": "",
                          width: "170",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "紧急程度",
                          "show-overflow-tooltip": "",
                          width: "80",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.degreeName ? r.degreeName : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "超时状态",
                          "show-overflow-tooltip": "",
                          width: "80",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                r(
                                  "div",
                                  {
                                    style: {
                                      color: a.timeoutFlag ? "red" : "",
                                    },
                                  },
                                  [
                                    e._v(
                                      " " +
                                        e._s(
                                          "2001" == a.timeoutFlag
                                            ? "指派超时"
                                            : "2101" == a.timeoutFlag
                                            ? "接单超时"
                                            : "2201" == a.timeoutFlag
                                            ? "打卡超时"
                                            : "2301" == a.timeoutFlag
                                            ? "服务中超时"
                                            : "3001" == a.timeoutFlag
                                            ? "派发->接单超时 "
                                            : "/"
                                        ) +
                                        " "
                                    ),
                                  ]
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "simpleDesc",
                          label: "故障描述",
                          "show-overflow-tooltip": "",
                          width: "200",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "工单类型",
                          "show-overflow-tooltip": "",
                          width: "80",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      1 === r.orderType
                                        ? "散单"
                                        : 2 === r.orderType
                                        ? "年保"
                                        : "年卡"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "标签",
                          "show-overflow-tooltip": "",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return e._l(e.lablelList, function(t) {
                                return r(
                                  "div",
                                  { key: t.value },
                                  [
                                    a.label == t.value
                                      ? r(
                                          "el-tag",
                                          { attrs: { type: t.type } },
                                          [e._v(e._s(t.value))]
                                        )
                                      : e._e(),
                                  ],
                                  1
                                );
                              });
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "enterpriseName",
                          label: "企业名称",
                          "show-overflow-tooltip": "",
                          width: "230",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "备注",
                          "show-overflow-tooltip": "",
                          width: "180px",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " + e._s(r.remarks ? r.remarks : "/") + " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "结算类型",
                          "show-overflow-tooltip": "",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      2 == r.settlementType ? "月结" : "现结"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "机台码",
                          "show-overflow-tooltip": "",
                          width: "150",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(" " + e._s(r.no ? r.no : "/") + " "),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "设备编号",
                          "show-overflow-tooltip": "",
                          width: "80",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.enterpriseDeviceNo
                                        ? r.enterpriseDeviceNo
                                        : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "设备位置",
                          "show-overflow-tooltip": "",
                          width: "80",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.enterpriseDevicePosition
                                        ? r.enterpriseDevicePosition
                                        : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "devicePlace",
                          label: "设备产地",
                          "show-overflow-tooltip": "",
                          width: "150",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "deviceTypeName",
                          label: "设备类型",
                          "show-overflow-tooltip": "",
                          width: "130",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "设备型号",
                          "show-overflow-tooltip": "",
                          width: "130",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.deviceModel ? r.deviceModel : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "deviceBrand",
                          label: "设备品牌",
                          "show-overflow-tooltip": "",
                          width: "90",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "deviceSystemName",
                          label: "设备系统",
                          "show-overflow-tooltip": "",
                          width: "140",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "serviceTime",
                          label: "服务时间",
                          "show-overflow-tooltip": "",
                          width: "150",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "contactsPeople",
                          label: "联系人",
                          "show-overflow-tooltip": "",
                          width: "100",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "contactsPhone",
                          label: "联系电话",
                          "show-overflow-tooltip": "",
                          width: "160",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "masterRealName",
                          label: "师傅名称",
                          "show-overflow-tooltip": "",
                          width: "100",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.masterRealName ? r.masterRealName : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "师傅联系电话",
                          "show-overflow-tooltip": "",
                          width: "160",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.masterPhone ? r.masterPhone : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "业务员",
                          "show-overflow-tooltip": "",
                          width: "120",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                a.salesmanName
                                  ? r("div", [
                                      e._v(" " + e._s(a.salesmanName) + " "),
                                    ])
                                  : r(
                                      "el-button",
                                      {
                                        attrs: { type: "text" },
                                        on: {
                                          click: function(t) {
                                            return e.openBindSalesmanDialog(
                                              a.orderSn
                                            );
                                          },
                                        },
                                      },
                                      [e._v("未绑定")]
                                    ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "orderStatusName",
                          label: "状态",
                          "show-overflow-tooltip": "",
                          width: "90",
                          fixed: "right",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "createTime",
                          label: "创建时间",
                          width: "120",
                          "show-overflow-tooltip": "",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "操作",
                          width: "120",
                          fixed: "right",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                a.orderSn
                                  ? r(
                                      "div",
                                      { staticClass: "settings" },
                                      [
                                        r(
                                          "el-button",
                                          {
                                            staticStyle: {
                                              "font-size": "14px",
                                              "margin-right": "10px",
                                              "font-weight": "400",
                                            },
                                            attrs: { type: "text", plain: "" },
                                            on: {
                                              click: function(t) {
                                                return e.queryDesc(a);
                                              },
                                            },
                                          },
                                          [e._v("详情")]
                                        ),
                                        r(
                                          "el-dropdown",
                                          { attrs: { trigger: "click" } },
                                          [
                                            r(
                                              "span",
                                              {
                                                staticClass: "el-dropdown-link",
                                                staticStyle: {
                                                  color: "#409eff",
                                                },
                                              },
                                              [
                                                e._v(" 其他"),
                                                r("i", {
                                                  staticClass:
                                                    "el-icon-arrow-down el-icon--right",
                                                }),
                                              ]
                                            ),
                                            r(
                                              "el-dropdown-menu",
                                              {
                                                attrs: { slot: "dropdown" },
                                                slot: "dropdown",
                                              },
                                              [
                                                r(
                                                  "el-dropdown-item",
                                                  [
                                                    1 == a.orderType
                                                      ? r(
                                                          "el-button",
                                                          {
                                                            attrs: {
                                                              type: "text",
                                                            },
                                                            on: {
                                                              click: function(
                                                                t
                                                              ) {
                                                                return e.openConvertToInsurance(
                                                                  a.orderSn
                                                                );
                                                              },
                                                            },
                                                          },
                                                          [e._v("转类型")]
                                                        )
                                                      : e._e(),
                                                  ],
                                                  1
                                                ),
                                                r(
                                                  "el-dropdown-item",
                                                  [
                                                    r(
                                                      "el-button",
                                                      {
                                                        attrs: { type: "text" },
                                                        on: {
                                                          click: function(t) {
                                                            return e.openRemarksDialog(
                                                              a
                                                            );
                                                          },
                                                        },
                                                      },
                                                      [e._v("备注")]
                                                    ),
                                                  ],
                                                  1
                                                ),
                                                r(
                                                  "el-dropdown-item",
                                                  [
                                                    r(
                                                      "el-button",
                                                      {
                                                        attrs: { type: "text" },
                                                        on: {
                                                          click: function(t) {
                                                            return e.copyOrder(
                                                              a
                                                            );
                                                          },
                                                        },
                                                      },
                                                      [e._v("复制")]
                                                    ),
                                                  ],
                                                  1
                                                ),
                                                r(
                                                  "el-dropdown-item",
                                                  [
                                                    1 == a.orderType
                                                      ? r(
                                                          "el-button",
                                                          {
                                                            attrs: {
                                                              type: "text",
                                                            },
                                                            on: {
                                                              click: function(
                                                                t
                                                              ) {
                                                                return e.setOrderTag(
                                                                  a
                                                                );
                                                              },
                                                            },
                                                          },
                                                          [e._v("设置")]
                                                        )
                                                      : e._e(),
                                                  ],
                                                  1
                                                ),
                                              ],
                                              1
                                            ),
                                          ],
                                          1
                                        ),
                                      ],
                                      1
                                    )
                                  : r(
                                      "div",
                                      { staticClass: "settings" },
                                      [
                                        r(
                                          "el-button",
                                          {
                                            staticStyle: {
                                              "font-size": "14px",
                                              "margin-right": "10px",
                                              "font-weight": "400",
                                            },
                                            attrs: { type: "text", plain: "" },
                                            on: {
                                              click: function(t) {
                                                return e.deleteRepairOrder(a);
                                              },
                                            },
                                          },
                                          [e._v("删除")]
                                        ),
                                      ],
                                      1
                                    ),
                              ];
                            },
                          },
                        ]),
                      }),
                    ],
                    1
                  ),
                  r(
                    "div",
                    {
                      staticStyle: {
                        "text-align": "center",
                        "margin-top": "20px",
                      },
                    },
                    [
                      r("el-pagination", {
                        attrs: {
                          background: "",
                          "current-page": e.currentPage,
                          "page-size": 10,
                          layout: "total, prev, pager, next, jumper",
                          total: e.pageCount,
                        },
                        on: { "current-change": e.updatePageNo },
                      }),
                    ],
                    1
                  ),
                ],
                1
              ),
              r(
                "el-dialog",
                {
                  attrs: {
                    title: "备注",
                    width: "30%",
                    "before-close": e.closeRemarksDialog,
                    visible: e.remarksDialogVisible,
                    "close-on-click-modal": !1,
                  },
                },
                [
                  r(
                    "div",
                    { staticClass: "auditDialog" },
                    [
                      r(
                        "el-form",
                        { attrs: { "label-width": "80px" } },
                        [
                          e.orderTag && e.orderTag.length > 0
                            ? r(
                                "el-form-item",
                                { attrs: { label: "标签:" } },
                                e._l(e.orderTag, function(t) {
                                  return r(
                                    "el-button",
                                    {
                                      key: t,
                                      attrs: {
                                        type: e.judgeTagSelected(t)
                                          ? "primary"
                                          : "",
                                        size: "small",
                                      },
                                      on: {
                                        click: function(r) {
                                          return e.addTag(t);
                                        },
                                      },
                                    },
                                    [e._v(e._s(t))]
                                  );
                                }),
                                1
                              )
                            : e._e(),
                          r(
                            "el-form-item",
                            { attrs: { label: "自定义:" } },
                            [
                              r("el-input", {
                                attrs: {
                                  type: "textarea",
                                  placeholder: "请输入内容",
                                  maxlength: "100",
                                  "show-word-limit": "",
                                },
                                model: {
                                  value: e.handleRepairRemarksParamsCopy.remark,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleRepairRemarksParamsCopy,
                                      "remark",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleRepairRemarksParamsCopy.remark",
                                },
                              }),
                            ],
                            1
                          ),
                          e.orderRemark
                            ? r("el-form-item", { attrs: { label: "备注:" } }, [
                                e._v(" " + e._s(e.orderRemark) + " "),
                              ])
                            : e._e(),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                  r(
                    "span",
                    {
                      staticClass: "dialog-footer",
                      attrs: { slot: "footer" },
                      slot: "footer",
                    },
                    [
                      r("el-button", { on: { click: e.closeRemarksDialog } }, [
                        e._v("取 消"),
                      ]),
                      r(
                        "el-button",
                        {
                          attrs: { type: "primary" },
                          on: { click: e.handleRepairRemarks },
                        },
                        [e._v("确 定")]
                      ),
                    ],
                    1
                  ),
                ]
              ),
              r(
                "el-dialog",
                {
                  attrs: {
                    title: "散单转年保",
                    width: "30%",
                    visible: e.openConvertToInsuranceShow,
                    "before-close": e.closeConvertToInsurance,
                    center: "",
                  },
                },
                [
                  r(
                    "el-form",
                    [
                      r(
                        "el-form-item",
                        { attrs: { label: "类型选择", "label-width": "70px" } },
                        [
                          r(
                            "el-radio-group",
                            {
                              model: {
                                value: e.convertToInsuranceparams.type,
                                callback: function(t) {
                                  e.$set(e.convertToInsuranceparams, "type", t);
                                },
                                expression: "convertToInsuranceparams.type",
                              },
                            },
                            [
                              r("el-radio", { attrs: { label: 2 } }, [
                                e._v("转年保"),
                              ]),
                              r("el-radio", { attrs: { label: 3 } }, [
                                e._v("转年卡"),
                              ]),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      r(
                        "el-form-item",
                        { attrs: { label: "设备编号", "label-width": "70px" } },
                        [
                          r("el-input", {
                            attrs: { rows: 4, placeholder: "请输入设备编号" },
                            model: {
                              value: e.convertToInsuranceparams.no,
                              callback: function(t) {
                                e.$set(e.convertToInsuranceparams, "no", t);
                              },
                              expression: "convertToInsuranceparams.no",
                            },
                          }),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                  r(
                    "span",
                    {
                      staticClass: "dialog-footer",
                      attrs: { slot: "footer" },
                      slot: "footer",
                    },
                    [
                      r(
                        "el-button",
                        { on: { click: e.closeConvertToInsurance } },
                        [e._v("取 消")]
                      ),
                      r(
                        "el-button",
                        {
                          attrs: { type: "primary" },
                          on: { click: e.convertToInsurance },
                        },
                        [e._v("确 定")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              r(
                "el-dialog",
                {
                  attrs: {
                    title: "代下单",
                    width: "30%",
                    visible: e.replacePlaceOrderVisible,
                    "close-on-click-modal": !1,
                    "before-close": e.closeReplacePlaceOrderDialog,
                    center: "",
                  },
                },
                [
                  r(
                    "div",
                    [
                      r(
                        "el-form",
                        {
                          ref: "handleProxyCreateOrderRef",
                          attrs: {
                            "label-position": "left",
                            "label-width": "120px",
                            model: e.handleProxyCreateOrderParams,
                            rules: e.handleProxyCreateOrderRules,
                          },
                        },
                        [
                          r(
                            "el-form-item",
                            { attrs: { label: "设备编码", prop: "no" } },
                            [
                              r("el-input", {
                                attrs: {
                                  placeholder: "请填写设备编码,例:粤Sxxxxxx",
                                },
                                on: { blur: e.getDeviceInfoByNo },
                                model: {
                                  value: e.handleProxyCreateOrderParams.no,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "no",
                                      t
                                    );
                                  },
                                  expression: "handleProxyCreateOrderParams.no",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            { attrs: { label: "故障类型", prop: "type" } },
                            [
                              r(
                                "el-radio-group",
                                {
                                  model: {
                                    value: e.handleProxyCreateOrderParams.type,
                                    callback: function(t) {
                                      e.$set(
                                        e.handleProxyCreateOrderParams,
                                        "type",
                                        t
                                      );
                                    },
                                    expression:
                                      "handleProxyCreateOrderParams.type",
                                  },
                                },
                                [
                                  r("el-radio", { attrs: { label: 1 } }, [
                                    e._v("电气故障"),
                                  ]),
                                  r("el-radio", { attrs: { label: 2 } }, [
                                    e._v("机械故障"),
                                  ]),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: {
                                label: "设备类型",
                                prop: "deviceTypeId",
                              },
                            },
                            [
                              r("el-cascader", {
                                attrs: {
                                  disabled: e.formItemDisabled,
                                  options: e.deviceTypeListOptions,
                                  "show-all-levels": !1,
                                  placeholder: "请选择设备类型",
                                },
                                on: { change: e.changeDeviceType },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams.deviceTypeId,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "deviceTypeId",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.deviceTypeId",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: { label: "设备品牌", prop: "deviceBrand" },
                            },
                            [
                              r("el-input", {
                                attrs: {
                                  disabled: e.formItemDisabled,
                                  placeholder: "请填写设备品牌",
                                },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams.deviceBrand,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "deviceBrand",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.deviceBrand",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: { label: "设备型号", prop: "deviceModel" },
                            },
                            [
                              r("el-input", {
                                attrs: {
                                  disabled: e.formItemDisabled,
                                  placeholder: "请填写设备型号",
                                },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams.deviceModel,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "deviceModel",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.deviceModel",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: {
                                label: "设备系统",
                                prop: "deviceSystemId",
                              },
                            },
                            [
                              r("el-cascader", {
                                attrs: {
                                  disabled: e.formItemDisabled,
                                  options: e.deviceSystemListOptions,
                                  "show-all-levels": !1,
                                  placeholder: "请选择设备系统",
                                },
                                on: { change: e.changeDeviceSystem },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams
                                      .deviceSystemId,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "deviceSystemId",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.deviceSystemId",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: { label: "设备产地", prop: "devicePlace" },
                            },
                            [
                              r(
                                "el-select",
                                {
                                  attrs: {
                                    disabled: e.formItemDisabled,
                                    placeholder: "请选择设备产地",
                                  },
                                  model: {
                                    value:
                                      e.handleProxyCreateOrderParams
                                        .devicePlace,
                                    callback: function(t) {
                                      e.$set(
                                        e.handleProxyCreateOrderParams,
                                        "devicePlace",
                                        t
                                      );
                                    },
                                    expression:
                                      "handleProxyCreateOrderParams.devicePlace",
                                  },
                                },
                                e._l(e.devicePlaceOptions, function(e) {
                                  return r("el-option", {
                                    key: e.value,
                                    attrs: { label: e.label, value: e.value },
                                  });
                                }),
                                1
                              ),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            { attrs: { label: "故障部位", prop: "position" } },
                            [
                              r("el-cascader", {
                                attrs: {
                                  options: e.positionOptions,
                                  "show-all-levels": !1,
                                  placeholder: "请选择故障部位",
                                },
                                on: { change: e.changePosition },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams.position,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "position",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.position",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: {
                                label: "联系人",
                                prop: "contactsPeople",
                              },
                            },
                            [
                              r("el-input", {
                                attrs: { placeholder: "请填写联系人" },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams
                                      .contactsPeople,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "contactsPeople",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.contactsPeople",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: {
                                label: "联系电话",
                                prop: "contactsPhone",
                              },
                            },
                            [
                              r("el-input", {
                                attrs: { placeholder: "请填写联系电话" },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams
                                      .contactsPhone,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "contactsPhone",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.contactsPhone",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: {
                                label: "公司名称",
                                prop: "enterpriseName",
                              },
                            },
                            [
                              r("el-input", {
                                attrs: {
                                  disabled: e.formItemDisabled,
                                  placeholder: "请填写公司名称",
                                },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams
                                      .enterpriseName,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "enterpriseName",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.enterpriseName",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            { attrs: { label: "联系地址", prop: "address" } },
                            [
                              r("el-input", {
                                attrs: { placeholder: "请填写联系地址" },
                                model: {
                                  value: e.handleProxyCreateOrderParams.address,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "address",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.address",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: { label: "期望时间", prop: "serviceTime" },
                            },
                            [
                              r("el-date-picker", {
                                attrs: {
                                  "value-format": "yyyy-MM-dd HH:mm:ss",
                                  type: "datetime",
                                  placeholder: "选择期望时间",
                                },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams.serviceTime,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "serviceTime",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.serviceTime",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            {
                              attrs: { label: "故障描述", prop: "simpleDesc" },
                            },
                            [
                              r("el-input", {
                                attrs: { placeholder: "请填写故障描述" },
                                model: {
                                  value:
                                    e.handleProxyCreateOrderParams.simpleDesc,
                                  callback: function(t) {
                                    e.$set(
                                      e.handleProxyCreateOrderParams,
                                      "simpleDesc",
                                      t
                                    );
                                  },
                                  expression:
                                    "handleProxyCreateOrderParams.simpleDesc",
                                },
                              }),
                            ],
                            1
                          ),
                          r(
                            "el-form-item",
                            { attrs: { label: "故障视图", prop: "images" } },
                            [
                              e.handleProxyCreateOrderParams.images
                                ? r(
                                    "div",
                                    [
                                      r(
                                        "el-button",
                                        {
                                          attrs: { type: "text" },
                                          on: { click: e.openFaultImg },
                                        },
                                        [e._v("查看视图")]
                                      ),
                                      r(
                                        "el-button",
                                        {
                                          attrs: { type: "text" },
                                          on: { click: e.delFaultImg },
                                        },
                                        [e._v("删除视图")]
                                      ),
                                    ],
                                    1
                                  )
                                : r(
                                    "div",
                                    [
                                      r(
                                        "el-upload",
                                        {
                                          attrs: {
                                            accept: ".jpg,.jpeg,.png,.mp4",
                                            action: "#",
                                            "http-request": e.uploadFaultImg,
                                          },
                                        },
                                        [
                                          r(
                                            "el-button",
                                            {
                                              attrs: {
                                                size: "small",
                                                type: "primary",
                                              },
                                            },
                                            [e._v("点击上传")]
                                          ),
                                        ],
                                        1
                                      ),
                                    ],
                                    1
                                  ),
                            ]
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                  r(
                    "span",
                    {
                      staticClass: "dialog-footer",
                      attrs: { slot: "footer" },
                      slot: "footer",
                    },
                    [
                      r(
                        "el-button",
                        { on: { click: e.closeReplacePlaceOrderDialog } },
                        [e._v("取 消")]
                      ),
                      r(
                        "el-button",
                        {
                          attrs: { type: "primary" },
                          on: { click: e.handleProxyCreateOrder },
                        },
                        [e._v("确 定")]
                      ),
                    ],
                    1
                  ),
                ]
              ),
              r(
                "el-dialog",
                {
                  attrs: {
                    title: "同步",
                    width: "35%",
                    visible: e.syncDialogVisible,
                    "close-on-click-modal": !1,
                    "before-close": e.closeSyncDialog,
                    center: "",
                  },
                },
                [
                  r("el-input", {
                    attrs: {
                      placeholder:
                        "填写同步的订单号,多个订单号逗号隔开,例:WBLPxxxxxxx,WBLPxxxxxxx",
                    },
                    model: {
                      value: e.testDataOrderSns,
                      callback: function(t) {
                        e.testDataOrderSns = t;
                      },
                      expression: "testDataOrderSns",
                    },
                  }),
                  e.testDataTip
                    ? r(
                        "div",
                        {
                          staticStyle: { "padding-top": "20px", color: "red" },
                        },
                        [e._v(" " + e._s(e.testDataTip) + " ")]
                      )
                    : e._e(),
                  r(
                    "span",
                    {
                      staticClass: "dialog-footer",
                      attrs: { slot: "footer" },
                      slot: "footer",
                    },
                    [
                      r("el-button", { on: { click: e.closeSyncDialog } }, [
                        e._v("取 消"),
                      ]),
                      r(
                        "el-button",
                        {
                          attrs: { type: "primary" },
                          on: { click: e.testData },
                        },
                        [e._v("确 定")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              r(
                "el-dialog",
                {
                  attrs: {
                    title: "选择标签",
                    width: "35%",
                    visible: e.setOrderTagDialogVisible,
                    "close-on-click-modal": !1,
                    "before-close": e.closeSetOrderTagDialog,
                    center: "",
                  },
                },
                [
                  r(
                    "el-radio-group",
                    {
                      model: {
                        value: e.handleOrderLabelParams.label,
                        callback: function(t) {
                          e.$set(e.handleOrderLabelParams, "label", t);
                        },
                        expression: "handleOrderLabelParams.label",
                      },
                    },
                    e._l(e.lablelList, function(t) {
                      return r(
                        "el-radio",
                        { key: t.value, attrs: { label: t.value } },
                        [
                          r("el-tag", { attrs: { type: t.type } }, [
                            e._v(e._s(t.value)),
                          ]),
                        ],
                        1
                      );
                    }),
                    1
                  ),
                  r(
                    "span",
                    {
                      staticClass: "dialog-footer",
                      attrs: { slot: "footer" },
                      slot: "footer",
                    },
                    [
                      r(
                        "el-button",
                        { on: { click: e.closeSetOrderTagDialog } },
                        [e._v("取 消")]
                      ),
                      r(
                        "el-button",
                        {
                          attrs: { type: "primary" },
                          on: { click: e.handleOrderLabel },
                        },
                        [e._v("确 定")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              r(
                "el-dialog",
                {
                  attrs: {
                    title: "绑定业务员",
                    width: "25%",
                    visible: e.bindSalesmanDialogVisible,
                    "close-on-click-modal": !1,
                    "before-close": e.closeBindSalesmanDialog,
                    center: "",
                  },
                },
                [
                  r(
                    "el-select",
                    {
                      attrs: {
                        filterable: "",
                        remote: "",
                        placeholder: "请输入业务员名字",
                        "remote-method": e.searchSalesman,
                      },
                      model: {
                        value: e.bindSalesmanParams.salesmanId,
                        callback: function(t) {
                          e.$set(e.bindSalesmanParams, "salesmanId", t);
                        },
                        expression: "bindSalesmanParams.salesmanId",
                      },
                    },
                    e._l(e.salesmanOptions, function(e) {
                      return r("el-option", {
                        key: e.id,
                        attrs: { label: e.realName, value: e.id },
                      });
                    }),
                    1
                  ),
                  r(
                    "span",
                    {
                      staticClass: "dialog-footer",
                      attrs: { slot: "footer" },
                      slot: "footer",
                    },
                    [
                      r(
                        "el-button",
                        { on: { click: e.closeBindSalesmanDialog } },
                        [e._v("取 消")]
                      ),
                      r(
                        "el-button",
                        {
                          attrs: { type: "primary" },
                          on: { click: e.bindSalesman },
                        },
                        [e._v("确 定")]
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
              r(
                "el-dialog",
                {
                  attrs: {
                    title: "订单总表",
                    fullscreen: "",
                    visible: e.orderSummaryTableVisible,
                    "before-close": e.closeOrderSummaryTableDialog,
                  },
                },
                [
                  r(
                    "el-table",
                    { attrs: { data: e.orderSummaryTableList, border: "" } },
                    [
                      r("el-table-column", {
                        attrs: {
                          prop: "month",
                          label: "月份",
                          width: "100",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "degree",
                          label: "紧急程度",
                          width: "80",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.degreeName ? r.degreeName : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "createTime",
                          label: "故障日期",
                          width: "140",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "orderSn",
                          label: "订单编号",
                          width: "150",
                          fixed: "",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "订单类型",
                          width: "80",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      1 == r.orderType
                                        ? "散单"
                                        : 2 == r.orderType
                                        ? "年保"
                                        : 3 == r.orderType
                                        ? "年卡"
                                        : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "orderStatusName",
                          label: "订单状态",
                          width: "110",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "enterpriseName",
                          label: "企业名称",
                          width: "140",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "lastOrderCreateTime",
                          label: "距上次下单",
                          width: "120",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.lastOrderCreateTime
                                        ? r.lastOrderCreateTime
                                        : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "contactsPeople",
                          label: "联系人",
                          width: "120",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "contactsPhone",
                          label: "联系电话",
                          width: "120",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "address",
                          label: "客户地址",
                          width: "250",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "enterpriseDeviceNo",
                          label: "客户机台号",
                          align: "center",
                          width: "100",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.enterpriseDeviceNo
                                        ? r.enterpriseDeviceNo
                                        : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "no",
                          label: "设备编码",
                          width: "115",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(" " + e._s(r.no ? r.no : "/") + " "),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "deviceTypeName",
                          label: "设备类型",
                          width: "120",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "deviceSystemName",
                          label: "设备系统",
                          width: "120",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.deviceSystemName
                                        ? r.deviceSystemName
                                        : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "deviceBrand",
                          label: "设备品牌",
                          width: "120",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "devicePlace",
                          label: "设备产地",
                          width: "80",
                          align: "center",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "simpleDesc",
                          label: "故障描述",
                          width: "200",
                        },
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "派单时间",
                          width: "150",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.assignTime ? r.assignTime : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "masterRealName",
                          label: "师傅姓名",
                          width: "90",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.masterRealName ? r.masterRealName : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "masterType",
                          label: "师傅类型",
                          width: "90",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.masterType ? r.masterType : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "多师傅接单",
                          width: "150",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(" " + e._s(r.multipleWorkMaster) + " "),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "业务员",
                          width: "90",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.salesmanName ? r.salesmanName : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "完成时间",
                          width: "150",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.checkTime ? r.checkTime : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "人工费(企业)",
                          width: "110",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.doorAmount ? r.doorAmount : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "配件费(企业)",
                          width: "110",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.partsAmount ? r.partsAmount : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "税金(企业)",
                          width: "110",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.invoiceAmount ? r.invoiceAmount : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "优惠减免(企业)",
                          width: "130",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.discountAmount ? r.discountAmount : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          prop: "payAmount",
                          label: "支付金额(企业)",
                          width: "130",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.payAmount ? r.payAmount : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "维修时长",
                          width: "120",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(
                                      r.workDuration ? r.workDuration : "/"
                                    ) +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "返修次数",
                          width: "100",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [
                                e._v(
                                  " " +
                                    e._s(r.returnCount ? r.returnCount : "/") +
                                    " "
                                ),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "是否收款",
                          width: "120",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var r = t.row;
                              return [e._v(" " + e._s(r.payFlag) + " ")];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: { label: "客服", width: "170", align: "center" },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                e.orderSummaryTableListEdit
                                  ? r("el-input", {
                                      attrs: {
                                        size: "small",
                                        placeholder: "请填写负责人",
                                      },
                                      model: {
                                        value: a.kefuName,
                                        callback: function(t) {
                                          e.$set(a, "kefuName", e._n(t));
                                        },
                                        expression: "row.kefuName",
                                      },
                                    })
                                  : r("div", [
                                      e._v(
                                        " " +
                                          e._s(a.kefuName ? a.kefuName : "/") +
                                          " "
                                      ),
                                    ]),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: { label: "单量", width: "110", align: "center" },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                e.orderSummaryTableListEdit
                                  ? r("el-input", {
                                      attrs: {
                                        size: "small",
                                        type: "number",
                                        placeholder: "请选择",
                                      },
                                      model: {
                                        value: a.validOrderNum,
                                        callback: function(t) {
                                          e.$set(a, "validOrderNum", e._n(t));
                                        },
                                        expression: "row.validOrderNum",
                                      },
                                    })
                                  : r("div", [
                                      e._v(
                                        " " +
                                          e._s(
                                            a.validOrderNum
                                              ? a.validOrderNum + "单"
                                              : "/"
                                          ) +
                                          " "
                                      ),
                                    ]),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "回访日期",
                          width: "150",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                e.orderSummaryTableListEdit
                                  ? r("el-date-picker", {
                                      staticStyle: { width: "100%" },
                                      attrs: {
                                        type: "date",
                                        "value-format": "yyyy-MM-dd",
                                        placeholder: "选择日期",
                                        size: "small",
                                      },
                                      model: {
                                        value: a.visitDate,
                                        callback: function(t) {
                                          e.$set(a, "visitDate", t);
                                        },
                                        expression: "row.visitDate",
                                      },
                                    })
                                  : r("div", [
                                      e._v(
                                        e._s(a.visitDate ? a.visitDate : "/")
                                      ),
                                    ]),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "交单日期",
                          width: "150",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                e.orderSummaryTableListEdit
                                  ? r("el-date-picker", {
                                      staticStyle: { width: "100%" },
                                      attrs: {
                                        type: "date",
                                        "value-format": "yyyy-MM-dd",
                                        placeholder: "选择日期",
                                        size: "small",
                                      },
                                      model: {
                                        value: a.documentSubmitDate,
                                        callback: function(t) {
                                          e.$set(a, "documentSubmitDate", t);
                                        },
                                        expression: "row.documentSubmitDate",
                                      },
                                    })
                                  : r("div", [
                                      e._v(
                                        " " +
                                          e._s(
                                            a.documentSubmitDate
                                              ? a.documentSubmitDate
                                              : "/"
                                          ) +
                                          " "
                                      ),
                                    ]),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "返修原因",
                          width: "230",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                e.orderSummaryTableListEdit
                                  ? r("el-input", {
                                      attrs: {
                                        size: "small",
                                        placeholder: "输入返修原因",
                                      },
                                      model: {
                                        value: a.reworkReason,
                                        callback: function(t) {
                                          e.$set(a, "reworkReason", t);
                                        },
                                        expression: "row.reworkReason",
                                      },
                                    })
                                  : r("div", [
                                      e._v(
                                        e._s(
                                          a.reworkReason ? a.reworkReason : "/"
                                        )
                                      ),
                                    ]),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "跟踪详情",
                          width: "230",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                e.orderSummaryTableListEdit
                                  ? r("el-input", {
                                      attrs: {
                                        size: "small",
                                        placeholder: "输入跟踪详情",
                                      },
                                      model: {
                                        value: a.orderFollow,
                                        callback: function(t) {
                                          e.$set(a, "orderFollow", t);
                                        },
                                        expression: "row.orderFollow",
                                      },
                                    })
                                  : r("div", [
                                      e._v(
                                        e._s(
                                          a.orderFollow ? a.orderFollow : "/"
                                        )
                                      ),
                                    ]),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "回访结果",
                          width: "230",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                e.orderSummaryTableListEdit
                                  ? r("el-input", {
                                      attrs: {
                                        size: "small",
                                        placeholder: "输入回访结果",
                                      },
                                      model: {
                                        value: a.visitResult,
                                        callback: function(t) {
                                          e.$set(a, "visitResult", e._n(t));
                                        },
                                        expression: "row.visitResult",
                                      },
                                    })
                                  : r("div", [
                                      e._v(
                                        e._s(
                                          a.visitResult ? a.visitResult : "/"
                                        )
                                      ),
                                    ]),
                              ];
                            },
                          },
                        ]),
                      }),
                      r("el-table-column", {
                        attrs: {
                          label: "停机状况",
                          width: "230",
                          align: "center",
                        },
                        scopedSlots: e._u([
                          {
                            key: "default",
                            fn: function(t) {
                              var a = t.row;
                              return [
                                e.orderSummaryTableListEdit
                                  ? r("el-input", {
                                      attrs: {
                                        size: "small",
                                        placeholder: "输入停机情况",
                                      },
                                      model: {
                                        value: a.shutdownSituation,
                                        callback: function(t) {
                                          e.$set(a, "shutdownSituation", t);
                                        },
                                        expression: "row.shutdownSituation",
                                      },
                                    })
                                  : r("div", [
                                      e._v(
                                        " " +
                                          e._s(
                                            a.shutdownSituation
                                              ? a.shutdownSituation
                                              : "/"
                                          ) +
                                          " "
                                      ),
                                    ]),
                              ];
                            },
                          },
                        ]),
                      }),
                    ],
                    1
                  ),
                  r("div", { staticClass: "orderSummaryTableFoot" }, [
                    r(
                      "div",
                      { staticClass: "orderSummaryTablePagination" },
                      [
                        e.orderSummaryTableListEdit
                          ? e._e()
                          : r("el-pagination", {
                              attrs: {
                                background: "",
                                layout: "prev, pager, next",
                                total: e.orderSummaryTableListTotal,
                              },
                              on: {
                                "current-change": e.changeOrderSummaryTablePage,
                              },
                            }),
                      ],
                      1
                    ),
                    r(
                      "div",
                      { staticClass: "dialog-footer" },
                      [
                        e.orderSummaryTableListEdit
                          ? r(
                              "el-button",
                              {
                                attrs: { type: "success" },
                                on: { click: e.updateOnlineRepairOrder },
                              },
                              [e._v("保 存")]
                            )
                          : r(
                              "el-button",
                              {
                                attrs: { type: "warning" },
                                on: {
                                  click: e.changeOrderSummaryTableListEdit,
                                },
                              },
                              [e._v("编 辑")]
                            ),
                        e.orderSummaryTableListEdit
                          ? e._e()
                          : r(
                              "el-button",
                              {
                                attrs: { type: "primary" },
                                on: {
                                  click:
                                    e.handleOnlineRepairEnterpriseOrderExport,
                                },
                              },
                              [e._v("导 出")]
                            ),
                      ],
                      1
                    ),
                  ]),
                ],
                1
              ),
            ],
            1
          );
        },
        n = [],
        l = r("3835"),
        o = r("1da1"),
        s = r("2909"),
        i = r("5530"),
        c = r("ade3"),
        u =
          (r("96cf"),
          r("a15b"),
          r("ac1f"),
          r("1276"),
          r("d3b7"),
          r("3ca3"),
          r("ddb0"),
          r("2b3d"),
          r("d81d"),
          r("498a"),
          r("caad"),
          r("2532"),
          r("a434"),
          r("159b"),
          r("c740"),
          r("b0c0"),
          r("c24f")),
        d = r("f8b7"),
        m = r("17eb"),
        p = r("8593"),
        h = r("2f62"),
        b = r("ed08"),
        f = {
          title: "course",
          data: function() {
            var e;
            return {
              remarksDialogVisible: !1,
              handleRepairRemarksParamsCopy: { labelList: [], remark: null },
              chooseOrderSn: null,
              orderTag: [],
              orderSubscript: {},
              statusObjList: [
                { str: "totalNum", num: "", desc: "全部" },
                { str: "discardNum", num: -2, desc: "已废弃" },
                { str: "cancelNum", num: -1, desc: "已取消" },
                { str: "waitAssignNum", num: 0, desc: "待指派" },
                { str: "waitReceiveNum", num: 1, desc: "待接单" },
                { str: "waitServiceNum", num: 2, desc: "待服务" },
                { str: "serviceNum", num: 3, desc: "服务中" },
                { str: "waitCheckNum", num: 4, desc: "待验收" },
                { str: "waitCollectionNum", num: 5, desc: "待收/付款" },
                { str: "completeNum", num: 6, desc: "已完成" },
              ],
              setOrderTagDialogVisible: !1,
              handleOrderLabelParams: { label: null, orderSn: null },
              lablelList: [
                { value: "普通", type: "" },
                { value: "199", type: "success" },
                { value: "299", type: "warning" },
              ],
              testDataTip: null,
              testDataOrderSns: null,
              syncDialogVisible: !1,
              formItemDisabled: !1,
              handleProxyCreateOrderParams: {
                no: null,
                latitude: null,
                longitude: null,
                position: null,
                serviceTime: null,
                simpleDesc: null,
                type: null,
                images: null,
                enterpriseName: null,
                address: null,
                contactsPeople: null,
                areaId: null,
                contactsPhone: null,
                deviceBrand: null,
                deviceModel: null,
                devicePlace: null,
                deviceSystemId: null,
                deviceTypeId: null,
              },
              handleProxyCreateOrderRules: {
                type: [
                  {
                    required: !0,
                    message: "请选择故障类型",
                    trigger: "change",
                  },
                ],
                deviceTypeId: [
                  {
                    required: !0,
                    message: "请选择设备类型",
                    trigger: "change",
                  },
                ],
                deviceBrand: [
                  { required: !0, message: "请填写设备品牌", trigger: "blur" },
                ],
                deviceModel: [
                  { required: !0, message: "请填写设备型号", trigger: "blur" },
                ],
                deviceSystemId: [
                  {
                    required: !0,
                    message: "请选择设备系统",
                    trigger: "change",
                  },
                ],
                devicePlace: [
                  {
                    required: !0,
                    message: "请选择设备产地",
                    trigger: "change",
                  },
                ],
                position: [
                  {
                    required: !0,
                    message: "请选择故障部位",
                    trigger: "change",
                  },
                ],
                contactsPeople: [
                  { required: !0, message: "请填写联系人", trigger: "blur" },
                ],
                address: [
                  { required: !0, message: "请填写地址", trigger: "blur" },
                ],
                serviceTime: [
                  { required: !0, message: "请选择日期", trigger: "change" },
                ],
                simpleDesc: [
                  { required: !0, message: "请填写故障描述", trigger: "blur" },
                ],
                images: [
                  { required: !0, message: "请上传故障视图", trigger: "blur" },
                ],
                enterpriseName: [
                  { required: !0, message: "请填写公司名称", trigger: "blur" },
                ],
                contactsPhone: [
                  { required: !0, message: "请填写联系电话", trigger: "blur" },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: "手机号码格式不正确",
                    trigger: "blur",
                  },
                ],
              },
              replacePlaceOrderVisible: !1,
              deviceTypeListOptions: [],
              deviceSystemListOptions: [],
              positionOptions: [],
              devicePlaceOptions: [
                { value: "国产", label: "国产" },
                { value: "进口", label: "进口" },
              ],
              masterSearchList: [],
              convertToInsuranceparams: { orderSn: null, no: null, type: null },
              openConvertToInsuranceShow: !1,
              exportParams: null,
              searchForm:
                ((e = {
                  masterUid: "",
                  deviceTypeId: "",
                  status: "",
                  orderType: "",
                  enterpriseName: "",
                  no: "",
                  platformStatus: "",
                  orderSn: "",
                  finalExamineStatus: null,
                  queryTime: null,
                  masterName: null,
                  timeoutFlag: !1,
                  snkFlag: !1,
                  settlementType: null,
                  dataExamineStatus: null,
                  deviceModel: "",
                }),
                Object(c["a"])(e, "deviceTypeId", ""),
                Object(c["a"])(e, "degree", null),
                e),
              queryTimeCopy: null,
              dataList: [],
              pageCount: null,
              pageCountMaster: "",
              currentPage: 1,
              masterList: [],
              loading: !1,
              Name: "",
              Phone: "",
              enterpriseOrderSn: "",
              url: {
                query: "/admin/maintenance/queryRepairOrderList",
                querySnatch: "/admin/maintenance/queryMasterGrabOrderList",
                handleMasterQuotation:
                  "/admin/maintenance/handleMasterQuotation",
              },
              rules: {
                worker: [
                  { required: !0, message: "请输入接单人", trigger: "blur" },
                ],
                workerPhone: [
                  {
                    required: !0,
                    message: "请输入接单人手机",
                    trigger: "blur",
                  },
                ],
              },
              finishForm: { payAmount: 0 },
              param: {},
              quotationForm: {},
              bindSalesmanParams: { salesmanId: null, orderSn: null },
              salesmanOptions: [],
              bindSalesmanDialogVisible: !1,
              multipleOperation: null,
              multipleSelection: [],
              serviceTypesProps: {
                checkStrictly: !1,
                emitPath: !1,
                multiple: !1,
                value: "id",
                label: "name",
                children: "list",
              },
              orderSummaryTableVisible: !1,
              orderSummaryTableList: [],
              orderSummaryTableListTotal: null,
              orderSummaryTableListEdit: !1,
              orderSummaryTableListParams: {},
            };
          },
          computed: Object(i["a"])(
            Object(i["a"])({}, Object(h["c"])(["sidebar"])),
            {},
            {
              orderRemark: function() {
                var e = this.handleRepairRemarksParamsCopy,
                  t = e.labelList,
                  r = e.remark,
                  a = Object(s["a"])(t);
                return r && a.push(r), a.join(";");
              },
            }
          ),
          created: function() {
            var e = this;
            return Object(o["a"])(
              regeneratorRuntime.mark(function t() {
                var r, a, n, l, o, s, i, c, m, p, h, b, f, v;
                return regeneratorRuntime.wrap(function(t) {
                  while (1)
                    switch ((t.prev = t.next)) {
                      case 0:
                        if (
                          (localStorage.getItem("queryRepairData") &&
                            (r = JSON.parse(
                              localStorage.getItem("queryRepairData")
                            )),
                          !r)
                        ) {
                          t.next = 21;
                          break;
                        }
                        if (
                          ((a = r),
                          (n = a.pageNo),
                          (l = a.pageSize),
                          (o = a.enterpriseName),
                          (s = a.status),
                          (i = a.orderType),
                          (c = a.no),
                          (m = a.orderSn),
                          (p = a.platformStatus),
                          (h = a.queryTime),
                          (b = a.masterName),
                          (e.currentPage = n),
                          (e.pageSize = l),
                          (e.searchForm.enterpriseName = o),
                          (e.searchForm.status = s),
                          (e.searchForm.orderType = i),
                          (e.searchForm.no = c),
                          (e.searchForm.orderSn = m),
                          (e.searchForm.platformStatus = p),
                          (e.searchForm.queryTime = h),
                          e.searchForm.queryTime &&
                            (e.queryTimeCopy = e.searchForm.queryTime.split(
                              "~"
                            )),
                          !b)
                        ) {
                          t.next = 19;
                          break;
                        }
                        return (t.next = 16), Object(u["d"])({ realName: b });
                      case 16:
                        (f = t.sent),
                          (e.masterSearchList = f.data.records),
                          (e.searchForm.masterUid = f.data.records[0].uid);
                      case 19:
                        t.next = 23;
                        break;
                      case 21:
                        (e.currentPage = 1), (e.pageSize = 10);
                      case 23:
                        return (t.next = 25), Object(d["tb"])();
                      case 25:
                        (v = t.sent),
                          (e.typeList = v.data),
                          e._queryRepairOrderList(),
                          e.getOrderSubscript(),
                          e.getSysLabel();
                      case 30:
                      case "end":
                        return t.stop();
                    }
                }, t);
              })
            )();
          },
          methods: {
            updateOnlineRepairOrder: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.next = 2),
                            Object(d["Vb"])(e.orderSummaryTableList)
                          );
                        case 2:
                          (r = t.sent),
                            "000" == r.code &&
                              (e._queryRepairOrderList(),
                              (e.orderSummaryTableListEdit = !1));
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            handleOnlineRepairEnterpriseOrderExport: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a, n, l, o;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (!(e.orderSummaryTableListTotal > 1e3)) {
                            t.next = 3;
                            break;
                          }
                          return (
                            e.$message({
                              message: "查询条数过多,请缩小搜索范围再导出",
                              type: "warning",
                            }),
                            t.abrupt("return")
                          );
                        case 3:
                          return (
                            (r = e.$loading({
                              lock: !0,
                              text: "数据传输中",
                              spinner: "el-icon-loading",
                            })),
                            (a = JSON.parse(
                              JSON.stringify(e.orderSummaryTableListParams)
                            )),
                            (a.pageSize = 9999),
                            (t.next = 8),
                            Object(d["Y"])(a)
                          );
                        case 8:
                          (n = t.sent),
                            n &&
                              ((l = document.createElement("a")),
                              (o = new Blob([n.data], {
                                type: "application/vnd.ms-excel",
                              })),
                              (l.style.display = "none"),
                              (l.href = URL.createObjectURL(o)),
                              (l.download = "订单总表"),
                              document.body.appendChild(l),
                              l.click(),
                              document.body.removeChild(l),
                              r.close());
                        case 10:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            changeOrderSummaryTablePage: function(e) {
              var t = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function r() {
                  var a;
                  return regeneratorRuntime.wrap(function(r) {
                    while (1)
                      switch ((r.prev = r.next)) {
                        case 0:
                          return (
                            (t.orderSummaryTableListParams.pageNo = e),
                            (r.next = 3),
                            Object(d["Pb"])(t.orderSummaryTableListParams)
                          );
                        case 3:
                          (a = r.sent),
                            "000" == a.code &&
                              ((t.orderSummaryTableList = a.data.records),
                              (t.orderSummaryTableListTotal = a.data.total));
                        case 5:
                        case "end":
                          return r.stop();
                      }
                  }, r);
                })
              )();
            },
            queryOrderSummaryTableList: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (e.orderSummaryTableListParams = Object(i["a"])(
                              { pageNo: e.currentPage, pageSize: 10 },
                              e.searchForm
                            )),
                            (t.next = 3),
                            Object(d["Pb"])(e.orderSummaryTableListParams)
                          );
                        case 3:
                          (r = t.sent),
                            "000" == r.code &&
                              ((e.orderSummaryTableList = r.data.records),
                              (e.orderSummaryTableListTotal = r.data.total));
                        case 5:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            changeOrderSummaryTableListEdit: function() {
              this.orderSummaryTableListEdit = !0;
            },
            closeOrderSummaryTableDialog: function() {
              (this.orderSummaryTableListParams = {}),
                (this.orderSummaryTableList = []),
                (this.orderSummaryTableListTotal = null),
                (this.orderSummaryTableVisible = !1),
                (this.orderSummaryTableListEdit = !1);
            },
            tableListFn: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), e.queryOrderSummaryTableList();
                        case 2:
                          e.orderSummaryTableVisible = !0;
                        case 3:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            exportListFn: function(e) {
              "导出" != e
                ? this.handleRepairEnterpriseOrderExport()
                : this.exportList();
            },
            isWithinOneMonth: function(e, t) {
              if (!e) return !1;
              var r = e.split("~").map(function(e) {
                  return e.trim();
                }),
                a = Object(l["a"])(r, 2),
                n = a[0],
                o = a[1],
                s = new Date(n),
                i = new Date(o);
              if (isNaN(s) || isNaN(i)) throw new Error("Invalid date format");
              var c = i - s,
                u = c / 864e5;
              return u >= 0 && u <= t;
            },
            handleRepairEnterpriseOrderExport: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a, n, l;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (!(e.pageCount > 1e3)) {
                            t.next = 3;
                            break;
                          }
                          return (
                            e.$message({
                              message: "查询条数过多,请缩小搜索范围再导出",
                              type: "warning",
                            }),
                            t.abrupt("return")
                          );
                        case 3:
                          return (
                            (r = e.$loading({
                              lock: !0,
                              text: "数据传输中",
                              spinner: "el-icon-loading",
                            })),
                            (e.exportParams.pageSize = 1e4),
                            (t.next = 7),
                            Object(d["hb"])(e.exportParams)
                          );
                        case 7:
                          (a = t.sent),
                            a &&
                              ((n = document.createElement("a")),
                              (l = new Blob([a.data], {
                                type: "application/vnd.ms-excel",
                              })),
                              (n.style.display = "none"),
                              (n.href = URL.createObjectURL(l)),
                              (n.download = "维保列表"),
                              document.body.appendChild(n),
                              n.click(),
                              document.body.removeChild(n),
                              r.close());
                        case 9:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            copyOrder: function(e) {
              var t = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function r() {
                  var a, n;
                  return regeneratorRuntime.wrap(function(r) {
                    while (1)
                      switch ((r.prev = r.next)) {
                        case 0:
                          return (
                            (r.next = 2),
                            t.$confirm(
                              "您是否根据【".concat(
                                e.orderSn,
                                "】复制一个新的订单号?"
                              ),
                              "复制订单",
                              {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning",
                              }
                            )
                          );
                        case 2:
                          if (((a = r.sent), "confirm" != a)) {
                            r.next = 8;
                            break;
                          }
                          return (r.next = 6), Object(d["h"])(e.orderSn);
                        case 6:
                          (n = r.sent),
                            "000" == n.code &&
                              (t.$message({
                                message: "复制成功！",
                                type: "success",
                              }),
                              t._queryRepairOrderList());
                        case 8:
                        case "end":
                          return r.stop();
                      }
                  }, r);
                })
              )();
            },
            deleteRepairOrder: function(e) {
              var t = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function r() {
                  var a, n;
                  return regeneratorRuntime.wrap(function(r) {
                    while (1)
                      switch ((r.prev = r.next)) {
                        case 0:
                          return (
                            (r.next = 2),
                            t.$confirm("您确定要该订单吗？", "删除订单", {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning",
                            })
                          );
                        case 2:
                          if (((a = r.sent), "confirm" != a)) {
                            r.next = 8;
                            break;
                          }
                          return (r.next = 6), Object(d["l"])(e.id);
                        case 6:
                          (n = r.sent),
                            "000" == n.code &&
                              (t.$message({
                                message: "删除成功！",
                                type: "success",
                              }),
                              t._queryRepairOrderList());
                        case 8:
                        case "end":
                          return r.stop();
                      }
                  }, r);
                })
              )();
            },
            handleRepairRemarks: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (r = {
                              orderSn: e.chooseOrderSn,
                              remarks: e.orderRemark,
                            }),
                            (t.next = 3),
                            Object(d["lb"])(r)
                          );
                        case 3:
                          (a = t.sent),
                            "000" == a.code &&
                              (e.$message({
                                message: a.message,
                                type: "success",
                              }),
                              e.closeRemarksDialog(),
                              e._queryRepairOrderList());
                        case 5:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            closeRemarksDialog: function() {
              (this.handleRepairRemarksParamsCopy = {
                labelList: [],
                remark: null,
              }),
                (this.chooseOrderSn = null),
                (this.remarksDialogVisible = !1);
            },
            judgeTagSelected: function(e) {
              return this.handleRepairRemarksParamsCopy.labelList.includes(e);
            },
            addTag: function(e) {
              var t = this.handleRepairRemarksParamsCopy.labelList,
                r = t.indexOf(e);
              r > -1 ? t.splice(r, 1) : t.push(e);
            },
            getSysLabel: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), Object(p["m"])("orderRemarkTag");
                        case 2:
                          (r = t.sent),
                            "000" == r.code &&
                              r.data &&
                              (e.orderTag = r.data.split(","));
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            openRemarksDialog: function(e) {
              var t = this;
              if (e.remarks) {
                var r = e.remarks.split(";");
                r.forEach(function(e) {
                  t.orderTag.includes(e)
                    ? t.handleRepairRemarksParamsCopy.labelList.push(e)
                    : (t.handleRepairRemarksParamsCopy.remark = e);
                });
              }
              (this.chooseOrderSn = e.orderSn),
                (this.remarksDialogVisible = !0);
            },
            handleBatchProxyPayment: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (r = e.multipleSelection.map(function(e) {
                              return String(e.orderSn);
                            })),
                            (t.next = 3),
                            Object(m["a"])({ orderSnList: r })
                          );
                        case 3:
                          if (((a = t.sent), "000" != a.code)) {
                            t.next = 8;
                            break;
                          }
                          return (
                            e.$message({
                              message: "操作成功",
                              type: "success",
                            }),
                            (t.next = 8),
                            e._queryRepairOrderList()
                          );
                        case 8:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            handleSelectionChange: function(e) {
              this.multipleSelection = e;
            },
            bindSalesman: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.next = 2), Object(d["c"])(e.bindSalesmanParams)
                          );
                        case 2:
                          if (((r = t.sent), "000" != r.code)) {
                            t.next = 7;
                            break;
                          }
                          return (t.next = 6), e._queryRepairOrderList();
                        case 6:
                          e.closeBindSalesmanDialog();
                        case 7:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            searchSalesman: function(e) {
              var t = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function r() {
                  var a;
                  return regeneratorRuntime.wrap(function(r) {
                    while (1)
                      switch ((r.prev = r.next)) {
                        case 0:
                          return (
                            (r.next = 2),
                            Object(u["t"])({
                              pageNo: 1,
                              pageSize: 100,
                              realName: e,
                              recommendName: null,
                            })
                          );
                        case 2:
                          (a = r.sent),
                            "000" == a.code &&
                              (t.salesmanOptions = a.data.records);
                        case 4:
                        case "end":
                          return r.stop();
                      }
                  }, r);
                })
              )();
            },
            closeBindSalesmanDialog: function() {
              (this.bindSalesmanParams.salesmanId = null),
                (this.bindSalesmanParams.orderSn = null),
                (this.salesmanOptions = []),
                (this.bindSalesmanDialogVisible = !1);
            },
            openBindSalesmanDialog: function(e) {
              (this.bindSalesmanParams.orderSn = e),
                (this.bindSalesmanDialogVisible = !0);
            },
            changeOrderState: function() {
              this._queryRepairOrderList();
            },
            changeInquireMasterFn: function(e) {
              var t = this.masterSearchList.findIndex(function(t) {
                return t.uid == e;
              });
              this.searchForm.masterName = this.masterSearchList[t].realName;
            },
            downloadFn: function() {},
            handleOrderLabel: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (e.handleOrderLabelParams.label) {
                            t.next = 3;
                            break;
                          }
                          return (
                            e.$message({
                              message: "请填写标签内容",
                              type: "warning",
                            }),
                            t.abrupt("return")
                          );
                        case 3:
                          return (
                            "普通" == e.handleOrderLabelParams.label &&
                              (e.handleOrderLabelParams.label = ""),
                            (t.next = 6),
                            Object(d["bb"])(e.handleOrderLabelParams)
                          );
                        case 6:
                          (r = t.sent),
                            "000" == r.code &&
                              (e.$message({
                                message: r.message,
                                type: "success",
                              }),
                              e.closeSetOrderTagDialog(),
                              e._queryRepairOrderList());
                        case 8:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            closeSetOrderTagDialog: function() {
              (this.handleOrderLabelParams = { label: null, orderSn: null }),
                (this.setOrderTagDialogVisible = !1);
            },
            setOrderTag: function(e) {
              (this.handleOrderLabelParams.orderSn = e.orderSn),
                e.label
                  ? (this.handleOrderLabelParams.label = e.label)
                  : (this.handleOrderLabelParams.label = "普通"),
                (this.setOrderTagDialogVisible = !0);
            },
            testData: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (e.testDataOrderSns) {
                            t.next = 3;
                            break;
                          }
                          return (
                            e.$message({
                              message: "请填写要同步的订单号",
                              type: "warning",
                            }),
                            t.abrupt("return")
                          );
                        case 3:
                          return (
                            (e.testDataTip = null),
                            (r = e.$loading({
                              lock: !0,
                              text: "Loading",
                              spinner: "el-icon-loading",
                              background: "rgba(0, 0, 0, 0.7)",
                            })),
                            (t.next = 7),
                            Object(d["Wb"])(e.testDataOrderSns)
                          );
                        case 7:
                          (a = t.sent),
                            r.close(),
                            "000" == a.code && "" == a.data
                              ? (e.$message({
                                  message: a.message,
                                  type: "success",
                                }),
                                e.closeSyncDialog())
                              : ((e.testDataOrderSns = null),
                                (e.testDataTip = a.data));
                        case 10:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            closeSyncDialog: function() {
              (this.testDataTip = null),
                (this.testDataOrderSns = null),
                (this.syncDialogVisible = !1);
            },
            openSyncDialog: function() {
              this.syncDialogVisible = !0;
            },
            changeQueryTimeCopy: function() {
              this.searchForm.queryTime =
                this.queryTimeCopy[0] + "~" + this.queryTimeCopy[1];
            },
            handleProxyCreateOrder: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.next = 2),
                            e.$refs["handleProxyCreateOrderRef"].validate()
                          );
                        case 2:
                          return (
                            (t.next = 4),
                            Object(m["h"])(e.handleProxyCreateOrderParams)
                          );
                        case 4:
                          (r = t.sent),
                            "操作成功" == r.message &&
                              (e.closeReplacePlaceOrderDialog(),
                              e._queryRepairOrderList());
                        case 6:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            getDeviceInfoByNo: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a, n, l, o, s, i, c, u;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.next = 2),
                            Object(d["F"])(e.handleProxyCreateOrderParams.no)
                          );
                        case 2:
                          (r = t.sent),
                            r.data
                              ? ((a = r.data),
                                (n = a.deviceBrand),
                                (l = a.deviceModel),
                                (o = a.devicePlace),
                                (s = a.deviceSystemId),
                                (i = a.deviceTypeId),
                                (c = a.enterpriseAddress),
                                (u = a.enterpriseName),
                                (e.handleProxyCreateOrderParams.deviceBrand = n),
                                (e.handleProxyCreateOrderParams.deviceModel = l),
                                (e.handleProxyCreateOrderParams.devicePlace = o),
                                (e.handleProxyCreateOrderParams.deviceSystemId = s),
                                (e.handleProxyCreateOrderParams.deviceTypeId = i),
                                (e.handleProxyCreateOrderParams.address = c),
                                (e.handleProxyCreateOrderParams.enterpriseName = u),
                                (e.formItemDisabled = !0))
                              : ((e.handleProxyCreateOrderParams.deviceBrand = null),
                                (e.handleProxyCreateOrderParams.deviceModel = null),
                                (e.handleProxyCreateOrderParams.devicePlace = null),
                                (e.handleProxyCreateOrderParams.deviceSystemId = null),
                                (e.handleProxyCreateOrderParams.deviceTypeId = null),
                                (e.handleProxyCreateOrderParams.address = null),
                                (e.handleProxyCreateOrderParams.enterpriseName = null),
                                (e.formItemDisabled = !1));
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            openReplacePlaceOrderDialog: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), e.queryDeviceTypeList();
                        case 2:
                          return (t.next = 4), e.queryDeviceSystemList();
                        case 4:
                          return (t.next = 6), e.queryFaultPosition();
                        case 6:
                          e.replacePlaceOrderVisible = !0;
                        case 7:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            closeReplacePlaceOrderDialog: function() {
              this.$refs["handleProxyCreateOrderRef"].resetFields(),
                (this.handleProxyCreateOrderParams = {
                  no: null,
                  latitude: null,
                  longitude: null,
                  position: null,
                  serviceTime: null,
                  simpleDesc: null,
                  type: null,
                  images: null,
                  enterpriseName: null,
                  address: null,
                  contactsPeople: null,
                  areaId: null,
                  contactsPhone: null,
                  deviceBrand: null,
                  deviceModel: null,
                  devicePlace: null,
                  deviceSystemId: null,
                  deviceTypeId: null,
                }),
                (this.replacePlaceOrderVisible = !1);
            },
            changePosition: function(e) {
              this.handleProxyCreateOrderParams.position = e[e.length - 1];
            },
            changeDeviceSystem: function(e) {
              this.handleProxyCreateOrderParams.deviceSystemId =
                e[e.length - 1];
            },
            changeDeviceType: function(e) {
              this.handleProxyCreateOrderParams.deviceTypeId = e[e.length - 1];
            },
            queryFaultPositionOne: function(e, t) {
              return Object(o["a"])(
                regeneratorRuntime.mark(function r() {
                  var a, n;
                  return regeneratorRuntime.wrap(function(r) {
                    while (1)
                      switch ((r.prev = r.next)) {
                        case 0:
                          return (a = []), (r.next = 3), Object(d["wb"])(e);
                        case 3:
                          return (
                            (n = r.sent),
                            n.data.forEach(function(e) {
                              a.push({ value: e, label: e });
                            }),
                            r.abrupt("return", {
                              value: t,
                              label: t,
                              children: a,
                            })
                          );
                        case 6:
                        case "end":
                          return r.stop();
                      }
                  }, r);
                })
              )();
            },
            queryFaultPosition: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.next = 2), e.queryFaultPositionOne(1, "加工中心")
                          );
                        case 2:
                          return (
                            (r = t.sent),
                            (t.next = 5),
                            e.queryFaultPositionOne(2, "数控车床")
                          );
                        case 5:
                          (a = t.sent), (e.positionOptions = [r, a]);
                        case 7:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            queryDeviceSystemList: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), Object(d["sb"])();
                        case 2:
                          (r = t.sent),
                            r.data &&
                              ((a = []),
                              r.data.forEach(function(e) {
                                var t = [];
                                e.list &&
                                  e.list.forEach(function(e) {
                                    t.push({ value: e.id, label: e.name });
                                  }),
                                  a.push({
                                    value: e.id,
                                    label: e.name,
                                    children: t,
                                  });
                              }),
                              (e.deviceSystemListOptions = a));
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            queryDeviceTypeList: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), Object(d["tb"])();
                        case 2:
                          (r = t.sent),
                            r.data &&
                              ((a = []),
                              r.data.forEach(function(e) {
                                var t = [];
                                e.list &&
                                  e.list.forEach(function(e) {
                                    t.push({ value: e.id, label: e.name });
                                  }),
                                  a.push({
                                    value: e.id,
                                    label: e.name,
                                    children: t,
                                  });
                              }),
                              (e.deviceTypeListOptions = a));
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            uploadFaultImg: function(e) {
              var t = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function r() {
                  var a, n;
                  return regeneratorRuntime.wrap(function(r) {
                    while (1)
                      switch ((r.prev = r.next)) {
                        case 0:
                          return (
                            (a = new FormData()),
                            a.append("file", e.file),
                            (r.next = 4),
                            Object(p["a"])(a)
                          );
                        case 4:
                          (n = r.sent),
                            "操作成功" == n.message &&
                              (t.handleProxyCreateOrderParams.images = n.data);
                        case 6:
                        case "end":
                          return r.stop();
                      }
                  }, r);
                })
              )();
            },
            delFaultImg: function() {
              this.handleProxyCreateOrderParams.images = "";
            },
            openFaultImg: function() {
              window.open(this.handleProxyCreateOrderParams.images, "_blank");
            },
            convertToInsurance: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.next = 2),
                            Object(d["g"])(e.convertToInsuranceparams)
                          );
                        case 2:
                          (r = t.sent),
                            "操作成功" === r.message &&
                              (e.$message({
                                message: "操作成功",
                                type: "success",
                              }),
                              e.closeConvertToInsurance(),
                              e._queryRepairOrderList());
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            closeConvertToInsurance: function() {
              (this.openConvertToInsuranceShow = !1),
                (this.convertToInsuranceparams = { orderSn: null, no: null });
            },
            openConvertToInsurance: function(e) {
              (this.convertToInsuranceparams.orderSn = e),
                (this.openConvertToInsuranceShow = !0);
            },
            searchMaster: function(e) {
              var t = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function r() {
                  var a;
                  return regeneratorRuntime.wrap(function(r) {
                    while (1)
                      switch ((r.prev = r.next)) {
                        case 0:
                          return (r.next = 2), Object(u["d"])({ realName: e });
                        case 2:
                          (a = r.sent), (t.masterSearchList = a.data.records);
                        case 4:
                        case "end":
                          return r.stop();
                      }
                  }, r);
                })
              )();
            },
            query_queryRepairOrderList: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (e.currentPage = 1),
                            (t.next = 3),
                            e._queryRepairOrderList()
                          );
                        case 3:
                          e.getOrderSubscript();
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            exportList: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a, n, l;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (!(e.pageCount > 500)) {
                            t.next = 3;
                            break;
                          }
                          return (
                            e.$message({
                              message: "查询条数过多,请缩小搜索范围再导出",
                              type: "warning",
                            }),
                            t.abrupt("return")
                          );
                        case 3:
                          return (
                            (r = e.$loading({
                              lock: !0,
                              text: "数据传输中",
                              spinner: "el-icon-loading",
                            })),
                            (e.exportParams.pageSize = 1e4),
                            (t.next = 7),
                            Object(d["ib"])(e.exportParams)
                          );
                        case 7:
                          (a = t.sent),
                            a &&
                              ((n = document.createElement("a")),
                              (l = new Blob([a.data], {
                                type: "application/vnd.ms-excel",
                              })),
                              (n.style.display = "none"),
                              (n.href = URL.createObjectURL(l)),
                              (n.download = "维保列表"),
                              document.body.appendChild(n),
                              n.click(),
                              document.body.removeChild(n),
                              r.close());
                        case 9:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            resetFn: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (e.currentPage = 1),
                            (e.queryTimeCopy = null),
                            (e.searchForm =
                              ((r = {
                                deviceTypeId: "",
                                status: "",
                                orderType: "",
                                enterpriseName: "",
                                no: "",
                                platformStatus: "",
                                orderSn: "",
                                finalExamineStatus: null,
                                queryTime: "",
                                timeoutFlag: !1,
                                snkFlag: !1,
                                settlementType: null,
                                dataExamineStatus: null,
                                deviceModel: "",
                              }),
                              Object(c["a"])(r, "deviceTypeId", ""),
                              Object(c["a"])(r, "degree", null),
                              r)),
                            (t.next = 5),
                            e._queryRepairOrderList()
                          );
                        case 5:
                          e.getOrderSubscript();
                        case 6:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            templateDownload: function() {
              return Object(o["a"])(
                regeneratorRuntime.mark(function e() {
                  var t;
                  return regeneratorRuntime.wrap(function(e) {
                    while (1)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), Object(d["o"])();
                        case 2:
                          (t = e.sent), (window.location.href = t.data);
                        case 4:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            workOrderImport: function(e) {
              var t = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function r() {
                  var a, n;
                  return regeneratorRuntime.wrap(function(r) {
                    while (1)
                      switch ((r.prev = r.next)) {
                        case 0:
                          return (
                            (a = new FormData()),
                            a.append("file", e.file),
                            (r.next = 4),
                            Object(d["ac"])(a)
                          );
                        case 4:
                          (n = r.sent),
                            "操作成功" === n.message &&
                              (t.$message({
                                message: "已成功批量下单",
                                type: "success",
                              }),
                              t._queryAssignableMasterList(),
                              t._queryRepairOrderList());
                        case 6:
                        case "end":
                          return r.stop();
                      }
                  }, r);
                })
              )();
            },
            _queryAssignableMasterList: function() {
              var e = this,
                t = {
                  pageNo: this.currentPage,
                  pageSize: 10,
                  realName: this.Name,
                };
              Object(u["n"])(t).then(function(t) {
                t &&
                  ((e.masterList = t.data.records),
                  (e.pageCountMaster = t.data.total),
                  (e.currentPage = t.data.current));
              });
            },
            getOrderSubscript: function() {
              var e = this;
              return Object(o["a"])(
                regeneratorRuntime.mark(function t() {
                  var r, a;
                  return regeneratorRuntime.wrap(function(t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (r = Object(i["a"])(
                              { pageNo: e.currentPage, pageSize: 10 },
                              e.searchForm
                            )),
                            (t.next = 3),
                            Object(d["H"])(r)
                          );
                        case 3:
                          (a = t.sent),
                            "000" == a.code && (e.orderSubscript = a.data);
                        case 5:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            _queryRepairOrderList: function() {
              var e = this,
                t = Object(i["a"])(
                  { pageNo: this.currentPage, pageSize: 10 },
                  this.searchForm
                );
              Object(b["b"])("queryRepairData", JSON.stringify(t)),
                (this.exportParams = JSON.parse(JSON.stringify(t))),
                Object(d["Pb"])(t).then(function(t) {
                  t &&
                    (t.data.records.forEach(function(e) {
                      e.label || (e.label = "普通");
                    }),
                    (e.multipleOperation =
                      1 === e.searchForm.settlementType ||
                      2 === e.searchForm.settlementType),
                    (e.dataList = t.data.records),
                    (e.pageCount = t.data.total));
                });
            },
            updatePageNo: function(e) {
              (this.currentPage = e), this._queryRepairOrderList();
            },
            queryDesc: function(e) {
              var t = this.$router.resolve({
                name: "maintenance_order_desc",
                query: { orderSn: e.orderSn },
              });
              window.open(t.href, "_blank");
            },
          },
        },
        v = f,
        g = (r("64cf"), r("2877")),
        y = Object(g["a"])(v, a, n, !1, null, "d19a61c4", null);
      t["default"] = y.exports;
    },
    "17eb": function(e, t, r) {
      "use strict";
      r.d(t, "b", function() {
        return n;
      }),
        r.d(t, "g", function() {
          return l;
        }),
        r.d(t, "i", function() {
          return o;
        }),
        r.d(t, "a", function() {
          return s;
        }),
        r.d(t, "j", function() {
          return i;
        }),
        r.d(t, "n", function() {
          return c;
        }),
        r.d(t, "k", function() {
          return u;
        }),
        r.d(t, "f", function() {
          return d;
        }),
        r.d(t, "d", function() {
          return m;
        }),
        r.d(t, "l", function() {
          return p;
        }),
        r.d(t, "m", function() {
          return h;
        }),
        r.d(t, "h", function() {
          return b;
        }),
        r.d(t, "e", function() {
          return f;
        }),
        r.d(t, "c", function() {
          return v;
        });
      var a = r("b775");
      function n(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleEnterpriseCheck?orderSn=" + e,
          method: "GET",
        });
      }
      function l(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleProxyConfirmQuotation",
          method: "post",
          data: e,
        });
      }
      function o(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleProxyPayment?orderSn=" + e,
          method: "get",
        });
      }
      function s(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleBatchProxyPayment",
          method: "post",
          data: e,
        });
      }
      function i(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleReleaseComment",
          method: "post",
          data: e,
        });
      }
      function c(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleTakeOrder",
          method: "post",
          data: e,
        });
      }
      function u(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleRemindStarted",
          method: "post",
          data: e,
        });
      }
      function d(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handlePhotographPunch",
          method: "post",
          data: e,
        });
      }
      function m(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleMasterQuotation",
          method: "post",
          data: e,
        });
      }
      function p(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleStartService?orderSn=" + e,
          method: "get",
        });
      }
      function h(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleSubmitAcceptance",
          method: "post",
          data: e,
        });
      }
      function b(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleProxyCreateOrder",
          method: "post",
          data: e,
        });
      }
      function f(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleOnlineOrder?orderSn=" + e,
          method: "get",
        });
      }
      function v(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/proxy/handleEnterpriseNegotiatedPrice",
          method: "post",
          data: e,
        });
      }
    },
    "64cf": function(e, t, r) {
      "use strict";
      r("c367");
    },
    a15b: function(e, t, r) {
      "use strict";
      var a = r("23e7"),
        n = r("e330"),
        l = r("44ad"),
        o = r("fc6a"),
        s = r("a640"),
        i = n([].join),
        c = l != Object,
        u = s("join", ",");
      a(
        { target: "Array", proto: !0, forced: c || !u },
        {
          join: function(e) {
            return i(o(this), void 0 === e ? "," : e);
          },
        }
      );
    },
    c24f: function(e, t, r) {
      "use strict";
      r.d(t, "g", function() {
        return n;
      }),
        r.d(t, "t", function() {
          return l;
        }),
        r.d(t, "k", function() {
          return o;
        }),
        r.d(t, "a", function() {
          return s;
        }),
        r.d(t, "u", function() {
          return i;
        }),
        r.d(t, "d", function() {
          return c;
        }),
        r.d(t, "n", function() {
          return u;
        }),
        r.d(t, "f", function() {
          return d;
        }),
        r.d(t, "e", function() {
          return m;
        }),
        r.d(t, "c", function() {
          return p;
        }),
        r.d(t, "v", function() {
          return h;
        }),
        r.d(t, "l", function() {
          return b;
        }),
        r.d(t, "m", function() {
          return f;
        }),
        r.d(t, "p", function() {
          return v;
        }),
        r.d(t, "q", function() {
          return g;
        }),
        r.d(t, "o", function() {
          return y;
        }),
        r.d(t, "h", function() {
          return w;
        }),
        r.d(t, "b", function() {
          return O;
        }),
        r.d(t, "s", function() {
          return x;
        }),
        r.d(t, "r", function() {
          return S;
        }),
        r.d(t, "i", function() {
          return P;
        }),
        r.d(t, "j", function() {
          return k;
        });
      var a = r("b775");
      r("cb5c");
      function n(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/handleCommission",
          method: "post",
          data: e,
        });
      }
      function l(e) {
        return Object(a["a"])({
          url: "/admin/business/querySalesmanList",
          method: "post",
          data: e,
        });
      }
      function o(e) {
        return Object(a["a"])({
          url: "/admin/business/handleSalesmanChatMapperBind",
          method: "post",
          data: e,
        });
      }
      function s(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/bindUserAccount",
          method: "post",
          data: e,
        });
      }
      function i(e) {
        return Object(a["a"])({
          url: "/admin/userInfo/queryUserInfo",
          method: "post",
          data: e,
        });
      }
      function c(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/queryMasterList",
          method: "get",
          params: e,
        });
      }
      function u(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/queryAssignableMasterList",
          method: "post",
          data: e,
        });
      }
      function d(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/handleAssignMaster",
          method: "post",
          data: e,
        });
      }
      function m(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/getRepairOrderDetail",
          method: "get",
          params: e,
        });
      }
      function p(e) {
        return Object(a["a"])({
          url: "/admin/maintenance/queryEnterpriseList",
          method: "post",
          data: e,
        });
      }
      function h(e) {
        return Object(a["a"])({
          url: "/admin/userInfo/queryWithdrawal",
          method: "post",
          data: e,
        });
      }
      function b(e) {
        return Object(a["a"])({
          url: "/admin/userInfo/handleWithdrawalExamine",
          method: "post",
          data: e,
        });
      }
      function f(e) {
        return Object(a["a"])({
          url: "/admin/userInfo/handleWithdrawalExport",
          method: "post",
          responseType: "blob",
          data: e,
        });
      }
      function v(e) {
        return Object(a["a"])({
          url: "/admin/business/queryCustomerPool",
          method: "post",
          data: e,
        });
      }
      function g(e) {
        return Object(a["a"])({
          url: "/admin/business/queryCustomerVisitList",
          method: "post",
          data: e,
        });
      }
      function y(e) {
        return Object(a["a"])({
          url: "/admin/business/queryCustomerApplyVisitList",
          method: "post",
          data: e,
        });
      }
      function w(e) {
        return Object(a["a"])({
          url: "/admin/business/handleCustomerApplyVisit",
          method: "post",
          data: e,
        });
      }
      function O(e) {
        return Object(a["a"])({
          url: "/admin/userInfo/getAccountMoney?uid=" + e,
          method: "get",
        });
      }
      function x(e) {
        return Object(a["a"])({
          url: "/admin/userInfo/queryMoneyList",
          method: "post",
          data: e,
        });
      }
      function S(e) {
        return Object(a["a"])({
          url: "/admin/business/queryEnterpriseWechatList",
          method: "post",
          data: e,
        });
      }
      function P(e) {
        return Object(a["a"])({
          url: "/admin/business/handleEnterpriseWechatBind",
          method: "post",
          data: e,
        });
      }
      function k() {
        return Object(a["a"])({
          url: "/admin/business/handleRepairOrderBind",
          method: "post",
        });
      }
    },
    c367: function(e, t, r) {},
  },
]);
