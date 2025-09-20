// __tests__/socket.unit.test.js
const { registerSocketHandlers, onlineUsers } = require('../socketHandlers');

describe('Socket Handlers (unit tests)', () => {
  let io, socket;

  beforeEach(() => {
    handlers = {}; // reset each test
    onlineUsers.clear(); // reset state
    io = { to: jest.fn(() => io), emit: jest.fn() };
    socket = {
      on: jest.fn((event, handler) => {
        handlers[event] = handler; // store handlers by event name
      }),
      join: jest.fn(),
      leave: jest.fn(),
      rooms: new Set(),
    };
    registerSocketHandlers(io, socket);
  });

  test('join should add user and emit update', () => {
    handlers['join']('user1');
    expect(socket.join).toHaveBeenCalledWith('user1');
    expect(onlineUsers.has('user1')).toBe(true);
    expect(io.to).toHaveBeenCalledWith('user1');
    expect(io.emit).toHaveBeenCalledWith('online-users-updated', ['user1']);
  });

  test('send-new-message should emit to all chat users', () => {
    const message = {
      text: 'hi',
      chat: { users: [{ _id: 'u1' }, { _id: 'u2' }] },
    };
    handlers['send-new-message'](message);
    expect(io.to).toHaveBeenCalledWith('u1');
    expect(io.to).toHaveBeenCalledWith('u2');
    expect(io.emit).toHaveBeenCalledWith('new-message-received', message);
  });

  test('logout should remove user and broadcast update', () => {
    onlineUsers.add('user1');
    onlineUsers.add('user2');
    handlers['logout']('user1');
    expect(socket.leave).toHaveBeenCalledWith('user1');
    expect(onlineUsers.has('user1')).toBe(false);
    expect(io.emit).toHaveBeenCalledWith('online-users-updated', ['user2']);
  });
});
