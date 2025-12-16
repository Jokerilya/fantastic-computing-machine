<template>
  <div class="dashboard-container" ref="dashboardContainer">
    <!-- 悬浮粒子效果 -->
    <div class="particles-container" ref="particlesContainer"></div>

    <!-- 头部 -->
    <div class="header glass-card">
      <div class="header-left">
        <div class="neon-title">机将 · 中台驾驶舱</div>
        <div class="subtitle">
          实时数据监控中心 · <span class="highlight">{{ currentTime }}</span>
        </div>
      </div>

      <div class="header-controls">
        <div class="time-controls">
          <div class="time-buttons">
            <button
              v-for="range in timeRanges"
              :key="range.value"
              :class="[
                'btn-3d',
                'time-btn',
                { active: timeRange === range.value },
              ]"
              @click="changeTimeRange(range.value)"
            >
              <i :class="range.icon"></i>
              {{ range.label }}
            </button>
          </div>

          <div class="region-selector">
            <span class="selector-label">
              <i class="el-icon-location-outline"></i>
              区域筛选
            </span>
            <el-select
              v-model="selectedRegion"
              class="region-select tech-select"
              placeholder="选择区域"
              @change="handleRegionChange"
            >
              <el-option
                v-for="region in regions"
                :key="region.value"
                :label="region.label"
                :value="region.value"
              >
                <div class="region-option">
                  <i :class="region.icon" style="margin-right: 8px"></i>
                  <span>{{ region.label }}</span>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI卡片区域 -->
    <div class="kpi-grid">
      <div
        v-for="(kpi, index) in kpiData"
        :key="index"
        :class="['kpi-card', 'glass-card', `status-${kpi.status}`]"
        @mouseenter="hoverCard(index)"
      >
        <div class="kpi-header">
          <div class="kpi-icon">
            <i :class="kpi.icon"></i>
          </div>
          <div class="kpi-title">
            {{ kpi.title }}
            <div class="kpi-tag">{{ kpi.tag }}</div>
          </div>
          <div class="kpi-status-indicator">
            <div class="status-dot" :class="`dot-${kpi.status}`"></div>
          </div>
        </div>

        <div class="kpi-content">
          <div class="kpi-value counter" :data-target="kpi.value">
            {{ animatedValues[index] }}
          </div>
          <div class="kpi-progress">
            <div class="progress-track">
              <div
                class="progress-bar"
                :style="{ width: kpi.progress + '%' }"
                :class="`progress-${kpi.status}`"
              ></div>
            </div>
            <div class="progress-label">{{ kpi.progress }}%</div>
          </div>
        </div>

        <div class="kpi-footer">
          <div :class="['kpi-trend', `trend-${kpi.trend}`]">
            <i
              :class="kpi.trend === 'up' ? 'el-icon-top' : 'el-icon-bottom'"
            ></i>
            {{ kpi.trendText }}
          </div>
          <div class="kpi-compare">
            <span class="compare-label">环比</span>
            <span class="compare-value">{{ kpi.comparison }}%</span>
          </div>
        </div>

        <!-- 光效边框 -->
        <div class="card-glow"></div>
      </div>
    </div>

    <!-- 主图表区域 -->
    <div class="main-charts">
      <!-- 订单趋势图表 -->
      <div class="chart-section glass-card data-flow">
        <div class="chart-header">
          <div class="chart-title">
            <i class="el-icon-data-line"></i>
            订单趋势分析
            <span class="chart-subtitle">实时监控</span>
          </div>
          <!-- <div class="chart-controls">
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color color-primary"></span>
                总订单量
              </span>
              <span class="legend-item">
                <span class="legend-color color-accent"></span>
                咨询订单
              </span>
            </div>
            <el-button class="btn-3d export-btn" size="mini">
              <i class="el-icon-download"></i>
              导出
            </el-button>
          </div> -->
        </div>
        <div ref="orderTrendChart" class="chart-wrapper"></div>
      </div>

      <!-- 服务流程监控 -->
      <div class="chart-section glass-card data-flow">
        <div class="chart-header">
          <div class="chart-title">
            <i class="el-icon-set-up"></i>
            服务流程监控
            <span class="chart-subtitle">各环节状态</span>
          </div>
          <div class="process-indicators">
            <div class="indicator normal">
              <span class="indicator-dot"></span>
              正常 {{ processStats.normal }}
            </div>
            <div class="indicator warning">
              <span class="indicator-dot"></span>
              超时 {{ processStats.warning }}
            </div>
            <div class="indicator danger">
              <span class="indicator-dot"></span>
              异常 {{ processStats.danger }}
            </div>
          </div>
        </div>
        <div ref="processFlowChart" class="chart-wrapper"></div>
        <div class="process-stages">
          <div
            v-for="stage in processStages"
            :key="stage.id"
            :class="['process-stage', `stage-${stage.status}`]"
          >
            <div class="stage-icon">
              <i :class="stage.icon"></i>
            </div>
            <div class="stage-content">
              <div class="stage-title">{{ stage.title }}</div>
              <div class="stage-value">{{ stage.value }}</div>
              <div class="stage-trend">{{ stage.trend }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 区域分布 -->
      <div class="chart-section glass-card data-flow">
        <div class="chart-header">
          <div class="chart-title">
            <i class="el-icon-map-location"></i>
            区域订单分布
            <span class="chart-subtitle">热力图分析</span>
          </div>
          <div class="region-stats">
            <div class="stat-item">
              <div class="stat-label">最高</div>
              <div class="stat-value">{{ regionStats.max }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">平均</div>
              <div class="stat-value">{{ regionStats.avg }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">增长</div>
              <div class="stat-value trend-up">{{ regionStats.growth }}%</div>
            </div>
          </div>
        </div>
        <div ref="regionChart" class="chart-wrapper"></div>
      </div>
    </div>

    <!-- 产能分析与工单明细 -->
    <div class="analysis-section">
      <!-- 产能分析图表 -->
      <div class="capacity-chart glass-card">
        <div class="chart-header">
          <div class="chart-title">
            <i class="el-icon-c-scale-to-original"></i>
            产能匹配分析
            <span class="chart-subtitle">供需平衡度</span>
          </div>
          <!-- <div class="capacity-indicator">
            <div class="gauge-container">
              <svg width="120" height="120" class="gauge">
                <defs>
                  <linearGradient
                    id="gauge-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" class="gradient-primary"></stop>
                    <stop offset="100%" class="gradient-secondary"></stop>
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  stroke-width="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#gauge-gradient)"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="capacityOffset"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div class="gauge-label">
                <div class="gauge-value">{{ capacityUtilization }}%</div>
                <div class="gauge-title">产能利用率</div>
              </div>
            </div>
          </div> -->
        </div>
        <div ref="capacityChart" class="chart-wrapper"></div>
      </div>

      <!-- 工单明细表格 -->
      <div class="order-table glass-card">
        <div class="table-header">
          <div class="table-title">
            <i class="el-icon-tickets"></i>
            实时工单明细
            <span class="table-subtitle">最近24小时</span>
          </div>
          <div class="table-controls">
            <el-input
              v-model="searchQuery"
              placeholder="搜索工单..."
              class="tech-input"
              size="small"
            >
              <!-- <i slot="prefix" class="el-icon-search"></i> -->
            </el-input>
            <el-select
              v-model="orderFilter"
              class="tech-select"
              size="small"
              placeholder="筛选状态"
            >
              <el-option label="全部状态" value="all"></el-option>
              <el-option label="进行中" value="processing"></el-option>
              <el-option label="已完成" value="completed"></el-option>
              <el-option label="异常" value="error"></el-option>
            </el-select>
          </div>
        </div>

        <div class="table-container">
          <el-table
            :data="filteredOrders"
            class="tech-table"
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="master" label="师傅">
              <template slot-scope="{ row }">
                <div class="master-cell">
                  <div class="master-avatar">
                    {{ row.master.charAt(0) }}
                  </div>
                  <div class="master-info">
                    <div class="master-name">{{ row.master }}</div>
                    <!-- <div class="master-skill">{{ row.skill }}</div> -->
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="orderNo" label="订单号">
              <template slot-scope="{ row }">
                <div class="order-no">
                  <span class="no-text">{{ row.orderNo }}</span>
                  <span :class="['status-badge', `badge-${row.status}`]">
                    {{ row.statusText }}
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="device" label="设备信息">
              <template slot-scope="{ row }">
                <div class="device-info">
                  <div class="device-name">{{ row.device }}</div>
                  <div class="device-model">{{ row.model }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="time" label="时间周期">
              <template slot-scope="{ row }">
                <div class="time-cell">
                  <div class="duration">{{ row.duration }}天</div>
                  <div class="time-range">{{ row.timeRange }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="{ row }">
                <el-button
                  class="action-btn"
                  size="mini"
                  type="text"
                  @click="showOrderDetail(row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="table-footer">
          <div class="pagination-info">
            显示 {{ filteredOrders.length }} 条记录
          </div>
          <el-pagination
            :page-size="10"
            :pager-count="5"
            layout="prev, pager, next"
            :total="filteredOrders.length"
            class="tech-pagination"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 保养计划监控 -->
    <div class="maintenance-section glass-card data-flow">
      <div class="section-header">
        <div class="section-title">
          <i class="el-icon-warning-outline"></i>
          保养计划监控
          <span class="section-subtitle">预警提醒</span>
        </div>
        <div class="maintenance-stats">
          <div class="maintenance-stat">
            <div class="stat-icon">
              <i class="el-icon-alarm-clock"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ maintenanceStats.urgent }}</div>
              <div class="stat-label">紧急任务</div>
            </div>
          </div>
          <div class="maintenance-stat">
            <div class="stat-icon">
              <i class="el-icon-time"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ maintenanceStats.due }}</div>
              <div class="stat-label">即将到期</div>
            </div>
          </div>
          <div class="maintenance-stat">
            <div class="stat-icon">
              <i class="el-icon-check"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ maintenanceStats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </div>
      </div>

      <div class="maintenance-grid">
        <div
          v-for="plan in maintenancePlans"
          :key="plan.id"
          :class="['maintenance-card', `priority-${plan.priority}`]"
        >
          <div class="maintenance-header">
            <div class="maintenance-icon">
              <i :class="plan.icon"></i>
            </div>
            <div class="maintenance-title">
              {{ plan.client }}
              <div class="maintenance-subtitle">{{ plan.device }}</div>
            </div>
            <div class="maintenance-priority">
              <span :class="['priority-badge', `badge-${plan.priority}`]">
                {{ plan.priorityText }}
              </span>
            </div>
          </div>

          <div class="maintenance-content">
            <div class="maintenance-info">
              <div class="info-item">
                <i class="el-icon-user"></i>
                <span>{{ plan.master }}</span>
              </div>
              <div class="info-item">
                <i class="el-icon-date"></i>
                <span>{{ plan.deadline }}</span>
              </div>
            </div>

            <div class="maintenance-progress">
              <div class="progress-header">
                <span>完成进度</span>
                <span>{{ plan.completed }}/{{ plan.total }}</span>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :style="{ width: plan.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="maintenance-footer">
            <div class="remaining-time">
              <i class="el-icon-time"></i>
              剩余{{ plan.remainingDays }}天
            </div>
            <el-button
              class="action-btn"
              size="mini"
              @click="showMaintenanceDetail(plan)"
            >
              处理
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 排行榜区域 - 重新添加并优化 -->
    <div class="ranking-section">
      <!-- 师傅效率排行榜 -->
      <div class="ranking-card glass-card">
        <div class="ranking-header">
          <div class="ranking-title">
            <i class="el-icon-medal"></i>
            师傅效率排行榜
            <span class="ranking-subtitle">TOP 10 · 实时更新</span>
          </div>
          <div class="ranking-filters">
            <el-select
              v-model="rankingFilter"
              class="tech-select"
              size="small"
              placeholder="筛选技能"
            >
              <el-option label="全部技能" value="all"></el-option>
              <el-option label="数控编程" value="programming"></el-option>
              <el-option label="设备维修" value="repair"></el-option>
              <el-option label="机械装配" value="assembly"></el-option>
            </el-select>
            <el-button
              class="btn-3d view-all-btn"
              size="small"
              @click="viewAllMasters"
            >
              查看全部
            </el-button>
          </div>
        </div>

        <div class="ranking-content">
          <div class="ranking-list">
            <div
              v-for="(master, index) in masterRanking"
              :key="master.id"
              :class="['ranking-item', { active: index < 3 }]"
              @mouseenter="highlightMaster(master.id)"
            >
              <div class="item-rank">
                <div :class="['rank-badge', `rank-${index + 1}`]">
                  {{ index + 1 }}
                  <div class="crown" v-if="index < 3">
                    <i :class="['el-icon-trophy', `trophy-${index + 1}`]"></i>
                  </div>
                </div>
              </div>

              <div class="item-info">
                <div class="master-avatar">
                  <div class="avatar-circle">
                    {{ master.name.charAt(0) }}
                  </div>
                  <div
                    class="online-status"
                    :class="`status-${master.status}`"
                  ></div>
                </div>
                <div class="master-details">
                  <div class="master-name">
                    {{ master.name }}
                    <span class="master-tag">{{ master.level }}</span>
                  </div>
                  <div class="master-skill">
                    <i class="el-icon-star-on"></i>
                    擅长: {{ master.skills.join("、") }}
                  </div>
                  <div class="master-stats">
                    <div class="stat">
                      <span class="stat-label">完成率</span>
                      <span class="stat-value"
                        >{{ master.completionRate }}%</span
                      >
                    </div>
                    <div class="stat">
                      <span class="stat-label">满意度</span>
                      <span class="stat-value">{{ master.satisfaction }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="item-efficiency">
                <div class="efficiency-score">
                  <div class="score-value">{{ master.efficiency }}</div>
                  <div class="score-label">单/日</div>
                </div>
                <div class="efficiency-chart">
                  <div class="sparkline" ref="sparkline"></div>
                  <div
                    :class="[
                      'efficiency-trend',
                      master.trend > 0 ? 'trend-up' : 'trend-down',
                    ]"
                  >
                    {{ master.trend > 0 ? "↑" : "↓" }}
                    {{ Math.abs(master.trend) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ranking-summary">
            <div class="summary-item">
              <div class="summary-icon">
                <i class="el-icon-s-flag"></i>
              </div>
              <div class="summary-content">
                <div class="summary-value">
                  {{ rankingStats.avgEfficiency }}
                </div>
                <div class="summary-label">平均效率</div>
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">
                <i class="el-icon-time"></i>
              </div>
              <div class="summary-content">
                <div class="summary-value">{{ rankingStats.avgResponse }}</div>
                <div class="summary-label">平均响应</div>
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">
                <i class="el-icon-s-claim"></i>
              </div>
              <div class="summary-content">
                <div class="summary-value">{{ rankingStats.avgRating }}</div>
                <div class="summary-label">平均评分</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 配件消耗榜 -->
      <div class="ranking-card glass-card">
        <div class="ranking-header">
          <div class="ranking-title">
            <i class="el-icon-box"></i>
            常消耗配件TOP10
            <span class="ranking-subtitle">月度统计 · 智能预警</span>
          </div>
          <div class="ranking-filters">
            <el-select
              v-model="partsFilter"
              class="tech-select"
              size="small"
              placeholder="配件类型"
            >
              <el-option label="全部类型" value="all"></el-option>
              <el-option label="切削刀具" value="cutting"></el-option>
              <el-option label="润滑冷却" value="lubrication"></el-option>
              <el-option label="电气元件" value="electrical"></el-option>
            </el-select>
          </div>
        </div>

        <div class="parts-content">
          <div class="parts-list">
            <div
              v-for="(part, index) in partsConsumption"
              :key="part.id"
              :class="[
                'parts-item',
                { warning: part.stock < part.warningLevel },
              ]"
              @click="showPartDetail(part)"
            >
              <div class="item-index">
                <div :class="['index-badge', `index-${index + 1}`]">
                  {{ index + 1 }}
                </div>
              </div>

              <div class="item-main">
                <div class="part-icon">
                  <i :class="part.icon"></i>
                </div>
                <div class="part-details">
                  <div class="part-name">
                    {{ part.name }}
                    <span
                      :class="[
                        'stock-tag',
                        part.stock < part.warningLevel ? 'danger' : 'normal',
                      ]"
                    >
                      {{
                        part.stock < part.warningLevel ? "库存预警" : "库存充足"
                      }}
                    </span>
                  </div>
                  <div class="part-spec">
                    <span class="spec-item">
                      <i class="el-icon-s-grid"></i>
                      规格: {{ part.specification }}
                    </span>
                    <span class="spec-item">
                      <i class="el-icon-office-building"></i>
                      {{ part.brand }}
                    </span>
                  </div>
                  <div class="part-usage">
                    <div class="usage-info">
                      <span class="usage-label">本月消耗</span>
                      <span class="usage-value"
                        >{{ part.consumption }} {{ part.unit }}</span
                      >
                    </div>
                    <div class="usage-trend">
                      <div
                        :class="[
                          'trend-indicator',
                          part.trend > 0 ? 'trend-up' : 'trend-down',
                        ]"
                      >
                        {{ part.trend > 0 ? "↑" : "↓" }}
                        {{ Math.abs(part.trend) }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="item-stats">
                <div class="stats-chart">
                  <div class="consumption-bar">
                    <div
                      class="bar-fill"
                      :style="{ width: part.consumptionPercentage + '%' }"
                      :class="
                        part.consumptionPercentage > 80 ? 'high' : 'normal'
                      "
                    ></div>
                  </div>
                  <div class="stats-label">
                    消耗占比 {{ part.consumptionPercentage }}%
                  </div>
                </div>

                <div class="stock-info">
                  <div class="stock-progress">
                    <div class="progress-label">
                      <span>库存</span>
                      <span>{{ part.stock }}/{{ part.maxStock }}</span>
                    </div>
                    <div class="progress-track">
                      <div
                        class="progress-fill"
                        :style="{
                          width: (part.stock / part.maxStock) * 100 + '%',
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="parts-summary">
            <div class="summary-chart">
              <div class="chart-title">消耗趋势分析</div>
              <div ref="consumptionChart" class="mini-chart"></div>
            </div>
            <div class="summary-alerts">
              <div class="alert-title">库存预警</div>
              <div class="alert-list">
                <div
                  v-for="alert in stockAlerts"
                  :key="alert.id"
                  class="alert-item"
                >
                  <div class="alert-icon">
                    <i class="el-icon-warning"></i>
                  </div>
                  <div class="alert-content">
                    <div class="alert-name">{{ alert.name }}</div>
                    <div class="alert-desc">
                      库存仅剩 {{ alert.stock }} {{ alert.unit }}
                    </div>
                  </div>
                  <div class="alert-action">
                    <el-button size="mini" class="btn-3d">采购</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer glass-card">
      <div class="footer-content">
        <div class="system-info">
          <div class="system-name">
            <i class="el-icon-monitor"></i>
            维保售后平台中台系统
          </div>
          <div class="system-version">v2.0.1</div>
        </div>

        <div class="footer-stats">
          <div class="stat-item">
            <div class="stat-value">{{ systemStats.uptime }}</div>
            <div class="stat-label">运行时间</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ systemStats.requests }}</div>
            <div class="stat-label">请求数/小时</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ systemStats.responseTime }}ms</div>
            <div class="stat-label">平均响应</div>
          </div>
        </div>

        <div class="footer-copyright">
          © 2024 机将科技 · 数据更新时间: {{ updateTime }}
          <span class="copyright-highlight">| 技术支持: 数字创新中心</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "TechDashboard",
  data() {
    return {
      currentTime: "",
      updateTime: "",
      timeRange: "today",
      selectedRegion: "all",
      searchQuery: "",
      orderFilter: "all",
      animatedValues: [],
      particles: [],

      timeRanges: [
        { value: "today", label: "今日", icon: "el-icon-sunny" },
        { value: "week", label: "本周", icon: "el-icon-date" },
        { value: "month", label: "本月", icon: "el-icon-calendar" },
      ],

      exportDataList: [
        {
          name: "故障项目表",
          value: "faultItemTable",
        },
        {
          name: "配件价格表",
          value: "partsPriceTable",
        },
        {
          name: "供应商配件价格表",
          value: "supplierPartsPriceTable",
        },
      ],

      regions: [
        {
          value: "all",
          label: "全部区域",
          icon: "el-icon-s-data",
          count: "1564",
        },
        {
          value: "guangzhou",
          label: "广州市",
          icon: "el-icon-location",
          count: "428",
        },
        {
          value: "shenzhen",
          label: "深圳市",
          icon: "el-icon-location",
          count: "395",
        },
        {
          value: "zhuhai",
          label: "珠海市",
          icon: "el-icon-location",
          count: "362",
        },
        {
          value: "other",
          label: "其他城市",
          icon: "el-icon-location",
          count: "379",
        },
      ],

      kpiData: [
        {
          title: "待指派",
          value: 156,
          tag: "Pending",
          icon: "el-icon-time",
          status: "warning",
          progress: 45,
          trend: "up",
          trendText: "较昨日增加8%",
          comparison: 12.5,
        },
        {
          title: "待接单",
          value: 89,
          tag: "Waiting",
          icon: "el-icon-message",
          status: "warning",
          progress: 30,
          trend: "down",
          trendText: "较昨日减少3%",
          comparison: -5.2,
        },
        {
          title: "待服务",
          value: 234,
          tag: "Service",
          icon: "el-icon-phone-outline",
          status: "normal",
          progress: 65,
          trend: "up",
          trendText: "较昨日增加15%",
          comparison: 18.3,
        },
        {
          title: "服务中",
          value: 167,
          tag: "Processing",
          icon: "el-icon-setting",
          status: "normal",
          progress: 78,
          trend: "up",
          trendText: "较昨日增加5%",
          comparison: 8.7,
        },
        {
          title: "待验收",
          value: 78,
          tag: "Review",
          icon: "el-icon-document-checked",
          status: "warning",
          progress: 40,
          trend: "down",
          trendText: "较昨日减少2%",
          comparison: -3.4,
        },
        {
          title: "待付款",
          value: 42,
          tag: "Payment",
          icon: "el-icon-money",
          status: "normal",
          progress: 85,
          trend: "up",
          trendText: "较昨日增加1%",
          comparison: 2.1,
        },
        {
          title: "已完成",
          value: 256,
          tag: "Completed",
          icon: "el-icon-circle-check",
          status: "success",
          progress: 95,
          trend: "up",
          trendText: "较昨日增加2.5%",
          comparison: 4.6,
        },
        {
          title: "已取消",
          value: 23,
          tag: "Cancelled",
          icon: "el-icon-close",
          status: "danger",
          progress: 15,
          trend: "down",
          trendText: "较昨日减少12%",
          comparison: -15.8,
        },
        {
          title: "日均交付量",
          value: 3.2,
          tag: "Efficiency",
          icon: "el-icon-ship",
          status: "normal",
          progress: 82,
          trend: "up",
          trendText: "较上月增加0.4",
          comparison: 14.3,
        },
        {
          title: "在线师傅",
          value: 25,
          tag: "Online",
          icon: "el-icon-user",
          status: "normal",
          progress: 62,
          trend: "up",
          trendText: "较昨日增加2.5%",
          comparison: 6.7,
        },
      ],

      processStats: {
        normal: 142,
        warning: 28,
        danger: 15,
      },

      processStages: [
        {
          id: 1,
          title: "售前咨询",
          value: "42单",
          trend: "+5%",
          status: "normal",
          icon: "el-icon-chat-line-round",
        },
        {
          id: 2,
          title: "售中服务",
          value: "156单",
          trend: "+12%",
          status: "warning",
          icon: "el-icon-s-tools",
        },
        {
          id: 3,
          title: "售后支持",
          value: "63单",
          trend: "-3%",
          status: "danger",
          icon: "el-icon-headset",
        },
      ],

      regionStats: {
        max: "428",
        avg: "178",
        growth: 12.5,
      },

      capacityUtilization: 78,
      circumference: 2 * Math.PI * 54,

      orders: [
        {
          id: 1,
          master: "陈工",
          skill: "数控编程",
          orderNo: "ORD20241215001",
          device: "五轴加工中心",
          model: "DMU 80P",
          status: "processing",
          statusText: "进行中",
          duration: 3,
          timeRange: "12-15",
          progress: 65,
        },
        {
          id: 2,
          master: "李工",
          skill: "电气维修",
          orderNo: "ORD20241214002",
          device: "自动化生产线",
          model: "SIEMENS 840D",
          status: "warning",
          statusText: "延期",
          duration: 5,
          timeRange: "12-17",
          progress: 40,
        },
        {
          id: 3,
          master: "王工",
          skill: "机械装配",
          orderNo: "ORD20241213003",
          device: "龙门铣床",
          model: "MAZAK VTC",
          status: "normal",
          statusText: "正常",
          duration: 2,
          timeRange: "12-14",
          progress: 85,
        },
        {
          id: 4,
          master: "赵工",
          skill: "模具设计",
          orderNo: "ORD20241212004",
          device: "注塑机",
          model: "Haitian MA",
          status: "success",
          statusText: "完成",
          duration: 1,
          timeRange: "12-12",
          progress: 100,
        },
        {
          id: 5,
          master: "孙工",
          skill: "液压系统",
          orderNo: "ORD20241211005",
          device: "液压机",
          model: "Y32-500",
          status: "processing",
          statusText: "进行中",
          duration: 4,
          timeRange: "12-15",
          progress: 75,
        },
      ],

      maintenanceStats: {
        urgent: 3,
        due: 7,
        completed: 15,
      },

      maintenancePlans: [
        {
          id: 1,
          client: "张先生",
          device: "深圳金达来精密技术",
          master: "赵亚飞",
          total: 10,
          completed: 5,
          deadline: "2025/12/01",
          priority: "high",
          priorityText: "紧急",
          icon: "el-icon-warning",
          remainingDays: 3,
          percentage: 50,
        },
        {
          id: 2,
          client: "王女士",
          device: "东莞迅拓自动化",
          master: "刘基萍",
          total: 15,
          completed: 8,
          deadline: "2025/12/15",
          priority: "medium",
          priorityText: "重要",
          icon: "el-icon-bell",
          remainingDays: 7,
          percentage: 53,
        },
        {
          id: 3,
          client: "李先生",
          device: "东莞金源五金",
          master: "陈昊",
          total: 20,
          completed: 12,
          deadline: "2026/01/01",
          priority: "low",
          priorityText: "一般",
          icon: "el-icon-timer",
          remainingDays: 15,
          percentage: 60,
        },
        {
          id: 4,
          client: "赵先生",
          device: "广东机将科技",
          master: "张伟",
          total: 8,
          completed: 3,
          deadline: "2025/12/20",
          priority: "high",
          priorityText: "紧急",
          icon: "el-icon-warning",
          remainingDays: 5,
          percentage: 38,
        },
        {
          id: 5,
          client: "孙女士",
          device: "珠海精密制造",
          master: "李娜",
          total: 12,
          completed: 6,
          deadline: "2026/01/10",
          priority: "medium",
          priorityText: "重要",
          icon: "el-icon-bell",
          remainingDays: 30,
          percentage: 50,
        },
      ],

      systemStats: {
        uptime: "45天12小时",
        requests: "1.2K",
        responseTime: "125",
      },

      charts: {},

      // 排行榜相关数据
      rankingFilter: "all",
      partsFilter: "all",

      masterRanking: [
        {
          id: 1,
          name: "陈工",
          level: "高级技师",
          skills: ["五轴联动编程", "精密调试", "工艺优化"],
          efficiency: 5.9,
          trend: 12.5,
          completionRate: 98.5,
          satisfaction: 99.2,
          status: "online",
          performance: [5.2, 5.4, 5.6, 5.8, 5.9, 6.0, 5.7],
        },
        {
          id: 2,
          name: "周工",
          level: "高级技师",
          skills: ["精密零件加工", "刀具管理", "质量检测"],
          efficiency: 5.6,
          trend: 8.3,
          completionRate: 97.8,
          satisfaction: 98.5,
          status: "busy",
          performance: [5.0, 5.2, 5.4, 5.5, 5.6, 5.7, 5.5],
        },
        {
          id: 3,
          name: "吴工",
          level: "中级技师",
          skills: ["数控车床操作", "批量生产", "设备维护"],
          efficiency: 5.3,
          trend: 6.2,
          completionRate: 96.2,
          satisfaction: 97.8,
          status: "online",
          performance: [4.8, 5.0, 5.1, 5.2, 5.3, 5.2, 5.1],
        },
        {
          id: 4,
          name: "郑工",
          level: "中级技师",
          skills: ["刀具选型", "加工工艺", "效率优化"],
          efficiency: 5.1,
          trend: 4.8,
          completionRate: 95.6,
          satisfaction: 96.5,
          status: "offline",
          performance: [4.9, 5.0, 5.0, 5.1, 5.1, 5.2, 5.0],
        },
        {
          id: 5,
          name: "林工",
          level: "中级技师",
          skills: ["设备维保", "预防性维护", "故障诊断"],
          efficiency: 4.8,
          trend: 3.9,
          completionRate: 94.3,
          satisfaction: 95.7,
          status: "online",
          performance: [4.6, 4.7, 4.8, 4.8, 4.8, 4.9, 4.7],
        },
        {
          id: 6,
          name: "王工",
          level: "初级技师",
          skills: ["CNC加工", "程序调试", "基础维护"],
          efficiency: 4.5,
          trend: 5.2,
          completionRate: 93.1,
          satisfaction: 94.2,
          status: "busy",
          performance: [4.3, 4.4, 4.4, 4.5, 4.5, 4.6, 4.4],
        },
        {
          id: 7,
          name: "李工",
          level: "初级技师",
          skills: ["模具加工", "工装夹具", "工艺执行"],
          efficiency: 4.3,
          trend: 4.1,
          completionRate: 92.4,
          satisfaction: 93.6,
          status: "online",
          performance: [4.1, 4.2, 4.2, 4.3, 4.3, 4.3, 4.2],
        },
      ],

      rankingStats: {
        avgEfficiency: "5.1单/日",
        avgResponse: "12分钟",
        avgRating: "4.8分",
      },

      partsConsumption: [
        {
          id: 1,
          name: "硬质合金刀片",
          specification: "SNMG120408",
          brand: "山特维克、伊斯卡",
          consumption: 2183,
          unit: "片",
          trend: 12.5,
          stock: 1250,
          maxStock: 5000,
          warningLevel: 1000,
          icon: "el-icon-scissors",
          consumptionPercentage: 28,
        },
        {
          id: 2,
          name: "切削液(200L/桶)",
          specification: "HYSOL B200",
          brand: "嘉实多、马斯特",
          consumption: 1645,
          unit: "桶",
          trend: 8.3,
          stock: 850,
          maxStock: 2000,
          warningLevel: 800,
          icon: "el-icon-water-drop",
          consumptionPercentage: 21,
        },
        {
          id: 3,
          name: "数控刀柄(BT40)",
          specification: "BT40-ER32",
          brand: "BIG、雄克",
          consumption: 862,
          unit: "支",
          trend: -2.1,
          stock: 3200,
          maxStock: 5000,
          warningLevel: 1000,
          icon: "el-icon-set-up",
          consumptionPercentage: 11,
        },
        {
          id: 4,
          name: "导轨润滑脂",
          specification: "Alvania RL3",
          brand: "壳牌、美孚",
          consumption: 784,
          unit: "支",
          trend: 5.6,
          stock: 950,
          maxStock: 2000,
          warningLevel: 900,
          icon: "el-icon-s-data",
          consumptionPercentage: 10,
        },
        {
          id: 5,
          name: "主轴冷却水管",
          specification: "SMC-12mm",
          brand: "SMC、Festo",
          consumption: 543,
          unit: "米",
          trend: 7.2,
          stock: 1250,
          maxStock: 3000,
          warningLevel: 1200,
          icon: "el-icon-tube",
          consumptionPercentage: 7,
        },
        {
          id: 6,
          name: "编码器联轴器",
          specification: "R+W BK5",
          brand: "R+W、Mayr",
          consumption: 412,
          unit: "个",
          trend: 3.4,
          stock: 650,
          maxStock: 1500,
          warningLevel: 600,
          icon: "el-icon-connection",
          consumptionPercentage: 5,
        },
        {
          id: 7,
          name: "液压密封圈",
          specification: "NOK SPG",
          brand: "NOK、PARKER",
          consumption: 387,
          unit: "套",
          trend: -1.2,
          stock: 850,
          maxStock: 2000,
          warningLevel: 800,
          icon: "el-icon-circle-check",
          consumptionPercentage: 5,
        },
        {
          id: 8,
          name: "伺服电机电池",
          specification: "6F22-9V",
          brand: "松下、安川",
          consumption: 321,
          unit: "个",
          trend: 6.8,
          stock: 420,
          maxStock: 1000,
          warningLevel: 400,
          icon: "el-icon-lightning",
          consumptionPercentage: 4,
        },
        {
          id: 9,
          name: "排屑机链节",
          specification: "定制耐磨链",
          brand: "永宏、永骏",
          consumption: 298,
          unit: "节",
          trend: 4.5,
          stock: 1250,
          maxStock: 3000,
          warningLevel: 1200,
          icon: "el-icon-c-scale-to-original",
          consumptionPercentage: 4,
        },
        {
          id: 10,
          name: "电柜散热风扇",
          specification: "EBM 12038",
          brand: "EBM、SUNON",
          consumption: 265,
          unit: "个",
          trend: 2.3,
          stock: 320,
          maxStock: 1000,
          warningLevel: 300,
          icon: "el-icon-wind-power",
          consumptionPercentage: 3,
        },
      ],

      stockAlerts: [
        { id: 1, name: "硬质合金刀片", stock: 1250, unit: "片" },
        { id: 2, name: "导轨润滑脂", stock: 950, unit: "支" },
        { id: 3, name: "伺服电机电池", stock: 420, unit: "个" },
      ],
    };
  },

  computed: {
    capacityOffset() {
      const progress = this.capacityUtilization / 100;
      return this.circumference * (1 - progress);
    },

    filteredOrders() {
      return this.orders.filter((order) => {
        const matchesSearch =
          !this.searchQuery ||
          order.master.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.orderNo
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          order.device.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesFilter =
          this.orderFilter === "all" || order.status === this.orderFilter;

        return matchesSearch && matchesFilter;
      });
    },
  },

  mounted() {
    this.initTime();
    this.initAnimatedValues();
    this.initParticles();
    this.initCharts();
    this.setupResizeListener();
    this.initConsumptionChart();
  },

  beforeDestroy() {
    this.removeResizeListener();
    this.disposeCharts();
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    if (this.animationTimer) clearInterval(this.animationTimer);
  },

  methods: {
    // 查看全部师傅
    viewAllMasters() {
      this.$message({
        message: "打开师傅管理页面",
        type: "info",
        customClass: "tech-message",
      });
    },

    // 高亮师傅
    highlightMaster(id) {
      console.log("高亮师傅:", id);
    },

    // 显示配件详情
    showPartDetail(part) {
      this.$message({
        message: `查看配件详情：${part.name}`,
        type: "info",
        customClass: "tech-message",
      });
    },

    // 初始化配件消耗图表
    initConsumptionChart() {
      const chartDom = this.$refs.consumptionChart;
      if (!chartDom) return;

      const chart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(16, 22, 36, 0.9)",
          borderColor: "rgba(0, 198, 255, 0.5)",
          textStyle: { color: "#fff" },
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          top: "5%",
        },
        xAxis: {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月"],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 9,
            color: "rgba(255, 255, 255, 0.6)",
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          axisLabel: {
            fontSize: 9,
            color: "rgba(255, 255, 255, 0.6)",
          },
        },
        series: [
          {
            data: [125, 186, 232, 198, 256, 310],
            type: "line",
            smooth: true,
            symbolSize: 4,
            lineStyle: {
              width: 2,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(0, 198, 255, 0.8)" },
                { offset: 1, color: "rgba(0, 114, 255, 0.8)" },
              ]),
            },
            itemStyle: {
              color: "rgba(0, 198, 255, 1)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(0, 198, 255, 0.3)" },
                { offset: 1, color: "rgba(0, 114, 255, 0.1)" },
              ]),
            },
          },
        ],
      };

      chart.setOption(option);
      this.charts.consumption = chart;
    },
    // 初始化时间
    initTime() {
      this.updateCurrentTime();
      this.updateDataTime();
      setInterval(() => {
        this.updateCurrentTime();
      }, 1000);
    },

    updateCurrentTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },

    updateDataTime() {
      const now = new Date();
      this.updateTime = now.toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    // 初始化数字动画
    initAnimatedValues() {
      this.animatedValues = this.kpiData.map((kpi) => 0);
      this.animateNumbers();
    },

    animateNumbers() {
      this.kpiData.forEach((kpi, index) => {
        this.animateValue(index, kpi.value);
      });
    },

    animateValue(index, targetValue) {
      let current = 0;
      const increment = targetValue / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          current = targetValue;
          clearInterval(timer);
        }
        this.$set(this.animatedValues, index, Math.floor(current));
      }, 20);
    },

    // 创建粒子效果
    initParticles() {
      const container = this.$refs.particlesContainer;
      if (!container) return;

      for (let i = 0; i < 30; i++) {
        this.createParticle(container);
      }
    },

    createParticle(container) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      container.appendChild(particle);

      const speed = Math.random() * 50 + 30;
      const angle = Math.random() * Math.PI * 2;

      const animate = () => {
        const x = parseFloat(particle.style.left);
        const y = parseFloat(particle.style.top);

        particle.style.left = `${(x + Math.cos(angle) * 0.1) % 100}%`;
        particle.style.top = `${(y + Math.sin(angle) * 0.1) % 100}%`;

        requestAnimationFrame(animate);
      };

      animate();
    },

    // 卡片悬停效果
    hoverCard(index) {
      const cards = document.querySelectorAll(".kpi-card");
      cards.forEach((card, i) => {
        if (i !== index) {
          card.style.transform =
            i < index ? "translateX(-10px)" : "translateX(10px)";
        }
      });

      setTimeout(() => {
        cards.forEach((card) => {
          card.style.transform = "";
        });
      }, 300);
    },

    // 初始化图表
    initCharts() {
      // 订单趋势图表
      this.initOrderTrendChart();

      // 服务流程监控图表
      this.initProcessFlowChart();

      // 区域分布图表
      this.initRegionChart();

      // 产能分析图表
      this.initCapacityChart();
    },

    initOrderTrendChart() {
      const chartDom = this.$refs.orderTrendChart;
      if (!chartDom) return;

      const chart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(16, 22, 36, 0.9)",
          borderColor: "rgba(0, 198, 255, 0.5)",
          textStyle: { color: "#fff" },
        },
        legend: {
          data: ["总订单量", "咨询订单量", "转化率"],
          textStyle: { color: "#a0c8ff" },
          icon: "circle",
          itemWidth: 8,
          itemHeight: 8,
          top: 10,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "0%",
          top: "25%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [
            "1号",
            "2号",
            "3号",
            "4号",
            "5号",
            "6号",
            "7号",
            "8号",
            "9号",
            "10号",
            "11号",
            "12号",
            "13号",
            "14号",
            "15号",
          ],
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          axisLabel: {
            color: "#a0c8ff",
          },
        },
        yAxis: [
          {
            type: "value",
            name: "订单量",
            min: 0,
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.2)",
              },
            },
            axisLabel: {
              color: "#a0c8ff",
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
          {
            type: "value",
            name: "转化率",
            min: 0,
            max: 100,
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.2)",
              },
            },
            axisLabel: {
              color: "#a0c8ff",
              formatter: "{value}%",
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "总订单量",
            type: "bar",
            data: [
              1200, 1350, 1500, 1800, 2100, 1950, 2300, 2500, 2700, 3000, 3200,
              3400, 3600, 3800, 4000,
            ],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(0, 198, 255, 0.8)" },
                { offset: 1, color: "rgba(0, 114, 255, 0.2)" },
              ]),
            },
            barWidth: "60%",
          },
          {
            name: "咨询订单量",
            type: "bar",
            data: [
              800, 920, 1100, 1250, 1400, 1300, 1500, 1600, 1750, 1900, 2000,
              2150, 2300, 2450, 2600,
            ],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(255, 46, 99, 0.8)" },
                { offset: 1, color: "rgba(255, 46, 99, 0.2)" },
              ]),
            },
            barWidth: "60%",
          },
          {
            name: "转化率",
            type: "line",
            yAxisIndex: 1,
            data: [65, 68, 73, 72, 75, 67, 78, 80, 81, 82, 83, 84, 85, 86, 90],
            itemStyle: {
              color: "#67c23a",
            },
            lineStyle: {
              width: 3,
            },
            symbol: "circle",
            symbolSize: 6,
          },
        ],
      };

      chart.setOption(option);
      this.charts.orderTrend = chart;
    },

    initProcessFlowChart() {
      const chartDom = this.$refs.processFlowChart;
      if (!chartDom) return;

      const chart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["正常订单", "超时订单", "异常订单"],
          textStyle: { color: "#a0c8ff" },
          top: 10,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "20%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [
            "咨询",
            "报价",
            "匹配",
            "预约",
            "检测",
            "维修",
            "验收",
            "付款",
            "评价",
          ],
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          axisLabel: {
            color: "#a0c8ff",
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          axisLabel: {
            color: "#a0c8ff",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
        series: [
          {
            name: "正常订单",
            type: "bar",
            stack: "总量",
            data: [35, 40, 120, 85, 110, 70, 45, 50, 40],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(103, 194, 58, 0.8)" },
                { offset: 1, color: "rgba(103, 194, 58, 0.2)" },
              ]),
            },
          },
          {
            name: "超时订单",
            type: "bar",
            stack: "总量",
            data: [3, 5, 25, 15, 20, 10, 5, 8, 3],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(230, 162, 60, 0.8)" },
                { offset: 1, color: "rgba(230, 162, 60, 0.2)" },
              ]),
            },
          },
          {
            name: "异常订单",
            type: "bar",
            stack: "总量",
            data: [2, 3, 10, 8, 12, 5, 3, 5, 2],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(245, 108, 108, 0.8)" },
                { offset: 1, color: "rgba(245, 108, 108, 0.2)" },
              ]),
            },
          },
        ],
      };

      chart.setOption(option);
      this.charts.processFlow = chart;
    },

    initRegionChart() {
      const chartDom = this.$refs.regionChart;
      if (!chartDom) return;

      const chart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: "center",
          textStyle: { color: "#a0c8ff" },
        },
        series: [
          {
            name: "区域分布",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["40%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#0a0e17",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: "bold",
                color: "#fff",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 428, name: "长安镇" },
              { value: 395, name: "虎门镇" },
              { value: 362, name: "塘厦镇" },
              { value: 320, name: "厚街镇" },
              { value: 245, name: "常平镇" },
              { value: 210, name: "大朗镇" },
              { value: 178, name: "寮步镇" },
              { value: 142, name: "东城街道" },
            ],
          },
        ],
      };

      chart.setOption(option);
      this.charts.region = chart;
    },

    initCapacityChart() {
      const chartDom = this.$refs.capacityChart;
      if (!chartDom) return;

      const chart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["订单量", "师傅产能"],
          textStyle: { color: "#a0c8ff" },
          top: 10,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["莞城", "南城", "东城", "万江", "石碣", "石龙", "茶山"],
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          axisLabel: {
            color: "#a0c8ff",
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          axisLabel: {
            color: "#a0c8ff",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
        series: [
          {
            name: "订单量",
            type: "bar",
            data: [320, 302, 341, 374, 390, 450, 420],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(0, 198, 255, 0.8)" },
                { offset: 1, color: "rgba(0, 114, 255, 0.8)" },
              ]),
            },
          },
          {
            name: "师傅产能",
            type: "bar",
            data: [220, 282, 391, 234, 290, 330, 310],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(67, 194, 100, 0.8)" },
                { offset: 1, color: "rgba(37, 164, 83, 0.8)" },
              ]),
            },
          },
        ],
      };

      chart.setOption(option);
      this.charts.capacity = chart;
    },

    // 交互方法
    changeTimeRange(range) {
      this.timeRange = range;
      // 这里可以添加数据更新逻辑
      this.refreshData();
    },

    handleRegionChange() {
      // 区域切换逻辑
      this.refreshData();
    },

    refreshData() {
      // 模拟数据刷新
      this.kpiData.forEach((kpi, index) => {
        const change = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, Math.round(kpi.value + change));
        this.$set(this.kpiData[index], "value", newValue);
      });

      this.animateNumbers();

      // 显示刷新提示
      this.$message({
        message: "数据已刷新",
        type: "success",
        customClass: "tech-message",
      });
    },

    showOrderDetail(order) {
      this.$message({
        message: `查看订单详情：${order.orderNo}`,
        type: "info",
        customClass: "tech-message",
      });
    },

    showMaintenanceDetail(plan) {
      this.$message({
        message: `打开保养计划：${plan.device}`,
        type: "info",
        customClass: "tech-message",
      });
    },

    tableRowClassName({ row }) {
      return `row-${row.status}`;
    },

    setupResizeListener() {
      this.resizeHandler = () => {
        Object.values(this.charts).forEach((chart) => {
          if (chart && typeof chart.resize === "function") {
            chart.resize();
          }
        });
      };
      window.addEventListener("resize", this.resizeHandler);
    },

    removeResizeListener() {
      if (this.resizeHandler) {
        window.removeEventListener("resize", this.resizeHandler);
      }
    },

    disposeCharts() {
      Object.values(this.charts).forEach((chart) => {
        if (chart && typeof chart.dispose === "function") {
          chart.dispose();
        }
      });
    },
  },
};
</script>

