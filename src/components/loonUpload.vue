<template>
    <div id="content">
        <input type="file" id="file" :ref="id" :accept="type" multiple="multiple" @change="fileChange">

        <div id="add" v-show="uploadList.length+uploadedList.length<limit" @click="upload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <div class="uploaded" v-for="item in uploadedList" :key="item.url">
            <!-- image/png,image/jpeg / image.*-->
            <img v-show="type.indexOf('image')>-1&&type.indexOf('text')==-1" :src="item.url" />
            <div v-show="type.indexOf('image')>-1&&type.indexOf('text')==-1" @click="remove(item.url)" class="delete_img">
                <i class="el-icon-delete"></i>
            </div>
            <!-- audio/mpeg,audio/ogg,audio/wav -->
            <audio v-show="type.indexOf('audio')>-1" :src="item.url" controls></audio>
            <div v-show="type.indexOf('audio')>-1" @click="remove(item.url)" class="delete_aduio">
                <i class="el-icon-delete"></i>
            </div>
            <!-- video/mp4,video/webm,video/ogg -->
            <video v-show="type.indexOf('video')>-1" :src="item.url" controls></video>
            <i class="el-icon-delete delete_video" v-show="type.indexOf('video')>-1" @click="remove(item.url)"></i>
            <!-- text/plain,text/html -->
            <el-link :href="item.url" v-show="type.indexOf('text')>-1" type="success" target="_Blank">
                {{ item.url.slice(item.url.lastIndexOf('/')+1) }}
            </el-link>
            <i v-show="type.indexOf('text')>-1" @click="remove(item.url)" class="el-icon-delete"></i>
        </div>
        
        <div class="upload" v-for="item in uploadList" :key="item.url">
            <!-- image/png,image/jpeg / image.*-->
            <img v-show="type.indexOf('image')>-1&&type.indexOf('text')==-1" :src="item.url" />
            <div v-show="type.indexOf('image')>-1&&type.indexOf('text')==-1" @click="remove(item.url)" class="delete_img">
                <i class="el-icon-delete"></i>
            </div>
            <!-- audio/mpeg,audio/ogg,audio/wav -->
            <audio v-show="type.indexOf('audio')>-1" :src="item.url" controls></audio>
            <div v-show="type.indexOf('audio')>-1" @click="remove(item.url)" class="delete_aduio">
                <i class="el-icon-delete"></i>
            </div>
            <!-- video/mp4,video/webm,video/ogg -->
            <video v-show="type.indexOf('video')>-1" :src="item.url" controls></video>
            <i class="el-icon-delete delete_video" v-show="type.indexOf('video')>-1" @click="remove(item.url)"></i>
            <!-- text/plain,text/html -->
            <el-link :href="item.url" v-show="type.indexOf('text')>-1" type="primary" target="_Blank">
                <!-- {{ item.url.slice(item.url.lastIndexOf('/')+1) }} -->
                {{ item.file.name }}
            </el-link>
            <i v-show="type.indexOf('text')>-1" @click="remove(item.url)" class="el-icon-delete"></i>
        </div>
    </div>
</template>
<script>
import { uuid } from 'uuidv4'
import { UploadImg } from '@/api/system.js'
export default {
    name:'loon-upload',
    props:['type','folder','limit','size'],
    data(){
        return{
            id:'',
            //暂存队列
            uploadList:[],
            //已存队列
            uploadedList:[]
        }
    },
    methods:{
        upload(){
            this.$refs[this.id].click()
        },
        isNull(){
            return this.uploadList.length+this.uploadedList.length==0
        },
        async uploadFile(){
            // loading
            const loading = this.$loading({text:'上传中..'})

            //已上传数据
            var result = []
            this.uploadedList.forEach( (item)=>{
                result.push(item.url)
            })
            for(let i = 0; i < this.uploadList.length ; i++){
                const formData = new FormData()

                formData.append('file', this.uploadList[i].file)
                await UploadImg(formData).then((res) => {
                    result.push(res.data)
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: `第${i+1}份文件上传失败！`,
                        type: 'warning'
                    })
                    loading.close()
                    throw new Error('上传失败')
                })
            }
            loading.close()
            return result
        },
        reset(urlArray = []){
            this.uploadList = []
            this.uploadedList = urlArray
            this.$forceUpdate()
        },
        fileChange(){
            const uploadLength = this.uploadList.length
            const uploadedLength = this.uploadedList.length
            const canUploadCount = this.limit - uploadLength - uploadedLength
            
            const files = this.$refs[this.id].files
            const fileLength = this.$refs[this.id].files.length
            for(let i = 0 ; i < fileLength ; i++){
                if( i > canUploadCount-1){
                    return
                }
                if( this.size == undefined || files[i].size <= this.size ){
                    //生成预览图片
                    const url = window.URL.createObjectURL(files[i]);
                    this.uploadList.push( { url : url , file : files[i] } )
                }else {
                    this.$message.error('文件大小超过'+this.size/1024/1024+'M')
                }
            }
            // 这行代码很核心，没有这行会出现一个bug，无法重复上传同一张图片
            this.$refs[this.id].value=""
        },
        remove(url){
            this.uploadList = this.uploadList.filter(item => {
                if(item.url!=url){
                    return item
                }
            })
            this.uploadedList = this.uploadedList.filter(item => {
                if(item.url!=url){
                    return item
                }
            })
            // 结束了清除掉不必要的资源
            window.URL.revokeObjectURL(url);
        }
    },
    mounted(){
        this.id=uuid()
    }
}
</script>
<style lang="less" scoped>
    #content{
        width: max-content;
        height: max-content;
        #file{
            display: none;
        }
        #add{
            width: 100px;
            height: 100px;
            line-height: 100px;
            border-radius: 10px;
            text-align: center;
            margin-left: 2px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            border: 1px dashed #c0ccda;
            margin: 5px;
        }
        #add:hover{
            color: #409EFF;
            border-color:#409EFF;
        }
        img{
            width: 100px;
            height: 100px;
            margin: 5px;
            border-radius: 10px;
        }
        video{
            min-width: 200px;
            max-width: 200px;
            height: 150px;
            border: 1px solid;
            border-radius: 8px;
        }
        .delete_img{
            width: 100px;
            height: 100px;
            margin: 5px;
            display: none;
        }
        .delete_aduio{
            line-height: 54px;
        }
        .delete_video{
            height: 20px;
            position: relative;
            right: 20px;
            top: 4px;
        }
        .upload:hover>.delete_img{
            display: block;
            color: #fff;
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
            position: absolute;
            background: rgba(0,0,0,.5);
        }
        .uploaded:hover>.delete_img{
            display: block;
            color: #fff;
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
            position: absolute;
            background: rgba(0,0,0,.5);
        }
        .upload{
            display: flex;
            width: max-content;
            height: max-content;
        }
        .uploaded{
            display: flex;
            width: max-content;
            height: max-content;
        }
    }
</style>