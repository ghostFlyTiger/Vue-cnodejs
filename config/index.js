// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'public',
    assetsPublicPath: '/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8011,
      /* git地址: https://github.com/chimurai/http-proxy-middleware */
    proxyTable: {
        /* 路径匹配,前缀式匹配*/
        '/topic/viewImage': 'http://localhost:8057' //目标服务器地址
    }
  }
};
