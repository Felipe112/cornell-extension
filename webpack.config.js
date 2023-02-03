const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "production",
    entry: './src/App.ts',
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
    ],
};