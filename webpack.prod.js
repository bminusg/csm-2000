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
      },
      module: {
        rules: [
          {
            test: /\.(png|jpe?g|webp|git|svg|)$/i,
            use: [
              {
                loader: "img-optimize-loader",
                options: {
                  name: "img/[name].[hash].[ext]",
                  compress: {
                    // This will take more time and get smaller images.
                    mode: "high", // 'lossless', 'low'
                    disableOnDevelopment: true,
                  },
                },
              },
            ],
            type: "javascript/auto",
          },
          {
            test: /\.mp4$/,
            use: [
              {
                loader: "file-loader",
                options: {
                  name: "video/[name].[ext]",
                },
              },
            ],
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
