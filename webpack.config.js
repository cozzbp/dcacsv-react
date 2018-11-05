var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

var env = process.env.WEBPACK_ENV;
var CSS_FILENAME = (env === 'build') ? '[name].css' : '[name].css';
var JS_FILENAME = (env === 'build') ? '[name].js' : '[name].js';
var VENDOR_FILENAME = (env === 'build') ? 'vendor.js' : 'vendor.js';

var config = {
  context: path.join(__dirname, "/src"),
  devtool: (env === 'build') ? 'nosources-source-map' : 'cheap-source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Pragma,Cache-Control',
    }
  },
  entry: {
    main: ['babel-polyfill', './index.js'],
    vendor: ['babel-polyfill', 'react', 'react-dom', 'react-redux', 'react-router', 'redux', 'lodash'],
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: JS_FILENAME
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        use: ['react-hot-loader', 'babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.s{0,1}css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
      },
      {
        test: /\.(ttf|eot|svg|woff)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpg|png|eot|ico)$/,
        loader: 'url-loader?limit=25000'
      },
    ]
  },
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: VENDOR_FILENAME}),
    new ExtractTextPlugin(CSS_FILENAME),
    new LodashModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {from: './favicon.ico'},
      {from: './images/*'},
      {from: './index.html'}
    ]),
    new ManifestPlugin()
  ]
}

module.exports = config;
