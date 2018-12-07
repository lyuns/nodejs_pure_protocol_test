const dgram = require('dgram');

let msg = new Buffer('这是一条来自udp客户端的消息');

let client = dgram.createSocket('udp4');

client.send(msg, 0, msg.length, 41234, '192.168.2.14', (err, bytes)=>{
    client.close();
});