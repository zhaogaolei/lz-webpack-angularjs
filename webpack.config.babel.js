import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    entry: {
        app: './src/app/app.js',
        vendor: './src/vendor.js'
    },
    devtool: 'inline-source-map', // 根据情况修改参数
    output: {
        path: path.resolve(__dirname, 'src'),
        publicPath: '/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(jpg|png|gif|svg|woff2|ttf|woff|eot|ico)$/,
                use: 'file-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        // disableHostCheck: true,
        compress: false,
        open: true,
        stats: 'errors-only'
    },
    plugins: [
        //generate html
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/q-favicon.ico',
            inject: true
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            IsDebug: true,
            APIENDPOINT: JSON.stringify("http://172.16.37.23:9090"),//方洲
            //APIENDPOINT: JSON.stringify("http://172.29.20.59:9090"), //王超
            //APIENDPOINT: JSON.stringify("http://172.29.20.22:9090"),//崇虎
            // APIENDPOINT: JSON.stringify("http://172.16.36.75:9090"),//冬冬
            // APIENDPOINT: JSON.stringify("http://172.16.36.31:9090"),//刘荣
            // APIENDPOINT: JSON.stringify("http://172.29.20.59:9090"),//储成龙
            // APIENDPOINT: JSON.stringify("http://172.16.36.73:9090"), //富吉
            // APIENDPOINT: JSON.stringify("http://172.29.151.49:10004"),// 测试地址
            BIPOINTURL: JSON.stringify("https://beans.dianrong.com/reports/183/"),
            POINTURL: JSON.stringify("https://beans.dianrong.com/reports/112/"),
            POINTURL2: JSON.stringify("https://beans.dianrong.com/reports/283/"),
            POINTURL3: JSON.stringify("https://beans.dianrong.com/reports/174/"),
            JOBAPI:JSON.stringify("http://172.29.151.49:10003")
        })
    ]
};
