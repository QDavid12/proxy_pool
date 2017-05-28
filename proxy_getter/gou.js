var request = require('superagent');
var cheerio = require('cheerio');

var url,
    cookie,
    Pages = 1;

if(require.main===module){
  getList(function(list){
    console.log(list.length);
  });
}

function getList(callback){
  var res = [];
  // getPTList(function(ntlist){
  //   res = Array.prototype.concat(res, ntlist||[]);
    getGNList(function(nnlist){
      res = Array.prototype.concat(res, nnlist||[]);
      if(callback) callback(res);
    });
  // });
}

function getGNList(callback){
  url = 'http://www.goubanjia.com/free/gngn/index';
  var pages = Pages||6; // how many pages
  var count = 1;
  var res = [];
  var endCallback = function(list){
    pages--;
    res = Array.prototype.concat(res, list||[]);
    if(pages===0){
      console.log('[proxy getter] gou got', res.length);
      if(callback) callback(res);
      return;
    }
    getGouPage(++count, endCallback);
  };
  getGouPage(1, endCallback);
}

function getPTList(callback){
  url = 'http://www.goubanjia.com/free/gnpt/index';
  var pages = Pages||6; // how many pages
  var count = 1;
  var res = [];
  var endCallback = function(list){
    pages--;
    res = Array.prototype.concat(res, list||[]);
    if(pages===0){
      console.log('[proxy getter] gou got', res.length);
      if(callback) callback(res);
      return;
    }
    getGouPage(++count, endCallback);
  };
  getGouPage(1, endCallback);
}

function getGouPage(page, callback){
  var result = [],
      p = page||1;
  // console.log(p);
  request
    .get(url+p+'.shtml')
    .set({
      'Host': 'www.goubanjia.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
      'Referer': url,
      'Cookie': cookie||'auth=60d68adfa38d85d1c28626e1e7d43c59;'
    })
    .timeout(10*1000)
    .end(function(err, res){
      if(err){
        console.log('[proxy getter] gou error', err.status);
        if(res&&res.headers['set-cookie']){
          cookie = res.headers['set-cookie'];
          return getGouPage(p, callback);
        }
        if(callback) callback([]);
        return;
      }

      var $ = cheerio.load(res.text),
          list = $('#list').find('tbody').eq(0).find('tr');
          // console.log(list.length);
      list.each(function(i, elem) {
        // try {
          var tds = $(this).find('td');
          if(tds.length>5){
            var ipElements = tds.eq(0);
            var ip = '';
            ipElements.children().each(function(i, elem){
              var style = $(this).attr('style');
              var className = $(this).attr('class');
              if(className&&className.indexOf('port')>-1){
                ip += ':';
              }
              // console.log(style);
              if(!style||style.indexOf('none')===-1){
                ip += $(this).text();
              }
            });
            console.log(ip);
            var speed = tds.eq(6).find('div').eq(0).attr('title');
            speed = parseFloat(speed);
            // console.log(speed);
            if(speed<2){
              var ins = {
                ip: tds.eq(5).text().toLowerCase()+'://'+tds.eq(1).text(),
                from: 'gou'
              };
              result.push(ins);
            }
          }
        // } catch(e) {console.log(e);}
      });
      // console.log(result);
      console.log('[proxy getter] gou page', p, result.length);
      if(callback) callback(result);
    });
}

module.exports = getList;
