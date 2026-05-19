// P0.5阶段先提供前端静态候选项，后续接入业务实体检索接口后可在本模块替换数据来源。
export const ASSISTANT_ENTITY_GROUPS = [
  {
    key: 'warehouse',
    label: '仓库',
    options: [
      { kind: 'warehouse', id: 'WH-NJ-01', label: '南京主仓' },
      { kind: 'warehouse', id: 'WH-NJ-02', label: '南京二仓' },
      { kind: 'warehouse', id: 'WH-QC-01', label: '质检暂存区' }
    ]
  },
  {
    key: 'sku',
    label: 'SKU',
    options: [
      { kind: 'sku', id: 'SKU-000020', label: '000000020' },
      { kind: 'sku', id: 'SKU-000056', label: '000000056' },
      { kind: 'sku', id: 'SKU-BOX-A01', label: '标准周转箱A01' }
    ]
  },
  {
    key: 'staff',
    label: '员工',
    options: [
      { kind: 'staff', id: 'EMP-1001', label: '拣选员 1001' },
      { kind: 'staff', id: 'EMP-1024', label: '复核员 1024' },
      { kind: 'staff', id: 'EMP-1088', label: '库管员 1088' }
    ]
  },
  {
    key: 'order',
    label: '订单',
    options: [
      { kind: 'order', id: 'OUT-20260517-001', label: '出库单 001' },
      { kind: 'order', id: 'IN-20260517-008', label: '入库单 008' },
      { kind: 'order', id: 'MOVE-20260517-003', label: '移库单 003' }
    ]
  },
  {
    key: 'wave',
    label: '波次',
    options: [
      { kind: 'wave', id: 'WAVE-20260517-A', label: '今日A波次' },
      { kind: 'wave', id: 'WAVE-20260517-B', label: '今日B波次' }
    ]
  }
]
