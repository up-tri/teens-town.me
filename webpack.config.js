const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AutoPrefixer = require('autoprefixer')

module.exports = [{
  entry: {
    app: ['./src/js/app.js', './src/sass/style.scss'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    // publicPath: '/',
  },
  devServer: {
    contentBase: './dist',
    watchContentBase: true,
    port: 3000,
    open: true,
  },
  module: {
    rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, 'src/sass'),
          path.resolve(__dirname, 'src/fontawesome/scss'),
        ],
        use: [{
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              discardComments: {
                removeAll: true
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                AutoPrefixer({
                  browsers: [
                    'last 2 versions',
                    'Android >= 4',
                  ],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)(\?[a-z0-9=.]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            limit: 10240,
            outputPath: './images/',
            publicPath: function (path) {
              return '../images/' + path
            }
          }
        }],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        include: [
          path.resolve(__dirname, 'src/fontawesome/webfonts'),
        ],
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: './webfonts/',
            publicPath: function (path) {
              return '../webfonts/' + path
            }
          }
        }],
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ],
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin(), new UglifyJsPlugin()],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/img/'),
      to: path.resolve(__dirname, 'dist/images/'),
    }]),
    new HtmlWebpackPlugin({
      template: "./html/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.[contenthash].css"
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '95-100',
      },
    }),
  ],
}, ]
