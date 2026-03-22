<template>
  <div class="task-page">
    <el-card class="card" shadow="never">
      <template #header>
        <span>{{ pageTaskTypeLabel }}查询</span>
      </template>

      <el-form :model="queryForm" label-width="100px" inline class="query-form">
        <el-form-item label="任务名称">
          <el-input v-model="queryForm.taskName" placeholder="请输入任务名称" clearable style="width: 220px" />
        </el-form-item>

        <el-form-item v-if="!fixedTaskType" label="任务类型">
          <el-select v-model="queryForm.taskType" placeholder="请选择任务类型" clearable style="width: 180px">
            <el-option
              v-for="item in taskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="fixedTaskType === 'periodic' || queryForm.taskType === 'periodic'"
          label="任务类型"
        >
          <el-select v-model="queryForm.periodicTaskType" placeholder="请选择任务类型" clearable style="width: 180px">
            <el-option
              v-for="item in periodicTaskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="query-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="openCreateDialog">创建任务</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="card" shadow="never">
      <template #header>
        <span>{{ pageTaskTypeLabel }}列表</span>
      </template>

      <el-table :data="filteredTasks" stripe style="width: 100%">
        <el-table-column label="序号" width="70">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="150" />
        <el-table-column label="任务类型" width="110">
          <template #default="{ row }">
            <el-tag :type="row.taskType === 'manual' ? 'info' : 'success'">
              {{ taskTypeText(row.taskType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="周期任务类型" min-width="140">
          <template #default="{ row }">
            {{ row.taskType === 'periodic' ? periodicTaskTypeText(row.periodicTaskType) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="taskCode" label="任务编码" min-width="180" show-overflow-tooltip />
        <el-table-column label="关联数据" min-width="220">
          <template #default="{ row }">{{ row.taskType === 'periodic' ? dataNameText(row.dataId) : '-' }}</template>
        </el-table-column>
        <el-table-column label="周期执行配置" min-width="240">
          <template #default="{ row }">{{ row.taskType === 'periodic' ? periodicScheduleText(row) : '-' }}</template>
        </el-table-column>
        <el-table-column label="任务状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusInfo(row).type">{{ statusInfo(row).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastRunTime" label="最近执行时间" min-width="170" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.taskType === 'manual'" type="primary" link @click="handleStart(row)">手动启动</el-button>
            <el-button
              v-if="row.taskType === 'periodic' && row.status === 'running'"
              type="warning"
              link
              @click="handlePause(row)"
            >
              手动暂停
            </el-button>
            <el-button
              v-if="row.taskType === 'periodic' && row.status === 'paused'"
              type="success"
              link
              @click="handleResume(row)"
            >
              手动恢复
            </el-button>
            <el-button type="primary" link @click="openEditDialog(row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '修改任务' : '创建任务'" width="980px" @closed="handleDialogClosed">
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-width="110px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="dialogForm.taskName" placeholder="请输入任务名称" />
        </el-form-item>

        <el-form-item v-if="!fixedTaskType" label="任务类型" prop="taskType">
          <el-select v-model="dialogForm.taskType" placeholder="请选择任务类型" style="width: 100%" @change="handleTaskTypeChange">
            <el-option
              v-for="item in taskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="任务编码" prop="taskCode">
          <el-input v-model="dialogForm.taskCode" placeholder="请输入任务编码" />
        </el-form-item>

        <el-form-item v-if="dialogForm.taskType === 'periodic'" label="任务类型" prop="periodicTaskType">
          <el-select
            v-model="dialogForm.periodicTaskType"
            placeholder="请选择任务类型"
            style="width: 100%"
            @change="handlePeriodicTaskTypeChange"
          >
            <el-option
              v-for="item in periodicTaskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogForm.taskType === 'periodic'" label="关联数据" prop="dataId">
          <el-select v-model="dialogForm.dataId" placeholder="请选择数据" style="width: 100%" filterable clearable>
            <el-option
              v-for="item in selectableDataOptions"
              :key="item.id"
              :label="item.dataName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="dialogForm.taskType === 'periodic'" label="执行周期" prop="cycleType">
          <el-select v-model="dialogForm.cycleType" placeholder="请选择执行周期" style="width: 100%">
            <el-option
              v-for="item in cycleTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogForm.taskType === 'periodic' && dialogForm.cycleType === 'week'"
          label="执行星期"
          prop="cycleValues"
        >
          <el-checkbox-group v-model="dialogForm.cycleValues" class="cycle-checkbox-group">
            <el-checkbox
              v-for="item in weekOptions"
              :key="item.value"
              :label="item.value"
              class="cycle-checkbox-item"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item
          v-if="dialogForm.taskType === 'periodic' && dialogForm.cycleType === 'month'"
          label="执行日期"
          prop="cycleValues"
        >
          <el-checkbox-group v-model="dialogForm.cycleValues" class="cycle-checkbox-group">
            <el-checkbox
              v-for="item in monthDayOptions"
              :key="item"
              :label="item"
              class="cycle-checkbox-item"
            >
              {{ item }}日
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item v-if="dialogForm.taskType === 'periodic'" label="执行时间点" prop="scheduleTime">
          <el-time-picker
            v-model="dialogForm.scheduleTime"
            placeholder="请选择执行时间点"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
            style="width: 100%"
          />
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const taskTypeOptions = [
  { label: '手动任务', value: 'manual' },
  { label: '周期性任务', value: 'periodic' }
]

const periodicTaskTypeOptions = [
  { label: '预警', value: 'warning' },
  { label: '报告', value: 'report' }
]

const DATA_STORAGE_KEY = 'task-data-records'
const DEFAULT_DATA_OPTIONS = [
  {
    id: 1001,
    dataName: '省交建局-债权人-明保理池',
    periodicTaskType: 'report'
  },
  {
    id: 1002,
    dataName: '权属企业-债务人-暗保理',
    periodicTaskType: 'warning'
  }
]

const cycleTypeOptions = [
  { label: '天', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' }
]

const weekOptions = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 7 }
]

const monthDayOptions = Array.from({ length: 31 }, (_, index) => index + 1)

const route = useRoute()
const fixedTaskType = computed(() => route.meta.taskType || '')
const pageTaskTypeLabel = computed(() => {
  if (!fixedTaskType.value) return '任务'
  return taskTypeText(fixedTaskType.value)
})

const queryForm = reactive({
  taskName: '',
  taskType: '',
  periodicTaskType: ''
})

const dataOptions = ref([])

const tasks = ref([
  {
    id: 1,
    taskName: '用户积分补偿',
    taskType: 'manual',
    taskCode: 'MANUAL_USER_POINT_COMPENSATE',
    scheduleTime: '',
    status: 'ready',
    createTime: '2026-03-16 10:20:00',
    lastRunTime: '-'
  },
  {
    id: 2,
    taskName: '销售日报汇总',
    taskType: 'periodic',
    taskCode: 'PERIODIC_SALE_DAILY_SUMMARY',
    periodicTaskType: 'report',
    dataId: 1001,
    cycleType: 'day',
    cycleValues: [],
    scheduleTime: '09:00:00',
    status: 'running',
    createTime: '2026-03-15 09:00:00',
    lastRunTime: '2026-03-21 09:00:00'
  },
  {
    id: 3,
    taskName: '库存风险扫描',
    taskType: 'periodic',
    taskCode: 'PERIODIC_STOCK_RISK_SCAN',
    periodicTaskType: 'warning',
    dataId: 1002,
    cycleType: 'week',
    cycleValues: [1, 3, 5],
    scheduleTime: '22:30:00',
    status: 'paused',
    createTime: '2026-03-14 18:10:00',
    lastRunTime: '2026-03-20 22:30:00'
  }
])

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    if (queryForm.taskName && !task.taskName.includes(queryForm.taskName)) return false
    if (queryForm.taskType && task.taskType !== queryForm.taskType) return false
    if (queryForm.periodicTaskType && task.periodicTaskType !== queryForm.periodicTaskType) return false
    return true
  })
})

const selectableDataOptions = computed(() => {
  if (!dialogForm.periodicTaskType) return dataOptions.value
  return dataOptions.value.filter((item) => item.periodicTaskType === dialogForm.periodicTaskType)
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogFormRef = ref(null)
const dialogForm = reactive({
  id: null,
  taskName: '',
  taskType: 'manual',
  taskCode: '',
  periodicTaskType: '',
  dataId: null,
  cycleType: 'day',
  cycleValues: [],
  scheduleTime: ''
})

function syncTaskTypeByRoute() {
  if (fixedTaskType.value) {
    queryForm.taskType = fixedTaskType.value
    dialogForm.taskType = fixedTaskType.value
    return
  }
  queryForm.taskType = ''
  dialogForm.taskType = 'manual'
}

watch(fixedTaskType, () => {
  syncTaskTypeByRoute()
})

syncTaskTypeByRoute()

const dialogRules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  taskCode: [{ required: true, message: '请输入任务编码', trigger: 'blur' }],
  periodicTaskType: [
    {
      validator: (_, value, callback) => {
        if (dialogForm.taskType === 'periodic' && !value) {
          callback(new Error('请选择任务类型'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  dataId: [
    {
      validator: (_, value, callback) => {
        if (dialogForm.taskType !== 'periodic') {
          callback()
          return
        }
        if (!value) {
          callback(new Error('请选择关联数据'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  cycleType: [
    {
      validator: (_, value, callback) => {
        if (dialogForm.taskType === 'periodic' && !value) {
          callback(new Error('请选择执行周期'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  cycleValues: [
    {
      validator: (_, value, callback) => {
        if (dialogForm.taskType !== 'periodic') {
          callback()
          return
        }
        if (dialogForm.cycleType === 'week' && (!value || value.length === 0)) {
          callback(new Error('请选择执行星期'))
          return
        }
        if (dialogForm.cycleType === 'month' && (!value || value.length === 0)) {
          callback(new Error('请选择执行日期'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  scheduleTime: [
    {
      validator: (_, value, callback) => {
        if (dialogForm.taskType === 'periodic' && !value) {
          callback(new Error('请选择执行时间点'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ]
}

function taskTypeText(type) {
  return taskTypeOptions.find((item) => item.value === type)?.label || '-'
}

function periodicTaskTypeText(type) {
  return periodicTaskTypeOptions.find((item) => item.value === type)?.label || '-'
}

function cycleTypeText(cycleType) {
  return cycleTypeOptions.find((item) => item.value === cycleType)?.label || '-'
}

function parseLocalDataRecords() {
  const saved = localStorage.getItem(DATA_STORAGE_KEY)
  if (!saved) {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(DEFAULT_DATA_OPTIONS))
    return [...DEFAULT_DATA_OPTIONS]
  }
  try {
    const records = JSON.parse(saved)
    if (Array.isArray(records)) return records
  } catch {
    return [...DEFAULT_DATA_OPTIONS]
  }
  localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(DEFAULT_DATA_OPTIONS))
  return [...DEFAULT_DATA_OPTIONS]
}

function loadDataOptions() {
  const records = parseLocalDataRecords()
  dataOptions.value = records
}

function dataNameText(dataId) {
  return dataOptions.value.find((item) => item.id === dataId)?.dataName || '-'
}

function periodicScheduleText(task) {
  if (task.cycleType === 'day') {
    return `每天 ${task.scheduleTime || ''}`.trim()
  }
  if (task.cycleType === 'week') {
    const labels = (task.cycleValues || [])
      .map((day) => weekOptions.find((item) => item.value === day)?.label)
      .filter(Boolean)
    return `每周(${labels.join('、')}) ${task.scheduleTime || ''}`.trim()
  }
  if (task.cycleType === 'month') {
    const labels = (task.cycleValues || []).map((day) => `${day}日`)
    return `每月(${labels.join('、')}) ${task.scheduleTime || ''}`.trim()
  }
  return `${cycleTypeText(task.cycleType)} ${task.scheduleTime || ''}`.trim()
}

function statusInfo(task) {
  if (task.taskType === 'manual') {
    return { label: '可启动', type: 'info' }
  }
  return task.status === 'running'
    ? { label: '运行中', type: 'success' }
    : { label: '已暂停', type: 'warning' }
}

function formatDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())
  const second = pad(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function handleSearch() {
  ElMessage.success(`已查询：${filteredTasks.value.length} 条`)
}

function handleReset() {
  queryForm.taskName = ''
  queryForm.taskType = fixedTaskType.value || ''
  queryForm.periodicTaskType = ''
}

function resetDialogForm() {
  dialogForm.id = null
  dialogForm.taskName = ''
  dialogForm.taskType = fixedTaskType.value || 'manual'
  dialogForm.taskCode = ''
  dialogForm.periodicTaskType = ''
  dialogForm.dataId = null
  dialogForm.cycleType = 'day'
  dialogForm.cycleValues = []
  dialogForm.scheduleTime = ''
}

function openCreateDialog() {
  loadDataOptions()
  isEdit.value = false
  resetDialogForm()
  dialogVisible.value = true
}

function openEditDialog(row) {
  loadDataOptions()
  isEdit.value = true
  dialogForm.id = row.id
  dialogForm.taskName = row.taskName
  dialogForm.taskType = row.taskType
  dialogForm.taskCode = row.taskCode
  dialogForm.periodicTaskType = row.periodicTaskType || ''
  dialogForm.dataId = row.dataId || null
  dialogForm.cycleType = row.cycleType || 'day'
  dialogForm.cycleValues = [...(row.cycleValues || [])]
  dialogForm.scheduleTime = row.scheduleTime || ''
  dialogVisible.value = true
}

function handleTaskTypeChange(value) {
  if (value !== 'periodic') {
    dialogForm.periodicTaskType = ''
    dialogForm.dataId = null
    dialogForm.cycleType = 'day'
    dialogForm.cycleValues = []
    dialogForm.scheduleTime = ''
    return
  }
  if (!dialogForm.cycleType) {
    dialogForm.cycleType = 'day'
  }
}

function handlePeriodicTaskTypeChange() {
  dialogForm.dataId = null
}

function normalizeCycleValues(values = []) {
  return [...values].sort((a, b) => a - b)
}

function buildCycleValuesByType(cycleType, cycleValues) {
  if (cycleType === 'day') return []
  return normalizeCycleValues(cycleValues)
}

watch(
  () => dialogForm.cycleType,
  (value) => {
    if (value === 'day') {
      dialogForm.cycleValues = []
    } else {
      dialogForm.cycleValues = normalizeCycleValues(dialogForm.cycleValues)
    }
  }
)

function handleDialogClosed() {
  dialogFormRef.value?.clearValidate()
  resetDialogForm()
}

async function submitDialog() {
  await dialogFormRef.value.validate()

  const currentTaskType = fixedTaskType.value || dialogForm.taskType
  const isPeriodic = currentTaskType === 'periodic'
  const currentPeriodicTaskType = isPeriodic ? dialogForm.periodicTaskType : ''
  const currentDataId = isPeriodic ? dialogForm.dataId : null
  const currentCycleType = isPeriodic ? dialogForm.cycleType : ''
  const currentCycleValues = isPeriodic ? buildCycleValuesByType(dialogForm.cycleType, dialogForm.cycleValues) : []
  if (isEdit.value) {
    const index = tasks.value.findIndex((task) => task.id === dialogForm.id)
    if (index > -1) {
      const original = tasks.value[index]
      tasks.value[index] = {
        ...original,
        taskName: dialogForm.taskName,
        taskType: currentTaskType,
        taskCode: dialogForm.taskCode,
        periodicTaskType: currentPeriodicTaskType,
        dataId: currentDataId,
        cycleType: currentCycleType,
        cycleValues: currentCycleValues,
        scheduleTime: isPeriodic ? dialogForm.scheduleTime : '',
        status: isPeriodic ? (original.taskType === 'periodic' ? original.status : 'running') : 'ready'
      }
    }
    ElMessage.success('任务修改成功')
  } else {
    tasks.value.unshift({
      id: Date.now(),
      taskName: dialogForm.taskName,
      taskType: currentTaskType,
      taskCode: dialogForm.taskCode,
      periodicTaskType: currentPeriodicTaskType,
      dataId: currentDataId,
      cycleType: currentCycleType,
      cycleValues: currentCycleValues,
      scheduleTime: isPeriodic ? dialogForm.scheduleTime : '',
      status: isPeriodic ? 'running' : 'ready',
      createTime: formatDateTime(),
      lastRunTime: '-'
    })
    ElMessage.success('任务创建成功')
  }

  dialogVisible.value = false
}

function handleStart(row) {
  row.lastRunTime = formatDateTime()
  ElMessage.success(`任务「${row.taskName}」已手动启动`)
}

function handlePause(row) {
  row.status = 'paused'
  ElMessage.success(`任务「${row.taskName}」已暂停`)
}

function handleResume(row) {
  row.status = 'running'
  row.lastRunTime = formatDateTime()
  ElMessage.success(`任务「${row.taskName}」已恢复`)
}

onMounted(() => {
  loadDataOptions()
})
</script>

<style lang="scss" scoped>
.task-page {
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

  .cycle-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cycle-checkbox-item {
    margin-right: 0;
  }

}
</style>
