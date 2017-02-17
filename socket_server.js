const fs = require('fs'),
      conf = JSON.parse(fs.readFileSync(__dirname+'/socket_server.conf','utf-8')),
      express = require('express'),
      app = express(),
      serverIP = conf.serverIP,
      serverPort = conf.serverPort,
      responseData = conf.responseMessage;

require('log-timestamp');

var server = app.listen(serverPort),
    socket = require('socket.io').listen(server);

console.log("================================================");
console.log('Socket server listening: '+serverIP+':'+serverPort);
console.log("================================================");
console.log("============ Starting Socket Server ============");
console.log("================================================");
var i = 0;
socket.on('connection', function (socket) {
  socket.on(conf.eventName, function(err, callback){
    i++;
    console.log(i);
    if(!err){
      callback('Error', null);
    }
    if(isJsonString(err)){
      err = JSON.parse(err);
    }
    setInterval(function(){
      callback(null, responseData);
    }, conf.callbackTimeout);
  });
});

function isJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  };
  return true;
};
