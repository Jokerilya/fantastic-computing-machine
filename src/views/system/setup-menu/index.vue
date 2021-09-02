<template>
  <div class="content_box">
    <first-title title="菜单管理" />
    <el-row style="margin-top: 10px;" :gutter="10">
      <el-col :xs="6" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="el_tree">
          <el-button style="width: 100%;margin-bottom: 15px;" type="primary" size="medium" @click="addDataFn"><i class="el-icon-plus" />添加菜单</el-button>
          <el-button style="width: 100%;margin-bottom: 15px;margin-left: 0;" type="primary" size="medium" @click="backRootFn"><i class="el-icon-d-arrow-left" />返回根菜单</el-button>
          <el-tree accordion :data="menuTreeList" :props="defaultProps" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }">{{ data.name }}(ID:{{ data.id }})</span>
          </el-tree>
        </div>
      </el-col>
      <el-col :xs="18" :sm="20" :md="20" :lg="20" :xl="20">
        <el-table
          v-loading="dataConfig.loading"
          border
          :data="dataList"
          class="list"
          style="margin-top: 0px;min-height: 800px;padding: 15px;"
        >
          <el-table-column label="菜单ID" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="父级ID" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.parentId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="菜单名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="授权标识" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.authValue }}</span>
            </template>
          </el-table-column>
          <el-table-column label="菜单类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type == 0 ? '菜单' : '按钮' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="URL" width="240">
            <template slot-scope="scope">
              <span>{{ scope.row.url }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" width="240" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editDataFn(scope.row)">编辑</el-button>
              <!-- <el-button v-if="scope.row.id" type="danger" size="small" @click="deleteFn(scope)"><i class="el-icon-delete" />删除</el-button> -->
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
      </el-col>
    </el-row>

    <el-dialog
      title="添加/编辑菜单"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <div>
        <el-form ref="form" :model="editData" label-width="80px">
          <el-form-item label="菜单名称">
            <el-input v-model="editData.name" />
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-select v-model="editData.type" placeholder="请选择">
              <el-option
                v-for="item in menuType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="排序">
            <el-input v-model="editData.sort" />
          </el-form-item> -->
          <el-form-item label="菜单URL">
            <el-input v-model="editData.url" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="editData.description" />
          </el-form-item>
          <el-form-item label="授权标识">
            <el-input v-model="editData.authValue" />
          </el-form-item>
          <el-form-item label="菜单ID">
            <el-input v-model="editData.id" disabled="disabled" />
          </el-form-item>
          <el-form-item label="父级ID">
            <el-input v-model="editData.parentId" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { menuAddOrUpdateFn, menuListFn, menuRemoveFn, menuTreeListFn } from '@/api/system.js'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SetupMenu',
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      pid: 0,
      editData: {
        'authValue': '',
        'description': '',
        'icon': '',
        'id': '',
        'name': '',
        'parentId': '',
        // 'sort': 0,
        'type': '',
        'url': ''
      },
      menuType: [
        {
          value: 0,
          label: '菜单'
        },
        {
          value: 1,
          label: '按钮'
        }
      ],
      dataConfig: {
        'pageNo': 1,
        'pageSize': 50,
        'total': 0,
        'loading': true
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  beforeMount() {
    this['user/actionMenulist']({ menuType: 0 })
    this.menuListFn()
  },
  computed: {
    ...mapGetters(['menuTreeList'])
  },
  methods: {
    ...mapActions(['user/actionMenulist']),
    submitFn() {
      menuAddOrUpdateFn(Object.assign({}, this.editData)).then((res) => {
        const resData = this.resDataFn(res)
        if (resData == '000') {
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          })
          this.dialogVisible = false
          this.menuListFn()
          this['user/actionMenulist']({ menuType: 0 })
        }
      })
    },
    editDataFn(row) {
      this.dialogVisible = true
      this.editData = Object.assign({}, this.editData, row)
    },
    addDataFn() {
      this.dialogVisible = true
      this.editData = {
        'authValue': '',
        'description': '',
        'icon': '',
        'id': '',
        'name': '',
        'parentId': '',
        // 'sort': 0,
        'type': '',
        'url': ''
      }
    },
    handleNodeClick(data) {
      console.log(data)
      this.dataConfig = {
        'pageNo': 1,
        'pageSize': 50,
        'total': 0,
        'loading': true
      }
      this.pid = data.id
      this.menuListFn()
    },
    menuTreeListFn() {
      menuTreeListFn({ id: 0 }).then((res) => {
        const resData = this.resDataFn(res)
        this.menuTreeList.splice(0, this.menuTreeList.length, ...resData)
      })
    },
    deleteFn(scope) {
      this.deleteAlert().then(() => {
        const res = menuRemoveFn({ menuId: scope.row.id })
        return res
      }).then((res) => {
        const resData = this.resDataFn(res)
        if (resData == '000') {
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          })
          this.dataList.splice(scope.$index, 1)
        }
      })
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val
      this.menuListFn()
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo
      this.menuListFn()
    },
    backRootFn() {
      this.dataConfig.pageNo = 1
      this.dataConfig.pageSize = 20
      this.pid = 0
      this.menuListFn()
    },
    menuListFn() {
      menuListFn({
        name: '',
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        parentId: this.pid
      }).then((res) => {
        const resData = this.resDataFn(res)
        this.dataList.splice(0, this.dataList.length, ...resData.records)
        this.dataConfig.total = resData.total
      })
    }
  }
}
</script>

<style lang="scss">
.content_box{
  .el_tree{
    height: 800px;
    background: #FFFFFF;
    overflow: auto;
    padding: 20px 15px;
  }
  .el-tree-node{
    margin: 15px 0;
  }
}
</style>
