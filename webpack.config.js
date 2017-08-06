var path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: './scripts/Init.js',
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: 'spaceguard.js'
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
    }
};