const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: ['core-js/stable', 'regenerator-runtime/runtime', './src/client/index.js'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader']
      // },
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|woff2?|eot|ttf|svg|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 100000
          }
        }
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://ec2-13-229-215-142.ap-southeast-1.compute.amazonaws.com',
        changeOrigin: true
      }
    ],
    hot: true,
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
      options: {
        poll: true
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
};
