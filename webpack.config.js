const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = require("./static/js/collection/Config.collection.json");

module.exports = {
  entry: "./static/js/index.ts",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              additionalData: "$ephemeral-duration: " + config.visual.ephemeralTimer+"ms;"
            }
          }],
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "bundle.[contenthash].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Coovid Clicker",
      template: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "static/img/", to: "static/img/" },
        { from: "static/sound/", to: "static/sound/" },
      ],
    }),
    new MiniCssExtractPlugin()
  ],
  resolve: {
    extensions: [".ts"],
  },
  target: "web",
  watch: true,
};
