<template>
  <div class="content_box">
    <first-title title="优惠券" />
    <div class="select_view flexBox">
      <div>
        <el-input
          v-model="queryCouponParams.name"
          style="width: 200px"
          class="mg_r15 mg_t10"
          placeholder="请输入优惠券名称"
        />
      </div>
      <div>
        <el-button class="mg_t10" type="primary" @click="queryCouponFn"
          ><i class="el-icon-search" />查询</el-button
        >
        <el-button class="mg_t10 mg_r15" type="danger" @click="resSetQueryFn"
          ><i class="el-icon-refresh" />重置</el-button
        >
        <el-button type="primary" @click="addItemFn"
          ><i class="el-icon-plus" />添加优惠券</el-button
        >
        <el-button type="primary" @click="openGiveCouponDialog"
          >手动发券</el-button
        >
        <el-button type="warning" @click="goToReceiveRecords(null)"
          ><i class="el-icon-tickets" />查看所有领取记录</el-button
        >
      </div>
    </div>
    <el-table border :data="dataList" class="list">
      <el-table-column label="名称" align="center" header-align="center">
        <template slot-scope="{ row }">
          <el-button type="text" @click="goToReceiveRecords(row.id)">{{
            row.name
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="使用门槛" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.minPoint ? "￥" + row.minPoint : "无门槛" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="减免费用" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.offerAmount ? "￥" + row.offerAmount : "0" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放门槛" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.grantStandard ? "￥" + row.grantStandard : "无门槛"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总发行量" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.publishCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用数量" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.useCount ? row.useCount : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已领取数量" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.receiveCount ? row.receiveCount : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.expiryTime ? row.expiryTime : 0 }}天</span>
        </template>
      </el-table-column>
      <el-table-column
        label="使用须知/备注"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.note ? row.note : "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="券有效期开始"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="券有效期截止"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否过期" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span v-if="row.isExpired === 0">未过期</span>
          <span v-else style="color: red">已过期/结束</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态(开启/关闭)"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.id == undefined"
            @change="statusChangeFn($event, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        header-align="center"
        width="220px"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="editItemFn(scope.row.id)"
            >查看并编辑</el-button
          >
          <el-button
            v-if="scope.row.id"
            type="danger"
            size="small"
            @click="deleteItemFn(scope)"
            ><i class="el-icon-delete" />删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加/查看并编辑"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="closeDialogVisible"
      width="30%"
    >
      <div>
        <el-form ref="form" :model="defDdata" label-width="120px">
          <el-form-item label="优惠券名称">
            <el-input v-model="defDdata.name" placeholder="例如:满200减20券" />
          </el-form-item>
          <el-form-item label="发放门槛">
            <el-input
              type="number"
              v-model.number="defDdata.grantStandard"
              placeholder="例如:2000(订单人工费满2000元评价后自动发放)"
            />
          </el-form-item>
          <el-form-item label="使用门槛">
            <el-input
              v-model="defDdata.minPoint"
              type="number"
              placeholder="例如:200"
            />
          </el-form-item>
          <el-form-item label="减免金额">
            <el-input
              type="number"
              v-model.number="defDdata.offerAmount"
              placeholder="例如:20"
            />
          </el-form-item>
          <el-form-item label="总发行量">
            <el-input
              v-model="defDdata.publishCount"
              type="number"
              placeholder="例如:100"
            />
          </el-form-item>
          <el-form-item label="使用须知">
            <el-input
              v-model="defDdata.note"
              type="textarea"
              placeholder="例如:订单人工费满200元后才可使用该优惠券减免20元"
            />
          </el-form-item>
          <el-form-item label="有效时间(天)">
            <el-input-number
              v-model="defDdata.expiryTime"
              :precision="0"
              :min="0"
              :controls="true"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="券有效期开始">
            <el-date-picker
              v-model="defDdata.startDate"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="券有效期截止">
            <el-date-picker
              v-model="defDdata.endDate"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态(开启/关闭)">
            <el-switch
              v-model="defDdata.status"
              :active-value="1"
              :inactive-value="0"
              :disabled="defDdata.id == undefined"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible">取 消</el-button>
        <el-button type="primary" @click="submitDataFn">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="手动发券"
      :visible="giveCouponVisible"
      :close-on-click-modal="false"
      :before-close="closeGiveCouponDialog"
      width="50%"
    >
      <el-form
        label-width="120px"
        :model="giveCouponParams"
        :rules="giveCouponRules"
        ref="giveCouponRef"
      >
        <el-form-item label="发放群体：">
          <el-radio-group
            v-model="giveCouponParams.grantGroupType"
            @input="changeGrantGroupType"
          >
            <el-radio :label="0">个人用户</el-radio>
            <el-radio :label="1">企业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="用户名称："
          prop="uid"
          v-if="giveCouponParams.grantGroupType == 0"
        >
          <el-select
            style="width: 60%"
            v-model="giveCouponParams.uid"
            filterable
            remote
            @change="queryOwnedCouponsList"
            :remote-method="queryUserInfoFn"
            placeholder="请输入用户手机号码"
          >
            <el-option
              v-for="item in personalOptions"
              :key="item.uid"
              :label="item.nickName"
              :value="item.uid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="企业名称："
          prop="enterpriseId"
          v-if="giveCouponParams.grantGroupType == 1"
        >
          <el-select
            style="width: 60%"
            v-model="giveCouponParams.enterpriseId"
            filterable
            remote
            @change="queryOwnedCouponsList"
            :remote-method="queryEnterpriseName"
            placeholder="请输入企业名称"
          >
            <el-option
              v-for="item in enterpriseOptions"
              :key="item.id"
              :label="item.enterpriseName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="已有优惠券：">
          <el-table :data="ownedCouponsList" v-if="ownedCouponsList.length > 0">
            <el-table-column
              width="170"
              align="center"
              prop="createTime"
              label="发放时间"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              width="180"
              label="优惠券名称"
            >
            </el-table-column>
            <el-table-column label="发放类型" align="center" width="120">
              <template slot-scope="{ row }">
                {{ row.type == 0 ? "手动赠送" : "平台发放" }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="关联订单号">
              <template slot-scope="{ row }">
                {{ row.orderId || "无" }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
            </el-table-column>
          </el-table>
          <div v-if="ownedCouponsList.length == 0">未领取过优惠券</div>
        </el-form-item>
        <el-form-item label="赠送优惠券：" prop="couponId">
          <el-select
            style="width: 60%"
            v-model="giveCouponParams.couponId"
            placeholder="请选择优惠券"
          >
            <el-option
              v-for="item in allCouponList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号：">
          <el-input
            style="width: 60%"
            placeholder="请输入订单号"
            v-model="giveCouponParams.relationOrderSn"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            style="width: 60%"
            placeholder="请输入备注"
            v-model="giveCouponParams.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeGiveCouponDialog">取 消</el-button>
        <el-button type="primary" @click="giveCoupon">确 定</el-button>
      </span>
    </el-dialog>

    <div class="el_pagination" style="text-align: center">
      <el-pagination
        background
        layout="prev, pager, next,total"
        :current-page="queryCouponParams.pageNo"
        :total="couponListTotal"
        :page-sizes="[20, 30, 40, 50]"
        @current-change="currentChangeFn"
      />
    </div>
  </div>
</template>

<script>
import { queryEnterpriseName } from "@/api/boss";
import {
  queryCoupon,
  delCoupon,
  editCoupon,
  couponDetail,
  receiveRecords,
  giveCoupon,
} from "@/api/activity";
import { queryUserInfoFn } from "@/api/user";
export default {
  data() {
    return {
      isExpired: [
        { name: "未过期", val: 0 },
        { name: "已过期/结束", val: 1 },
      ],
      queryCouponParams: {
        isExpired: null,
        name: null,
        pageNo: 1,
        pageSize: 10,
      },
      couponListTotal: 0,
      defDdata: {
        name: null, //优惠券名称 ,
        minPoint: null, //使用门槛；0表示无门槛 ,
        offerAmount: null, //优惠金额 ,
        grantStandard: null, //发放门槛
        publishCount: null, //总发行量 ,
        note: null, //使用须知/备注 ,
        startDate: null, //有效期--开始 ,
        endDate: null, //有效期--结束 ,
        status: 1, //优惠券状态：0->未启用；1->已启用
        expiryTime: null,
      },
      dataList: [],
      dialogVisible: false,

      giveCouponParams: {
        grantGroupType: 0,
        couponId: null,
        enterpriseId: null,
        relationOrderSn: null,
        uid: null,
        remark: null,
      },
      giveCouponVisible: false,
      personalOptions: [],
      ownedCouponsList: [], //已领取的优惠券
      enterpriseOptions: [],
      allCouponList: [],
      giveCouponRules: {
        couponId: [
          { required: true, message: "请选择赠送优惠券", trigger: "change" },
        ],
        uid: [{ required: true, message: "请选择用户", trigger: "change" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
      },
    };
  },
  beforeMount() {
    this.queryCouponFn();
  },
  methods: {
    // 获取用户列表
    async queryUserInfoFn(e) {
      const res = await queryUserInfoFn({
        phone: e,
        pageNo: 1,
        pageSize: 100,
      });
      if (res.code == "000") {
        this.personalOptions = res.data.records;
      }
    },
    // 确定发放
    async giveCoupon() {
      await this.$refs["giveCouponRef"].validate();
      delete this.giveCouponParams["grantGroupType"];
      const res = await giveCoupon(this.giveCouponParams);
      if (res.code == "000") {
        this.$message({
          showClose: true,
          message: "发放成功！",
          type: "success",
        });
        this.closeGiveCouponDialog();
      }
    },
    // 确定查询已有优惠券
    async queryOwnedCouponsList(e) {
      let obj = {
        pageNo: 1,
        pageSize: 100,
        useStatus: 0,
      };
      if (typeof e === "number" && !isNaN(e)) {
        obj.enterpriseId = e;
      } else {
        obj.uid = e;
      }
      const res = await receiveRecords(obj);
      if (res.code == "000") {
        this.ownedCouponsList = res.data.records;
      }
    },
    // 关闭手动发券
    async closeGiveCouponDialog() {
      this.giveCouponParams = {
        grantGroupType: 0,
        couponId: null,
        enterpriseId: null,
        relationOrderSn: null,
        uid: null,
        remark: null,
      };
      this.personalOptions = [];
      this.enterpriseOptions = [];
      this.allCouponList = [];
      this.ownedCouponsList = [];
      await this.$refs["giveCouponRef"].resetFields();
      this.giveCouponVisible = false;
    },
    // 切换发券的用户类型
    changeGrantGroupType(e) {
      // 个人
      if (e == 0) {
        this.enterpriseOptions = [];
        this.giveCouponParams.enterpriseId = null;
        this.ownedCouponsList = [];
        if ("enterpriseId " in this.giveCouponRules) {
          delete this.giveCouponRules["enterpriseId "];
        }
        if (!("uid" in this.giveCouponRules)) {
          this.giveCouponRules.uid = [
            { required: true, message: "请选择用户名称", trigger: "change" },
          ];
        }
        this.$refs["giveCouponRef"].clearValidate("enterpriseId");
        return;
      }
      this.$refs["giveCouponRef"].clearValidate("uid");
      if ("uid" in this.giveCouponRules) {
        delete this.giveCouponRules["uid"];
      }
      if (!("enterpriseId" in this.giveCouponRules)) {
        this.giveCouponRules.enterpriseId = [
          { required: true, message: "请选择企业", trigger: "change" },
        ];
      }
      this.ownedCouponsList = [];
      this.enterpriseOptions = [];
      this.giveCouponParams.uid = null;
    },
    // 查询所有优惠券
    async queryAllCoupon() {
      const res = await queryCoupon({
        pageNo: 1,
        pageSize: 100,
      });
      if (res.code == "000") {
        this.allCouponList = res.data.records;
      }
    },
    // 模糊查询企业
    async queryEnterpriseName(query) {
      if (query !== "") {
        const res = await queryEnterpriseName(query);
        if (res.code == "000") {
          this.enterpriseOptions = res.data;
        }
      } else {
        this.enterpriseOptions = [];
      }
    },
    // 打开手动发券
    openGiveCouponDialog() {
      this.queryAllCoupon();
      this.giveCouponVisible = true;
    },
    // 跳转领取记录
    goToReceiveRecords(id) {
      this.$router.push({
        name: "ReceiveRecords",
        params: { id },
      });
      // window.open(routeData.href, "_blank");
    },
    uploadSuccess(e) {
      this.defDdata.imgUrl = e;
    },
    submitDataFn() {
      editCoupon(
        Object.assign({}, this.defDdata, {
          createTime: undefined,
          useCount: undefined,
          receiveCount: undefined,
        })
      ).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.queryCouponFn();
          this.closeDialogVisible();
        }
      });
    },
    statusChangeFn(val, index) {
      editCoupon(
        Object.assign({}, this.dataList[index], {
          id: this.dataList[index].id,
          status: val,
          useCount: undefined,
          receiveCount: undefined,
          createTime: undefined,
        })
      )
        .then((res) => {
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
          } else {
            this.queryCouponFn();
          }
        })
        .catch(() => {
          this.queryCouponFn();
        });
    },
    editItemFn(id) {
      couponDetail({ couponId: id }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData) {
          this.defDdata = resData;
          this.dialogVisible = true;
        }
      });
    },
    closeDialogVisible() {
      this.defDdata = {
        name: null, //优惠券名称 ,
        minPoint: null, //使用门槛；0表示无门槛 ,
        offerAmount: null, //优惠金额 ,
        grantStandard: null, //发放门槛
        publishCount: null, //总发行量 ,
        note: null, //使用须知/备注 ,
        startDate: null, //有效期--开始 ,
        endDate: null, //有效期--结束 ,
        status: 1, //优惠券状态：0->未启用；1->已启用
        expiryTime: null,
      };
      this.dialogVisible = false;
    },
    addItemFn() {
      this.dialogVisible = true;
    },
    deleteItemFn(scope) {
      this.deleteAlert()
        .then(() => {
          const res = delCoupon(scope.row.id);
          return res;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.dataList.splice(scope.$index, 1);
          }
        });
    },
    async queryCouponFn() {
      const res = await queryCoupon(this.queryCouponParams);
      if (res.code == "000") {
        this.couponListTotal = res.data.total;
        this.dataList.splice(0, this.dataList.length, ...res.data.records);
      }
    },
    currentChangeFn(pageNo) {
      this.queryCouponParams.pageNo = pageNo;
      this.queryCouponFn();
    },
  },
};
</script>

<style lang="scss" scoped>
.flexBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 10px;
}
</style>
