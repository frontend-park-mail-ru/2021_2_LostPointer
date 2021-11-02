const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const port = process.env.PORT || 3000;
const src = path.join(__dirname, 'src');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.[fullhash:8].js',
    },
    resolve: {
        alias: {
            components: path.join(src, 'components'),
            views: path.join(src, 'views'),
            store: path.join(src, 'store'),
            models: path.join(src, 'models'),
            interfaces: path.join(src, 'interfaces'),
            services: path.join(src, 'services'),
        },
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
            },
            {
                test: /\.ts$/,
                exclude: path.resolve(__dirname, './node_modules'),
                use: 'ts-loader',
            },
            {
                test: /\.(jpg|jpeg|png|svg|ico)$/,
                loader: 'file-loader',
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: 'LostPointer',
            template: './src/index.html',
            filename: path.join(__dirname, '/dist/index.html'),
            favicon: path.join(__dirname, '/src/static/img/favicon.ico'),
        }),
        new CleanWebpackPlugin(),
    ],
    devServer: {
        hot: true,
        port,
        historyApiFallback: true,
        static: {
            directory: path.resolve(__dirname, './src/'),
            publicPath: '/src',
        },
    },
    optimization: {
        minimize: true,
    },
};
