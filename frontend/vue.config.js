const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  outputDir: '../static',
  indexPath: '../templates/index.html',
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  productionSourceMap: process.env.NODE_ENV === 'production' ? true : true,

  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        template:
          process.env.NODE_ENV === 'production'
            ? 'public/index.html'
            : 'public/index_dev.html',
        favicon: './public/favicon.ico',
        inject: process.env.NODE_ENV === 'production' ? false : true,
        minify: false,
      }),
    ],
  },
}
