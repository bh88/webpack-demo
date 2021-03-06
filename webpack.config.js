const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts.js');

const PATHS = {
    app: path.join(__dirname, 'app'),
    style: [
        path.join(__dirname, 'node_modules', 'purecss'),
        path.join(__dirname, 'app', 'main.css'),
    ],
    build: path.join(__dirname, 'build'),
}

const common = {
    entry: {
        app: PATHS.app,
        style: PATHS.style,
    },

    output: {
        path: PATHS.build,
        publicPath: '/webpack-demo/',
        filename: '[name].[hash].js',
        chunkFilename: '[chunkhash].js',
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo',
        }),
    ],
};

var config;

switch (process.env.npm_lifecycle_event) {
    case 'build':
    case 'stats':
        config = merge(
            common,
            {
                devtool: 'source-map',
            },
            parts.clean(PATHS.build),
            parts.setFreeVariable(
                'process.env.NODE_ENV',
                'production'
            ),
            parts.extractBundle({
                name: 'vendor',
                entries: ['react'],
            }),
            parts.minify(),
            parts.extractCSS(PATHS.style),
            parts.purifyCSS([PATHS.app])
        );
        break;

    default:
        config = merge(
            common,
            {
                devtool: 'eval-source-map',
            },
            parts.setupCSS(PATHS.style),
            parts.devServer({
                host: process.env.HOST,
                port: process.env.PORT,
            })
        );
}

module.exports = validate(config, {
    quiet: true,
});
