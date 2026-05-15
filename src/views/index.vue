<template>
    <div class="burden-dashboard" :class="themeClass" v-loading="loading" :element-loading-background="loadingBackground">
        <!-- 主题切换按钮 -->
        <div class="theme-toggle">
            <el-tooltip :content="isDark ? $t('burdenDashboard.switchToLight') : $t('burdenDashboard.switchToDark')" placement="bottom">
                <el-button circle @click="toggleTheme">
                    <el-icon>
                        <Sunny v-if="!isDark" />
                        <Moon v-else />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
        <!-- 页面标题区 -->
        <div class="page-title">
            <h1>{{ $t('burdenDashboard.title') }}</h1>
            <div class="page-title__sub">{{ $t('burdenDashboard.subtitle') }}</div>
        </div>
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item :label="$t('burdenDashboard.burdenCode')">
                    <el-input v-model="searchForm.burdenCode" :placeholder="$t('burdenDashboard.inputBurdenCode')" clearable @keyup.enter="handleSearch" />
                </el-form-item>
                <el-form-item :label="$t('burdenDashboard.burdenName')">
                    <el-input v-model="searchForm.burdenName" :placeholder="$t('burdenDashboard.inputBurdenName')" clearable @keyup.enter="handleSearch" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">
                        <el-icon>
                            <Search />
                        </el-icon>
                        {{ $t('burdenDashboard.search') }}
                    </el-button>
                    <el-button @click="handleReset">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                        {{ $t('burdenDashboard.reset') }}
                    </el-button>
                    <el-button type="warning" @click="handleExport">
                        <el-icon>
                            <Download />
                        </el-icon>
                        {{ $t('burdenDashboard.export') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 概览统计条 -->
        <div class="overview-bar">
            <div class="ov-item ov-item--blue">
                <div class="ov-label">{{ $t('burdenDashboard.totalTemplates') }}</div>
                <div class="ov-num">{{ overviewStats.totalTemplates }}</div>
                <div class="ov-sub">TEMPLATES</div>
            </div>
            <div class="ov-item ov-item--green">
                <div class="ov-label">{{ $t('burdenDashboard.fullyMatched') }}</div>
                <div class="ov-num">{{ overviewStats.totalFullyMatched }}</div>
                <div class="ov-sub">FULLY MATCHED</div>
            </div>
            <div class="ov-item ov-item--orange">
                <div class="ov-label">{{ $t('burdenDashboard.partiallyMatched') }}</div>
                <div class="ov-num">{{ overviewStats.totalPartiallyMatched }}</div>
                <div class="ov-sub">PARTIALLY</div>
            </div>
            <div class="ov-item ov-item--purple">
                <div class="ov-label">{{ $t('burdenDashboard.remaining') }}</div>
                <div class="ov-num">{{ overviewStats.totalRemaining }}</div>
                <div class="ov-sub">REMAINING</div>
            </div>
        </div>

        <!-- 配料卡片网格区 -->
        <div class="card-grid">
            <div v-for="(item, index) in burdenList" :key="item.id || item.burdenId" class="burden-card" :style="{ animationDelay: `${index * 0.08}s` }">
                <div class="card-top">
                    <div class="card-info">
                        <div class="card-code">{{ item.burdenCode }}</div>
                        <div class="card-name">{{ item.burdenName }}</div>
                    </div>
                    <div class="card-total">
                        <div class="card-total__label">{{ $t('burdenDashboard.total') }}</div>
                        <div class="card-total__num">
                            {{ (item.fullyMatchedCount || 0) + (item.partiallyMatchedCount || 0) + (item.remainingCapacity || item.remainingCount || 0) }}
                        </div>
                    </div>
                </div>

                <!-- 图表区域 -->
                <div class="chart-row">
                    <div class="chart-pie" :ref="el => setPieRef(el, index)"></div>
                    <div class="chart-bar" :ref="el => setBarRef(el, index)"></div>
                </div>

                <!-- 托盘标签区域 -->
                <div class="pallet-section" v-if="(item.fullyMatchedCount > 0) || (item.partiallyMatchedCount > 0)">
                    <div class="pallet-group" v-if="item.fullyMatchedCount > 0 && item.fullyMatchedPallets && item.fullyMatchedPallets.length">
                        <div class="pallet-group-title">
                            <span class="dot dot--green"></span>
                            {{ $t('burdenDashboard.fullyMatchedPallets') }}
                        </div>
                        <div class="pallet-tags">
                            <span v-for="pallet in item.fullyMatchedPallets" :key="pallet" class="tag tag--green" @click="handlePalletClick(item.id || item.burdenId, pallet)">{{ pallet }}</span>
                        </div>
                    </div>
                    <div class="pallet-group" v-if="item.partiallyMatchedCount > 0 && item.partiallyMatchedPallets && item.partiallyMatchedPallets.length">
                        <div class="pallet-group-title">
                            <span class="dot dot--orange"></span>
                            {{ $t('burdenDashboard.partiallyMatchedPallets') }}
                        </div>
                        <div class="pallet-tags">
                            <span v-for="pallet in item.partiallyMatchedPallets" :key="pallet" class="tag tag--orange" @click="handlePalletClick(item.id || item.burdenId, pallet)">{{ pallet }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 托盘配料明细弹窗 -->
        <el-dialog v-model="dialogVisible" :title="$t('burdenDashboard.palletDetail') + ' - ' + currentBurden.burdenName + ' / ' + currentBurden.palletCode" width="880px" destroy-on-close append-to-body align-center class="pallet-detail-dialog">
            <div v-loading="palletLoading" class="dialog-body">
                <template v-if="palletDetail">
                    <!-- 图表区域 -->
                    <div class="dialog-charts">
                        <div class="dialog-gauge" ref="gaugeRef"></div>
                        <div class="dialog-group-bar" ref="groupBarRef"></div>
                    </div>
                    <!-- 物料明细表格 -->
                    <el-table :data="palletDetail.materials" border size="small" class="material-table">
                        <el-table-column prop="materialCode" align="center" :label="$t('burdenDashboard.materialCode')" min-width="120" />
                        <el-table-column prop="materialName" align="center" :label="$t('burdenDashboard.materialName')" min-width="140" />
                        <el-table-column prop="requiredQty" :label="$t('burdenDashboard.requiredQty')" min-width="100" align="center" />
                        <el-table-column prop="actualQty" :label="$t('burdenDashboard.actualQty')" min-width="100" align="center" />
                        <el-table-column prop="shortageQty" :label="$t('burdenDashboard.shortageQty')" min-width="100" align="center" />
                        <el-table-column :label="$t('burdenDashboard.status')" min-width="90" align="center">
                            <template #default="{ row }">
                                <span :class="['status-tag', getStatusType(row.status)]">
                                    {{ $t('burdenDashboard.' + row.status) }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <div v-if="palletError" class="dialog-error">{{ palletError }}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup name="Index">
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download, Sunny, Moon } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import useBurdenDashboardStore from '@/store/modules/burdenDashboard'
import { exportBurdenDashboard } from '@/api/report/burdenDashboard'

const { proxy } = getCurrentInstance()

const store = useBurdenDashboardStore()
const { burdenList, loading, palletDetail, palletLoading } = storeToRefs(store)
const overviewStats = computed(() => store.overviewStats)

// CSS 变量定义（深色主题 - 默认）
const darkThemeVars = {
    '--bg': '#131a2e',
    '--bg-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    '--card': 'rgba(22, 32, 56, 0.88)',
    '--card-hover': 'rgba(30, 41, 59, 0.95)',
    '--border': 'rgba(56, 136, 255, 0.16)',
    '--border-hover': 'rgba(77, 156, 255, 0.3)',
    '--blue': '#4d9cff',
    '--green': '#36d399',
    '--orange': '#fbbd23',
    '--red': '#f87272',
    '--purple': '#a78bfa',
    '--text': '#d6e0f0',
    '--text2': '#8899b4',
    '--text3': '#5c6f8a',
    '--shadow': 'rgba(0, 0, 0, 0.3)',
    '--input-bg': 'rgba(77, 156, 255, 0.06)',
    '--table-header-bg': 'rgba(77, 156, 255, 0.06)',
    '--dialog-bg': '#131a2e',
    '--loading-bg': 'rgba(19, 26, 46, 0.8)'
}

// CSS 变量定义（浅色主题）
const lightThemeVars = {
    '--bg': '#f5f7fa',
    '--bg-gradient': 'linear-gradient(135deg, #f0f2f5 0%, #e8ecf1 100%)',
    '--card': 'rgba(255, 255, 255, 0.95)',
    '--card-hover': 'rgba(255, 255, 255, 1)',
    '--border': 'rgba(200, 210, 220, 0.6)',
    '--border-hover': 'rgba(64, 158, 255, 0.5)',
    '--blue': '#409eff',
    '--green': '#67c23a',
    '--orange': '#e6a23c',
    '--red': '#f56c6c',
    '--purple': '#9c27b0',
    '--text': '#303133',
    '--text2': '#606266',
    '--text3': '#909399',
    '--shadow': 'rgba(0, 0, 0, 0.08)',
    '--input-bg': 'rgba(245, 247, 250, 0.8)',
    '--table-header-bg': 'rgba(245, 247, 250, 0.9)',
    '--dialog-bg': '#ffffff',
    '--loading-bg': 'rgba(245, 247, 250, 0.9)'
}

// 应用主题变量到 :root
const applyThemeVars = (isDarkTheme) => {
    const root = document.documentElement
    const vars = isDarkTheme ? darkThemeVars : lightThemeVars
    Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value)
    })
}

