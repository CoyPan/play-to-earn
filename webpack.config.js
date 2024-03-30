const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    entry: {
        userCenter: path.resolve(__dirname, 'src/user-center/index.jsx'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', { targets: {
                        chrome: 68,
                        ie: 11
                    } }], "@babel/preset-react"]
                }
            }
        }, {
            test: /\.(css|less)$/,
            use: [
                { loader: 'style-loader' },
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                    },
                },
                { loader: 'postcss-loader'},
                { loader: 'less-loader' },
            ],
        },
        {
            test: /\.(png|jpg)$/,
            use: [
                { 
                    loader: 'file-loader', 
                    options: {
                        name: '[path][name].[ext]',
                    }, 
                },
            ],
        }],
    },
    plugins: [
        // new ErrorOverlayPlugin(),
        new HtmlWebpackPlugin({ 
            template: './src/user-center/index.html', 
            filename: 'user-center/index.html', 
        }),
        // new CopyPlugin({
        //     patterns: [
        //         { from: "resource/img", to: "resource/img" },
        //     ],
        // }),
    ],
    devServer: {
        hot: true, // 它是热更新：只更新改变的组件或者模块，不会整体刷新页面
        open: true, // 
        proxy: { // 配置代理（只在本地开发有效，上线无效）
            // "/tazapay/create/checkout": { // 这是请求接口中要替换的标识
            //     target: "https://nudify.instamordern.com", // 被替换的目标地址，即把 /api 替换成这个
            //     secure: true, // 若代理的地址是https协议，需要配置这个属性
            //     changeOrigin: true,
            // },
            '/user/edit/credits': {
                target: "https://net-earn.deepfun.xyz", // 被替换的目标地址，即把 /api 替换成这个
                secure: true, // 若代理的地址是https协议，需要配置这个属性
                changeOrigin: true,
            },
            '/user/get/credits': {
                target: "https://net-earn.deepfun.xyz", // 被替换的目标地址，即把 /api 替换成这个
                secure: true, // 若代理的地址是https协议，需要配置这个属性
                changeOrigin: true,
            },
            '/user/signin/add': {
                target: "https://net-earn.deepfun.xyz", // 被替换的目标地址，即把 /api 替换成这个
                secure: true, // 若代理的地址是https协议，需要配置这个属性
                changeOrigin: true,
            },
            '/user/signin/list': {
                target: "https://net-earn.deepfun.xyz", // 被替换的目标地址，即把 /api 替换成这个
                secure: true, // 若代理的地址是https协议，需要配置这个属性
                changeOrigin: true,
            },
        },
        liveReload: true,
        port: 9000,
    }
};