<template>
  <div class="data-source-page">
    <el-card class="card" shadow="never">
      <template #header>
        <span>数据源管理</span>
      </template>

      <el-form :model="queryForm" inline label-width="90px" class="query-form">
        <el-form-item label="数据源名称">
          <el-input v-model="queryForm.dataName" placeholder="请输入数据源名称" clearable style="width: 220px" />
        </el-form-item>
        <el-form-item label="数据源归属">
          <el-select v-model="queryForm.ownerType" placeholder="请选择归属" clearable style="width: 180px">
            <el-option v-for="item in ownerTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="queryForm.taskType" placeholder="请选择任务类型" clearable style="width: 220px">
            <el-option v-for="item in taskTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="query-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="openCreateDialog">新增数据源</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="card" shadow="never">
      <template #header>
        <span>数据源列表</span>
      </template>

      <el-table :data="filteredRecords" stripe style="width: 100%">
        <el-table-column label="序号" width="70">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="dataName" label="数据源名称" min-width="200" />
        <el-table-column label="数据源归属" min-width="120">
          <template #default="{ row }">{{ optionText(ownerTypeOptions, row.ownerType) }}</template>
        </el-table-column>
        <el-table-column label="任务类型" min-width="180">
          <template #default="{ row }">{{ optionText(taskTypeOptions, row.taskType) }}</template>
        </el-table-column>
        <el-table-column label="关联事件" min-width="180">
          <template #default="{ row }">{{ row.taskType === 'warning' ? optionText(eventOptions, row.eventId) : '-' }}</template>
        </el-table-column>
        <el-table-column prop="previewCount" label="筛选数据量" min-width="110" />
        <el-table-column prop="updateTime" label="更新时间" min-width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑数据源' : '新增数据源'" width="980px" @closed="handleDialogClosed">
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-width="110px">
        <el-form-item label="数据源名称" prop="dataName">
          <el-input v-model="dialogForm.dataName" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="数据源归属" prop="ownerType">
          <el-select v-model="dialogForm.ownerType" placeholder="请选择数据源归属" style="width: 100%">
            <el-option v-for="item in ownerTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="dialogForm.taskType" placeholder="请选择任务类型" style="width: 100%">
            <el-option v-for="item in taskTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogForm.taskType === 'warning'" label="关联事件" prop="eventId">
          <el-select v-model="dialogForm.eventId" placeholder="请选择关联事件" style="width: 100%">
            <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="isProjectTaskType" label="项目筛选条件" prop="businessSegment">
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

        <el-form-item v-else label="企业筛选条件" prop="companyName">
          <div class="filter-grid">
            <el-input v-model="dialogForm.companyName" placeholder="请输入企业名称" class="filter-item" />
            <el-input v-model="dialogForm.companyCode" placeholder="请输入统一社会信用代码" class="filter-item" />
          </div>
        </el-form-item>

        <el-form-item label="筛选结果">
          <el-table :data="previewRows" stripe border max-height="260" style="width: 100%">
            <el-table-column label="序号" width="60">
              <template #default="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column v-if="isProjectTaskType" prop="projectName" label="项目名称" min-width="180" />
            <el-table-column v-if="isProjectTaskType" prop="counterparty" label="交易对手" min-width="120" />
            <el-table-column v-if="isProjectTaskType" prop="amount" label="金额(万元)" min-width="120" />
            <el-table-column v-if="isProjectTaskType" prop="dueDate" label="到期日" min-width="120" />
            <el-table-column v-if="!isProjectTaskType" prop="companyName" label="企业名称" min-width="220" />
            <el-table-column v-if="!isProjectTaskType" prop="companyCode" label="统一社会信用代码" min-width="200" />
            <el-table-column v-if="!isProjectTaskType" prop="riskLevel" label="风险等级" min-width="100" />
            <el-table-column v-if="!isProjectTaskType" prop="industry" label="行业" min-width="120" />
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

const ownerTypeOptions = [
  { label: '手动任务', value: 'manual' },
  { label: '周期任务', value: 'periodic' }
]

const taskTypeOptions = [
  { label: '预警', value: 'warning' },
  { label: '报告', value: 'report' },
  { label: '企查查（企业信息核查）', value: 'qcc_basic' },
  { label: '企查查（失信核查）', value: 'qcc_dishonest' },
  { label: '企业预警通（新闻）', value: 'news_warning' }
]

