const path = require('path');

// Плагин обрабатывающий html
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Плагин для сжатия css, выносящий его в отдельный файл
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Если переменная не будет определена - будет режим development
const mode = process.env.NODE_ENV || 'development';
// Проверяет, является ли mode - development
const devMode = mode === 'development';
// Если devMode true, то мы собераем под веб, если false то собираем учитывая наш browserslist
// Так мы определяем для каких браузеров проводится сборка, так же используем все необходимые аавтопреффексы и св-ва
const target = devMode ? 'web' : 'browserslist';
// Если режим разработкаи, то мы добавляем соурсмапы, чтобы удобно было находить ошибки и где находится цсс
const devtool = devMode ? 'source-map' : undefined;


// Все настройки харнятся в этом объекте
module.exports = {
    mode,
    target,
    devtool,

    // Сервер на порту 4200, hot - автообновление стилей
    devServer: {
        port: 4200,
        hot: true,
        open: true
    },

    // Входная точка
    entry: path.resolve(__dirname, 'src', 'index.js'),

    // Выходная точка, папка с готовым бандлом
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        assetModuleFilename: 'img/[name][ext]'
    },

    // Тут подключаются плагины
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),

        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ],

    // Тут подключаются лоадеры
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },

            // Сюда можно добавить postcss лоадер для поддержки стилей из старых браузеров
            // https://youtu.be/o8KMucDpSno?t=2320
            // Там же можно посмотреть про бабель
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },

            {
                test: /\.woff2?$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },

            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource',
                use: [
                    {
                        loader: "image-webpack-loader",
                        options: {
                            mozjpeg: {
                                progressive: true,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ]
            },
        ]
    }
}