<template>
  <div class="role-container">
    <el-card class="role-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="openAddRoleDialog">
              <el-icon><Plus /></el-icon>
              添加角色
            </el-button>
        </div>
      </template>
      
      <!-- 角色列表 -->
      <el-table :data="roles" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色编码" width="150" />
        <el-table-column prop="description" label="角色描述" min-width="300" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditRoleDialog(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="success" size="small" @click="openPermissionDialog(scope.row)">
              <el-icon><Operation /></el-icon>
              权限
            </el-button>
            <el-button type="danger" size="small" @click="deleteRole(scope.row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加角色' : '编辑角色'"
      width="500px"
    >
      <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 权限分配对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限分配"
      width="600px"
    >
      <el-form :model="permissionForm" ref="permissionFormRef">
        <el-form-item label="角色名称">
          <el-input v-model="permissionForm.name" disabled />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuTree"
            show-checkbox
            node-key="id"
            ref="permissionTree"
            :default-checked-keys="permissionForm.menuIds"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPermissionForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus, Operation, Delete } from '@element-plus/icons-vue'

// 对话框
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const dialogType = ref('add')
const roleFormRef = ref(null)
const permissionFormRef = ref(null)
const permissionTree = ref(null)

// 角色表单
const roleForm = ref({
  id: '',
  name: '',
  code: '',
  description: ''
})

// 权限表单
const permissionForm = ref({
  id: '',
  name: '',
  menuIds: []
})

// 表单验证规则
const roleRules = ref({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ]
})

// 角色列表
const roles = ref([])

// 菜单树
const menuTree = ref([
  {
    id: '1',
    label: '数据仪表盘',
    children: []
  },
  {
    id: '2',
    label: '用户管理',
    children: []
  },
  {
    id: '3',
    label: '内容管理',
    children: []
  },
  {
    id: '4',
    label: '权限管理',
    children: [
      {
        id: '4-1',
        label: '角色管理',
        children: []
      },
      {
        id: '4-2',
        label: '菜单管理',
        children: []
      }
    ]
  },
  {
    id: '5',
    label: '系统设置',
    children: []
  }
])

// 模拟角色数据
const mockRoles = [
  { id: '1', name: '管理员', code: 'admin', description: '系统管理员，拥有所有权限', createTime: '2024-01-01 10:00:00' },
  { id: '2', name: '编辑', code: 'editor', description: '内容编辑，拥有内容管理权限', createTime: '2024-01-02 10:00:00' },
  { id: '3', name: '普通用户', code: 'user', description: '普通用户，拥有基础权限', createTime: '2024-01-03 10:00:00' }
]

// 加载角色数据
const loadRoles = () => {
  // 模拟API请求
  setTimeout(() => {
    roles.value = mockRoles
  }, 500)
}

// 打开添加角色对话框
const openAddRoleDialog = () => {
  dialogType.value = 'add'
  roleForm.value = {
    id: '',
    name: '',
    code: '',
    description: ''
  }
  dialogVisible.value = true
}

// 打开编辑角色对话框
const openEditRoleDialog = (role) => {
  dialogType.value = 'edit'
  roleForm.value = { ...role }
  dialogVisible.value = true
}

// 提交角色表单
const submitRoleForm = () => {
  roleFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API请求
      setTimeout(() => {
        ElMessage({
          message: dialogType.value === 'add' ? '角色添加成功' : '角色编辑成功',
          type: 'success'
        })
        dialogVisible.value = false
        loadRoles()
      }, 500)
    }
  })
}

// 删除角色
const deleteRole = (roleId) => {
  ElMessageBox.confirm(
    '确定要删除该角色吗？',
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
        message: '角色删除成功',
        type: 'success'
      })
      loadRoles()
    }, 500)
  }).catch(() => {
    // 取消删除
  })
}

// 打开权限分配对话框
const openPermissionDialog = (role) => {
  permissionForm.value = {
    id: role.id,
    name: role.name,
    menuIds: ['1', '2', '3'] // 模拟已选权限
  }
  permissionDialogVisible.value = true
}

// 提交权限表单
const submitPermissionForm = () => {
  const checkedKeys = permissionTree.value.getCheckedKeys()
  permissionForm.value.menuIds = checkedKeys
  
  // 模拟API请求
  setTimeout(() => {
    ElMessage({
      message: '权限分配成功',
      type: 'success'
    })
    permissionDialogVisible.value = false
  }, 500)
}

onMounted(() => {
  loadRoles()
})
</script>

<style scoped>
.role-container {
  padding: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
