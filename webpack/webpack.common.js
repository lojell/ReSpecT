const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = "../src/";

module.exports = {
  entry: {
    devtools: path.join(__dirname, srcDir + "devtools/init.ts"),
    devtools_panel: path.join(__dirname, srcDir + "devtools/panel/index.tsx"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  // optimization: {
  //   splitChunks: {
  //     name: "vendor",
  //     chunks: "initial",
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    // exclude locale files in moment
    // new webpack.IgnorePlugin({ paths: [/^\.\/locale$/, /moment$/] }),
    new CopyPlugin({
      patterns: [
        { from: "public", to: "../" }
      ]
    }),
  ],
};
