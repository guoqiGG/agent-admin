<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo-container" v-if="!sidebarCollapsed">
          <img :src="logo" alt="管理后台" class="logo-img" />
          <h1 class="logo-text">管理后台</h1>
        </div>
        <div class="logo-icon" v-else>
          <img :src="logo" alt="管理后台" class="logo-img" />
        </div>
      </div>
      <nav class="sidebar-nav">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          router
          @select="handleMenuSelect"
          :collapse="sidebarCollapsed"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>
              <span>数据仪表盘</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <template #title>
              <span>用户管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/content">
            <el-icon><Document /></el-icon>
            <template #title>
              <span>内容管理</span>
            </template>
          </el-menu-item>
          <el-sub-menu index="permission">
            <template #title>
              <el-icon><Operation /></el-icon>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/role">
              <el-icon><UserFilled /></el-icon>
              <template #title>
                <span>角色管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/menu">
              <el-icon><Menu /></el-icon>
              <template #title>
                <span>菜单管理</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item 
            index="/system" 
            style="position: relative; z-index: 10; cursor: pointer;"
            @click="navigateToSystem"
          >
            <el-icon><Setting /></el-icon>
            <template #title>
              <span>系统设置</span>
            </template>
          </el-menu-item>
        </el-menu>
      </nav>
    </aside>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部栏 -->
      <header class="top-bar">
        <div class="top-bar-left">
          <el-button type="text" class="menu-toggle" @click="toggleSidebar">
            <el-icon v-if="!sidebarCollapsed"><Fold /></el-icon>
            <el-icon v-else><Expand /></el-icon>
          </el-button>
        </div>
        <div class="top-bar-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar>admin</el-avatar>
              <span>管理员</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><Setting /></el-icon>
                  <span>账号设置</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <!-- 内容区域 -->
      <div class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataAnalysis,
  User,
  Document,
  Operation,
  UserFilled,
  Menu,
  Setting,
  ArrowDown,
  SwitchButton,
  Fold,
  Expand,
  Star
} from '@element-plus/icons-vue'

import logo from './assets/logo.svg'

const route = useRoute()
const router = useRouter()
const sidebarCollapsed = ref(false)

// 响应式屏幕宽度
const handleResize = () => {
  const screenWidth = window.innerWidth
  // 当屏幕宽度小于768px时自动折叠菜单
  if (screenWidth < 768) {
    sidebarCollapsed.value = true
  } else {
    sidebarCollapsed.value = false
  }
}

// 挂载时添加监听器
onMounted(() => {
  handleResize() // 初始调用
  window.addEventListener('resize', handleResize)
})

// 卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 计算当前激活的菜单
const activeMenu = computed(() => {
  const path = route.path
  if (path === '/role' || path === '/menu') {
    return 'permission'
  }
  return path
})

// 监听路由变化，保持菜单激活状态
watch(
  () => route.path,
  (newPath) => {
    // 路由变化时的逻辑
  }
)

// 处理菜单选择
const handleMenuSelect = (key, keyPath) => {
  // 手动导航到对应路由
  if (key.startsWith('/')) {
    router.push(key)
  }
}

// 导航到系统设置页面
const navigateToSystem = () => {
  router.push('/system')
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background-color: #1f2d3d;
  color: #fff;
  transition: width 0.3s;
  overflow: hidden;
  z-index: 100;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #3c4b5a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #fff;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
}

.sidebar-nav {
  padding: 20px 0;
}

:deep(.el-menu){
  background-color: transparent !important;
  border-right: none !important;
}
/* 修复 Element Plus 菜单样式 */
:deep(.el-menu-vertical-demo) {
  background-color: transparent !important;
  border-right: none !important;
}

/* 子菜单容器 */
:deep(.sidebar .sidebar-nav .el-menu .el-sub-menu > .el-sub-menu__children) {
  background-color: #1f2d3d !important;
  margin: 0 10px !important;
  border-radius: 4px !important;
  overflow: hidden !important;
  border: none !important;
  box-shadow: none !important;
  padding: 5px 0 !important;
}

