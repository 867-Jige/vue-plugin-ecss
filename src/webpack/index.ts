import { initConfig, Tconfig, createStyle } from "../core";

export default class WebpackPluginVueEcss {
  constructor(config: Tconfig) {
    initConfig(config);
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("WebpackPluginVueEcss", (compilation) => {
      compilation.hooks.normalModuleLoader.tap(
        "WebpackPluginVueEcss",
        (loaderContext, module) => {
          const resourcePath = module.resource;
          if (resourcePath && resourcePath.endsWith(".vue")) {
            const fileContent = loaderContext.fs.readFile(
              resourcePath,
              "utf-8"
            );
            createStyle(resourcePath, fileContent);
          }
        }
      );
    });
  }
}

// module.exports = WebpackPluginVueEcss;
