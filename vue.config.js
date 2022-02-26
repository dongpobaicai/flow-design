const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const vueConfig = {
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.resolve.alias.set("@$", resolve("src")).set("#$", resolve("types"));
    config.plugin("html").tap((args) => {
      args[0].title = "流程设计器";
      return args;
    });
  },
};

module.exports = vueConfig;
