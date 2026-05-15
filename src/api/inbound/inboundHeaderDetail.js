import request from "@/utils/request";

// 查询VIEW列表
export function listInboundHeaderDetail(query) {
  return request({
    url: "/inbound/inboundHeaderDetail/list",
    method: "get",
    params: query,
  });
}

// 查询VIEW详细
export function getInboundHeaderDetail(headerId) {
  return request({
    url: "/inbound/inboundHeaderDetail/" + headerId,
    method: "get",
  });
}

// 新增VIEW
export function addInboundHeaderDetail(data) {
  return request({
    url: "/inbound/inboundHeaderDetail",
    method: "post",
    data: data,
  });
}

// 修改VIEW
export function updateInboundHeaderDetail(data) {
  return request({
    url: "/inbound/inboundHeaderDetail",
    method: "put",
    data: data,
  });
}

// 删除VIEW
export function delInboundHeaderDetail(headerId) {
  return request({
    url: "/inbound/inboundHeaderDetail/" + headerId,
    method: "delete",
  });
}

// 新增明细
export function inboundHeaderAdd(data) {
  return request({
    url: "/inbound/inboundHeaderDetail/add",
    method: "post",
    data: data,
  });
}

// 修改明细
export function inboundHeaderEdit(data) {
  return request({
    url: "/inbound/inboundHeaderDetail/edit",
    method: "put",
    data: data,
  });
}
