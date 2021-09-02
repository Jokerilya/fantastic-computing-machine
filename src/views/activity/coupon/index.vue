<template>
  <div class="content_box">
    <first-title title="优惠券" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.title"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入优惠券名称"
      />
      <el-select
        v-model="queryData.isExpired"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请选择优惠券状态"
      >
        <el-option
          v-for="item in isExpired"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10 mg_r15" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
      <el-button type="primary" @click="addItemFn"
        ><i class="el-icon-plus" />添加优惠券</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column
        fixed
        label="ID"
        width="60px"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
          <span
            v-if="!scope.row.id"
            class="delete_icon"
            @click="deleteAddFn(scope.$index)"
            ><i class="el-icon-delete"
          /></span>
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        align="center"
        header-align="center"
        width="160px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="140px">
        <template slot-scope="scope">
          <img style="width: 100px; height: 100px" :src="scope.row.imgUrl" />
        </template>
      </el-table-column>
      <el-table-column
        label="是否已过期"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.isExpired === 1 ? "已过期/结束" : "未过期"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="每人限领张数"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.limitPerPerson || "不限制" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="使用门槛"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.minPoint || "无门槛" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="优惠金额"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.offerAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="总发行量"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.publishCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="已使用数量"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.useCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="已领取数量"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.receiveCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="使用须知/备注"
        align="center"
        header-align="center"
        width="160px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="有效期开始"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="有效期截止"
        align="center"
        header-align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="有效时间说明"
        align="center"
        header-align="center"
        width="180px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.expiryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态(开启/关闭)"
        align="center"
        header-align="center"
        width="140px"
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
        width="200"
        align="center"
        header-align="center"
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
      width="70%"
    >
      <div>
        <el-form ref="form" :model="defDdata" label-width="140px">
          <el-form-item label="ID">
            <el-input v-model="defDdata.id" disabled="disabled" />
          </el-form-item>
          <el-form-item label="优惠券名称">
            <el-input v-model="defDdata.name" />
          </el-form-item>
          <el-form-item label="封面图">
            <upload-img
              width="100px"
              height="100px"
              margin="auto"
              :img="defDdata.imgUrl"
              @uploadSuc="uploadSuccess"
            />
          </el-form-item>
          <el-form-item label="是否已过期">
            <el-select v-model="defDdata.isExpired" placeholder="请选择">
              <el-option
                v-for="item in isExpired"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券金额">
            <el-input v-model="defDdata.offerAmount" />
          </el-form-item>
          <el-form-item label="每人限领张数">
            <el-input
              v-model="defDdata.limitPerPerson"
              placeholder="（0或为空，则不限制）"
            />
          </el-form-item>
          <el-form-item label="使用门槛">
            <el-input
              v-model="defDdata.minPoint"
              type="number"
              placeholder="（0表示无门槛）"
            />
          </el-form-item>
          <el-form-item label="总发行量">
            <el-input v-model="defDdata.publishCount" type="number" />
          </el-form-item>
          <el-form-item label="已使用数量" v-if="defDdata.id">
            <span>{{ defDdata.useCount }}</span>
          </el-form-item>
          <el-form-item label="已领取数量" v-if="defDdata.id">
            <span>{{ defDdata.receiveCount }}</span>
          </el-form-item>
          <el-form-item label="使用须知/备注">
            <el-input v-model="defDdata.note" type="textarea" />
          </el-form-item>
          <el-form-item label="有效期开始">
            <el-date-picker
              v-model="defDdata.startDate"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="有效期截止">
            <el-date-picker
              v-model="defDdata.endDate"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="有效时间说明">
            <el-input v-model="defDdata.expiryTime" />
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDataFn">确 定</el-button>
      </span>
    </el-dialog>
    <div class="el_pagination">
      <el-pagination
        background
        layout="prev, pager, next,total,sizes"
        :current-page="dataConfig.pageNo"
        :total="dataConfig.total"
        :page-sizes="[20, 30, 40, 50]"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import UploadImg from "@/components/uploadImg/upload-img.vue";
import {
  queryCoupon,
  delCoupon,
  editCoupon,
  couponDetail,
} from "@/api/activity";
export default {
  components: { UploadImg },
  data() {
    return {
      isExpired: [
        { name: "未过期", val: 0 },
        { name: "已过期/结束", val: 1 },
      ],
      queryData: {
        isExpired: "",
        name: "",
      },
      defDdata: {
        endDate: "", //有效期--结束 ,
        expiryTime: "", //有效时间说明 ,
        id: "", //,
        imgUrl: "", //封面图 ,
        isExpired: "", //是否已过期：0->未过期；1->已过期/结束 ,
        limitPerPerson: "", //每人限领张数（0或为空，则不限制） ,
        minPoint: "", //使用门槛；0表示无门槛 ,
        name: "", //优惠券名称 ,
        note: "", //使用须知/备注 ,
        offerAmount: "", //优惠金额 ,
        publishCount: "", //总发行量 ,
        startDate: "", //有效期--开始 ,
        status: 1, //优惠券状态：0->未启用；1->已启用
      },
      dataList: [],
      dialogVisible: false,
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
    };
  },
  beforeMount() {
    this.queryCouponFn();
  },
  methods: {
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryCouponFn();
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryCouponFn();
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
          this.dialogVisible = false;
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.queryCouponFn();
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
    addItemFn() {
      this.defDdata = {
        endDate: "", //有效期--结束 ,
        expiryTime: "", //有效时间说明 ,
        id: "", //,
        imgUrl: "", //封面图 ,
        isExpired: "", //是否已过期：0->未过期；1->已过期/结束 ,
        limitPerPerson: "", //每人限领张数（0或为空，则不限制） ,
        minPoint: "", //使用门槛；0表示无门槛 ,
        name: "", //优惠券名称 ,
        note: "", //使用须知/备注 ,
        offerAmount: "", //优惠金额 ,
        publishCount: "", //总发行量 ,
        startDate: "", //有效期--开始 ,
        status: 1, //优惠券状态：0->未启用；1->已启用
      };
      this.dialogVisible = true;
    },
    deleteItemFn(scope) {
      this.deleteAlert()
        .then(() => {
          const res = delCoupon({ id: scope.row.id });
          return res;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.dataList.splice(scope.$index, 1);
          }
        });
    },
    queryCouponFn() {
      queryCoupon({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataConfig.total = resData.total;
        this.dataList.splice(0, this.dataList.length, ...resData.records);
      });
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.queryCouponFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.queryCouponFn();
    },
  },
};
</script>
