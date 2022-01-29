const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const config = require(`./static/js/collection/Config.${
    argv.mode === "development" ? `dev` : `prod`
  }.collection.json`);

  return {
    entry: "./static/js/index.ts",
    module: {
      rules: [
        {
          test: /\.component.s[ac]ss$/i,
          exclude: /node_modules/,
          use: [
            "sass-to-string",
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  outputStyle: "compressed",
                },
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: [/node_modules/, /\.component.(s(a|c)ss)$/],
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
              options: {
                additionalData:
                  "$ephemeral-duration: " +
                  config.visual.ephemeralTimer +
                  "ms;",
              },
            },
          ],
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
      new MiniCssExtractPlugin({
        filename: "style.[contenthash].css",
      }),
      new webpack.DefinePlugin({
        IS_DEV: JSON.stringify(argv.mode === "development"),
      }),
    ],
    resolve: {
      extensions: [".ts"],
    },
    target: "web",
    watch: true,
  };
};
