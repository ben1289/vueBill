module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
        /*用于配置是否关闭用于 DNS 重绑定的 HTTP 请求的 HOST 检查。
          DevServer 默认只接受来自本地的请求，关闭后可以接受来自任何 HOST 的请求。
          它通常用于搭配--host 0.0.0.0使用，因为你想要其它设备访问你本地的服务，
          但访问时是直接通过 IP 地址访问而不是 HOST 访问，所以需要关闭 HOST 检查。*/
        disableHostCheck: true
    }
};