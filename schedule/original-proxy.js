var request = require('superagent');
require('superagent-proxy')(request);
var times = 3;
var proxyList = ['http://61.191.41.130:80', 'http://113.107.112.210:8101'];
var goodList = [];
var nomore = 0;
var maxCount = 15;
var timer;

var fs = require('fs');
var newProxyList = function(callback){
  var data = require('../db/db-files/all.db.json');
  console.log('got from file!', data.ips.length);
  if(callback) callback(data.ips);
};

step();
get();
//setTimeout(get, 5000);
function start(){
  timer = setInterval(step, 60*1000);
}

function step(){
  nomore += 1;
  if(nomore>=maxCount){
    if(nomore==maxCount) console.log('[timer pause]');
    return;
  }
  console.log('[get new proxy] nomore:', nomore);
  testAll(function(res){
    console.log('total', res.list.length);
    if(res&&res.list&&(res.list.length>2||(proxyList.length<2&&res.list.length>0))){
      console.log('new examed list:', res.list.length);
      proxyList = res.list;
    }
    if(res&&res.goodList&&res.goodList.length>2){
      console.log('new good list:', res.goodList.length);
      goodList = res.goodList;
    }
  });
}

function testAll(callback){
  getList(function(list){

    // something wrong on win10
    // if(callback) return callback({
    //   list: list,
    //   goodList: list
    //   //ip: res,
    //   //time: min
    // });

    var c = list.length;
    console.log('new list length:', c);
    var result = {};
    list.forEach(function(ins){
      test(ins, function(score){
        result[ins] = score;
        c -= 1;
        if(c==0){
          console.log(result);
          var min = 3;
          var res = '';
          var tmp = [], gList = [];
          for(var ip in result){
            if(result[ip]<min){
              //min = result[ip];
              //res = ip;
              tmp.push(ip);
              console.log('[proxy ip]', ip, result[ip]);
            }
            if(result[ip]<2){
              gList.push(ip);
            }
          }
          //return console.log(res, min);
          if(callback) return callback({
            list: tmp,
            goodList: gList
            //ip: res,
            //time: min
          });
        }
      })
    })
  });
}

function test(proxy, callback){
  var count = times;
  var score = 0;
  for(var i=0;i<times;i++){
    testOne(proxy, function(err, time){
      score += time;
      count -= 1;
      if(count==0&&callback){
        return callback(score/times);
      }
    })
  }
}

function testOne(proxy, callback){
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
      return callback(err, (end-start)/1000);
    });
}

function getList(callback){
  var list = [];
  newProxyList(function(res){
    if(res&&res[0]){
      res = res.map(function(ins){return ins.ip;});
      list.forEach(function(ins){
        if(res.indexOf(ins)==-1) res.push(ins);
      })
    }
    return callback(res);
  })
}

function get(mode){
  nomore = 0;
  if(!timer){
    console.log('[start timer]');
    start();
  }
  if(mode==='good'){
    if(goodList.length>0){
      return goodList[Math.floor(Math.random()*goodList.length)];
    }
  }
  return proxyList[Math.floor(Math.random()*proxyList.length)];
  //return proxy;
}

function set(proxy){
  proxy = proxy;
}

function returnList(){
  nomore = 0;
  if(!timer){
    console.log('[start timer]');
    start();
  }
  return proxyList;
}

module.exports = {
  get: get,
  returnList: returnList
}
/*
var proxy = 'http://183.245.147.24:80'; //403
var proxy = 'http://218.207.176.14:80';
*/
