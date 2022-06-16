// table
const tableMixin = {
  data(){
    return {
      page: {
        //数据总量
        dataSumNum: 1,
        //当前页数据量
        dataNum: 10,
        //当前页码
        pageNo: 1
      },
      queryMethod:'post',
      searchForm:{},
      addForm:{},
      editForm:{},
      selection:[],
      dataList:[],
    }
  },
  methods: {
    query() {
      this.loading = true;
      if(this.queryMethod == 'post'){
        this.$axios.post(this.url.query,{
          pageNo:this.page.pageNo,
          pageSize:this.page.dataNum,
          ...this.searchForm
        })
        .then(( {data:{records,total,current}} ) => {
          this.dataList = records//list;
          this.page.dataSumNum = total;
          this.page.pageNo = current;
        }).catch(function (error) {
          console.error(error);
        });
      }else{
        this.$axios.get(`${this.url.query}?pageNo=${this.page.pageNo}&pageSize=${this.page.dataNum}`)
        .then(( {data:{records,total,current}} ) => {
          this.dataList = records//list;
          this.page.dataSumNum = total;
          this.page.pageNo = current;
        }).catch(function (error) {
          console.error(error);
        });
      }
      this.loading = false
    },
    querySelectData(){
      // 不填內容，待替換
    },
    reset() {
      this.searchForm = {}
      this.page.pageNo = 1
      this.query()
    },
    updatePageNo(pageNo) {
      this.page.pageNo = pageNo;
      this.query();
    },
    handleSizeChange(page) {
      this.page.dataNum = page;
      this.query()
    },
    /**
     * 新增
     * @param {*} fn 是否关闭页面
     * @param {*} param  特殊参数(图片等...)
     */
    submitForm(fn,param = {}) {
      this.loading = true
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$axios.post(this.url.add, {...this.addForm,...param}).then((data) => {
            this.util.message(this, data.status, data.errorMsg);
            this.query()
            this.handleClose()
            this.loading = false
            fn(false)
          }).catch(function (error) {
            this.loading = false
            console.info(error);
          });
        } else {
          return false
        }
      });
    },
    handleClose(fn) {
      this.addForm = {}
      if(fn)
          fn(false)
    },
    /**
     * 
     * @param {*} row 数据
     * @param {*} params 变量名
     */
    editInit(row,params) {
      if(params)
        params.forEach((item)=>{
          this.editForm[item] = row[item]
        })
      else
        this.editForm = row
      this.$refs.editModel.open()
    },
    edit(fn,param = {}) {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$axios.post(this.url.edit, {...this.editForm,...param}).then(( {code,message} ) => {
            this.util.message(this, code, message)
            this.resetEditForm();
            this.query();
            fn(false)
          }).catch(function (error) {
            console.info(error);
          });
        } else {
          return false
        }
      });
    },
    resetEditForm(fn) {
      if(fn)
        fn(false)
    },
    handleSelectionChange(val) {
      this.selection = val.map(x => x.id);
    },
    updateStatus(row) {
      this.$axios.post(this.url.updateStatus, {
        id: row.id,
        status: Number(!row.status)
      }).then((data) => {
        this.util.message(this, data.status, data.errorMsg)
        this.query();
      }).catch(function (error) {
        console.info(error);
      });
    },
    updateTopStatus(row) {
      this.$axios.post(this.url.updateTopStatus, {
        id: row.id,
        isTop: Number(!row.isTop)
      }).then((data) => {
        this.util.message(this, data.status, data.errorMsg)
        this.query();
      }).catch(function (error) {
        console.info(error);
      });
    },
    remove(ids) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (ids === undefined) {
          ids = this.selection
          if (ids.length === 0) {
            this.util.message(this, 0, '请选择菜单');
            return
          }
        }
        // this.$axios.post(this.url.delete, {
        //   "id": ids,
        //   "idList": ids
        // })
        this.$axios.get(this.url.delete+'?id='+ids)
        .then((data) => {
          console.info(this.util)
          this.util.message(this, data.code, data.message)
          this.query();
        }).catch(function (error) {
          console.info(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted() {
    this.query()
    this.querySelectData()
  },
}
export default tableMixin