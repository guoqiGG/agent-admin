<template>
  <div class="user-container">
    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="openAddUserDialog">
              <el-icon><Plus /></el-icon>
              添加用户
            </el-button>
        </div>
      </template>
      
      <!-- 搜索表单 -->
      <el-form :inline="true" class="search-form" style="margin-bottom: 20px;">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="searchForm.registerTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUsers">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 用户列表 -->
      <el-table :data="users" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag>{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch 
              v-model="scope.row.status" 
              active-value="1" 
              inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditUserDialog(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch 
            v-model="userForm.status" 
            active-value="1" 
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus, Search, Delete } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = ref({
  username: '',
  status: '',
  registerTime: []
})

// 分页
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('add')
const userFormRef = ref(null)

// 用户表单
const userForm = ref({
  id: '',
  username: '',
  password: '',
  email: '',
  phone: '',
  role: '',
  status: '1'
})

// 表单验证规则
const userRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'blur' }
  ]
})

// 用户列表
const users = ref([])

// 模拟用户数据
const mockUsers = [
  { id: '1', username: 'admin', email: 'admin@example.com', phone: '13800138000', role: 'admin', status: '1', createdAt: '2024-01-01 10:00:00' },
  { id: '2', username: 'editor', email: 'editor@example.com', phone: '13800138001', role: 'editor', status: '1', createdAt: '2024-01-02 10:00:00' },
  { id: '3', username: 'user1', email: 'user1@example.com', phone: '13800138002', role: 'user', status: '1', createdAt: '2024-01-03 10:00:00' },
  { id: '4', username: 'user2', email: 'user2@example.com', phone: '13800138003', role: 'user', status: '0', createdAt: '2024-01-04 10:00:00' },
  { id: '5', username: 'user3', email: 'user3@example.com', phone: '13800138004', role: 'user', status: '1', createdAt: '2024-01-05 10:00:00' }
]

// 加载用户数据
const loadUsers = () => {
  // 模拟API请求
  setTimeout(() => {
    users.value = mockUsers
    pagination.value.total = mockUsers.length
  }, 500)
}

// 搜索用户
const searchUsers = () => {
  // 模拟搜索功能
  loadUsers()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    username: '',
    status: '',
    registerTime: []
  }
  loadUsers()
}

// 打开添加用户对话框
const openAddUserDialog = () => {
  dialogType.value = 'add'
  userForm.value = {
    id: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    role: '',
    status: '1'
  }
  dialogVisible.value = true
}

// 打开编辑用户对话框
const openEditUserDialog = (user) => {
  dialogType.value = 'edit'
  userForm.value = { ...user }
  dialogVisible.value = true
}

// 提交用户表单
const submitUserForm = () => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API请求
      setTimeout(() => {
        ElMessage({
          message: dialogType.value === 'add' ? '用户添加成功' : '用户编辑成功',
          type: 'success'
        })
        dialogVisible.value = false
        loadUsers()
      }, 500)
    }
  })
}

// 删除用户
const deleteUser = (userId) => {
  ElMessageBox.confirm(
    '确定要删除该用户吗？',
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
        message: '用户删除成功',
        type: 'success'
      })
      loadUsers()
    }, 500)
  }).catch(() => {
    // 取消删除
  })
}

// 处理状态变化
const handleStatusChange = (user) => {
  // 模拟API请求
  setTimeout(() => {
    ElMessage({
      message: `用户状态已${user.status === '1' ? '启用' : '禁用'}`,
      type: 'success'
    })
  }, 500)
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  loadUsers()
}

const handleCurrentChange = (current) => {
  pagination.value.currentPage = current
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-container {
  padding: 20px 0;
}

.search-form {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
