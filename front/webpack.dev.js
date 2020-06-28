const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge(common, {

    mode: 'development',
    devtool: 'source-map',
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        contentBase: './dist',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'development': true,
            }
        })
    ]

});