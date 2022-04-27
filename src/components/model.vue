<template>
    <el-dialog :title="title" :visible.sync="show" style="margin-top:2vh;" 
      append-to-body :before-close="handleClose" :width="width||(25*column+'%')">
        <slot style="height:50vh;overflow:hidden auto;"></slot>
        <span v-if="isSubmit" slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name:'model',
    data(){
        return {
            show:false,
        }
    },
    props:{
        title:{
            type: String,
            required:false,
            default:''
        },
        column:{
            type: Number,
            required:false,
            default:1
        },
        width:{
            type: String,
            required:false,
            default:''
        },
        isSubmit:{
            type:Boolean,
            required:false,
            default:true
        }
    },
    methods:{
        handleClose(){
            this.addForm ={}
            this.$emit('close',(show)=>{
              this.show = show;
            })
        },
        handleSubmit(){
            this.$emit('ok',(show)=>{
              this.show = show;
            })
        },
        open(){
            this.show = true;
            this.$emit('open')
        }
    }
}
</script>