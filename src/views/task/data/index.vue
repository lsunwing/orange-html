<template>
  <div class="data-page">
    <el-card class="card" shadow="never">
      <template #header>
        <span>数据管理</span>
      </template>

      <el-form :model="queryForm" inline label-width="90px" class="query-form">
        <el-form-item label="数据名称">
          <el-input v-model="queryForm.dataName" placeholder="请输入数据名称" clearable style="width: 220px" />
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="queryForm.periodicTaskType" placeholder="请选择任务类型" clearable style="width: 180px">
            <el-option v-for="item in periodicTaskTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="query-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="openCreateDialog">新增数据</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="card" shadow="never">
      <template #header>
        <span>数据列表</span>
      </template>

      <el-table :data="filteredRecords" stripe style="width: 100%">
        <el-table-column label="序号" width="70">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="dataName" label="数据名称" min-width="180" />
        <el-table-column label="任务类型" width="100">
          <template #default="{ row }">{{ periodicTaskTypeText(row.periodicTaskType) }}</template>
        </el-table-column>
        <el-table-column label="业务板块" min-width="190">
          <template #default="{ row }">{{ optionText(businessSegmentOptions, row.businessSegment) }}</template>
        </el-table-column>
        <el-table-column label="项目角色" min-width="110">
          <template #default="{ row }">{{ optionText(projectRoleOptions, row.projectRole) }}</template>
        </el-table-column>
        <el-table-column label="有无追索" min-width="100">
          <template #default="{ row }">{{ optionText(yesNoOptions, row.recourseFlag) }}</template>
        </el-table-column>
        <el-table-column label="明暗类型" min-width="110">
          <template #default="{ row }">{{ optionText(factoringTypeOptions, row.factoringType) }}</template>
        </el-table-column>
        <el-table-column label="应收账款" min-width="150">
          <template #default="{ row }">{{ optionText(receivableTypeOptions, row.receivableType) }}</template>
        </el-table-column>
        <el-table-column label="池模式" min-width="90">
          <template #default="{ row }">{{ optionText(yesNoOptions, row.poolMode) }}</template>
        </el-table-column>
        <el-table-column label="直接/间接保理" min-width="140">
          <template #default="{ row }">{{ optionText(factoringModeOptions, row.factoringMode) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑数据' : '新增数据'" width="980px" @closed="handleDialogClosed">
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-width="100px">
        <el-form-item label="数据名称" prop="dataName">
          <el-input v-model="dialogForm.dataName" placeholder="请输入数据名称" />
        </el-form-item>
        <el-form-item label="任务类型" prop="periodicTaskType">
          <el-select v-model="dialogForm.periodicTaskType" placeholder="请选择任务类型" style="width: 100%">
            <el-option v-for="item in periodicTaskTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="筛选条件" prop="businessSegment">
          <div class="filter-grid">
            <el-select v-model="dialogForm.businessSegment" placeholder="请选择业务板块" class="filter-item">
              <el-option v-for="item in businessSegmentOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="dialogForm.projectRole" placeholder="请选择项目角色" class="filter-item">
              <el-option v-for="item in projectRoleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="dialogForm.recourseFlag" placeholder="请选择有无追索" class="filter-item">
              <el-option v-for="item in yesNoOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="dialogForm.factoringType" placeholder="请选择明暗类型" class="filter-item">
              <el-option v-for="item in factoringTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="dialogForm.receivableType" placeholder="请选择应收账款类型" class="filter-item">
              <el-option v-for="item in receivableTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="dialogForm.poolMode" placeholder="请选择池模式" class="filter-item">
              <el-option v-for="item in yesNoOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="dialogForm.factoringMode" placeholder="请选择直接/间接保理" class="filter-item">
              <el-option v-for="item in factoringModeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="筛选结果">
          <el-table :data="previewRows" stripe border max-height="260" style="width: 100%">
            <el-table-column label="序号" width="60">
              <template #default="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目名称" min-width="180" />
            <el-table-column prop="counterparty" label="交易对手" min-width="120" />
            <el-table-column prop="amount" label="金额(万元)" min-width="120" />
            <el-table-column prop="dueDate" label="到期日" min-width="120" />
          </el-table>
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

const DATA_STORAGE_KEY = 'task-data-records'

const periodicTaskTypeOptions = [
  { label: '预警', value: 'warning' },
  { label: '报告', value: 'report' }
]

const businessSegmentOptions = [
  { label: '工程建设业务-省交建局业务', value: 'project-construction' },
  { label: '权属企业业务', value: 'subsidiary-enterprise' },
  { label: '城更及园区开发业务', value: 'urban-renewal' }
]

