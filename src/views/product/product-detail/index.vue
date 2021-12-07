<template>
  <div class="content_box">
    <first-title title="新增/编辑商品" />
    <div class="edit_view">
      <el-form ref="form" :model="addEditData" label-width="110px">
        <el-form-item class="float_item" label="是否多规格">
          <el-select
            :disabled="addEditData.id != ''"
            v-model="addEditData.isExistManySpec"
            style="width: 300px"
            placeholder="请选择是否多规格"
          >
            <el-option
              v-for="item in isExistManySpec"
              :key="item.val"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="float_item" label="商品型号">
          <el-input
            v-model="addEditData.mode"
            placeholder="请输入商品型号"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item class="float_item" style="height: auto" label="商品名称">
          <el-input
            v-model="addEditData.title"
            rows="3"
            type="textarea"
            style="width: 300px"
            resize="none"
          />
        </el-form-item>
        <el-form-item class="float_item" style="height: auto" label="商品简述">
          <el-input
            v-model="addEditData.simpleDesc"
            rows="3"
            type="textarea"
            style="width: 300px"
            resize="none"
          />
        </el-form-item>
        <div style="width: 100%; height: auto; overflow: hidden; float: left">
          <el-form-item
            class="float_item"
            style="height: auto"
            label="商品封面图"
          >
            <upload-img
              width="80px"
              height="80px"
              :img="addEditData.coverImage"
              @uploadSuc="uploadSucFn"
            />
          </el-form-item>
          <el-form-item
            class="float_item"
            style="height: auto"
            label="商品多图"
          >
            <upload-imgs
              :imgs="addEditData.images"
              @uploadSuc="uploadImgsSucFn"
              @deleteImg="deleteImgFn"
            />
          </el-form-item>
        </div>
        <div style="width: 100%; height: auto; overflow: hidden; float: left">
          <el-form-item
            class="float_item"
            style="height: auto"
            label="商品背景图"
          >
            <upload-img
              width="80px"
              height="80px"
              :img="addEditData.backImage"
              @uploadSuc="uploadSucFn2"
            />
            <span style="font-size: 12px; color: #999"
              >注：鼠标移入显示的图片</span
            >
          </el-form-item>
          <el-form-item class="float_item" label="商品类型">
            <el-select
              v-model="addEditData.type"
              style="width: 300px"
              placeholder="请选择商品类型"
              @change="productTypeChange"
            >
              <el-option
                v-for="item in types"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item class="float_item" label="商品分类">
          <el-cascader
            style="width: 300px"
            v-model="addEditData.categoryId"
            :class="{ el_cascader: addEditData.categoryId != '' }"
            :placeholder="
              addEditData.categoryId
                ? addEditData.categoryName
                : '请选择商品分类'
            "
            expand-trigger="hover"
            :props="categoryList"
            :show-all-levels="false"
            clearable
            :disabled="!addEditData.type"
          />
        </el-form-item>
        <!-- <el-form-item class="float_item" label="商品分类" v-if="addEditData.type === 3">
			<el-select v-model="addEditData.partsId" filterable placeholder="请选择配件分类" style="width: 300px;" :disabled="!addEditData.type">
				<el-option v-for="item in categoryPartsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
			<el-cascader style="width: 300px" v-model="addEditData.partsId" :class="{ el_cascader: addEditData.partsId != '' }" placeholder="请选择配件分类" expand-trigger="hover" :props="categoryList" :show-all-levels="false" clearable :disabled="!addEditData.type" />
        </el-form-item> -->

        <el-form-item class="float_item" label="上/下架">
          <el-select
            v-model="addEditData.isShelves"
            style="width: 300px"
            placeholder="请选择上/下架"
          >
            <el-option
              v-for="item in isShelves"
              :key="item.val"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="float_item" label="参考价(销售价)" v-if="addEditData.isExistManySpec == 0">
          <el-input
            v-model="addEditData.price"
            style="width: 300px"
            min="0"
            type="number"
          />
        </el-form-item>
        <el-form-item class="float_item" label="运费">
          <el-select
            v-model="addEditData.expId"
            style="width: 300px"
            clearable
            placeholder="请选择运费模板"
          >
            <el-option
              v-for="item in expList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="float_item" label="供应商">
          <el-select
            v-model="addEditData.supplierId"
            style="width: 300px"
            filterable
            clearable
            placeholder="请选择供应商"
          >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="float_item" label="库存" v-if="addEditData.isExistManySpec == 0">
          <el-input
            v-model="addEditData.lastInventory"
            style="width: 300px"
            min="0"
            type="number"
            placeholder="请输入库存"
          />
        </el-form-item>

        <el-form-item class="float_item" label="原价" v-if="addEditData.isExistManySpec == 0">
          <el-input
            v-model="addEditData.originalPrice"
            style="width: 300px"
            min="0"
            type="number"
            placeholder="请输入原价"
          />
        </el-form-item>

        <template v-if="addEditData.type === 2">
          <el-form-item
            class="float_item"
            style="height: auto"
            label="拼团库存"
          >
            <el-input-number
              v-model="addEditData.groupNum"
              style="width: 300px"
            />
          </el-form-item>

          <!-- <el-form-item class="float_item" style="height: auto" label="拼团时长(H)">
		  <el-input-number
		    v-model="addEditData.groupHours"
		    style="width: 300px"
		  />
		</el-form-item> -->

          <el-form-item
            class="float_item"
            style="height: auto"
            label="活动截止时间"
          >
            <el-date-picker
              v-model="addEditData.activityTime"
              class="mg_r15 mg_t10"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </template>

        <el-form-item
          v-if="addEditData.isExistManySpec == 1"
          style="clear: both"
          label="商品规格属性"
        >
          <el-table
            class="list_table"
            :data="addEditData.list"
            border
            style="width: 100%"
          >
            <el-table-column label="规格名称(例如:颜色)" width="150">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.name"
                  class="spec_name"
                  placeholder="填写规格名称"
                  @input="nameChange(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column label="规格值(例如:白色,红色)">
              <template slot-scope="scope">
                <div
                  v-for="(item, index) in scope.row.value"
                  :key="index"
                  class="value_item"
                >
                  <div class="item">
                    <el-input
                      v-model="scope.row.value[index]"
                      placeholder="规格值"
                      @input="valueChange(scope.$index, index)"
                    />
                    <el-button
                      v-if="
                        !addEditData.id ||
                        editAddValItem.indexOf(scope.$index + ',' + index) > -1
                      "
                      type="danger"
                      size="small"
                      icon="el-icon-delete"
                      @click="delListValuItemFn(scope.$index, index)"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="180"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="addListValFn(scope.$index)"
                  >添加规格值</el-button
                >
                <el-button
                  v-if="!addEditData.id"
                  size="small"
                  type="danger"
                  @click="delListFn(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button
            v-if="!addEditData.id"
            size="small"
            icon="el-icon-plus"
            style="margin-top: 15px"
            type="primary"
            @click="addListItemFn"
            >添加规格属性</el-button
          >
        </el-form-item>
        <el-form-item v-if="addEditData.isExistManySpec == 1" label="商品规格">
          <el-table
            class="list_table"
            :data="addEditData.specList"
            border
            style="width: 100%"
          >
            <el-table-column label="规格组合" width="440">
              <template slot-scope="scope">
                <template v-for="(item, index) in scope.row.skuIndex">
                  <el-select
                    v-if="addEditData.list[index]"
                    :key="index"
                    v-model="scope.row.skuIndex[index]"
                    style="width: 120px"
                    :placeholder="`请选择${addEditData.list[index].name}`"
                  >
                    <el-option
                      v-for="(item2, index2) in addEditData.list[index].value"
                      :key="index2"
                      :label="item2"
                      :value="index2 + ''"
                    />
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="规格图片"
              width="100px"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <upload-img
                  width="80px"
                  height="80px"
                  :img="scope.row.specImage"
                  @uploadSuc="upLoadSpceImgFn($event, scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="规格编码"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuCode" min="0" type="text" />
              </template>
            </el-table-column>

            <el-table-column
              v-if="addEditData.isExistManySpec == 1"
              label="参考价(销售价)"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" min="0" type="number" />
              </template>
            </el-table-column>

            <el-table-column label="原价" align="center" header-align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.originalPrice"
                  min="0"
                  type="number"
                />
              </template>
            </el-table-column>

            <el-table-column label="库存" align="center" header-align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.inventory" min="0" type="number" />
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" header-align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="delSpecFn(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button
            size="small"
            style="margin-top: 15px"
            type="primary"
            icon="el-icon-plus"
            @click="addSpecItemFn"
            >添加商品规格</el-button
          >
          <el-button
            v-if="!addEditData.id"
            size="small"
            style="margin-top: 15px"
            type="success"
            icon="el-icon-plus"
            @click="showBatchDataFn"
            >批量生成所有规格</el-button
          >
        </el-form-item>
        <el-form-item style="clear: both" label="商品详情">
          <tinymce
            ref="ppp"
            :id="'agreement_' + addEditData.id"
            v-model="addEditData.content"
            :height="600"
          />
        </el-form-item>
        <el-form-item label="">
          <el-link
            v-if="productId"
            style="margin-right: 10px"
            :href="`#/product/product-list?pageNo=${pageNo}&pageSize=${pageSize}`"
          >
            <el-button type="primary" plain icon="el-icon-d-arrow-left"
              >返回</el-button
            >
          </el-link>
          <el-button type="primary" :disabled="submitIng" @click="submitFn">{{
            submitIng ? "提交中..." : "确认提交"
          }}</el-button>
          <span v-show="submitIng" style="margin-left: 15px; color: #f56c6c"
            >提交中,请勿重复点击!</span
          >
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="设置批量生成参数"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <div>
        <el-form ref="form" :model="batchData" label-width="140px">
          <el-form-item label="批量规格图片">
            <upload-img
              width="80px"
              height="80px"
              :img="batchData.specImage"
              @uploadSuc="batchImgSucFn"
            />
          </el-form-item>
          <el-form-item label="批量参考价">
            <el-input v-model="batchData.price" min="0" type="number" />
          </el-form-item>
          <el-form-item label="批量规格库存">
            <el-input v-model="batchData.inventory" min="0" type="number" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchCreatFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploadImg from "@/components/uploadImg/upload-img.vue";
import uploadImgs from "@/components/uploadImgs/upload-imgs.vue";
import Tinymce from "@/components/Tinymce";
import {
  getProductDetailFn,
  queryProductCategoryFn,
  editProductFn,
  queryProductFittingCategoryFn,
  querySupplierList,
} from "@/api/product.js";
import { queryExpRuleFn } from "@/api/system.js";
export default {
  name: "ProductList",
  components: {
    Tinymce,
    uploadImg,
    uploadImgs,
  },
  data() {
    return {
      pageNo: 0,
      pageSize: 0,
      submitIng: false,
      productId: "",
      dialogVisible: false,
      editAddValItem: [],
      types: [
        { name: "优选商品", val: 1 },
        { name: "拼团产品", val: 2 },
        { name: "配件", val: 3 },
        { name: "机件", val: 4 },
      ],
      isShelves: [
        { name: "上架", val: 1 },
        { name: "下架", val: 0 },
      ],
      isExistManySpec: [
        { name: "是", val: 1 },
        { name: "否", val: 0 },
      ],
      addEditData: {
        expId: "",
        categoryId: "",
        content: "",
        coverImage: "",
        backImage: "",
        id: "",
        images: [],
        inventory: "",
        isExistManySpec: "",
        isShelves: "",
        mode: "",
        price: 0,
        simpleDesc: "",
        list: [],
        specList: [],
        title: "",
        type: "",
        // partsId:'',
        supplierId: "",
        // groupHours:1,
        groupNum: 1,
        activityTime: [],
        activityStartTime: "",
        activityEndTime: "",
        lastInventory:'',
        originalPrice:''
      },
      supplierList: [], // 供应商列表
      editLevelData: [],
      expList: [],
      batchData: {
        specImage: "",
        price: 0,
        originalPrice: 0,
        inventory: 0,
      },
      results: [],
      result: [],
      levelList: [],
      categoryList: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          queryProductCategoryFn({ pid: node.value || 0 }).then((res) => {
            const resData = res.data;
            const nodes = resData.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          });
        },
      },
      categoryPartsList: [],
    };
  },
  mounted() {
    this.productId = this.$route.query.id;
    this.pageNo = this.$route.query.pageNo;
    this.pageSize = this.$route.query.pageSize;
    this.getInit();
  },
  created() {
    this.queryProductFittingCategoryFn();
  },
  activated() {
    // 解决组件被keep-alive无法更新数据
    this.addProductFn();
    this.productId = this.$route.query.id;
    this.pageNo = this.$route.query.pageNo;
    this.pageSize = this.$route.query.pageSize;
    this.getInit();
  },
  watch: {
    productId(newval) {
      if (newval === undefined) {
        this.$refs.ppp.setContent("");
      }
    },
  },
  methods: {
    // 获取
    async getInit() {
      await queryExpRuleFn({
        pageNo: 1,
        pageSize: 20,
        name: "",
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.expList.splice(0, this.expList.length, ...resData.records);
      });
      this.getProductDetailFn();
      this.getQuerySupplierList();
    },
    // 获取供应商列表
    async getQuerySupplierList() {
      const res = await querySupplierList({
        pageNo: 1,
        pageSize: 1000,
      });
      if (res.code === "000") {
        this.supplierList = res.data.records;
      }
    },
    // 产品类型选择
    productTypeChange(e) {
      this.addEditData.categoryId = "";
    },
    // 获取装机配件商品分类
    async queryProductFittingCategoryFn() {
      const res = await queryProductFittingCategoryFn();
      if (res.code === "000") {
        this.categoryPartsList = res.data;
      }
    },
    //
    cascaderChangeFn(val) {
      // const endIndex = val.length - 1
      // this.addEditData.categoryId = val[endIndex]
    },
    nameChange(index) {
      this.addEditData.list[index].name = this.addEditData.list[
        index
      ].name.replace(/\s+/g, "");
    },
    valueChange(index, index2) {
      this.addEditData.list[index].value[index2] = this.addEditData.list[
        index
      ].value[index2].replace(/\s+/g, "");
    },
    levelValueChange(index, key) {
      this.editLevelData[index][key] = this.editLevelData[index][key].replace(
        /\s+/g,
        ""
      );
    },
    batchCreatFn() {
      const arr = [];
      this.result = [];
      this.results = [];
      this.addEditData.specList.splice(0, this.addEditData.specList.length);
      this.addEditData.list.forEach((item) => {
        const valArr = [];
        item.value.forEach((item, index) => {
          valArr.push(index + "");
        });
        arr.push(valArr);
      });
      this.doExchange(arr, 0);
      this.results.forEach((item) => {
        this.addEditData.specList.push({
          specImage: this.batchData.specImage,
          inventory: this.batchData.inventory,
          skuName: "",
          skuCode: "",
          price: this.batchData.price,
          originalPrice: this.batchData.originalPrice,
          skuIndex: item.split(","),
        });
      });
      this.dialogVisible = false;
    },
    doExchange(arr, index) {
      for (var i = 0; i < arr[index].length; i++) {
        this.result[index] = arr[index][i];
        if (index != arr.length - 1) {
          this.doExchange(arr, index + 1);
        } else {
          this.results.push(this.result.join(","));
        }
      }
    },
    showBatchDataFn() {
      if (this.addEditData.list.length == 0) {
        this.$message({
          showClose: true,
          message: `请添加规格属性！`,
          type: "warning",
        });
        return;
      }
      this.dialogVisible = true;
    },
    batchImgSucFn(img) {
      this.batchData.specImage = img;
    },
    addProductFn() {
      this.addEditData = {
        expId: "",
        categoryId: "",
        content: "",
        coverImage: "",
        backImage: "",
        id: "",
        images: [],
        inventory: "",
        isExistManySpec: "",
        isShelves: "",
        mode: "",
        originalPrice: "",
        price: "",
        lastInventory:"",
        simpleDesc: "",
        list: [],
        specList: [],
        title: "",
        // partsId:'',
        supplierId: "",
        // groupHours:1,
        groupNum: 1,
        activityTime: [],
        activityStartTime: "",
        activityEndTime: "",
      };
    },
    submitFn() {
      const postData = JSON.parse(JSON.stringify(this.addEditData));
      postData.originalPrice = Number(postData.originalPrice);
      postData.lastInventory = Number(postData.lastInventory)
      console.log(postData, "000");
      let listFlag = true;
      let specListFlag = true;

      // 规格数据验证
      if (this.addEditData.isExistManySpec == 1) {
        if (this.addEditData.list.length == 0) {
          listFlag = false;
          this.$message({
            showClose: true,
            message: `请添加规格属性！`,
            type: "warning",
          });
        }
        if (this.addEditData.specList.length == 0) {
          specListFlag = false;
          this.$message({
            showClose: true,
            message: `请添加商品规格！`,
            type: "warning",
          });
        }
        for (var i = 0, j = this.addEditData.list.length; i < j; i++) {
          if (this.addEditData.list[i].value.length == 0) {
            listFlag = false;
            this.$message({
              showClose: true,
              message: `请添加“${this.addEditData.list[i].name}”规格属性值或者删除该规格属性！`,
              type: "warning",
            });
            break;
          }
          this.addEditData.list[i].value.forEach((item, index) => {
            console.log(index);
            if (item == "") {
              listFlag = false;
              this.$message({
                showClose: true,
                message: `“${this.addEditData.list[i].name}”规格属性第${
                  index + 1
                }个值为空，请删除或输入值！`,
                type: "warning",
              });
            }
          });
        }
        for (var m = 0, n = this.addEditData.specList.length; m < n; m++) {
          if (this.addEditData.specList[m].skuIndex.indexOf("") > -1) {
            specListFlag = false;
            this.$message({
              showClose: true,
              message: `第${
                m - 0 + 1
              }个商品规格有规格属性未选择，请选择后再提交！`,
              type: "warning",
            });
            break;
          }
        }

        postData.specList.forEach((item) => {
          let name = "";
          item.skuIndex.forEach((item2, index) => {
            name += postData.list[index].value[Number(item2)] + ",";
          });
          item.skuName = name;
          item.skuName = item.skuName.replace(/\,$/, "");
          item.skuIndex = item.skuIndex.join(",");
        });
        postData.list.forEach((item) => {
          item.value = item.value.join(",");
        });
        postData.inventory = undefined;
      }
      if (!listFlag || !specListFlag) {
        return;
      }
      if (this.addEditData.isExistManySpec === 1) {
        postData.specInfoList = postData.list.slice();
        postData.skuInfoList = postData.specList.slice();
      } else {
        postData.specInfoList = [];
        postData.skuInfoList = [];
      }
      // postData.rewardInfoList = this.editLevelData;
      // postData.rewardInfoList.map((item) => {
      //   delete item.name;
      // });
      delete postData.list;
      delete postData.specList;
      delete postData.categoryName;
      delete postData.createTime;

      if (!postData.categoryId || postData.categoryId.length === 0) {
        this.$message({
          showClose: true,
          message: `请选择商品分类！`,
          type: "warning",
        });
        return;
      }
      /* if(this.addEditData.type !== 3){
		 if (!postData.categoryId || postData.categoryId.length === 0) {
			this.$message({
			  showClose: true,
			  message: `请选择商品分类！`,
			  type: "warning",
			});
			return;
		  }
	  }else{
		  if (!postData.partsId || postData.partsId.length === 0) {
				this.$message({
				  showClose: true,
				  message: `请选择商品分类！`,
				  type: "warning",
				});
				return;
		   }
	  } */

      if (!this.addEditData.supplierId) {
        this.$message({
          showClose: true,
          message: `请选择供应商！`,
          type: "warning",
        });
        return;
      }
      postData.categoryId = postData.categoryId.pop();
      postData.images = postData.images.join(",");
      postData.id = this.productId ? this.productId : undefined;
      postData.activityStartTime = postData.activityTime[0];
      postData.activityEndTime = postData.activityTime[1];
      console.log(postData);
      // return
      this.submitIng = true;
      editProductFn(postData)
        .then((res) => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.editAddValItem.splice(0, this.editAddValItem.length);
            if (this.productId) {
              this.getProductDetailFn();
            } else {
              this.$router.go(-1);
            }
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
        });
    },
    upLoadSpceImgFn(img, index) {
      this.addEditData.specList[index].specImage = img;
    },
    addSpecItemFn() {
      let specListMoreLength = 1;
      if (this.addEditData.list.length == 0) {
        this.$message({
          showClose: true,
          message: "请先添加规格属性和规格属性值！",
          type: "warning",
        });
        return;
      }
      this.addEditData.list.forEach((item) => {
        specListMoreLength = specListMoreLength * item.value.length;
      });
      if (this.addEditData.specList.length >= specListMoreLength) {
        this.$message({
          showClose: true,
          message: "您添加的商品规格已达到最大数量！",
          type: "warning",
        });
        return;
      }
      this.addEditData.specList.push({
        specImage: "",
        skuName: "",
        inventory: 0,
        skuCode: "",
        price: 0,
        originalPrice: 0,
        skuIndex: Array(this.addEditData.list.length).fill(""),
      });
    },
    addListItemFn() {
      this.addEditData.list.push({ name: "", value: [] });
      this.addEditData.specList.forEach((item) => {
        item.skuIndex.push("");
      });
    },
    delListValuItemFn(index, index2) {
      for (var i = this.addEditData.specList.length; i--; ) {
        // console.log('商品规格值：' + this.addEditData.specList[i].skuIndex[index], '规格：' + index, '规格值：' + index2)
        if (this.addEditData.specList[i].skuIndex[index] != "") {
          if (this.addEditData.specList[i].skuIndex[index] == index2) {
            this.addEditData.specList.splice(i, 1);
          }
          if (this.addEditData.specList[i]) {
            if (this.addEditData.specList[i].skuIndex[index] > index2) {
              this.addEditData.specList[i].skuIndex[index] -= 1;
              this.addEditData.specList[i].skuIndex[index] += "";
            }
          }
        }
      }
      this.addEditData.list[index].value.splice(index2, 1);
      const delIndex = this.editAddValItem.indexOf(index + "," + index2);
      // this.editAddValItem.splice(delIndex, 1)
    },
    addListValFn(index) {
      const delIndex = this.editAddValItem.indexOf(
        index + "," + this.addEditData.list[index].value.length
      );
      if (delIndex == -1) {
        this.editAddValItem.push(
          index + "," + this.addEditData.list[index].value.length
        );
      }
      this.addEditData.list[index].value.push("");
    },
    delListFn(index) {
      for (var i = this.addEditData.specList.length; i--; ) {
        this.addEditData.specList[i].skuIndex.splice(index, 1);
        if (this.addEditData.specList[i].skuIndex[index]) {
          this.addEditData.specList.splice(i, 1);
        }
      }
      this.addEditData.list.splice(index, 1);
    },
    delSpecFn(index) {
      this.addEditData.specList.splice(index, 1);
    },
    uploadSucFn(img) {
      this.addEditData.coverImage = img;
    },
    uploadSucFn2(img) {
      this.addEditData.backImage = img;
    },
    uploadImgsSucFn(img) {
      this.addEditData.images.push(img);
    },
    deleteImgFn(index) {
      this.addEditData.images.splice(index, 1);
      // console.log(this.addEditData.images,index)
    },
    getProductDetailFn() {
      if (!this.productId) return;
      this.addEditData.images.splice(0, this.addEditData.images.length);
      this.addEditData.list.splice(0, this.addEditData.list.length);
      this.addEditData.specList.splice(0, this.addEditData.specList.length);
      getProductDetailFn({ id: this.productId }).then((res) => {
        const resData = this.resDataFn(res);
        if (!resData.specInfoList) {
          resData.specInfoList = [];
        }
        if (!resData.skuInfoList) {
          resData.skuInfoList = [];
        }
        if (resData.isExistManySpec == 1 && resData.specInfoList.length > 0) {
          resData.specInfoList.forEach((item) => {
            item.value = item.value.split(",");
          });
        }
        if (resData.isExistManySpec == 1 && resData.skuInfoList.length > 0) {
          resData.skuInfoList.forEach((item) => {
            if (item.skuIndex) {
              item.skuIndex = item.skuIndex.split(",");
            } else {
              item.skuIndex = [];
              if (item.skuName) {
                item.skuName.split(",").forEach((item2, index2) => {
                  const posIndex =
                    resData.specInfoList[index2].value.indexOf(item2);
                  if (posIndex > -1) {
                    item.skuIndex.push(String(posIndex));
                  }
                });
              }
            }
          });
        }
        this.addEditData.activityTime =
          resData.activityStartTime && resData.activityEndTime
            ? [resData.activityStartTime, resData.activityEndTime]
            : [];
        this.addEditData = Object.assign({}, this.addEditData, resData, {
          // provincePrice:
          //   resData.type === 3 ? resData.productAgent.proPrice : undefined,
          // cityPrice:
          //   resData.type === 3 ? resData.productAgent.cityPrice : undefined,
          // areaPrice:
          //   resData.type === 3 ? resData.productAgent.areaPrice : undefined,
          // dealerPrice:
          //   resData.type === 3 ? resData.productAgent.dealerPrice : undefined,
          // provinceThigh:
          //   resData.type === 3 ? resData.productAgent.proThigh : undefined,
          // cityThigh:
          //   resData.type === 3 ? resData.productAgent.cityThigh : undefined,
          // areaThigh:
          //   resData.type === 3 ? resData.productAgent.areaThigh : undefined,
          // dealerThigh:
          //   resData.type === 3 ? resData.productAgent.dealerThigh : undefined,
          // provinceBeginNum:
          //   resData.type === 3 ? resData.productAgent.proNum : undefined,
          // cityBeginNum:
          //   resData.type === 3 ? resData.productAgent.cityNum : undefined,
          // areaBeginNum:
          //   resData.type === 3 ? resData.productAgent.areaNum : undefined,
          // dealerBeginNum:
          //   resData.type === 3 ? resData.productAgent.dealerNum : undefined,
          // productAgent: undefined,
          categoryId: resData.categoryIds,
          images: resData.images.split(","),
          list:
            resData.specInfoList && resData.specInfoList.length > 0
              ? resData.specInfoList
              : [],
          specList:
            resData.skuInfoList && resData.skuInfoList.length > 0
              ? resData.skuInfoList
              : [],
        });
        this.editLevelData = resData.rewardInfoList;
        this.levelList.map((item, index) => {
          if (this.editLevelData[index].levelId === item.id) {
            this.editLevelData[index].name = item.name;
          }
        });
        // 如果是装机商品 设定分类id 为装机分类的id
        // if(this.addEditData.type === 3){
        // 	this.addEditData.categoryId = this.addEditData.partsId
        // }
      });
    },
  },
};
</script>

<style lang="scss">
.edit_view {
  overflow: hidden;
  padding: 50px 20px;
  background: #ffffff;
  .el-form {
    overflow: hidden;
    padding: 10px;
    .el_cascader input {
      &::placeholder {
        color: #333;
      }
    }
    .spec_name {
      input {
        // background: #303133;
        // font-weight: bold;
        // border-color: #303133;
        // color: #ffffff;
      }
    }
  }
  .float_item {
    height: auto;
    width: 50%;
    float: left;
  }
  .list_table {
    .el-input__inner {
      height: 33px;
    }
    .el-input__icon {
      line-height: 33px;
    }
    .el-select {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
  .value_item {
    float: left;
    margin-right: 5px;
    .item {
      width: 150px;
      padding: 5px 0;
      overflow: hidden;
      .el-input {
        float: left;
        width: 100px;
      }
    }
  }
}
</style>
