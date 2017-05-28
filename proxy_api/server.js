var express = require('express');
var app = express();
var db = require('../db/index');
var fs = require('fs');
var path = require('path');

function apiRouter(req, res, next){
  var type = req.params.type||'all';
  try {
    var route = path.resolve(__dirname, '../db/db-files/'+type+'.db.json');
    fs.readFile(route, function(err, data){
      if(err){
        next();
        return;
      }
      res.send(data.toString());
      return;
    });
  } catch(e){
    next();
  }
}

app.get('/', apiRouter);
app.get('/:type', apiRouter);

app.use(function(req, res){
  res.status(404).send(404);
});

function start(){
  app.listen(80, function(){
    console.log('[server] running on 80!');
  });
}

module.exports = {
  start: start
};
