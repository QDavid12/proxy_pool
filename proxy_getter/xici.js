var request = require('superagent');
var cheerio = require('cheerio');

var url = 'http://www.xicidaili.com/nn/';

if(require.main===module){
  getList();
}

function getList(callback){
  var pages = 3; // how many pages
  var count = 1;
  var res = [];
  var endCallback = function(list){
    pages--;
    res = Array.prototype.concat(res, list||[]);
    if(pages===0){
      console.log('[proxy getter] xici got', res.length);
      if(callback) callback(res);
      return;
    }
    getXiciPage(++count, endCallback);
  };
  getXiciPage(1, endCallback);
}

function getXiciPage(page, callback){
  var result = [],
      p = page||1;
  // console.log(p);
  request
    .get(url+'/'+p)
    .set({
      'Host': 'www.xicidaili.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
    })
    .timeout(10*1000)
    .end(function(err, res){
      if(err){
        console.log('[proxy getter] xici error', err.status);
        if(callback) callback([]);
        return;
      }

      //console.log('get');
      // var r = /<tr[\s\S]*?>[\s\S]*?<td>([\d\.]*?)<[\s\S]*?<td>(\d+)<[\s\S]*?title="([\d\.]+)/g;
      // var s = null;
      // while((s = r.exec(res.text))!=null){
      //   if(parseFloat(s[3])<0.5){
      //     result.push(s[1]+':'+s[2]);
      //   }
      // }
      // console.log('xici', result.length);

      var $ = cheerio.load(res.text),
          list = $('#ip_list').find('tr');
          // console.log(list.length);
      list.each(function(i, elem) {
        try {
          var tds = $(this).find('td');
          if(tds.length>5){
            var ins = {
              ip: tds.eq(5).text().toLowerCase()+'://'+tds.eq(1).text(),
              from: 'xici'
            };
            result.push(ins);
          }
        } catch(e) {}
      });
      // console.log(result);
      console.log('[proxy getter] xici page', p, result.length);
      if(callback) callback(result);
    });
}

module.exports = getList;
