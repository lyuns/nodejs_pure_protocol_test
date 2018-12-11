const redisStore = require('../../util/redisUtil').store;

let userinfo = {
    username: 'lyuns',
    userpass: 'abc123'
};

exports.api = (() => {
    return {
        userLogin(req, res, ...param){
            if(param[0] === 'POST'){
                let post = '';
                req.on('data', (chunk) => {
                    post += chunk;
                });
                req.on('end', () => {
                    let post_param = {};
                    try {
                        post_param = JSON.parse(post);
                    }catch (e) {
                        res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
                        res.end('找不到响应服务器');
                        return;
                    }
                    if(post_param['username'] && post_param['userpass']){
                        if(userinfo.username === post_param['username'] && userinfo.userpass === post_param['userpass']){
                            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
                            res.end(JSON.stringify({
                                status: 1,
                                info: '登录成功'
                            }));
                            req.session.isLogin = true;
                            redisStore.set(req.session.id, req.session)
                        }
                    }else{
                        res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
                        res.end(JSON.stringify({
                            status: 0,
                            info: '用户名或密码错误'
                        }));
                    }
                });
            }else{
                res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end('找不到响应服务器');
            }
        }
    };
})();