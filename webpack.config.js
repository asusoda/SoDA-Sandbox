var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules').filter((x) => ['.bin'].indexOf(x) === -1)
                              .forEach((mod) => { nodeModules[mod] = 'commonjs ' + mod })

module.exports = {
    entry: './src/bin/www',
    target: 'node',
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        path: './dist',
        filename: 'app.bundle.js'
    },
    externals: nodeModules,
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: [/node_modules/, /public/],
            loader: 'babel-loader',
        }]
    }
}