const eventOptions = [
  { label: '融资预警事件', value: 'finance_warning' },
  { label: '合同履约事件', value: 'contract_event' },
  { label: '回款异常事件', value: 'repayment_issue' }
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

const projectDataPool = [
  {
    id: 1,
    taskType: 'report',
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
    taskType: 'report',
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
    taskType: 'warning',
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
  }
]

const enterpriseDataPool = [
  {
    id: 101,
    taskType: 'qcc_basic',
    companyName: '深圳市深投建设有限公司',
    companyCode: '91440300123456789A',
    riskLevel: '中',
    industry: '建筑'
  },
  {
    id: 102,
    taskType: 'qcc_dishonest',
    companyName: '广东华信实业有限公司',
    companyCode: '91440000765432109X',
    riskLevel: '高',
    industry: '制造'
  },
  {
    id: 103,
    taskType: 'news_warning',
    companyName: '广州城发产业运营集团',
    companyCode: '91440100ABCDEF1234',
    riskLevel: '中',
    industry: '园区运营'
  },
  {
    id: 104,
    taskType: 'qcc_basic',
    companyName: '深圳市云桥科技股份有限公司',
    companyCode: '91440300QWERTY5678',
    riskLevel: '低',
    industry: '信息技术'
  }
]

const defaultRecords = [
  {
    id: 1001,
    dataName: '省交建局报告源',
    ownerType: 'periodic',
    taskType: 'report',
    eventId: '',
    businessSegment: 'project-construction',
    projectRole: 'creditor',
    recourseFlag: 'yes',
    factoringType: 'open',
    receivableType: 'existing',
    poolMode: 'yes',
    factoringMode: 'direct',
    companyName: '',
    companyCode: '',
    previewCount: 2,
    updateTime: '2026-03-24 10:00:00'
  },
  {
    id: 1002,
    dataName: '企查查失信核查源',
    ownerType: 'manual',
    taskType: 'qcc_dishonest',
    eventId: '',
    businessSegment: '',
    projectRole: '',
    recourseFlag: '',
    factoringType: '',
    receivableType: '',
    poolMode: '',
    factoringMode: '',
    companyName: '广东',
    companyCode: '',
    previewCount: 1,
    updateTime: '2026-03-24 11:20:00'
  }
]

function nowDateTime() {
  const pad = (value) => String(value).padStart(2, '0')
  const date = new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function normalizeRecord(record) {
  const oldTaskType = record.periodicTaskType || ''
  const taskType = record.taskType || oldTaskType || 'report'
  return {
    id: record.id,
    dataName: record.dataName || '',
    ownerType: record.ownerType || 'periodic',
    taskType,
    eventId: record.eventId || '',
    businessSegment: record.businessSegment || '',
    projectRole: record.projectRole || '',
    recourseFlag: record.recourseFlag || '',
    factoringType: record.factoringType || '',
    receivableType: record.receivableType || '',
    poolMode: record.poolMode || '',
    factoringMode: record.factoringMode || '',
    companyName: record.companyName || '',
    companyCode: record.companyCode || '',
    previewCount: record.previewCount || 0,
    updateTime: record.updateTime || nowDateTime()
  }
}

function loadRecords() {
  const saved = localStorage.getItem(DATA_STORAGE_KEY)
  if (!saved) {
    const initial = defaultRecords.map(normalizeRecord)
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) {
      const normalized = parsed.map(normalizeRecord)
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(normalized))
      return normalized
    }
  } catch {}
  const fallback = defaultRecords.map(normalizeRecord)
  localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(fallback))
  return fallback
}

const records = ref(loadRecords())

function saveRecords() {
  localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(records.value))
}

