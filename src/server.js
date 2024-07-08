const app = require('./app');
const http = require('http');
const { Server } = require("socket.io");
const amqp = require('amqplib/callback_api');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);
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

amqp.connect(process.env.RABBITMQ_URI, (err, conn) => {
  if (err) {
    throw err;
  }
  conn.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    const queue = 'notifications';

    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log(`Waiting for messages in ${queue}`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const notification = JSON.parse(msg.content.toString());

        try {
          // Process the notification
          console.log('Processing notification:', notification);

          // Broadcast notification to connected users
          io.emit('notification', notification);

          // Acknowledge the message as processed
          channel.ack(msg);
        } catch (err) {
          console.error('Error processing notification:', err);
          channel.nack(msg, false, true); // Requeue the message
        }
      }
    });
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { server, io };