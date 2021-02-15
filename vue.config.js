module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: './',
  devServer: {
    proxy: {
      '/escBackend': {
        target: 'http://localhost:8000/',
        ws: true,
        changeOrigin: true,
      }
    }
  }
}