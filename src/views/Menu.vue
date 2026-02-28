<template>
  <div class="menu-container">
    <el-card class="menu-card">
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="openAddMenuDialog">
              <el-icon><Plus /></el-icon>
              添加菜单
            </el-button>
        </div>
      </template>
      
      <!-- 菜单树 -->
      <div class="menu-tree-container">
        <el-tree
          :data="menuTree"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div class="menu-node">
              <span>{{ data.title }}</span>
              <span class="menu-node-actions">
                <el-button type="primary" size="small" @click.stop="openEditMenuDialog(data)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="success" size="small" @click.stop="openAddSubMenuDialog(data)">
                  <el-icon><Plus /></el-icon>
                </el-button>
                <el-button type="danger" size="small" @click.stop="deleteMenu(data.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </span>
            </div>
          </template>
        </el-tree>
      </div>
    </el-card>
    
    <!-- 添加/编辑菜单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加菜单' : '编辑菜单'"
      width="500px"
    >
      <el-form :model="menuForm" :rules="menuRules" ref="menuFormRef">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="menuForm.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch 
            v-model="menuForm.status" 
            active-value="1" 
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitMenuForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus, Delete } from '@element-plus/icons-vue'

const menuTree = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const menuFormRef = ref(null)
const currentMenu = ref(null)

// 菜单表单
const menuForm = ref({
  id: '',
  parentId: '',
  title: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  status: '1'
})

// 表单验证规则
const menuRules = ref({
  title: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ]
})

// 模拟菜单数据
const mockMenuTree = [
  {
    id: '1',
    title: '数据仪表盘',
    path: '/dashboard',
    component: 'Dashboard.vue',
    icon: 'i-ep-data-analysis',
    sort: 1,
    status: '1',
    children: []
  },
  {
    id: '2',
    title: '用户管理',
    path: '/user',
    component: 'User.vue',
    icon: 'i-ep-user',
    sort: 2,
    status: '1',
    children: []
  },
  {
    id: '3',
    title: '内容管理',
    path: '/content',
    component: 'Content.vue',
    icon: 'i-ep-document',
    sort: 3,
    status: '1',
    children: []
  },
  {
    id: '4',
    title: '权限管理',
    path: '',
    component: '',
    icon: 'i-ep-s-operation',
    sort: 4,
    status: '1',
    children: [
      {
        id: '4-1',
        title: '角色管理',
        path: '/role',
        component: 'Role.vue',
        icon: 'i-ep-s-operation',
        sort: 1,
        status: '1',
        children: []
      },
      {
        id: '4-2',
        title: '菜单管理',
        path: '/menu',
        component: 'Menu.vue',
        icon: 'i-ep-menu',
        sort: 2,
        status: '1',
        children: []
      }
    ]
  },
  {
    id: '5',
    title: '系统设置',
    path: '/system',
    component: 'System.vue',
    icon: 'i-ep-setting',
    sort: 5,
    status: '1',
    children: []
  }
]

// 加载菜单数据
const loadMenus = () => {
  // 模拟API请求
  setTimeout(() => {
    menuTree.value = mockMenuTree
  }, 500)
}

// 处理节点点击
const handleNodeClick = (data, node) => {
  // 处理节点点击逻辑
}

// 打开添加菜单对话框
const openAddMenuDialog = () => {
  dialogType.value = 'add'
  menuForm.value = {
    id: '',
    parentId: '',
    title: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    status: '1'
  }
  dialogVisible.value = true
}

// 打开添加子菜单对话框
const openAddSubMenuDialog = (menu) => {
  currentMenu.value = menu
  dialogType.value = 'add'
  menuForm.value = {
    id: '',
    parentId: menu.id,
    title: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    status: '1'
  }
  dialogVisible.value = true
}

// 打开编辑菜单对话框
const openEditMenuDialog = (menu) => {
  dialogType.value = 'edit'
  menuForm.value = { ...menu }
  dialogVisible.value = true
}

// 提交菜单表单
const submitMenuForm = () => {
  menuFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API请求
      setTimeout(() => {
        ElMessage({
          message: dialogType.value === 'add' ? '菜单添加成功' : '菜单编辑成功',
          type: 'success'
        })
        dialogVisible.value = false
        loadMenus()
      }, 500)
    }
  })
}

// 删除菜单
const deleteMenu = (menuId) => {
  ElMessageBox.confirm(
    '确定要删除该菜单吗？',
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
        message: '菜单删除成功',
        type: 'success'
      })
      loadMenus()
    }, 500)
  }).catch(() => {
    // 取消删除
  })
}

onMounted(() => {
  loadMenus()
})
</script>

<style scoped>
.menu-container {
  padding: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-tree-container {
  margin-top: 20px;
}

.menu-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.menu-node-actions {
  display: flex;
  gap: 8px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
