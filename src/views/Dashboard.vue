<template>
  <div class="dashboard-container">
    <!-- 数据概览 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <h3>总用户数</h3>
            <p class="stat-number">{{ stats.totalUsers }}</p>
            <p class="stat-change positive">+{{ stats.userGrowthRate }}% 较上月</p>
          </div>
          <div class="stat-icon user-icon">
            <el-icon><User /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <h3>总内容数</h3>
            <p class="stat-number">{{ stats.totalContent }}</p>
            <p class="stat-change positive">+{{ stats.contentGrowthRate }}% 较上月</p>
          </div>
          <div class="stat-icon content-icon">
            <el-icon><Document /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <h3>今日访问量</h3>
            <p class="stat-number">{{ stats.todayVisits }}</p>
            <p class="stat-change positive">+{{ stats.visitGrowthRate }}% 较昨日</p>
          </div>
          <div class="stat-icon view-icon">
            <el-icon><View /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <h3>系统运行时间</h3>
            <p class="stat-number">{{ stats.systemUptime }}</p>
            <p class="stat-change neutral">稳定运行中</p>
          </div>
          <div class="stat-icon time-icon">
            <el-icon><Timer /></el-icon>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-grid">
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>用户增长趋势</span>
            <el-select v-model="timeRange" size="small">
              <el-option label="近7天" value="7d" />
              <el-option label="近30天" value="30d" />
              <el-option label="近90天" value="90d" />
            </el-select>
          </div>
        </template>
        <div class="chart-container">
          <div ref="userChartRef" class="chart"></div>
        </div>
      </el-card>
      
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>内容分类分布</span>
          </div>
        </template>
        <div class="chart-container">
          <div ref="contentChartRef" class="chart"></div>
        </div>
      </el-card>
    </div>
    
    <!-- 最近活动 -->
    <el-card class="activity-card">
      <template #header>
        <div class="card-header">
          <span>最近活动</span>
        </div>
      </template>
      <el-table :data="recentActivities" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="action" label="操作" />
        <el-table-column prop="ip" label="IP地址" width="150" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { User, Document, View, Timer } from '@element-plus/icons-vue'

// 统计数据
const stats = ref({
  totalUsers: 12345,
  userGrowthRate: 12.5,
  totalContent: 6789,
  contentGrowthRate: 8.2,
  todayVisits: 1234,
  visitGrowthRate: 5.3,
  systemUptime: '365天'
})

// 时间范围
const timeRange = ref('7d')

// 图表引用
const userChartRef = ref(null)
const contentChartRef = ref(null)

// 图表实例
let userChart = null
let contentChart = null

// 最近活动数据
const recentActivities = ref([
  { time: '2024-01-01 10:00:00', user: 'admin', action: '登录系统', ip: '127.0.0.1' },
  { time: '2024-01-01 09:30:00', user: 'user1', action: '添加内容', ip: '192.168.1.100' },
  { time: '2024-01-01 09:00:00', user: 'user2', action: '编辑用户信息', ip: '192.168.1.101' },
  { time: '2024-01-01 08:30:00', user: 'admin', action: '更新系统配置', ip: '127.0.0.1' },
  { time: '2024-01-01 08:00:00', user: 'user3', action: '删除内容', ip: '192.168.1.102' }
])

// 初始化用户增长图表
const initUserChart = () => {
  if (userChartRef.value) {
    userChart = echarts.init(userChartRef.value)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '用户数',
          type: 'line',
          stack: 'Total',
          data: [12000, 19000, 30000, 42000, 53000, 62000, 71000],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(129, 140, 248, 0.5)'
              },
              {
                offset: 1,
                color: 'rgba(129, 140, 248, 0.05)'
              }
            ])
          },
          lineStyle: {
            color: '#818cf8'
          }
        }
      ]
    }
    userChart.setOption(option)
  }
}

// 初始化内容分类图表
const initContentChart = () => {
  if (contentChartRef.value) {
    contentChart = echarts.init(contentChartRef.value)
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '内容分类',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 35, name: '文章' },
            { value: 25, name: '图片' },
            { value: 20, name: '视频' },
            { value: 15, name: '音频' },
            { value: 5, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    contentChart.setOption(option)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (userChart) userChart.resize()
  if (contentChart) contentChart.resize()
}

onMounted(() => {
  initUserChart()
  initContentChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (userChart) userChart.dispose()
  if (contentChart) contentChart.dispose()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px 0;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-info h3 {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 12px;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change.negative {
  color: #f56c6c;
}

.stat-change.neutral {
  color: #909399;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.user-icon {
  background-color: rgba(129, 140, 248, 0.1);
  color: #818cf8;
}

.content-icon {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.visit-icon {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.uptime-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* 图表网格 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  height: 350px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: calc(100% - 48px);
}

.chart {
  width: 100%;
  height: 100%;
}

/* 活动卡片 */
.activity-card {
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 300px;
  }
}
</style>
