import request from "@/utils/request";

// 查询VIEW列表
export function listOutboundHeaderDetail(query) {
  return request({
    url: "/outbound/outboundHeaderDetail/list",
    method: "get",
    params: query,
  });
}

// 查询VIEW详细
export function getOutboundHeaderDetail(headerId) {
  return request({
    url: "/outbound/outboundHeaderDetail/" + headerId,
    method: "get",
  });
}

// 新增VIEW
export function addOutboundHeaderDetail(data) {
  return request({
    url: "/outbound/outboundHeaderDetail",
    method: "post",
    data: data,
  });
}

// 修改VIEW
export function updateOutboundHeaderDetail(data) {
  return request({
    url: "/outbound/outboundHeaderDetail",
    method: "put",
    data: data,
  });
}

// 删除VIEW
export function delOutboundHeaderDetail(headerId) {
  return request({
    url: "/outbound/outboundHeaderDetail/" + headerId,
    method: "delete",
  });
}

// 新增明细
export function outboundHeaderAdd(data) {
  return request({
    url: "/outbound/outboundHeaderDetail/add",
    method: "post",
    data: data,
  });
}

// 修改明细
export function outboundHeaderEdit(data) {
  return request({
    url: "/outbound/outboundHeaderDetail/edit",
    method: "put",
    data: data,
  });
}

// 出库分配
export function outboundHeadeAllocation(data) {
  return request({
    url: "/outbound/outboundHeaderDetail/allocation",
    method: "post",
    data: data,
  });
}
