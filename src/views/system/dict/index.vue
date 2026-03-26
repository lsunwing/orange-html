<template>
  <div class="dict-page">
    <el-card class="card" shadow="never">
      <template #header>
        <span>字典管理</span>
      </template>

      <el-form :model="queryForm" inline label-width="90px" class="query-form">
        <el-form-item label="字典类型">
          <el-select v-model="queryForm.dictType" placeholder="请选择字典类型" clearable filterable style="width: 200px">
            <el-option v-for="item in dictTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="字典编码">
          <el-input v-model="queryForm.code" placeholder="请输入字典编码" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="映射值">
          <el-input v-model="queryForm.value" placeholder="请输入映射值" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item class="query-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="openCreateDialog">新增字典</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="card" shadow="never">
      <template #header>
        <span>字典列表</span>
      </template>

      <el-table :data="defaultRecords" border stripe style="width: 100%">
        <el-table-column label="序号" width="70">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="dictType" label="字典类型" min-width="140" show-overflow-tooltip />
        <el-table-column prop="dictTypeCode" label="类型编码" min-width="140" show-overflow-tooltip />
        <el-table-column prop="label" label="字典名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="code" label="字典编码" min-width="140" show-overflow-tooltip />
        <el-table-column prop="value" label="映射值" min-width="140" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="160" />
        <el-table-column prop="updater" label="修改人" min-width="100" />
        <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">修改</el-button>
            <el-button
              :type="row.status === 'active' ? 'danger' : 'success'"
              link
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '失效' : '生效' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑字典' : '新增字典'"
      width="560px"
      @closed="handleDialogClosed"
    >
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-width="100px">
        <el-form-item label="字典类型" prop="dictType">
          <el-select
            v-model="dialogForm.dictType"
            placeholder="请选择或新增字典类型"
            filterable
            allow-create
            clearable
            style="width: 100%"
          >
            <el-option v-for="item in dictTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型编码" prop="dictTypeCode">
          <el-input v-model="dialogForm.dictTypeCode" placeholder="请输入类型编码，如：PRODUCT_TYPE" />
        </el-form-item>
        <el-form-item label="字典名称" prop="label">
          <el-input v-model="dialogForm.label" placeholder="请输入字典名称，如：电子产品" />
        </el-form-item>
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="dialogForm.code" placeholder="请输入字典编码，如：ELECTRONICS" />
        </el-form-item>
        <el-form-item label="映射值" prop="value">
          <el-input v-model="dialogForm.value" placeholder="请输入映射值" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dialogForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialogForm.remark" type="textarea" :rows="3" placeholder="请输入备注（选填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDialog">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const DICT_STORAGE_KEY = 'system-dict-records'

const defaultRecords = [
  {
    id: 1,
    dictType: '产品类型',
    dictTypeCode: 'PRODUCT_TYPE',
    label: '电子产品',
    code: 'ELECTRONICS',
    value: 'electronics',
    status: 'active',
    remark: '',
    updateTime: '2026-03-20 10:00:00',
    updater: '管理员'
  },
  {
    id: 2,
    dictType: '产品类型',
    dictTypeCode: 'PRODUCT_TYPE',
    label: '服装',
    code: 'CLOTHING',
    value: 'clothing',
    status: 'active',
    remark: '',
    updateTime: '2026-03-20 10:00:00',
    updater: '管理员'
  },
  {
    id: 3,
    dictType: '产品类型',
    dictTypeCode: 'PRODUCT_TYPE',
    label: '图书',
    code: 'BOOKS',
    value: 'books',
    status: 'active',
    remark: '',
    updateTime: '2026-03-20 10:00:00',
    updater: '管理员'
  },
  {
    id: 4,
    dictType: '订单状态',
    dictTypeCode: 'ORDER_STATUS',
    label: '待支付',
    code: 'PENDING',
    value: 'pending',
    status: 'active',
    remark: '',
    updateTime: '2026-03-20 10:00:00',
    updater: '管理员'
  },
  {
    id: 5,
    dictType: '订单状态',
    dictTypeCode: 'ORDER_STATUS',
    label: '已支付',
    code: 'PAID',
    value: 'paid',
    status: 'active',
    remark: '',
    updateTime: '2026-03-20 10:00:00',
    updater: '管理员'
  },
  {
    id: 6,
    dictType: '订单状态',
    dictTypeCode: 'ORDER_STATUS',
    label: '已取消',
    code: 'CANCELED',
    value: 'canceled',
    status: 'inactive',
    remark: '',
    updateTime: '2026-03-20 10:00:00',
    updater: '管理员'
  },
  {
    id: 7,
    dictType: '性别',
    dictTypeCode: 'GENDER',
    label: '男',
    code: 'MALE',
    value: 'male',
    status: 'active',
    remark: '',
    updateTime: '2026-03-20 10:00:00',
    updater: '管理员'
  },
  {
    id: 8,
    dictType: '性别',
    dictTypeCode: 'GENDER',
    label: '女',
    code: 'FEMALE',
    value: 'female',
    status: 'active',
    remark: '',
    updateTime: '2026-03-20 10:00:00',
    updater: '管理员'
  }
]

