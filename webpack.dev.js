"use strict";

// NODE MODULES
const glob = require("glob");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// BUNDLER MODULES
const commonConfig = require("./webpack.common");
const getEntryPoint = require("./src/bundler/getEntryPoint");
const getProject = require("./src/bundler/getProject")


let devConfig = {
  mode: "development",
  entry: {
    ui: "./src/ui/main.js",
  },
  devServer: {
    watchFiles: ["projects/**/*", "src/library/**/*"],
    port: 8080,
    open: true,
    client: {
      overlay: true,
      progress: true,
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
      template: "./src/ui/index.html.hbs",
      templateParameters: {
        projects: [],
        creatives: [],
      },
    }),
  ],
};

module.exports = async () => {
  try {
    const localCreativeSlugs = glob
      .sync("./projects/**/main.js")
      .map((path) => path.split("/").splice(-2)[0]);

    for (const slug of localCreativeSlugs) {
      const project = await getProject({ "creatives.slug": slug });
      if (!project) continue;

      const creative = project.creatives.find(
        (creative) => creative.slug === slug
      );

      devConfig.plugins.push(
        new HtmlWebpackPlugin({
          filename: slug + "/index.html",
          hash: true,
          chunks: [slug],
          template: "./src/template/hbs/index.html.hbs",
          templateParameters: {
            environment: devConfig.mode,
            project: project,
            creative: creative,
            markup: `<h1>CSS is awesome</h1>`,
          },
        })
      );

      Object.assign(devConfig.entry, getEntryPoint(creative.slug));
      devConfig.plugins[0].userOptions.templateParameters.creatives.push(
        creative
      );
    }

    const config = merge(devConfig, commonConfig);
    return config;
  } catch (e) {
    console.error(e);
  }
};
