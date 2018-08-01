const webpack = require('webpack');
const path = require('path');

let libraryName = 'ts-mock-imports';
let libraryTarget = 'commonjs';
let outputFile = 'index';
let sourceMaps = true;
let entry = "index.ts";
let outdir = "lib";

module.exports = function(env) {
  if (!env) {
    env = {};
  }

  let plugins = [];
  // handle minification
  if (env && env.compress) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    );

    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: true,
          keep_fnames: true
        },
        mangle: {
          keep_fnames: true
        }
      })
    );
    outputFile += '.min';
    sourceMaps = false;
  }
  
  // handle custom target
  if (env && env.target) {
    libraryTarget = env.target;
  }

  outputFile += '.js';

  return {
    entry: [
      path.join(__dirname, 'src', entry)
    ],
    devtool: sourceMaps ? 'source-map' : false,
    output: {
      path: path.join(__dirname, outdir),
      publicPath: "/" + outdir + "/",
      filename: outputFile,
      library: libraryName,
      libraryTarget: libraryTarget,
      umdNamedDefine: true
    },

    module: {
      loaders: [
        {test: /\.tsx?$/, loader: "awesome-typescript-loader"}
      ]
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    plugins: plugins
  };
};