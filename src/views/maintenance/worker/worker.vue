<!--编程订单-->
<template>
  <div class="app-container">
    <el-form label-width="88px" class="rule-form" label-position="right">
      <el-row :gutter="20">
        <el-col :span="17" style="display: flex;">
          <el-form-item label="师傅名称">
            <el-input
              placeholder="请输入师傅名称"
              clearable
              v-model="Name"
            ></el-input>
          </el-form-item>
          <el-form-item label="团长名称">
            <el-select
              filterable
              :remote-method="remoteMethod"
              remote
              v-model="colonelName"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in referrerOptions"
                :key="item.value"
                :label="item.realName"
                :value="item.realName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐人名称">
            <el-select
              clearable
              filterable
              :remote-method="remoteMethod"
              remote
              v-model="referrerName"
              placeholder="请选择"
            >
              <el-option
                v-for="item in referrerOptions"
                :key="item.value"
                :label="item.realName"
                :value="item.realName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-button plain type="primary" @click="resetFn">重置</el-button>
          <el-button plain type="primary" @click="_getMasterList(1)"
            >查询</el-button
          >
          <el-button plain type="primary" @click="_handleMasterInfoExport()"
            >导出师傅</el-button
          >
          <!-- <el-button plain type="primary" @click="addSigningMaster"
            >新增签约师傅</el-button
          > -->
        </el-col>
      </el-row>
    </el-form>

    <el-card>
      <el-table
        highlight-current-row
        v-loading.fullscreen.isLock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="masterList"
        height="65vh"
      >
        <el-table-column
          prop="realName"
          label="真实姓名"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="realPortrait"
          label="真实头像"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="row.realPortrait ? row.realPortrait.split(',')[0] : ''"
              :srcList="row.realPortrait ? row.realPortrait.split(',') : ''"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="integral"
          label="钻石"
          show-overflow-tooltip
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.integral ? row.integral : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          label="等级"
          show-overflow-tooltip
          width="150"
          align="center"
        >
          <template slot-scope="{ row }">
            {{
              row.identity === "普通师傅"
                ? "普通师傅"
                : row.levelId === 1
                ? "签约师傅"
                : row.levelId === 2
                ? "百钻维修师"
                : row.levelId === 3
                ? "初级管家"
                : row.levelId === 4
                ? "中级管家"
                : "高级管家"
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="superiorMasterName"
          label="团长"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="recommendMasterName"
          label="推荐人"
          show-overflow-tooltip
          width="110"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="identity"
          label="角色"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="identityFrontImage"
          label="身份证正面照"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="
                row.identityFrontImage
                  ? row.identityFrontImage.split(',')[0]
                  : ''
              "
              :srcList="
                row.identityFrontImage ? row.identityFrontImage.split(',') : ''
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="identityBackImage"
          label="身份证反面照"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="
                row.identityBackImage ? row.identityBackImage.split(',')[0] : ''
              "
              :srcList="
                row.identityBackImage ? row.identityBackImage.split(',') : ''
              "
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="identityNumber"
          label="身份证号码"
          show-overflow-tooltip
          width="170"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="industryExperience"
          label="行业经验"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="industryExperienceImages"
          label="行业经验照片"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="
                row.industryExperienceImages
                  ? row.industryExperienceImages.split(',')[0]
                  : ''
              "
              :srcList="
                row.industryExperienceImages
                  ? row.industryExperienceImages.split(',')
                  : ''
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceAreas"
          label="服务地区"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="skillCertificateImages"
          label="技能证书"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="
                row.skillCertificateImages
                  ? row.skillCertificateImages.split(',')[0]
                  : ''
              "
              :srcList="
                row.skillCertificateImages
                  ? row.skillCertificateImages.split(',')
                  : ''
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceTypes"
          label="服务类型"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="servePosition"
          label="服务部位"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serveSystem"
          label="服务系统"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="详细地址"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间 "
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isLock"
          label="是否锁定"
          show-overflow-tooltip
          width="100"
          align="center"
          fixed="right"
        >
          <template slot-scope="{ row }">{{
            util.global.getLabel("isLock", row.isLock)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="审核状态"
          show-overflow-tooltip
          width="80"
          align="center"
          fixed="right"
        >
          <template slot-scope="{ row }">{{
            util.global.getLabel("checkStatus", row.status)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template slot-scope="{ row }">
            <div style="display: flex;">
              <el-button
                type="primary"
                size="mini"
                @click="
                  $router.push('/maintenance/worker/workerDetails?id=' + row.id)
                "
                >详情</el-button
              >
              <el-button size="mini" @click="editInit(row)" type="warning"
                >编辑</el-button
              >
              <div>
                <el-select
                  v-model="row.abc"
                  placeholder="更多"
                  style="width: 71px;margin-left: 10px;"
                  size="mini"
                >
                  <el-option v-show="!row.isLock" value="1">
                    <el-button @click="isLock(row)" size="mini" type="danger"
                      >锁定</el-button
                    >
                  </el-option>
                  <el-option v-show="row.isLock" value="2">
                    <el-button size="mini" @click="isLock(row)" type="success"
                      >解锁</el-button
                    >
                  </el-option>
                  <el-option v-if="!(row.status == 2)" value="3">
                    <el-button size="mini" @click="open(row)">审核</el-button>
                  </el-option>
                  <el-option value="1">
                    <el-button type="info" size="mini" @click="checkTeam(row)"
                      >成员</el-button
                    >
                  </el-option>
                  <el-option v-if="row.identity === '普通师傅'" value="4">
                    <el-button
                      size="mini"
                      type="success"
                      @click="openChooseRoseDialog(row.uid)"
                      >角色</el-button
                    >
                  </el-option>
                  <el-option v-if="row.identity !== '普通师傅'" value="5">
                    <el-button
                      size="mini"
                      @click="open_integral_dialog(row.uid)"
                      >钻石</el-button
                    >
                  </el-option>
                  <el-option v-if="row.identity !== '普通师傅'" value="6">
                    <el-button size="mini" @click="open_score_dialog(row.uid)"
                      >分值</el-button
                    >
                  </el-option>
                </el-select>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <div style="margin-top: 20px;display: flex;justify-content: center ;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="pageCount"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 设置区域经理/签约师傅 -->、
    <el-dialog
      title="设置角色"
      width="30%"
      :visible="chooseRoseDialogShow"
      :close-on-click-modal="false"
      :before-close="closeChooseRoseDialog"
    >
      <div class="chooseRoseBox">
        <div class="chooseRoseBox_title">
          <div class="title">角色:</div>
          <el-radio v-model="chooseRoseForm.masterRoleId" :label="3"
            >签约师傅</el-radio
          >
          <el-radio
            v-model="chooseRoseForm.masterRoleId"
            :label="1"
            @input="chooseMasterQuYu"
            >区域经理</el-radio
          >
        </div>
        <div
          class="chooseRoseBox_master"
          v-if="chooseRoseForm.masterRoleId === 3"
        >
          <div class="title">区域经理:</div>
          <el-select
            placeholder="请选择"
            style="width: 150px;"
            v-model="chooseRoseForm.superiorMasterUid"
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
      <span slot="footer" class="dialog-footer">
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
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="审核状态"
          prop="name"
          style="width:calc(100% - 120px)"
        >
          <el-switch v-model="editForm.status"></el-switch>
        </el-form-item>
      </el-form>
    </model>

    <model
      ref="enterpriseList"
      title="企业审核"
      @ok="handleEnterpriseExamine"
      @close="resetEditForm"
    >
      <el-form
        :model="editForm"
        ref="editForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="审核状态"
          prop="name"
          style="width:calc(100% - 120px)"
        >
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
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="masterTeamList"
        max-height="700"
        style="width: 1500px;"
      >
        <el-table-column
          prop="realName"
          label="真实姓名"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serviceTypes"
          label="服务范围"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serviceAreas"
          label="服务区域"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
      </el-table>
    </model>

    <EditWorker
      ref="editWorker"
      :dialogVisible="dialogVisible"
      @closeFn="closeFn"
    ></EditWorker>

    <!-- 新增签约师傅addSigningMaster -->
    <el-dialog
      :visible="addSigningMasterDialogShow"
      :before-close="closeAddSigningMasterDialog"
      title="入驻签约师傅"
      width="42%"
      :close-on-click-modal="false"
    >
      <div style="height: 500px;overflow:auto;">
        <el-form
          :rules="addSigningMasterRules"
          ref="addSigningMasterForm"
          :inline="true"
          label-position="left"
          :model="addSigningMasterForm"
          label-width="110px"
        >
          <el-form-item
            label="类型"
            style="margin-bottom: 10px;"
            prop="masterRoleId"
          >
            <el-radio
              v-model="addSigningMasterForm.masterRoleId"
              :label="3"
              @input="changeMasterRoleId2"
              >签约师傅</el-radio
            >
            <el-radio
              v-model="addSigningMasterForm.masterRoleId"
              :label="1"
              @input="changeMasterRoleId1"
              >区域经理</el-radio
            >
          </el-form-item>
          <br />
          <el-form-item
            v-if="addSigningMasterForm.masterRoleId === 3"
            label="区域经理"
            style="margin-bottom: 20px;"
            prop="superiorMasterUid"
          >
            <el-select
              placeholder="请选择"
              style="width: 150px;"
              v-model="addSigningMasterForm.superiorMasterUid"
              @change="changeSuperiorMasterUid"
            >
              <el-option
                v-for="item in regionManagerList"
                :key="item.uid"
                :label="item.realName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <br v-if="addSigningMasterForm.masterRoleId === 3" />
          <el-form-item
            label="真实姓名"
            style="margin-bottom: 20px;"
            prop="realName"
          >
            <el-input
              v-model="addSigningMasterForm.realName"
              placeholder="请输入师傅真实姓名"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label="手机号码"
            style="margin-bottom: 20px;"
            prop="phone"
          >
            <el-input
              v-model="addSigningMasterForm.phone"
              placeholder="请输入手机号码"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item label="师傅编号" style="margin-bottom: 20px;">
            <el-input
              v-model="addSigningMasterForm.number"
              placeholder="请输入师傅编号"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label="真实头像"
            style="margin-bottom: 20px;"
            prop="realPortrait"
          >
            <el-upload
              list-type="picture-card"
              :show-file-list="false"
              :http-request="uploadRealPortrait"
              class="avatar-uploader"
            >
              <img
                v-if="uploadRealPortraitImg"
                :src="uploadRealPortraitImg"
                class="avatar"
              />
              <i class="el-icon-plus" v-else></i>
            </el-upload>
          </el-form-item>
          <br />
          <el-form-item
            label="详细地址"
            style="margin-bottom: 20px;"
            prop="address"
          >
            <el-input
              v-model="addSigningMasterForm.address"
              placeholder="请输入师傅真实详细地址"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label="身份证号码"
            style="margin-bottom: 20px;"
            prop="identityNumber"
          >
            <el-input
              v-model="addSigningMasterForm.identityNumber"
              placeholder="请输入师傅身份证号码"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label="身份证正面照"
            style="margin-bottom: 20px;"
            prop="identityFrontImage"
          >
            <el-upload
              list-type="picture-card"
              :show-file-list="false"
              :http-request="uploadIdentityFrontImage"
              class="avatar-uploader"
            >
              <img
                v-if="uploadIdentityFrontImageImg"
                :src="uploadIdentityFrontImageImg"
                class="avatar"
              />
              <i class="el-icon-plus" v-else></i>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="身份证反面照"
            style="margin-bottom: 20px;"
            prop="identityBackImage"
          >
            <el-upload
              list-type="picture-card"
              :show-file-list="false"
              :http-request="uploadIdentityBackImage"
              class="avatar-uploader"
            >
              <img
                v-if="uploadIdentityBackImageImg"
                :src="uploadIdentityBackImageImg"
                class="avatar"
              />
              <i class="el-icon-plus" v-else></i>
            </el-upload>
          </el-form-item>
          <br />
          <el-form-item
            label="设备类型"
            style="margin-bottom: 20px;"
            prop="serviceTypes"
          >
            <el-select
              style="margin-right: 20px;width: 150px;"
              v-model="equipmentTypeOne"
              placeholder="请选择"
              @change="changeEquipmentTypeOne"
            >
              <el-option
                v-for="item in equipmentTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-select
              style="width: 190px;"
              placeholder="请选择"
              multiple
              collapse-tags
              v-model="equipmentTypeTwo"
              @change="changeEquipmentTypeTwo"
            >
              <el-option
                v-for="item in equipmentTypeTwoList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item
            label="设备系统"
            style="margin-bottom: 20px;"
            prop="serveSystem"
          >
            <el-select
              style="margin-right: 20px;width: 150px;"
              v-model="equipmentSystemOne"
              placeholder="请选择"
              @change="changeEquipmentSystemOne"
            >
              <el-option
                v-for="item in equipmentSystemList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-select
              style="width: 190px;"
              placeholder="请选择"
              multiple
              collapse-tags
              v-model="equipmentSystemTwo"
              @change="changeEquipmentSystemTwo"
            >
              <el-option
                v-for="item in equipmentSystemTwoList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item
            label="服务部位"
            style="margin-bottom: 20px;"
            prop="servePosition"
          >
            <el-select
              style="margin-right: 20px;width: 150px;"
              v-model="serviceArea"
              placeholder="请选择"
              multiple
              collapse-tags
              @change="changeServiceArea"
            >
              <el-option
                v-for="item in devicePositionList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item
            prop="serviceAreas"
            label="服务区域"
            style="margin-bottom: 20px;"
            v-if="addSigningMasterForm.masterRoleId === 1"
          >
            <el-select
              placeholder="请选择"
              style="margin-right: 20px;width: 150px;"
              v-model="provinceValue"
              @change="changeProvinceValue"
            >
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="cityValue"
              placeholder="请选择"
              style="margin-right: 20px;width: 150px;"
              @change="changeCityValue"
            >
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-select
              placeholder="请选择"
              style="width: 150px;"
              v-model="districtValue"
              multiple
              collapse-tags
              @change="changeDistrictValue"
            >
              <el-option
                v-for="item in districtList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <br v-if="addSigningMasterForm.masterRoleId === 1" />
          <el-form-item
            label="行业经验"
            style="margin-bottom: 20px;"
            prop="industryExperience"
          >
            <el-input
              v-model="addSigningMasterForm.industryExperience"
              placeholder="请输入师傅行业经验"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item label="行业照片" style="margin-bottom: 10px;">
            <div style="height:148px;width: 470px;overflow: hidden;">
              <el-upload
                ref="uploadIndustryPicRef"
                list-type="picture-card"
                :http-request="uploadIndustryPic"
                :on-remove="delIndustryPic"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </el-form-item>
          <br />
          <el-form-item label="技能证书">
            <div style="height:148px;width: 470px;overflow: hidden;">
              <el-upload
                ref="uploadSkillCertificatePicRef"
                list-type="picture-card"
                :http-request="uploadSkillCertificatePic"
                :on-remove="delSkillCertificatePic"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddSigningMasterDialog">取 消</el-button>
        <el-button type="primary" @click="confirmAddSigningMaster"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 选积分 -->
    <el-dialog
      title="积分"
      :visible="integral_dialogVisible"
      width="30%"
      :before-close="integral_handleClose"
      :close-on-click-modal="false"
    >
      <el-form label-width="90px" label-position="left">
        <el-form-item label="积分类型">
          <el-select v-model="integralFrom.type">
            <el-option
              :label="item.text"
              :value="item.type"
              v-for="item in masterIntegralList"
              :key="item.type"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="integral_handleClose">取 消</el-button>
        <el-button type="primary" @click="addIntegralConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分值 -->
    <el-dialog
      title="分值"
      :visible="score_dialogVisible"
      width="50%"
      :before-close="score_handleClose"
    >
      <el-table :data="scoreList">
        <el-table-column
          label="时间"
          align="center"
          prop="createTime"
        ></el-table-column>
        <el-table-column label="订单号" align="center">
          <template slot-scope="{ row }">
            {{ row.relationOrderSn ? row.relationOrderSn : "无" }}
          </template>
        </el-table-column>
        <el-table-column label="加减类型" align="center">
          <template slot-scope="{ row }">
            {{
              row.type > 3
                ? masterIntegralList[row.type - 4].text
                : row.type === 1
                ? "维修一单"
                : row.type === 2
                ? "配件师傅提供"
                : "客户评价"
            }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="{ row }">
            {{ row.remarks ? row.remarks : "无" }}
          </template>
        </el-table-column>
        <el-table-column
          label="加减分值"
          align="center"
          prop="value"
        ></el-table-column>
      </el-table>
      <div style="margin-top: 20px;text-align: center;">
        <el-pagination
          layout="prev, pager, next"
          :total="scoreListTotal"
          @current-change="scoreCurrentChange"
          :page-size="scoreForm.pageSize"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
// css
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}

.chooseRoseBox {
  .chooseRoseBox_title,
  .chooseRoseBox_master {
    display: flex;
    align-items: center;
    .title {
      font-size: 14px;
      margin-right: 20px;
      color: #606266;
      font-weight: 700;
      width: 100px;
    }
  }

  .chooseRoseBox_title {
    margin-bottom: 20px;
  }
}
.row_button_item {
  display: flex;
  justify-content: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 142px;
  height: 142px;
  display: block;
}
</style>

<script>
import { UploadImg, addressFn } from "@/api/system";
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
} from "@/api/order.js";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      scoreListTotal: "",
      scoreList: [],
      masterIntegralList: [
        {
          type: 4,
          text: "主动提交维修单",
          value: 30,
        },
        {
          type: 5,
          text: "介绍客户签约机床管家",
          value: 30,
        },
        {
          type: 6,
          text: "拒单",
          value: -1,
        },
        {
          type: 7,
          text: "同一故障返修",
          value: -2,
        },
        {
          type: 8,
          text: "验机",
          value: 0,
        },
        {
          type: 9,
          text: "保养",
          value: 0,
        },
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
      regionManagerList: null,
      addSigningMasterRules: {
        phone: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "blur",
          },
        ],
        masterRoleId: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur",
          },
        ],
        realName: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur",
          },
        ],
        identityNumber: [
          {
            required: true,
            message: "请输入身份证号码",
            trigger: "blur",
          },
        ],
        industryExperience: [
          {
            required: true,
            message: "请输入行业经验",
            trigger: "blur",
          },
        ],
        realPortrait: [
          {
            required: true,
            message: "请上传真实头像",
            trigger: "blur",
          },
        ],
        identityBackImage: [
          {
            required: true,
            message: "请上传身份证反面照",
            trigger: "blur",
          },
        ],
        identityFrontImage: [
          {
            required: true,
            message: "请上传身份证正面照",
            trigger: "blur",
          },
        ],
        serviceTypes: [
          {
            required: true,
            message: "请选择设备类型",
            trigger: "blur",
          },
        ],
        serveSystem: [
          {
            required: true,
            message: "请输入设备系统",
            trigger: "blur",
          },
        ],
        servePosition: [
          {
            required: true,
            message: "请输入服务部位",
            trigger: "blur",
          },
        ],
        superiorMasterUid: [
          {
            required: true,
            message: "请选择区域经理",
            trigger: "blur",
          },
        ],
      },
      skillCertificateImagesUid: [],
      industryExperienceImagesUid: [],

      provinceList: null, //省列表
      provinceValue: null, //选中省

      cityList: null, //市列表
      cityValue: null, //选中市

      districtList: null, //区列表
      districtValue: null, //选中区

      devicePositionList: null, //服务部位列表
      serviceArea: null, //服务部位的值

      equipmentSystemOne: null, //设备系统的值
      equipmentSystemTwo: null, //设备系统的值
      equipmentSystemList: [], //设备系统第一层
      equipmentSystemTwoList: null, //设备系统第二层
      equipmentSystemList1: [], //进口系统第二层
      equipmentSystemList2: [], //国产系统第二层

      equipmentTypeOne: null, //设备类型的值
      equipmentTypeTwo: null, //设备类型的值
      equipmentTypeList: [], //设备类型第一层
      equipmentTypeTwoList: null, //设备类型第二层
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

      colonelName: null,
      dialogVisible: false,
      referrerName: null, //推荐人名字
      referrerOptions: [],

      masterTeamList: [],
      pageCount: 0,
      currentPage: 1,
      masterList: [],
      Name: "",
      Phone: "",
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
        worker: [
          {
            required: true,
            message: "请输入接单人",
            trigger: "blur",
          },
        ],
        workerPhone: [
          {
            required: true,
            message: "请输入接单人手机",
            trigger: "blur",
          },
        ],
      },
      finishForm: {
        payAmount: 0,
      },
    };
  },
  components: {
    EditWorker: EditWorker,
  },
  async created() {
    await this.getQueryDeviceTypeList();
    await this.getQueryDeviceSystemList();
    await this.getQueryDevicePositionList();
    await this.getAddressFn();
    await this.getMasterRoleList();
    this._getMasterList();
  },
  methods: {
    // 改变分值列表页面触发
    async scoreCurrentChange(page) {
      this.scoreForm.pageNo = page;
      const res = await queryMasterIntegralList(this.scoreForm);
      this.scoreList = res.data.records;
      this.scoreListTotal = res.data.total;
    },
    // 确定师傅积分选择
    async addIntegralConfirm() {
      if (this.integralFrom.type < 8) {
        if (
          this.integralFrom.relationOrderSn === "" ||
          this.integralFrom.type === ""
        ) {
          this.$message("订单编号和积分类型都是必填的......");
          return;
        }
        let value = this.masterIntegralList[this.integralFrom.type - 4].value;
        this.integralFrom.value = value;
      }
      console.log(1371, this.integralFrom);
      const res = await handleMasterIntegral(this.integralFrom);
      if (res.message === "操作成功") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
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
      (this.scoreForm = {
        uid: "",
        pageNo: 1,
        pageSize: 5,
      }),
        (this.score_dialogVisible = false);
    },
    // 关闭积分框
    integral_handleClose() {
      this.integralFrom = {
        uid: "",
        relationOrderSn: "",
        type: "",
      };
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
        // 提示区域经理必填
        this.$message({
          message: "区域经理不能为空",
          type: "warning",
        });
        return;
      } else {
        const res = await handleMasterIdentity(this.chooseRoseForm);
        if (res.code === "000") {
          this.$message({
            message: "设置成功",
            type: "success",
          });
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
      this.chooseRoseForm = {
        masterRoleId: 3,
        superiorMasterUid: "",
        uid: "",
      };
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
        {
          required: true,
          message: "请输入服务区域",
          trigger: "blur",
        },
      ];
      delete this.addSigningMasterRules.superiorMasterUid;
    },
    // 点击签约师傅触发
    changeMasterRoleId2() {
      delete this.addSigningMasterRules.serviceAreas;
      this.addSigningMasterRules.superiorMasterUid = [
        {
          required: true,
          message: "请输入服务区域",
          trigger: "blur",
        },
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
      this.addSigningMasterForm.serveSystem = this.equipmentSystemTwo.toString();
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
        this.addSigningMasterForm.industryExperienceImages = this.addSigningMasterForm.industryExperienceImages.toString();
      }
      if (this.addSigningMasterForm.skillCertificateImages) {
        this.addSigningMasterForm.skillCertificateImages = this.addSigningMasterForm.skillCertificateImages.toString();
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
      this.equipmentTypeList3 = data[2].list;
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
      this.equipmentSystemTwo = null;
      this.equipmentTypeOne = null;
      this.equipmentTypeTwo = null;
      this.serviceArea = null;
      this.provinceValue = null;
      this.cityValue = null;
      this.districtValue = null;
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
      this.referrerName = null;
      this.colonelName = null;
      this.Name = null;
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
      const data = this.params;
      data.pageSize = 1000;
      handleMasterInfoExport(data).then((res) => {
        if (res) {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.download = "师傅列表"; //下载的文件名
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
      this.currentPage = page;
      this._getMasterList();
    },
    // 查询师傅列表
    async _getMasterList(id) {
      if (id === 1) {
        this.currentPage = 1;
      }
      this.params = {
        pageNo: this.currentPage,
        pageSize: 10,
        realName: this.Name,
        phone: this.Phone,
      };
      // 将团长推荐人名字 转化成 uid
      if (this.referrerName) {
        const res = await queryMasterName(this.referrerName);
        this.params.recommendMasterUid = res.data[0] && res.data[0].uid;
      }
      if (this.colonelName) {
        const res = await queryMasterName(this.colonelName);
        this.params.superiorMasterUid = res.data[0] && res.data[0].uid;
      }
      const res = await getMasterList(this.params);
      if (res.message === "操作成功") {
        console.log(1375, res.data.records);
        this.masterList = res.data.records;
        this.pageCount = res.data.total;
        this.currentPage = res.data.current;
      }
    },
    querySelectData() {
      this.loading = true;
      this.$axios
        .post(this.url.queryType)
        .then(({ data }) => {
          this.typeData = data;
        })
        .catch(function(error) {
          console.info(error);
        });
      this.loading = false;
    },
    isLock(row) {
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
    },
    open(row) {
      this.$refs.editStatusModel.open();
      this.editForm = {
        id: row.id,
        status: false,
      };
    },
    handleEditStatus(fn) {
      this.$axios
        .post(this.url.updateStatus, {
          ...this.editForm,
          status: this.editForm.status ? 2 : 3,
        })
        .then((data) => {
          this.util.message(this, data.status, data.message);
          // this.query();
          this._getMasterList();
          this.resetEditForm(false);
        })
        .catch(function(error) {
          console.info(error);
        });

      this.$refs.editStatusModel.close();
    },
    // 关闭编辑弹窗事件
    closeFn() {
      this._getMasterList();
      this.dialogVisible = false;
    },
    // 点击编辑触发的事件
    async editInit(row) {
      const loading = this.$loading();
      const res = await getMasterInfo(row.id);
      this.$refs.editWorker.dialogForm = res.data;
      this.$refs.editWorker.servePosition = [res.data.servePosition];

      // 对图片单独处理
      await this.$refs.editWorker.avatarFileList.push({
        url: res.data.realPortrait,
      });
      await this.$refs.editWorker.idJustFileList.push({
        url: res.data.identityFrontImage,
      });
      await this.$refs.editWorker.idBackFileList.push({
        url: res.data.identityBackImage,
      });
      loading.close();
      // 弹窗显示
      this.dialogVisible = true;
      return;

      // this.editForm.serviceAreas = this.editForm.serviceAreas
      //   ? this.editForm.serviceAreas.split(",")
      //   : [];
      // this.editForm.serviceTypes = this.editForm.serviceTypes
      //   ? this.editForm.serviceTypes.split(",").map(item => {
      //       return Number(item);
      //     })
      //   : [];
      // delete this.editForm.createTime;
      this.$nextTick(() => {
        this.$refs.realPortrait.reset([]);
        this.$refs.industryExperienceImages.reset([]);
        this.$refs.skillCertificateImages.reset([]);
        this.$refs.identityFrontImage.reset([]);
        this.$refs.identityBackImage.reset([]);
        this.$refs.realPortrait.reset(
          row.realPortrait.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
        this.$refs.industryExperienceImages.reset(
          row.industryExperienceImages.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
        this.$refs.skillCertificateImages.reset(
          row.skillCertificateImages.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
        this.$refs.identityFrontImage.reset(
          row.identityFrontImage.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
        this.$refs.identityBackImage.reset(
          row.identityBackImage.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
      });
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
      fn(false);
      this.query();
    },
  },
};
</script>
