<!-- 设备管理页面 -->
<template>
  <div class="equipmentManagement">
    <!-- 顶部工具栏部分 -->
    <div class="topTool">
      <div class="topTool_Status">
        <el-select v-model="equipmentStatusValue" placeholder="设备状态">
          <!-- 下拉菜单的内容 -->
          <el-option
            v-for="item in equipmentStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <!-- <div class="topTool_Status">
        <el-cascader
          clearable
          :options="equipmentTypeList"
          :show-all-levels="false"
          :props="{
            children: 'list',
            label: 'name',
            value: 'id',
            emitPath: false,
          }"
        ></el-cascader>
      </div> -->
      <div class="topTool_time">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="topTool_time"
          type="daterange"
          range-separator="———"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </div>
      <div class="topTool_name">
        <el-input v-model="topTool_code" placeholder="设备编码"></el-input>
      </div>
      <!-- <div class="topTool_name">
        <el-input placeholder="客户名称"></el-input>
      </div> -->
      <div class="topTool_btn">
        <!-- <el-button style="color:#2E4C9E" @click="addEquipmentPage" disabled
          >新增</el-button
        > -->
        <el-button style="color:#2E4C9E" @click="findFn">查询</el-button>
        <el-button style="color:#2E4C9E" @click="resetFn">重置</el-button>
      </div>
    </div>

    <!-- 表格内容部分 -->
    <div class="tableContent">
      <el-card>
        <div class="tableContent_title">设备数量: {{ total }}</div>
        <div class="tableContent_table">
          <el-table
            :cell-style="{ 'text-align': 'center' }"
            :data="equipmentList"
            style="width: 100%"
            :header-cell-style="{
              background: '#f6f8fc',
              color: '#707070',
              'text-align': 'center',
            }"
          >
            <el-table-column
              prop="enterpriseName"
              label="客户名称"
            ></el-table-column>
            <el-table-column label="类型">
              <template slot-scope="{ row }">
                {{ row.type === 1 ? "普通" : row.type === 2 ? "年保" : "年卡" }}
              </template>
            </el-table-column>
            <el-table-column prop="no" label="设备编号"></el-table-column>
            <!-- <el-table-column prop="nameplateImg" label="设备铭牌">
            </el-table-column> -->
            <el-table-column label="设备状态">
              <template slot-scope="{ row }">
                <div v-if="row.status === 0" style="color:#4093ff;">
                  进行中
                </div>
                <div v-if="row.status === 1" style="color:#04d372;">
                  报修中
                </div>
                <!-- 数据暂时没有提供 <div style="color:#ff4b4b;">已停保</div> -->
              </template>
            </el-table-column>
            <el-table-column prop="deviceTypeName" label="设备类型">
            </el-table-column>
            <el-table-column prop="enterpriseDeviceNo" label="企业设备编码">
            </el-table-column>
            <el-table-column
              prop="enterpriseDevicePosition"
              label="企业设备位置"
            >
            </el-table-column>
            <el-table-column prop="deviceBrand" label="设备品牌">
            </el-table-column>
            <el-table-column prop="deviceSystemName" label="设备系统">
            </el-table-column>
            <el-table-column prop="axesNumber" label="设备轴数">
            </el-table-column>
            <el-table-column prop="cycle" label="保养周期"> </el-table-column>
            <el-table-column prop="devicePlace" label="设备产地">
            </el-table-column>
            <el-table-column label="维保价格">
              <template slot-scope="{ row }"> {{ row.price }}.00 </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="140">
            </el-table-column>
            <el-table-column label="维保时间">
              <template slot-scope="{ row }">
                {{ row.startTime }}
                <div>—</div>
                {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <div style="color:#0b2059">
                  <a
                    style="margin-right: 10px;"
                    @click.prevent="goEquipmentDetails(row.id)"
                    >详情</a
                  >
                  <a @click.prevent="editEquipmentPage(row.id)">编辑</a>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tableContent_footer">
          <div class="footer_btn"></div>
          <div class="footer_pagination">
            <el-pagination
              @current-change="currentChangeFn"
              :current-page="data.pageNo"
              :page-size="5"
              layout="jumper, prev, pager, next,total "
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEquipmentList } from "@/api/equipmentManagement";
import { queryDeviceTypeList } from "@/api/order";
export default {
  data() {
    return {
      equipmentTypeList: "", //设备类型
      equipmentStatusValue: "", //设备状态值
      topTool_time: "", //日期选择值
      topTool_code: "", //设备编码值
      equipmentList: [], //设备列表
      total: 0,
      current: 1,
      data: {
        //获取列表需要的参数
        pageNo: 1,
        pageSize: 5,
      },
      equipmentStatus: [
        // 设备状态数组
        {
          value: "0",
          label: "进行中",
        },
        {
          value: "1",
          label: "报修中",
        },
      ],
    };
  },
  methods: {
    // 跳转新增
    addEquipmentPage() {
      this.$router.push(
        "/maintenance/equipmentManagement/addEquipment?titleName=新增设备信息"
      );
    },
    // 跳转编辑
    editEquipmentPage(id) {
      this.$router.push(
        "/maintenance/equipmentManagement/addEquipment?titleName=编辑设备信息&id=" +
          id
      );
    },
    // 跳转详情页
    goEquipmentDetails(id) {
      this.$router.push({
        name: "equipmentDetails",
        query: { id },
      });
    },
    // 重置所有搜索要求
    resetFn() {
      this.equipmentStatusValue = "";
      this.topTool_time = "";
      this.topTool_code = "";
      this.data = {
        pageNo: 1,
        pageSize: 5,
      };
      this.getEquipmentList(this.data);
    },
    // 点击查询的事件
    findFn() {
      this.data.status = this.equipmentStatusValue;
      if (this.topTool_time) {
        this.data.startTime = this.topTool_time[0];
        this.data.endTime = this.topTool_time[1];
      } else {
        delete this.data["startTime"];
        delete this.data["endTime"];
      }
      this.data.pageNo = 1;
      this.data.pageSize = 5;
      this.data.no = this.topTool_code;
      this.getEquipmentList(this.data);
    },
    // 页码发生变化触发的事件
    currentChangeFn(page) {
      this.current = page;
      this.data.pageNo = page;
      this.getEquipmentList(this.data);
    },
    // 获取设备列表
    async getEquipmentList(data) {
      const res = await getEquipmentList(data);
      const { records, total, current } = res.data;
      console.log(240, records);
      this.equipmentList = records;
      this.total = total;
      this.current = current;
    },
  },
  async created() {
    this.getEquipmentList(this.data);
    const res = await queryDeviceTypeList();
    this.equipmentTypeList = res.data;
  },
};
</script>

<style lang="less" scoped>
.equipmentManagement {
  padding: 20px 20px;
  // 顶部工具栏部分
  .topTool {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  // 表格内容部分
  .tableContent {
    .tableContent_title {
      color: #0b2059;
      font-weight: 700;
      font-size: 20px;
      padding-left: 30px;
    }
    .tableContent_table {
      margin: 30px 0;
    }
    .tableContent_footer {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: space-between;
      .footer_btn {
        .addBtn {
          width: 100px;
          background-color: #2e4c9e;
          color: #fff;
        }
      }
    }
  }
}
</style>
