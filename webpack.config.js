const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    entry: './src/client/index.js',
    mode: isProd, 
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },
    devtool: false,
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: isProd ? 'static' : 'disabled'
        })
    ]
};