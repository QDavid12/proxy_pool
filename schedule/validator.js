var db = require('../db/index');

function Validator(params){
  var o = params||{};
  // user params
  this.name = o.name||'unknown';// 名称
  this.from = o.from||'all';     // 从哪张表取ip
  this.to = o.to;                // 验证完放到哪张表
  this.workers = o.workers||50;  // 并发请求数量，默认50
  this.interval = o.interval||5; // 启动间隔，默认5分钟，设置为-1来关闭
  this.times = o.times||1;       // 每个ip的检查次数

  // how
  this.checkFunc = o.checkFunc||null;
  this.maxTime = o.maxTime||2.5;

  if(!this.to||!this.from||!this.checkFunc){
    console.log('[validator] param error');
    return false;
  }

  // db
  this.fromDB = db.getTable(this.from);
  this.toDB = db.getTable(this.to);

  // status params
  this.queue = [];
  this.loaded = false;
  this.working = false;

  if(this.interval>=1){
    this.timer = setInterval(this.work, this.interval*60*1000);
  }
}

Validator.prototype = {
  work: function(){
    this.queue = this.fromDB.get().ips;
    this.result = [];
    if(!this.queue||this.queue.length<=0){
      console.log('[validator] no ips:', this.name);
      return;
    }

    this.workersCount = this.workers;
    console.log('[validator] start:', this.name, 'count:', this.queue.length, 'workers:', this.workersCount);
    for(var i=0;i<this.workers;i++){
      this.worker();
    }
  },
  worker: function(t){
    var task;
    if(!t){
      task = this.queue.pop();
      if(!task){
        // one worker end
        this.workersCount--;
        if(this.workersCount%10===0){
          console.log('[validator]', this.name, 'workers left:', this.workersCount);
        }
        if(this.workersCount===0){
          if(this.result.length>=3){
            this.toDB.set({
              ips: this.result
            });
          }
          console.log('[validator]', this.name, 'end');
        }
        return;
      }
    }
    var that = this;
    // check
    this.testOne(task.ip, function(time){
      if(time<that.maxTime){
        task.time = time;
        console.log('[good]', that.name, task.ip, time);
        that.result.push(task);
        // next
      } else if(time<5) {
        // console.log(task.ip, time);
      }
      that.worker();
    });
  },
  testOne: function(proxy, callback){
    var times = this.times;
    var count = this.times;
    var score = 0;
    var that = this;
    var endCallback = function(time){
      score += time;
      count--;
      if(count===0&&callback){
        var final = parseFloat((score/times).toFixed(2));
        return callback(final);
      }
      that.checkFunc(proxy, endCallback);
    };
    this.checkFunc(proxy, endCallback);
  }
};

module.exports = Validator;
