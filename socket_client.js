const fs = require('fs'),
      conf = JSON.parse(fs.readFileSync(__dirname+'/socket_client.conf','utf-8')),
      clientIP = conf.clientIP,
      serverIP = conf.serverIP,
      serverPort = conf.serverPort,
      socketClient = 'socket.io/node_modules/socket.io-client',
      maxReconnect = conf.reconnectAttempt || 3,
      connectDelay = conf.ReconnectDelay || 2000,
      numberOfCalls = conf.numberOfCalls;
      countdownInterval = conf.countdownInterval;
      delay = conf.callDelay;
      showResponse = conf.showResponse;

var globalreceiveCount = 0,
    reconnect = 0;

require('log-timestamp');
console.log('Client is running at IP: '+clientIP);
console.log('Start connecting Socket-io server: '+serverIP+':'+serverPort+'...');

var socket = require(socketClient)('http://'+ serverIP+':'+serverPort, { 'transports' : ['websocket'], reconnectAttempts: maxReconnect, reconnectionDelay: connectDelay});

socket.on('connect', function(){
  console.log('Connected with: '+serverIP+'\n Socket ID:',socket.id+'\n');
  startCountdown();
});

socket.on('connect_error', function(reason){
  console.log('ERROR: '+serverIP+' connect error. Reason:'+reason+'\n');
});

socket.on('connect_timeout', function(reason){
  console.log('ERROR: '+serverIP+' connect timeout. Reason:'+reason+'\n');
  exit();
});

socket.on('reconnecting', function(){
  if (reconnect < maxReconnect){
    reconnect++;
    console.log('ACTION: Reconnecting '+serverIP+'(attempt '+ reconnect +')\n');    
  } else if (reconnect == maxReconnect) {
    console.log('ERROR: '+serverIP+' max reconnect reached('+ reconnect +'), shutting down.\n');
    exit();
  };
});

socket.on('reconnect_error', function(reason){
  console.log('ERROR: '+serverIP+' reconnect error. Reason:'+reason+'\n');
});

socket.on('reconnect_failed', function(reason){
  console.log('ERROR: '+serverIP+' reconnect failed. Reason:'+reason+'\n');
  exit();
});

socket.on('disconnect', function(reason){
  console.log('ERROR: '+serverIP+' disconnected. Reason:'+reason+'\n');
});

var countdown = conf.countdown;
var i = countdown;

function startCountdown(){
  setTimeout(function(){
    console.log('Countdown',i);
    if (i != 0 && i > 0) { 
      startCountdown();
      i--;  
    };  
    if (i == 0) {
      console.log('Starting stress test',numberOfCalls);   
      console.log('Socket calls at',delay+'ms delay.');   
      startLoop();      
    };
  }, countdownInterval);
};

function startLoop(){
  var query = conf.requestMessage;
  console.log('Event Name:',conf.eventName);
  console.log('Request Message:',conf.requestMessage);
  
  loop();

  function loop(){
    setTimeout(function () {
      calling();
      i++;                 
      if (i < numberOfCalls) {        
        loop();         
      };              
    }, delay);
    if(i == numberOfCalls){
      setTimeout(function(){
        
      }, 2000);
    }
  };

  function calling(){
    if(socket){
      var start = new Date();
      socket.emit(conf.eventName, JSON.stringify(query), function(err, data){
        if(!err && !data){
          console.log('No response from server.');
        };
        if(err){
          globalreceiveCount++;
          console.log('Received error: '+err+', Count: '+globalreceiveCount);
        };
        if(data){
          var end = new Date();
          var duration = end - start;
          globalreceiveCount++;
          if(showResponse == false){
            console.log('#'+globalreceiveCount+' Received: Data ('+duration+'ms)');
          } else if (showResponse == true) {
            console.log('#'+globalreceiveCount+' Received:',JSON.stringify(data)+' ('+duration+'ms)');            
          };
          if(globalreceiveCount == numberOfCalls){
            exit();
          };
        };
      });
    };
  };
};

function exit(){
  console.log('Ending... exiting Node.')
  process.exit(1);
};