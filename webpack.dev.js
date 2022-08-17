"use strict";

// NODE MODULES
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");

// BUNDLER MODULES
const commonConfig = require("./webpack.common");

// DATA MODEL
const project = require("./src/data/Project");

// PLUGINS
let plugins = [];

let devConfig = {
  mode: "development",
  entry: () => {
    const entrypoints = project.defineEntrypoints();
    plugins = project.defineHTMLPlugins();

    return {
      ui: "./src/ui/main.js",
      preview: "./src/preview/main.js",
      ...entrypoints,
    };
  },
  devServer: {
    watchFiles: ["projects/**/*", "src/**/*"],
    port: 8080,
    open: true,
    client: {
      overlay: true,
    },
  },
  output: {
    filename: "[name]/main.js",
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        type: "asset/resource",
      },
      {
        test: /\.sass$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ["ui"],
      template: "./src/ui/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "preview/index.html",
      chunks: ["preview"],
      template: "./src/preview/index.html",
    }),
    ...project.defineHTMLPlugins([]),
  ],
  optimization: {
    runtimeChunk: "single",
  },
};

module.exports = () => {
  return merge(devConfig, commonConfig);
};
