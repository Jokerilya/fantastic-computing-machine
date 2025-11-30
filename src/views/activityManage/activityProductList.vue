<template>
  <div class="activityProductList">
    <first-title title="机将卡" />
    <div class="select_view flexBox">
      <div>
        <!-- <el-input
          style="width: 200px"
          class="mg_r15 mg_t10"
          placeholder="请输入机将卡名称"
        /> -->
      </div>
      <div>
        <!-- <el-button class="mg_t10" type="primary"
          ><i class="el-icon-search" />查询</el-button
        >
        <el-button class="mg_t10 mg_r15" type="danger"
          ><i class="el-icon-refresh" />重置</el-button
        > -->
        <el-button type="primary" @click="openAddEditActivityProductDialog"
          ><i class="el-icon-plus" />添加机将卡</el-button
        >
        <el-button type="primary" @click="openActivateCardDialog"
          >绑定外部套餐</el-button
        >
        <el-button type="warning" @click="goToBindActivateOrder"
          ><i class="el-icon-tickets" />查看绑定订单</el-button
        >
      </div>
    </div>
    <el-card>
      <el-table :data="activityProductList" style="width: 100%">
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="{ row }">
            {{
              row.type == 1 ? "保养卡" : row.type == 2 ? "维修月卡" : "维修次卡"
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题">
        </el-table-column>
        <el-table-column align="center" label="主图">
          <template slot-scope="{ row }">
            <el-image
              :src="row.coverImage"
              style="width: 120px; height: 90px"
              :preview-src-list="[row.coverImage]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="轮播图">
          <template slot-scope="{ row }">
            <el-image
              :src="row.images && row.images[0]"
              style="width: 120px; height: 90px"
              :preview-src-list="row.images"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="内容">
          <template slot-scope="{ row }">
            <el-image
              :src="row.content"
              fit="cover"
              :preview-src-list="[row.content]"
              style="width: 120px; height: 90px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格">
        </el-table-column>
        <el-table-column align="center" prop="simpleDesc" label="描述">
          <template slot-scope="{ row }">
            {{ row.simpleDesc ? row.simpleDesc : "/" }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" prop="sort" label="排序">
        </el-table-column>
        <el-table-column align="center" label="更多">
          <template slot-scope="{ row }">
            <el-button type="text" @click="unmountProductFn(row)">{{
              row.isShelves == 0 ? "上架" : "下架"
            }}</el-button>
            <el-button
              type="text"
              @click="openAddEditActivityProductDialog(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 激活机将卡 -->
    <el-dialog
      :close-on-click-modal="false"
      title="绑定外部套餐"
      :visible="activateCardVisible"
      :show-close="false"
      center
      width="70%"
    >
      <el-form label-width="100px" label-position="left">
        <el-form-item label="第三方订单号">
          <el-input
            placeholder="请输入第三方订单号"
            v-model="bindExternalComboParams.orderSn"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="激活机将卡">
          <div style="text-align: right">
            <el-button type="primary" @click="addActivateCard">新增</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-table
            :data="bindExternalComboParams.list"
            border
            style="width: 100%"
          >
            <el-table-column label="卡类型" width="180">
              <template slot-scope="{ row }">
                <el-select
                  v-model="row.type"
                  placeholder="请选择卡类型"
                  @change="changeCardType(row)"
                >
                  <el-option
                    v-for="item in cardList"
                    :key="item.type"
                    :label="item.text"
                    :value="item.type"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="卡名称" width="230">
              <template slot-scope="{ row }">
                <el-select
                  v-model="row.name"
                  placeholder="请选择卡类型"
                  @change="changeCradName(row)"
                >
                  <el-option
                    v-for="item in row.nameList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.title"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="145">
              <template slot-scope="{ row }">
                <el-input-number
                  style="width: 120px"
                  v-model="row.num"
                  :min="1"
                  :max="100"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="有效月数" width="145">
              <template slot-scope="{ row }">
                <div v-if="row.type == 2">
                  <el-input-number
                    style="width: 120px"
                    v-model="row.month"
                    :min="1"
                    :max="100"
                  ></el-input-number>
                </div>
                <div v-else>/</div>
              </template>
            </el-table-column>
            <el-table-column label="机台码">
              <template slot-scope="{ row }">
                <div v-if="row.type == 2">
                  <el-input
                    v-model="row.no"
                    placeholder="请填写机台码,多个请用&隔开"
                  ></el-input>
                </div>
                <div v-else>/</div>
              </template>
            </el-table-column>
            <el-table-column label="总价" width="180">
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.totalAmount"
                  type="number"
                  placeholder="请填写购买总价"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="{ $index }">
                <el-button type="danger" @click="delActivateCard($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeActivateCardDialog">取 消</el-button>
        <el-button type="primary" @click="bindExternalCombo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增编辑产品框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="activityProductDialogTitle"
      :visible="activityProductDialogVisible"
      :show-close="false"
      center
      width="50%"
    >
      <el-form
        label-width="100px"
        label-position="left"
        :model="queryActivityProductListParams"
        :rules="queryActivityProductListRules"
        ref="queryActivityProductListRef"
      >
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="queryActivityProductListParams.type">
            <el-radio
              :label="item.type"
              v-for="item in cardList"
              :key="item.type"
              >{{ item.text }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            placeholder="请输入标题"
            v-model="queryActivityProductListParams.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            type="number"
            placeholder="请输入价格"
            v-model="queryActivityProductListParams.price"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="simpleDesc">
          <el-input
            placeholder="请输入描述"
            v-model="queryActivityProductListParams.simpleDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <div style="color: #999; font-size: 18px">
            Tip:数字越低,排序越靠前
          </div>
          <el-input
            type="number"
            placeholder="请输入排序的顺序"
            v-model="queryActivityProductListParams.sort"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImage">
          <div style="color: #999; font-size: 18px">
            Tip:封面图的尺寸最佳比例:宽 1486像素 : 高 1486像素
          </div>
          <el-upload
            action="#"
            list-type="picture-card"
            :multiple="false"
            ref="uploadCoverImageRef"
            :file-list="coverImageFileList"
            :http-request="uploadCoverImageFileList"
            :on-remove="delCoverImage"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播图" prop="images">
          <div style="color: #999; font-size: 18px">
            Tip:轮播图的尺寸最佳比例:宽 1486 像素 : 高 1486 像素
          </div>
          <el-upload
            action="#"
            list-type="picture-card"
            :limit="5"
            multiple
            ref="uploadImageRef"
            :file-list="imagesFileList"
            :http-request="uploadImagesFileList"
            :on-remove="delImages"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容图" prop="content">
          <div style="color: #999; font-size: 26px">
            轮播图的尺寸最佳比例:宽750像素
          </div>
          <el-upload
            action="#"
            list-type="picture-card"
            ref="uploadContentRef"
            :multiple="false"
            :file-list="contentFileList"
            :http-request="uploadContentFileList"
            :on-remove="delContent"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeActivityProductDialog">取 消</el-button>
        <el-button type="primary" @click="confirmActivityProduct"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { UploadImg } from "@/api/system.js";
import {
  queryActivityProductList,
  editActivityProduct,
  shelvesActivityProduct,
  bindExternalCombo,
} from "@/api/activity";
export default {
  data() {
    return {
      activityProductList: [],
      activityProductDialogVisible: false,
      activityProductDialogTitle: "新增活动产品",
      queryActivityProductListParams: {
        type: null,
        title: null,
        price: null,
        images: null,
        coverImage: null,
        content: null,
        sort: null,
        simpleDesc: null,
      },

      coverImageFileList: [],
      contentFileList: [],
      imagesFileList: [],

      cardList: [
        {
          type: 1,
          text: "保养卡",
          list: [],
        },
        {
          type: 2,
          text: "维修月卡",
          list: [],
        },
        {
          type: 3,
          text: "维修次卡",
          list: [],
        },
      ],

      queryActivityProductListRules: {
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        coverImage: [
          { required: true, message: "请上传封面图", trigger: "change" },
        ],
        content: [
          { required: true, message: "请上传内容图", trigger: "change" },
        ],
        images: [
          { required: true, message: "请上传轮播图", trigger: "change" },
        ],
      },

      activateCardVisible: false,
      activateCardList: [],
      bindExternalComboParams: {
        orderSn: null, //订单号
        code: null, // 激活码
        totalAmount: null, //所有卡的总价
        // 机将卡列表
        list: [
          {
            type: null, //卡类型
            name: null, //卡名称
            num: 1, // 数量
            month: 1, // 月份(type==2 必填)
            no: null, // 机台码(type==2 必填)
            nameList: [],
            totalAmount: null, //单张卡的总价
            productId: null, //卡id
          },
        ],
      },
    };
  },
  methods: {
    // 切换卡名称 把卡id也传
    changeCradName(row) {
      const targetItem = row.nameList.find((item) => item.title === row.name);
      row.productId = targetItem.id;
    },
    // 跳转查看活动订单
    goToBindActivateOrder() {
      const routeData = this.$router.resolve({
        name: "bindActivateOrder",
      });
      window.open(routeData.href, "_blank");
    },
    // 对提交绑定套餐的参数校验
    validateBindExternalComboParams(params) {
      if (!params.orderSn) return "订单号不能为空";
      if (!Array.isArray(params.list) || params.list.length === 0)
        return "卡列表不能为空";
      for (let i = 0; i < params.list.length; i++) {
        const item = params.list[i];

        if (item.type == null) return "第" + (i + 1) + "项：卡类型不能为空";
        if (!item.name) return "第" + (i + 1) + "项：卡名称不能为空";
        if (item.num == null || item.num <= 0)
          return "第" + (i + 1) + "项：数量必须为正数";
        if (item.totalAmount == null || item.totalAmount < 0)
          return "第" + (i + 1) + "项：单张卡总价不能为负";

        if (item.type === 2) {
          if (!item.month || item.month <= 0)
            return "第" + (i + 1) + "项：月份不能为空且须为正数（仅限机台卡）";
          if (!item.no) {
            return "第" + (i + 1) + "项：机台码不能为空（仅限机台卡）";
          }
          let noArr = item.no.split("&");
          if (noArr.length != item.num) {
            return "第" + (i + 1) + "项：机台码台数和数量不一致";
          }
        }
      }
      return true;
    },
    // 确定绑定外部套餐
    async bindExternalCombo() {
      let validate = this.validateBindExternalComboParams(
        this.bindExternalComboParams
      );
      if (validate === true) {
        // 生成激活码 orderSn后6+时间戳后6
        const orderSnTail = (
          this.bindExternalComboParams.orderSn?.toString() || ""
        )
          .slice(-6)
          .padStart(6, "0");
        const timestampTail = String(Date.now()).slice(-6);
        this.bindExternalComboParams.code = orderSnTail + timestampTail;
        let code = orderSnTail + timestampTail;
        // 计算外层总价
        const sum = this.bindExternalComboParams.list.reduce((acc, item) => {
          return acc + (parseFloat(item.totalAmount) || 0);
        }, 0);
        const rounded = Math.round(sum * 100) / 100; // 先保留两位精度（避免浮点误差）
        if (Number.isInteger(rounded)) {
          this.bindExternalComboParams.totalAmount = Math.trunc(rounded); // 或直接：params.totalAmount = rounded;
        } else {
          this.bindExternalComboParams.totalAmount = Number(rounded.toFixed(2)); // 确保是 number 类型，非字符串
        }

        let list = [...this.bindExternalComboParams.list];
        list = list.map(({ nameList, ...rest }) => rest);
        console.log(477, list);
        let params = {
          orderSn: this.bindExternalComboParams.orderSn,
          code: this.bindExternalComboParams.code,
          totalAmount: this.bindExternalComboParams.totalAmount,
          comboContent: JSON.stringify(list),
        };
        const res = await bindExternalCombo(params);
        if (res.code == "000") {
          this.closeActivateCardDialog();
          this.$alert(
            `已为您生成激活码【${code}】,点击下方按钮复制即可`,
            "生成激活码",
            {
              confirmButtonText: "复制",
              callback: async (action) => {
                await navigator.clipboard.writeText(code);
                this.$message({
                  message: "复制成功",
                  type: "success",
                });
              },
            }
          );
        }
      } else {
        this.$message({
          message: validate,
          type: "warning",
        });
      }
    },
    // 删除机将卡
    delActivateCard(index) {
      this.bindExternalComboParams.list.splice(index, 1);
    },
    // 新增机将卡
    addActivateCard() {
      this.bindExternalComboParams.list.push({
        type: null,
        name: null,
        num: 1,
        month: 1,
        no: null,
        nameList: [],
        totalAmount: null,
        productId: null,
      });
    },
    // 切换每行的卡类型
    changeCardType(row) {
      row.nameList = this.cardList[row.type - 1].list;
      row.name = null;
      row.productId = null;
      row.num = null;
      row.month = null;
      row.no = null;
    },
    // 关闭绑定外部套餐弹框
    closeActivateCardDialog() {
      this.bindExternalComboParams = {
        orderSn: null,
        code: null,
        list: [
          {
            type: null,
            name: null,
            num: 1,
            month: 1,
            no: null,
            nameList: [],
            totalAmount: null,
            productId: null,
          },
        ],
      };
      this.activateCardVisible = false;
    },
    // 打开绑定外部套餐弹框
    openActivateCardDialog() {
      this.activateCardVisible = true;
    },
    // 上/下架商品
    async unmountProductFn(item) {
      const res = await this.$confirm(
        `您是否${item.isShelves == 0 ? "上架" : "下架"}该活动产品`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      if (res == "confirm") {
        let isShelves;
        item.isShelves == 0 ? (isShelves = 1) : (isShelves = 0);
        const result = await shelvesActivityProduct({
          id: item.id,
          isShelves,
        });
        if (result.message == "操作成功") {
          this.$message({
            message: result.message,
            type: "success",
          });
          this.queryActivityProductList();
        }
      }
    },
    // 确定新增编辑活动框
    async confirmActivityProduct() {
      await this.$refs["queryActivityProductListRef"].validate();
      const res = await editActivityProduct(
        this.queryActivityProductListParams
      );
      if (res.message == "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.queryActivityProductList();
        this.closeActivityProductDialog();
      }
    },
    // 关闭新增编辑活动框
    closeActivityProductDialog() {
      this.activityProductDialogVisible = false;
      this.queryActivityProductListParams = {
        type: null,
        title: null,
        price: null,
        images: null,
        coverImage: null,
        content: null,
        simpleDesc: null,
      };
      this.coverImageFileList = [];
      this.contentFileList = [];
      this.imagesFileList = [];
      this.$refs.uploadImageRef.$children[1].$el.style.display = "";
      this.$refs.uploadContentRef.$children[1].$el.style.display = "";
      this.$refs.uploadCoverImageRef.$children[1].$el.style.display = "";
      this.$refs["queryActivityProductListRef"].resetFields();
    },
    // 删除轮播图
    delImages(e) {
      const findIndex = this.imagesFileList.findIndex(
        (item) => item.url == e.url
      );
      this.imagesFileList.splice(findIndex, 1);
      const urlArr = [];
      this.imagesFileList.forEach((item) => {
        urlArr.push(item.url);
      });
      this.queryActivityProductListParams.images = urlArr.join(",");
      this.$refs.queryActivityProductListRef.validateField("images");
      this.$refs.uploadImageRef.$children[1].$el.style.display = "";
    },
    // 上传轮播图 多张
    async uploadImagesFileList(e) {
      const formData = new FormData();
      formData.append("file", e.file);
      const res = await UploadImg(formData);
      this.imagesFileList.push({ url: res.data });
      const urlArr = [];
      this.imagesFileList.forEach((item) => {
        urlArr.push(item.url);
      });
      this.queryActivityProductListParams.images = urlArr.join(",");
      this.$refs.queryActivityProductListRef.validateField("images");
      if (this.imagesFileList.length >= 5) {
        this.$refs.uploadImageRef.$children[1].$el.style.display = "none";
      }
    },
    // 删除内容图
    delContent() {
      this.contentFileList = [];
      this.queryActivityProductListParams.content = null;
      this.$refs.queryActivityProductListRef.validateField("content");
      this.$refs.uploadContentRef.$children[1].$el.style.display = "";
    },
    // 上传内容图 单张
    async uploadContentFileList(e) {
      const formData = new FormData();
      formData.append("file", e.file);
      const res = await UploadImg(formData);
      this.contentFileList = [{ url: res.data }];
      this.queryActivityProductListParams.content = res.data;
      this.$refs.queryActivityProductListRef.validateField("content");
      if (this.contentFileList.length == 1) {
        this.$refs.uploadContentRef.$children[1].$el.style.display = "none";
      }
    },
    // 删除封面图
    delCoverImage(e) {
      this.coverImageFileList = [];
      this.queryActivityProductListParams.coverImage = null;
      this.$refs.queryActivityProductListRef.validateField("coverImage");
      this.$refs.uploadCoverImageRef.$children[1].$el.style.display = "";
    },
    // 上传封面图 单张
    async uploadCoverImageFileList(e) {
      const formData = new FormData();
      formData.append("file", e.file);
      const res = await UploadImg(formData);
      this.coverImageFileList = [{ url: res.data }];
      this.queryActivityProductListParams.coverImage = res.data;
      this.$refs.queryActivityProductListRef.validateField("coverImage");
      if (this.coverImageFileList.length == 1) {
        this.$refs.uploadCoverImageRef.$children[1].$el.style.display = "none";
      }
    },
    // 打开新增编辑产品框
    openAddEditActivityProductDialog(item) {
      // 编辑回显
      if (item) {
        this.activityProductDialogTitle = "编辑活动产品";
        this.activityProductDialogVisible = true;
        this.queryActivityProductListParams = { ...item };
        // 回显封面图
        if (this.queryActivityProductListParams.coverImage) {
          this.coverImageFileList = [
            { url: this.queryActivityProductListParams.coverImage },
          ];
          setTimeout(() => {
            this.$refs.uploadCoverImageRef.$children[1].$el.style.display =
              "none";
          }, 300);
        }
        // 回显内容图
        if (this.queryActivityProductListParams.content) {
          this.contentFileList = [
            { url: this.queryActivityProductListParams.content },
          ];
          setTimeout(() => {
            this.$refs.uploadContentRef.$children[1].$el.style.display = "none";
          }, 300);
        }
        // 回显轮播图
        if (this.queryActivityProductListParams.images) {
          const imagesFileList = [];
          const urlArr = [];
          this.queryActivityProductListParams.images.forEach((item) => {
            imagesFileList.push({ url: item });
            urlArr.push(item);
          });
          this.queryActivityProductListParams.images = urlArr.join(",");
          this.imagesFileList = imagesFileList;
          if (this.imagesFileList.length >= 5) {
            setTimeout(() => {
              this.$refs.uploadContentRef.$children[1].$el.style.display =
                "none";
            }, 300);
          }
        }
      } else {
        this.activityProductDialogVisible = true;
        this.activityProductDialogTitle = "新增活动产品";
      }
    },
    // 查询产品列表
    async queryActivityProductList() {
      const res = await queryActivityProductList();
      res.data.forEach((item) => {
        if (item.images) {
          item.images = item.images.split(",");
        }
      });
      this.activityProductList = res.data;

      // 将优惠券 按type分类
      let filterByType = (arr, targetType) => {
        return arr.filter(
          (item) => item.type === targetType && item.isShelves === 1
        );
      };
      let type1Items = filterByType(this.activityProductList, 1);
      this.cardList[0].list = type1Items;
      let type2Items = filterByType(this.activityProductList, 2);
      this.cardList[1].list = type2Items;
      let type3Items = filterByType(this.activityProductList, 3);
      this.cardList[2].list = type3Items;
    },
  },
  created() {
    this.queryActivityProductList();
  },
};
</script>

<style scoped lang="scss">
.activityProductList {
  padding: 20px;
  .activityProductList_btnline {
    text-align: right;
    margin-bottom: 20px;
  }
}

.flexBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 10px;
  margin-bottom: 15px;
}
</style>
