<template>
  <div class="content_box">
    <first-title title="运费模板" />
    <div class="select_view">
      筛选：
      <el-input v-model="queryTitle" style="width:260px" class="mg_r15 mg_t10" placeholder="请输入运费模板名称" />
      <el-button class="mg_t10" type="primary" @click="queryDataListFn">查询</el-button>
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn">重置查询</el-button>
      <el-button type="primary" @click="addItemFn"><i class="el-icon-plus" />添加运费模板</el-button>
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column label="ID" fixed width="60" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费模板名称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包邮规则满足多少包邮" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expRule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editDataFn(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.id" type="danger" size="small" @click="deleteItemFn(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加/编辑"
      :visible.sync="dialogVisible"
      width="1200px"
    >
      <div>
        <el-form ref="form" :model="defData" label-width="160px">
          <el-form-item label="信息ID">
            <el-input v-model="defData.id" disabled="disabled" />
          </el-form-item>
          <el-form-item label="运费模板名称">
            <el-input v-model="defData.name" placeholder="请输入运费模板名称" />
          </el-form-item>
          <el-form-item label="每增加多少（件数）">
            <el-input v-model="defData.addValue" type="number" placeholder="请输入数量" />
          </el-form-item>
          <el-form-item :label="`每增加${defData.addValue}件加多少钱`">
            <el-input v-model="defData.addMoney" type="number" placeholder="请输入金额" />
          </el-form-item>
          <el-form-item label="默认金额">
            <el-input v-model="defData.defaultMoney" type="number" placeholder="请输入默认金额" />
          </el-form-item>
          <el-form-item label="默认值">
            <el-input v-model="defData.defaultValue" type="number" placeholder="请输入默认值" />
          </el-form-item>
          <el-form-item label="包邮规则满足多少包邮">
            <el-input v-model="defData.expRule" type="number" placeholder="请输入金额" />
          </el-form-item>
          <el-form-item label="部分地区单独配置">
            <el-table :data="defData.list" style="width: 100%" stripe>
              <el-table-column label="ID" align="center" width="40px">
                <template slot-scope="scope">
                  <!-- <span v-if="scope.row.id">{{ scope.row.id }}</span> -->
                  <span class="delete_icon" @click="deleteAddFn(scope.$index,scope.row.id)"><i class="el-icon-delete" /></span>
                </template>
              </el-table-column>
              <el-table-column label="省份（可多选）" align="center" width="270">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.proId" style="width: 260px;" multiple placeholder="请选择省" @change="proIdChangeFn">
                    <el-option
                      v-for="item in province"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="城市（可多选）" align="center" width="270">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.cityId" style="width: 260px;" multiple placeholder="请选择市">
                    <el-option-group
                      v-for="proId in scope.row.proId"
                      v-if="allCitys[proId]"
                      :key="allCitys[proId].pid"
                      :label="allCitys[proId].name"
                    >
                      <el-option
                        v-for="item in allCitys[proId].list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-option-group>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="默认金额" width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.defaultMoney" type="number" placeholder="请输入默认金额" />
                </template>
              </el-table-column>
              <el-table-column label="默认值" width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.defaultValue" type="number" placeholder="请输入默认值" />
                </template>
              </el-table-column>
              <el-table-column label="每增加多少（件数）" width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.addValue" type="number" placeholder="请输入数量" />
                </template>
              </el-table-column>
              <el-table-column label="每增加多少件加多少钱" width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.addMoney" type="number" placeholder="请输入金额" />
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addListItemFn">新增地区单独配置项</el-button>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDataFn">确 定</el-button>
      </span>
    </el-dialog>
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
  </div>
</template>

