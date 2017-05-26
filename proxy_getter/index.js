var request = require('superagent');
require('superagent-proxy')(request);

var cnUrl = 'http://cn-proxy.com/list';
var xiciUrl = 'http://www.xicidaili.com/nt/';
var kuaiUrl = 'http://www.kuaidaili.com/free';
var gouUrl = 'http://www.goubanjia.com/free/gngn/index.shtml';

// getKuaiList();
function getKuaiList(callback){
  var result = [];
  request
    .get(kuaiUrl)
    .set({
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      'Referer': 'http://www.kuaidaili.com/free',
      'Host': 'www.kuaidaili.com'
    })
    .timeout(5000)
    .end(function(err, res){
      if(err){
        console.log('kuai error', err.status);
        if(callback) callback([]);
        return;
      }
      //console.log('get', res.text);
      var r = /<tr>[\s\S]*?<td[\s\S]*?>([\d\.]*?)<[\s\S]*?<td[\s\S]*?>(\d+)<[\s\S]*?速度">(\d+)秒[\s\S]*?<\/tr>/g;
      var s = null;
      while((s = r.exec(res.text))!=null){
        if(parseFloat(s[3])<4){
          result.push(s[1]+':'+s[2]);
        }
      }
      result = result.splice(0, 20);
      console.log('kuai', result.length);
      if(callback) callback(result);
    })
}

// getXiciList();
function getXiciList(callback){
  var result = [];
  request
    .get(xiciUrl)
    .set({
      'Host': 'www.xicidaili.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
    })
    .timeout(5000)
    .end(function(err, res){
      if(err){
        console.log('xici error', err.status);
        if(callback) callback([]);
        return;
      }
      //console.log('get');
      var r = /<tr[\s\S]*?>[\s\S]*?<td>([\d\.]*?)<[\s\S]*?<td>(\d+)<[\s\S]*?title="([\d\.]+)/g;
      var s = null;
      while((s = r.exec(res.text))!=null){
        if(parseFloat(s[3])<0.5){
          result.push(s[1]+':'+s[2]);
        }
      }
      console.log('xici', result.length);
      if(callback) callback(result);
    })
}

function getCnList(callback){
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
        console.log('cn error', err.status);
        if(callback) callback([]);
        return;
      }
      var r = /<tr>[\s\S]*?<td>([\d\.]*?)<[\s\S]*?<td>(\d+)<[\s\S]*?width: (\d+)%;/g;
      var s = null;
      while((s = r.exec(res.text))!=null){
        if(s[3]>=75){
          var banlist = ['111.8.22', '111.23.10'];
          var banned = false;
          banlist.forEach(function(ins){
            if(s[1].indexOf(ins)>-1){
              banned = true;
            }
          })
          if(!banned){
            result.push({
              link: s[1]+':'+s[2],
              speed: s[3]
            });
          }
        }
      }
      result = result.sort(function(a, b){
        return b.speed - a.speed;
      })
      //console.log(result);
      result = result.slice(0, 40).map(function(ins){
        return ins.link;
      })
      console.log('cn', result.length);
      if(callback) callback(result);
    })
}

function getList(callback){
  var tasks = [getCnList, getXiciList, getKuaiList];
  var list = [];
  var count = tasks.length;
  var endCallback = function(res){
    count -= 1;
    list = Array.prototype.concat(list, res);
    if(count === 0){
      if(callback) callback(list);
    }
  }
  tasks.forEach(function(func){
    func(endCallback);
  })
}

module.exports = {
  getList: getList
}
