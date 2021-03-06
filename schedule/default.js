var request = require('superagent');
require('superagent-proxy')(request);
var Validator = require('./validator');

var v = new Validator({
  name: 'default',
  from: 'all',
  to: 'ok',
  interval: -1,
  times: 3,
  workers: 100,
  maxTime: 5,
  checkFunc: function(proxy, callback){
    var start = (new Date()).getTime();
    request
      .get('http://www.baidu.com')
      .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
      .set('Accept-Encoding', 'gzip, deflate, sdch')
      .set('Accept-Language', 'zh-CN,zh;q=0.8')
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache')
      .set('Connection', 'keep-alive')
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36')
      .set('Upgrade-Insecure-Requests', '1')
      .set('Host', 'www.baidu.com')
      .proxy(proxy)
      .timeout(5*1000)
      .end(function(err, res){
        if(res&&res.text==undefined) err={status: 400};
        var end = err?(err.status==403?(start+20000):(start+5000)):(new Date()).getTime();
        // console.log((end-start)/1000);
        return callback((end-start)/1000);
      });
  }
});

if(require.main===module){
  v.work();
}

module.exports = v;
