const express = require('express');
const { Server } = require('socket.io');
const { registerSocketHandlers } = require('./socketHandlers');

const app = express();
const port = process.env.PORT || 8000;

// start express server
const server = app.listen(port, () => {
  console.log(`Parche chat socket running on port ${port}`);
});

// create socket.io instance
const io = new Server(server, {
  cors: { origin: '*' },
});

// attach socket event handlers
io.on('connection', (socket) => {
  registerSocketHandlers(io, socket);
});

// simple health check
app.get('/', (req, res) => {
  res.send('parche chat web socket is running');
});

module.exports = { app, server, io };
