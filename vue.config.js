// const path = require('path');

module.exports = {
    publicPath: './',
    devServer: {
        open: true,
        hot: true,
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://slamdunk.sports.sina.com.cn',
                ws: true,
                changeOrigin: true
            }
        }
    },
    lintOnSave: true,
    css: {
        extract: true,
        sourceMap: false,
        loaderOptions: {
            sass: {
                prependData: `@import "./assets/style/common.scss";`
            }
        }
    }
}