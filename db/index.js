var fs = require('fs');
var DB = require('./base');

try {
  fs.mkdirSync(__dirname+'/db-files', 0777);
} catch(e) {

}

var tables = {};

function getTable(name, options){
  var o = options||{};
  o.name = name;
  if(!name){
    console.log('[db] error: name needed!');
    return false;
  }
  if(tables[name]){
    return tables[name];
  }
  var db = new DB(o);
  tables[name] = db;
  console.log('[db] create table success:', name);
  return db;
}

function getData(name){
  if(name&&tables[name]){
    return tables[name].get();
  } else {
    return false;
  }
}

module.exports = {
  getTable: getTable,
  getData: getData
};
