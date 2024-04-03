<template>
  <div class="faultItemsExamine">
    <first-title title="故障项目管理" />
    <div class="faultItemsExamine_top">
      <div class="faultItemsExamine_top_left">
        <div class="faultItemsExamine_top_item">
          <!-- <div class="label">故障部位:</div>
          <div>
            <el-select placeholder="请选择">
              <el-option
                v-for="item in positionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div> -->
        </div>
      </div>

      <div class="faultItemsExamine_top_right">
        <el-input
          v-model="queryFaultItemsParams.query"
          placeholder="请输入您要找的故障项目"
          style="margin-right: 10px"
        ></el-input>
        <el-button type="primary" @click="searchFaultList">搜索</el-button>
        <el-button type="success" @click="openExamineFaultItemsDialog"
          >新增</el-button
        >
      </div>
    </div>
    <div class="faultItemsExamine_table">
      <el-card>
        <el-table border style="width: 100%" :data="queryFaultItemsList">
          <el-table-column
            label="故障编码"
            prop="code"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column label="机床类型" align="center">
            <template slot-scope="{ row }">
              {{
                row.machineType == 1
                  ? "加工中心"
                  : row.machineType == 2
                  ? "数控车床"
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="故障部位" prop="position" align="center">
          </el-table-column>
          <el-table-column label="故障项目" prop="simpleDesc" align="center">
          </el-table-column>

          <el-table-column
            label="师傅价格"
            prop="masterAmount"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="年保企业价格"
            prop="annualAmount"
            align="center"
            width="110"
          >
          </el-table-column>
          <el-table-column
            label="散单企业价格"
            prop="generalAmount"
            align="center"
            width="110"
          >
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" @click="openExamineFaultItemsDialog(row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="faultItemsExamine_table_pagination">
          <el-pagination
            background
            :total="total"
            layout="prev, pager, next"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>

    <el-dialog
      :title="examineFaultItemsDialogTitle"
      :visible="examineFaultItemsDialog"
      width="35%"
      center
      :before-close="closeExamineFaultItemsDialog"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          ref="examineFaultItemsRef"
          :rules="examineFaultItemsRules"
          :model="examineFaultItemsParams"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="机床类型:" prop="machineType">
            <el-select
              placeholder="请选择"
              v-model="examineFaultItemsParams.machineType"
            >
              <el-option
                v-for="item in machineTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障部位:" prop="position">
            <!-- <el-select
              placeholder="请选择"
              v-model="examineFaultItemsParams.position"
            >
              <el-option
                v-for="item in positionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
            <el-input
              placeholder="请填写故障部位"
              v-model="examineFaultItemsParams.position"
            ></el-input>
          </el-form-item>

          <el-form-item label="故障项目:" prop="simpleDesc">
            <el-input
              v-model="examineFaultItemsParams.simpleDesc"
              placeholder="请输入故障项目"
            ></el-input>
          </el-form-item>
          <el-form-item label="故障编码:" prop="code">
            <el-input
              v-model="examineFaultItemsParams.code"
              placeholder="请输入故障编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="师傅价格:" prop="masterAmount">
            <el-input
              v-model.number="examineFaultItemsParams.masterAmount"
              type="number"
              placeholder="请输入师傅价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="年保企业价格:" prop="annualAmount">
            <el-input
              v-model.number="examineFaultItemsParams.annualAmount"
              type="number"
              placeholder="请输入年保企业价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="散单企业价格:" prop="generalAmount">
            <el-input
              v-model.number="examineFaultItemsParams.generalAmount"
              type="number"
              placeholder="请输入散单企业价格"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeExamineFaultItemsDialog">取 消</el-button>
        <el-button type="primary" @click="examineFaultItemsConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryFaultItems,
  queryDevicePositionList,
  saveFaultItems,
} from "@/api/order.js";
export default {
  data() {
    return {
      machineTypeList: [
        {
          value: 1,
          label: "加工中心",
        },
        {
          value: 2,
          label: "数控车床",
        },
      ],
      positionList: [],
      queryFaultItemsParams: {
        pageNo: 1,
        pageSize: 10,
        query: null,
      },
      queryFaultItemsList: [],
      total: 10,
      examineFaultItemsDialog: false,
      examineFaultItemsDialogTitle: "新增故障项目",
      examineFaultItemsParams: {
        position: null,
        simpleDesc: null,
        masterAmount: null,
        annualAmount: null,
        generalAmount: null,
        machineType: null,
        code: null,
      },
      examineFaultItemsRules: {
        annualAmount: [
          {
            required: true,
            message: "请输入年保企业展示价格",
            trigger: "change",
          },
        ],
        generalAmount: [
          {
            required: true,
            message: "请输入散单企业展示价格",
            trigger: "change",
          },
        ],
        machineType: [
          { required: true, message: "请选择机床类型", trigger: "change" },
        ],
        masterAmount: [
          { required: true, message: "请输入师傅展示价格", trigger: "change" },
        ],
        position: [
          { required: true, message: "请选择故障部位", trigger: "change" },
        ],
        simpleDesc: [
          { required: true, message: "请输入故障项目", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入故障编码", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 通过故障描述查询故障项目列表
    async searchFaultList() {
      this.queryFaultItemsParams.pageNo = 1;
      await this.queryFaultItems();
    },
    // 新增/修改 故障项目
    async examineFaultItemsConfirm() {
      await this.$refs["examineFaultItemsRef"].validate();
      const res = await saveFaultItems(this.examineFaultItemsParams);
      if (res.message == "操作成功") {
        this.closeExamineFaultItemsDialog();
        this.queryFaultItems();
      }
    },
    // 关闭故障项目dialog
    closeExamineFaultItemsDialog() {
      this.examineFaultItemsDialog = false;
      this.examineFaultItemsParams = {
        position: null,
        simpleDesc: null,
        masterAmount: null,
        annualAmount: null,
        generalAmount: null,
        machineType: null,
      };
      this.$refs["examineFaultItemsRef"].resetFields();
    },
    // 打开故障项目dialog
    openExamineFaultItemsDialog(row) {
      if (row.id) {
        this.examineFaultItemsParams = { ...row };
        this.examineFaultItemsDialogTitle = "修改故障项目";
      } else {
        this.examineFaultItemsDialogTitle = "新增故障项目";
      }
      this.examineFaultItemsDialog = true;
    },
    // 修改页数
    changePage(page) {
      this.queryFaultItemsParams.pageNo = page;
      this.queryFaultItems();
    },
    // 获取故障部位
    async queryDevicePositionList() {
      const res = await queryDevicePositionList();
      let arr = [];
      res.data.forEach((item) => {
        arr.push({
          value: item.name,
          label: item.name,
        });
      });
      this.positionList = arr;
    },
    // 获取故障项目
    async queryFaultItems() {
      const res = await queryFaultItems(this.queryFaultItemsParams);
      this.queryFaultItemsList = res.data.records;
      this.total = res.data.total;
      console.log(326, this.queryFaultItemsList);
    },
  },
  created() {
    this.queryDevicePositionList();
    this.queryFaultItems();
  },
};
</script>

<style scoped lang="less">
.faultItemsExamine {
  padding: 20px;
  .faultItemsExamine_top {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 20px;

    .faultItemsExamine_top_left {
      display: flex;
      align-items: center;
      .faultItemsExamine_top_item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .label {
          color: #606266;
          font-size: 14px;
          font-weight: 700;
          margin-right: 20px;
        }
      }
    }
    .faultItemsExamine_top_right {
      display: flex;
      align-items: center;
    }
  }

  .faultItemsExamine_table {
    .faultItemsExamine_table_pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