// 主题切换
const isDark = ref(true)
const themeClass = computed(() => isDark.value ? 'theme-dark' : 'theme-light')

// 加载背景色 - 根据主题动态变化
const loadingBackground = computed(() => {
    return isDark.value ? darkThemeVars['--loading-bg'] : lightThemeVars['--loading-bg']
})

const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('burden-dashboard-theme', isDark.value ? 'dark' : 'light')
    applyThemeVars(isDark.value)
    updateChartTooltip()
}

// 从 localStorage 恢复主题
const restoreTheme = () => {
    const savedTheme = localStorage.getItem('burden-dashboard-theme')
    if (savedTheme) {
        isDark.value = savedTheme === 'dark'
    }
    applyThemeVars(isDark.value)
}

// 更新图表 tooltip 配置
const updateChartTooltip = () => {
    // 重新初始化所有图表
    if (burdenList.value.length > 0) {
        nextTick(() => { initAllCharts() })
    }

    // 重新初始化弹窗图表
    if (palletDetail.value) {
        nextTick(() => {
            dialogChartInstances.forEach(c => { try { c.dispose() } catch (_) { } })
            dialogChartInstances.length = 0
            const gauge = initGaugeChart(gaugeRef.value, palletDetail.value)
            const groupBar = initGroupBarChart(groupBarRef.value, palletDetail.value.materials)
            if (gauge) dialogChartInstances.push(gauge)
            if (groupBar) dialogChartInstances.push(groupBar)
        })
    }
}

