var request = require('superagent');
require('superagent-proxy')(request);
var Validator = require('./validator');

var v = new Validator({
  name: 'bilibili-user',
  // from: 'all',
  from: 'ok',
  to: 'bilibili-user',
  interval: 3,
  times: 3,
  workers: 50,
  maxTime: 2.5,
  checkFunc: function(proxy, callback){
    var uid = parseInt(Math.random()*10000);
    var start = (new Date()).getTime();
    var option = {
      method: 'POST',
      url: 'https://space.bilibili.com/ajax/member/GetInfo',
      timeout: 5000,
      proxy: proxy,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
        'Referer': 'https://space.bilibili.com/'+uid+'/',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Host': 'space.bilibili.com',
        'Origin': 'https://space.bilibili.com',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: 'mid='+uid
    };
    request(option, function(err, res, body){
      //if(proxy.indexOf('1.82.216.135')>-1) console.log(res.statusCode);
      var uid = parseInt(Math.random()*10000);
      var start = (new Date()).getTime();
      request
        .get('http://space.bilibili.com/ajax/member/getSubmitVideos?mid='+uid)
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .set('Accept-Encoding', 'gzip, deflate, sdch')
        .set('Accept-Language', 'zh-CN,zh;q=0.8')
        .set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache')
        .set('Connection', 'keep-alive')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36')
        .set('Upgrade-Insecure-Requests', '1')
        .set('Host', 'space.bilibili.com')
        .proxy(proxy)
        .timeout(5000)
        .end(function(err, res){
          if(res&&res.text&&res.text.indexOf('waste')>-1){
            console.log(proxy, res.text);
          }
          if(res&&res.text==undefined) err={status: 400};
          var end = err?(err.status==403?(start+20000):(start+5000)):(new Date()).getTime();
          return callback((end-start)/1000);
        });
    });
  }
});

if(require.main===module){
  v.work();
}

module.exports = v;
