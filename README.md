##Socket.io Stress Test Tool 

####This is a simple socket client and server tool allowing you to stress test a socket server. For example if you have a client connecting to a remote socket.io server simultaneously and with large amount of call (10K+), this tool allow you to get each callback time in ms.

###Setup Socket Client Instructions

1. **`npm install`**
2. Configure socket_client.conf

  ```javascript
{
      "clientIP": "localhost",                     //Setup your client server IP, no need to change
      "serverIP": "localhost",                     //Socket.io Server IP
      "serverPort": 7027,                          //Socket.io Server Port
      "reconnectAttempt": 3,                       //Socket reconnect attempt
      "reconnectDelay": 1000,                      //Reconnect intervel in milliseconds
      "numberOfCalls": 100,                        //How many call?
      "callDelay": 0,                              //Set delay in between calls
      "countdown": 3,                              //Countdown seconds, set to 0 to start the test immediately
      "countdownInterval": 1000,                   //Countdown per second, leave as is
      "eventName": "test-event",                   //Change to the exact event name
      "requestMessage": "{'message':'test'}",      //Request message
      "showResponse": true                         //Print response message (true / false)
}
```
3. Start test: **`node socket_client.js`**

###Setup Socket Server Instructions (Optional)

1. Configure socket_server.conf

  ```javascript
{
    "serverIP": "localhost",                        //Setup Socket.io Server IP
    "serverPort": 7027,                             //Server Port
    "callbackTimeout" : 30,                         //Timeout in response, set to 0 if no delay is needed
    "eventName": "test-event",                      //Set event name
    "responseMessage": "{'data':'Responded Data'}", //Response message
    "showResponse": true                            //Print response message (true / false)
 }
```
3. Start test: **`node socket_server.js`**
