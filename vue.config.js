const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const vueConfig = {
    publicPath: isProduction ? '/media/mod_dfm_app' : '/dfm-app',
    outputDir: isProduction ? 'mod_dfm_app' : 'dist',
    assetsDir: isProduction ? 'assets' : './',
    indexPath: isProduction ? 'tmpl/default.php' : 'index.html',
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
    css: {
        sourceMap: true,
    },
};

//set custom page to compile to Joomla Module
if (isProduction) {
    vueConfig.pages = {
        index: {
            entry: 'src/main.js',
            template: 'module/tmpl/default.ejs',
            filename: 'tmpl/default.php',
            title: 'Module template',
        },
    };
    vueConfig.chainWebpack = config => {
        if (isProduction) {
            config.plugin('html-module').use(HtmlWebpackPlugin, [{
                filename: 'tmpl/default.php',
                template: 'module/tmpl/default.ejs',
                inject: false,
                appMountId: 'app',
            },]);
            //copy module bootstrapping
            config.plugin('copy').tap(args => {
                args[0][0].from = 'module';
                args[0][0].ignore = ['tmpl/default.ejs', '.DS_Store',];
                return args;
            });
            //copy images
            config.plugin('copy-images').use(CopyWebpackPlugin, [[{
                from: 'public/images',
                to: 'assets/images',
                ignore: ['tmpl/default.ejs', '.DS_Store',],
            },],]);
            //create zip
            config.plugin('zip-module').use(ZipWebpackPlugin, [{
                path: '../dist',
                filename: 'mod_dfm_app.zip',
                pathPrefix: 'mod_dfm_app',
            },]);
        }
    }
}

module.exports = vueConfig;
