<template>
  <div class="content-container">
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>内容管理</span>
          <el-button type="primary" @click="openAddContentDialog">
              <el-icon><Plus /></el-icon>
              添加内容
            </el-button>
        </div>
      </template>
      
      <!-- 搜索表单 -->
      <el-form :inline="true" class="search-form" style="margin-bottom: 20px;">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类">
            <el-option label="全部" value="" />
            <el-option label="文章" value="article" />
            <el-option label="图片" value="image" />
            <el-option label="视频" value="video" />
            <el-option label="音频" value="audio" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="回收站" value="recycle" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="searchForm.publishTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchContent">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 内容列表 -->
      <el-table :data="contentList" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="title" label="标题" min-width="300">
          <template #default="scope">
            <span class="content-title">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100">
          <template #default="scope">
            <el-tag :type="getCategoryTagType(scope.row.category)">
              {{ getCategoryText(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="viewCount" label="浏览量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditContentDialog(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteContent(scope.row.id)">
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
    
    <!-- 添加/编辑内容对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加内容' : '编辑内容'"
      width="700px"
    >
      <el-form :model="contentForm" :rules="contentRules" ref="contentFormRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="contentForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="contentForm.category" placeholder="请选择分类">
            <el-option label="文章" value="article" />
            <el-option label="图片" value="image" />
            <el-option label="视频" value="video" />
            <el-option label="音频" value="audio" />
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="contentForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="封面图" prop="cover">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="handleCoverUpload"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="contentForm.cover" :src="contentForm.cover" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="contentForm.content"
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="contentForm.status" placeholder="请选择状态">
            <el-option label="发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitContentForm">确定</el-button>
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
  title: '',
  category: '',
  status: '',
  publishTime: []
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
const contentFormRef = ref(null)

// 内容表单
const contentForm = ref({
  id: '',
  title: '',
  category: '',
  author: '',
  cover: '',
  content: '',
  status: 'draft',
  viewCount: 0
})

// 表单验证规则
const contentRules = ref({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '请输入作者', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' }
  ]
})

// 内容列表
const contentList = ref([])

// 模拟内容数据
const mockContent = [
  { id: '1', title: 'Vue 3 新特性详解', category: 'article', author: 'admin', viewCount: 1234, status: 'published', publishTime: '2024-01-01 10:00:00' },
  { id: '2', title: 'Element Plus 使用指南', category: 'article', author: 'editor', viewCount: 5678, status: 'published', publishTime: '2024-01-02 10:00:00' },
  { id: '3', title: '前端性能优化技巧', category: 'article', author: 'admin', viewCount: 9012, status: 'published', publishTime: '2024-01-03 10:00:00' },
  { id: '4', title: 'TypeScript 入门教程', category: 'article', author: 'user1', viewCount: 3456, status: 'draft', publishTime: '2024-01-04 10:00:00' },
  { id: '5', title: 'React Hooks 最佳实践', category: 'article', author: 'user2', viewCount: 7890, status: 'recycle', publishTime: '2024-01-05 10:00:00' }
]

// 加载内容数据
const loadContent = () => {
  // 模拟API请求
  setTimeout(() => {
    contentList.value = mockContent
    pagination.value.total = mockContent.length
  }, 500)
}

// 搜索内容
const searchContent = () => {
  // 模拟搜索功能
  loadContent()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    title: '',
    category: '',
    status: '',
    publishTime: []
  }
  loadContent()
}

// 打开添加内容对话框
const openAddContentDialog = () => {
  dialogType.value = 'add'
  contentForm.value = {
    id: '',
    title: '',
    category: '',
    author: '',
    cover: '',
    content: '',
    status: 'draft',
    viewCount: 0
  }
  dialogVisible.value = true
}

// 打开编辑内容对话框
const openEditContentDialog = (content) => {
  dialogType.value = 'edit'
  contentForm.value = { ...content }
  dialogVisible.value = true
}

// 提交内容表单
const submitContentForm = () => {
  contentFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API请求
      setTimeout(() => {
        ElMessage({
          message: dialogType.value === 'add' ? '内容添加成功' : '内容编辑成功',
          type: 'success'
        })
        dialogVisible.value = false
        loadContent()
      }, 500)
    }
  })
}

// 删除内容
const deleteContent = (contentId) => {
  ElMessageBox.confirm(
    '确定要删除该内容吗？',
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
        message: '内容删除成功',
        type: 'success'
      })
      loadContent()
    }, 500)
  }).catch(() => {
    // 取消删除
  })
}

// 处理封面上传
const handleCoverUpload = (file) => {
  // 模拟上传
  contentForm.value.cover = URL.createObjectURL(file.raw)
}

// 封面上传前验证
const beforeCoverUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isJPG) {
    ElMessage.error('只能上传 JPG/PNG 图片!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 获取分类标签类型
const getCategoryTagType = (category) => {
  const typeMap = {
    article: 'primary',
    image: 'success',
    video: 'warning',
    audio: 'info'
  }
  return typeMap[category] || 'info'
}

// 获取分类文本
const getCategoryText = (category) => {
  const textMap = {
    article: '文章',
    image: '图片',
    video: '视频',
    audio: '音频'
  }
  return textMap[category] || category
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    published: 'success',
    draft: 'info',
    recycle: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    published: '发布',
    draft: '草稿',
    recycle: '回收站'
  }
  return textMap[status] || status
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  loadContent()
}

const handleCurrentChange = (current) => {
  pagination.value.currentPage = current
  loadContent()
}

onMounted(() => {
  loadContent()
})
</script>

<style scoped>
.content-container {
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

.content-title {
  font-weight: 500;
}

/* 上传组件样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
