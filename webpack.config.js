const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  // devtool: 'eval-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      'map3d-earth': path.resolve(__dirname, './src/map3d-earth/'),
    },
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
    }),
  ],
  devServer: {
    open: true,
  },
}
