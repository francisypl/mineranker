// get environment variables set on process
require('dotenv').config()

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

const production = process.env.NODE_ENV === 'production'

// /////////////////////////////////////////////////////////////////////////////
// Plugin Configuration
// http://webpack.github.io/docs/list-of-plugins.html
// /////////////////////////////////////////////////////////////////////////////

// plugins for development builds only
const devPlugins = [
  // prevent webpack from killing watch on build error
  new webpack.NoErrorsPlugin()
]

// base plugins
const plugins = [
  // remove build/client dir before compile time
  new CleanWebpackPlugin('build/adforprize'),

  // build vendor bundle (including common code chunks used in other bundles)
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash].js'),

  // optimize chunk occurences
  new webpack.optimize.OccurenceOrderPlugin(true),

  // define env vars for application (shim for process.env)
  new webpack.DefinePlugin({
    'process.env': {
      BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      MINERANKER_API_TOKEN: JSON.stringify(process.env.MINERANKER_API_TOKEN),
      MINERANKER_API_URL: JSON.stringify(process.env.MINERANKER_API_URL),
    }
  }),

  // interpolate index.ejs to index.html, add assets to html file
  new HtmlWebpackPlugin({
    title: 'Mineranker',
    template: 'app/index.ejs',
    inject: 'body',
    filename: 'index.html',
  }),

  // font awesome
  new ExtractTextPlugin('bundle.css')
]

// plugins for production builds only
const prodPlugins = [
  // remove duplicate chunks
  new webpack.optimize.DedupePlugin(),

  // make sure we don't create too small chunks, merge together chunks smallert than 10kb
  new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10240 }), // ~10kb

  // minify the crap out of this thing
  new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    compress: {
      // Suppress uglification warnings
      warnings: false
    }
  })
]

module.exports = {
  debug: !production,

  // inline-source-map makes devtools point to source files
  devtool: production ? false : 'inline-source-map',

  entry: {
    app: './app/index.js',

    // third party modules here
    vendor: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'react-router-redux',
    ]
  },

  eslint: {
    failOnWarning: false,
    failOnError: false
  },

  module: {
    // handle linting before compile step
    preLoaders: [
      // {
        // exclude: /node_modules/,
        // loader: 'eslint',
        // test: /\.js/
      // }
    ],

    // set module loaders
    loaders: [
      // import es6 and convert to commonJS, also transpile React components and flow typing
      // see babel section of package.json for config
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/
      },

      // import images as compressed data URIs
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]'
        ]
      },

      // support json
      {
        exclude: /node_modules/,
        loader: 'json',
        test: /\.json$/
      },

      // font awesome
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },

  // where to output, also naming conventions
  output: {
    chunkFilename: '[name].[hash].js',
    filename: '[name].[hash].js',
    path: 'build/adforprize'
  },

  // load plugins
  plugins: production ? plugins.concat(prodPlugins) : plugins.concat(devPlugins),
}
