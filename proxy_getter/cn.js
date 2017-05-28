var request = require('superagent');
var cheerio = require('cheerio');

var cnUrl = 'http://cn-proxy.com/';

if(require.main===module){
  getList();
}

function getList(callback){
  var result = [];
  request
    .get(cnUrl)
    .set({
      'Host': 'cn-proxy.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    })
    //.proxy('http://127.0.0.1:1080')
    .end(function(err, res){
      if(err){
        console.log('[proxy getter] cn error', err.status);
        if(callback) callback([]);
        return;
      }
      var r = /<tr>[\s\S]*?<td>([\d\.]*?)<[\s\S]*?<td>(\d+)<[\s\S]*?width: (\d+)%;/g;
      var s = null;
      while((s = r.exec(res.text))!==null){
        if(s[3]>=75){
          var banlist = []//['111.8.22', '111.23.10'];
          var banned = false;
          banlist.forEach(function(ins){
            if(s[1].indexOf(ins)>-1){
              banned = true;
            }
          });
          if(!banned){
            result.push({
              ip: 'http://'+s[1]+':'+s[2],
              from: 'cn',
              speed: s[3]
            });
          }
        }
      }
      result = result.sort(function(a, b){
        return b.speed - a.speed;
      });
      // console.log(result);
      // result = result.slice(0, 40).map(function(ins){
      //   return ins.link;
      // });
      console.log('[proxy getter] cn got', result.length);
      if(callback) callback(result);
    });
}

module.exports = getList;
