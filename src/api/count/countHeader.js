import request from "@/utils/request";

// 查询盘点单头列表
export function listCountHeader(query) {
  return request({
    url: "/count/countHeader/list",
    method: "get",
    params: query,
  });
}

// 查询盘点单头详细
export function getCountHeader(id) {
  return request({
    url: "/count/countHeader/" + id,
    method: "get",
  });
}

// 新增盘点单头
export function addCountHeader(data) {
  return request({
    url: "/count/countHeader",
    method: "post",
    data: data,
  });
}

// 修改盘点单头
export function updateCountHeader(data) {
  return request({
    url: "/count/countHeader",
    method: "put",
    data: data,
  });
}

// 删除盘点单头
export function delCountHeader(id) {
  return request({
    url: "/count/countHeader/" + id,
    method: "delete",
  });
}
// 查询盘点明细列表
export function countDetail(query) {
  return request({
    url: "/count/countDetail/list",
    method: "get",
    params: query,
  });
}
// 盘点分配
export function countAllocation(id) {
  return request({
    url: "/count/countHeader/allocation/" + id,
    method: "post",
  });
}
