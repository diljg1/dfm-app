module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/production-sub-path/'
        : '/dfm-app',
    configureWebpack: {
        externals: {
            'uikit': 'UIkit',
        },
    },
    devServer: {
        proxy: {
            '/dfm-api/index.php': {
                target: 'http://api.dfm.nl/dfm-api/index.php',
                changeOrigin: true,
                pathRewrite: {
                    '^/dfm-api/index.php': '',
                },
            },
        },
    },
};