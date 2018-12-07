const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const R = require('ramda');

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

let controllerParser = (args) => {
    let {req, res} = args;
    let pathname = url.parse(req.url).pathname;
    let paths = pathname.split('/');
    let controller = paths[1] || 'index';
    let action = paths[2] || 'index';
    let params = paths.slice(3);
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
            controllerParser(args);
        });
        httpEventListener.addListener('POST', (args) => {
            controllerParser(args);
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
