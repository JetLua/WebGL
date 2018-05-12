const
    path = require('path'),
    htmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack')

const isProd = process.env.NODE_ENV === 'production' ? true : false

const option = {
    entry: [
        'bootstrap/dist/css/bootstrap.min.css',
        './src/ui/index.less',
        './src/ui/index.ts'
    ],

    output: {
        path: path.resolve('dist'),
        filename: 'main.js'
    },

    devServer: {
        hot: true,
        contentBase: '.'
    },

    resolve: {
        alias: {
            vue: 'vue/dist/vue.common.js'
        },
        extensions: ['.ts', '.js']
    },

    devtool: isProd ? false : 'source-map',

    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     use: ['babel-loader'],
            //     exclude: /node_modules/
            // },
            {
                test: /\.(vert|frag)$/,
                use: ['raw-loader']
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: ['url-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ts$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new htmlWebpackPlugin({
            template: './src/ui/index.html',
            hash: true,
            filename: 'index.html',
            inject: 'body',
            minify: {
                collapseWhitespace: true
            }
        }),

        // isProd ? new copyWebpackPlugin([
        //     {from: 'static/textures', to: 'static/textures'}
        // ]) : null,


    ],

    mode: isProd ? 'production' : 'development'
}

if (!isProd) {
    option.plugins.push(
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    )
}

module.exports = option