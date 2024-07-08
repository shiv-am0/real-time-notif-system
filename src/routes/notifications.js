const express = require('express');
const {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead
} = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification for a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createNotification);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get a list of all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get details of a specific notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification details
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, getNotificationById);

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, markNotificationAsRead);

module.exports = router;