<script>
import { addressFn, queryExpRuleFn, editExpRuleFn, getExpRuleDetailFn, delExpRuleDetailFn, delExpDetailFn } from '@/api/system.js'
export default {
  name: 'Exp',
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      defData: {
        'addMoney': 0,
        'addValue': 0,
        'defaultMoney': 0,
        'defaultValue': 0,
        'expRule': '',
        'id': '',
        'list': [],
        'name': ''
      },
      queryTitle: '',
      dataConfig: {
        'pageNo': 1,
        'pageSize': 20,
        'total': 0,
        'loading': true
      },
      province: {},
      allCitys: {

      }
    }
  },
  beforeMount() {
    this.getDataListFn()
    this.addressFn(0).then((res) => {
      res.forEach((item) => {
        this.province[item.id] = item
      })
    })
  },
  methods: {
    deleteAddFn(index, id) {
      if (id) {
        delExpDetailFn({ id: id }).then((res) => {
          const resData = this.resDataFn(res)
          if (resData == '000') {
            this.$message({
              showClose: true,
              message: '操作成功！',
              type: 'success'
            })
            this.defData.list.splice(index, 1)
          }
        })
      } else {
        this.defData.list.splice(index, 1)
      }
    },
    proIdChangeFn(val) {
      val.forEach((item) => {
        if (!this.allCitys[item]) {
          this.addressFn(item).then((res) => {
            this.$set(this.allCitys, item, {
              name: this.province[item].name,
              pid: item,
              list: res
            })
          })
        }
      })
    },
    addListItemFn() {
      this.defData.list.push({
        'addMoney': 0,
        'addValue': 0,
        'proId': '',
        'cityId': '',
        'defaultMoney': 0,
        'defaultValue': 0
      })
    },
    uploadCoverUrl(img) {
      this.defData.url = img
    },
    editDataFn(id) {
      getExpRuleDetailFn({ id: id }).then((res) => {
        const resData = this.resDataFn(res)
        if (res.code == '000') {
          resData.list.forEach((item) => {
            item.proId = item.proId ? item.proId.split(',') : []
            item.cityId = item.cityId ? item.cityId.split(',') : [],
            item.proId.forEach((item2) => {
              if (!this.allCitys[item2]) {
                this.addressFn(item2).then((res) => {
                  this.$set(this.allCitys, item2, {
                    name: this.province[item2].name,
                    pid: item2,
                    list: res
                  })
                })
              }
            })
          })
          this.defData = Object.assign({}, this.defData, resData)
          this.dialogVisible = true
        }
      })
    },
    queryDataListFn() {
      if (!this.queryTitle) return
      this.dataConfig = {
        'pageNo': 1,
        'pageSize': 20,
        'total': 0,
        'loading': true
      }
      this.getDataListFn()
    },
    resSetQueryFn() {
      this.dataConfig = {
        'pageNo': 1,
        'pageSize': 20,
        'total': 0,
        'loading': true
      }
      this.queryTitle = ''
      this.getDataListFn()
    },
    submitDataFn() {
      const data = JSON.parse(JSON.stringify(this.defData))
      let canSubmint = true
      delete data.createTime
      data.id = data.id ? data.id : undefined
      data.list.forEach((item, index) => {
        if (item.proId.length > 0) {
          item.proId = item.proId.join(',')
        } else {
          canSubmint = false
          this.$message({
            showClose: true,
            message: `请选择“地区单独配置”第${index + 1}行的省！`,
            type: 'success'
          })
        }
        if (item.cityId.length > 0) {
          item.cityId = item.cityId.join(',')
        } else {
          canSubmint = false
          this.$message({
            showClose: true,
            message: `请选择“地区单独配置”第${index + 1}行的市！`,
            type: 'success'
          })
        }
      })
      if (!canSubmint) return
      console.log(data)
      editExpRuleFn(data).then((res) => {
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
    addItemFn() {
      this.defData = {
        'addMoney': 0,
        'addValue': 0,
        'defaultMoney': 0,
        'defaultValue': 0,
        'expRule': '',
        'id': '',
        'list': [],
        'name': ''
      }
      this.dialogVisible = true
    },
    addressFn(pid) {
      return addressFn({ pid: pid }).then((res) => {
        const resData = this.resDataFn(res)
        return resData
      })
    },
    deleteItemFn(scope) {
      this.deleteAlert().then(() => {
        const res = delExpRuleDetailFn({ id: scope.row.id })
        return res
      }).then((res) => {
        const resData = this.resDataFn(res)
        if (resData == '000') {
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success'
          })
          this.dataList.splice(scope.$index, 1)
        }
      })
    },
    getDataListFn() {
      queryExpRuleFn({
        'pageNo': this.dataConfig.pageNo,
        'pageSize': this.dataConfig.pageSize,
        'name': this.queryTitle
      }).then((res) => {
        const resData = this.resDataFn(res)
        this.dataConfig.total = resData.total
        this.dataList.splice(0, this.dataList.length, ...resData.records)
      })
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val
      this.getDataListFn()
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo
      this.getDataListFn()
    }
  }
}
</script>

<style>
</style>
