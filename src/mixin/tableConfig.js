import {all} from 'axios'
// configTable
const tableMixin = {
  data(){
    return {
      editForm:{},
    }
  },
  methods: {
    queryAll() {
      this.loading = true;
      let urlList = []
      this.url.queryAll.forEach(url => {
        urlList.push(this.$axios.get(url))
      });
      all(urlList)
      .then(({...data}) => {
        for(let item in data){
          if(data[item].data){
            this['dataList'+item] = [data[item].data]
          }else if (data[item].list){
            this['dataList'+item] = data[item].list
          }
        }
      })
      this.loading = false
    },
    editInit(row) {
      this.editForm = row
      this.$refs.editModel.open()
    },
    edit(fn,index,param = {}) {
      this.$refs['editForm'+index].validate((valid) => {
        if (valid) {
          this.$axios.post(this.url.editAll[index], {...this['editForm'+index],...param}).then((data) => {
            this.util.message(this, data.status, data.errorMsg)
            this.resetEditForm();
            this.queryAll();
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
    updateStatus(row) {
      this.$axios.post(this.url.updateStatus, {
        id: row.id,
        status: Number(!row.status)
      }).then((data) => {
        this.util.message(this, data.status, data.errorMsg)
        this.queryAll();
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
        this.queryAll();
      }).catch(function (error) {
        console.info(error);
      });
    },
    remove(menu) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (menu === undefined) {
          menu = this.selection
          if (menu.length === 0) {
            this.util.message(this, 0, '请选择菜单');
            return
          }
        }
        this.$axios.post(this.url.delete, {
          "idList": menu
        }).then((data) => {
          this.util.message(this, data.status, data.errorMsg)
          this.queryAll();
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
    this.queryAll()
  },
}
export default tableMixin