function nowDateTime() {
  const pad = (v) => String(v).padStart(2, '0')
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function loadRecords() {
  const saved = localStorage.getItem(DICT_STORAGE_KEY)
  if (!saved) {
    localStorage.setItem(DICT_STORAGE_KEY, JSON.stringify(defaultRecords))
    return [...defaultRecords]
  }
  try {
    return JSON.parse(saved)
  } catch {
    localStorage.setItem(DICT_STORAGE_KEY, JSON.stringify(defaultRecords))
    return [...defaultRecords]
  }
}

const records = ref(loadRecords())

function saveRecords() {
  localStorage.setItem(DICT_STORAGE_KEY, JSON.stringify(records.value))
}

const dictTypeOptions = computed(() => {
  const types = [...new Set(records.value.map((r) => r.dictType))]
  return types.sort()
})

const queryForm = reactive({
  dictType: '',
  code: '',
  value: ''
})

const filteredRecords = computed(() =>
  records.value.filter((item) => {
    if (queryForm.dictType && item.dictType !== queryForm.dictType) return false
    if (queryForm.code && !item.code.toLowerCase().includes(queryForm.code.toLowerCase())) return false
    if (queryForm.value && !item.value.toLowerCase().includes(queryForm.value.toLowerCase())) return false
    return true
  })
)

const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogFormRef = ref(null)

const dialogForm = reactive({
  dictType: '',
  dictTypeCode: '',
  label: '',
  code: '',
  value: '',
  status: 'active',
  remark: ''
})

const dialogRules = {
  dictType: [{ required: true, message: '请选择或输入字典类型', trigger: 'change' }],
  dictTypeCode: [{ required: true, message: '请输入类型编码', trigger: 'blur' }],
  label: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
  value: [{ required: true, message: '请输入映射值', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

function resetDialogForm() {
  dialogForm.dictType = ''
  dialogForm.dictTypeCode = ''
  dialogForm.label = ''
  dialogForm.code = ''
  dialogForm.value = ''
  dialogForm.status = 'active'
  dialogForm.remark = ''
}

function openCreateDialog() {
  isEdit.value = false
  resetDialogForm()
  dialogVisible.value = true
}

function openEditDialog(row) {
  isEdit.value = true
  dialogForm.dictType = row.dictType
  dialogForm.dictTypeCode = row.dictTypeCode
  dialogForm.label = row.label
  dialogForm.code = row.code
  dialogForm.value = row.value
  dialogForm.status = row.status
  dialogForm.remark = row.remark || ''
  dialogVisible.value = true
}

function handleDialogClosed() {
  dialogFormRef.value?.clearValidate()
  resetDialogForm()
}

async function submitDialog() {
  await dialogFormRef.value.validate()

  const now = nowDateTime()
  const updater = '管理员'

  if (isEdit.value) {
    const index = records.value.findIndex((r) => r.id === dialogForm.id)
    if (index > -1) {
      records.value[index] = {
        ...records.value[index],
        dictType: dialogForm.dictType,
        dictTypeCode: dialogForm.dictTypeCode,
        label: dialogForm.label,
        code: dialogForm.code,
        value: dialogForm.value,
        status: dialogForm.status,
        remark: dialogForm.remark,
        updateTime: now,
        updater
      }
    }
    ElMessage.success('字典修改成功')
  } else {
    records.value.unshift({
      id: Date.now(),
      dictType: dialogForm.dictType,
      dictTypeCode: dialogForm.dictTypeCode,
      label: dialogForm.label,
      code: dialogForm.code,
      value: dialogForm.value,
      status: dialogForm.status,
      remark: dialogForm.remark,
      updateTime: now,
      updater
    })
    ElMessage.success('字典新增成功')
  }

  saveRecords()
  dialogVisible.value = false
}

function handleToggleStatus(row) {
  const newStatus = row.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '生效' : '失效'
  ElMessageBox.confirm(`确认将「${row.label}」设为${action}？`, '提示', { type: 'warning' })
    .then(() => {
      const index = records.value.findIndex((r) => r.id === row.id)
      if (index > -1) {
        records.value[index].status = newStatus
        records.value[index].updateTime = nowDateTime()
        records.value[index].updater = '管理员'
        saveRecords()
      }
      ElMessage.success(`${action}成功`)
    })
    .catch(() => {})
}

function handleSearch() {
  ElMessage.success(`查询到 ${filteredRecords.value.length} 条数据`)
}

function handleReset() {
  queryForm.dictType = ''
  queryForm.code = ''
  queryForm.value = ''
}
</script>

<style lang="scss" scoped>
.dict-page {
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
    margin-left: auto;
  }
}
</style>
