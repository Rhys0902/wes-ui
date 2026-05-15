import { createI18n } from "vue-i18n";
import zh_CN from "./zh.js";
import en_US from "./en.js";

const i18n = createI18n({
  locale: localStorage.getItem("lang") || "zh_CN",
  legacy: false,
  globalInjection: true,
  messages: {
    zh_CN: {
      ...zh_CN,
    },
    en_US: {
      ...en_US,
    },
  },
});
export { i18n };
