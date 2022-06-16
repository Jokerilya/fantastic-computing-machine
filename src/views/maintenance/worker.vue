<!--编程订单-->
<template>
    <div class="app-container">
        <el-table highlight-current-row v-loading.fullscreen.isLock="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading" :data="dataList" style="width: 100%;">
            <el-table-column prop="realName" label="真实姓名" show-overflow-tooltip width="150" align="center">
            </el-table-column>
            <el-table-column prop="realPortrait" label="真实头像" show-overflow-tooltip align="center">
                <template slot-scope="{row}">
                    <y-image :src="row.realPortrait?row.realPortrait.split(',')[0]:''"
                        :srcList="row.realPortrait?row.realPortrait.split(','):''" />
                </template>
            </el-table-column>
            <el-table-column prop="identityNumber" label="身份证号" show-overflow-tooltip width="150" align="center">
            </el-table-column>
            <el-table-column prop="identityFrontImage" label="身份证正面照" show-overflow-tooltip align="center">
                <template slot-scope="{row}">
                    <y-image :src="row.identityFrontImage?row.identityFrontImage.split(',')[0]:''"
                        :srcList="row.identityFrontImage?row.identityFrontImage.split(','):''" />
                </template>
            </el-table-column>
            <el-table-column prop="identityBackImage" label="身份证反面照" show-overflow-tooltip align="center">
                <template slot-scope="{row}">
                    <y-image :src="row.identityBackImage?row.identityBackImage.split(',')[0]:''"
                        :srcList="row.identityBackImage?row.identityBackImage.split(','):''" />
                </template>
            </el-table-column>
            <el-table-column prop="industryExperience" label="行业经验" show-overflow-tooltip width="150" align="center">
            </el-table-column>
            <el-table-column prop="industryExperienceImages" label="行业经验照片" show-overflow-tooltip align="center">
                <template slot-scope="{row}">
                    <y-image :src="row.industryExperienceImages?row.industryExperienceImages.split(',')[0]:''"
                        :srcList="row.industryExperienceImages?row.industryExperienceImages.split(','):''" />
                </template>
            </el-table-column>
            <el-table-column prop="serviceAreas" label="服务地区" show-overflow-tooltip width="150" align="center"></el-table-column>
            <el-table-column prop="skillCertificateImages" label="技能证书图书" show-overflow-tooltip align="center">
                <template slot-scope="{row}">
                    <y-image :src="row.skillCertificateImages?row.skillCertificateImages.split(',')[0]:''"
                        :srcList="row.skillCertificateImages?row.skillCertificateImages.split(','):''" />
                </template>
            </el-table-column>
            <el-table-column prop="serviceTypes" label="服务类型" show-overflow-tooltip width="150" align="center">
            </el-table-column>
            <el-table-column prop="address" label="详细地址" show-overflow-tooltip width="150" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间 " show-overflow-tooltip width="150" align="center">
            </el-table-column>
            <el-table-column prop="isLock" label="是否锁定" show-overflow-tooltip width="150" align="center" fixed="right">
                <template slot-scope="{row}">
                    {{util.global.getLabel('isLock',row.isLock)}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="审核状态" show-overflow-tooltip width="150" align="center" fixed="right">
                <template slot-scope="{row}">
                    {{util.global.getLabel('checkStatus',row.status)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300px" fixed="right">
                <template slot-scope="{row}">
                    <div class="settings">
                        <el-button type="warning" size="mini" plain @click="open(row)" :disabled="row.status == 2">审核</el-button>
                        <el-button type="danger" size="mini" plain @click="isLock(row)" v-show="!row.isLock">
                            锁定
                        </el-button>
                        <el-button type="success" size="mini" plain @click="isLock(row)" v-show="row.isLock">
                            解锁
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="updatePageNo"
            :current-page="page.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="page.dataNum"
            layout="total, sizes, prev, pager, next, jumper" :total="page.dataSumNum">
        </el-pagination>
        <model ref="editModel" title="师傅审核" @ok="handleEdit" @close="resetEditForm">
            <el-form :model="editForm" :rules="rules" ref="editForm" status-icon label-width="120px" class="demo-ruleForm">
                <el-form-item label="审核状态" prop="name" style="width:calc(100% - 120px)">
                    <el-switch v-model="editForm.status" ></el-switch>
                </el-form-item>
            </el-form>
        </model>
    </div>
</template>
<style lang="less" scoped>

</style>
<script>
    import tableMixin from '@/mixin/table'
    export default {
        title: 'course',
        mixins: [tableMixin],
        data() {
            return {
                loading: false,
                queryMethod: 'get',
                typeData: [],
                systemData: [],
                courseList: [],
                courseDistriList: [],
                url: {
                    query: '/admin/maintenance/queryMasterList',
                    edit: '/admin/maintenance/handleMasterLock',
                    updateStatus: '/admin/maintenance/handleMasterExamine'
                },
                rules: {
                    worker: [{
                        required: true,
                        message: '请输入接单人',
                        trigger: 'blur'
                    }],
                    workerPhone: [{
                        required: true,
                        message: '请输入接单人手机',
                        trigger: 'blur'
                    }],
                },
                finishForm: {
                    payAmount: 0
                },
            }
        },
        methods: {
            isLock(row){
                this.$axios.post(this.url.edit,{
                    id:row.id,
                    lock:Number(!row.isLock)
                }).then(( {code,message} ) => {
                    this.util.message(this, code, message)
                    this.query();
                }).catch((err)=>{
                    console.error(err)
                })
            },
            open(row){
                this.$refs.editModel.open()
                this.editForm = {
                    id:row.id,
                    status:false
                }
            },
            handleEdit(fn){
                this.editForm.status = this.editForm.status?3:2
                this.updateStatus(fn, this.editForm)
            }
        }
    }
</script>