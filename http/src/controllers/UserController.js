exports.user = (() => {
    return {
        login(req, res, param){
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end('登录页面');
        },
        reg(req, res, param){
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end('注册页面');
        }
    };
})();