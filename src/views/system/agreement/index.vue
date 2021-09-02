<template>
  <div class="content_box">
    <first-title title="系统说明" />
    <el-table
      border
      :data="dataList"
      class="list"
    >
      <el-table-column label="ID" fixed width="60" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editItemFn(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加/编辑"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div>
        <el-form ref="form" :model="defDdata" label-width="100px">
          <el-form-item label="信息ID">
            <el-input v-model="defDdata.id" disabled="disabled" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="defDdata.title" />
          </el-form-item>
          <el-form-item label="内容">
            <tinymce v-if="dialogVisible" :id="'agreement_'+defDdata.id" v-model="defDdata.content" :height="300" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDataFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { queryAgreementFn, editAgreementFn } from '@/api/system.js'
export default {
  name: 'Notice',
  components: { Tinymce },
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      defDdata: {
        'content': '',
        'id': '',
        'title': ''
      }
    }
  },
  beforeMount() {
    this.getDataListFn()
  },
  methods: {
    submitDataFn() {
      editAgreementFn({
        'content': this.defDdata.content,
        'id': this.defDdata.id,
        'title': this.defDdata.title
      }).then((res) => {
        const resData = this.resDataFn(res)
        if (resData == '000') {
          this.dialogVisible = false
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          })
          this.getDataListFn()
        }
      })
    },
    editItemFn(row) {
      this.defDdata = Object.assign({}, this.defDdata, row)
      this.dialogVisible = true
    },
    deleteItemFn(scope) {
      this.deleteAlert().then(() => {
        const res = delNoticeFn({ id: scope.row.id })
        return res
      }).then((res) => {
        const resData = this.resDataFn(res)
        if (resData == '000') {
          this.dataList.splice(scope.$index, 1)
        }
      })
    },
    getDataListFn() {
      queryAgreementFn().then((res) => {
        const resData = this.resDataFn(res)
        this.dataList.splice(0, this.dataList.length, ...resData)
      })
    }
  }
}
</script>

<style>
</style>
