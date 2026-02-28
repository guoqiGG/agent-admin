import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      title: '数据仪表盘'
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue'),
    meta: {
      title: '用户管理'
    }
  },
  {
    path: '/content',
    name: 'Content',
    component: () => import('../views/Content.vue'),
    meta: {
      title: '内容管理'
    }
  },
  {
    path: '/role',
    name: 'Role',
    component: () => import('../views/Role.vue'),
    meta: {
      title: '角色管理'
    }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue'),
    meta: {
      title: '菜单管理'
    }
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('../views/System.vue'),
    meta: {
      title: '系统设置'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - 管理后台'
  }
  next()
})

export default router
