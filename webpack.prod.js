const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
  if (!env.creatives) throw Error("Please define a creative slug");

  // META SETUP
  const slugs = env.creatives.split(",");
  const year = env.year ? env.year : new Date().getFullYear();

  // PRODUCTION CONFIG
  let prodConfigs = [];

  // MULTI COMPILER
  // ASSET OPTIMIZING HERE https://github.com/tcoopman/image-webpack-loader
  for (const slug of slugs) {
    const brand = slug.slice(0, slug.indexOf("_"));
    const config = {
      name: slug,
      mode: "production",
      entry: {
        [slug]: `./src/${year}/${slug}/main.js`,
      },
      output: {
        path: path.join(__dirname, `media/${year}/${brand}/${slug}`),
        filename: "js/[name].[fullhash].js",
        assetModuleFilename: "img/[name].[hash][ext]",
      },
      plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          filename: "index.html",
          template: `src/${year}/${slug}/index.html`,
          chunks: [slug],
        }),
      ],
      optimization: {
        minimizer: [new CssMinimizerPlugin()],
      },
    };

    prodConfigs.push(merge(common, config));
  }

  return prodConfigs;
};
