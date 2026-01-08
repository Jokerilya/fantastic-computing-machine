<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form
        :inline="true"
        :model="queryMasterListParams"
        size="small"
        label-width="70px"
      >
        <el-form-item label="师傅名称">
          <el-input
            placeholder="请输入师傅名称"
            clearable
            v-model="queryMasterListParams.realName"
            style="width: 180px"
            @keyup.enter.native="_getMasterList(1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select
            placeholder="全部"
            v-model="queryMasterListParams.status"
            style="width: 120px"
            clearable
            @change="_getMasterList(1)"
          >
            <el-option label="审核中" :value="1"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核驳回" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务地区">
          <el-cascader
            v-model="queryMasterListParams.areaId"
            :options="serviceAreasList"
            :props="serviceAreasProps"
            clearable
            placeholder="请选择地区"
            style="width: 200px"
            @change="_getMasterList(1)"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            @change="changeQueryTimeCopy"
            v-model="queryTimeCopy"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item class="search-btns">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="_getMasterList(1)"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetFn">重置</el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-download"
            @click="_handleMasterInfoExport"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-wrapper">
      <el-table
        highlight-current-row
        v-loading="loading"
        element-loading-text="加载中..."
        :data="masterList"
        height="calc(100vh - 230px)"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column label="师傅信息" width="200" fixed="left">
          <template slot-scope="{ row }">
            <div class="user-cell">
              <div class="avatar-box">
                <el-image
                  class="avatar-img"
                  :src="getImgUrl(row.realPortrait)"
                  :preview-src-list="getImgList(row.realPortrait)"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <img
                  v-if="isVerified(row.number)"
                  class="v-badge"
                  src="https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20240927/AU04149909.png"
                />
              </div>
              <div class="info-box">
                <div class="name">{{ row.realName || "-" }}</div>
                <div class="phone">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="number"
          label="师傅编号"
          width="140"
          align="center"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="身份" width="100" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="getIdentityTag(row.type)" size="mini" effect="dark">
              {{ row.type == 1 ? "兼职" : row.type == 2 ? "签约" : "全职" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="mini">
              {{ util.global.getLabel("checkStatus", row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="活跃" width="80" align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="row.activeFlag == 1 ? 'success' : 'info'"
              size="mini"
              effect="plain"
            >
              {{ row.activeFlag == 1 ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="levelName"
          label="等级"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="integral"
          label="积分"
          width="80"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="promotionPeople"
          label="推广人"
          width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="身份证" width="120" align="center">
          <template slot-scope="{ row }">
            <div class="img-row">
              <el-image
                class="mini-img"
                :src="getImgUrl(row.identityFrontImage)"
                :preview-src-list="getImgList(row.identityFrontImage)"
              ></el-image>
              <el-image
                class="mini-img"
                :src="getImgUrl(row.identityBackImage)"
                :preview-src-list="getImgList(row.identityBackImage)"
              ></el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="identityNumber"
          label="身份证号"
          width="170"
          align="center"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="经验/证书" width="120" align="center">
          <template slot-scope="{ row }">
            <div class="img-row">
              <el-tooltip content="行业经验" placement="top">
                <el-image
                  class="mini-img"
                  v-if="row.industryExperienceImages"
                  :src="getImgUrl(row.industryExperienceImages)"
                  :preview-src-list="getImgList(row.industryExperienceImages)"
                ></el-image>
              </el-tooltip>
              <el-tooltip content="技能证书" placement="top">
                <el-image
                  class="mini-img"
                  v-if="row.skillCertificateImages"
                  :src="getImgUrl(row.skillCertificateImages)"
                  :preview-src-list="getImgList(row.skillCertificateImages)"
                ></el-image>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="industryExperience"
          label="经验描述"
          width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="serviceAreas"
          label="服务地区"
          width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="serviceTypes"
          label="服务类型"
          width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="servePosition"
          label="服务部位"
          width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="serveSystem"
          label="服务系统"
          width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="详细地址"
          width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          align="center"
        ></el-table-column>

        <el-table-column label="锁定" width="80" align="center" fixed="right">
          <template slot-scope="{ row }">
            <span :style="{ color: row.isLock ? '#F56C6C' : '#909399' }">{{
              row.isLock ? "已锁定" : "正常"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="
                $router.push('/maintenance/worker/workerDetails?id=' + row.id)
              "
              >详情</el-button
            >
            <el-button type="text" size="small" @click="editInit(row)"
              >编辑</el-button
            >

            <el-dropdown trigger="click" @command="handleCommand($event, row)">
              <el-button type="text" size="small" class="more-btn">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="audit" v-if="row.status === 1"
                  >审核</el-dropdown-item
                >
                <el-dropdown-item command="lock">{{
                  row.isLock ? "解锁" : "锁定"
                }}</el-dropdown-item>
                <el-dropdown-item command="team">团队成员</el-dropdown-item>
                <el-dropdown-item command="active">设置活跃</el-dropdown-item>
                <el-dropdown-item command="identity">修改身份</el-dropdown-item>
                <el-dropdown-item command="remark">备注/标签</el-dropdown-item>
                <!-- <el-dropdown-item
                  command="role"
                  v-if="row.identity === '普通师傅' || true"
                  >设置角色</el-dropdown-item
                >
                <el-dropdown-item command="score">分值记录</el-dropdown-item>
                <el-dropdown-item command="integral">添加积分</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryMasterListParams.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryMasterListParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryMasterListTotal"
        ></el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="设置备注标签"
      :visible.sync="remarksDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="closeRemarksDialog"
    >
      <el-form label-width="70px" size="small">
        <el-form-item label="快捷标签" v-if="masterTag && masterTag.length > 0">
          <div class="tag-container">
            <el-tag
              v-for="item in masterTag"
              :key="item"
              class="check-tag"
              :effect="judgeTagSelected(item) ? 'dark' : 'plain'"
              @click="addTag(item)"
              >{{ item }}</el-tag
            >
          </div>
        </el-form-item>
        <el-form-item label="自定义">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入其他备注内容..."
            v-model="handleMasterRemarkParamsCopy.remark"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="预览效果">
          <div class="preview-box">
            {{ masterRemark || "（暂无内容，请选择标签或输入备注）" }}
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="closeRemarksDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="handleMasterRemark"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="设置角色"
      width="400px"
      :visible.sync="chooseRoseDialogShow"
      :close-on-click-modal="false"
      :before-close="closeChooseRoseDialog"
    >
      <div class="role-dialog-content">
        <div class="role-row">
          <label>角色类型：</label>
          <el-radio-group v-model="chooseRoseForm.masterRoleId">
            <el-radio :label="3">签约师傅</el-radio>
            <el-radio :label="1" @change="chooseMasterQuYu">区域经理</el-radio>
          </el-radio-group>
        </div>
        <div
          class="role-row"
          v-if="chooseRoseForm.masterRoleId === 3"
          style="margin-top: 20px"
        >
          <label>区域经理：</label>
          <el-select
            placeholder="请选择上级"
            v-model="chooseRoseForm.superiorMasterUid"
            style="width: 200px"
          >
            <el-option
              v-for="item in regionManagerList"
              :key="item.uid"
              :label="item.realName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="closeChooseRoseDialog">取 消</el-button>
        <el-button type="primary" @click="confirmChooseRose">确 定</el-button>
      </span>
    </el-dialog>

    <model
      ref="editStatusModel"
      title="师傅审核"
      @ok="handleEditStatus"
      @close="resetEditForm"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </model>

    <model
      ref="enterpriseList"
      title="企业审核"
      @ok="handleEnterpriseExamine"
      @close="resetEditForm"
    >
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="审核状态">
          <el-switch v-model="editForm.status"></el-switch>
        </el-form-item>
      </el-form>
    </model>

    <model
      ref="masterTeamList"
      title="师傅团队列表"
      @ok="handleEnterpriseExamine"
      @close="resetEditForm"
      :column="2"
    >
      <el-table
        :data="masterTeamList"
        border
        stripe
        max-height="600"
        style="width: 100%"
      >
        <el-table-column
          prop="realName"
          label="真实姓名"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serviceTypes"
          label="服务范围"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serviceAreas"
          label="服务区域"
          align="center"
        ></el-table-column>
      </el-table>
    </model>

    <EditWorker ref="editWorker" @closeDialog="closeFn"></EditWorker>

    <el-dialog
      :visible.sync="addSigningMasterDialogShow"
      :before-close="closeAddSigningMasterDialog"
      title="入驻签约师傅"
      width="650px"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div class="scroll-form-container">
        <el-form
          :rules="addSigningMasterRules"
          ref="addSigningMasterForm"
          label-position="right"
          :model="addSigningMasterForm"
          label-width="100px"
          size="small"
        >
          <div class="form-section-header">角色设定</div>
          <el-form-item label="入驻类型" prop="masterRoleId">
            <el-radio-group v-model="addSigningMasterForm.masterRoleId">
              <el-radio :label="3" @change="changeMasterRoleId2"
                >签约师傅</el-radio
              >
              <el-radio :label="1" @change="changeMasterRoleId1"
                >区域经理</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="addSigningMasterForm.masterRoleId === 3"
            label="归属经理"
            prop="superiorMasterUid"
          >
            <el-select
              placeholder="请选择区域经理"
              style="width: 100%"
              v-model="addSigningMasterForm.superiorMasterUid"
              @change="changeSuperiorMasterUid"
              filterable
            >
              <el-option
                v-for="item in regionManagerList"
                :key="item.uid"
                :label="item.realName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>

          <div class="form-section-header">基础信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="realName">
                <el-input
                  v-model="addSigningMasterForm.realName"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  v-model="addSigningMasterForm.phone"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="师傅编号">
            <el-input
              v-model="addSigningMasterForm.number"
              placeholder="请输入编号 (可选)"
            ></el-input>
          </el-form-item>

          <el-form-item label="详细地址" prop="address">
            <el-input
              v-model="addSigningMasterForm.address"
              placeholder="请输入居住地址"
            ></el-input>
          </el-form-item>

          <el-form-item label="身份证号" prop="identityNumber">
            <el-input
              v-model="addSigningMasterForm.identityNumber"
              placeholder="请输入身份证号"
            ></el-input>
          </el-form-item>

          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="8">
              <el-form-item
                label="真实头像"
                prop="realPortrait"
                label-width="80px"
              >
                <el-upload
                  list-type="picture-card"
                  :show-file-list="false"
                  :http-request="uploadRealPortrait"
                  class="avatar-uploader-mini"
                >
                  <img
                    v-if="uploadRealPortraitImg"
                    :src="uploadRealPortraitImg"
                    class="avatar"
                  />
                  <div v-else style="padding-top: 25px; text-align: center">
                    <i class="el-icon-plus"></i>
                    <div style="font-size: 12px; line-height: 1.2; color: #999">
                      点击上传
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="身份证正"
                prop="identityFrontImage"
                label-width="80px"
              >
                <el-upload
                  list-type="picture-card"
                  :show-file-list="false"
                  :http-request="uploadIdentityFrontImage"
                  class="avatar-uploader-mini"
                >
                  <img
                    v-if="uploadIdentityFrontImageImg"
                    :src="uploadIdentityFrontImageImg"
                    class="avatar"
                  />
                  <i class="el-icon-plus" v-else></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="身份证反"
                prop="identityBackImage"
                label-width="80px"
              >
                <el-upload
                  list-type="picture-card"
                  :show-file-list="false"
                  :http-request="uploadIdentityBackImage"
                  class="avatar-uploader-mini"
                >
                  <img
                    v-if="uploadIdentityBackImageImg"
                    :src="uploadIdentityBackImageImg"
                    class="avatar"
                  />
                  <i class="el-icon-plus" v-else></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="form-section-header">专业技能</div>

          <el-form-item label="设备类型" prop="serviceTypes">
            <div style="display: flex; gap: 10px">
              <el-select
                v-model="equipmentTypeOne"
                placeholder="一级类型"
                @change="changeEquipmentTypeOne"
                style="width: 140px"
              >
                <el-option
                  v-for="item in equipmentTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                placeholder="二级类型 (可多选)"
                multiple
                collapse-tags
                v-model="equipmentTypeTwo"
                @change="changeEquipmentTypeTwo"
                style="flex: 1"
              >
                <el-option
                  v-for="item in equipmentTypeTwoList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="设备系统" prop="serveSystem">
            <div style="display: flex; gap: 10px">
              <el-select
                v-model="equipmentSystemOne"
                placeholder="一级系统"
                @change="changeEquipmentSystemOne"
                style="width: 140px"
              >
                <el-option
                  v-for="item in equipmentSystemList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                placeholder="二级系统 (可多选)"
                multiple
                collapse-tags
                v-model="equipmentSystemTwo"
                @change="changeEquipmentSystemTwo"
                style="flex: 1"
              >
                <el-option
                  v-for="item in equipmentSystemTwoList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="服务部位" prop="servePosition">
            <el-select
              style="width: 100%"
              v-model="serviceArea"
              placeholder="请选择服务部位 (可多选)"
              multiple
              collapse-tags
              @change="changeServiceArea"
            >
              <el-option
                v-for="item in devicePositionList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="addSigningMasterForm.masterRoleId === 1"
            label="服务区域"
            prop="serviceAreas"
          >
            <div style="display: flex; gap: 10px">
              <el-select
                placeholder="省"
                v-model="provinceValue"
                @change="changeProvinceValue"
                style="width: 30%"
              >
                <el-option
                  v-for="item in provinceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                placeholder="市"
                v-model="cityValue"
                @change="changeCityValue"
                style="width: 30%"
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                placeholder="区 (多选)"
                v-model="districtValue"
                multiple
                collapse-tags
                @change="changeDistrictValue"
                style="width: 40%"
              >
                <el-option
                  v-for="item in districtList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="行业经验" prop="industryExperience">
            <el-input
              type="textarea"
              :rows="2"
              v-model="addSigningMasterForm.industryExperience"
              placeholder="请简述行业经验..."
            ></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="行业照片">
                <el-upload
                  ref="uploadIndustryPicRef"
                  list-type="picture-card"
                  :http-request="uploadIndustryPic"
                  :on-remove="delIndustryPic"
                  class="avatar-uploader-mini"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="技能证书">
                <el-upload
                  ref="uploadSkillCertificatePicRef"
                  list-type="picture-card"
                  :http-request="uploadSkillCertificatePic"
                  :on-remove="delSkillCertificatePic"
                  class="avatar-uploader-mini"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer">
        <el-button size="small" @click="closeAddSigningMasterDialog"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirmAddSigningMaster"
          >立即入驻</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="添加积分"
      :visible.sync="integral_dialogVisible"
      width="400px"
      :before-close="integral_handleClose"
      :close-on-click-modal="false"
    >
      <el-form label-width="90px">
        <el-form-item label="积分类型">
          <el-select v-model="integralFrom.type" style="width: 100%">
            <el-option
              v-for="item in masterIntegralList"
              :key="item.type"
              :label="item.text"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" v-if="integralFrom.type < 8">
          <el-input
            placeholder="请填写订单编号"
            v-model="integralFrom.relationOrderSn"
          ></el-input>
        </el-form-item>
        <el-form-item label="分值" v-else>
          <el-input
            placeholder="请填写分值"
            v-model.number="integralFrom.value"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            placeholder="请填写备注"
            v-model="integralFrom.remarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="integral_handleClose">取 消</el-button>
        <el-button type="primary" @click="addIntegralConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分值记录"
      :visible.sync="score_dialogVisible"
      width="550px"
      :before-close="score_handleClose"
    >
      <div class="score-table-wrapper">
        <el-table
          :data="scoreList"
          border
          stripe
          height="300"
          :header-cell-style="{ background: '#fafafa', color: '#606266' }"
        >
          <el-table-column
            label="时间"
            align="center"
            prop="createTime"
            width="160"
          ></el-table-column>
          <el-table-column
            label="关联单号"
            align="center"
            prop="relationOrderSn"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">{{
              row.relationOrderSn || "-"
            }}</template>
          </el-table-column>
          <el-table-column
            label="变动备注"
            align="center"
            prop="remarks"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">{{ row.remarks || "-" }}</template>
          </el-table-column>
          <el-table-column label="分值" align="center" prop="value" width="80">
            <template slot-scope="{ row }">
              <span
                :class="
                  row.value > 0 ? 'score-value-plus' : 'score-value-minus'
                "
              >
                {{ row.value > 0 ? "+" + row.value : row.value }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="mt-20 text-center">
        <el-pagination
          layout="prev, pager, next"
          background
          :total="scoreListTotal"
          @current-change="scoreCurrentChange"
          :page-size="scoreForm.pageSize"
        ></el-pagination>
      </div>
    </el-dialog>

    <el-dialog
      title="设置活跃状态"
      :visible.sync="setActiveDialog"
      width="420px"
      center
      :before-close="closeSetActiveDialog"
    >
      <div class="mt-20">
        <el-form label-width="0">
          <el-form-item>
            <div class="radio-card-group">
              <el-radio-group v-model="setActiveParmas.flag">
                <el-radio :label="1" style="margin-right: 8px"
                  >设为活跃</el-radio
                >
                <el-radio :label="0">取消活跃</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button size="small" @click="closeSetActiveDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmSetActive"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <model
      ref="editStatusModel"
      title="师傅审核"
      @ok="handleEditStatus"
      @close="resetEditForm"
    >
      <div class="text-center mt-20">
        <div class="radio-card-group">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">驳回申请</el-radio>
          </el-radio-group>
        </div>
      </div>
    </model>

    <el-dialog
      title="设置角色"
      width="450px"
      :visible.sync="chooseRoseDialogShow"
      :close-on-click-modal="false"
      :before-close="closeChooseRoseDialog"
    >
      <el-form label-position="top" size="small">
        <el-form-item label="选择角色类型">
          <div class="radio-card-group" style="justify-content: flex-start">
            <el-radio-group v-model="chooseRoseForm.masterRoleId">
              <el-radio :label="3" style="margin-right: 8px">签约师傅</el-radio>
              <el-radio :label="1" @change="chooseMasterQuYu"
                >区域经理</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item
          label="关联区域经理"
          v-if="chooseRoseForm.masterRoleId === 3"
        >
          <el-select
            placeholder="请选择上级经理"
            v-model="chooseRoseForm.superiorMasterUid"
            class="w-100"
            filterable
          >
            <el-option
              v-for="item in regionManagerList"
              :key="item.uid"
              :label="item.realName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="closeChooseRoseDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmChooseRose"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="设置师傅身份"
      :visible.sync="setWorkerIdDialog"
      width="400px"
      center
      :before-close="closeEditWorkerIdDialog"
    >
      <div style="text-align: center; padding: 20px">
        <span style="margin-right: 20px">选择身份:</span>
        <el-radio-group v-model="submitSetWorkerIdParams.type">
          <el-radio :label="1">兼职</el-radio>
          <el-radio :label="2">签约</el-radio>
          <el-radio :label="3">全职</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer">
        <el-button @click="closeEditWorkerIdDialog">取 消</el-button>
        <el-button type="primary" @click="confirmEditWorkerId">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { UploadImg, addressFn, getSysLabel } from "@/api/system";
import EditWorker from "./components/editWorker.vue";
import tableMixin from "@/mixin/table";
import { getMasterList } from "@/api/user.js";
import {
  handleMasterInfoExport,
  queryMasterMemberList,
  getMasterInfo,
  queryMasterName,
  queryDeviceTypeList,
  queryDeviceSystemList,
  queryDevicePositionList,
  editMasterInfo,
  handleMasterIdentity,
  handleMasterIntegral,
  queryMasterIntegralList,
  handleActiveMaster,
  handleMasterType,
  handleMasterRemark,
  testExport,
} from "@/api/order.js";

// 确保你已经安装并使用了这个JSON，如果没有请改为API获取或保持原有引入方式
import cityAddressData from "../../../utils/city-address.json";

export default {
  title: "course",
  mixins: [tableMixin],
  components: { EditWorker },
  data() {
    return {
      serviceAreasProps: {
        checkStrictly: false,
        emitPath: false,
        value: "id",
        label: "name",
        children: "child",
      },
      serviceAreasList: cityAddressData,
      remarksDialogVisible: false,
      handleMasterRemarkParamsCopy: {
        labelList: [],
        remark: null,
      },
      chooseMasterId: null,
      masterTag: [],

      setWorkerIdDialog: false,
      submitSetWorkerIdParams: {
        uid: null,
        type: null,
      },

      setActiveParmas: {
        uid: "",
        flag: "",
      },
      setActiveDialog: false,
      scoreListTotal: 0,
      scoreList: [],
      masterIntegralList: [
        { type: 4, text: "主动提交维修单", value: 30 },
        { type: 5, text: "介绍客户签约机床管家", value: 30 },
        { type: 6, text: "拒单", value: -1 },
        { type: 7, text: "同一故障返修", value: -2 },
        { type: 8, text: "验机", value: 0 },
        { type: 9, text: "保养", value: 0 },
      ],
      integralFrom: {
        uid: "",
        relationOrderSn: "",
        type: "",
        remarks: "",
        value: "",
      },
      score_dialogVisible: false,
      scoreForm: {
        uid: "",
        pageNo: 1,
        pageSize: 5,
      },
      integral_dialogVisible: false,
      chooseRoseForm: {
        masterRoleId: 3,
        superiorMasterUid: "",
        uid: "",
      },
      chooseRoseDialogShow: false,
      regionManagerList: [],
      addSigningMasterRules: {
        phone: [{ required: true, message: "请填写手机号码", trigger: "blur" }],
        masterRoleId: [
          { required: true, message: "请选择类型", trigger: "blur" },
        ],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        identityNumber: [
          { required: true, message: "请输入身份证号码", trigger: "blur" },
        ],
        industryExperience: [
          { required: true, message: "请输入行业经验", trigger: "blur" },
        ],
        realPortrait: [
          { required: true, message: "请上传真实头像", trigger: "blur" },
        ],
        identityBackImage: [
          { required: true, message: "请上传身份证反面照", trigger: "blur" },
        ],
        identityFrontImage: [
          { required: true, message: "请上传身份证正面照", trigger: "blur" },
        ],
        serviceTypes: [
          { required: true, message: "请选择设备类型", trigger: "blur" },
        ],
        serveSystem: [
          { required: true, message: "请输入设备系统", trigger: "blur" },
        ],
        servePosition: [
          { required: true, message: "请输入服务部位", trigger: "blur" },
        ],
        superiorMasterUid: [
          { required: true, message: "请选择区域经理", trigger: "blur" },
        ],
      },
      skillCertificateImagesUid: [],
      industryExperienceImagesUid: [],

      provinceList: [], //省列表
      provinceValue: null,

      cityList: [], //市列表
      cityValue: null,

      districtList: [], //区列表
      districtValue: [],

      devicePositionList: [], //服务部位列表
      serviceArea: [], //服务部位的值

      equipmentSystemOne: null, //设备系统的值
      equipmentSystemTwo: [], //设备系统的值
      equipmentSystemList: [], //设备系统第一层
      equipmentSystemTwoList: [], //设备系统第二层
      equipmentSystemList1: [], //进口系统第二层
      equipmentSystemList2: [], //国产系统第二层

      equipmentTypeOne: null, //设备类型的值
      equipmentTypeTwo: [], //设备类型的值
      equipmentTypeList: [], //设备类型第一层
      equipmentTypeTwoList: [], //设备类型第二层
      equipmentTypeList1: [], //数控车床第二层
      equipmentTypeList2: [], //加工中心第二层
      equipmentTypeList3: [], //走心机第三层

      uploadIdentityFrontImageImg: null, //身份证正面
      uploadIdentityBackImageImg: null, //身份证反面
      uploadRealPortraitImg: null, //真实头像
      addSigningMasterForm: {
        masterRoleId: 3,
        realName: null,
        address: null,
        identityNumber: null,
        industryExperience: null,
        realPortrait: null,
        identityBackImage: null,
        identityFrontImage: null,
        serviceTypes: null,
        serveSystem: null,
        servePosition: null,
        serviceAreas: null,
        industryExperienceImages: [],
        skillCertificateImages: [],
        phone: null,
        number: null,
        superiorMasterUid: null,
      },
      addSigningMasterDialogShow: false, //新增签约师傅弹框
      params: null,

      status: null,

      referrerOptions: [],

      masterTeamList: [],
      queryMasterListTotal: 0,
      masterList: [],

      colonelName: null, //团长名字
      referrerName: null, //推荐人名字
      queryTimeCopy: null, //存储时间数组
      queryMasterListParams: {
        pageNo: 1,
        pageSize: 10,
        realName: null,
        status: null,
        superiorMasterUid: null,
        recommendMasterUid: null,
        queryTime: null,
        areaId: null,
      },

      loading: false,
      queryMethod: "get",
      typeData: [],
      systemData: [],
      courseList: [],
      courseDistriList: [],
      url: {
        query: "/admin/maintenance/queryMasterList",
        queryType: "/admin/maintenance/queryDeviceTypeList",
        queryAddress: "/admin/base/address",
        edit: "/admin/maintenance/editMasterInfo",
        lock: "/admin/maintenance/handleMasterLock",
        updateStatus: "/admin/maintenance/handleMasterExamine",
      },
      rules: {
        worker: [{ required: true, message: "请输入接单人", trigger: "blur" }],
        workerPhone: [
          { required: true, message: "请输入接单人手机", trigger: "blur" },
        ],
      },
      editForm: {
        id: null,
        status: null,
      },
      finishForm: {
        payAmount: 0,
      },
    };
  },

  computed: {
    masterRemark() {
      const { labelList, remark } = this.handleMasterRemarkParamsCopy;
      const parts = [...labelList];
      if (remark) {
        parts.push(remark);
      }
      return parts.join(";");
    },
  },

  async created() {
    // 并发请求基础数据
    await Promise.all([
      this.getQueryDeviceTypeList(),
      this.getQueryDeviceSystemList(),
      this.getQueryDevicePositionList(),
      this.getAddressFn(),
      this.getMasterRoleList(),
      this.getSysLabel(),
    ]);
    this._getMasterList();
  },

  methods: {
    // ----------------- 辅助方法 -----------------
    getImgUrl(str) {
      return str ? str.split(",")[0] : "";
    },
    getImgList(str) {
      return str ? str.split(",") : [];
    },
    isVerified(str) {
      return str && (str.includes("V") || str.includes("v"));
    },
    getIdentityTag(type) {
      const map = { 1: "info", 2: "warning", 3: "success" };
      return map[type] || "";
    },
    getStatusTag(status) {
      // 1审核中 2通过 3驳回
      const map = { 1: "warning", 2: "success", 3: "danger" };
      return map[status] || "info";
    },

    // ----------------- 业务逻辑 -----------------

    // 统一处理Dropdown操作
    handleCommand(command, row) {
      switch (command) {
        case "audit":
          this.open(row);
          break;
        case "lock":
          this.isLock(row);
          break;
        case "team":
          this.checkTeam(row);
          break;
        case "active":
          this.openSetActiveDialog(row.uid, row.activeFlag);
          break;
        case "identity":
          this.openEditWorkerIdDialog(row);
          break;
        case "remark":
          this.openRemarksDialog(row);
          break;
        case "role":
          this.openChooseRoseDialog(row.uid);
          break;
        case "score":
          this.open_score_dialog(row.uid);
          break;
        case "integral":
          this.open_integral_dialog(row.uid);
          break;
      }
    },

    //测试
    testExport() {
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      const data = { ...this.queryMasterListParams };
      data.pageSize = 1000;
      testExport(data).then((res) => {
        if (res) {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.download = "师傅列表.xls";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          loading.close();
        }
      });
    },
    // 确定师傅备注
    async handleMasterRemark() {
      let params = {
        id: this.chooseMasterId,
        remark: this.masterRemark,
      };
      const res = await handleMasterRemark(params);
      if (res.code == "000") {
        this.$message.success(res.message);
        this.closeRemarksDialog();
        this._getMasterList();
      }
    },
    // 关闭备注弹窗
    closeRemarksDialog() {
      this.handleMasterRemarkParamsCopy = {
        labelList: [],
        remark: null,
      };
      this.chooseMasterId = null;
      this.remarksDialogVisible = false;
    },
    // 判断是否被选中
    judgeTagSelected(tag) {
      return this.handleMasterRemarkParamsCopy.labelList.includes(tag);
    },
    // 点击标签
    addTag(tag) {
      const list = this.handleMasterRemarkParamsCopy.labelList;
      const index = list.indexOf(tag);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(tag);
      }
    },
    // 打开备注弹框
    openRemarksDialog(row) {
      if (row.remark) {
        let arr = row.remark.split(";");
        arr.forEach((item) => {
          if (this.masterTag.includes(item)) {
            this.handleMasterRemarkParamsCopy.labelList.push(item);
          } else {
            this.handleMasterRemarkParamsCopy.remark = item;
          }
        });
      }
      this.chooseMasterId = row.id;
      this.remarksDialogVisible = true;
    },
    // 获取师傅标签
    async getSysLabel() {
      const res = await getSysLabel("masterTag");
      if (res.code == "000" && res.data) {
        this.masterTag = res.data.split(",");
      }
    },
    // 确定更改师傅身份
    async confirmEditWorkerId() {
      const res = await handleMasterType(this.submitSetWorkerIdParams);
      if (res.code == "000") {
        this.$message.success(res.message);
        this._getMasterList();
        this.closeEditWorkerIdDialog();
      }
    },
    // 关闭更改师傅身份框
    closeEditWorkerIdDialog() {
      this.submitSetWorkerIdParams = { uid: null, type: null };
      this.setWorkerIdDialog = false;
    },
    // 打开更改师傅身份框
    openEditWorkerIdDialog(row) {
      this.submitSetWorkerIdParams.uid = row.uid;
      this.submitSetWorkerIdParams.type = row.type;
      this.setWorkerIdDialog = true;
    },

    // 切换创建时间
    changeQueryTimeCopy(val) {
      if (val && val.length > 0) {
        this.queryMasterListParams.queryTime = val[0] + "~" + val[1];
      } else {
        this.queryMasterListParams.queryTime = null;
      }
      this._getMasterList(1);
    },
    // 确定设置活跃师傅
    async confirmSetActive() {
      const res = await handleActiveMaster(this.setActiveParmas);
      if (res.message == "操作成功") {
        this.$message.success("操作成功");
        this.closeSetActiveDialog();
        this._getMasterList();
      }
    },
    // 关闭活跃师傅框
    closeSetActiveDialog() {
      this.setActiveDialog = false;
      this.setActiveParmas = { uid: "", flag: "" };
    },
    // 打开活跃师傅框
    openSetActiveDialog(uid, flag) {
      this.setActiveDialog = true;
      this.setActiveParmas.uid = uid;
      this.setActiveParmas.flag = flag;
    },
    // 改变分值列表页面触发
    async scoreCurrentChange(page) {
      this.scoreForm.pageNo = page;
      const res = await queryMasterIntegralList(this.scoreForm);
      this.scoreList = res.data.records;
      this.scoreListTotal = res.data.total;
    },
    // 确定师傅积分选择
    async addIntegralConfirm() {
      if (!this.integralFrom.remarks) {
        this.integralFrom.remarks =
          this.masterIntegralList[this.integralFrom.type - 4].text;
      }
      if (this.integralFrom.type < 8) {
        if (
          this.integralFrom.relationOrderSn === "" ||
          this.integralFrom.type === ""
        ) {
          this.$message.warning("订单编号和积分类型都是必填的......");
          return;
        }
        let value = this.masterIntegralList[this.integralFrom.type - 4].value;
        this.integralFrom.value = value;
      }
      const res = await handleMasterIntegral(this.integralFrom);
      if (res.message === "操作成功") {
        this.$message.success("操作成功");
        this.integral_handleClose();
        this._getMasterList();
      }
    },
    // 打开分值框
    async open_score_dialog(uid) {
      this.scoreForm.uid = uid;
      const res = await queryMasterIntegralList(this.scoreForm);
      this.scoreList = res.data.records;
      this.scoreListTotal = res.data.total;
      this.score_dialogVisible = true;
    },
    // 关闭分值框
    score_handleClose() {
      this.scoreForm = { uid: "", pageNo: 1, pageSize: 5 };
      this.score_dialogVisible = false;
    },
    // 关闭积分框
    integral_handleClose() {
      this.integralFrom = { uid: "", relationOrderSn: "", type: "" };
      this.integral_dialogVisible = false;
    },
    // 打开积分框
    open_integral_dialog(uid) {
      this.integralFrom.uid = uid;
      this.integral_dialogVisible = true;
    },
    // 确定设置师傅角色
    async confirmChooseRose() {
      if (
        this.chooseRoseForm.masterRoleId === 3 &&
        !this.chooseRoseForm.superiorMasterUid
      ) {
        this.$message.warning("区域经理不能为空");
        return;
      } else {
        const res = await handleMasterIdentity(this.chooseRoseForm);
        if (res.code === "000") {
          this.$message.success("设置成功");
          this.closeChooseRoseDialog();
          this._getMasterList();
        }
      }
    },
    // 点击区域经理
    chooseMasterQuYu() {
      this.chooseRoseForm.superiorMasterUid = null;
    },
    // 关闭设置师傅角色框
    closeChooseRoseDialog() {
      this.chooseRoseForm = { masterRoleId: 3, superiorMasterUid: "", uid: "" };
      this.chooseRoseDialogShow = false;
    },
    // 打开设置师傅角色框
    openChooseRoseDialog(uid) {
      this.chooseRoseForm.uid = uid;
      this.chooseRoseDialogShow = true;
    },
    // 区域经理的值变化
    changeSuperiorMasterUid() {
      this.$refs.addSigningMasterForm.validateField("superiorMasterUid");
    },
    // 查询区域经理列表
    async getMasterRoleList() {
      const res = await getMasterList({
        type: 2,
        masterRoleId: 1,
        pageSize: 1000,
      });
      this.regionManagerList = res.data.records;
    },
    // 点击区域经理触发
    changeMasterRoleId1() {
      this.addSigningMasterRules.serviceAreas = [
        { required: true, message: "请输入服务区域", trigger: "blur" },
      ];
      delete this.addSigningMasterRules.superiorMasterUid;
    },
    // 点击签约师傅触发
    changeMasterRoleId2() {
      delete this.addSigningMasterRules.serviceAreas;
      this.addSigningMasterRules.superiorMasterUid = [
        { required: true, message: "请输入服务区域", trigger: "blur" },
      ];
    },
    // 服务区域的值变化触发
    changeDistrictValue() {
      this.addSigningMasterForm.serviceAreas = this.districtValue.toString();
      this.$refs.addSigningMasterForm.validateField("serviceAreas");
    },
    // 设备类型的值变化触发
    changeEquipmentTypeTwo() {
      this.addSigningMasterForm.serviceTypes = this.equipmentTypeTwo.toString();
      this.$refs.addSigningMasterForm.validateField("serviceTypes");
    },
    // 设备系统的值变化触发
    changeEquipmentSystemTwo() {
      this.addSigningMasterForm.serveSystem =
        this.equipmentSystemTwo.toString();
      this.$refs.addSigningMasterForm.validateField("serveSystem");
    },
    // 服务部位的值变化触发
    changeServiceArea() {
      this.addSigningMasterForm.servePosition = this.serviceArea.toString();
      this.$refs.addSigningMasterForm.validateField("servePosition");
    },
    // 确定签约师傅
    async confirmAddSigningMaster() {
      await this.$refs.addSigningMasterForm.validate();
      this.addSigningMasterForm.type = 2;
      if (this.addSigningMasterForm.industryExperienceImages) {
        this.addSigningMasterForm.industryExperienceImages =
          this.addSigningMasterForm.industryExperienceImages.toString();
      }
      if (this.addSigningMasterForm.skillCertificateImages) {
        this.addSigningMasterForm.skillCertificateImages =
          this.addSigningMasterForm.skillCertificateImages.toString();
      }
      const res = await editMasterInfo(this.addSigningMasterForm);
      if (res.message === "操作成功") {
        this.closeAddSigningMasterDialog();
        this._getMasterList();
      }
    },
    // 删除技能证书
    delSkillCertificatePic(file) {
      const index = this.skillCertificateImagesUid.indexOf(file.uid);
      this.skillCertificateImagesUid.splice(index, 1);
      this.addSigningMasterForm.skillCertificateImages.splice(index, 1);
    },
    // 上传技能证书
    async uploadSkillCertificatePic(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      this.skillCertificateImagesUid.push(fileData.file.uid);
      this.addSigningMasterForm.skillCertificateImages.push(res.data);
    },
    // 删除行业照片
    delIndustryPic(file) {
      const index = this.industryExperienceImagesUid.indexOf(file.uid);
      this.industryExperienceImagesUid.splice(index, 1);
      this.addSigningMasterForm.industryExperienceImages.splice(index, 1);
    },
    // 上传行业照片
    async uploadIndustryPic(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      this.industryExperienceImagesUid.push(fileData.file.uid);
      this.addSigningMasterForm.industryExperienceImages.push(res.data);
    },
    // 市变化
    async changeCityValue() {
      const res = await addressFn(this.cityValue);
      this.districtList = res.data;
    },
    // 省变化
    async changeProvinceValue() {
      const res = await addressFn(this.provinceValue);
      this.cityList = res.data;
    },
    // 获取地区
    async getAddressFn() {
      const res = await addressFn();
      this.provinceList = res.data;
    },
    // 获取服务地区
    async getQueryDevicePositionList() {
      const res = await queryDevicePositionList();
      this.devicePositionList = res.data;
    },
    // 改变第一层设备系统
    changeEquipmentSystemOne() {
      if (this.equipmentSystemOne === 1) {
        this.equipmentSystemTwoList = this.equipmentSystemList1;
      } else {
        this.equipmentSystemTwoList = this.equipmentSystemList2;
      }
    },
    // 获取设备系统
    async getQueryDeviceSystemList() {
      const { data } = await queryDeviceSystemList();
      this.equipmentSystemList = data;
      this.equipmentSystemList1 = data[0].list;
      this.equipmentSystemList2 = data[1].list;
    },
    // 改变第一层设备类型
    changeEquipmentTypeOne() {
      if (this.equipmentTypeOne === 1) {
        this.equipmentTypeTwoList = this.equipmentTypeList1;
      } else if (this.equipmentTypeOne === 2) {
        this.equipmentTypeTwoList = this.equipmentTypeList2;
      } else {
        this.equipmentTypeTwoList = this.equipmentTypeList3;
      }
    },
    // 获取设备类型
    async getQueryDeviceTypeList() {
      const { data } = await queryDeviceTypeList();
      this.equipmentTypeList = data;
      this.equipmentTypeList1 = data[0].list;
      this.equipmentTypeList2 = data[1].list;
      // this.equipmentTypeList3 = data[2].list;
    },
    // 上传身份证正面照
    async uploadIdentityFrontImage(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res.message) {
        this.uploadIdentityFrontImageImg = res.data;
        this.addSigningMasterForm.identityFrontImage = res.data;
        this.$refs.addSigningMasterForm.validateField("identityFrontImage");
      }
    },
    // 上传身份证反面照
    async uploadIdentityBackImage(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res.message) {
        this.uploadIdentityBackImageImg = res.data;
        this.addSigningMasterForm.identityBackImage = res.data;
        this.$refs.addSigningMasterForm.validateField("identityBackImage");
      }
    },
    // 上传真实头像
    async uploadRealPortrait(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res.message) {
        this.uploadRealPortraitImg = res.data;
        this.addSigningMasterForm.realPortrait = res.data;
        this.$refs.addSigningMasterForm.validateField("realPortrait");
      }
    },
    // 关闭新增签约师傅弹窗
    async closeAddSigningMasterDialog() {
      this.addSigningMasterForm = {
        type: 2,
        realName: null,
        address: null,
        identityNumber: null,
        industryExperience: null,
        realPortrait: null,
        identityBackImage: null,
        identityFrontImage: null,
        serviceTypes: null,
        serveSystem: null,
        servePosition: null,
        serviceAreas: null,
        industryExperienceImages: [],
        skillCertificateImages: [],
      };
      this.uploadRealPortraitImg = null;
      this.uploadIdentityFrontImageImg = null;
      this.uploadIdentityBackImageImg = null;
      this.equipmentSystemOne = null;
      this.equipmentSystemTwo = [];
      this.equipmentTypeOne = null;
      this.equipmentTypeTwo = [];
      this.serviceArea = [];
      this.provinceValue = null;
      this.cityValue = null;
      this.districtValue = [];
      this.$refs.uploadIndustryPicRef.clearFiles();
      this.$refs.uploadSkillCertificatePicRef.clearFiles();
      this.skillCertificateImagesUid = [];
      this.industryExperienceImagesUid = [];
      this.addSigningMasterDialogShow = false;
      this.$refs.addSigningMasterForm.resetFields();
    },
    // 打开新增签约师傅弹窗
    addSigningMaster() {
      this.addSigningMasterDialogShow = true;
    },
    // 重置按钮
    resetFn() {
      this.colonelName = null;
      this.referrerName = null;
      this.queryTimeCopy = null;
      this.queryMasterListParams = {
        pageNo: 1,
        pageSize: 10,
        realName: null,
        status: null,
        superiorMasterUid: null,
        recommendMasterUid: null,
        queryTime: null,
        areaId: null,
      };
      this._getMasterList();
    },
    // 搜索推荐人/团长
    async remoteMethod(query) {
      const res = await queryMasterName(query);
      this.referrerOptions = res.data;
    },
    handleEnterpriseExamine() {},

    // 导出师傅
    async _handleMasterInfoExport() {
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      const data = { ...this.queryMasterListParams };
      data.pageSize = 1000;
      handleMasterInfoExport(data).then((res) => {
        if (res) {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.download = "师傅列表.xls";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          loading.close();
        }
      });
    },

    // 点击查看成员触发的事件
    async checkTeam(row) {
      await this._queryMasterMemberList(row);
      this.$refs.masterTeamList.open();
    },
    _queryMasterMemberList(row) {
      let data = {
        uid: row.uid,
        pageNo: 1,
        pageSize: 10,
      };
      queryMasterMemberList(data).then((res) => {
        if (res) {
          this.masterTeamList = res.data.records;
        }
      });
    },
    // 切换页码触发的事件
    handleCurrentChange(page) {
      this.queryMasterListParams.pageNo = page;
      this._getMasterList();
    },
    handleSizeChange(val) {
      this.queryMasterListParams.pageSize = val;
      this.queryMasterListParams.pageNo = 1;
      this._getMasterList();
    },
    // 查询师傅列表
    async _getMasterList(id) {
      this.loading = true;
      // id=1 说明是重置或新查询
      if (id === 1) {
        this.queryMasterListParams.pageNo = 1;
      }

      // 将团长推荐人名字 转化成 uid
      if (this.referrerName) {
        const res = await queryMasterName(this.referrerName);
        this.queryMasterListParams.recommendMasterUid =
          res.data[0] && res.data[0].uid;
      }
      if (this.colonelName) {
        const res = await queryMasterName(this.colonelName);
        this.queryMasterListParams.superiorMasterUid =
          res.data[0] && res.data[0].uid;
      }

      try {
        const res = await getMasterList(this.queryMasterListParams);
        if (res.message === "操作成功") {
          this.masterList = res.data.records;
          this.queryMasterListTotal = res.data.total;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    querySelectData() {
      this.loading = true;
      this.$axios
        .post(this.url.queryType)
        .then(({ data }) => {
          this.typeData = data;
        })
        .catch(function (error) {
          console.info(error);
        });
      this.loading = false;
    },
    isLock(row) {
      this.$confirm(`确定要${row.isLock ? "解锁" : "锁定"}该师傅吗?`, "提示", {
        type: "warning",
      }).then(() => {
        this.$axios
          .post(this.url.lock, {
            id: row.id,
            lock: Number(!row.isLock),
          })
          .then(async ({ code, message }) => {
            await this.util.message(this, code, message);
            this._getMasterList();
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
    open(row) {
      this.$refs.editStatusModel.open();
      this.editForm = {
        id: row.id,
        status: 2, // 默认为通过
      };
    },
    handleEditStatus(fn) {
      this.$axios
        .post(this.url.updateStatus, {
          ...this.editForm,
          status: this.editForm.status,
        })
        .then((data) => {
          this.util.message(this, data.status, data.message);
          this._getMasterList();
          this.resetEditForm(false);
        })
        .catch(function (error) {
          console.info(error);
        });

      this.$refs.editStatusModel.close();
    },
    // 关闭编辑弹窗事件
    closeFn() {
      this._getMasterList();
    },
    // 点击编辑触发的事件
    async editInit(row) {
      const loading = this.$loading();
      const res = await getMasterInfo(row.id);
      if (res.code == "000") {
        this.$refs.editWorker.openEditworkerDialog(res.data);
      }
      loading.close();
    },
    async handleEdit(fn) {
      this.edit(fn, {
        serviceAreas: this.editForm.serviceAreas.join(","),
        serviceTypes: this.editForm.serviceTypes.join(","),
        realPortrait: (await this.$refs.realPortrait.uploadFile()).join(","),
        industryExperienceImages: (
          await this.$refs.industryExperienceImages.uploadFile()
        ).join(","),
        skillCertificateImages: (
          await this.$refs.skillCertificateImages.uploadFile()
        ).join(","),
        identityFrontImage: (
          await this.$refs.identityFrontImage.uploadFile()
        ).join(","),
        identityBackImage: (
          await this.$refs.identityBackImage.uploadFile()
        ).join(","),
      });
    },
    resetEditForm(fn) {
      this.masterTeamList = null;
      if (fn) fn(false);
    },
  },
};
</script>

<style lang="less" scoped>
// 全局覆盖
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}

.app-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

// 搜索栏样式
.search-wrapper {
  margin-bottom: 15px;
  .search-btns {
    float: right;
  }
}

// 表格样式
.table-wrapper {
  .user-cell {
    display: flex;
    align-items: center;
    .avatar-box {
      position: relative;
      width: 50px;
      height: 50px;
      margin-right: 12px;
      .avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
      .v-badge {
        position: absolute;
        width: 18px;
        height: 18px;
        bottom: -5px;
        right: -5px;
        z-index: 2;
      }
    }
    .info-box {
      display: flex;
      flex-direction: column;
      .name {
        font-weight: bold;
        color: #333;
        margin-bottom: 2px;
      }
      .phone {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .img-row {
    display: flex;
    justify-content: center;
    gap: 4px;
    .mini-img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #eee;
    }
  }

  .more-btn {
    color: #606266;
    margin-left: 10px;
    &:hover {
      color: #409eff;
    }
  }
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

// 弹窗样式
.tag-group {
  display: flex;
  flex-wrap: wrap;
}

.avatar-uploader-mini .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.avatar-uploader-mini .el-upload:hover {
  border-color: #409eff;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}

/* --- 全局弹窗美化 (Deep Selectors) --- */
::v-deep .el-dialog {
  border-radius: 8px; /* 圆角更柔和 */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .el-dialog__header {
    background: #f8f9fa; /* 浅灰背景区分头部 */
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
    .el-dialog__title {
      font-weight: 600;
      color: #303133;
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 18px;
    }
  }

  .el-dialog__body {
    padding: 25px 25px 10px; /* 增加内部呼吸感 */
  }

  .el-dialog__footer {
    padding: 15px 20px;
    border-top: 1px solid #ebeef5;
    background: #fff;
    text-align: right;
  }
}

/* --- 1. 卡片式单选组 (用于身份、活跃、审核等简单选择) --- */
.radio-card-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  width: 100%;

  ::v-deep .el-radio {
    margin-right: 0;
    width: 100px; /* 固定宽度，整齐 */
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: all 0.3s;
    padding: 0;

    /* 隐藏原生的小圆点，纯文字按钮样式 */
    .el-radio__input {
      display: none;
    }
    .el-radio__label {
      padding: 0;
      font-size: 14px;
    }

    /* 选中状态 */
    &.is-checked {
      border-color: #409eff;
      background-color: #ecf5ff;
      color: #409eff;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    }

    &:hover {
      border-color: #c6e2ff;
      color: #409eff;
    }
  }
}

/* --- 2. 备注/标签弹窗优化 --- */
.tag-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  min-height: 40px;
  background: #fafafa;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .check-tag {
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-1px);
    }

    /* 未选中态 - 使用Element plain样式 */
    &.is-plain {
      background-color: #fff;
      border-color: #dcdfe6;
      color: #606266;
    }
  }
}
.preview-box {
  background: #f4f4f5;
  padding: 10px;
  border-radius: 4px;
  color: #606266;
  font-size: 13px;
  line-height: 1.4;
  min-height: 36px;
}

/* --- 3. 长表单容器 (新增签约师傅) --- */
.scroll-form-container {
  height: 60vh;
  overflow-y: auto;
  padding: 0 15px 15px 5px; /* 右侧留白给滚动条 */

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .form-section-header {
    font-size: 15px;
    font-weight: bold;
    color: #303133;
    margin: 10px 0 15px 0;
    padding-left: 10px;
    border-left: 3px solid #409eff;
    background: #fcfcfc;
    line-height: 2;
  }
}

/* --- 4. 上传组件微调 --- */
.avatar-uploader-mini ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  line-height: 100px;
  transition: 0.3s;

  &:hover {
    border-color: #409eff;
    background-color: #f9faff;
  }

  i {
    font-size: 24px;
    color: #8c939d;
  }
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* --- 5. 分值记录表格 --- */
.score-table-wrapper {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}
.score-value-plus {
  color: #67c23a;
  font-weight: bold;
}
.score-value-minus {
  color: #f56c6c;
  font-weight: bold;
}

/* 基础样式复用 */
.w-100 {
  width: 100%;
}
.mt-20 {
  margin-top: 20px;
}
.text-center {
  text-align: center;
}
</style>