// let sessions = {};

exports.sessionUtil = {
    KEY: 'session_id',
    EXPIRES: 1 * 20 * 1000,
    generate(){
        let session = {};
        session.id = (new Date()).getTime() + Math.random();
        session.cookie = {
            expire: (new Date()).getTime() + this.EXPIRES
        };
        // sessions[session.id] = session;
        return session;
    // },
    // getSession(ssid){
    //     return sessions[ssid];
    // },
    // deleteSession(ssid){
    //     delete sessions[ssid];
    }
};