// 初始化时恢复主题
restoreTheme()

// 弹窗状态
const dialogVisible = ref(false)
const currentBurden = ref({ burdenName: '', palletCode: '' })
const palletError = ref('')
const gaugeRef = ref(null)
const groupBarRef = ref(null)
const dialogChartInstances = []

// 搜索表单
const searchForm = reactive({
    burdenCode: '',
    burdenName: ''
})

// 图表 ref 与实例管理
const pieRefs = ref([])
const barRefs = ref([])
const setPieRef = (el, index) => { if (el) pieRefs.value[index] = el }
const setBarRef = (el, index) => { if (el) barRefs.value[index] = el }
const chartInstances = []

// ECharts 通用 tooltip 配置（根据主题动态变化）
const getChartTooltip = () => ({
    backgroundColor: isDark.value ? 'rgba(19,26,46,0.92)' : 'rgba(255,255,255,0.95)',
    borderColor: isDark.value ? 'rgba(77,156,255,0.25)' : 'rgba(0,0,0,0.1)',
    position: function (point, params, dom, rect, size) {
        return [point[0] + 10, point[1]]
    },
    textStyle: {
        color: isDark.value ? '#d6e0f0' : '#333',
        fontSize: 12
    },
    extraCssText: 'border-radius:6px'
})

