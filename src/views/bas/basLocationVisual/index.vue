<template>
  <div class="p-2 location-visual-page">
    <div class="mb-[10px]">
      <el-card shadow="hover">
        <el-form class="visual-filter-form" :model="queryParams" :inline="true" label-width="90px">
          <el-form-item label="仓库" prop="warehouseId">
            <el-select v-model="queryParams.warehouseId" clearable filterable placeholder="请选择仓库" @change="handleWarehouseChange">
              <el-option v-for="item in warehouseList" :key="item.id" :label="item.warehouseName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="库区" prop="areaId">
            <el-select v-model="queryParams.areaId" clearable filterable placeholder="请选择库区" @change="handleAreaChange">
              <el-option v-for="item in areaList" :key="item.id" :label="item.areaName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="库位编码" prop="locationCode">
            <el-input v-model="queryParams.locationCode" clearable placeholder="例如 B0201031" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <section class="summary-grid">
      <button
        type="button"
        class="summary-item total"
        :class="{ active: statusFilter === 'all' }"
        @click="selectStatus('all')"
      >
        <span>全部库位</span>
        <strong>{{ locations.length }}</strong>
        <small>{{ selectedAreaName }}</small>
      </button>
      <button
        v-for="item in statusOptions"
        :key="item.value"
        type="button"
        class="summary-item"
        :class="[item.value, { active: statusFilter === item.value }]"
        @click="selectStatus(item.value)"
      >
        <span>{{ item.label }}</span>
        <strong>{{ statusCount[item.value] }}</strong>
        <small>{{ item.desc }}</small>
      </button>
      <button type="button" class="summary-item current" @click="selectStatus('all')">
        <span>当前排</span>
        <strong>{{ currentRowLabel }}</strong>
        <small>{{ showGridMode ? `共 ${allCurrentRowLocations.length} 个` : "暂无矩阵" }}</small>
      </button>
    </section>

    <section class="visual-shell visual-card" :class="{ 'is-empty': !showGridMode }" v-loading="loading">
      <aside class="row-rail" v-if="showGridMode">
        <div class="panel-head">
          <div>
            <strong>巷道 / 排</strong>
          </div>
        </div>
        <div class="row-list">
          <button
            v-for="row in rows"
            :key="row"
            type="button"
            class="row-btn"
            :class="{ active: row === currentRow }"
            @click="selectRow(row)"
          >
            <div>
              <strong>{{ rowLabel(row) }}</strong>
              <span>{{ rowStats(row).used }} / {{ rowStats(row).total }} 已使用</span>
            </div>
            <small>空 {{ rowStats(row).empty }}</small>
            <i><em :style="{ width: rowUsagePercent(row) + '%' }"></em></i>
          </button>
        </div>
      </aside>

      <main class="map-panel">
        <div class="panel-head map-head">
          <div class="map-title">
            <el-icon class="map-title__icon"><Location /></el-icon>
            <strong>{{ mapTitle }}</strong>
            <span v-if="showGridMode">共 {{ allCurrentRowLocations.length }} 个货位</span>
          </div>

          <div class="legend">
            <span v-for="item in statusOptions" :key="item.value" :class="item.value">
              <el-icon class="legend__icon"><component :is="item.icon" /></el-icon>{{ item.label }}
            </span>
          </div>
        </div>

        <div v-if="showGridMode" class="matrix-wrap" tabindex="0" @keydown="handleMatrixKeydown">
          <div class="matrix-stage">
            <div class="matrix" :style="matrixStyle">
              <div></div>
              <div v-for="column in columns" :key="'c' + column" class="axis">列{{ pad(column) }}</div>
              <template v-for="layer in layers" :key="'l' + layer">
                <div class="axis">层{{ pad(layer) }}</div>
                <div v-for="column in columns" :key="layer + '-' + column" class="cell">
                  <button
                    v-for="loc in cellLocations(layer, column)"
                    :key="loc.id || loc.locationCode"
                    type="button"
                    class="slot"
                    :class="[visualStatus(loc), { selected: selectedLocation?.locationCode === loc.locationCode }]"
                    :aria-label="locationAriaLabel(loc)"
                  @click="selectLocation(loc)"
                >
                    <el-icon class="slot__icon"><component :is="statusIcon(visualStatus(loc))" /></el-icon>
                    <span>{{ depthLabel(loc.depth) }}</span>
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div v-else class="matrix-empty">
          <el-empty description="当前库区暂无可视化坐标库位" />
        </div>
      </main>

      <aside class="detail-panel">
        <div class="panel-head">
          <div>
            <strong>库位详情</strong>
            <span>{{ selectedLocation ? "已选中库位" : "等待选择" }}</span>
          </div>
        </div>

        <template v-if="selectedLocation">
          <div class="detail-code">
            <span>库位编码</span>
            <strong>{{ selectedLocation.locationCode }}</strong>
            <em>类型 {{ locationTypeLabel(selectedLocation.locationType) }}</em>
          </div>

          <div class="detail-status" :class="visualStatus(selectedLocation)">
            <div>
              <span>库位状态</span>
              <strong>{{ statusLabel(visualStatus(selectedLocation)) }}</strong>
            </div>
            <div>
              <span>业务状态</span>
              <strong>{{ businessLabel(selectedLocation.businessStatus) }}</strong>
            </div>
          </div>

          <el-tabs v-model="detailTab" class="detail-tabs">
            <el-tab-pane label="基本信息" name="base">
              <div class="detail-table">
                <div class="detail-row"><span>库区</span><strong>{{ selectedLocation.areaName || selectedAreaName }}</strong></div>
                <div class="detail-row" v-if="hasCoordinate(selectedLocation)"><span>巷道</span><strong>{{ selectedLocation.gang ?? "-" }}</strong></div>
                <div class="detail-row" v-if="hasCoordinate(selectedLocation)"><span>排号</span><strong>{{ pad(selectedLocation.xpos) }}</strong></div>
                <div class="detail-row" v-if="hasCoordinate(selectedLocation)"><span>列号</span><strong>{{ pad(selectedLocation.ypos) }}</strong></div>
                <div class="detail-row" v-if="hasCoordinate(selectedLocation)"><span>层号</span><strong>{{ pad(selectedLocation.zpos) }}</strong></div>
                <div class="detail-row" v-if="selectedLocation.depth"><span>深浅</span><strong>{{ selectedLocation.depth }}（{{ depthLabel(selectedLocation.depth) }}货位）</strong></div>
                <div class="detail-row"><span>库位类型</span><strong>{{ locationTypeLabel(selectedLocation.locationType) }}</strong></div>
                <div class="detail-row"><span>优先级</span><strong>{{ selectedLocation.priority ?? "-" }}</strong></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="库存" name="stock">
              <div class="inventory-pane" v-loading="inventoryLoading">
                <template v-if="inventoryList.length">
                  <div class="inventory-summary">
                    <span>库存明细</span>
                    <strong>{{ inventoryList.length }} 条</strong>
                    <em>合计 {{ formatQty(inventoryTotalQty) }}</em>
                  </div>
                  <div class="inventory-list">
                    <article v-for="item in pagedInventoryList" :key="item.stockId" class="inventory-card">
                      <div class="inventory-main">
                        <strong>{{ item.materialCode || "-" }}</strong>
                        <span>{{ formatQty(item.qty) }}{{ item.unit ? " " + item.unit : "" }}</span>
                      </div>
                      <p>{{ item.materialName || "未维护物料名称" }}</p>
                      <div class="inventory-meta">
                        <span>批次 {{ item.batchCode || "-" }}</span>
                        <span>容器 {{ item.leCode || "-" }}</span>
                        <em :class="stockStatusClass(item.stockStatus)">{{ stockStatusLabel(item.stockStatus) }}</em>
                        <em :class="holdStatusClass(item.holdStatus)">{{ holdStatusLabel(item.holdStatus) }}</em>
                      </div>
                    </article>
                  </div>
                  <div v-if="inventoryList.length > inventoryPageSize" class="inventory-pagination">
                    <el-pagination
                      v-model:current-page="inventoryPage"
                      :page-size="inventoryPageSize"
                      :total="inventoryList.length"
                      layout="prev, pager, next"
                      small
                    />
                  </div>
                </template>
                <div v-else-if="!inventoryLoading" class="detail-empty">当前库位暂无库存明细</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="任务" name="task">
              <div class="task-pane" v-loading="taskLoading">
                <template v-if="taskList.length">
                  <article v-for="item in taskList" :key="item.taskId || item.instrNum" class="task-card">
                    <div class="task-card__head">
                      <span :class="taskTypeClass(item.instrType)">{{ taskTypeLabel(item.instrType) }}</span>
                      <em :class="taskStatusClass(item.instrStatus)">{{ taskStatusLabel(item.instrStatus) }}</em>
                    </div>
                    <div class="task-card__num">{{ item.instrNum || "-" }}</div>
                    <div class="task-card__line">
                      <span>容器</span>
                      <strong>{{ item.leCode || "-" }}</strong>
                    </div>
                    <div class="task-card__route">
                      <span>{{ item.originLocationCode || "-" }}</span>
                      <i></i>
                      <span>{{ item.destinationLocationCode || "-" }}</span>
                    </div>
                  </article>
                </template>
                <div v-else-if="!taskLoading" class="detail-empty">当前库位暂无待完成任务</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="记录" name="log">
              <div class="record-pane" v-loading="recordLoading">
                <template v-if="recordList.length">
                  <div class="record-timeline">
                    <article
                      v-for="item in recordList"
                      :key="item.recordId || item.instrNum"
                      class="record-card"
                      :class="recordRelationClass(item.relationType)"
                    >
                      <div class="record-card__head">
                        <span>{{ recordRelationLabel(item.relationType) }}</span>
                        <em>{{ formatRecordTime(item.updateTime || item.createTime) }}</em>
                      </div>
                      <div class="record-card__title">
                        <strong>{{ taskTypeLabel(item.instrType) }}</strong>
                        <i :class="taskStatusClass(item.instrStatus)">{{ taskStatusLabel(item.instrStatus) }}</i>
                      </div>
                      <div class="record-card__num">{{ item.instrNum || "-" }}</div>
                      <div class="record-card__route">
                        <span>{{ item.originLocationCode || "-" }}</span>
                        <i></i>
                        <span>{{ item.destinationLocationCode || "-" }}</span>
                      </div>
                      <div class="record-card__meta">
                        <span>容器 {{ item.leCode || "-" }}</span>
                        <span>操作人 {{ item.updateBy || "-" }}</span>
                      </div>
                    </article>
                  </div>
                  <div v-if="recordTotal > recordPageSize" class="record-pagination">
                    <el-pagination
                      v-model:current-page="recordPage"
                      :page-size="recordPageSize"
                      :total="recordTotal"
                      layout="prev, pager, next"
                      small
                      @current-change="loadRecords(true)"
                    />
                  </div>
                </template>
                <div v-else-if="!recordLoading" class="detail-empty">当前库位暂无历史记录</div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
        <el-empty v-else description="请选择库位" />
      </aside>
    </section>
  </div>
