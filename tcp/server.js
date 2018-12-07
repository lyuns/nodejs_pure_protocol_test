const net = require('net');
const log = console.log;

const port = 9633;

let conn_list = [];

let tcp_server = net.createServer(c => {
    log('新客户端已连接...');

    conn_list.push(c);

    c.on('end', () => {
        log('客户端终结...');
    });

    c.on('data', data => {
        c.write(`已收到数据${data.toString()}`);
    });

    c.on('close', () => {
        log('客户端断开...')
    })
});

tcp_server.on('error', err => {
    throw err;
});

tcp_server.listen(port, () => {
    log(`server listen at port ${port}`)
});

