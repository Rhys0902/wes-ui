import request from "@/utils/request";

// 查询入库分配明细列表
export function listInboundAllocation(query) {
  return request({
    url: "/inbound/inboundAllocation/list",
    method: "get",
    params: query,
  });
}

// 查询入库分配明细详细
export function getInboundAllocation(id) {
  return request({
    url: "/inbound/inboundAllocation/" + id,
    method: "get",
  });
}

// 新增入库分配明细
export function addInboundAllocation(data) {
  return request({
    url: "/inbound/inboundAllocation",
    method: "post",
    data: data,
  });
}

// 修改入库分配明细
export function updateInboundAllocation(data) {
  return request({
    url: "/inbound/inboundAllocation",
    method: "put",
    data: data,
  });
}

// 删除入库分配明细
export function delInboundAllocation(id) {
  return request({
    url: "/inbound/inboundAllocation/" + id,
    method: "delete",
  });
}

// 确认上架
export function inboundAllocationPutAway(data) {
  return request({
    url: "/inbound/inboundAllocation/putAway",
    method: "post",
    data: data,
  });
}

// 取消收货
export function inboundAllocationCancelReceive(ids) {
  return request({
    url: "/inbound/inboundAllocation/cancelReceive?ids=" + ids,
    method: "post",
  });
}

export function inboundAllocationReceive(data) {
  return request({
    url: "/inbound/inboundHeader/receive",
    method: "post",
    data: data,
  });
}

// 叫箱
export function callBox(data) {
  return request({
    url: "/inbound/inboundAllocation/callBox",
    method: "post",
    data: data,
  });
}

// 直接收货
export function receive(data) {
  return request({
    url: "/inbound/inboundAllocation/receive",
    method: "post",
    data: data,
  });
}

//空托盘上架
export function inboundAllocationEmptyLePutWay(data) {
  return request({
    url: "/inbound/inboundAllocation/emptyLePutWay",
    method: "post",
    data: data,
  });
}
