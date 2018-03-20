import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod';


console.log('Starting build, please wait...');

webpack(webpackConfig).run((error, stats) =>{
    if(stats.compilation.errors.length > 0) {
        console.log(stats.compilation.errors);
        console.log('Build is failed');
        return 1;
    } else {
        console.log('Build is successful');
        return 0;
    }

});
