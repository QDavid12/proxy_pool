var request = require('superagent');
require('superagent-proxy')(request);

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
  // .proxy('http://139.224.237.33')
  .proxy('http://124.235.145.162')
  .timeout(5000)
  .end(function(err, res){
    // console.log(err, res.text);
    // if(res&&res.text&&res.text.indexOf('waste')>-1){
    //   console.log(proxy, res.text);
    // }
    if(res&&res.text==undefined) err={status: 400};
    var end = err?(err.status==403?(start+20000):(start+5000)):(new Date()).getTime();
    console.log((end-start)/1000);
  });
