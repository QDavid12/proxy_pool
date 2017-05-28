var api_server = require('./proxy_api/server');
var proxy_getter = require('./proxy_getter/index');
var schedule = require('./schedule/index');

proxy_getter.start();
schedule.start();
api_server.start();

// old
require('./schedule/old-proxy');
