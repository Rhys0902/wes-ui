import { defineConfig, loadEnv } from "vite";
import path from "path";
import createVitePlugins from "./vite/plugins";

const vendorChunkRules = [
  { match: /[\\/]node_modules[\\/](vue|vue-router|pinia|@vueuse)[\\/]/, name: "vue-vendor" },
  { match: "/node_modules/@element-plus/icons-vue/", name: "element-plus-icons" },
  { match: "/node_modules/echarts/", name: "echarts" },
  { match: "/node_modules/zrender/", name: "zrender" },
  { match: "/node_modules/d3", name: "d3" },
  { match: "/node_modules/xlsx/", name: "file-export" },
  { match: "/node_modules/file-saver/", name: "file-export" },
  { match: "/node_modules/@vueup/vue-quill/", name: "editor" },
  { match: "/node_modules/quill/", name: "editor" },
  { match: "/node_modules/lodash/", name: "lodash" },
  { match: "/node_modules/vue-json-viewer/", name: "json-viewer" },
  { match: "/node_modules/vue-cropper/", name: "image-cropper" },
  { match: "/node_modules/axios/", name: "axios" },
  { match: "/node_modules/jsencrypt/", name: "crypto" },
];

function matchChunkRule(normalizedId) {
  const rule = vendorChunkRules.find(({ match }) => {
    return typeof match === "string" ? normalizedId.includes(match) : match.test(normalizedId);
  });
  return rule && rule.name;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: env.VITE_APP_CONTEXT_PATH,
    plugins: createVitePlugins(env, command === "build"),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        "~": path.resolve(__dirname, "./"),
        // 设置别名
        "@": path.resolve(__dirname, "./src"),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    // vite 相关配置
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        "/dev-api": {
          target: "http://localhost:18100",
          //   target: 'http://39.101.200.163:18100',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
      },
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    build: {
      modulePreload: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, "/");
            if (!normalizedId.includes("node_modules")) {
              return undefined;
            }
            if (normalizedId.includes("/node_modules/element-plus/es/components/")) {
              const componentName = normalizedId.split("/node_modules/element-plus/es/components/")[1].split("/")[0];
              if (!componentName || componentName === "index.mjs") {
                return "element-plus-core";
              }
              return `element-plus-${componentName}`;
            }
            if (normalizedId.includes("/node_modules/element-plus/")) {
              return "element-plus-core";
            }
            return matchChunkRule(normalizedId) || "vendor";
          },
        },
      },
    },
  };
});