</template>

<script setup name="BasLocationVisual">
import { computed, onMounted, reactive, ref, watch } from "vue"
import { Box, Lock, Location, Timer, ScaleToOriginal } from "@element-plus/icons-vue"
import { listBasLocationVisual, listBasLocationVisualInventory, listBasLocationVisualRecords, listBasLocationVisualTasks } from "@/api/bas/basLocationVisual"
import { dropDownListWarehouse } from "@/api/bas/basWarehouse"
import { dropDownListArea } from "@/api/bas/basArea"

const loading = ref(false)
const warehouseList = ref([])
const areaList = ref([])
const locations = ref([])
const selectedCode = ref("")
const currentRow = ref(null)
const detailTab = ref("base")
const statusFilter = ref("all")
const inventoryLoading = ref(false)
const inventoryList = ref([])
const inventoryLocationId = ref(undefined)
const inventoryPage = ref(1)
const inventoryPageSize = 5
const taskLoading = ref(false)
const taskList = ref([])
const taskLocationId = ref(undefined)
const recordLoading = ref(false)
const recordList = ref([])
const recordLocationId = ref(undefined)
const recordPage = ref(1)
const recordPageSize = 5
const recordTotal = ref(0)

const queryParams = reactive({
  warehouseId: undefined,
  areaId: undefined,
  locationCode: ""
})

