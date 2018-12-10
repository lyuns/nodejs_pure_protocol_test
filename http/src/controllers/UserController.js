const fs = require('fs');
const path = require('path');

exports.user = (() => {
    return {
        login(req, res, param){
            if(!req.session.isLogin){
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.end(fs.readFileSync(path.resolve(__dirname, '../view/login.html')));
                return;
            }else{
                res.setHeader('refresh', '0;url=/');
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end('正在跳转...');
            }
        },
        reg(req, res, param){
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end('注册页面');
        }
    };
})();