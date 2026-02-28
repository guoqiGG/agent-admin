<template>
  <div class="system-container">
    <el-card class="system-card">
      <template #header>
        <div class="card-header">
          <span>系统设置 </span>
        </div>
      </template>
      
      <!-- 系统配置 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="系统配置" name="config">
          <div class="config-container">
            <el-form :model="systemConfig" :rules="configRules" ref="configFormRef">
              <el-form-item label="系统名称" prop="systemName">
                <el-input v-model="systemConfig.systemName" placeholder="请输入系统名称" />
              </el-form-item>
              <el-form-item label="系统版本" prop="systemVersion">
                <el-input v-model="systemConfig.systemVersion" placeholder="请输入系统版本" />
              </el-form-item>
              <el-form-item label="系统描述" prop="systemDescription">
                <el-input
                  v-model="systemConfig.systemDescription"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入系统描述"
                />
              </el-form-item>
              <el-form-item label="版权信息" prop="copyright">
                <el-input v-model="systemConfig.copyright" placeholder="请输入版权信息" />
              </el-form-item>
              <el-form-item label="联系邮箱" prop="contactEmail">
                <el-input v-model="systemConfig.contactEmail" type="email" placeholder="请输入联系邮箱" />
              </el-form-item>
              <el-form-item label="联系电话" prop="contactPhone">
                <el-input v-model="systemConfig.contactPhone" placeholder="请输入联系电话" />
              </el-form-item>
              <el-form-item label="是否启用验证码" prop="enableCaptcha">
                <el-switch v-model="systemConfig.enableCaptcha" />
              </el-form-item>
              <el-form-item label="是否启用日志" prop="enableLog">
                <el-switch v-model="systemConfig.enableLog" />
              </el-form-item>
            </el-form>
            <div class="form-actions">
              <el-button type="primary" @click="submitConfigForm">保存配置</el-button>
              <el-button @click="resetConfigForm">重置</el-button>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="参数管理" name="params">
          <div class="params-container">
            <el-button type="primary" @click="openAddParamDialog" style="margin-bottom: 20px;">
              <el-icon><Plus /></el-icon>
              添加参数
            </el-button>
            <el-table :data="systemParams" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="paramKey" label="参数键" />
              <el-table-column prop="paramValue" label="参数值" min-width="200" />
              <el-table-column prop="paramDesc" label="参数描述" min-width="200" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '1' ? 'success' : 'info'">
                    {{ scope.row.status === '1' ? '启用' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="openEditParamDialog(scope.row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteParam(scope.row.id)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="系统日志" name="log">
          <div class="log-container">
            <el-form :inline="true" class="search-form" style="margin-bottom: 20px;">
              <el-form-item label="操作人">
                <el-input v-model="logSearchForm.operator" placeholder="请输入操作人" />
              </el-form-item>
              <el-form-item label="操作类型">
                <el-select v-model="logSearchForm.operationType" placeholder="请选择操作类型">
                  <el-option label="全部" value="" />
                  <el-option label="添加" value="add" />
                  <el-option label="编辑" value="edit" />
                  <el-option label="删除" value="delete" />
                  <el-option label="登录" value="login" />
                  <el-option label="退出" value="logout" />
                </el-select>
              </el-form-item>
              <el-form-item label="操作时间">
                <el-date-picker
                  v-model="logSearchForm.operationTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchLogs">
                  <el-icon><Search /></el-icon>
                  搜索
                </el-button>
                <el-button @click="resetLogSearch">重置</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="systemLogs" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="operator" label="操作人" width="120" />
              <el-table-column prop="operationType" label="操作类型" width="120">
                <template #default="scope">
                  <el-tag :type="getLogTypeTagType(scope.row.operationType)">
                    {{ getLogTypeText(scope.row.operationType) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="operationContent" label="操作内容" min-width="300" />
              <el-table-column prop="operationTime" label="操作时间" width="180" />
              <el-table-column prop="ipAddress" label="IP地址" width="150" />
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="logPagination.currentPage"
                v-model:page-size="logPagination.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="logPagination.total"
                @size-change="handleLogSizeChange"
                @current-change="handleLogCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- 添加/编辑参数对话框 -->
    <el-dialog
      v-model="paramDialogVisible"
      :title="paramDialogType === 'add' ? '添加参数' : '编辑参数'"
      width="500px"
    >
      <el-form :model="paramForm" :rules="paramRules" ref="paramFormRef">
        <el-form-item label="参数键" prop="paramKey">
          <el-input v-model="paramForm.paramKey" placeholder="请输入参数键" />
        </el-form-item>
        <el-form-item label="参数值" prop="paramValue">
          <el-input v-model="paramForm.paramValue" placeholder="请输入参数值" />
        </el-form-item>
        <el-form-item label="参数描述" prop="paramDesc">
          <el-input
            v-model="paramForm.paramDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入参数描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch 
            v-model="paramForm.status" 
            active-value="1" 
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paramDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitParamForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus, Delete, Search } from '@element-plus/icons-vue'

const activeTab = ref('config')
const configFormRef = ref(null)
const paramFormRef = ref(null)
const paramDialogVisible = ref(false)
const paramDialogType = ref('add')

// 系统配置
const systemConfig = ref({
  systemName: '管理后台',
  systemVersion: '1.0.0',
  systemDescription: '基于Vue 3 + Element Plus的管理后台系统',
  copyright: '© 2024 管理后台 版权所有',
  contactEmail: 'admin@example.com',
  contactPhone: '12345678901',
  enableCaptcha: true,
  enableLog: true
})

// 配置验证规则
const configRules = ref({
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  systemVersion: [
    { required: true, message: '请输入系统版本', trigger: 'blur' }
  ],
  contactEmail: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
})

// 系统参数
const systemParams = ref([
  { id: '1', paramKey: 'MAX_UPLOAD_SIZE', paramValue: '10485760', paramDesc: '最大上传文件大小(10MB)', status: '1' },
  { id: '2', paramKey: 'LOGIN_FAILURE_LIMIT', paramValue: '5', paramDesc: '登录失败限制次数', status: '1' },
  { id: '3', paramKey: 'SESSION_TIMEOUT', paramValue: '3600', paramDesc: '会话超时时间(秒)', status: '1' },
  { id: '4', paramKey: 'ENABLE_REGISTRATION', paramValue: 'false', paramDesc: '是否启用注册功能', status: '0' }
])

// 参数表单
const paramForm = ref({
  id: '',
  paramKey: '',
  paramValue: '',
  paramDesc: '',
  status: '1'
})

// 参数验证规则
const paramRules = ref({
  paramKey: [
    { required: true, message: '请输入参数键', trigger: 'blur' }
  ],
  paramValue: [
    { required: true, message: '请输入参数值', trigger: 'blur' }
  ]
})

// 系统日志
const systemLogs = ref([
  { id: '1', operator: 'admin', operationType: 'login', operationContent: '用户登录', operationTime: '2024-01-01 10:00:00', ipAddress: '127.0.0.1' },
  { id: '2', operator: 'admin', operationType: 'add', operationContent: '添加用户', operationTime: '2024-01-01 10:30:00', ipAddress: '127.0.0.1' },
  { id: '3', operator: 'admin', operationType: 'edit', operationContent: '编辑用户', operationTime: '2024-01-01 11:00:00', ipAddress: '127.0.0.1' },
  { id: '4', operator: 'admin', operationType: 'delete', operationContent: '删除用户', operationTime: '2024-01-01 11:30:00', ipAddress: '127.0.0.1' },
  { id: '5', operator: 'admin', operationType: 'logout', operationContent: '用户退出', operationTime: '2024-01-01 12:00:00', ipAddress: '127.0.0.1' }
])

// 日志搜索表单
const logSearchForm = ref({
  operator: '',
  operationType: '',
  operationTime: []
})

// 日志分页
const logPagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 5
})

// 提交系统配置
const submitConfigForm = () => {
  configFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API请求
      setTimeout(() => {
        ElMessage({
          message: '系统配置保存成功',
          type: 'success'
        })
      }, 500)
    }
  })
}

