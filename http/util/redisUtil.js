const redis = require('redis');
const client = redis.createClient(6379, '192.168.117.128');

client.auth('test123');

client.on('error', (err) => {
    console.log('redis出错', err);
});

exports.store = {
    set(id, session){
        if(session){
            client.set(id, JSON.stringify(session));
            if(session.cookie && session.cookie.expire){
                client.expire(id, session.cookie.expire);
            }
        }else{
            console.log('session不存在');
        }
    },
    get(id, callback){
        client.get(id, callback)
    }
}
