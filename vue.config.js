module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/production-sub-path/'
        : '/dfm-app',
    configureWebpack: {
        externals: {
            'uikit': 'UIkit',
        },
    },
};