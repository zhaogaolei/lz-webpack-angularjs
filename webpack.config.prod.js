import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import enviroment from './environment.json';

export default {
    entry: {
        app: path.resolve(__dirname, 'src/app/app'),
        vendor: path.resolve(__dirname, 'src/vendor')
    },
    devtool: 'source-map', // 根据情况修改参数
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                    use: 'css-loader',
                })
            },
            {
                test: /\.(jpg|png|gif|ico)$/,
                use: 'file-loader?name=images/[name].[ext]'
            },
            {
                test: /\.(svg|woff2|ttf|woff|eot)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            }

        ]
    },
    plugins: [
        //Minify js
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: { warnings: true }
        // }),
        //generate html
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            favicon: 'src/q-favicon.ico',
            hash: true
        }),
        new ExtractTextPlugin({
            filename: '[name].css'
        }),
        //Minify css
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {discardComments: {removeAll: true}}
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            IsDebug: false,
            APIENDPOINT: JSON.stringify(enviroment.APIEndpoint),
            BIPOINTURL:JSON.stringify(enviroment.BiPointUrl),
            POINTURL:JSON.stringify(enviroment.PointUrl),
            POINTURL2:JSON.stringify(enviroment.PointUrl2),
            POINTURL3:JSON.stringify(enviroment.PointUrl3),
            JOBAPI:JSON.stringify(enviroment.JobApi)
        })
    ]
};
