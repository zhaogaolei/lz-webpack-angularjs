// var ejs = require("ejs");
// var fs = require("fs");
// var config = require("./config");
// var http = require("http");
//
// // console.log(__dirname);
// // var str = fs.readFileSync(__dirname + config.template, 'utf8');
// //
// // var ret = ejs.render(str, {
// //     names: ['foo', 'bar', 'baz']
// // });
// // console.log(ret);


var http = require('http');
var config = require("./config");
var fs = require("fs");
var ejs = require("ejs");

var template = fs.readFileSync(__dirname + config.template, 'utf8');

//获取后端请求参数
var request = require('request');
request(config.api, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body)
            createTemplate(result);
        }
    }
);

Array.prototype.groupBy = function (name) {
    var result = {};

    this.map(function (item, index) {

        var check = result[item[name]];
        if (check == undefined) {
            result[item[name]] = [];
        }
        result[item[name]].push(item);
    });
    return result;
};


var getServiceName = function (name) {
    return name.split('.').reverse()[0].replace('Controller', '');
};

var prettyData = function (arr) {
    var formatRequestType = function (type) {
        var result = 'post'
        switch (type) {
            case 'POST':
                result = 'post';
                break;
            case 'GET':
                result = 'get';
                break;
            case 'DELETE':
                result = 'delete';
                break;
            default:
                result = "post";

        }
        return result;
    };
    var formatRequestTypeUrl = function (url) {
        return url.split('{')[0];
    };
    var formatParam = function (item) {

        if (item.methodParmaTypes.length > 0) {
            item.methodParma1 = ", data";
            item.methodParma2 = "data";
        }
        if (item.requestUrl.indexOf('{') != -1) {
            item.methodParma1 += ", urlParam";
            item.methodParma2 += ", urlParam";
        }
    }

    for (var i = 0; i < arr.length; i++) {
        //格式化方法
        arr[i].type = formatRequestType(arr[i].requestType);
        arr[i].url = formatRequestTypeUrl(arr[i].requestUrl);
        formatParam(arr[i]);
    }
    return arr;
}

var createTemplate = function (data) {
    if (data.code == '200') {
        var mydata = prettyData(data.result);
        var d = mydata.groupBy('controllerName');
        var fileNames = Object.getOwnPropertyNames(d);
        fileNames.map(function (item) {
            var fileName = getServiceName(item);
            var ret = ejs.render(template, {data: d[item], name: fileName});
            var output = __dirname + config.output.replace("${name}", fileName);
            fs.writeFile(output, ret, function (err) {
                if (err) throw err;
            });
        });

    }
};



