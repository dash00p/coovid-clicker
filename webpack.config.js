const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./static/js/index.ts",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
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
      ],
    }),
  ],
  resolve: {
    extensions: [".ts"],
  },
  target: "web",
  watch: true,
};
