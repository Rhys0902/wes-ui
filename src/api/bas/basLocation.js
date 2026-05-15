import request from "@/utils/request";

// 查询库位主数据列表
export function listBasLocation(query) {
  return request({
    url: "/bas/basLocation/list",
    method: "get",
    params: query,
  });
}

// 查询库位主数据详细
export function getBasLocation(id) {
  return request({
    url: "/bas/basLocation/" + id,
    method: "get",
  });
}

// 新增库位主数据
export function addBasLocation(data) {
  return request({
    url: "/bas/basLocation",
    method: "post",
    data: data,
  });
}

// 修改库位主数据
export function updateBasLocation(data) {
  return request({
    url: "/bas/basLocation",
    method: "put",
    data: data,
  });
}

// 删除库位主数据
export function delBasLocation(id) {
  return request({
    url: "/bas/basLocation/" + id,
    method: "delete",
  });
}

// 打印料箱二维码
export function print(ids) {
  return request({
    url: "/bas/basLocation/print/" + ids,
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    responseType: "arraybuffer", //一定要设置响应类型，否则页面会是空白pdf
  });
}
