const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const config = require("./config.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
  if (!env.creatives && !env.projects)
    throw Error("Please define a creative/project slug");
  const buildType = env.projects ? "projects" : "creatives";

  // META SETUP
  const slugs = env.projects
    ? env.projects.split(",")
    : env.creatives.split(",");
  const year = env.year ? env.year : new Date().getFullYear();

  // PRODUCTION CONFIG
  let prodConfigs = [];

  // MULTI COMPILER
  for (const slug of slugs) {
    const brand =
      buildType === "projects" ? "" : slug.slice(0, slug.indexOf("_"));
    const pathMainJS = glob.sync(
      buildType === "projects"
        ? `${config.paths.projects}/**/main.js`
        : `${config.paths.campaigns}/${year}/**/${slug}/main.js`
    );
    const pathIndexHTML = glob.sync(
      buildType === "projects"
        ? `${config.paths.projects}/**/index.html`
        : `${config.paths.campaigns}/${year}/**/${slug}/index.html`
    );

    if (pathIndexHTML.length === 0 || pathMainJS.length === 0)
      throw new Error("Can't find entry points");
    /*
    if (pathIndexHTML.length > 1 || pathMainJS.length > 1)
      throw new Error(
        "Seems there are creative slug duplicate. Please ensure unique creative slugs"
      );
      */

    const creativeConfig = {
      name: slug,
      mode: "production",
      entry: {
        [slug]: pathMainJS[0],
      },
      output: {
        path:
          buildType === "projects"
            ? path.join(`${config.paths.upload}/${slug}`)
            : path.join(`${config.paths.upload}/${year}/${brand}/${slug}`),
        filename: "js/[name].[fullhash].js",
        assetModuleFilename: "assets/[name].[hash][ext]",
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
                // the webp option will enable WEBP
                webp: {
                  quality: 66,
                },
              },
            },
          },
          {
            test: /\.mp4$/,
            type: "asset/resource",
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          filename: "index.html",
          template: pathIndexHTML[0],
          chunks: [slug],
        }),
      ],
      optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin()],
      },
    };

    prodConfigs.push(merge(common, creativeConfig));
  }

  return prodConfigs;
};