/** 初始化环形饼图 */
function initPieChart(el, data) {
    if (!el) return null
    try {
        let chart = echarts.getInstanceByDom(el)
        if (!chart) {
            chart = echarts.init(el, null, { devicePixelRatio: window.devicePixelRatio })
        }
        chart.setOption({
            tooltip: { ...getChartTooltip(), trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            series: [{
                type: 'pie',
                radius: ['48%', '72%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                label: { show: false },
                emphasis: {
                    label: { show: false, fontSize: 12, fontWeight: 'bold', color: isDark.value ? '#d6e0f0' : '#ccc' },
                    // itemStyle: { shadowBlur: 14, shadowColor: isDark.value ? 'rgba(77,156,255,0.25)' : 'rgba(0,0,0,0.15)' }
                },
                // itemStyle: { borderColor: isDark.value ? 'rgba(22,32,56,0.9)' : 'rgba(0,0,0,0.08)', borderWidth: 2 },
                data: [
                    {
                        value: data.fullyMatchedCount || 0,
                        name: proxy.$t('burdenDashboard.fullyMatched'),
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#5eead4' }, { offset: 1, color: '#36d399' }
                            ])
                        }
                    },
                    {
                        value: data.partiallyMatchedCount || 0,
                        name: proxy.$t('burdenDashboard.partiallyMatched'),
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#fde68a' }, { offset: 1, color: '#fbbd23' }
                            ])
                        }
                    },
                    {
                        value: data.remainingCapacity || data.remainingCount || 0,
                        name: proxy.$t('burdenDashboard.remaining'),
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#93c5fd' }, { offset: 1, color: '#4d9cff' }
                            ])
                        }
                    }
                ]
            }]
        })
        return chart
    } catch (e) {
        console.error('initPieChart error:', e)
        return null
    }
}

/** 初始化横向柱状图 */
function initBarChart(el, data) {
    if (!el) return null
    try {
        let chart = echarts.getInstanceByDom(el)
        if (!chart) {
            chart = echarts.init(el, null, { devicePixelRatio: window.devicePixelRatio })
        }
        chart.setOption({
            tooltip: { ...getChartTooltip(), trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 78, right: 38, top: 14, bottom: 14 },
            xAxis: { type: 'value', show: false },
            yAxis: {
                type: 'category',
                data: [
                    proxy.$t('burdenDashboard.remaining'),
                    proxy.$t('burdenDashboard.partiallyMatched'),
                    proxy.$t('burdenDashboard.fullyMatched')
                ],
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { fontSize: 11, color: isDark.value ? '#8899b4' : '#606266' }
            },
            series: [{
                type: 'bar',
                barWidth: 15,
                data: [
                    {
                        value: data.remainingCapacity || data.remainingCount || 0,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#93c5fd' }, { offset: 1, color: '#4d9cff' }
                            ]),
                            borderRadius: [0, 7, 7, 0]
                        }
                    },
                    {
                        value: data.partiallyMatchedCount || 0,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#fde68a' }, { offset: 1, color: '#fbbd23' }
                            ]),
                            borderRadius: [0, 7, 7, 0]
                        }
                    },
                    {
                        value: data.fullyMatchedCount || 0,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: '#5eead4' }, { offset: 1, color: '#36d399' }
                            ]),
                            borderRadius: [0, 7, 7, 0]
                        }
                    }
                ],
                label: { show: true, position: 'right', fontSize: 13, fontWeight: 'bold', color: isDark.value ? '#d6e0f0' : '#333' },
                showBackground: true,
                backgroundStyle: { color: isDark.value ? 'rgba(77,156,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: [0, 7, 7, 0] }
            }]
        })
        return chart
    } catch (e) {
        console.error('initBarChart error:', e)
        return null
    }
}

/** 初始化/更新所有配料卡片图表 */
function initAllCharts() {
    // 销毁旧实例
    chartInstances.forEach(c => { try { c.dispose() } catch (_) { } })
    chartInstances.length = 0

    burdenList.value.forEach((item, index) => {
        const pieEl = pieRefs.value[index]
        const barEl = barRefs.value[index]
        const pie = initPieChart(pieEl, item)
        const bar = initBarChart(barEl, item)
        if (pie) chartInstances.push(pie)
        if (bar) chartInstances.push(bar)
    })
}

/** 窗口 resize 处理 */
function handleResize() {
    chartInstances.forEach(c => { try { c.resize() } catch (_) { } })
    dialogChartInstances.forEach(c => { try { c.resize() } catch (_) { } })
}

// 监听 burdenList 变化，初始化/更新图表
watch(burdenList, () => {
    nextTick(() => { initAllCharts() })
}, { deep: true })