const statusOptions = [
  { value: "stock", label: "有货", desc: "存在库存", icon: Box },
  { value: "empty", label: "空", desc: "可用库位", icon: ScaleToOriginal },
  { value: "reserved", label: "待占用", desc: "任务预占", icon: Timer },
  { value: "locked", label: "锁定", desc: "不可操作", icon: Lock }
]

const selectedArea = computed(() => areaList.value.find(item => item.id === queryParams.areaId))
const selectedAreaName = computed(() => selectedArea.value?.areaName || "全部库区")
const gridLocations = computed(() => locations.value.filter(hasCoordinate))
const displayLocations = computed(() => {
  if (statusFilter.value === "all") return locations.value
  return locations.value.filter(item => visualStatus(item) === statusFilter.value)
})
const displayGridLocations = computed(() => displayLocations.value.filter(hasCoordinate))
const showGridMode = computed(() => gridLocations.value.length > 0)
const rows = computed(() => uniqueSorted(gridLocations.value.map(item => item.xpos)))
const currentRowLabel = computed(() => showGridMode.value ? `B${pad(currentRow.value || rows.value[0])}` : "-")
const selectedLocation = computed(() => locations.value.find(item => item.locationCode === selectedCode.value) || locations.value[0])

const allCurrentRowLocations = computed(() => {
  if (!showGridMode.value) return []
  return gridLocations.value.filter(item => item.xpos === currentRow.value)
})

