<template slot-scope="scope">
    <div>
        <el-image  v-if="src!==''"  style="width: 57px; height: 57px; text-align: center;" 
            :src="src" :preview-src-list="srcList">
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
        <div v-if="src==''" style="width: 57px; height: 57px">\</div>
    </div>
</template>
<script>
export default {
    name:'image',
    props:['src','srcList']
}
</script>