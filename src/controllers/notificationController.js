const amqp = require('amqplib/callback_api');
const Notification = require('../models/notification');
const User = require('../models/user');

// const createNotification = async (req, res) => {
//   const { userId, message } = req.body;

//   try {
//     const notification = new Notification({ userId, message });
//     await notification.save();

//     // Here, you would also push the notification to the message queue
//     // For now, we'll skip that step

//     res.status(201).json(notification);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Connect to RabbitMQ server
let channel = null;
amqp.connect(process.env.RABBITMQ_URI, (err, conn) => {
  if (err) {
    throw err;
  }
  conn.createChannel((err, ch) => {
    if (err) {
      throw err;
    }
    channel = ch;
    channel.assertQueue('notifications', { durable: true });
  });
});

const createNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    const notification = new Notification({ userId, message });
    await notification.save();

    // Push the notification to the queue
    channel.sendToQueue('notifications', Buffer.from(JSON.stringify(notification)), { persistent: true });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead
};
