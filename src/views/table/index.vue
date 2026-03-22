<template>
  <div class="table-page">
    <el-card>
      <template #header>
        <span>表格示例</span>
        <el-button type="primary" style="float: right" @click="handleAdd">新增</el-button>
      </template>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="tableData.length"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const currentPage = ref(1)
const tableData = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '用户' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户' }
])

function handleAdd() {
  ElMessage.info('点击了新增')
}

function handleEdit(row) {
  ElMessage.info(`编辑：${row.name}`)
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定删除 ${row.name}？`, '提示', {
    type: 'warning'
  }).then(() => {
    tableData.value = tableData.value.filter((item) => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}
</script>

<style lang="scss" scoped>
.table-page {
  :deep(.el-card__header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
