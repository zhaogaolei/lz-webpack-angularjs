import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../webpack.config.babel';

const app = express();
const port = 8088; // 根据情况修改后台服务器侦听端口
const compiler = webpack(config);

 app.use(webpackDevMiddleware(compiler , {
     noInfo: false,
     publicPath: config.output.publicPath
 }));

app.get('/', function (request, response) {
   response.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, function (error) {
    if(error){
        console.log(error);
    }else{
        let listeningAddress = 'http://localhost:' + port;
        open(listeningAddress);
        console.log('Listening at' + listeningAddress);
    }
});
