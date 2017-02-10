const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.broadcast = function broadcast(newMessage) {
  wss.clients.forEach(function each(client) {
    if (client.readyState) {
      client.send(JSON.stringify(newMessage));
    }
  });
};

var userConnected = 0;

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

wss.on('connection', (ws) => {
  userConnected += 1;
  console.log(userConnected + ' Client connected');
  wss.broadcast({userOnline: userConnected});
  let userColor = getRandomColor();
  ws.on('message', function incoming(data, flags) {
    let newMessage = JSON.parse(data);
    newMessage.id = uuid.v1();
    newMessage.userColor = userColor;
    if (newMessage.type === "postMessage") {
      newMessage.type = "incomingMessage";
    } else if (newMessage.type === "postNotification") {
      newMessage.type = "incomingNotification";
    }
    wss.broadcast(newMessage);
  });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    userConnected -= 1;
    console.log(userConnected + ' Client connected');
    wss.broadcast({userOnline: userConnected});
  });
});