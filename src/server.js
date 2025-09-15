const express = require('express');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Parche chat socket running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let onlineUsers = new Set();

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      if (!onlineUsers.has(userId)) {
        onlineUsers.add(userId);
      }
    }
    onlineUsers.forEach((user) => {
      io.to(user).emit('online-users-updated', Array.from(onlineUsers));
    });
  });

  socket.on('send-new-message', (message) => {
    message.chat.users.forEach((user) => {
      io.to(user._id).emit('new-message-received', message);
    });
  });

  socket.on('logout', (userId) => {
    socket.leave(userId);
    onlineUsers.delete(userId);
    onlineUsers.forEach((user) => {
      io.to(user).emit('online-users-updated', Array.from(onlineUsers));
    });
  });
});

app.get('/', (req, res) => {
  return res.send('Server is running');
});
