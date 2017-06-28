var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './scripts/Init.js',
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: 'spaceguard.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};