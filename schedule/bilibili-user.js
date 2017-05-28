var request = require('request');
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
      url: 'http://space.bilibili.com/ajax/member/GetInfo',
      timeout: 5000,
      proxy: proxy,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
        'Referer': 'http://space.bilibili.com/'+uid+'/',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Host': 'space.bilibili.com',
        'Origin': 'http://space.bilibili.com',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: 'mid='+uid
    };
    request(option, function(err, res, body){
      //if(proxy.indexOf('1.82.216.135')>-1) console.log(res.statusCode);
      var status = 200;
      if(res&&res.statusCode!==200) status = res.statusCode;
      if(body===undefined) status=400;
      if(body&&body.indexOf('Forbidden')>-1) status=403;
      if(body&&body.indexOf('Unauthorized')>-1) status=403;
      try { var s = JSON.parse(body); var s1 = s.status; } catch(e) { status = 400; }
      var t = false;
      if(err){
        t = 5000;
      }
      if(status>=400){
        t = 20000;
      }
      if(status==403){
        t = 50000;
      }
      if(status==200&&body.indexOf('status"')===-1) console.log(body);
      var end = t?(start+t):(new Date()).getTime();
      // console.log(proxy, (end-start)/1000);
      return callback((end-start)/1000);
    });
  }
});

if(require.main===module){
  v.work();
}

module.exports = v;
