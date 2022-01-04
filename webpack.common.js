const path = require("path");
const glob = require("glob");

function getCreativeEntries(env) {
  const selectors = env.creatives ? env.creatives.split(",") : [];
  const creativePaths =
    selectors.length > 0
      ? getSelectedCreativePaths(selectors)
      : glob.sync("./campaigns/**/main.js");
  const entries = {};

  creativePaths.forEach((creativePath) =>
    Object.assign(entries, {
      [getCreativeSlug(creativePath)]: creativePath,
    })
  );

  return entries;
}

function getSelectedCreativePaths(selectedCreatives) {
  let selectedPaths = [];
  selectedCreatives.forEach((creativeSlug) => {
    const creativePath = glob.sync(
      "./campaigns/**/" + creativeSlug + "/main.js"
    );
    selectedPaths = selectedPaths.concat(creativePath);
  });

  return selectedPaths;
}

function getCreativeSlug(creativePath) {
  return creativePath.split("/").slice(-2)[0];
}

module.exports = (env) => {
  return {
    mode: "none",
    entry: getCreativeEntries(env),
    output: {
      path: path.resolve(__dirname, "__YOLO"),
      filename: (pathData) => {
        console.log("pathData", pathData);
        return "[name]/main.js";
      },
      clean: true,
      assetModuleFilename: "[name][ext]",
    },
    module: {
      rules: [
        {
          test: /\.sass$/,
          type: "asset/resource",
          generator: {
            filename: "style.css",
          },
        },
        {
          test: /\.sass$/i,
          use: ["extract-loader", "css-loader", "sass-loader"],
          exclude: /node_modules/,
        },
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.html$/,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.html$/i,
          use: ["extract-loader", "html-loader"],
        },
      ],
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
        lib: path.resolve(__dirname, "src/library"),
      },
    },
  };
};
