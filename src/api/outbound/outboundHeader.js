import request from "@/utils/request";

// 查询出库单头列表
export function listOutboundHeader(query) {
  return request({
    url: "/outbound/outboundHeader/list",
    method: "get",
    params: query,
  });
}

// 查询出库单头详细
export function getOutboundHeader(id) {
  return request({
    url: "/outbound/outboundHeader/" + id,
    method: "get",
  });
}

// 新增出库单头
export function addOutboundHeader(data) {
  return request({
    url: "/outbound/outboundHeader",
    method: "post",
    data: data,
  });
}

// 修改出库单头
export function updateOutboundHeader(data) {
  return request({
    url: "/outbound/outboundHeader",
    method: "put",
    data: data,
  });
}

// 删除出库单头
export function delOutboundHeader(id) {
  return request({
    url: "/outbound/outboundHeader/" + id,
    method: "delete",
  });
}

// 出库分配
export function outboundHeaderAllocation(data) {
  return request({
    url: "/outbound/outboundHeader/allocation",
    method: "post",
    data: data,
  });
}
