import request from "@/utils/request"

// 查询库位可视化列表
export function listBasLocationVisual(query) {
  return request({
    url: "/bas/basLocationVisual/list",
    method: "get",
    params: query
  })
}

// 查询库位可视化库存明细
export function listBasLocationVisualInventory(query) {
  return request({
    url: "/bas/basLocationVisual/inventory",
    method: "get",
    params: query
  })
}

// 查询库位可视化任务明细
export function listBasLocationVisualTasks(query) {
  return request({
    url: "/bas/basLocationVisual/tasks",
    method: "get",
    params: query
  })
}

// 查询库位可视化历史记录
export function listBasLocationVisualRecords(query) {
  return request({
    url: "/bas/basLocationVisual/records",
    method: "get",
    params: query
  })
}
