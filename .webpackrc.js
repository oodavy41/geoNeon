const path = require("path");

export default {
  entry: "src/App.js",
  disableCSSModules: false,
  publicPath: "/",
  extraBabelPlugins: [],
  disableDynamicImport: false,
  extraBabelPlugins: [["import", { libraryName: "antd", libraryDirectory: "es", style: true }]],
};
