<template>
  <div class="content_box">
    <first-title title="用户列表" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.nickName"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户昵称"
      />
      <el-input
        v-model="queryData.invitationCode"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入邀请码"
      />
      <el-input
        v-model="queryData.phone"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户手机号"
      />
      <el-select
        v-model="queryData.shopNum"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择直推店主数量"
        clearable
      >
        <el-option
          v-for="item in userShopNum"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      <el-select
        v-model="queryData.isPartner"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择合伙人状态"
        clearable
      >
        <el-option label="不是" :value="0" />
        <el-option label="是" :value="1" />
      </el-select>
      <el-select
        v-model="queryData.status"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择用户状态"
        clearable
      >
        <el-option
          v-for="item in userStatus"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      <el-select
        v-model="queryData.levelId"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择用户等级"
        clearable
      >
        <el-option
          v-for="item in levelList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <!-- <el-select
        v-model="queryData.isAgent"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择用户身份"
      >
        <el-option
          v-for="item in agentStatus"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select> -->
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="ID"
        align="center"
        header-align="center"
        width="120"
        fixed
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>
	  
      <el-table-column
        label="昵称"
        align="center"
        header-align="center"
        width="120"
        fixed
      >
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
	  
	  <el-table-column
	    label="邀请码"
	    align="center"
	    header-align="center"
	    width="120"
	    fixed
	  >
	    <template slot-scope="scope">
	      <span>{{ scope.row.invitationCode }}</span>
	    </template>
	  </el-table-column>
	  
     <!-- <el-table-column
        label="用户头像"
        align="center"
        header-align="center"
        width="120"
        fixed
      >
        <template slot-scope="scope">
          <el-image
            class="head_url"
            :src="scope.row.portrait"
            :preview-src-list="[scope.row.portrait]"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        label="手机号"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推荐人"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.parentName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否店主"
        align="center"
        header-align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tooltip
            :content="scope.row.isShop === 1 ? '是' : '否'"
            placement="top"
          >
            <el-switch
              v-model="scope.row.isShop"
              @change="handleAgentClick(scope.row, 'shop')"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        label="是否合伙人"
        align="center"
        header-align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tooltip
            :content="scope.row.isPartner === 1 ? '是' : '否'"
            placement="top"
          >
            <el-switch
              v-model="scope.row.isPartner"
              @change="editPartnerDataFn(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        label="会员等级"
        align="center"
        header-align="center"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.levelName }}</div>
          <el-button type="text" @click="handleAgentClick(scope.row, 'level')">
            修改
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="代理身份"
        width="110"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <div>
            {{
              scope.row.agentId === 1
                ? "省代理"
                : scope.row.agentId === 2
                ? "市代理"
                : scope.row.agentId === 3
                ? "区代理"
                : scope.row.agentId === 4
                ? "镇代"
                : "未成为代理"
            }}
          </div>
          <el-button type="text" @click="handleAgentClick(scope.row, 'agent')">
            修改
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="代理地址"
        align="center"
        header-align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.agentName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户余额"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.money }}</div>
          <el-button
            type="text"
            @click="
              $router.push({
                path: '/user/detailed-list',
                query: { id: scope.row.uid, type: 1 },
              })
            "
          >
            查看明细
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="代理余额"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.agentMoney }}</div>
          <el-button
            type="text"
            @click="
              $router.push({
                path: '/user/detailed-list',
                query: { id: scope.row.uid, type: 3 },
              })
            "
          >
            查看明细
          </el-button>
        </template>
      </el-table-column>
	  <el-table-column
	    label="股权"
	    width="100"
	    align="center"
	    header-align="center"
	  >
	    <template slot-scope="scope">
	      <div>{{ scope.row.thighMoney }}</div>
	      <el-button
	        type="text"
	        @click="
	          $router.push({
	            path: '/user/detailed-list',
	            query: { id: scope.row.uid, type: 4 },
	          })
	        "
	      >
	        查看明细
	      </el-button>
	    </template>
	  </el-table-column>
	  
	  <el-table-column
	    label="积分"
	    width="100"
	    align="center"
	    header-align="center"
	  >
	    <template slot-scope="scope">
	      <div>{{ scope.row.pointMoney }}</div>
	      <el-button
	        type="text"
	        @click="
	          $router.push({
	            path: '/user/detailed-list',
	            query: { id: scope.row.uid, type: 2 },
	          })
	        "
	      >
	        查看明细
	      </el-button>
	    </template>
	  </el-table-column>
      <el-table-column
        label="招商库存"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.attractStock }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="补货库存"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="推荐店主数量"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.shopNum }}</span>
        </template>
      </el-table-column>
	  <el-table-column
	    label="团队店主数量"
	    width="120"
	    align="center"
	    header-align="center"
	  >
	    <template slot-scope="scope">
	      <span>{{ scope.row.teamShopNum }}</span>
	    </template>
	  </el-table-column>

      <el-table-column
        label="注册时间"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" header-align="center">
        <template slot-scope="scope">
          <el-tooltip
            :content="scope.row.status === 1 ? '正常' : '禁用'"
            placement="top"
          >
            <el-switch
              v-model="scope.row.status"
              @change="editDataFn(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="300"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="
              $router.push({
                path: '/user/team-list',
                query: { id: scope.row.uid },
              })
            "
          >
            查看团队
          </el-button>
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleTopupClick(scope.row)"
          >
            账户变更
          </el-button>
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleParentClick(scope.row)"
          >
            修改推荐
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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

    <el-dialog
      title="余额变更"
      :visible.sync="dialogTopupVisible"
      width="800px"
    >
      <el-form ref="topupForm" label-width="130px" :model="topupForm">
        <el-form-item label="操作类型：" prop="type">
          <el-radio-group v-model="topupForm.type">
            <el-radio :label="1">增加</el-radio>
            <el-radio :label="0">扣除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="操作类型：" prop="amount">
          <el-radio-group v-model="topupForm.amount">
            <el-radio :label="1">代理余额</el-radio>
            <el-radio :label="2">招商库存</el-radio>
            <el-radio :label="3">余额</el-radio>
            <el-radio :label="4">股权</el-radio>
			<el-radio :label="5">积分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="变更数量：" v-if="topupForm.amount === 1">
          <el-input
            v-model="topupForm.agentAmount"
            placeholder="变更数量"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="变更数量：" v-if="topupForm.amount === 2">
          <el-input
            v-model="topupForm.attractStock"
            placeholder="变更数量"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="变更数量：" v-if="topupForm.amount === 3">
          <el-input
            v-model="topupForm.balanceAmount"
            placeholder="变更数量"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="变更数量：" v-if="topupForm.amount === 4">
          <el-input
            v-model="topupForm.thighAmount"
            placeholder="变更数量"
            style="width: 300px"
          ></el-input>
        </el-form-item>
		<el-form-item label="变更数量：" v-if="topupForm.amount === 5">
		  <el-input
		    v-model="topupForm.pointAmount"
		    placeholder="变更数量"
		    style="width: 300px"
		  ></el-input>
		</el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="topupForm.remark"
            type="textarea"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTopupVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleDialogClick"
          :loading="dialogLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="dialogAgentType === 'agent' ? '修改代理身份' : '修改会员等级'"
      :visible.sync="dialogAgentVisible"
      width="800px"
    >
      <el-form ref="topupForm" label-width="130px" :model="topupForm">
        <el-form-item label="代理身份：" v-if="dialogAgentType === 'agent'">
          <el-select
            v-model="agentForm.isAgent"
            style="width: 300px"
            placeholder="请选择代理身份"
            clearable
          >
            <el-option label="省代" :value="1" />
            <el-option label="市代" :value="2" />
            <el-option label="区代" :value="3" />
            <el-option label="镇代" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="省："
          v-if="dialogAgentType === 'agent' && agentForm.isAgent >= 1"
        >
          <el-select
            v-model="agentForm.proId"
            style="width: 300px"
            placeholder="请选择省"
            @change="proIdChangeFn"
            clearable
          >
            <el-option
              v-for="item in province"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="市："
          v-if="dialogAgentType === 'agent' && agentForm.isAgent >= 2"
        >
          <el-select
            v-model="agentForm.cityId"
            style="width: 300px"
            placeholder="请选择市"
            @change="cityIdChangeFn"
            clearable
          >
            <el-option
              v-for="item in allCitys"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="区："
          v-if="dialogAgentType === 'agent' && agentForm.isAgent >= 3"
        >
          <el-select
            v-model="agentForm.areaId"
            style="width: 300px"
            placeholder="请选择区"
            @change="areaIdChangeFn"
            clearable
          >
            <el-option
              v-for="item in allAreas"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="镇代："
          v-if="dialogAgentType === 'agent' && agentForm.isAgent >= 4"
        >
          <el-select
            v-model="agentForm.streetId"
            style="width: 300px"
            placeholder="请选择镇代"
            clearable
          >
            <el-option
              v-for="item in allStreets"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="等级：" v-if="dialogAgentType === 'level'">
          <el-select
            v-model="agentForm.levelId"
            class="mg_r15 mg_t10"
            style="width: 300px"
            placeholder="请选择用户等级"
            clearable
          >
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAgentVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAgentDialogClick"
          :loading="dialogLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="修改推荐人"
      :visible.sync="dialogParentVisible"
      width="800px"
    >
      <el-form ref="parentForm" label-width="130px" :model="parentForm">
        <el-form-item label="用户ID：">
          <el-input
            v-model="parentForm.parenUid"
            placeholder="用户ID"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogParentVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleParentDialogClick"
          :loading="dialogLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryUserInfoFn,
  editUserInfoStatusFn,
  handleUserInfoPartnerFn,
  handleAccountEditFn,
  handleEditParentFn,
  queryLevelInfoFn,
  handleUserInfoAgentFn,
} from "@/api/user.js";
import { addressFn } from "@/api/system.js";
export default {
  name: "UserList",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      queryData: {
        nickName: "",
        phone: "",
        status: "",
        invitationCode: "",
        shopNum: null,
        isPartner: "",
        levelId: "",
        // isAgent: "",
      },
      levelList: [],
      userStatus: [
        { val: 1, name: "正常" },
        { val: 0, name: "禁用" },
      ],
      userShopNum: [
        { val: 1, name: "20<=人数" },
        { val: 2, name: "15 <=人数<20" },
        { val: 3, name: "10 <=人数<15" },
        { val: 4, name: "人数<10" },
      ],
      dialogTopupVisible: false,
      dialogParentVisible: false,
      dialogAgentVisible: false,
      dialogAgentType: "agent",
      dialogLoading: false,
      topupForm: {
        uid: "", // 用户uid
        type: 1, // 操作类型 1赠送 0扣除
        amount: 1,
        balanceAmount: "",
        remark: "",
        attractStock: "",
        agentAmount: "",
        thighAmount: "",
		pointAmount:"",
      },
      parentForm: {
        uid: "", // 用户uid
        parenUid: "", // 推荐人用户id
      },
      agentForm: {
        areaId: null,
        isAgent: null, // 是否代理：1 省代 2市代 3区代
        isPartner: null,
        isShop: null,
        levelId: null,
        uid: "",
      },
      province: {},
      allCitys: {},
      allAreas: {},
      allStreets: {},
      // agentStatus: [
      //   { val: 1, name: "代理身份" },
      //   { val: 0, name: "普通会员" },
      // ],
    };
  },
  beforeMount() {
    this.getDataListFn();
    queryLevelInfoFn({
      pageNo: 1,
      pageSize: -1,
    }).then((res) => {
      const resData = this.resDataFn(res);
      this.levelList = resData.records;
    });
  },
  methods: {
    editPartnerDataFn(row) {
      handleUserInfoPartnerFn({
        id: row.uid,
      }).then((res) => {
        if (res.code == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
        }
        this.getDataListFn();
      });
    },
    editDataFn(row) {
      editUserInfoStatusFn({
        id: row.uid,
        status: row.status,
      }).then((res) => {
        if (res.code == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
        }
        this.getDataListFn();
      });
    },
    handleParentDialogClick() {
      this.dialogLoading = true;
      handleEditParentFn(this.parentForm)
        .then((res) => {
          this.dialogLoading = false;
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
          }
          this.dialogParentVisible = false;
          this.getDataListFn();
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    handleDialogClick() {
      this.dialogLoading = true;
      handleAccountEditFn({
        uid: this.topupForm.uid,
        type: this.topupForm.type,
        balanceAmount: this.topupForm.balanceAmount,
        remark: this.topupForm.remark,
        attractStock: this.topupForm.attractStock,
        agentAmount: this.topupForm.agentAmount,
        thighAmount: this.topupForm.thighAmount,
		pointAmount:this.topupForm.pointAmount,
      })
        .then((res) => {
          this.dialogLoading = false;
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.dialogTopupVisible = false;
            this.getDataListFn();
          }
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData = {
        nickName: "",
        phone: "",
        status: "",
        invitationCode: "",
        shopNum: null,
        isPartner: "",
        levelId: "",
        // isAgent: "",
      };
      this.getDataListFn();
    },
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.getDataListFn();
    },
    proIdChangeFn(val) {
      this.addressFn(val).then((res) => {
        this.allCitys = res;
      });
    },
    cityIdChangeFn(val) {
      this.addressFn(val).then((res) => {
        this.allAreas = res;
      });
    },
    areaIdChangeFn(val) {
      this.addressFn(val).then((res) => {
        this.allStreets = res;
      });
    },
    addressFn(pid) {
      return addressFn({ pid: pid }).then((res) => {
        const resData = this.resDataFn(res);
        return resData;
      });
    },
    // 修改代理身份
    handleAgentClick(item, type) {
      console.log(item);
      this.agentForm = {
        areaId: item.regionId,
        isAgent: item.agentId,
        isPartner: item.isPartner,
        isShop: item.isShop,
        levelId: item.levelId,
        uid: item.uid,
      };
      if (type === "shop") {
        handleUserInfoAgentFn(this.agentForm).then((res) => {
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
          }
          this.getDataListFn();
        });
      } else {
        if (type === "agent") {
          this.addressFn(0).then((res) => {
            this.province = res;
          });
        }
        this.dialogAgentType = type;
        this.dialogAgentVisible = true;
      }
    },
    handleAgentDialogClick() {
      this.dialogLoading = true;
      if (this.agentForm.isAgent === 4) {
        this.agentForm.areaId =
          this.agentForm.streetId || this.agentForm.areaId;
      } else if (this.agentForm.isAgent === 3) {
        this.agentForm.areaId = this.agentForm.areaId;
      } else if (this.agentForm.isAgent === 2) {
        this.agentForm.areaId = this.agentForm.cityId || this.agentForm.areaId;
      } else if (this.agentForm.isAgent === 1) {
        this.agentForm.areaId = this.agentForm.proId || this.agentForm.areaId;
      }
      handleUserInfoAgentFn({
        areaId: this.agentForm.areaId || null,
        isAgent: this.agentForm.isAgent || null,
        isPartner: this.agentForm.isPartner || null,
        isShop: this.agentForm.isShop || null,
        levelId: this.agentForm.levelId || null,
        uid: this.agentForm.uid,
      })
        .then((res) => {
          this.dialogLoading = false;
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.dialogAgentVisible = false;
            this.getDataListFn();
          }
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    // 充值
    handleTopupClick(item) {
      this.topupForm = {
        uid: item.uid, // 用户uid
        type: 1, // 操作类型 1赠送 0扣除
        amount: 1,
        balanceAmount: "",
        topupForm: "",
        attractStock: "",
        agentAmount: "",
        thighAmount: "",
		pointAmount:"",
      };
      this.dialogTopupVisible = true;
    },
    handleParentClick(item) {
      this.parentForm = {
        uid: "", // 用户uid
        parenUid: "", // 推荐人用户id
      };
      this.parentForm.uid = item.uid;
      this.dialogParentVisible = true;
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    getDataListFn() {
      this.dataConfig.loading = true;
      queryUserInfoFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        nickName: this.queryData.userName,
        phone: this.queryData.phone,
        invitationCode: this.queryData.invitationCode,
        shopNum: this.queryData.shopNum,
        isPartner: this.queryData.isPartner,
        levelId: this.queryData.levelId,
        // isAgent: this.queryData.isAgent,
        status: this.queryData.status,
      }).then((res) => {
        const resData = this.resDataFn(res);
        console.log(resData);
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
      });
    },
  },
};
</script>

<style lang="scss">
.head_url {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  overflow: hidden;
  display: inline-block;
}
.cell {
  .el-row {
    margin-bottom: 10px;
  }
}
</style>
