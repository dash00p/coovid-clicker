module.exports = {
  entry: "./static/js/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts"],
  },
  target: "web",
  watch: true,
};
