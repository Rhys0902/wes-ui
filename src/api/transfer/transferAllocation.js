import request from "@/utils/request";

// 查询移库分配列表
export function listTransferAllocation(query) {
  return request({
    url: "/transfer/transferAllocation/list",
    method: "get",
    params: query,
  });
}

// 查询移库分配详细
export function getTransferAllocation(id) {
  return request({
    url: "/transfer/transferAllocation/" + id,
    method: "get",
  });
}

// 新增移库分配
export function addTransferAllocation(data) {
  return request({
    url: "/transfer/transferAllocation",
    method: "post",
    data: data,
  });
}

// 修改移库分配
export function updateTransferAllocation(data) {
  return request({
    url: "/transfer/transferAllocation",
    method: "put",
    data: data,
  });
}

// 删除移库分配
export function delTransferAllocation(id) {
  return request({
    url: "/transfer/transferAllocation/" + id,
    method: "delete",
  });
}

// 新增移库

export function transferConfirm(data) {
  return request({
    url: "/transfer/transferAllocation/confirm",
    method: "post",
    data: data,
  });
}
