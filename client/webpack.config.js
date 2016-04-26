// http://survivejs.com/webpack/introduction/

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

module.exports = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      // TODO: css-loader doc: They are not enabled by default because they expose a runtime overhead and increase in bundle size (JS SourceMap do not). In addition to that relative paths are buggy and you need to use an absolute public path which include the server url.
      { test: /\.css$/, loader: "style-loader!css-loader?sourceMap" },
      {
        test: /\.(svg|png|ttf|woff|eot|woff2)$/,
        loader: 'url-loader',
        query: {limit: 10000}
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: 'node_modules/html-webpack-template/index.ejs',
      title: 'GitHub Analyzer',
      baseHref: '/'
    })
  ],

  // TODO: how big is the impact on performance? what about other devtool options?
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8081',
        secure: false
      }
    }
  }
};