// 重置系统配置
const resetConfigForm = () => {
  configFormRef.value.resetFields()
}

// 打开添加参数对话框
const openAddParamDialog = () => {
  paramDialogType.value = 'add'
  paramForm.value = {
    id: '',
    paramKey: '',
    paramValue: '',
    paramDesc: '',
    status: '1'
  }
  paramDialogVisible.value = true
}

// 打开编辑参数对话框
const openEditParamDialog = (param) => {
  paramDialogType.value = 'edit'
  paramForm.value = { ...param }
  paramDialogVisible.value = true
}

// 提交参数表单
const submitParamForm = () => {
  paramFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API请求
      setTimeout(() => {
        ElMessage({
          message: paramDialogType.value === 'add' ? '参数添加成功' : '参数编辑成功',
          type: 'success'
        })
        paramDialogVisible.value = false
      }, 500)
    }
  })
}

// 删除参数
const deleteParam = (paramId) => {
  ElMessageBox.confirm(
    '确定要删除该参数吗？',
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟API请求
    setTimeout(() => {
      ElMessage({
        message: '参数删除成功',
        type: 'success'
      })
    }, 500)
  }).catch(() => {
    // 取消删除
  })
}

// 搜索日志
const searchLogs = () => {
  // 模拟搜索功能
}

// 重置日志搜索
const resetLogSearch = () => {
  logSearchForm.value = {
    operator: '',
    operationType: '',
    operationTime: []
  }
}

// 日志分页处理
const handleLogSizeChange = (size) => {
  logPagination.value.pageSize = size
}

const handleLogCurrentChange = (current) => {
  logPagination.value.currentPage = current
}

// 获取日志类型标签类型
const getLogTypeTagType = (type) => {
  const typeMap = {
    add: 'success',
    edit: 'warning',
    delete: 'danger',
    login: 'info',
    logout: 'info'
  }
  return typeMap[type] || 'info'
}

// 获取日志类型文本
const getLogTypeText = (type) => {
  const typeMap = {
    add: '添加',
    edit: '编辑',
    delete: '删除',
    login: '登录',
    logout: '退出'
  }
  return typeMap[type] || type
}
</script>

<style scoped>
.system-container {
  padding: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.params-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.log-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.search-form {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
