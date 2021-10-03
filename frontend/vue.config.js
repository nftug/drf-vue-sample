module.exports = {
  outputDir: '../static',
  indexPath: '../templates/index.html',
  publicPath: process.env.NODE_ENV === 'production'
	    ? '/static/'
	    : '/',
  productionSourceMap: process.env.NODE_ENV === 'production'
		     ? false
		     : true,
  pages: {
    index: {
      entry: "src/main.js",
      title: "DRF Sample",
    }
  }
}
