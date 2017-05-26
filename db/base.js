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
  this.path = path.resolve(__dirname, './db-files/'+this.name+'.json');
  if(fs.existsSync(this.path)){
    console.log('[db] load from file:', this.name);
    this.data = require(this.path);
  } else {
    this.data = {};
    this.save();
  }
  this.autoSave = o.autoSave||false;
  this.saveTime = o.saveTime||60;
  if(this.saveTime>0){
    this.timer = setInterval(function(){
      that.save(true);
    }, this.saveTime*1000);
  }
  // console.log('[db] create success:', this.name);
}

DB.prototype = {
  save: function(auto){
    var that = this;
    fs.writeFile(this.path, JSON.stringify(this.data), function(err){
      if(err){
        console.log('[db] save error', that.name, err);
      }
    });
  },
  set: function(data, save){
    var d = data||{};
    for(var key in d){
      this.data[key] = d[key];
    }
    if(save||this.autoSave){
      this.save();
    }
  },
  get: function(key){
    return extend({}, this.data[key]);
  }
};

var db = new DB({
  name: 'index'
});
db.set({
  udpated: '123'
}, true);
console.log(db.data);

module.exports = DB;
