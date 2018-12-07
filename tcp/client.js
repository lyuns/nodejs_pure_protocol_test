const net = require('net');
const log = console.log;

let num = 1;
let send_data = (() => {
    let cache = '';
    return () => {
        cache += num;
        return cache;
    }
})();

let tcp_client = net.connect({port: 9633}, () => {
    log('已连接到服务端...');
    tcp_client.write(send_data());
    num++;
});

tcp_client.on('data', data => {
    log(data.toString());
    setTimeout(()=>{
        tcp_client.write(send_data());
        num++;
    }, 3000);
});

tcp_client.on('end', () => {
    log('已断开连接到服务端...');
})