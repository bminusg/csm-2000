const glob = require("glob");
const { merge } = require("webpack-merge");
const config = require("./config.js");
const common = require("./webpack.common");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  // META SETUP
  const year = env.year ? env.year : new Date().getFullYear();
  const creativePaths = glob
    .sync(`${config.paths.campaigns}/${year}/**/main.js`)
    .map((path) => path.replace("/main.js", ""));

  const slugs = creativePaths.map((path) =>
    path.substring(path.lastIndexOf("/") + 1)
  );

  // BUILD DEFAULT DEV CONFIG
  let devConfig = {
    mode: "development",
    entry: {
      index: "./projects/ui/main.js",
      preview: "./projects/preview/main.js",
    },
    devServer: {
      host: "localhost",
      open: true,
      liveReload: true,
      port: 8080,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "projects/ui/index.hbs",
        chunks: ["index"],
        slugs: slugs,
      }),
      new HtmlWebpackPlugin({
        filename: "preview.html",
        template: "projects/preview/index.html",
        chunks: ["preview"],
      }),
    ],
  };

  // ADDING DYNAMIC VALUES TO DEV CONFIG
  creativePaths.forEach((path, idx) => {
    const slug = slugs[idx];

    // ADD HTML Webpack Plugin
    devConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: slug + ".html",
        template: `${path}/index.html`,
        chunks: [slug],
      })
    );

    // DEFINE ENTRY POINTS
    Object.assign(devConfig.entry, {
      [slug]: `${path}/main.js`,
    });
  });

  // MERGE CONFIGS
  return merge(common, devConfig);
};