const projectRoleOptions = [
  { label: '债权人', value: 'creditor' },
  { label: '债务人', value: 'debtor' },
  { label: '担保人', value: 'guarantor' }
]

const yesNoOptions = [
  { label: '有', value: 'yes' },
  { label: '无', value: 'no' }
]

const factoringTypeOptions = [
  { label: '明保理', value: 'open' },
  { label: '暗保理', value: 'dark' }
]

const receivableTypeOptions = [
  { label: '现有', value: 'existing' },
  { label: '将有', value: 'future' },
  { label: '现有或将有', value: 'existing_or_future' }
]

const factoringModeOptions = [
  { label: '直接', value: 'direct' },
  { label: '间接', value: 'indirect' }
]

const rawDataPool = [
  {
    id: 1,
    periodicTaskType: 'report',
    businessSegment: 'project-construction',
    projectRole: 'creditor',
    recourseFlag: 'yes',
    factoringType: 'open',
    receivableType: 'existing',
    poolMode: 'yes',
    factoringMode: 'direct',
    projectName: '省交建局路网改造项目A',
    counterparty: '省交建局',
    amount: 1200,
    dueDate: '2026-09-30'
  },
  {
    id: 2,
    periodicTaskType: 'report',
    businessSegment: 'project-construction',
    projectRole: 'creditor',
    recourseFlag: 'yes',
    factoringType: 'open',
    receivableType: 'future',
    poolMode: 'no',
    factoringMode: 'direct',
    projectName: '省交建局桥隧维护项目B',
    counterparty: '省交建局',
    amount: 860,
    dueDate: '2026-11-15'
  },
  {
    id: 3,
    periodicTaskType: 'warning',
    businessSegment: 'subsidiary-enterprise',
    projectRole: 'debtor',
    recourseFlag: 'no',
    factoringType: 'dark',
    receivableType: 'existing_or_future',
    poolMode: 'no',
    factoringMode: 'indirect',
    projectName: '权属企业采购周转项目C',
    counterparty: '权属企业集团',
    amount: 540,
    dueDate: '2026-07-20'
  },
  {
    id: 4,
    periodicTaskType: 'warning',
    businessSegment: 'urban-renewal',
    projectRole: 'guarantor',
    recourseFlag: 'yes',
    factoringType: 'dark',
    receivableType: 'existing',
    poolMode: 'yes',
    factoringMode: 'indirect',
    projectName: '园区开发保障项目D',
    counterparty: '城更平台公司',
    amount: 980,
    dueDate: '2026-10-01'
  },
  {
    id: 5,
    periodicTaskType: 'report',
    businessSegment: 'subsidiary-enterprise',
    projectRole: 'creditor',
    recourseFlag: 'no',
    factoringType: 'open',
    receivableType: 'existing_or_future',
    poolMode: 'yes',
    factoringMode: 'direct',
    projectName: '权属企业渠道扩展项目E',
    counterparty: '权属企业集团',
    amount: 430,
    dueDate: '2026-08-18'
  },
  {
    id: 6,
    periodicTaskType: 'warning',
    businessSegment: 'project-construction',
    projectRole: 'debtor',
    recourseFlag: 'yes',
    factoringType: 'open',
    receivableType: 'future',
    poolMode: 'no',
    factoringMode: 'direct',
    projectName: '省交建局应收预警项目F',
    counterparty: '省交建局',
    amount: 760,
    dueDate: '2026-06-28'
  }
]

const defaultRecords = [
  {
    id: 1001,
    dataName: '省交建局-债权人-明保理池',
    periodicTaskType: 'report',
    businessSegment: 'project-construction',
    projectRole: 'creditor',
    recourseFlag: 'yes',
    factoringType: 'open',
    receivableType: 'existing',
    poolMode: 'yes',
    factoringMode: 'direct'
  },
  {
    id: 1002,
    dataName: '权属企业-债务人-暗保理',
    periodicTaskType: 'warning',
    businessSegment: 'subsidiary-enterprise',
    projectRole: 'debtor',
    recourseFlag: 'no',
    factoringType: 'dark',
    receivableType: 'existing_or_future',
    poolMode: 'no',
    factoringMode: 'indirect'
  }
]

function loadRecords() {
  const saved = localStorage.getItem(DATA_STORAGE_KEY)
  if (!saved) {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(defaultRecords))
    return [...defaultRecords]
  }
  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) return parsed
  } catch {}
  localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(defaultRecords))
  return [...defaultRecords]
}

const records = ref(loadRecords())

function saveRecords() {
  localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(records.value))
}

