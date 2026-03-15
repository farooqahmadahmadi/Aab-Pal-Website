// controllers/notificationsController.js
const Notifications = require("../models/Notifications");
const notificationService = require("../services/notificationService");

// GET all notifications for current user
exports.getUserNotifications = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const notifications = await notificationService.getUserNotifications(user_id);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
};

// GET notification by ID
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notifications.findByPk(req.params.id);
        if (!notification || notification.is_deleted) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notification", error });
    }
};

// CREATE notification → Admin only
exports.createNotification = async (req, res) => {
    try {
        const notification = await Notifications.create(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error creating notification", error });
    }
};

// UPDATE notification → Admin only
exports.updateNotification = async (req, res) => {
    try {
        const notification = await Notifications.findByPk(req.params.id);
        if (!notification || notification.is_deleted) {
            return res.status(404).json({ message: "Notification not found" });
        }
        await notification.update(req.body);
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error });
    }
};

// DELETE notification (soft delete) → Admin only
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notifications.findByPk(req.params.id);
        if (!notification || notification.is_deleted) {
            return res.status(404).json({ message: "Notification not found" });
        }
        await notification.update({ is_deleted: true });
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error });
    }
};