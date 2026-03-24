import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', noLayout: true }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index.vue'),
        meta: { title: '表格示例', icon: 'Grid' }
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/form/index.vue'),
        meta: { title: '表单示例', icon: 'Document' }
      },
      {
        path: 'task',
        name: 'TaskManage',
        redirect: '/task/manual',
        meta: { title: '任务管理', icon: 'List' },
        children: [
          {
            path: 'manual',
            name: 'TaskManual',
            component: () => import('@/views/task/manual/index.vue'),
            meta: { title: '手动任务', taskType: 'manual' }
          },
          {
            path: 'periodic',
            name: 'TaskPeriodic',
            component: () => import('@/views/task/periodic/index.vue'),
            meta: { title: '周期任务', taskType: 'periodic' }
          },
          {
            path: 'data',
            name: 'DataManage',
            component: () => import('@/views/task/data/index.vue'),
            meta: { title: '数据源管理' }
          }
        ]
      },
      {
        path: 'data',
        redirect: '/task/data'
      },
      {
        path: 'system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'system/department',
        name: 'SystemDepartment',
        component: () => import('@/views/system/department/index.vue'),
        meta: { title: '部门管理' }
      },
      {
        path: 'system/permission',
        name: 'SystemPermission',
        component: () => import('@/views/system/permission/index.vue'),
        meta: { title: '权限管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Vue3 模板` : 'Vue3 模板'
  next()
})

export default router
