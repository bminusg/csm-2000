const glob = require("glob");
const fs = require("fs");
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
      watchFiles: ["campaigns/**/*", "projects/**/*", "src/library/**/*"],
      port: 8080,
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|webp|git|svg|)$/i,
          type: "asset/resource",
        },
        {
          test: /\.mp4$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[folder]/[name].[ext]",
              },
            },
          ],
        },
      ],
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
  for (const idx in creativePaths) {
    const slug = slugs[idx];
    const path = creativePaths[idx];

    // DEFINE ENTRY POINTS
    Object.assign(devConfig.entry, {
      [slug]: `${path}/main.js`,
    });

    if (!fs.existsSync(path + "/index.html")) continue;

    // ADD HTML Webpack Plugin
    devConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: slug + "/index.html",
        template: `${path}/index.html`,
        chunks: [slug],
      })
    );
  }

  // MERGE CONFIGS
  return merge(common, devConfig);
};
