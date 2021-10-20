const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.webpack_type === 'development';
const port = process.env.PORT || 10000;
const src = path.join(__dirname, 'src');

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.[hash:8].js',
  },
  resolve: {
    alias: {
      assets: path.join(src, 'assets'),
      components: path.join(src, 'components'),
      managers: path.join(src, 'managers'),
      store: path.join(src, 'store'),
      models: path.join(src, 'models'),
      views: path.join(src, 'views'),
    },
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.ts$/,
        exclude: path.resolve(__dirname, './node_modules'),
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|pdf|ico)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack',
      template: './src/index.html',
      filename: path.join(__dirname, '/dist/index.html'),
      favicon: path.join(__dirname, '/src/static/img/favicon.ico'),
    }),
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      PORT: port,
      DEBUG: !isProduction,
    }),
  ],
  devServer: {
    hot: true,
    port,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, './src/'),
      publicPath: '/src',
    },
  },
  optimization: {
    minimize: true,
  },
};
