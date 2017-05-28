var getCnList = require('./cn'),
    getXiciList = require('./xici'),
    getKuaiList = require('./kuai');

var request = require('superagent');
require('superagent-proxy')(request);

var db = require('../db/index');
var table = db.getTable('all');

// validator
var v = require('../schedule/default');
// v.work();

if(require.main===module){
  start();
}

function start(){
  var interval = 20;  // 默认间隔20分钟
  step();             // 立即执行一次
  var timer = setInterval(step, parseInt(interval*60*1000));
}

function end(){
  clearInterval(timer);
}

function validate(){
  v.work();
}

function step(){
  var res = [];
  getList(function(list){
    table.set({
      ips: list
    });
    setTimeout(validate, 5*1000);
  });
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
  };
  tasks.forEach(function(func){
    func(endCallback);
  });
}

module.exports = {
  start: start,
  end: end
};
