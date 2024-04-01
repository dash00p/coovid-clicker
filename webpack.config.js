const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const config = require(`./src/config/${argv.mode === "development" ? `dev` : `prod`
    }.json`);

  return {
    entry: "./src/index.tsx",
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
          test: /\.tsx?$/,
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
          { from: "src/assets/", to: "static/" },
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
      extensions: [".ts", ".tsx"],
    },
    target: "web",
    watch: argv.mode === "development",
    devtool: argv.mode === "development" ? "source-map" : false,
  };
};
