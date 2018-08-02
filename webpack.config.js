const webpack = require('webpack');
const path = require('path');

let libraryName = 'ts-mock-imports';
let libraryTarget = 'commonjs';
let outputFile = 'index';
let entry = "index.ts";
let outdir = "lib";

const isCompress = process.env.compress;

module.exports = function(env) {
  if (!env) {
    env = {};
  }

  let plugins = [];
  let mode = 'development';
  // handle minification
  if (isCompress) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    );
    mode = 'production'
    outputFile += '.min';
    sourceMaps = false;
  }
  plugins.push(new DtsBundlePlugin());

  
  // handle custom target
  if (env && env.target) {
    libraryTarget = env.target;
  }

  outputFile += '.js';

  return {
    entry: [
      path.join(__dirname, 'src', entry)
    ],
    devtool: isCompress ? 'source-map' : false,
    output: {
      path: path.join(__dirname, outdir),
      publicPath: "/" + outdir + "/",
      filename: outputFile,
      library: libraryName,
      libraryTarget: libraryTarget,
      umdNamedDefine: true
    },

    module: {
      rules: [
        {test: /\.tsx?$/, loader: "ts-loader"}
      ]
    },
    optimization: {
      sideEffects: false,
    },
    mode,
    resolve: {
      extensions: ['.js', '.ts']
    },
    plugins: plugins
  };
};

function DtsBundlePlugin(){}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function(){
    var dts = require('dts-bundle');

    dts.bundle({
      name: libraryName,
      main: outdir + '/**/*.d.ts',
      out: 'index.d.ts',
      removeSource: true,
      outputAsModuleFolder: true // to use npm in-package typings
    });
  });
};