const queryForm = reactive({
  dataName: '',
  ownerType: '',
  taskType: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogFormRef = ref(null)
const dialogForm = reactive({
  id: null,
  dataName: '',
  ownerType: 'periodic',
  taskType: 'report',
  eventId: '',
  businessSegment: '',
  projectRole: '',
  recourseFlag: '',
  factoringType: '',
  receivableType: '',
  poolMode: '',
  factoringMode: '',
  companyName: '',
  companyCode: ''
})

const isProjectTaskType = computed(() => ['warning', 'report'].includes(dialogForm.taskType))

const dialogRules = {
  dataName: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
  ownerType: [{ required: true, message: '请选择数据源归属', trigger: 'change' }],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  eventId: [
    {
      validator: (_, value, callback) => {
        if (dialogForm.taskType === 'warning' && !value) {
          callback(new Error('请选择关联事件'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  businessSegment: [
    {
      validator: (_, value, callback) => {
        if (isProjectTaskType.value && !value) {
          callback(new Error('请选择业务板块'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  projectRole: [
    {
      validator: (_, value, callback) => {
        if (isProjectTaskType.value && !value) {
          callback(new Error('请选择项目角色'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  recourseFlag: [
    {
      validator: (_, value, callback) => {
        if (isProjectTaskType.value && !value) {
          callback(new Error('请选择有无追索'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  factoringType: [
    {
      validator: (_, value, callback) => {
        if (isProjectTaskType.value && !value) {
          callback(new Error('请选择明暗类型'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  receivableType: [
    {
      validator: (_, value, callback) => {
        if (isProjectTaskType.value && !value) {
          callback(new Error('请选择应收账款类型'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  poolMode: [
    {
      validator: (_, value, callback) => {
        if (isProjectTaskType.value && !value) {
          callback(new Error('请选择池模式'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  factoringMode: [
    {
      validator: (_, value, callback) => {
        if (isProjectTaskType.value && !value) {
          callback(new Error('请选择直接/间接保理'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  companyName: [
    {
      validator: (_, value, callback) => {
        if (!isProjectTaskType.value && !value && !dialogForm.companyCode) {
          callback(new Error('企业名称或统一社会信用代码至少填写一项'))
          return
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  companyCode: [
    {
      validator: (_, value, callback) => {
        if (!isProjectTaskType.value && !value && !dialogForm.companyName) {
          callback(new Error('企业名称或统一社会信用代码至少填写一项'))
          return
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
}

const filteredRecords = computed(() =>
  records.value.filter((item) => {
    if (queryForm.dataName && !item.dataName.includes(queryForm.dataName)) return false
    if (queryForm.ownerType && item.ownerType !== queryForm.ownerType) return false
    if (queryForm.taskType && item.taskType !== queryForm.taskType) return false
    return true
  })
)

const previewRows = computed(() => {
  if (isProjectTaskType.value) {
    return projectDataPool.filter((item) => {
      if (dialogForm.taskType && item.taskType !== dialogForm.taskType) return false
      if (dialogForm.businessSegment && item.businessSegment !== dialogForm.businessSegment) return false
      if (dialogForm.projectRole && item.projectRole !== dialogForm.projectRole) return false
      if (dialogForm.recourseFlag && item.recourseFlag !== dialogForm.recourseFlag) return false
      if (dialogForm.factoringType && item.factoringType !== dialogForm.factoringType) return false
      if (dialogForm.receivableType && item.receivableType !== dialogForm.receivableType) return false
      if (dialogForm.poolMode && item.poolMode !== dialogForm.poolMode) return false
      if (dialogForm.factoringMode && item.factoringMode !== dialogForm.factoringMode) return false
      return true
    })
  }
  return enterpriseDataPool.filter((item) => {
    if (dialogForm.taskType && item.taskType !== dialogForm.taskType) return false
    if (dialogForm.companyName && !item.companyName.includes(dialogForm.companyName)) return false
    if (dialogForm.companyCode && !item.companyCode.includes(dialogForm.companyCode)) return false
    return true
  })
})

function optionText(options, value) {
  return options.find((item) => item.value === value)?.label || '-'
}

function resetDialogForm() {
  dialogForm.id = null
  dialogForm.dataName = ''
  dialogForm.ownerType = 'periodic'
  dialogForm.taskType = 'report'
  dialogForm.eventId = ''
  dialogForm.businessSegment = ''
  dialogForm.projectRole = ''
  dialogForm.recourseFlag = ''
  dialogForm.factoringType = ''
  dialogForm.receivableType = ''
  dialogForm.poolMode = ''
  dialogForm.factoringMode = ''
  dialogForm.companyName = ''
  dialogForm.companyCode = ''
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
  dialogForm.ownerType = row.ownerType
  dialogForm.taskType = row.taskType
  dialogForm.eventId = row.eventId || ''
  dialogForm.businessSegment = row.businessSegment || ''
  dialogForm.projectRole = row.projectRole || ''
  dialogForm.recourseFlag = row.recourseFlag || ''
  dialogForm.factoringType = row.factoringType || ''
  dialogForm.receivableType = row.receivableType || ''
  dialogForm.poolMode = row.poolMode || ''
  dialogForm.factoringMode = row.factoringMode || ''
  dialogForm.companyName = row.companyName || ''
  dialogForm.companyCode = row.companyCode || ''
  dialogVisible.value = true
}

function handleDialogClosed() {
  dialogFormRef.value?.clearValidate()
  resetDialogForm()
}

async function submitDialog() {
  await dialogFormRef.value.validate()

  const payload = normalizeRecord({
    id: dialogForm.id || Date.now(),
    dataName: dialogForm.dataName,
    ownerType: dialogForm.ownerType,
    taskType: dialogForm.taskType,
    eventId: dialogForm.taskType === 'warning' ? dialogForm.eventId : '',
    businessSegment: isProjectTaskType.value ? dialogForm.businessSegment : '',
    projectRole: isProjectTaskType.value ? dialogForm.projectRole : '',
    recourseFlag: isProjectTaskType.value ? dialogForm.recourseFlag : '',
    factoringType: isProjectTaskType.value ? dialogForm.factoringType : '',
    receivableType: isProjectTaskType.value ? dialogForm.receivableType : '',
    poolMode: isProjectTaskType.value ? dialogForm.poolMode : '',
    factoringMode: isProjectTaskType.value ? dialogForm.factoringMode : '',
    companyName: isProjectTaskType.value ? '' : dialogForm.companyName,
    companyCode: isProjectTaskType.value ? '' : dialogForm.companyCode,
    previewCount: previewRows.value.length,
    updateTime: nowDateTime()
  })

  if (isEdit.value) {
    const index = records.value.findIndex((item) => item.id === dialogForm.id)
    if (index > -1) {
      records.value[index] = payload
    }
    ElMessage.success('数据源修改成功')
  } else {
    records.value.unshift(payload)
    ElMessage.success('数据源新增成功')
  }
  saveRecords()
  dialogVisible.value = false
}

function handleDelete(row) {
  ElMessageBox.confirm(`确认删除数据源「${row.dataName}」？`, '提示', { type: 'warning' })
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
  queryForm.ownerType = ''
  queryForm.taskType = ''
}
</script>

<style lang="scss" scoped>
.data-source-page {
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
