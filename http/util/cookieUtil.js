exports.cookieUtil = {
    parser(cookie){
        let cookies = {};
        let cookieList = cookie.split(';');
        cookieList.forEach(pair_str => {
            let pair = pair_str.split('=');
            cookies[pair[0].trim()] = pair[1];
        })
        return cookies;
    },
    serialize(name, val, opt){
        let pairs = [name + '=' + val];
        opt = opt || {};

        if(opt.maxAge){
            pairs.push('Max-Age=' + opt.maxAge);
        }
        if(opt.domain){
            pairs.push('Domain=' + opt.domain);
        }
        if(opt.path){
            pairs.push('Path=' + opt.path);
        }
        if(opt.expires){
            pairs.push('Expires=' + opt.expires.toUTCString());
        }
        if(opt.httpOnly){
            pairs.push('HttpOnly');
        }
        if(opt.secure){
            pairs.push('Secure');
        }
        return pairs.join('; ');
    }
};