/** 搜索 */
function handleSearch() {
    const params = {}
    if (searchForm.burdenCode) params.burdenCode = searchForm.burdenCode
    if (searchForm.burdenName) params.burdenName = searchForm.burdenName
    store.fetchBurdenList(params).catch(() => {
        ElMessage.error(proxy.$t('burdenDashboard.loadError'))
    })
}

/** 重置 */
function handleReset() {
    searchForm.burdenCode = ''
    searchForm.burdenName = ''
    store.fetchBurdenList().catch(() => {
        ElMessage.error(proxy.$t('burdenDashboard.loadError'))
    })
}

/** 导出 */
function handleExport() {
    const params = {}
    if (searchForm.burdenCode) params.burdenCode = searchForm.burdenCode
    if (searchForm.burdenName) params.burdenName = searchForm.burdenName
    exportBurdenDashboard(params).catch(() => {
        ElMessage.error(proxy.$t('burdenDashboard.exportError'))
    })
}

/** 托盘标签点击 — 打开明细弹窗 */
function handlePalletClick(burdenId, palletCode) {
    // 从 burdenList 中找到对应的配料名称
    const burden = burdenList.value.find(b => (b.id || b.burdenId) === burdenId)
    currentBurden.value = {
        burdenName: burden ? burden.burdenName : '',
        palletCode
    }
    palletError.value = ''
    dialogVisible.value = true
    store.fetchPalletDetail({ burdenId, palletCode }).catch(() => {
        palletError.value = proxy.$t('burdenDashboard.loadError')
    })
}

/** 初始化仪表盘（物料齐套率） */
function initGaugeChart(el, detail) {
    if (!el || !detail) return null
    try {
        let chart = echarts.getInstanceByDom(el)
        if (!chart) {
            chart = echarts.init(el, null, { devicePixelRatio: window.devicePixelRatio })
        }
        const total = detail.totalMaterialCount || 0
        const available = detail.availableMaterialCount || 0
        const rate = total > 0 ? Math.round((available / total) * 100) : 0
        chart.setOption({
            series: [{
                type: 'gauge',
                startAngle: 220,
                endAngle: -40,
                min: 0,
                max: 100,
                radius: '88%',
                progress: {
                    show: true,
                    width: 13,
                    roundCap: true,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#5eead4' },
                            { offset: 1, color: '#059669' }
                        ])
                    }
                },
                pointer: { show: false },
                axisLine: { lineStyle: { width: 13, color: [[1, isDark.value ? 'rgba(77,156,255,0.08)' : 'rgba(0,0,0,0.08)']] } },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                title: { offsetCenter: [0, '32%'], fontSize: 11, color: isDark.value ? '#8899b4' : '#606266' },
                detail: {
                    offsetCenter: [0, '-5%'],
                    fontSize: 26,
                    fontWeight: 'bold',
                    color: isDark.value ? '#d6e0f0' : '#333',
                    formatter: `${available}/${total}`
                },
                data: [{ value: rate, name: proxy.$t('burdenDashboard.completionRate') }]
            }]
        })
        return chart
    } catch (e) {
        console.error('initGaugeChart error:', e)
        return null
    }
}

/** 初始化分组柱状图（需求 vs 实际数量） */
function initGroupBarChart(el, materials) {
    if (!el || !materials || !materials.length) return null
    try {
        let chart = echarts.getInstanceByDom(el)
        if (!chart) {
            chart = echarts.init(el, null, { devicePixelRatio: window.devicePixelRatio })
        }
        const names = materials.map(m => m.materialName)
        const requiredData = materials.map(m => m.requiredQty)
        const actualData = materials.map(m => m.actualQty)
        chart.setOption({
            tooltip: { ...getChartTooltip(), trigger: 'axis' },
            legend: {
                top: 0,
                textStyle: { fontSize: 11, color: isDark.value ? '#8899b4' : '#606266' }
            },
            grid: { left: 48, right: 14, top: 28, bottom: 60 },
            xAxis: {
                type: 'category',
                data: names,
                axisLabel: { fontSize: 10, color: isDark.value ? '#8899b4' : '#606266', rotate: names.length > 4 ? 25 : 0, interval: 0 },
                axisLine: { lineStyle: { color: isDark.value ? 'rgba(77,156,255,0.1)' : 'rgba(0,0,0,0.1)' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: { fontSize: 10, color: isDark.value ? '#8899b4' : '#606266' },
                splitLine: { lineStyle: { color: isDark.value ? 'rgba(77,156,255,0.06)' : 'rgba(0,0,0,0.05)' } },
                axisLine: { show: false }
            },
            series: [
                {
                    name: proxy.$t('burdenDashboard.requiredQtyLabel'),
                    type: 'bar',
                    barGap: 0,
                    barWidth: 15,
                    data: requiredData,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#93c5fd' },
                            { offset: 1, color: '#4d9cff' }
                        ]),
                        borderRadius: [3, 3, 0, 0]
                    }
                },
                {
                    name: proxy.$t('burdenDashboard.actualQtyLabel'),
                    type: 'bar',
                    barWidth: 15,
                    data: actualData,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#5eead4' },
                            { offset: 1, color: '#36d399' }
                        ]),
                        borderRadius: [3, 3, 0, 0]
                    }
                }
            ]
        })
        return chart
    } catch (e) {
        console.error('initGroupBarChart error:', e)
        return null
    }
}

