const amqp = require('amqplib/callback_api');
const { io } = require('../server');

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