const currentRowHasDepthPair = computed(() => {
  const cellKeys = new Set()
  return allCurrentRowLocations.value.some(item => {
    const key = `${item.zpos}-${item.ypos}`
    if (cellKeys.has(key)) return true
    cellKeys.add(key)
    return false
  })
})

const currentRowLocations = computed(() => {
  if (!showGridMode.value) return []
  return displayGridLocations.value.filter(item => item.xpos === currentRow.value)
})

const columns = computed(() => uniqueSorted(allCurrentRowLocations.value.map(item => item.ypos)))
const layers = computed(() => uniqueSorted(allCurrentRowLocations.value.map(item => item.zpos)).reverse())
const matrixStyle = computed(() => ({
  gridTemplateColumns: `42px repeat(${Math.max(columns.value.length, 1)}, 48px)`
}))

const cellLocationMap = computed(() => {
  const result = new Map()
  currentRowLocations.value.forEach(item => {
    const key = `${item.zpos}-${item.ypos}`
    if (!result.has(key)) result.set(key, [])
    result.get(key).push(item)
  })
  result.forEach(list => list.sort((a, b) => Number(a.depth || 0) - Number(b.depth || 0)))
  return result
})

const rowStatsMap = computed(() => {
  const result = new Map()
  rows.value.forEach(row => result.set(row, { total: 0, used: 0, empty: 0 }))
  gridLocations.value.forEach(item => {
    const row = item.xpos
    const stat = result.get(row) || { total: 0, used: 0, empty: 0 }
    const status = visualStatus(item)
    stat.total += 1
    if (status === "empty") stat.empty += 1
    else stat.used += 1
    result.set(row, stat)
  })
  return result
})

const statusCount = computed(() => {
  return locations.value.reduce((result, item) => {
    result[visualStatus(item)] += 1
    return result
  }, { stock: 0, empty: 0, reserved: 0, locked: 0 })
})

const mapTitle = computed(() => {
  if (!locations.value.length) return "库位可视化"
  if (showGridMode.value) return `${currentRowLabel.value} 第${currentRow.value || "-"}排库位图`
  return `${selectedAreaName.value} 库位图`
})

const inventoryTotalQty = computed(() => {
  return inventoryList.value.reduce((total, item) => total + parseNumber(item.qty), 0)
})

const pagedInventoryList = computed(() => {
  const start = (inventoryPage.value - 1) * inventoryPageSize
  return inventoryList.value.slice(start, start + inventoryPageSize)
})

