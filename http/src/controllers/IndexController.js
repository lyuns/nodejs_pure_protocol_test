const fs = require('fs');
const path = require('path');

exports.index = (() => {
    return {
        index(req, res, param){
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.end(fs.readFileSync(path.resolve(__dirname, '../view/index.html')));
        }
    };
})();