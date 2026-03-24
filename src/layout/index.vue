<template>
  <el-container class="layout-container">
    <el-aside :width="sidebarWidth" class="layout-aside">
      <div class="logo">
        <span v-if="!sidebarCollapsed">Vue3 模板</span>
        <span v-else>V3</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="sidebarCollapsed"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/table">
          <el-icon><Grid /></el-icon>
          <template #title>表格示例</template>
        </el-menu-item>
        <el-menu-item index="/form">
          <el-icon><Document /></el-icon>
          <template #title>表单示例</template>
        </el-menu-item>
        <el-sub-menu index="task">
          <template #title>
            <el-icon><List /></el-icon>
            <span class="menu-title-text">任务管理</span>
          </template>
          <el-menu-item index="/task/manual">
            <el-icon><EditPen /></el-icon>
            <template #title>手动任务</template>
          </el-menu-item>
          <el-menu-item index="/task/periodic">
            <el-icon><Timer /></el-icon>
            <template #title>周期任务</template>
          </el-menu-item>
          <el-menu-item index="/task/data">
            <el-icon><Files /></el-icon>
            <template #title>数据源管理</template>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span class="menu-title-text">系统管理</span>
          </template>
          <el-menu-item index="/system/user">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/system/role">
            <el-icon><UserFilled /></el-icon>
            <template #title>角色管理</template>
          </el-menu-item>
          <el-menu-item index="/system/department">
            <el-icon><OfficeBuilding /></el-icon>
            <template #title>部门管理</template>
          </el-menu-item>
          <el-menu-item index="/system/permission">
            <el-icon><Lock /></el-icon>
            <template #title>权限管理</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container class="main-container">
      <el-header class="layout-header">
        <el-icon class="collapse-btn" @click="toggleSidebar">
          <Fold v-if="!sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
        <div class="header-right">
          <span class="user-name">{{ user.name || '未登录' }}</span>
          <el-dropdown @command="handleCommand">
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { HomeFilled, Grid, Document, List, Fold, Expand, ArrowDown, Setting, EditPen, Timer, Files, User, UserFilled, OfficeBuilding, Lock } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const sidebarCollapsed = computed(() => store.state.app.sidebarCollapsed)
const user = computed(() => store.state.user)
const activeMenu = computed(() => route.path)

const sidebarWidth = computed(() => (sidebarCollapsed.value ? '64px' : '210px'))

function toggleSidebar() {
  store.dispatch('app/toggleSidebar')
}

function handleCommand(command) {
  if (command === 'logout') {
    store.dispatch('user/logout')
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #304156;
  transition: width 0.28s;

  .logo {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    background: rgba(0, 0, 0, 0.2);
  }

  .el-menu {
    border-right: none;
  }

  /* 折叠菜单时，只保留二级菜单图标 */
  :deep(.el-menu--collapse) {
    .menu-title-text {
      display: none;
    }
  }
}

.main-container {
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .collapse-btn {
    font-size: 20px;
    cursor: pointer;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .user-name {
      font-size: 14px;
    }
  }
}

.layout-main {
  padding: 20px;
  background: #f0f2f5;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