watch(rows, value => {
  if (!value.includes(currentRow.value)) currentRow.value = value[0] || null
})

watch(selectedLocation, () => {
  detailTab.value = "base"
  inventoryList.value = []
  inventoryLocationId.value = undefined
  inventoryPage.value = 1
  taskList.value = []
  taskLocationId.value = undefined
  recordList.value = []
  recordLocationId.value = undefined
  recordPage.value = 1
  recordTotal.value = 0
})

watch(detailTab, value => {
  if (value === "stock") {
    loadInventory()
  } else if (value === "task") {
    loadTasks()
  } else if (value === "log") {
    loadRecords()
  }
})

onMounted(async () => {
  await loadWarehouses()
  await loadAreas()
  await getList()
})

async function loadWarehouses() {
  const response = await dropDownListWarehouse()
  warehouseList.value = response.data || response.rows || []
  if (!queryParams.warehouseId && warehouseList.value.length) {
    queryParams.warehouseId = warehouseList.value[0].id
  }
}

async function loadAreas() {
  const response = await dropDownListArea({ warehouseId: queryParams.warehouseId })
  areaList.value = response.data || response.rows || []
  if (!queryParams.areaId && areaList.value.length) {
    queryParams.areaId = areaList.value[0].id
  }
}

async function getList() {
  loading.value = true
  try {
    const response = await listBasLocationVisual({
      warehouseId: queryParams.warehouseId,
      areaId: queryParams.areaId,
      locationCode: queryParams.locationCode
    })
    locations.value = response.rows || response.data || []
    selectedCode.value = locations.value.find(hasCoordinate)?.locationCode || locations.value[0]?.locationCode || ""
    currentRow.value = rows.value[0] || null
  } finally {
    loading.value = false
  }
}

async function loadInventory() {
  const locationId = selectedLocation.value?.id
  if (!locationId) {
    inventoryList.value = []
    inventoryLocationId.value = undefined
    inventoryPage.value = 1
    return
  }
  if (inventoryLocationId.value === locationId) return
  inventoryLoading.value = true
  try {
    const response = await listBasLocationVisualInventory({ locationId })
    if (selectedLocation.value?.id !== locationId) return
    inventoryList.value = response.rows || response.data || []
    inventoryLocationId.value = locationId
    inventoryPage.value = 1
  } finally {
    inventoryLoading.value = false
  }
}

async function loadTasks() {
  const locationId = selectedLocation.value?.id
  if (!locationId) {
    taskList.value = []
    taskLocationId.value = undefined
    return
  }
  if (taskLocationId.value === locationId) return
  taskLoading.value = true
  try {
    const response = await listBasLocationVisualTasks({ locationId })
    if (selectedLocation.value?.id !== locationId) return
    taskList.value = response.rows || response.data || []
    taskLocationId.value = locationId
  } finally {
    taskLoading.value = false
  }
}

async function loadRecords(force = false) {
  const locationId = selectedLocation.value?.id
  if (!locationId) {
    recordList.value = []
    recordLocationId.value = undefined
    recordPage.value = 1
    recordTotal.value = 0
    return
  }
  if (!force && recordLocationId.value === locationId) return
  recordLoading.value = true
  try {
    const response = await listBasLocationVisualRecords({
      locationId,
      pageNum: recordPage.value,
      pageSize: recordPageSize
    })
    if (selectedLocation.value?.id !== locationId) return
    recordList.value = response.rows || response.data || []
    recordTotal.value = Number(response.total || recordList.value.length)
    recordLocationId.value = locationId
  } finally {
    recordLoading.value = false
  }
}

async function handleWarehouseChange() {
  queryParams.areaId = undefined
  await loadAreas()
  await getList()
}

function handleAreaChange() {
  getList()
}

function handleQuery() {
  getList()
}

async function resetQuery() {
  queryParams.locationCode = ""
  statusFilter.value = "all"
  await getList()
}

function selectStatus(status) {
  statusFilter.value = status
}

function selectRow(row) {
  currentRow.value = row
  selectedCode.value = rowLocations(row)[0]?.locationCode || selectedCode.value
}

