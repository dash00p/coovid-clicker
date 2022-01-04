const HtmlWebpackPlugin = require("html-webpack-plugin");

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
      {
        test: /\.(svg|gif|png|eot|woff|ttf)$/,
        use: ["url-loader"],
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
  ],
  resolve: {
    extensions: [".ts"],
  },
  target: "web",
  watch: true,
};
