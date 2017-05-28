var list = ['bilibili-video', 'bilibili-user'];
var schedules = [];

function start(){
  list.forEach(function(name){
    try {
      var tmp = require('./'+name);
      schedules.push(tmp);
      // tmp.work();
    } catch(e) {

    }
  });
}

module.exports = {
  start: start
};
