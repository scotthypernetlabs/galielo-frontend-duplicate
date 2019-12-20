const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: ['./localdev/localdev.tsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({template: path.join(__dirname, "index.html")})
    ],
    output: {
        path: path.resolve(__dirname, 'localdev/dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, "localdev/dist"),
        port: 9000,
        watchContentBase: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE< PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        historyApiFallback: true
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    node: {
      console: false,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader'
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
              test: /\.(s[ac]ss|css)$/i,
              use: [
                'style-loader',
                'css-loader',
                'sass-loader',
              ],
            }
        ]
    },
};