/** 初始化弹窗内图表 */
function initDialogCharts() {
    // 销毁旧弹窗图表实例
    dialogChartInstances.forEach(c => { try { c.dispose() } catch (_) { } })
    dialogChartInstances.length = 0

    if (!palletDetail.value) return
    const detail = palletDetail.value

    nextTick(() => {
        const gauge = initGaugeChart(gaugeRef.value, detail)
        const groupBar = initGroupBarChart(groupBarRef.value, detail.materials)
        if (gauge) dialogChartInstances.push(gauge)
        if (groupBar) dialogChartInstances.push(groupBar)
    })
}

/** 状态标签样式类 */
function getStatusType(status) {
    if (status === 'sufficient') return 'status-tag--green'
    if (status === 'insufficient') return 'status-tag--orange'
    if (status === 'missing') return 'status-tag--red'
    return ''
}

// 监听 palletDetail 变化，初始化弹窗图表
watch(palletDetail, () => {
    if (dialogVisible.value && palletDetail.value) {
        initDialogCharts()
    }
})

// 页面加载时获取数据 + 注册 resize 监听
onMounted(() => {
    store.fetchBurdenList().catch(() => {
        ElMessage.error(proxy.$t('burdenDashboard.loadError'))
    })
    window.addEventListener('resize', handleResize)
})

// 页面卸载时清理图表实例 + 移除 resize 监听
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    chartInstances.forEach(c => { try { c.dispose() } catch (_) { } })
    chartInstances.length = 0
    dialogChartInstances.forEach(c => { try { c.dispose() } catch (_) { } })
    dialogChartInstances.length = 0
})
</script>

<style scoped lang="scss">
// 主题切换按钮
.theme-toggle {
    position: absolute;
    top: 20px;
    right: 24px;
    z-index: 10;

    .el-button {
        width: 40px;
        height: 40px;
        border: none;
        background: var(--card);
        color: var(--text);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        &:hover {
            background: var(--blue);
            color: #fff;
        }
    }
}

.burden-dashboard {
    padding: 10px;
    position: relative;
    z-index: 1;
    margin: 0;
    min-height: calc(100vh - 84px);
    background: var(--bg-gradient);
    font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
        "Noto Sans SC", sans-serif;
    color: var(--text);
    font-size: 13px;
    box-sizing: border-box;
    transition: background 0.3s ease;
}

// 标题区
.page-title {
    text-align: center;
    margin-bottom: 15px;

    h1 {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 6px;
        background: linear-gradient(135deg, var(--blue), var(--green));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }

    &__sub {
        font-size: 12px;
        color: var(--text2);
        margin-top: 4px;
        letter-spacing: 4px;
    }

    // 呼吸光效分割线
    &::after {
        content: "";
        display: block;
        width: 180px;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            var(--blue),
            transparent
        );
        margin: 10px auto 0;
        animation: pulse 3s ease-in-out infinite;
    }
}

// 标题呼吸光效分割线动画
@keyframes pulse {
    0%,
    100% {
        opacity: 0.35;
    }
    50% {
        opacity: 0.85;
    }
}

