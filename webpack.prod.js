"use strict";

// NODE MODULES
const path = require("path");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// BUNDLER MODULES
const commonConfig = require("./webpack.common.js");

// DATA MODEL
const project = require("./src/data/models/Project");

const productionConfig = {
  mode: "production",
  output: {
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|gif)$/,
        type: "asset",
      },
      {
        test: /\.(jpg|png|gif|svg|webp)$/,
        enforce: "pre",
        use: {
          loader: "image-webpack-loader",
          options: {
            mozjpeg: {
              progressive: true,
              maxMemory: 100,
              quality: 66,
            },
            optipng: {
              enabled: true,
            },
            pngquant: {
              quality: [0.5, 0.8],
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 40,
            },
          },
        },
      },
      {
        test: /\.sass$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: { esmodules: true },
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: "css/[name].chunk.css",
    }),
  ],
  optimization: {
    minimize: true,
  },
};

module.exports = async (env) => {
  const creativeIDs = env && env.creatives ? env.creatives.split(",") : [];
  const creativeConfigs = [];

  if (env.preview)
    return merge(
      {
        name: "preview",
        entry: { preview: "./src/preview/main.js" },
        output: {
          path: path.resolve(process.cwd(), "upload", "preview"),
          filename: "main.js",
          chunkFilename: "js/[name].chunk.js",
          assetModuleFilename: "img/[name][ext]",
          clean: true,
        },
        plugins: [
          new HtmlWebpackPlugin({
            filename: "index.html",
            hash: true,
            chunks: ["preview"],
            template: "./src/preview/index.html",
          }),
        ],
      },
      commonConfig,
      productionConfig
    );

  for (const creativeID of creativeIDs) {
    const projectItem = project.read({ "creatives.id": creativeID });
    const creative = projectItem.creatives.find(
      (projectCreative) => projectCreative.id === creativeID
    );

    if (creative.format.type === "Video") continue;

    const creativeConfig = {
      name: creative.slug,
      entry: { [creative.slug]: project.entrypoints[creative.slug] },
      output: {
        path: path.resolve(
          process.cwd(),
          "upload",
          new Date(projectItem.campaign.planning.start)
            .getFullYear()
            .toString(),
          projectItem.brand.slug,
          creative.slug
        ),
        filename: "main.js",
        chunkFilename: "js/[name].chunk.js",
        assetModuleFilename: "img/[name][ext]",
        clean: true,
      },
      plugins: [
        new HtmlWebpackPlugin({
          filename: "index.html",
          hash: true,
          chunks: [creative.slug],
          template: "./src/template/hbs/index.html.hbs",
          templateParameters: {
            environment: "production",
            project: projectItem,
            creative: creative,
            markup: `<h1>CSS is awesome</h1>`,
          },
        }),
      ],
    };

    const config = merge(creativeConfig, commonConfig, productionConfig);
    creativeConfigs.push(config);
  }
  return creativeConfigs;
};
