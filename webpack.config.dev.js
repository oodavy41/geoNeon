const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const publicPathName = "static";
const outPutPathName = "js";
const outResoucePathName = "js";

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8050;
const HOST = process.env.HOST || "localhost";

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${publicPathName}/${outPutPathName}/[name].js`,
    // chunkFilename: "[name].min.js"
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  stats: {
    children: false,
  },
  devServer: {
    contentBase: "./",
    host: HOST,
    port: DEFAULT_PORT,
    hot: true,
    inline: true, //实时刷新
    compress: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: [/\.jsx$/, /\.js$/],
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
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: "file-loader",
            options: {
              name: `${publicPathName}/${outResoucePathName}/[name].[hash:8].[ext]`,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Development",
      filename: "index.html",
      template: resolveApp("public/index.html"),
      inject: true,
    }),
  ],
};
