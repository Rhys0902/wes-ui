import request from "@/utils/request";

// 查询出库单头列表
export function listBasBurden(query) {
  return request({
    url: "/bas/basBurden/list",
    method: "get",
    params: query,
  });
}

// 查询出库单头详细
export function getBasBurden(id) {
  return request({
    url: "/bas/basBurden/" + id,
    method: "get",
  });
}

export function getBasBurdenDetails(query) {
  return request({
    url: "/bas/basBurden/detailPage",
    method: "get",
     params: query,
  });
}



// 新增出库单头
export function addBasBurden(data) {
  return request({
    url: "/bas/basBurden",
    method: "post",
    data: data,
  });
}

// 修改出库单头
export function updateBasBurden(data) {
  return request({
    url: "/bas/basBurden",
    method: "put",
    data: data,
  });
}

// 删除出库单头
export function delBasBurden(id) {
  return request({
    url: "/bas/basBurden/" + id,
    method: "delete",
  });
}
