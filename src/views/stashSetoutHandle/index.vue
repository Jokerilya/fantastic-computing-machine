<template>
  <div class="stashSetoutHandle">
    <el-card style="padding: 20px">
      <el-table :data="stashSetoutHandleData" style="width: 100%">
        <el-table-column align="center" prop="order" label="订单编号">
        </el-table-column>
        <el-table-column align="center" prop="number" label="编码">
          <template slot-scope="{ row }">
            {{ row.number ? row.number : "/" }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="配件名称">
        </el-table-column>
        <el-table-column align="center" prop="brand" label="配件品牌">
        </el-table-column>
        <el-table-column align="center" prop="parameter" label="配件参数">
        </el-table-column>
        <el-table-column label="配件图片" align="center">
          <template slot-scope="{ row }">
            <el-image
              :src="
                row.image
                  ? row.image[0]
                  : 'https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20240723/LX44363296.png'
              "
              :preview-src-list="row.image"
              style="width: 80px; height: 80px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="openAuditPartsDialog(row)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="审核配件"
      :visible="auditPartsVisible"
      width="30%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="auditPartsParams"
        :rules="auditPartsRules"
        ref="auditPartsRef"
      >
        <el-form-item label="配件名称" prop="name">
          <el-input
            placeholder="请输入配件名称"
            v-model="auditPartsParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件品牌" prop="brand">
          <el-input
            placeholder="请输入配件品牌"
            v-model="auditPartsParams.brand"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件参数" prop="parameter">
          <el-input
            placeholder="请输入配件参数"
            v-model="auditPartsParams.parameter"
          ></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="number">
          <el-input
            placeholder="请输入编码"
            v-model="auditPartsParams.number"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="color: red">请确保信息正确性,确定后会同步到金蝶</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAuditPartsDialog">取 消</el-button>
        <el-button type="primary" @click="confirmAuditParts">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryOrderPartsWaitExamineList,
  examineOrderParts,
} from "@/api/handleMatter";
export default {
  data() {
    return {
      stashSetoutHandleData: [],
      auditPartsVisible: false,
      auditPartsParams: {
        brand: null,
        brandId: null,
        id: null,
        name: null,
        num: null,
        number: null,
        order: null,
        parameter: null,
        partId: null,
        price: null,
      },
      auditPartsRules: {
        name: [{ required: true, message: "请输入配件名称", trigger: "blur" }],
        brand: [{ required: true, message: "请输入配件品牌", trigger: "blur" }],
        parameter: [
          { required: true, message: "请输入配件参数", trigger: "blur" },
        ],
        number: [{ required: true, message: "请输入编号", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 确定审核
    async confirmAuditParts() {
      await this.$refs["auditPartsRef"].validate();
      if (this.auditPartsParams.image) {
        this.auditPartsParams.image = this.auditPartsParams.image.toString();
      }
      const res = await examineOrderParts(this.auditPartsParams);
      if (res.message == "操作成功") {
        this.$message({
          message: "审核成功",
          type: "success",
        });
        this.closeAuditPartsDialog();
        this.queryOrderPartsWaitExamineList();
      }
    },
    // 关闭审核框
    closeAuditPartsDialog() {
      this.auditPartsParams = {
        brand: null,
        brandId: null,
        id: null,
        name: null,
        num: null,
        number: null,
        order: null,
        parameter: null,
        partId: null,
        price: null,
      };
      this.$refs["auditPartsRef"].resetFields();
      this.auditPartsVisible = false;
    },
    // 打开审核框
    openAuditPartsDialog(row) {
      this.auditPartsParams = { ...row };
      this.auditPartsVisible = true;
    },
    // 查询订单配件待审核列表
    async queryOrderPartsWaitExamineList() {
      const res = await queryOrderPartsWaitExamineList();
      res.data.forEach((item) => {
        if (item.image) {
          const arr = item.image.split(",");
          item.image = arr;
        }
      });
      this.stashSetoutHandleData = res.data;
    },
  },
  created() {
    this.queryOrderPartsWaitExamineList();
  },
};
</script>

<style scoped>
.stashSetoutHandle {
  padding: 20px;
}
</style>
