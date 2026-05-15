/* 监听语言Elementplus 语言 变化 */
export const localsChangedNotify = (value) => {
  const event = new CustomEvent("onLocalsChanged", { detail: value });
  window.dispatchEvent(event);
};

/* 设置localStorage locale 语言版本  */
export const languageSet = () => {
  if (localStorage.getItem("lang")) {
    return localStorage.getItem("lang");
  }
  return localStorage.setItem("lang", "zh_CN");
};
