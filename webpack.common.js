const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      lib: path.resolve(__dirname, "src/library"),
      node_modules: path.resolve(__dirname, "node_modules"),
    },
  },
  module: {
    rules: [
      {
        test: /\.sass$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.mp4$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "media",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.[id].[fullhash].css",
    }),
  ],
};
