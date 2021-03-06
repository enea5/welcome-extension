const path = require('path')
const ChromeReloadPlugin = require('wcer')
const {cssLoaders, htmlPage} = require('./tools')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let resolve = dir => path.join(__dirname, '..', 'src', dir)
module.exports = {
  entry: {
    popup: resolve('./popup'),
    options: resolve('./options'),
    devtools: resolve('./devtools'),
    iframe: resolve('./iframe')
  },
  output: {
    path: path.join(__dirname, '..', 'build'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[name].js?[hash]',
    library: '[name]'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          loaders: {
            ...cssLoaders(),
            js: { loader: 'babel-loader' }
          },
          transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [ path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test') ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    htmlPage('popup', 'popup', ['manifest', 'vendor', 'popup']),
    htmlPage('iframe', 'iframe', ['manifest', 'vendor', 'iframe']),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'src', 'extension') }]),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'src', 'widget'), to: 'widget' }]),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static', 'html') }]),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static', 'domains') }]),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static', 'css') }]),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static', 'images') }]),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static', 'icons') }]),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static', 'fonts'), to: 'fonts' }]),
    new ChromeReloadPlugin({
      port: 9090,
      manifest: path.join(__dirname, '..', 'src', 'manifest.js')
    })
  ],
  performance: { hints: false }
}
