const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    entry: {
        'game-center': path.resolve(__dirname, 'src/game-center/index.jsx'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'resource/js/[name].[contenthash:4].js',
        publicPath: '../'
    },
    mode: 'production',
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', { targets: "defaults" }], "@babel/preset-react"]
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
        }, {
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ 
            template: './src/game-center/index.html', 
            filename: 'game-center/index.html', 
        }),
        new CopyPlugin({
            patterns: [
                 { from: "resource/img", to: "resource/img" },
            ],
        }),
    ],
    optimization: {
        minimizer: [
          new TerserJSPlugin({
            extractComments: false,
          }),
        ]
      }
};