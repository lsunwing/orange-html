<template>
  <div class="system-page">
    <!-- 上半部分：查询条件 -->
    <el-card class="card" shadow="never">
      <template #header>
        <span>用户管理</span>
      </template>

      <el-form :model="form" label-width="110px" inline class="query-form">
        <el-form-item label="用户名称">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="角色名称">
          <el-input
            v-model="form.roleName"
            placeholder="请输入角色名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="部门名称">
          <el-input
            v-model="form.departmentName"
            placeholder="请输入部门名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="form.createTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 300px"
            clearable
          />
        </el-form-item>

        <el-form-item class="query-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下半部分：展示列表 -->
    <el-card class="card" shadow="never">
      <template #header>
        <span>用户列表</span>
      </template>

      <el-table :data="filteredUsers" stripe style="width: 100%">
        <el-table-column label="序号" width="80">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column prop="roleName" label="角色" min-width="140" />
        <el-table-column prop="departmentName" label="部门" min-width="140" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column prop="updateTime" label="更新时间" min-width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 查询条件
const form = reactive({
  username: '',
  roleName: '',
  departmentName: '',
  createTime: [] // [start, end]，value-format 为 YYYY-MM-DD
})

// 表格数据：先写死（模拟后端返回）
const users = ref([
  {
    id: 1,
    username: '张三',
    phone: '13800000001',
    roleName: '管理员',
    departmentName: '研发部',
    status: 1,
    createTime: '2026-03-01 10:20:30',
    updateTime: '2026-03-10 15:40:20'
  },
  {
    id: 2,
    username: '李四',
    phone: '13800000002',
    roleName: '普通用户',
    departmentName: '运营部',
    status: 1,
    createTime: '2026-02-20 09:10:00',
    updateTime: '2026-03-11 08:22:10'
  },
  {
    id: 3,
    username: '王五',
    phone: '13800000003',
    roleName: '审核员',
    departmentName: '财务部',
    status: 0,
    createTime: '2026-03-05 18:05:45',
    updateTime: '2026-03-06 12:00:00'
  },
  {
    id: 4,
    username: '赵六',
    phone: '13800000004',
    roleName: '普通用户',
    departmentName: '研发部',
    status: 1,
    createTime: '2026-03-12 11:30:00',
    updateTime: '2026-03-13 09:00:00'
  }
])

function toDateTime(v) {
  if (!v) return null
  // 支持两种格式：YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(v)) return new Date(v + 'T00:00:00')
  return new Date(v.replace(' ', 'T'))
}

function statusTagType(status) {
  return status === 1 ? 'success' : 'info'
}

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    if (form.username && !u.username.includes(form.username)) return false
    if (form.roleName && !u.roleName.includes(form.roleName)) return false
    if (form.departmentName && !u.departmentName.includes(form.departmentName)) return false

    if (form.createTime && form.createTime.length === 2) {
      const [start, end] = form.createTime
      const cu = toDateTime(u.createTime)
      const ds = toDateTime(start)
      const de = toDateTime(end)
      if (!cu || !ds || !de) return false

      // end 当天取到 23:59:59.999（包含边界）
      de.setHours(23, 59, 59, 999)
      if (cu < ds || cu > de) return false
    }

    return true
  })
})

function handleSearch() {
  // 筛选逻辑在 computed 里自动生效，这里用于给用户一点反馈
  ElMessage.success(`已查询：${filteredUsers.value.length} 条`)
}

function handleReset() {
  form.username = ''
  form.roleName = ''
  form.departmentName = ''
  form.createTime = []
}

function handleEdit(row) {
  ElMessage.info(`编辑：${row.username}`)
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定删除用户「${row.username}」？`, '提示', { type: 'warning' })
    .then(() => {
      users.value = users.value.filter((u) => u.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.system-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .card {
    width: 100%;
  }

  .query-form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    :deep(.el-form-item__content) {
      line-height: normal;
    }

    /* el-form inline 下默认会给右间距，这里用 flex 的 gap 控制 */
    :deep(.el-form-item--inline) {
      margin-right: 0;
    }

    :deep(.el-form-item) {
      margin-bottom: 12px;
    }
  }

  .query-actions {
    display: flex;
    gap: 12px;
    margin-left: auto; /* 把按钮推到最右侧 */
  }
}
</style>

