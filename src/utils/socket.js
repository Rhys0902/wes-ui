import { getToken } from "@/utils/auth";

let url = window.global_config["websocket"];

// websocket实例
var ws;
// 重连定时器实例
var tt;
// websocket重连开关
var websocketswitch = false;

// websocket对象
var websocket = {
  // websocket建立连接
  async Init() {
    // 判断浏览器是否支持websocket
    if (!"WebSocket" in window) {
      this.$modal.msgError("您的浏览器不支持WebSocket");
      return;
    }
    // 创建websocket实例
    ws = new WebSocket(
      url + "/resource/websocket" + "?Authorization=Bearer " + getToken()
    );

    // 监听websocket连接
    ws.onopen = function () {
      console.log("websocket连接成功");
    };
    // 监听websocket连接错误信息
    ws.onerror = function (e) {
      console.log("websocket传输发生错误");
      // 打开重连
      reconnect();
    };
    // 监听websocket接受消息
    ws.onmessage = function (e) {
      //心跳消息不做处理
      if (e.data === "ok") {
        return;
      }
    };
    ws.onclose = function () {
      reconnect();
    };
  },
  disconnectWs() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // 确保WebSocket连接已建立且处于打开状态
      ws.close(); // 断开连接
    } else {
    }
  },
  // websocket连接关闭方法
  onClose() {
    //关闭断开重连机制
    websocketswitch = true;
    ws.close();
  },
  // websocket发送信息方法
  Send(data) {
    // 处理发送数据JSON字符串
    let msg = JSON.stringify(data);
    // 发送消息给后端
    ws.send(msg);
  },
  // 暴露websocket实例
  getWebSocket() {
    return ws;
  },
};

// 监听窗口关闭事件，当窗口关闭时-每一个页面关闭都会触发-扩张需求业务
window.onbeforeunload = function () {};

// 浏览器刷新重新连接
// 刷新页面后需要重连-并且是在登录之后
if (getToken()) {
  //刷新后重连
  websocket.Init();
}

// 重连方法
function reconnect() {
  // 判断是否主动关闭连接
  if (websocketswitch) {
    return;
  }
  // 重连定时器-每次websocket错误方法onerror触发他都会触发
  tt && clearTimeout(tt);
  tt = setTimeout(function () {
    websocket.Init();
    websocketswitch = false;
  }, 4000);
}

// 暴露对象
export default websocket;
