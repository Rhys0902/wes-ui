/**
 * 在config.js文件中统一存放一些公共常量（请求地址），方便之后维护
 */

// ========== 统一配置：只需修改这一个变量 ==========
// 固定IP模式：填写后端服务器IP地址（如：'192.168.0.68'）
// 动态模式：留空字符串（''）或 null，自动使用浏览器访问地址
const BACKEND_IP = '';  // ← 只需修改这里！
// ================================================

// 自动选择：如果设置了BACKEND_IP则使用固定IP，否则使用动态地址
let hostname = BACKEND_IP || window.location.hostname;

window.global_config = {
  baseUrl: "http://" + hostname + ":18100",
  websocket: "ws://" + hostname + ":18100",
  wcs: "http://" + hostname + ":12000",
  snailjob: "http://" + hostname + ":9100/snail-job",
};

