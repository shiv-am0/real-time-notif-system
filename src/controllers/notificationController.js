const amqp = require('amqplib/callback_api');
const Notification = require('../models/notification');
const User = require('../models/user');

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
    if(userId == req.user.id) {
      const notification = new Notification({ userId, message });
      await notification.save();

      // Push the notification to the queue
      channel.sendToQueue('notifications', Buffer.from(JSON.stringify(notification)), { persistent: true });

      res.status(201).json(notification);
    }
    else {
      res.status(401).json({ message: 'UserId does not match.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotifications = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Notification.countDocuments({ userId });
    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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
