const express = require('express');
const path = require('path');

const WEBSERVER_PORT = 3000;
const WEBSOCKET_PORT = 2048;

const webserver = express();
webserver.get('/', rootHtml);
webserver.listen(WEBSERVER_PORT, () => console.log(`Listening on ${WEBSERVER_PORT}`));

const { WebSocketServer } = require('ws');
const socketserver = new WebSocketServer({ port: WEBSOCKET_PORT });

socketserver.on('connection', ws => {
  console.log('New client connected.');
  ws.send('connection established');
  ws.on('close', () => console.log('Client disconnected.'));
  ws.on('message', data => {
    const size = socketserver.clients.size;
    console.log(`distributing message: ${socketserver.clients.size} ${ size === 1 ? 'time' : 'times' }`);
    socketserver.clients.forEach(client => {
      client.send(`${data}`);
    });
  });
  ws.on('error', () => console.log('websocket error'));
});

function rootHtml(request, response) {
  const options = {
    root: path.join(__dirname),
  };
  response.sendFile('ws-client.html', options);
}
