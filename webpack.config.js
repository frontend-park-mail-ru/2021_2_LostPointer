const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

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
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new WebpackPwaManifest({
            name: 'Lost Pointer Music',
            short_name: 'LOSMusic',
            description: 'Enjoy your favourite tracks with Lost Pointer Music!',
            background_color: '#000000',
            theme_color: '#000000',
            crossorigin: 'use-credentials',
            display: 'standalone',
            orientation: 'portrait',
            icons: [
                {
                    src: path.resolve('src/static/img/sidebar_logo.png'),
                    sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
                },
            ],
        }),
        new StylelintPlugin({
            configFile: './.stylelintr??',
            extensions: ['css', 'scss', 'sass'],
        }),
        new MiniCssExtractPlugin({ filename: '[name].[fullhash:8].css' }),
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
