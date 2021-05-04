const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "src/library"),
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        use: [
          {
            loader: "img-optimize-loader",
            options: {
              compress: {
                mode: "high", // 'high' 'lossless', 'low'
                disableOnDevelopment: true,
              },
            },
          },
        ],
      },
      /*
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      */
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.[name].[fullhash].css",
    }),
  ],
};
