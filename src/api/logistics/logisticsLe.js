import request from "@/utils/request";

// 查询运输容器列表
export function listLogisticsLe(query) {
  return request({
    url: "/logistics/logisticsLe/list",
    method: "get",
    params: query,
  });
}

// 查询运输容器详细
export function getLogisticsLe(id) {
  return request({
    url: "/logistics/logisticsLe/" + id,
    method: "get",
  });
}

// 新增运输容器
export function addLogisticsLe(data) {
  return request({
    url: "/logistics/logisticsLe",
    method: "post",
    data: data,
  });
}

// 修改运输容器
export function updateLogisticsLe(data) {
  return request({
    url: "/logistics/logisticsLe",
    method: "put",
    data: data,
  });
}

// 删除运输容器
export function delLogisticsLe(id) {
  return request({
    url: "/logistics/logisticsLe/" + id,
    method: "delete",
  });
}

// 打印料箱二维码
export function print(ids) {
  return request({
    url: "/logistics/logisticsLe/print/" + ids,
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    responseType: "arraybuffer", //一定要设置响应类型，否则页面会是空白pdf
  });
}

// <查询库存容器>
export function queryAvailableStockLe(data) {
  return request({
    url: "/logistics/logisticsLe/queryAvailableStockLe",
    method: "post",
    data: data,
  });
}

// 解绑运输容器
export function unbindLogisticsLe(les) {
  return request({
    url: "/logistics/logisticsLe/unbindLe/" + les,
    method: "post",
  });
}
