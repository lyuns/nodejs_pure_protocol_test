const dgram = require('dgram');
const log = console.log;

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    log(`服务端收到来自${rinfo.address}:${rinfo.port}的消息\r\n${msg}`);
});

server.on('listening', () => {
   const address = server.address();
   console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