function selectLocation(location) {
  selectedCode.value = location.locationCode
}

function handleMatrixKeydown(event) {
  if (!showGridMode.value || !selectedLocation.value) return
  const key = event.key
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Spacebar"].includes(key)) return
  event.preventDefault()
  if (key === "ArrowLeft") {
    selectAdjacentColumn(-1)
  } else if (key === "ArrowRight") {
    selectAdjacentColumn(1)
  } else if (key === "ArrowUp") {
    selectAdjacentLayer(-1)
  } else if (key === "ArrowDown") {
    selectAdjacentLayer(1)
  } else {
    toggleDepthLocation()
  }
}

function selectAdjacentColumn(delta) {
  const loc = selectedLocation.value
  const index = columns.value.findIndex(column => Number(column) === Number(loc.ypos))
  const nextColumn = columns.value[index + delta]
  if (nextColumn == null) return
  selectNearestLocation(loc.zpos, nextColumn, loc.depth)
}

function selectAdjacentLayer(delta) {
  const loc = selectedLocation.value
  const index = layers.value.findIndex(layer => Number(layer) === Number(loc.zpos))
  const nextLayer = layers.value[index + delta]
  if (nextLayer == null) return
  selectNearestLocation(nextLayer, loc.ypos, loc.depth)
}

function toggleDepthLocation() {
  const loc = selectedLocation.value
  const candidates = cellLocations(loc.zpos, loc.ypos).slice().sort((a, b) => parseNumber(a.depth) - parseNumber(b.depth))
  const next = candidates.find(item => Number(item.depth) !== Number(loc.depth))
  if (next) selectLocation(next)
}

function selectNearestLocation(layer, column, depth) {
  const candidates = cellLocations(layer, column).slice().sort((a, b) => parseNumber(a.depth) - parseNumber(b.depth))
  const next = candidates.find(item => Number(item.depth) === Number(depth)) || candidates[0]
  if (next) selectLocation(next)
}

function rowLocations(row) {
  return gridLocations.value.filter(item => item.xpos === row)
}

function rowStats(row) {
  return rowStatsMap.value.get(row) || { total: 0, used: 0, empty: 0 }
}

function rowUsagePercent(row) {
  const stat = rowStats(row)
  return stat.total ? Math.round(stat.used / stat.total * 100) : 0
}

function cellLocations(layer, column) {
  return cellLocationMap.value.get(`${layer}-${column}`) || []
}

function hasCoordinate(location) {
  return parseNumber(location?.xpos) > 0 && parseNumber(location?.ypos) > 0 && parseNumber(location?.zpos) > 0
}

function visualStatus(location) {
  const rawStatus = String(location?.visualStatus || "").toLowerCase()
  if (["stock", "empty", "reserved", "locked"].includes(rawStatus)) return rawStatus
  return "empty"
}

function statusIcon(status) {
  const map = {
    stock: Box,
    empty: ScaleToOriginal,
    reserved: Timer,
    locked: Lock
  }
  return map[status] || ScaleToOriginal
}

function statusLabel(status) {
  return statusOptions.find(item => item.value === status)?.label || "-"
}

function businessLabel(value) {
  const map = { ONLY_IN: "仅入库", ONLY_OUT: "仅出库", IN_AND_OUT: "可入可出" }
  return map[value] || value || "-"
}

function stockStatusLabel(value) {
  value = String(value || "").toLowerCase()
  const map = { storage: "在库", transaction: "事务中", outbound: "出库中", empty: "空" }
  return map[value] || value || "-"
}

function holdStatusLabel(value) {
  value = String(value || "").toLowerCase()
  const map = { inventory: "可用", outbound: "出库占用", count: "盘点占用", lock: "锁定", freeze: "冻结" }
  return map[value] || value || "-"
}

function stockStatusClass(value) {
  value = String(value || "").toLowerCase()
  return value === "storage" ? "is-storage" : "is-process"
}

function holdStatusClass(value) {
  value = String(value || "").toLowerCase()
  if (value === "inventory") return "is-free"
  if (["lock", "freeze"].includes(value)) return "is-locked"
  return "is-held"
}

