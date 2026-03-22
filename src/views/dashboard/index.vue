<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#409EFF"><User /></el-icon>
            <div>
              <div class="stat-value">1,234</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#67C23A"><Document /></el-icon>
            <div>
              <div class="stat-value">567</div>
              <div class="stat-label">订单数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#E6A23C"><Goods /></el-icon>
            <div>
              <div class="stat-value">89</div>
              <div class="stat-label">商品种类</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#F56C6C"><Money /></el-icon>
            <div>
              <div class="stat-value">¥12,345</div>
              <div class="stat-label">今日收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="welcome-card">
      <h2>欢迎使用 Vue3 + Element Plus + Vuex 模板</h2>
      <p>当前用户：{{ user.name || '未设置' }}</p>
      <p>这是一个基于 Vue 3、Element Plus 和 Vuex 的前端模板，已包含布局、路由、状态管理和示例页面。</p>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { User, Document, Goods, Money } from '@element-plus/icons-vue'

const store = useStore()
const user = computed(() => store.state.user)
</script>

<style lang="scss" scoped>
.dashboard {
  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;

    .stat-value {
      font-size: 24px;
      font-weight: 600;
    }
    .stat-label {
      font-size: 14px;
      color: #909399;
    }
  }

  .welcome-card {
    margin-top: 20px;

    h2 {
      margin: 0 0 16px;
      font-size: 20px;
    }
    p {
      margin: 8px 0;
      color: #606266;
    }
  }
}
</style>
