var request = require('superagent');
var cheerio = require('cheerio');

var kuaiUrl = 'http://www.kuaidaili.com/free';

if(require.main===module){
  getList();
}

function getList(callback){
  var pages = 5,
      count = 1,
      res = [];
  var endCallback = function(list){
    count += 1;
    res = Array.prototype.concat(res, list);
    if(count>pages){
      console.log('[proxy getter] kuai got', res.length);
      if(callback) callback(res);
    } else {
      getPage(count, endCallback);
    }
  };
  getPage(1, endCallback);
}

function getPage(page, callback){
  var result = [],
      p = page||1;
  request
    .get(kuaiUrl+'/inha/'+p)
    .set({
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      'Referer': 'http://www.kuaidaili.com/free',
      'Host': 'www.kuaidaili.com'
    })
    .timeout(5*1000)
    .end(function(err, res){
      if(err){
        console.log('[proxy getter] kuai page error', page, err.status);
        if(callback) callback([]);
        return;
      }
      //console.log('get', res.text);
      var r = /<tr>[\s\S]*?<td[\s\S]*?>([\d\.]*?)<[\s\S]*?<td[\s\S]*?>(\d+)<[\s\S]*?速度">(\d+)秒[\s\S]*?<\/tr>/g;
      var s = null;
      while((s = r.exec(res.text))!==null){
        result.push({
          ip: 'http://'+s[1]+':'+s[2],
          from: 'kuai'
        });
      }
      // result = result.splice(0, 20);
      // console.log(result);
      console.log('[proxy getter] kuai page', p, result.length);
      if(callback) callback(result);
    });
}

module.exports = getList;
