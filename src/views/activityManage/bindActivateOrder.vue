<template>
  <div class="bindActivateOrder">
    <el-card>
      <el-table :data="externalComboList" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <!-- props.row -->
            <div style="padding: 20px">
              <el-table :data="props.row.comboContent" border>
                <el-table-column align="center" label="类型">
                  <template slot-scope="{ row }">
                    {{
                      row.type == 1
                        ? "保养卡"
                        : row.type == 2
                        ? "维修月卡"
                        : "维修次卡"
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="name"
                  label="机将卡名称"
                ></el-table-column>
                <el-table-column align="center" prop="num" label="数量">
                  <template slot-scope="{ row }">
                    {{ row.num ? row.num + "张" : "/" }}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="month" label="有效月份">
                  <template slot-scope="{ row }">
                    {{ row.month ? row.month + "月" : "/" }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="机台码">
                  <template slot-scope="{ row }">
                    <div v-if="row.no">
                      <el-tag
                        v-for="item in row.no"
                        style="margin-right: 5px"
                        :key="item"
                        >{{ item }}</el-tag
                      >
                    </div>
                    <div v-else>/</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="totalAmount" label="金额">
                  <template slot-scope="{ row }">
                    {{ row.totalAmount ? "￥" + row.totalAmount : "/" }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="orderSn" label="订单编号"></el-table-column>
        <el-table-column prop="totalAmount" label="金额">
          <template slot-scope="{ row }">
            {{ row.totalAmount ? "￥" + row.totalAmount : "/" }}
          </template>
        </el-table-column>
        <el-table-column prop="code" label="激活码"></el-table-column>
        <el-table-column prop="activateTime" label="激活时间">
          <template slot-scope="{ row }">
            {{ row.activateTime ? row.activateTime : "未激活" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="success" @click="copyActivateCode(row.code)">
              激活码
            </el-button>
            <el-button
              type="danger"
              v-if="!row.activateTime"
              @click="deleteExternalCombo(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { queryExternalComboList, deleteExternalCombo } from "@/api/activity";
export default {
  data() {
    return {
      externalComboList: [],
    };
  },
  methods: {
    // 删除套餐列表
    async deleteExternalCombo(id) {
      this.$confirm("您确定该绑定记录吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteExternalCombo(id);
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.queryExternalComboList();
        }
      });
      return;
    },
    // 复制激活码
    async copyActivateCode(code) {
      await navigator.clipboard.writeText(code);
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    // 查询外部套餐列表
    async queryExternalComboList() {
      const res = await queryExternalComboList();
      if (res.code == "000") {
        res.data.forEach((item) => {
          item.comboContent = JSON.parse(item.comboContent);
          item.comboContent.forEach((i) => {
            if (i.no) {
              i.no = i.no
                .split("&")
                .map((it) => it.trim())
                .filter((it) => it);
            }
          });
        });
        this.externalComboList = res.data;
      }
    },
  },
  async created() {
    await this.queryExternalComboList();
  },
};
</script>

<style scoped>
.bindActivateOrder {
  padding: 20px;
}
</style>
