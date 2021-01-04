const path = require("path");
const package = require("./package.json");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

const { data } = package;

const publicPathName = "custom";
const widgetPathName = data.widgetName;

module.exports = {
  entry: "./src/App.js",
  mode: "production",
  output: {
    publicPath: "./",
    path: path.resolve(__dirname, "dist"),
    filename: `${widgetPathName}/[name].js`,
    libraryTarget: "jsonp",
    library: data.widgetName,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: [/\.(bmp|gif|jpe?g|png|svg)$/],
        use: [
          {
            loader: "file-loader",
            options: {
              name: `${widgetPathName}/assets/img/[name].[hash:8].[ext]`,
              publicPath: publicPathName,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ZipPlugin({
      filename: `${widgetPathName}.zip`,
    }),
  ],
};
