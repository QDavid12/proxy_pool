var fs = require('fs');
var DB = require('./base');

var tables = [];

function createTable(o){
  if(!o||!o.name){
    console.log('[db] create error: name needed!');
    return false;
  }
  if(tables[o.name]){
    console.log('[db] create error', o.name, 'exists');
    return false;
  }
  var db = new DB(o);
  console.log('[db] create success:', this.name);
  return db;
}

function getTable(key){
  if(key){
    return tables[key];
  }
}

module.exports = {
  createTable: createTable,
  getTable: getTable
}
