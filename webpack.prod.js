"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const commonConfig = require("./webpack.common.js");
const getProject = require("./src/bundler/getProject");
const getEntryPoint = require("./src/bundler/getEntryPoint");

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
        test: /\.(jpg|png|gif|svg)$/,
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
              quality: [0.65, 0.9],
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 66,
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
            comments: false,
            presets: [
              [
                "minify",
                {
                  removeConsole: true,
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
    }),
  ],
  optimization: {
    minimize: true,
  },
};

module.exports = async (env) => {
  const creativeIDs = env && env.creatives ? env.creatives.split(",") : [];
  const creativeConfigs = [];

  for (const creativeID of creativeIDs) {
    const project = await getProject({ "creatives.id": creativeID });
    const creative = project.creatives.find(
      (projectCreative) => projectCreative.id === creativeID
    );

    const creativeConfig = {
      name: creative.slug,
      entry: getEntryPoint(creative.slug),
      output: {
        path: path.resolve(
          process.cwd(),
          "upload",
          new Date(project.campaign.planning.start).getFullYear().toString(),
          project.brand.slug,
          creative.slug
        ),
        filename: "main.js",
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
            project: project,
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
