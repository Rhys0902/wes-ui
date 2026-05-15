import request from "@/utils/request";

// 查询作业指令列表
export function listLogisticsInsTask(query) {
  return request({
    url: "/logistics/logisticsInsTask/list",
    method: "get",
    params: query,
  });
}

// 查询作业指令详细
export function getLogisticsInsTask(id) {
  return request({
    url: "/logistics/logisticsInsTask/" + id,
    method: "get",
  });
}

// 新增作业指令
export function addLogisticsInsTask(data) {
  return request({
    url: "/logistics/logisticsInsTask",
    method: "post",
    data: data,
  });
}

// 修改作业指令
export function updateLogisticsInsTask(data) {
  return request({
    url: "/logistics/logisticsInsTask",
    method: "put",
    data: data,
  });
}

// 删除作业指令
export function delLogisticsInsTask(id) {
  return request({
    url: "/logistics/logisticsInsTask/" + id,
    method: "delete",
  });
}
// 手动完成作业指令
export function logisticsInsTaskComplete(data) {
  return request({
    url: "/logistics/logisticsInsTask/complete",
    method: "post",
    data: data,
  });
}

// 手动指定入库申请
export function scsPutAwayTask(data) {
  return request({
    url: "/conn/connApi/scsPutAwayTask",
    method: "post",
    data: data,
  });
}
