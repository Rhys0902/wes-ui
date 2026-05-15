import { listBurdenDashboard, getPalletDetail } from '@/api/report/burdenDashboard'

const useBurdenDashboardStore = defineStore(
  'burdenDashboard',
  {
    state: () => ({
      burdenList: [],
      loading: false,
      palletDetail: null,
      palletLoading: false
    }),

    getters: {
      overviewStats(state) {
        const list = state.burdenList
        return {
          totalTemplates: list.length,
          totalFullyMatched: list.reduce((sum, item) => sum + (item.fullyMatchedCount || 0), 0),
          totalPartiallyMatched: list.reduce((sum, item) => sum + (item.partiallyMatchedCount || 0), 0),
          totalRemaining: list.reduce((sum, item) => sum + (item.remainingCapacity || item.remainingCount || 0), 0)
        }
      }
    },

    actions: {
      fetchBurdenList(query) {
        this.loading = true
        return listBurdenDashboard(query).then(response => {
          this.burdenList = response.data || response.rows || []
          this.loading = false
          return response
        }).catch(error => {
          this.loading = false
          throw error
        })
      },
      fetchPalletDetail(query) {
        this.palletLoading = true
        return getPalletDetail(query).then(response => {
          // 后端返回数组，需要找到匹配 palletCode 的记录
          const list = response.data || []
          const match = list.find(item => item.leCode === query.palletCode)
          if (match) {
            // 计算 totalMaterialCount（后端未直接提供）
            const totalMaterialCount = match.materials ? match.materials.length : 0
            this.palletDetail = {
              burdenName: match.burdenName || '',
              palletCode: match.leCode || query.palletCode,
              totalMaterialCount,
              availableMaterialCount: match.availableMaterialCount || 0,
              materials: match.materials || []
            }
          } else if (list.length > 0) {
            // 如果没有精确匹配，使用第一条
            const first = list[0]
            const totalMaterialCount = first.materials ? first.materials.length : 0
            this.palletDetail = {
              burdenName: first.burdenName || '',
              palletCode: first.leCode || query.palletCode,
              totalMaterialCount,
              availableMaterialCount: first.availableMaterialCount || 0,
              materials: first.materials || []
            }
          } else {
            this.palletDetail = null
          }
          this.palletLoading = false
          return response
        }).catch(error => {
          this.palletLoading = false
          throw error
        })
      }
    }
  }
)

export default useBurdenDashboardStore
