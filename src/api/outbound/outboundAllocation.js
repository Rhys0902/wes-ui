import request from "@/utils/request";

// 查询出库分配明细列表
export function listOutboundAllocation(query) {
  return request({
    url: "/outbound/outboundAllocation/list",
    method: "get",
    params: query,
  });
}

// 查询出库分配明细详细
export function getOutboundAllocation(id) {
  return request({
    url: "/outbound/outboundAllocation/" + id,
    method: "get",
  });
}

// 新增出库分配明细
export function addOutboundAllocation(data) {
  return request({
    url: "/outbound/outboundAllocation",
    method: "post",
    data: data,
  });
}

// 修改出库分配明细
export function updateOutboundAllocation(data) {
  return request({
    url: "/outbound/outboundAllocation",
    method: "put",
    data: data,
  });
}

// 删除出库分配明细
export function delOutboundAllocation(id) {
  return request({
    url: "/outbound/outboundAllocation/" + id,
    method: "delete",
  });
}
// 下架
export function outboundAllocationPutDown(data) {
  return request({
    url: "/outbound/outboundAllocation/putDown",
    method: "post",
    data: data,
  });
}
// 出库确认
export function outboundAllocationConfirm(data) {
  return request({
    url: "/outbound/outboundAllocation/confirm",
    method: "post",
    data: data,
  });
}

// 余料回库
export function outboundAllocationReturnBack(data) {
  return request({
    url: "/outbound/outboundAllocation/returnBack",
    method: "post",
    data: data,
  });
}

/* 挑选库存 */
export function outboundAllocationChooseStock(data) {
  return request({
    url: "/outbound/outboundAllocation/chooseStock",
    method: "post",
    data: data,
  });
}

// 直接出库
export function outboundAllocationDirectOutbound(data) {
  return request({
    url: "/outbound/outboundAllocation/directOutbound",
    method: "post",
    data: data,
  });
}

// 取消出库
export function outboundAllocationCancelOutbound(ids) {
  return request({
    url: "/outbound/outboundAllocation/cancelOutbound?ids=" + ids,
    method: "post",
  });
}
