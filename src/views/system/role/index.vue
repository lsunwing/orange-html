<template>
  <div class="system-page">
    <!-- 上半部分：查询条件 -->
    <el-card class="card" shadow="never">
      <template #header>
        <span>角色管理</span>
      </template>

      <el-form :model="form" label-width="110px" inline class="query-form">
        <el-form-item label="角色名称">
          <el-input
            v-model="form.roleName"
            placeholder="请输入角色名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择" clearable style="width: 200px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
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
        <span>角色列表</span>
      </template>

      <el-table :data="filteredRoles" stripe style="width: 100%">
        <el-table-column label="序号" width="80">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" min-width="160" />
        <el-table-column prop="roleCode" label="角色标识" min-width="140" />

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

const form = reactive({
  roleName: '',
  status: null, // 1启用 / 0禁用
  createTime: [] // [start, end]
})

const roles = ref([
  {
    id: 1,
    roleName: '管理员',
    roleCode: 'ADMIN',
    status: 1,
    createTime: '2026-02-10 11:00:00',
    updateTime: '2026-03-12 09:30:00'
  },
  {
    id: 2,
    roleName: '普通用户',
    roleCode: 'USER',
    status: 1,
    createTime: '2026-02-20 09:00:00',
    updateTime: '2026-03-10 16:10:00'
  },
  {
    id: 3,
    roleName: '审核员',
    roleCode: 'AUDITOR',
    status: 0,
    createTime: '2026-03-02 14:20:00',
    updateTime: '2026-03-06 10:00:00'
  }
])

function toDateTime(v) {
  if (!v) return null
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(v)) return new Date(v + 'T00:00:00')
  return new Date(v.replace(' ', 'T'))
}

function statusTagType(status) {
  return status === 1 ? 'success' : 'info'
}

const filteredRoles = computed(() => {
  return roles.value.filter((r) => {
    if (form.roleName && !r.roleName.includes(form.roleName)) return false
    if (form.status !== null && form.status !== undefined && r.status !== form.status) return false

    if (form.createTime && form.createTime.length === 2) {
      const [start, end] = form.createTime
      const cr = toDateTime(r.createTime)
      const ds = toDateTime(start)
      const de = toDateTime(end)
      if (!cr || !ds || !de) return false
      de.setHours(23, 59, 59, 999)
      if (cr < ds || cr > de) return false
    }

    return true
  })
})

function handleSearch() {
  ElMessage.success(`已查询：${filteredRoles.value.length} 条`)
}

function handleReset() {
  form.roleName = ''
  form.status = null
  form.createTime = []
}

function handleEdit(row) {
  ElMessage.info(`编辑：${row.roleName}`)
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定删除角色「${row.roleName}」？`, '提示', { type: 'warning' })
    .then(() => {
      roles.value = roles.value.filter((r) => r.id !== row.id)
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