<style scoped>
@import "./tech-styles.css";

/* 主容器 */
.dashboard-container {
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 25px 30px;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.highlight {
  color: var(--primary-color);
  font-weight: 600;
}

.header-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 400px;
}

.time-controls {
  display: flex;
  gap: 20px;
  align-items: center;
}

.time-buttons {
  display: flex;
  gap: 8px;
}

.time-btn {
  padding: 8px 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.time-btn.active {
  background: linear-gradient(135deg, var(--accent-color), #ff6b9d);
}

.region-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selector-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tech-select ::v-deep .el-input__inner {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  min-width: 120px;
}

.region-option {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.data-refresh {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.refresh-btn {
  padding: 6px 16px;
  font-size: 12px;
}

/* KPI网格 */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
}

.kpi-card {
  padding: 20px;
  min-height: 140px;
  transition: all 0.3s ease;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.kpi-icon {
  width: 36px;
  height: 36px;
  background: rgba(0, 198, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 18px;
}

.kpi-title {
  flex: 1;
  margin-left: 12px;
  font-size: 14px;
  color: white;
  font-weight: 600;
}

.kpi-tag {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}

.kpi-status-indicator {
  position: relative;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
}

.status-dot::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.dot-normal {
  background: #67c23a;
}
.dot-normal::after {
  background: rgba(103, 194, 58, 0.3);
}
.dot-warning {
  background: #e6a23c;
}
.dot-warning::after {
  background: rgba(230, 162, 60, 0.3);
}
.dot-danger {
  background: #f56c6c;
}
.dot-danger::after {
  background: rgba(245, 108, 108, 0.3);
}
.dot-success {
  background: var(--primary-color);
}
.dot-success::after {
  background: rgba(0, 198, 255, 0.3);
}

.kpi-content {
  margin-bottom: 15px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.kpi-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-track {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.progress-normal {
  background: linear-gradient(90deg, #67c23a, #85ce61);
}
.progress-warning {
  background: linear-gradient(90deg, #e6a23c, #ebb563);
}
.progress-danger {
  background: linear-gradient(90deg, #f56c6c, #f78989);
}
.progress-success {
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--secondary-color)
  );
}

.progress-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 35px;
}

.kpi-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-up {
  color: #67c23a;
}
.trend-down {
  color: #f56c6c;
}

.kpi-compare {
  display: flex;
  align-items: center;
  gap: 4px;
}

.compare-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.compare-value {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow: var(--glow-shadow);
}

.kpi-card:hover .card-glow {
  opacity: 1;
}

/* 主图表区域 */
.main-charts {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
}

.chart-section {
  padding: 20px;
  min-height: 400px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.chart-title i {
  color: var(--primary-color);
  font-size: 18px;
}

.chart-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.chart-legend {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.color-primary {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
}
.color-accent {
  background: linear-gradient(135deg, var(--accent-color), #ff6b9d);
}

.export-btn {
  padding: 5px 12px;
  font-size: 12px;
}

.chart-wrapper {
  height: 300px;
  width: 100%;
}

.process-indicators {
  display: flex;
  gap: 15px;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.indicator.normal {
  color: #67c23a;
}
.indicator.warning {
  color: #e6a23c;
}
.indicator.danger {
  color: #f56c6c;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.indicator.normal .indicator-dot {
  background: #67c23a;
}
.indicator.warning .indicator-dot {
  background: #e6a23c;
}
.indicator.danger .indicator-dot {
  background: #f56c6c;
}

.process-stages {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.process-stage {
  flex: 1;
  padding: 15px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.process-stage:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.stage-normal {
  border-left: 4px solid #67c23a;
}
.stage-warning {
  border-left: 4px solid #e6a23c;
}
.stage-danger {
  border-left: 4px solid #f56c6c;
}

.stage-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.stage-normal .stage-icon {
  color: #67c23a;
}
.stage-warning .stage-icon {
  color: #e6a23c;
}
.stage-danger .stage-icon {
  color: #f56c6c;
}

.stage-content {
  flex: 1;
}

.stage-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.stage-value {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin-bottom: 2px;
}

.stage-trend {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.region-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

/* 产能分析区域 */
.analysis-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
}

.capacity-chart,
.order-table {
  padding: 20px;
  min-height: 450px;
}

.capacity-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
}

.gauge {
  position: relative;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.table-title i {
  color: var(--primary-color);
  font-size: 18px;
}

.table-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
}

.table-controls {
  display: flex;
  gap: 10px;
}

.tech-input ::v-deep .el-input__inner {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  width: 200px;
}

.tech-input ::v-deep .el-input__prefix {
  color: rgba(255, 255, 255, 0.5);
}

.table-container {
  height: 320px;
  overflow: auto;
  margin-bottom: 15px;
}

.tech-table {
  background: transparent !important;
}

.tech-table ::v-deep .el-table__header {
  background: rgba(255, 255, 255, 0.05) !important;
}

.tech-table ::v-deep .el-table__row {
  background: transparent !important;
  transition: all 0.3s ease;
}

.tech-table ::v-deep .el-table__row:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}

.tech-table ::v-deep .el-table__cell {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  padding: 12px 0 !important;
}

.tech-table ::v-deep .el-table__header-wrapper .el-table__cell {
  color: #008bff !important;
  font-weight: 600 !important;
}

.master-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.master-avatar {
  width: 32px;
  height: 32px;
  line-height: 14px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.master-info {
  display: flex;
  flex-direction: column;
}

.master-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.master-skill {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.order-no {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.no-text {
  font-family: "Monaco", monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.status-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  text-align: center;
  width: fit-content;
}

.badge-processing {
  background: rgba(0, 198, 255, 0.2);
  color: var(--primary-color);
}
.badge-warning {
  background: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}
.badge-normal {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}
.badge-success {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}

.device-info {
  display: flex;
  flex-direction: column;
}

.device-name {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.device-model {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.time-cell {
  display: flex;
  flex-direction: column;
}

.duration {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.time-range {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 35px;
}

.action-btn {
  color: var(--primary-color) !important;
  font-weight: 600;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pagination-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.tech-pagination ::v-deep .el-pagination__total,
.tech-pagination ::v-deep .el-pagination__jump,
.tech-pagination ::v-deep .el-pager li {
  color: rgba(255, 255, 255, 0.7) !important;
}

.tech-pagination ::v-deep .el-pager li.active {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  ) !important;
  color: white !important;
}

/* 保养计划区域 */
.maintenance-section {
  padding: 25px;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.section-title i {
  color: var(--accent-color);
  font-size: 20px;
}

.section-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
}

.maintenance-stats {
  display: flex;
  gap: 30px;
}

.maintenance-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  min-width: 140px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 46, 99, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  font-size: 18px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

.maintenance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.maintenance-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.maintenance-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-3px);
}

.maintenance-card.priority-high {
  border-left: 4px solid var(--accent-color);
}

.maintenance-card.priority-medium {
  border-left: 4px solid #e6a23c;
}

.maintenance-card.priority-low {
  border-left: 4px solid #67c23a;
}

.maintenance-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.maintenance-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 46, 99, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  font-size: 16px;
}

.maintenance-title {
  color: #fff;
  flex: 1;
}

.maintenance-title > div:first-child {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin-bottom: 3px;
}

.maintenance-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.maintenance-priority {
  margin-left: auto;
}

.priority-badge {
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.badge-high {
  background: rgba(255, 46, 99, 0.2);
  color: var(--accent-color);
}
.badge-medium {
  background: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}
.badge-low {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}

.maintenance-content {
  margin-bottom: 15px;
}

.maintenance-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.info-item i {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  width: 14px;
}

.maintenance-progress {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 6px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), #ff6b9d);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.maintenance-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.remaining-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.remaining-time i {
  color: var(--accent-color);
}

/* 页脚 */
.footer {
  padding: 20px 25px;
  position: relative;
  z-index: 2;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.system-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.system-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.system-name i {
  color: var(--primary-color);
  font-size: 18px;
}

.system-version {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 4px;
}

.footer-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-stats .stat-item {
  text-align: center;
}

.footer-stats .stat-value {
  font-size: 24px;
  margin-bottom: 5px;
}

.footer-stats .stat-label {
  font-size: 12px;
}

.footer-copyright {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.copyright-highlight {
  color: var(--primary-color);
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1600px) {
  .kpi-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .main-charts {
    grid-template-columns: 1fr 1fr;
  }

  .main-charts .chart-section:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1200px) {
  .header {
    flex-direction: column;
    gap: 20px;
  }

  .header-controls {
    width: 100%;
  }

  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-charts {
    grid-template-columns: 1fr;
  }

  .analysis-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .time-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .data-refresh {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .maintenance-stats {
    flex-direction: column;
    gap: 15px;
  }

  .footer-stats {
    flex-direction: column;
    gap: 20px;
  }
}

/* 动画关键帧 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 元素动画延迟 */
.dashboard-container > * {
  animation: slideIn 0.6s ease-out forwards;
  opacity: 0;
}

.dashboard-container > *:nth-child(1) {
  animation-delay: 0.1s;
}
.dashboard-container > *:nth-child(2) {
  animation-delay: 0.2s;
}
.dashboard-container > *:nth-child(3) {
  animation-delay: 0.3s;
}
.dashboard-container > *:nth-child(4) {
  animation-delay: 0.4s;
}
.dashboard-container > *:nth-child(5) {
  animation-delay: 0.5s;
}
.dashboard-container > *:nth-child(6) {
  animation-delay: 0.6s;
}

/* 排行榜区域样式 */
.ranking-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
}

.ranking-card {
  padding: 20px;
  min-height: 500px;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ranking-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.ranking-title i {
  color: var(--primary-color);
  font-size: 18px;
}

.ranking-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
}

.ranking-filters {
  display: flex;
  gap: 10px;
  align-items: center;
}

.view-all-btn {
  padding: 5px 12px;
  font-size: 12px;
}

/* 师傅排行榜样式 */
.ranking-content {
  height: 380px;
  display: flex;
  flex-direction: column;
}

.ranking-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.ranking-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 198, 255, 0.2);
  transform: translateX(5px);
}

.ranking-item.active {
  background: linear-gradient(
    90deg,
    rgba(0, 198, 255, 0.1),
    rgba(0, 114, 255, 0.05)
  );
  border-color: rgba(0, 198, 255, 0.3);
}

.item-rank {
  margin-right: 15px;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  position: relative;
  color: white;
}

.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffc300);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.rank-2 {
  background: linear-gradient(135deg, #c0c0c0, #a9a9a9);
  box-shadow: 0 0 10px rgba(192, 192, 192, 0.3);
}

.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  box-shadow: 0 0 10px rgba(205, 127, 50, 0.3);
}

.rank-4,
.rank-5,
.rank-6,
.rank-7 {
  background: rgba(255, 255, 255, 0.1);
}

.crown {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 12px;
}

.trophy-1 {
  color: #ffd700;
}
.trophy-2 {
  color: #c0c0c0;
}
.trophy-3 {
  color: #cd7f32;
}

.item-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.master-avatar {
  position: relative;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--dark-bg);
}

.status-online {
  background: #67c23a;
}
.status-busy {
  background: #e6a23c;
}
.status-offline {
  background: #909399;
}

.master-details {
  flex: 1;
}

.master-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.master-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(0, 198, 255, 0.2);
  color: var(--primary-color);
}

.master-skill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.master-skill i {
  color: #e6a23c;
}

.master-stats {
  display: flex;
  gap: 15px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.item-efficiency {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.efficiency-score {
  text-align: center;
  margin-bottom: 8px;
}

.score-value {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.score-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.efficiency-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sparkline {
  width: 60px;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 4px;
}

.efficiency-trend {
  font-size: 11px;
  font-weight: 600;
}

.trend-up {
  color: #67c23a;
}
.trend-down {
  color: #f56c6c;
}

.ranking-summary {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 10px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(0, 198, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 16px;
}

.summary-content {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 18px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.summary-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}

/* 配件消耗榜样式 */
.parts-content {
  height: 380px;
  display: flex;
  flex-direction: column;
}

.parts-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.parts-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.parts-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 46, 99, 0.2);
  transform: translateX(5px);
}

.parts-item.warning {
  background: linear-gradient(
    90deg,
    rgba(255, 46, 99, 0.1),
    rgba(255, 107, 157, 0.05)
  );
  border-color: rgba(255, 46, 99, 0.3);
}

.item-index {
  margin-right: 15px;
}

.index-badge {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.index-1,
.index-2,
.index-3 {
  background: linear-gradient(135deg, var(--accent-color), #ff6b9d);
}

.item-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.part-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 46, 99, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  font-size: 18px;
}

.part-details {
  flex: 1;
}

.part-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.stock-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
}

.stock-tag.danger {
  background: rgba(255, 46, 99, 0.2);
  color: var(--accent-color);
}

.stock-tag.normal {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}

.part-spec {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.spec-item i {
  font-size: 10px;
}

.part-usage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.usage-info {
  display: flex;
  flex-direction: column;
}

.usage-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2px;
}

.usage-value {
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.usage-trend {
  display: flex;
  align-items: center;
}

.trend-indicator {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
}

.trend-indicator.trend-up {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}

.trend-indicator.trend-down {
  background: rgba(255, 46, 99, 0.2);
  color: var(--accent-color);
}

.item-stats {
  width: 180px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-chart {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.consumption-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.bar-fill.high {
  background: linear-gradient(90deg, var(--accent-color), #ff6b9d);
}

.bar-fill.normal {
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--secondary-color)
  );
}

.stats-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stock-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.progress-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a, #85ce61);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.parts-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 10px;
}

.summary-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chart-title {
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-bottom: 5px;
}

.mini-chart {
  height: 80px;
  width: 100%;
}

.summary-alerts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alert-title {
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-bottom: 5px;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 46, 99, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 46, 99, 0.2);
  gap: 10px;
}

.alert-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(255, 46, 99, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  font-size: 12px;
}

.alert-content {
  flex: 1;
}

.alert-name {
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-bottom: 2px;
}

.alert-desc {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.alert-action {
  margin-left: auto;
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .ranking-section {
    grid-template-columns: 1fr;
  }

  .ranking-card {
    min-height: 450px;
  }
}

@media (max-width: 768px) {
  .ranking-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .item-efficiency {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .parts-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .item-stats {
    width: 100%;
  }

  .parts-summary {
    grid-template-columns: 1fr;
  }
}
</style>