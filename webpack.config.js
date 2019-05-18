
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: '#source-map',
    context: __dirname,
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /node_modules/,
                    name: "vendor",
                    chunks: "initial",
                    minSize: 1
                }
            }
        },
        sideEffects: false
    },
    entry: {
        javascript: './src/main.js'
    },
    resolve: {
        symlinks: false
    },
    devServer: {
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "",
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        hotUpdateMainFilename: "[hash]/update.json",
        hotUpdateChunkFilename: "[hash]/js/[id].update.js"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg|eot|woff|ttf?)(.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|bower_components)/,
                loader: "html-loader?attrs[]=source:src&attrs[]=img:src&attrs[]=section:data-image-src"
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime', "angularjs-annotate"],
                    cacheDirectory: true
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: 'index.ejs',
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            DEBUG: true,
            ENDPOINT: '"http://localhost:5000"',
            CLIENT_ID: '"3DA4385D-5166-4C1F-9C4B-49AFE82BE47E"',
            CLIENT_SECRET: '"123456"'
        })
    ]
};