// 搜索栏 - 毛玻璃效果 + 半透明边框
.search-bar {
    background: var(--card);
    backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 20px;
    margin-bottom: 15px;

    .search-form {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0;
    }

    :deep(.el-form-item__label) {
        color: var(--text2);
        font-size: 12px;
    }

    :deep(.el-input__wrapper) {
        background: var(--input-bg);
        border: 1px solid var(--border);
        border-radius: 5px;
        box-shadow: none;

        &:hover,
        &.is-focus {
            border-color: var(--blue);
            box-shadow: 0 0 0 3px rgba(77, 156, 255, 0.12);
        }
    }

    :deep(.el-input__inner) {
        color: var(--text);
        font-size: 12px;

        &::placeholder {
            color: var(--text3);
        }
    }
}

// 概览统计条
.overview-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 15px;
}

// 概览项 - 毛玻璃 + 半透明边框 + fadeUp 入场动画（依次递增延迟）
.ov-item {
    background: var(--card);
    backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 18px;
    position: relative;
    overflow: hidden;
    transition: all 0.25s;
    animation: fadeUp 0.35s ease-out both;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px var(--shadow);
    }

    // 顶部渐变色条
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
    }

    &--blue {
        &::before {
            background: linear-gradient(90deg, var(--blue), transparent);
        }
        .ov-num {
            color: var(--blue);
        }
        animation-delay: 0s;
    }
    &--green {
        &::before {
            background: linear-gradient(90deg, var(--green), transparent);
        }
        .ov-num {
            color: var(--green);
        }
        animation-delay: 0.06s;
    }
    &--orange {
        &::before {
            background: linear-gradient(90deg, var(--orange), transparent);
        }
        .ov-num {
            color: var(--orange);
        }
        animation-delay: 0.12s;
    }
    &--purple {
        &::before {
            background: linear-gradient(90deg, var(--purple), transparent);
        }
        .ov-num {
            color: var(--purple);
        }
        animation-delay: 0.18s;
    }
}

.ov-label {
    font-size: 12px;
    color: var(--text2);
    margin-bottom: 6px;
}

.ov-num {
    font-size: 30px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
}

.ov-sub {
    font-size: 11px;
    color: var(--text3);
    margin-top: 3px;
    letter-spacing: 1px;
}

// 卡片网格
.card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
}

// 配料卡片 - 毛玻璃 + 半透明边框 + fadeUp 入场动画 + hover 顶部渐变光线和阴影提升
.burden-card {
    background: var(--card);
    backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s;
    position: relative;
    animation: fadeUp 0.45s ease-out both;

    // hover 顶部渐变光线
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            var(--blue),
            transparent
        );
        opacity: 0;
        transition: opacity 0.3s;
    }

    // hover 阴影提升 + 顶部光线显现
    &:hover {
        border-color: var(--border-hover);
        box-shadow: 0 6px 28px var(--shadow);

        &::before {
            opacity: 1;
        }
    }
}

