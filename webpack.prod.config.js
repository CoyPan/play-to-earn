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
        gameCenter: path.resolve(__dirname, 'src/game-center/index.jsx'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'resource/js/[name].js',
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
            test: /\.css$/,
            use: [
                { loader: 'style-loader' },
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                    },
                },
            ],
        },],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ 
            template: './src/game-center/index.html', 
            filename: 'game-center/index.html', 
        }),
        // new CopyPlugin({
        //     patterns: [
        //          { from: "resource/img", to: "resource/img" },
        //     ],
        // }),
    ],
    optimization: {
        minimizer: [
          new TerserJSPlugin({
            extractComments: false,
          }),
        ]
      }
};