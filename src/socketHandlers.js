let onlineUsers = new Set();

function registerSocketHandlers(io, socket) {
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
}

module.exports = { registerSocketHandlers, onlineUsers };