.card-top {
    padding: 14px 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.card-code {
    font-size: 15px;
    font-weight: 700;
    color: var(--blue);
    letter-spacing: 0.5px;
}

.card-name {
    font-size: 12px;
    color: var(--text2);
    margin-top: 2px;
}

.card-total {
    text-align: right;

    &__label {
        font-size: 10px;
        color: var(--text3);
    }

    &__num {
        font-size: 22px;
        font-weight: 700;
        color: var(--text);
    }
}

// 图表区域
.chart-row {
    display: flex;
    align-items: center;
    padding: 0 4px;
}

.chart-pie {
    width: 165px;
    height: 165px;
    flex-shrink: 0;
}

.chart-bar {
    flex: 1;
    height: 165px;
    min-width: 0;
}

// 托盘标签区域
.pallet-section {
    padding: 6px 16px 12px;
    border-top: 1px solid rgba(77, 156, 255, 0.08);
}

.pallet-group {
    margin-bottom: 5px;
}

.pallet-group-title {
    font-size: 11px;
    color: var(--text2);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;

    &--green {
        background: var(--green);
        box-shadow: 0 0 5px rgba(54, 211, 153, 0.5);
    }

    &--orange {
        background: var(--orange);
        box-shadow: 0 0 5px rgba(251, 189, 35, 0.5);
    }
}

.pallet-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.tag {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 3px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;

    &--green {
        background: rgba(54, 211, 153, 0.1);
        color: var(--green);
        border: 1px solid rgba(54, 211, 153, 0.2);

        &:hover {
            background: var(--green);
            color: var(--bg);
            box-shadow: 0 2px 12px rgba(54, 211, 153, 0.35);
        }
    }

    &--orange {
        background: rgba(251, 189, 35, 0.1);
        color: var(--orange);
        border: 1px solid rgba(251, 189, 35, 0.2);

        &:hover {
            background: var(--orange);
            color: var(--bg);
            box-shadow: 0 2px 12px rgba(251, 189, 35, 0.35);
        }
    }
}

// 入场 fadeUp 动画（卡片和概览项依次递增延迟）
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dialog-body {
    padding: 20px;
    min-height: 200px;
    color: var(--text);
}

.dialog-charts {
    display: flex;
    padding: 10px 14px;
    gap: 16px;
    margin-bottom: 20px;
    background: var(--card);
    border-radius: 8px;
    border: 1px solid var(--border);
}

.dialog-gauge {
    width: 220px;
    height: 260px;
    flex-shrink: 0;
}

.dialog-group-bar {
    flex: 1;
    height: 260px;
    min-width: 0;
}

.material-table {
    margin: 0;
    width: 100%;
}

// 响应式布局
@media (max-width: 899px) {
    .card-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 767px) {
    .overview-bar {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>

<!-- 托盘明细弹窗样式 — 非 scoped，因为 el-dialog 被 teleport 到 body 外 -->
<style lang="scss">
.pallet-detail-dialog.el-dialog {
    background: var(--dialog-bg) !important;
    border: 1px solid var(--border) !important;
    border-radius: 8px !important;
    box-shadow: 0 10px 40px var(--shadow) !important;
    transition: background 0.1s ease;

    .el-dialog__header {
        border-bottom: 1px solid var(--border);
        padding: 14px 20px;
        background: transparent;
    }

    .el-dialog__title {
        font-size: 15px;
        font-weight: 600;
        color: var(--text);
    }

    .el-dialog__headerbtn .el-dialog__close {
        color: var(--text2);
        &:hover {
            color: var(--text);
        }
    }

    .el-dialog__body {
        padding: 0;
        background: transparent;
    }

    .el-table {
        --el-table-border-color: var(--border);
        --el-table-border: 1px solid var(--border);
        background-color: transparent !important;
        color: var(--text);
        border: none !important;
        &::before {
            background-color: var(--border);
        }
        &::after {
            display: none !important;
        }
        .el-table__border-left-patch {
            display: none !important;
        }
        .el-table__inner-wrapper {
            border: none !important;
        }
        tr {
            background-color: transparent !important;
        }
        th.el-table__cell {
            background-color: var(--table-header-bg) !important;
            color: var(--text2);
            border-bottom: 1px solid var(--border);
            border-right: 1px solid var(--border);
        }
        td.el-table__cell {
            border-bottom: 1px solid var(--border);
            border-right: 1px solid var(--border);
            color: var(--text);
        }
        .el-table__body tr:hover > td.el-table__cell {
            background-color: var(--table-header-bg) !important;
        }
        .el-table__body tr.row-insufficient > td.el-table__cell {
            background-color: rgba(230, 162, 60, 0.1) !important;
        }
        .el-table__body tr.row-missing > td.el-table__cell {
            background-color: rgba(245, 108, 108, 0.1) !important;
        }
        .el-table__empty-block {
            background-color: transparent;
        }
        .el-table__empty-text {
            color: var(--text3);
        }
        .el-table__inner-wrapper::before {
            display: none;
        }
    }

    .el-loading-mask {
        background-color: var(--loading-bg);
    }

    .status-tag {
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 11px;
        display: inline-block;
        &--green {
            background: rgba(54, 211, 153, 0.15);
            color: var(--green);
            border: 1px solid rgba(54, 211, 153, 0.3);
        }
        &--orange {
            background: rgba(251, 189, 35, 0.15);
            color: var(--orange);
            border: 1px solid rgba(251, 189, 35, 0.3);
        }
        &--red {
            background: rgba(248, 114, 114, 0.15);
            color: var(--red);
            border: 1px solid rgba(248, 114, 114, 0.3);
        }
    }

    .dialog-error {
        padding: 20px;
        text-align: center;
        color: var(--red);
        font-size: 13px;
    }
}
</style>
