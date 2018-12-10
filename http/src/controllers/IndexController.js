const fs = require('fs');
const path = require('path');
const url = require('url');
const R = require('ramda');

exports.index = (() => {
    return {
        index(req, res, param){
            let query = url.parse(req.url, true).query;
            // if(query.foo && !Object.prototype.toString.call(query.foo) === '[object Array]'){
            //
            // }
            if(!req.session.isLogin){
                res.setHeader('refresh', '0;url=/user/login');
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end('正在跳转...');
            }else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.end(fs.readFileSync(path.resolve(__dirname, '../view/index.html')));
            }
        }
    };
})();