var fs = require('fs');
var path = require('path');
var extend = require('util')._extend;

function DB(params){
  var o = params||{};
  var that = this;
  this.name = o.name;
  if(!this.name){
    // console.log('[db] create error: name needed!');
    return false;
  }
  this.path = path.resolve(__dirname, './db-files/'+this.name+'.db.json');
  if(fs.existsSync(this.path)){
    try{
      console.log('[db] load from file:', this.name);
      this.data = require(this.path);
    } catch(e) {
      console.log('[db] load from file error:', this.name);
      this.data = {};
    }
  } else {
    this.data = {};
    this.save();
  }
  this.autoSave = o.autoSave||true;
  this.saveTime = o.saveTime||-1;
  if(this.saveTime>0){
    this.timer = setInterval(function(){
      that.save();
    }, this.saveTime*1000);
  }
  // console.log('[db] create success:', this.name);
}

DB.prototype = {
  save: function(callback){
    var that = this;
    fs.writeFile(this.path, JSON.stringify(this.data), function(err){
      if(err){
        console.log('[db] save error:', that.name, err);
      } else {
        console.log('[db] save success:', that.name);
      }
      if(callback) callack(err);
    });
  },
  set: function(data, save, callback){
    var d = data||{};
    for(var key in d){
      this.data[key] = d[key];
    }
    this.data._lastUpdate = (new Date()).toLocaleString();
    if(save||this.autoSave){
      this.save(callback);
    }
  },
  get: function(){
    return JSON.parse(JSON.stringify(this.data));
  }
};

// var db = new DB({
//   name: 'test'
// });
// db.set({
//   udpated: '123'
// }, true);
// console.log(db.data);

module.exports = DB;
