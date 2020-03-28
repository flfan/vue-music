const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('@styles', resolve('./src/assets/styles'))
      .set('@assets', resolve('./src/assets'))
      .set('@components', resolve('./src/components'))
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://v1.itooi.cn/tencent', // 对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