const queryForm = reactive({
  dataName: '',
  periodicTaskType: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogFormRef = ref(null)
const dialogForm = reactive({
  id: null,
  dataName: '',
  periodicTaskType: '',
  businessSegment: '',
  projectRole: '',
  recourseFlag: '',
  factoringType: '',
  receivableType: '',
  poolMode: '',
  factoringMode: ''
})

const dialogRules = {
  dataName: [{ required: true, message: '请输入数据名称', trigger: 'blur' }],
  periodicTaskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  businessSegment: [{ required: true, message: '请选择业务板块', trigger: 'change' }],
  projectRole: [{ required: true, message: '请选择项目角色', trigger: 'change' }],
  recourseFlag: [{ required: true, message: '请选择有无追索', trigger: 'change' }],
  factoringType: [{ required: true, message: '请选择明暗类型', trigger: 'change' }],
  receivableType: [{ required: true, message: '请选择应收账款类型', trigger: 'change' }],
  poolMode: [{ required: true, message: '请选择池模式', trigger: 'change' }],
  factoringMode: [{ required: true, message: '请选择直接/间接保理', trigger: 'change' }]
}

const filteredRecords = computed(() =>
  records.value.filter((item) => {
    if (queryForm.dataName && !item.dataName.includes(queryForm.dataName)) return false
    if (queryForm.periodicTaskType && item.periodicTaskType !== queryForm.periodicTaskType) return false
    return true
  })
)

const previewRows = computed(() => {
  return rawDataPool.filter((item) => {
    if (dialogForm.periodicTaskType && item.periodicTaskType !== dialogForm.periodicTaskType) return false
    if (dialogForm.businessSegment && item.businessSegment !== dialogForm.businessSegment) return false
    if (dialogForm.projectRole && item.projectRole !== dialogForm.projectRole) return false
    if (dialogForm.recourseFlag && item.recourseFlag !== dialogForm.recourseFlag) return false
    if (dialogForm.factoringType && item.factoringType !== dialogForm.factoringType) return false
    if (dialogForm.receivableType && item.receivableType !== dialogForm.receivableType) return false
    if (dialogForm.poolMode && item.poolMode !== dialogForm.poolMode) return false
    if (dialogForm.factoringMode && item.factoringMode !== dialogForm.factoringMode) return false
    return true
  })
})

function optionText(options, value) {
  return options.find((item) => item.value === value)?.label || '-'
}

function periodicTaskTypeText(value) {
  return optionText(periodicTaskTypeOptions, value)
}

function resetDialogForm() {
  dialogForm.id = null
  dialogForm.dataName = ''
  dialogForm.periodicTaskType = ''
  dialogForm.businessSegment = ''
  dialogForm.projectRole = ''
  dialogForm.recourseFlag = ''
  dialogForm.factoringType = ''
  dialogForm.receivableType = ''
  dialogForm.poolMode = ''
  dialogForm.factoringMode = ''
}

function openCreateDialog() {
  isEdit.value = false
  resetDialogForm()
  dialogVisible.value = true
}

function openEditDialog(row) {
  isEdit.value = true
  dialogForm.id = row.id
  dialogForm.dataName = row.dataName
  dialogForm.periodicTaskType = row.periodicTaskType
  dialogForm.businessSegment = row.businessSegment
  dialogForm.projectRole = row.projectRole
  dialogForm.recourseFlag = row.recourseFlag
  dialogForm.factoringType = row.factoringType
  dialogForm.receivableType = row.receivableType
  dialogForm.poolMode = row.poolMode
  dialogForm.factoringMode = row.factoringMode
  dialogVisible.value = true
}

function handleDialogClosed() {
  dialogFormRef.value?.clearValidate()
  resetDialogForm()
}

async function submitDialog() {
  await dialogFormRef.value.validate()

  if (isEdit.value) {
    const index = records.value.findIndex((item) => item.id === dialogForm.id)
    if (index > -1) {
      records.value[index] = { ...dialogForm }
    }
    ElMessage.success('数据修改成功')
  } else {
    records.value.unshift({
      ...dialogForm,
      id: Date.now()
    })
    ElMessage.success('数据新增成功')
  }
  saveRecords()
  dialogVisible.value = false
}

function handleDelete(row) {
  ElMessageBox.confirm(`确认删除数据「${row.dataName}」？`, '提示', { type: 'warning' })
    .then(() => {
      records.value = records.value.filter((item) => item.id !== row.id)
      saveRecords()
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function handleSearch() {
  ElMessage.success(`已查询：${filteredRecords.value.length} 条`)
}

function handleReset() {
  queryForm.dataName = ''
  queryForm.periodicTaskType = ''
}
</script>

<style lang="scss" scoped>
.data-page {
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

  .filter-grid {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-item {
    width: calc((100% - 24px) / 4);
  }
}
</style>
