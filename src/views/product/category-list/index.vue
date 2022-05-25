<template>
  <div class="content_box">
    <first-title title="商品分类管理" />
    <!-- <div class="select_view">
      <el-button type="primary" icon="el-icon-d-arrow-left" @click="backFcategoryFn">返回一级分类</el-button>
      <el-button type="primary" icon="el-icon-d-arrow-left" @click="backlastFcategoryFn">返回上一级分类</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addItemFn">添加分类</el-button>
      <span class="mg_l15" style="color: #f56c6c">注意：“修改”和“添加”数据项目后需要点击右侧“提交编辑”按钮才会生效哦</span>
    </div> -->
    <el-table class="list" :data="dataList" style="width: 100%" v-loading="dataConfig.loading"
      ref="dragTable" row-key="id" border lazy :load="load" :tree-props="{children: 'children', hasChildren: 'isSubset'}">
      <el-table-column label="ID" fixed width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id">{{ scope.row.id }}</span>
          <i v-if="!scope.row.id" class="el-icon-delete el_delete" @click="deleteAddItemFn(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column label="分类名称" header-align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="请输入内容" />
        </template>
      </el-table-column>
      <el-table-column label="图标(官网)" fixed width="100" align="center" header-align="center">
        <template slot-scope="scope">
          <upload-img :radius="true" :img="scope.row.icon" @uploadSuc="upIconSucFn($event, scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column label="图标(小程序)" fixed width="130" align="center" header-align="center">
        <template slot-scope="scope" class="flex just-center">
          <upload-img :radius="true" :img="scope.row.appletIcon"
            @uploadSuc="upapplemtIconSucFn($event, scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column label="排序" header-align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sort" type="number" placeholder="请输入内容" />
        </template>
      </el-table-column>
      <el-table-column label="描述" header-align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.description" placeholder="请输入内容" />
        </template>
      </el-table-column>
      <el-table-column label="是否显示" align="center" header-align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280" align="center" header-align="center">
        <template slot-scope="scope">
          <!-- <el-button v-if="scope.row.id" type="primary" size="small" @click="getChildrenFn(scope.row.id)">查看子分类</el-button> -->
          <el-button type="primary" size="small" @click="editItemFn(scope.row)">提交编辑</el-button>
          <el-button v-if="scope.row.id" type="danger" size="small" @click="deleteItemFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
  import {
    queryProductCategoryFn,
    editProductCategoryFn,
    delProductCategoryFn,
  } from "@/api/product";
  import Sortable from 'sortablejs'
  import uploadImg from "@/components/uploadImg/upload-img.vue";
  export default {
    name: "GoodsClass",
    components: {
      uploadImg,
    },
    data() {
      return {
        fatherCategoryArr: [],
        dataList: [],
        pid: 0,
        defDdata: {
          isShow: false,
          name: "",
          icon: "",
          appletIcon: '',
          sort: 0,
          pids: "",
          description: "",
          pidsArr: "",
        },
        dataConfig: {
          loading: true,
        },
        categoryList: {
          lazy: true,
          checkStrictly: true,
          lazyLoad(node, resolve) {
            queryProductCategoryFn({
              pid: node.value || 0
            }).then((res) => {
              const resData = res.data;
              const nodes = resData.map((item) => ({
                value: item.id.toString(),
                label: item.name,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          },
        },
      };
    },
    beforeMount() {
      this.queryProductCategoryFn();
    },
    computed: {},
    watch: {},
    methods: {
      deleteItemFn(row) {
        this.deleteAlert()
          .then(() => {
            const res = delProductCategoryFn({
              id: row.id
            });
            return res;
          })
          .then((res) => {
            const resData = this.resDataFn(res);
            if (resData === "000") {
              this.$message({
                showClose: true,
                message: "操作成功！",
                type: "success",
              });
              this.queryProductCategoryFn();
            }
          });
      },
      upIconSucFn(img, index) {
        this.$set(
          this.dataList,
          index,
          Object.assign({}, this.dataList[index], {
            icon: img
          })
        );
      },
      //小程序图标
      upapplemtIconSucFn(img, index) {
        this.$set(
          this.dataList,
          index,
          Object.assign({}, this.dataList[index], {
            appletIcon: img
          })
        );
      },
      addItemFn() {
        this.dataList.unshift(Object.assign({}, this.defDdata));
      },
      deleteAddItemFn(index) {
        this.dataList.splice(index, 1);
      },
      editItemFn(itemData) {
        console.info(itemData)
        this.dataConfig.loading = true;
        let pids = itemData.pids.split(",");
        if (itemData.id == pids[pids.length - 1]) {
          this.$message({
            showClose: true,
            message: `不能选择当前分类为父级！`,
            type: "warning",
          });
          this.dataConfig.loading = false;
          return;
        }
        editProductCategoryFn({
            id: itemData.id,
            isShow: itemData.isShow ? 1 : 0,
            name: itemData.name,
            icon: itemData.icon,
            appletIcon: itemData.appletIcon,
            sort: itemData.sort,
            pids: itemData.pids,
            description: itemData.description,
          })
          .then((res) => {
            this.dataConfig.loading = false;
            const resData = this.resDataFn(res);
            if (resData === "000") {
              this.$message({
                showClose: true,
                message: "操作成功！",
                type: "success",
              });
              this.queryProductCategoryFn();
            }
          })
          .catch(() => {
            this.dataConfig.loading = false;
          });
      },
      backlastFcategoryFn() {
        const arr = this.fatherCategoryArr;
        if (arr[0] === "0") return;
        if (arr.length === 1) {
          this.pid = 0;
        } else {
          this.pid = arr[arr.length - 2];
        }
        this.queryProductCategoryFn();
      },
      backFcategoryFn() {
        this.pid = 0;
        this.queryProductCategoryFn();
      },
      getChildrenFn(id) {
        this.pid = id;
        this.queryProductCategoryFn();
      },
      queryProductCategoryFn() {
        queryProductCategoryFn({
          pid: this.pid
        }).then((res) => {
          const resData = this.resDataFn(res)
          resData.map((item) => {
            item.isShow = item.isShow == 1;
          });
          this.dataList = resData
          this.dragInit()
        });
      },
      //获取父亲分类
      // async getrealfather(data) {
      //   const fatherarr = data;
      //   this.fatherCategoryArr = fatherarr;
      //   if (data[0] === "0") {
      //     this.dataList.forEach((item) => {
      //       item.aaa = "无";
      //     });
      //     return;
      //   }
      //   if (fatherarr.length === 1) {
      //     const res = await queryProductCategoryFn({
      //       pid: 0
      //     });
      //     const resData = this.resDataFn(res);
      //     resData.find((item) => {
      //       if (item.id === Number(fatherarr[0])) {
      //         this.dataList.forEach((ele) => {
      //           ele.aaa = item.name;
      //         });
      //         return;
      //       }
      //     });
      //   } else {
      //     let arr = [];
      //     let arr2 = [];
      //     let reg = /[0-9]+/g;
      //     const mapfatherarr = fatherarr.slice(0, -1);
      //     mapfatherarr.unshift(0);
      //     mapfatherarr.map((item, i) => {
      //       queryProductCategoryFn({
      //         pid: item
      //       }).then((res) => {
      //         const resData = this.resDataFn(res);
      //         resData.map((ele) => {
      //           if (ele.id === Number(fatherarr[i])) {
      //             arr.push(ele.name + i);
      //           }
      //         });
      //       });
      //     });
      //     setTimeout(() => {
      //       for (let i = 0; i < arr.length; i++) {
      //         arr.map((item) => {
      //           if (item.indexOf(i) > -1) {
      //             arr2.push(item.replace(reg, ""));
      //           }
      //         });
      //       }
      //     }, 300);
      //     this.$nextTick(() => {
      //       this.dataList.forEach((ele) => {
      //         ele.aaa = arr2;
      //       });
      //     });
      //   }
      // },
      load(tree, treeNode, resolve) {
        queryProductCategoryFn({
          pid: tree.id
        }).then((res) => {
          const resData = this.resDataFn(res)
          resData.map((item) => {
            item.isShow = item.isShow == 1;
          });
          resolve(resData)
          this.$forceUpdate()
        });
      },
      dragInit(){
        const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        console.info(el)
        this.sortable = Sortable.create(el, {
          sort: true,  
          delay: 0, 
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
          },
          // onEnd: evt => {
          //   const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          //   this.list.splice(evt.newIndex, 0, targetRow)

          //   // for show the changes, you can delete in you code
          //   const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          //   this.newList.splice(evt.newIndex, 0, tempIndex)
          // }

          
          // 元素被选中
          onChoose: function (/**Event*/evt) {
            console.info(evt)
            evt.oldIndex;  // element index within parent
          },
      
          // 元素未被选中的时候（从选中到未选中）
          onUnchoose: function(/**Event*/evt) {
            console.info(evt)
            // same properties as onEnd
          },
      
          // 开始拖拽的时候
          onStart: function (/**Event*/evt) {
            console.info(evt)
            evt.oldIndex;  // element index within parent
          },
      
          // 结束拖拽
          onEnd: function (/**Event*/evt) {
            console.info(evt)
            var itemEl = evt.item;  // dragged HTMLElement
            evt.to;    // target list
            evt.from;  // previous list
            evt.oldIndex;  // element's old index within old parent
            evt.newIndex;  // element's new index within new parent
            evt.clone // the clone element
            evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
          },
        })
      }
    },
  };
</script>

<style scoped>
  /deep/ .el-table .cell {
    display: flex;
    justify-content: center;
  }
</style>