const glob = require("glob");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  // META SETUP
  const year = env.year ? env.year : new Date().getFullYear();
  const pathChunks = [`./src/${year}/`, "/main.js"];
  const slugs = glob
    .sync(`./src/${year}/**/main.js`)
    .map((path) => path.replace(pathChunks[0], "").replace(pathChunks[1], ""));

  // BUILD DEFAULT DEV CONFIG
  let devConfig = {
    mode: "development",
    entry: {
      preview: "./src/preview/app.js",
    },
    devServer: {
      host: "localhost",
      publicPath: "/",
      open: true,
      liveReload: true,
      port: 8080,
      watchOptions: {
        poll: true,
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "src/preview/hbs/index.hbs",
        chunks: ["preview"],
        slugs: slugs,
      }),
    ],
  };

  // ADDING DYNAMIC VALUES TO DEV CONFIG
  for (const slug of slugs) {
    // ADD HTML Webpack Plugin
    devConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: slug + ".html",
        template: `src/${year}/${slug}/index.html`,
        chunks: [slug],
      })
    );

    // DEFINE ENTRY POINTS
    Object.assign(devConfig.entry, {
      [slug]: `./src/${year}/${slug}/main.js`,
    });
  }

  //

  // MERGE CONFIGS
  return merge(common, devConfig);
};
