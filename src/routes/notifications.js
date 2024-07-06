const express = require('express');
const {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead
} = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createNotification);
router.get('/', authMiddleware, getNotifications);
router.get('/:id', authMiddleware, getNotificationById);
router.put('/:id', authMiddleware, markNotificationAsRead);

module.exports = router;