function taskTypeLabel(value) {
  const map = {
    IN: "入库",
    OUT: "出库",
    TRANSFER: "移库",
    COUNT: "盘点",
    BACK: "回库",
    OUT_BACK: "出库回库",
    COUNT_BACK: "盘点回库",
    CALL_BOX: "叫箱",
    inbound: "入库",
    outbound: "出库",
    transfer: "移库",
    count: "盘点",
    return: "回库",
    入库: "入库",
    出库: "出库",
    移库: "移库",
    盘点: "盘点",
    回库: "回库",
    出库回库: "出库回库",
    盘点回库: "盘点回库",
    叫箱: "叫箱"
  }
  return map[value] || value || "-"
}

function taskStatusLabel(value) {
  const map = {
    0: "申请",
    1: "已接收",
    2: "已释放",
    3: "任务完成",
    4: "异常",
    5: "异常完成",
    APPLY: "申请",
    RECEIVED: "已接收",
    RELEASED: "已释放",
    COMPLETED: "任务完成",
    EXCEPTION: "异常",
    EXCEPTION_COMPLETED: "异常完成",
    apply: "申请",
    received: "已接收",
    released: "已释放",
    completed: "任务完成",
    exception: "异常",
    exception_completed: "异常完成",
    申请: "申请",
    已接收: "已接收",
    已释放: "已释放",
    任务完成: "任务完成",
    异常: "异常",
    异常完成: "异常完成"
  }
  return map[value] || value || "-"
}

function taskTypeClass(value) {
  value = String(value || "").toLowerCase()
  if (value.includes("out") || value.includes("出库")) return "is-outbound"
  if (value.includes("transfer") || value.includes("移库")) return "is-transfer"
  if (value.includes("count") || value.includes("盘点")) return "is-count"
  if (value.includes("back") || value.includes("回库")) return "is-return"
  return "is-inbound"
}

function taskStatusClass(value) {
  value = String(value || "").toLowerCase()
  if (value === "5") return "is-exception-completed"
  if (value === "4") return "is-exception"
  if (value === "3") return "is-completed"
  if (value === "2") return "is-released"
  if (value === "1") return "is-received"
  if (value.includes("exception_completed") || value.includes("异常完成")) return "is-exception-completed"
  if (value.includes("exception") || value.includes("异常")) return "is-exception"
  if (value.includes("complete") || value.includes("完成")) return "is-completed"
  if (value.includes("release") || value.includes("释放")) return "is-released"
  if (value.includes("receive") || value.includes("接收")) return "is-received"
  return "is-apply"
}

function recordRelationLabel(value) {
  const map = {
    source: "从此移出",
    target: "入到此位",
    both: "库内流转"
  }
  return map[value] || "关联记录"
}

function recordRelationClass(value) {
  return ["source", "target", "both"].includes(value) ? `is-${value}` : "is-related"
}

function formatRecordTime(value) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())
  return `${year}-${month}-${day} ${hour}:${minute}`
}

function locationTypeLabel(value) {
  const map = {
    BIN: "立库",
    FLUENCY_RACK: "流利",
    FLAT: "平面",
    VIRTUAL: "虚拟",
    STORAGE: "存储",
    STATION: "站台"
  }
  return map[value] || value || "-"
}

function locationAriaLabel(location) {
  return `${location.locationCode}，${statusLabel(visualStatus(location))}，${depthLabel(location.depth)}货位`
}

function depthLabel(value) {
  return Number(value) === 1 ? "浅" : Number(value) === 2 ? "深" : "-"
}

function rowLabel(row) {
  return `第${pad(row)}排`
}

function pad(value) {
  return value == null ? "-" : String(value).padStart(2, "0")
}

function formatQty(value) {
  const result = parseNumber(value)
  return Number.isInteger(result) ? String(result) : result.toFixed(3).replace(/\.?0+$/, "")
}

function parseNumber(value) {
  const result = Number(value)
  return Number.isFinite(result) ? result : 0
}

function uniqueSorted(values) {
  return [...new Set(values.filter(value => value != null))].sort((a, b) => Number(a) - Number(b))
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
