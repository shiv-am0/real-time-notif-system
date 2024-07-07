const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// const io = socketIo(server);

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });

  socket.on('connect_error', (err) => {
    console.error('Connect error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { server, io };