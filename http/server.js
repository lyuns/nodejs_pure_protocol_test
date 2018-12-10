const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const R = require('ramda');

const cookieUtil = require('./util/cookieUtil').cookieUtil;
const sessionUtil = require('./util/sessionUtil').sessionUtil;

let checkSession = (req, res) => {
    let id = req.cookies && req.cookies[sessionUtil.KEY];
    if(!id){
        req.session = sessionUtil.generate();
    }else{
        req.session = sessionUtil.getSession(id);
        if(req.session){
            if(req.session.cookie.expire > (new Date()).getTime()){
                // 正常
                req.session.cookie.expire = (new Date()).getTime() + sessionUtil.EXPIRES;
            }else{
                // 超时
                delete sessionUtil[id];
            }
        }else{
            // session不存在
            req.session = sessionUtil.generate();
        }
    }
};

let requestHandler = (() => {
    let _instance = null;
    let _handler = {};

    // 加载控制器
    (() => {
        _handler.index = {};
        fs.readdir(path.resolve(__dirname, './src/controllers/'), (err, files) => {
            let toLowerCase = str => str.toLowerCase();
            let filterController = file => file.replace(/Controller\.js$/, '');
            files.forEach(file => {
                let controller = R.compose(toLowerCase, filterController)(file);
                _handler[controller] = {};
                let actions = require(path.resolve(__dirname, './src/controllers/', file))[controller];
                Object.keys(actions).forEach(action => {
                    _handler[controller][action] = actions[action];
                });
            });
        });
    })();

    let initHandler = () => {
        // 此处可绑定一些其他操作

        return _handler;
    };

    return  () => {
        if(!_instance){
            _instance = initHandler();
        }
        return _instance;
    };
})();

let controllerParser = (args, method) => {
    let {req, res} = args;
    let pathname = url.parse(req.url).pathname;
    let paths = pathname.split('/');
    let controller = paths[1] || 'index';
    let action = paths[2] || 'index';
    let params = [method].concat(paths.slice(3));
    req.cookies = cookieUtil.parser(req.headers.cookie);
    checkSession(req, res);
    let writeHead = res.writeHead;
    res.writeHead = function(){
        let cookies = res.getHeader('Set-Cookie');
        let session = cookieUtil.serialize(sessionUtil.KEY, req.session.id);
        cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
        res.setHeader('Set-Cookie', cookies);
        return writeHead.apply(this, arguments);
    };
    let handler = requestHandler();
    if(handler[controller] && handler[controller][action]){
        handler[controller][action].apply(null, [req, res].concat(params));
    }else{
        res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end('找不到响应服务器');
    }
};

let HttpServer = (() => {
    let _instance = null;

    let initServer = () => {
        const port = 9633;
        const httpEventListener = new EventEmitter();
        httpEventListener.addListener('GET', (args) => {
            controllerParser(args, 'GET');
        });
        httpEventListener.addListener('POST', (args) => {
            controllerParser(args, 'POST');
        });
        let server = http.createServer((req, res) => {
            let pathname = url.parse(req.url).pathname;
            if(pathname === '/favicon.ico'){
                fs.readFile(path.resolve(__dirname, './assets/favicon.ico'), (err, file) => {
                    if(err){
                        res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
                        res.end('找不到相关文件..');
                        return;
                    }
                    res.writeHead(200, {'Content-Type': 'application/x-ico'});
                    res.end(file);
                });
            }else{
                httpEventListener.emit(req.method, {
                    req: req,
                    res: res
                });
            }
        });
        server.listen(port, () => {
            console.log(`http://localhost:${port}`);
        });
        return server;
    };

    return () => {
        if(!_instance) {
            _instance = initServer();
        }
        return _instance;
    };
})();

HttpServer();
