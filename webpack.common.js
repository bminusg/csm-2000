const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    alias: {
      src: path.resolve(process.cwd(), "src"),
      lib: path.resolve(process.cwd(), "src/library"),
    },
  },
  module: {
    rules: [
      {
        test: /\.mp4$/,
        type: "asset/resource",
        generator: {
          filename: "video/[name].[hash][ext]",
        },
      },
      /*
      
      */
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
        options: {
          helperDirs: [path.resolve(process.cwd(), "src/template/helpers")],
          partialDirs: [path.resolve(process.cwd(), "src/template/partials")],
          precompileOptions: {
            knownHelpersOnly: false,
          },
        },
      },
      {
        test: /markup.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              preprocessor: (content, loaderContext) => {
                content = String(content).replace(/(\r\n|\n|\r)/gm, "");
                const localSlug = loaderContext.resourcePath
                  .split(path.sep)
                  .splice(-2)[0];

                for (let plugin of loaderContext._compiler.options.plugins) {
                  if (!(plugin instanceof HtmlWebpackPlugin)) continue;
                  if (plugin.userOptions.chunks[0] !== localSlug) continue;

                  plugin.userOptions.templateParameters.markup = content;
                  break;
                }

                return content;
              },
            },
          },
        ],
      },
    ],
  },
};
