import request from "@/utils/request";

// 查询盘点分配明细列表
export function listCountAllocation(query) {
    return request({
        url: '/count/countAllocation/list',
        method: 'get',
        params: query
    })
}
// 盘点下架
export function countAllocationPutDown(data) {
    return request({
        url: '/count/countAllocation/putDown',
        method: 'post',
        data: data
    })
}
// 盘点回库
export function countAllocationReturnBack(data) {
    return request({
        url: '/count/countAllocation/returnBack',
        method: 'post',
        data: data
    })
}

// 查询盘点分配明细详细
export function getCountAllocation(id) {
  return request({
    url: "/count/countAllocation/" + id,
    method: "get",
  });
}

// 新增盘点分配明细
export function addCountAllocation(data) {
  return request({
    url: "/count/countAllocation",
    method: "post",
    data: data,
  });
}

// 修改盘点分配明细
export function updateCountAllocation(data) {
  return request({
    url: "/count/countAllocation",
    method: "put",
    data: data,
  });
}

// 删除盘点分配明细
export function delCountAllocation(id) {
  return request({
    url: "/count/countAllocation/" + id,
    method: "delete",
  });
}

// 盘点确认
export function cuntAllocationConfirm(data) {
  return request({
    url: "/count/countAllocation/confirm",
    method: "post",
    data: data,
  });
}
// 取消分配
export function countCancelAllocation(id) {
  return request({
    url: "/count/countAllocation/cancelAllocation/" + id,
    method: "post",
  });
}