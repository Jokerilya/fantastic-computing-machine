<template>
  <div class="content_box">
    <first-title title="商品分类管理" />
    <div class="select_view">
      <el-button type="primary" icon="el-icon-d-arrow-left" @click="backFcategoryFn">返回一级分类</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addItemFn">添加分类</el-button>
      <span class="mg_l15" style="color: #F56C6C;">注意：“修改”和“添加”数据项目后需要点击右侧“提交编辑”按钮才会生效哦</span>
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column label="ID" fixed width="60" align="center" header-align="center">
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
      <el-table-column label="图标" fixed width="90" align="center" header-align="center">
        <template slot-scope="scope">
          <upload-img :radius="true" :img="scope.row.icon" @uploadSuc="upIconSucFn($event,scope.$index)" />
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
      <el-table-column label="父级分类" align="center" header-align="center">
        <template slot-scope="scope">
          <!-- <el-input v-model="scope.row.pids" type="number" placeholder="请输入内容" /> -->
          <el-cascader
						v-model="scope.row.pidsArr"
						:placeholder="scope.row.pids || '请选择商品分类'"
						expand-trigger="hover"
						:props="categoryList"
            clearable
					/>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" align="center" header-align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.id" type="primary" size="small" @click="getChildrenFn(scope.row.id)">查看子分类</el-button>
          <el-button type="primary" size="small" @click="editItemFn(scope.row)">提交编辑</el-button>
          <el-button v-if="scope.row.id" type="danger" size="small" @click="deleteItemFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryProductCategoryFn, editProductCategoryFn, delProductCategoryFn } from '@/api/product'
import uploadImg from '@/components/uploadImg/upload-img.vue'
export default {
  name: 'GoodsClass',
  components: {
    uploadImg
  },
  data() {
    return {
      dataList: [],
      pid: 0,
      defDdata: {
        'isShow': false,
        'name': '',
        'icon': '',
        'sort': 0,
        'pids': '',
        'description': '',
        pidsArr: ''
      },
      dataConfig: {
        'loading': true
      },
			categoryList: {
				lazy: true,
				checkStrictly: true,
				lazyLoad(node, resolve) {
					queryProductCategoryFn({ pid: node.value || 0 }).then(res => {
						const resData = res.data;
						const nodes = resData.map(item => ({
							value: item.id.toString(),
							label: item.name,
						}));
						// 通过调用resolve将子节点数据返回，通知组件数据加载完成
						resolve(nodes);
					});
				},
			},
    }
  },
  beforeMount() {
    this.queryProductCategoryFn()
  },
  methods: {
    deleteItemFn(row) {
      this.deleteAlert().then(() => {
        const res = delProductCategoryFn({ id: row.id })
        return res
      }).then((res) => {
        const resData = this.resDataFn(res)
        if (resData === '000') {
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          })
          this.queryProductCategoryFn()
        }
      })
    },
    upIconSucFn(img, index) {
      this.$set(this.dataList, index, Object.assign({}, this.dataList[index], { icon: img }))
    },
    addItemFn() {
      this.dataList.unshift(Object.assign({}, this.defDdata))
    },
    deleteAddItemFn(index) {
      this.dataList.splice(index, 1)
    },
    editItemFn(itemData) {
      this.dataConfig.loading = true
      itemData.pids = itemData.pidsArr.toString()
      let pids = itemData.pids.split(',')
      if(itemData.id == pids[pids.length - 1]) {
        this.$message({
					showClose: true,
					message: `不能选择当前分类为父级！`,
					type: 'warning',
				});
        this.dataConfig.loading = false
				return;
      }
      editProductCategoryFn({
        'id': itemData.id,
        'isShow': itemData.isShow ? 1 : 0,
        'name': itemData.name,
        'icon': itemData.icon,
        'sort': itemData.sort,
        'pids': itemData.pids,
        'description': itemData.description
      }).then((res) => {
        this.dataConfig.loading = false
        const resData = this.resDataFn(res)
        if (resData === '000') {
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          })
          this.queryProductCategoryFn()
        }
      }).catch(() => {
        this.dataConfig.loading = false
      })
    },
    backFcategoryFn() {
      this.pid = 0
      this.queryProductCategoryFn()
    },
    getChildrenFn(id) {
      this.pid = id
      this.queryProductCategoryFn()
    },
    queryProductCategoryFn() {
      queryProductCategoryFn({ pid: this.pid }).then((res) => {
        const resData = this.resDataFn(res)
        resData.forEach((item) => {
          item.isShow = item.isShow == 1
          item.pidsArr = item.pids.split(',')
        })
        this.dataList.splice(0, this.dataList.length, ...resData)
      })
    }
  }
}
</script>

<style>
</style>
