import { initConfig, Tconfig, createStyle } from "../core";
// 插件方法
export default function vitePluginVueEcss(config?: Tconfig) {
  // 初始化配置
  initConfig(config);
  return {
    name: "vite-plugin-vue-ecss",
    transform(source: any, id: string) {
      if (!id.endsWith(".vue")) {
        return null;
      }
      createStyle(id, source);
      return source;
    },
  };
}
