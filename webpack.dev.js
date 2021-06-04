const glob = require("glob");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  // META SETUP
  const year = env.year ? env.year : new Date().getFullYear();
  const creativePaths = glob
    .sync(`./src/${year}/**/main.js`)
    .map((path) => path.replace("/main.js", ""));
  const slugs = creativePaths.map((path) =>
    path.substring(path.lastIndexOf("/") + 1)
  );

  console.log(creativePaths);
  console.log(slugs);
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
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
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
  creativePaths.forEach((path, idx) => {
    const slug = slugs[idx];
    console.log(path);
    console.log(slug);

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