/* 子菜单项 */
:deep(.sidebar .sidebar-nav .el-menu .el-sub-menu > .el-sub-menu__children .el-menu-item) {
  background-color: #1f2d3d !important;
  color: rgba(255, 255, 255, 0.85) !important;
  margin: 2px 10px !important;
  border-radius: 4px !important;
  height: 40px !important;
  line-height: 40px !important;
  padding-left: 40px !important;
  border-bottom: none !important;
}

/* 子菜单项悬停和激活状态 */
:deep(.sidebar .sidebar-nav .el-menu .el-sub-menu > .el-sub-menu__children .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

:deep(.sidebar .sidebar-nav .el-menu .el-sub-menu > .el-sub-menu__children .el-menu-item.is-active) {
  background-color: rgba(129, 140, 248, 0.2) !important;
  color: #818cf8 !important;
}

/* 确保子菜单没有默认的白色背景 */
:deep(.el-sub-menu__children) {
  background-color: #1f2d3d !important;
}

/* 菜单项和子菜单标题 */
:deep(.sidebar .sidebar-nav .el-menu-item),
:deep(.sidebar .sidebar-nav .el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.85) !important;
  height: 50px !important;
  line-height: 50px !important;
  margin: 0 10px !important;
  border-radius: 4px !important;
  background-color: #1f2d3d !important;
}

:deep(.sidebar .sidebar-nav .el-menu-item:hover),
:deep(.sidebar .sidebar-nav .el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

:deep(.sidebar .sidebar-nav .el-menu-item.is-active) {
  background-color: rgba(129, 140, 248, 0.2) !important;
  color: #818cf8 !important;
}

:deep(.sidebar .sidebar-nav .el-menu-item.is-active::after) {
  background-color: #818cf8 !important;
}

:deep(.sidebar .sidebar-nav .el-sub-menu__icon-arrow) {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* 抖音点赞效果 */
:deep(.sidebar .sidebar-nav .el-menu-item.menu-like) {
  animation: menuLike 0.5s ease-in-out !important;
}

/* 爱心点赞图标 */
:deep(.sidebar .sidebar-nav .el-menu-item .like-heart) {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  z-index: 1;
  animation: heartBeat 0.5s ease-in-out;
}

.heart-icon {
  width: 20px;
  height: 20px;
  position: relative;
  transform: rotate(-45deg);
  background: linear-gradient(135deg, #ff4d4f, #ff7a9c);
  animation: heartScale 0.5s ease-in-out;
}

.heart-icon::before,
.heart-icon::after {
  content: '';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4d4f, #ff7a9c);
  position: absolute;
}

.heart-icon::before {
  top: -10px;
  left: 0;
}

.heart-icon::after {
  top: 0;
  left: 10px;
}

/* 爱心跳动动画 */
@keyframes heartBeat {
  0% {
    opacity: 0;
    transform: translateY(-50%) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-50%) scale(1);
  }
}

/* 爱心缩放动画 */
@keyframes heartScale {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
  width: calc(100vw - 240px);
  transition: width 0.3s;
}

/* 侧边栏折叠时的主内容区宽度 */
.sidebar.collapsed + .main-content {
  width: calc(100vw - 64px);
}

/* 顶部栏 */
.top-bar {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  position: relative;
}

.menu-toggle {
  font-size: 20px;
  margin-right: 20px;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info .el-avatar {
  margin-right: 10px;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 1000;
  }
  
  .sidebar.collapsed {
    left: -240px;
  }
  
  .main-content {
    width: 100vw !important;
    margin-left: 0;
  }
}
</style>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
  background-color: #f5f7fa;
}

/* 确保没有默认的body边距 */
body {
  margin: 0 !important;
  padding: 0 !important;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
