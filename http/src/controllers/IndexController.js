const fs = require('fs');
const path = require('path');
const url = require('url');
const R = require('ramda');

const cookieUtil = require('../../util/cookieUtil').cookieUtil;

exports.index = (() => {
    return {
        index(req, res, param){
            let query = url.parse(req.url, true).query;
            // if(query.foo && !Object.prototype.toString.call(query.foo) === '[object Array]'){
            //
            // }
            let cookies = cookieUtil.parser(req.headers.cookie);
            if(!cookies['isVisit']){
                res.setHeader('Set-Cookie', cookieUtil.serialize('isVisit', 1, {httpOnly: true}));
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end('首次访问');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.end(fs.readFileSync(path.resolve(__dirname, '../view/index.html')));
        }
    };
})();