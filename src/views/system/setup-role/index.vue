<template>
  <div class="content_box">
    <first-title title="角色管理" />
    <div class="select_view">
      <el-button type="primary" @click="addDataFn"><i class="el-icon-plus" />添加角色</el-button>
      <span class="mg_l15" style="color: #F56C6C;">注意：“修改”和“添加”系统角色项目后需要点击右侧“提交编辑”按钮才会生效哦</span>
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column label="角色ID" width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.id">{{ scope.row.id }}</span>
          <span v-if="!scope.row.id" class="delete_icon" @click="deleteAddFn(scope.$index)"><i class="el-icon-delete" /></span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="请输入角色名称" />
        </template>
      </el-table-column>
      <el-table-column label="角色描述">
        <template slot-scope="scope">
          <el-input v-model="scope.row.description" placeholder="请输入角色描述" />
        </template>
      </el-table-column>
      <el-table-column label="角色权限菜单" style="width: 100px;">
        <template slot-scope="scope">
          <!-- <el-input v-model="scope.row.menuIds" style="width: 400px;" placeholder="请输入角色权限菜单ID或点击右侧按钮选择" /> -->
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content" style="width: 400px;line-height: 1.6em;">
              <p style="margin-bottom: 10px;">已选权限ID</p>
              <p>{{ scope.row.menuIds && scope.row.menuIds.join(',') }}</p>
            </div>
            <el-button type="primary" plain="" size="small" @click="checkMenuFn(scope)">点击选择菜单</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="状态(禁用/启用)">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :disabled="scope.row.id == ''" @change="statusChangeFn($event,scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editDataFn(scope.row)">提交编辑</el-button>
          <el-button v-if="scope.row.id" type="danger" size="small" @click="deleteFn(scope)"><i class="el-icon-delete" />删除</el-button>
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
      title="权限菜单配置"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-tree
        ref="tree"
        :props="defaultProps"
        :data="treeList"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="[]"
        show-checkbox
        @check-change="checkChangeFn"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeysFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { roleDetailFn, addOrUpdateRoleFn, menuTreeListFn, roleListFn, roleRemoveFn, handleRoleStatusFn } from '@/api/system.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SetupRole',
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      treeList: [],
      checkedRowIndex: 0,
      defaultProps: {
        label: (data, node) => {
          return `${data.name}(ID:${data.id})`
        },
        children: 'children'
      },
      editData: {
        'description': '',
        'id': '',
        'isAdmin': '',
        'menuIds': [],
        'name': '',
        'status': true
      },
      dataConfig: {
        'pageNo': 1,
        'pageSize': 50,
        'total': 0,
        'loading': true
      }
    }
  },
  beforeMount() {
    this['user/actionMenulist']({ menuType: -1 }).then(() => {
      this.roleListFn()
    })
  },
  computed: {
    ...mapGetters(['menuTreeList'])
  },
  methods: {
    ...mapActions(['user/actionMenulist']),
    checkChangeFn(data, selfChecked, chlidChecked) {
      if (selfChecked) {
        console.log(data.parentId)
        if (data.parentId != 0) {
          this.$refs.tree.setChecked(data.parentId, true)
        }
      } else {
        this.checkChildren(data)
      }
    },
    checkChildren(data) {
      data.children.forEach((item) => {
        this.$refs.tree.setChecked(item.id, false)
        if (item.children && item.children.length > 0) {
          this.checkChildren(item)
        }
      })
    },
    getCheckedKeysFn() {
      const ids = this.$refs.tree.getCheckedKeys()
      this.dataList[this.checkedRowIndex].menuIds.splice(0, this.dataList[this.checkedRowIndex].menuIds.length, ...ids)
      this.dialogVisible = false
    },
    checkMenuFn(scop) {
      this.dialogVisible = true
      this.checkedRowIndex = scop.$index
      this.treeList.splice(0, this.treeList.length, ...scop.row.treeList)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(scop.row.menuIds)
      })
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val
      this.roleListFn()
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo
      this.roleListFn()
    },
    addDataFn() {
      this.editData = {
        'description': '',
        'id': '',
        'isAdmin': '',
        'menuIds': [],
        'name': '',
        'status': true
      }
      this.dataList.unshift(Object.assign({}, this.editData, { treeList: this.menuTreeList }))
    },
    deleteAddFn(index) {
      this.dataList.splice(index, 1)
    },
    statusChangeFn(val, index) {
      console.log(val)
      handleRoleStatusFn({
        id: this.dataList[index].id,
        status: val ? 1 : 0
      }).then((res) => {
        if (res.code == '000') {
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.dataList[index].status = !val
        }
      }).catch(() => {
        this.dataList[index].status = !val
      })
    },
    editDataFn(val) {
      if (!val.name) {
        this.$message({
          showClose: true,
          message: '请填写角色名称！',
          type: 'warning'
        })
        return
      }
      if (val.menuIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请选择角色权限菜单！',
          type: 'warning'
        })
        return
      }
      addOrUpdateRoleFn({
        'description': val.description,
        'id': val.id,
        'isAdmin': val.isAdmin,
        'menuIds': val.menuIds.slice(),
        'name': val.name
      }).then((res) => {
        const resData = this.resDataFn(res)
        if (resData == '000') {
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          })
          this.roleListFn()
        }
      })
    },
    deleteFn(scope) {
      this.deleteAlert().then(() => {
        const res = roleRemoveFn({ id: scope.row.id })
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
    menuRouteKList(list) {
      const resArr = []
      const forEachArrFn = function(arr) {
        arr.forEach((item) => {
          item.id && resArr.push(item.id)
          if (Object.prototype.toString.call(item.children) == '[object Array]') {
            forEachArrFn(item.children)
          }
        })
      }
      forEachArrFn(list)
      return resArr
    },
    menuTreeListFn() {
      this.dataList.forEach((item, index) => {
        item.status = item.status == 1
        if (item.id) {
          menuTreeListFn({ id: item.id }).then((res) => {
            const resData = this.resDataFn(res)
            this.$set(this.dataList, index, Object.assign({}, item, {
              menuIds: this.menuRouteKList(resData)
            }))
          })
        }
      })
    },
    roleListFn() {
      roleListFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize
      }).then((res) => {
        const resData = this.resDataFn(res)
        resData.records.forEach((item) => {
          item.treeList = this.menuTreeList
        })
        this.dataList.splice(0, this.dataList.length, ...resData.records)
        this.dataConfig.total = resData.total
        console.log(this.dataList)
        this.menuTreeListFn()
      })
    }
  }
}
</script>

<style lang="scss">
  .content_box{
    .el-tree-node{
      margin: 15px 0;
    }
  }
</style>
